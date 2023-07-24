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
import { OAuthStartRequest, OAuthState, encodeState } from '../../lib/oauth';
import { AuthResolverContext } from '../types';
import { PinnipedAuthProvider, PinnipedOptions } from './provider';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { ClientMetadata, IssuerMetadata } from 'openid-client';
import express from 'express';
import nJwt from 'njwt';
import { UnsecuredJWT } from 'jose';

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
    jwks_uri: 'https://pinniped.test/pf/JWKS',
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
    resolverContext: {} as AuthResolverContext,
    tokenSignedResponseAlg: 'none',
    authHandler: async () => ({
      profile: {},
    }),
  };

  // const idToken: string = nJwt
  //   .create(
  //     {
  //       iss: 'https://pinniped.test',
  //       sub: 'test',
  //       aud: clientMetadata.clientId,
  //       claims: {
  //         given_name: 'Givenname',
  //         family_name: 'Familyname',
  //         email: 'user@example.com',
  //       },
  //     },
  //     Buffer.from('signing key'),
  //   )
  //   .compact();

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

  it('hits the metadata url', async () => {
    const handler = jest.fn((_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.set('Content-Type', 'application/json'),
        ctx.json(issuerMetadata),
      );
    });

    worker.use(
      rest.get(
        'https://federationDomain.test/.well-known/openid-configuration',
        handler,
      ),
    );

    provider = new PinnipedAuthProvider(clientMetadata);

    const { strategy } = (await (provider as any).implementation) as any as {
      strategy: {
        _client: ClientMetadata;
        _issuer: IssuerMetadata;
      };
    };

    expect(handler).toHaveBeenCalledTimes(1);
    expect(strategy._client.client_id).toBe(clientMetadata.clientId);
    expect(strategy._issuer.token_endpoint).toBe(issuerMetadata.token_endpoint);
  });

  describe('#start', () => {
    it('redirects to authorization endpoint returned from federationDomain config value', async () => {
      const startResponse = await provider.start(startRequest);
      const url = new URL(startResponse.url);

      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('pinniped.test');
      expect(url.pathname).toBe('/oauth2/authorize');
    });

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

    it('fails when request has no session', async () => {
      return expect(
        provider.start({
          method: 'GET',
          url: 'test',
        } as unknown as OAuthStartRequest),
      ).rejects.toThrow('authentication requires session support');
    });
    // false passing test: passes because we compare two falsy values undefined and undefined
    // need to add the logic that makes this true
    it.skip('adds session ID handle to state param', async () => {
      const startResponse = await provider.start(startRequest);
      // stateParam is empty string
      const stateParam = new URL(startResponse.url).searchParams.get('state');
      const state = Object.fromEntries(
        new URLSearchParams(Buffer.from(stateParam!, 'hex').toString('utf-8')),
      );
      // handle is currently undefined
      const { handle } = fakeSession['oidc:pinniped.test'].state;
      console.log(`This is the param:`, stateParam);
      // state.handle = undefined
      expect(state.handle ?? '').toEqual(handle);
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
        url: `https://test?code=authorization_code&state=${testState}`,
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

    it('responds with ID token', async () => {
      const { response } = await provider.handler(handlerRequest);
      expect(response.providerInfo.idToken).toBe(idToken);
    });

    it.only('decodes profile from ID token', async () => {
      const { response } = await provider.handler(handlerRequest);

      expect(response.profile).toStrictEqual({
        displayName: 'Givenname Familyname',
        email: 'user@example.com',
      });
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
  });
});
