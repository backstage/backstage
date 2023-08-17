/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { OAuthStartRequest, encodeState, readState } from '../../lib/oauth';
import { PinnipedAuthProvider, PinnipedOptions } from './provider';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import express from 'express';
import { UnsecuredJWT } from 'jose';
import { OAuthState } from '../../lib/oauth';
import { EntityAzurePipelinesContent } from '@backstage/plugin-azure-devops';

describe('PinnipedAuthProvider', () => {
  let provider: PinnipedAuthProvider;
  let startRequest: OAuthStartRequest;
  let fakeSession: Record<string, any>;

  const worker = setupServer();
  setupRequestMockHandlers(worker);

  const issuerMetadata = {
    issuer: 'https://pinniped.test',
    authorization_endpoint: 'https://pinniped.test/oauth2/authorize',
    token_endpoint: 'https://pinniped.test/oauth2/token',
    revocation_endpoint: 'https://pinniped.test/oauth2/revoke_token',
    userinfo_endpoint: 'https://pinniped.test/idp/userinfo.openid',
    introspection_endpoint: 'https://pinniped.test/introspect.oauth2',
    jwks_uri: 'https://pinniped.test/jwks.json',
    scopes_supported: [
      'openid',
      'offline_access',
      'pinniped:request-audience',
      'username',
      'groups',
    ],
    claims_supported: ['email', 'username', 'groups', 'additionalClaims'],
    response_types_supported: ['code'],
    id_token_signing_alg_values_supported: ['RS256', 'RS512', 'HS256'],
    token_endpoint_auth_signing_alg_values_supported: [
      'RS256',
      'RS512',
      'HS256',
    ],
    request_object_signing_alg_values_supported: ['RS256', 'RS512', 'HS256'],
  };

  const clientMetadata: PinnipedOptions = {
    federationDomain: 'https://federationDomain.test',
    clientId: 'clientId.test',
    clientSecret: 'secret.test',
    callbackUrl: 'https://federationDomain.test/callback',
    tokenSignedResponseAlg: 'none',
  };

  const sub = 'test';
  const iss = 'https://pinniped.test';
  const iat = Date.now();
  const aud = clientMetadata.clientId;
  const exp = Date.now() + 10000;
  const idToken = new UnsecuredJWT({ iss, sub, aud, iat, exp })
    .setIssuer(iss)
    .setAudience(aud)
    .setSubject(sub)
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .encode();
  const oauthState: OAuthState = {
    nonce: 'nonce',
    env: 'env',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    worker.use(
      rest.post('https://pinniped.test/oauth2/token', (req, res, ctx) =>
        res(
          req.headers.get('Authorization')
            ? ctx.json({
                access_token: 'accessToken',
                refresh_token: 'refreshToken',
                id_token: idToken,
              })
            : ctx.status(401),
        ),
      ),
    );
    fakeSession = {};
    startRequest = {
      session: fakeSession,
      method: 'GET',
      url: 'test',
      state: oauthState,
    } as unknown as OAuthStartRequest;
    const handler = jest.fn((_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.set('Content-Type', 'application/json'),
        ctx.json(issuerMetadata),
      );
    });
    worker.use(
      rest.all(
        'https://federationDomain.test/.well-known/openid-configuration',
        handler,
      ),
    );
    provider = new PinnipedAuthProvider(clientMetadata);
  });

  describe('#start', () => {
    it('redirects to authorization endpoint returned from OIDC metadata endpoint', async () => {
      const startResponse = await provider.start(startRequest);
      const url = new URL(startResponse.url);

      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('pinniped.test');
      expect(url.pathname).toBe('/oauth2/authorize');
    });

    it('initiates an authorization code grant', async () => {
      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('response_type')).toBe('code');
    });

    it('passes default audience as a scope parameter in the redirect url if not defined in the request', async () => {
      const startResponse = await provider.start(startRequest)
      const { searchParams } = new URL(startResponse.url)

      expect(searchParams.get('scope')).toBe('pinniped:request-audience username')
    })

    it('passes audience as a scope parameter in the redirect url when defined in the request', async () => {
      startRequest.scope = 'pinniped:request-audience testusername'
      const startResponse = await provider.start(startRequest)
      const { searchParams } = new URL(startResponse.url)

      expect(searchParams.get('scope')).toBe('pinniped:request-audience testusername')
    })

    it('passes client ID from config', async () => {
      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('client_id')).toBe('clientId.test');
    });

    it('passes callback URL', async () => {
      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('redirect_uri')).toBe(
        'https://federationDomain.test/callback',
      );
    });

    it('generates PKCE challenge', async () => {
      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('code_challenge_method')).toBe('S256');
      expect(searchParams.get('code_challenge')).not.toBeNull();
    });

    it('stores PKCE verifier in session', async () => {
      await provider.start(startRequest);
      expect(fakeSession['oidc:pinniped.test'].code_verifier).toBeDefined();
    });

    it('requests sufficient scopes for token exchange', async () => {
      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);
      const scopes = searchParams.get('scope')?.split(' ') ?? [];

      expect(scopes).toEqual(
        expect.arrayContaining(['pinniped:request-audience', 'username']),
      );
    });

    it('fails when request has no session', async () => {
      return expect(
        provider.start({
          method: 'GET',
          url: 'test',
        } as unknown as OAuthStartRequest),
      ).rejects.toThrow('authentication requires session support');
    });

    it('encodes OAuth state in query param', async () => {
      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);
      const stateParam = searchParams.get('state');
      const decodedState = readState(stateParam!);

      expect(decodedState).toMatchObject(oauthState);
    });
  });

  describe('#handler', () => {
    let handlerRequest: express.Request;

    beforeEach(() => {
      provider = new PinnipedAuthProvider(clientMetadata);

      const testState = encodeState({
        nonce: 'nonce',
        env: 'development',
        origin: 'undefined',
      });

      handlerRequest = {
        method: 'GET',
        url: `https://test?code=authorization_code&state=${testState}&scope=pinniped:request-audience username`,
        session: {
          'oidc:pinniped.test': {
            state: testState,
          },
        },
      } as unknown as express.Request;

      worker.use(
        rest.post('https://pinniped.test/oauth2/token', (req, res, ctx) =>
          res(
            req.headers.get('Authorization')
              ? ctx.json({
                  access_token: 'accessToken',
                  refresh_token: 'refreshToken',
                  id_token: idToken,
                })
              : ctx.status(401),
          ),
        ),
        rest.get(
          'https://pinniped.test/idp/userinfo.openid',
          (_req, res, ctx) =>
            res(
              ctx.json({
                iss: 'https://pinniped.test',
                sub: 'test',
                aud: clientMetadata.clientId,
                claims: {
                  given_name: 'Givenname',
                  family_name: 'Familyname',
                  email: 'user@example.com',
                },
              }),
              ctx.status(200),
            ),
        ),
      );
    });

    it('fails when request has no state', async () => {
      return expect(
        provider.handler({
          method: 'GET',
          url: `https://test?code=authorization_code}`,
          session: {
            ['oidc:pinniped.test']: {
              state: { handle: 'sessionid', code_verifier: 'foo' },
            },
          },
        } as unknown as express.Request),
      ).rejects.toThrow(
        'Authentication rejected, state missing from the response',
      );
    });
    
    it('exchanges authorization code for a valid access_token', async() => {
      const handlerResponse = await provider.handler(handlerRequest);
      const accessToken = handlerResponse.response.providerInfo.accessToken
      
      expect(accessToken).toEqual('accessToken')
    })

    it('responds with the correct audience as scope', async() => {
      const handlerResponse = await provider.handler(handlerRequest);
      const audience = handlerResponse.response.providerInfo.scope
      
      expect(audience).toEqual('pinniped:request-audience username')
    })

    //if no valid key is in the jwks array or even an unsigned jwt
    //have pinniped reject your clientid and secret possibly as a unit test
  });
});
