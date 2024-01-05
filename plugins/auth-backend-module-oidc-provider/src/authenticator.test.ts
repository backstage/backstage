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
import {
  OAuthAuthenticatorAuthenticateInput,
  OAuthAuthenticatorRefreshInput,
  OAuthAuthenticatorStartInput,
  OAuthState,
  decodeOAuthState,
  encodeOAuthState,
} from '@backstage/plugin-auth-node';
import { oidcAuthenticator } from './authenticator';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { JWK, SignJWT, exportJWK, generateKeyPair } from 'jose';
import { rest } from 'msw';
import express from 'express';

describe('oidcAuthenticator', () => {
  let implementation: any;
  let oauthState: OAuthState;
  let idToken: string;
  let publicKey: JWK;

  const mswServer = setupServer();
  setupRequestMockHandlers(mswServer);

  const issuerMetadata = {
    issuer: 'https://oidc.test',
    authorization_endpoint: 'https://oidc.test/oauth2/authorize',
    token_endpoint: 'https://oidc.test/oauth2/token',
    revocation_endpoint: 'https://oidc.test/oauth2/revoke_token',
    userinfo_endpoint: 'https://oidc.test/idp/userinfo.openid',
    introspection_endpoint: 'https://oidc.test/introspect.oauth2',
    jwks_uri: 'https://oidc.test/jwks.json',
    scopes_supported: [
      'openid',
      'offline_access',
      'oidc:request-audience',
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

  beforeAll(async () => {
    const keyPair = await generateKeyPair('RS256');
    const privateKey = await exportJWK(keyPair.privateKey);
    publicKey = await exportJWK(keyPair.publicKey);
    publicKey.alg = privateKey.alg = 'RS256';

    idToken = await new SignJWT({
      sub: 'test',
      iss: 'https://oidc.test',
      iat: Date.now(),
      aud: 'clientId',
      exp: Date.now() + 10000,
    })
      .setProtectedHeader({ alg: privateKey.alg, kid: privateKey.kid })
      .sign(keyPair.privateKey);
  });

  beforeEach(() => {
    mswServer.use(
      rest.get(
        'https://oidc.test/.well-known/openid-configuration',
        (_req, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(issuerMetadata),
          ),
      ),
      rest.get('https://oidc.test/jwks.json', async (_req, res, ctx) =>
        res(ctx.status(200), ctx.json({ keys: [{ ...publicKey }] })),
      ),
      rest.post('https://oidc.test/oauth2/token', async (req, res, ctx) => {
        return res(
          req.headers.get('Authorization')
            ? ctx.json({
                access_token: 'accessToken',
                id_token: idToken,
                refresh_token: 'refreshToken',
                scope: 'testScope',
                expires_in: 3600,
              })
            : ctx.status(401),
        );
      }),
      rest.get(
        'https://oidc.test/idp/userinfo.openid',
        async (_req, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              sub: 'test',
              name: 'Alice Adams',
              given_name: 'Alice',
              family_name: 'Adams',
              email: 'alice@test.com',
              picture: 'http://testPictureUrl/photo.jpg',
            }),
          ),
      ),
    );

    implementation = oidcAuthenticator.initialize({
      callbackUrl: 'https://backstage.test/callback',
      config: new ConfigReader({
        metadataUrl: 'https://oidc.test/.well-known/openid-configuration',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
      }),
    });

    oauthState = {
      nonce: 'nonce',
      env: 'env',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#start', () => {
    let fakeSession: Record<string, any>;
    let startRequest: OAuthAuthenticatorStartInput;

    beforeEach(() => {
      fakeSession = {};
      startRequest = {
        state: encodeOAuthState(oauthState),
        req: {
          method: 'GET',
          url: 'test',
          session: fakeSession,
        },
      } as unknown as OAuthAuthenticatorStartInput;
    });

    it('redirects to authorization endpoint returned from OIDC metadata endpoint', async () => {
      const startResponse = await oidcAuthenticator.start(
        startRequest,
        implementation,
      );
      const url = new URL(startResponse.url);

      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('oidc.test');
      expect(url.pathname).toBe('/oauth2/authorize');
    });

    it('initiates authorization code grant', async () => {
      const startResponse = await oidcAuthenticator.start(
        startRequest,
        implementation,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('response_type')).toBe('code');
    });

    it('passes client ID from config', async () => {
      const startResponse = await oidcAuthenticator.start(
        startRequest,
        implementation,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('client_id')).toBe('clientId');
    });

    it('passes callback URL from config', async () => {
      const startResponse = await oidcAuthenticator.start(
        startRequest,
        implementation,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('redirect_uri')).toBe(
        'https://backstage.test/callback',
      );
    });

    it('generates PKCE challenge', async () => {
      const startResponse = await oidcAuthenticator.start(
        startRequest,
        implementation,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('code_challenge_method')).toBe('S256');
      expect(searchParams.get('code_challenge')).not.toBeNull();
    });

    it('stores PKCE verifier in session', async () => {
      await oidcAuthenticator.start(startRequest, implementation);
      expect(fakeSession['oidc:oidc.test'].code_verifier).toBeDefined();
    });

    it('requests default scopes if none are provided in config', async () => {
      const startResponse = await oidcAuthenticator.start(
        startRequest,
        implementation,
      );
      const { searchParams } = new URL(startResponse.url);
      const scopes = searchParams.get('scope')?.split(' ') ?? [];

      expect(scopes).toEqual(
        expect.arrayContaining(['openid', 'profile', 'email']),
      );
    });

    it('encodes OAuth state in query param', async () => {
      const startResponse = await oidcAuthenticator.start(
        startRequest,
        implementation,
      );
      const { searchParams } = new URL(startResponse.url);
      const stateParam = searchParams.get('state');
      const decodedState = decodeOAuthState(stateParam!);

      expect(decodedState).toMatchObject(oauthState);
    });

    it('fails when request has no session', async () => {
      return expect(
        oidcAuthenticator.start(
          {
            state: encodeOAuthState(oauthState),
            req: {
              method: 'GET',
              url: 'test',
            },
          } as unknown as OAuthAuthenticatorStartInput,
          implementation,
        ),
      ).rejects.toThrow('authentication requires session support');
    });
  });

  describe('#authenticate', () => {
    let handlerRequest: OAuthAuthenticatorAuthenticateInput;

    beforeEach(() => {
      handlerRequest = {
        req: {
          method: 'GET',
          url: `https://test?code=authorization_code&state=${encodeOAuthState(
            oauthState,
          )}`,
          session: {
            'oidc:oidc.test': {
              state: encodeOAuthState(oauthState),
            },
          },
        } as unknown as express.Request,
      };
    });

    it('exchanges authorization code for access token', async () => {
      const authenticatorResult = await oidcAuthenticator.authenticate(
        handlerRequest,
        implementation,
      );
      const accessToken = authenticatorResult.session.accessToken;

      expect(accessToken).toEqual('accessToken');
    });

    it('exchanges authorization code for refresh token', async () => {
      const authenticatorResult = await oidcAuthenticator.authenticate(
        handlerRequest,
        implementation,
      );
      const refreshToken = authenticatorResult.session.refreshToken;

      expect(refreshToken).toEqual('refreshToken');
    });

    it('returns granted scope', async () => {
      const authenticatorResult = await oidcAuthenticator.authenticate(
        handlerRequest,
        implementation,
      );
      const responseScope = authenticatorResult.session.scope;

      expect(responseScope).toEqual('testScope');
    });

    it('returns a default session.tokentype field', async () => {
      const authenticatorResult = await oidcAuthenticator.authenticate(
        handlerRequest,
        implementation,
      );
      const tokenType = authenticatorResult.session.tokenType;

      expect(tokenType).toEqual('bearer');
    });

    it('returns picture and email', async () => {
      const authenticatorResult = await oidcAuthenticator.authenticate(
        handlerRequest,
        implementation,
      );

      expect(authenticatorResult).toMatchObject({
        fullProfile: {
          userinfo: {
            email: 'alice@test.com',
            picture: 'http://testPictureUrl/photo.jpg',
            name: 'Alice Adams',
          },
        },
      });
    });

    it('returns idToken', async () => {
      const authenticatorResult = await oidcAuthenticator.authenticate(
        handlerRequest,
        implementation,
      );

      expect(authenticatorResult).toMatchObject({
        session: {
          idToken,
        },
      });
      expect(
        Math.abs(authenticatorResult.session.expiresInSeconds! - 3600),
      ).toBeLessThan(5);
    });

    it('fails without authorization code', async () => {
      handlerRequest.req.url = 'https://test.com';
      return expect(
        oidcAuthenticator.authenticate(handlerRequest, implementation),
      ).rejects.toThrow('Unexpected redirect');
    });

    it('fails without oauth state', async () => {
      return expect(
        oidcAuthenticator.authenticate(
          {
            req: {
              method: 'GET',
              url: `https://test?code=authorization_code}`,
              session: {
                ['oidc:pinniped.test']: {
                  state: { handle: 'sessionid', code_verifier: 'foo' },
                },
              },
            } as unknown as express.Request,
          },
          implementation,
        ),
      ).rejects.toThrow(
        'Authentication failed, did not find expected authorization request details in session, req.session["oidc:oidc.test"] is undefined',
      );
    });

    it('fails when request has no session', async () => {
      return expect(
        oidcAuthenticator.authenticate(
          {
            req: {
              method: 'GET',
              url: 'https://test.com',
            } as unknown as express.Request,
          },
          implementation,
        ),
      ).rejects.toThrow('authentication requires session support');
    });
  });

  describe('#refresh', () => {
    let refreshRequest: OAuthAuthenticatorRefreshInput;

    beforeEach(() => {
      refreshRequest = {
        scope: '',
        refreshToken: 'otherRefreshToken',
        req: {} as express.Request,
      };
    });

    it('gets new refresh token', async () => {
      const refreshResponse = await oidcAuthenticator.refresh(
        refreshRequest,
        implementation,
      );

      expect(refreshResponse.session.refreshToken).toBe('refreshToken');
    });

    it('gets access token', async () => {
      const refreshResponse = await oidcAuthenticator.refresh(
        refreshRequest,
        implementation,
      );

      expect(refreshResponse.session.accessToken).toBe('accessToken');
    });

    it('gets id token', async () => {
      const refreshResponse = await oidcAuthenticator.refresh(
        refreshRequest,
        implementation,
      );

      expect(refreshResponse.session.idToken).toBe(idToken);
    });
  });
});
