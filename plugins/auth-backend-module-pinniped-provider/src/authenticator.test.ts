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
import { pinnipedAuthenticator } from './authenticator';
import { setupServer } from 'msw/node';
import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { JWK, SignJWT, exportJWK, generateKeyPair } from 'jose';
import { rest } from 'msw';
import express from 'express';
import { DateTime } from 'luxon';

describe('pinnipedAuthenticator', () => {
  let authCtx: any;
  let oauthState: OAuthState;
  let idToken: string;
  let publicKey: JWK;

  const mswServer = setupServer();
  registerMswTestHooks(mswServer);

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

  const clusterScopedIdToken = 'dummy-token';

  beforeAll(async () => {
    const keyPair = await generateKeyPair('ES256');
    const privateKey = await exportJWK(keyPair.privateKey);
    publicKey = await exportJWK(keyPair.publicKey);
    publicKey.alg = privateKey.alg = 'ES256';

    idToken = await new SignJWT({
      sub: 'test',
      iss: 'https://pinniped.test',
      iat: Date.now(),
      aud: 'clientId',
      exp: Date.now() + 10000,
    })
      .setProtectedHeader({ alg: privateKey.alg, kid: privateKey.kid })
      .sign(keyPair.privateKey);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    mswServer.use(
      rest.get(
        'https://federationDomain.test/.well-known/openid-configuration',
        (_req, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(issuerMetadata),
          ),
      ),
      rest.get('https://pinniped.test/jwks.json', async (_req, res, ctx) =>
        res(ctx.status(200), ctx.json({ keys: [{ ...publicKey }] })),
      ),
      rest.post('https://pinniped.test/oauth2/token', async (req, res, ctx) => {
        const formBody = new URLSearchParams(await req.text());
        const isGrantTypeTokenExchange =
          formBody.get('grant_type') ===
          'urn:ietf:params:oauth:grant-type:token-exchange';
        const hasValidTokenExchangeParams =
          formBody.get('subject_token') === 'accessToken' &&
          formBody.get('audience') === 'test_cluster' &&
          formBody.get('subject_token_type') ===
            'urn:ietf:params:oauth:token-type:access_token' &&
          formBody.get('requested_token_type') ===
            'urn:ietf:params:oauth:token-type:jwt';

        return res(
          req.headers.get('Authorization') &&
            (!isGrantTypeTokenExchange || hasValidTokenExchangeParams)
            ? ctx.json({
                access_token: isGrantTypeTokenExchange
                  ? clusterScopedIdToken
                  : 'accessToken',
                refresh_token: 'refreshToken',
                ...(!isGrantTypeTokenExchange && { id_token: idToken }),
                scope: 'testScope',
              })
            : ctx.status(401),
        );
      }),
    );

    authCtx = pinnipedAuthenticator.initialize({
      callbackUrl: 'https://backstage.test/callback',
      config: new ConfigReader({
        federationDomain: 'https://federationDomain.test',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
      }),
    });

    oauthState = {
      nonce: 'nonce',
      env: 'env',
    };
  });

  describe('#initialize', () => {
    it('always returns a PinnipedStrategyCache', async () => {
      const { providerStrategy, client } = await authCtx.getStrategy();

      expect(providerStrategy).toBeDefined();
      expect(client.issuer.authorization_endpoint).toMatch(
        'https://pinniped.test/oauth2/authorize',
      );
    });
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
      const startResponse = await pinnipedAuthenticator.start(
        startRequest,
        authCtx,
      );
      const url = new URL(startResponse.url);

      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('pinniped.test');
      expect(url.pathname).toBe('/oauth2/authorize');
    });

    it('initiates authorization code grant', async () => {
      const startResponse = await pinnipedAuthenticator.start(
        startRequest,
        authCtx,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('response_type')).toBe('code');
    });

    it('persists audience parameter in oauth state', async () => {
      startRequest.req.query = { audience: 'test-cluster' };
      const startResponse = await pinnipedAuthenticator.start(
        startRequest,
        authCtx,
      );
      const { searchParams } = new URL(startResponse.url);
      const stateParam = searchParams.get('state');
      const decodedState = decodeOAuthState(stateParam!);

      expect(decodedState).toMatchObject({
        nonce: 'nonce',
        env: 'env',
        audience: 'test-cluster',
      });
    });

    it('passes client ID from config', async () => {
      const startResponse = await pinnipedAuthenticator.start(
        startRequest,
        authCtx,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('client_id')).toBe('clientId');
    });

    it('passes callback URL from config', async () => {
      const startResponse = await pinnipedAuthenticator.start(
        startRequest,
        authCtx,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('redirect_uri')).toBe(
        'https://backstage.test/callback',
      );
    });

    it('generates PKCE challenge', async () => {
      const startResponse = await pinnipedAuthenticator.start(
        startRequest,
        authCtx,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('code_challenge_method')).toBe('S256');
      expect(searchParams.get('code_challenge')).not.toBeNull();
    });

    it('stores PKCE verifier in session', async () => {
      await pinnipedAuthenticator.start(startRequest, authCtx);
      expect(fakeSession['oidc:pinniped.test'].code_verifier).toBeDefined();
    });

    it('forwards scopes for token exchange', async () => {
      const startResponse = await pinnipedAuthenticator.start(
        { ...startRequest, scope: 'openid username' },
        authCtx,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('scope')).toBe('openid username');
    });

    it('encodes OAuth state in query param', async () => {
      const startResponse = await pinnipedAuthenticator.start(
        startRequest,
        authCtx,
      );
      const { searchParams } = new URL(startResponse.url);
      const stateParam = searchParams.get('state');
      const decodedState = decodeOAuthState(stateParam!);

      expect(decodedState).toMatchObject(oauthState);
    });

    it('fails when request has no session', async () => {
      return expect(
        pinnipedAuthenticator.start(
          {
            state: encodeOAuthState(oauthState),
            req: {
              method: 'GET',
              url: 'test',
            },
          } as unknown as OAuthAuthenticatorStartInput,
          authCtx,
        ),
      ).rejects.toThrow('authentication requires session support');
    });

    it('refreshes oidc metadata after a failed fetch', async () => {
      mswServer.use(
        rest.get(
          'https://federationDomain.test/.well-known/openid-configuration',
          (_req, res, _ctx) => res.networkError('Timeout'),
        ),
      );

      const authCtxCreatedWhileSupervisorUnavailable =
        pinnipedAuthenticator.initialize({
          callbackUrl: 'https://backstage.test/callback',
          config: new ConfigReader({
            federationDomain: 'https://federationDomain.test',
            clientId: 'clientId',
            clientSecret: 'clientSecret',
          }),
        });

      mswServer.use(
        rest.get(
          'https://federationDomain.test/.well-known/openid-configuration',
          (_req, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(issuerMetadata),
            ),
        ),
      );

      const response = await pinnipedAuthenticator.start(
        startRequest,
        authCtxCreatedWhileSupervisorUnavailable,
      );

      expect(response.url).toMatch('https://pinniped.test/oauth2/authorize');
    });

    it('caches oidc metadata after a success', async () => {
      // we start with 1 because the supervisor was called once already when we initialize.
      let supervisorCalls: number = 1;

      mswServer.use(
        rest.get(
          'https://federationDomain.test/.well-known/openid-configuration',
          (_req, res, ctx) => {
            supervisorCalls += 1;
            return res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(issuerMetadata),
            );
          },
        ),
      );

      await pinnipedAuthenticator.start(startRequest, authCtx);
      await pinnipedAuthenticator.start(startRequest, authCtx);

      expect(supervisorCalls).toEqual(1);
    });

    it('refreshes oidc metadata when current one in cache expires', async () => {
      // we start with 1 because the supervisor was called once already when we initialize.
      let supervisorCalls: number = 1;
      const fixedTime = DateTime.local();
      jest.spyOn(DateTime, 'local').mockImplementation(() => fixedTime);

      mswServer.use(
        rest.get(
          'https://federationDomain.test/.well-known/openid-configuration',
          (_req, res, ctx) => {
            supervisorCalls += 1;
            return res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(issuerMetadata),
            );
          },
        ),
      );

      await pinnipedAuthenticator.start(startRequest, authCtx);

      jest
        .spyOn(DateTime, 'local')
        .mockImplementation(() => fixedTime.plus({ seconds: 60000 }));

      await pinnipedAuthenticator.start(startRequest, authCtx);

      expect(supervisorCalls).toEqual(2);
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
            'oidc:pinniped.test': {
              state: encodeOAuthState(oauthState),
            },
          },
        } as unknown as express.Request,
      };
    });

    it('exchanges authorization code for access token', async () => {
      const handlerResponse = await pinnipedAuthenticator.authenticate(
        handlerRequest,
        authCtx,
      );
      const accessToken = handlerResponse.session.accessToken;

      expect(accessToken).toEqual('accessToken');
    });

    it('exchanges authorization code for refresh token', async () => {
      const handlerResponse = await pinnipedAuthenticator.authenticate(
        handlerRequest,
        authCtx,
      );
      const refreshToken = handlerResponse.session.refreshToken;

      expect(refreshToken).toEqual('refreshToken');
    });

    it('returns granted scope', async () => {
      const handlerResponse = await pinnipedAuthenticator.authenticate(
        handlerRequest,
        authCtx,
      );
      const responseScope = handlerResponse.session.scope;

      expect(responseScope).toEqual('testScope');
    });

    it('returns cluster-scoped ID token when audience is specified', async () => {
      oauthState.audience = 'test_cluster';
      handlerRequest = {
        req: {
          method: 'GET',
          url: `https://test?code=authorization_code&state=${encodeOAuthState(
            oauthState,
          )}`,
          session: {
            'oidc:pinniped.test': {
              state: encodeOAuthState(oauthState),
            },
          },
        } as unknown as express.Request,
      };

      const handlerResponse = await pinnipedAuthenticator.authenticate(
        handlerRequest,
        authCtx,
      );

      expect(handlerResponse.session.idToken).toEqual(clusterScopedIdToken);
    });

    it('fails on network error during token exchange', async () => {
      mswServer.use(
        rest.post(
          'https://pinniped.test/oauth2/token',
          async (req, res, ctx) => {
            const formBody = new URLSearchParams(await req.text());
            const isGrantTypeTokenExchange =
              formBody.get('grant_type') ===
              'urn:ietf:params:oauth:grant-type:token-exchange';
            const hasValidTokenExchangeParams =
              formBody.get('subject_token') === 'accessToken' &&
              formBody.get('audience') === 'test_cluster' &&
              formBody.get('subject_token_type') ===
                'urn:ietf:params:oauth:token-type:access_token' &&
              formBody.get('requested_token_type') ===
                'urn:ietf:params:oauth:token-type:jwt';

            mswServer.use(
              rest.post(
                'https://pinniped.test/oauth2/token',
                async (_req, response, _ctx) =>
                  response.networkError('Connection timed out'),
              ),
            );

            return res(
              req.headers.get('Authorization') &&
                (!isGrantTypeTokenExchange || hasValidTokenExchangeParams)
                ? ctx.json({
                    access_token: isGrantTypeTokenExchange
                      ? clusterScopedIdToken
                      : 'accessToken',
                    refresh_token: 'refreshToken',
                    ...(!isGrantTypeTokenExchange && { id_token: idToken }),
                    scope: 'testScope',
                  })
                : ctx.status(401),
            );
          },
        ),
      );

      oauthState.audience = 'test_cluster';
      handlerRequest = {
        req: {
          method: 'GET',
          url: `https://test?code=authorization_code&state=${encodeOAuthState(
            oauthState,
          )}`,
          session: {
            'oidc:pinniped.test': {
              state: encodeOAuthState(oauthState),
            },
          },
        } as unknown as express.Request,
      };

      await expect(
        pinnipedAuthenticator.authenticate(handlerRequest, authCtx),
      ).rejects.toThrow(
        `Failed to get cluster specific ID token for "test_cluster": Error: RFC8693 token exchange failed with error: NetworkError: Connection timed out`,
      );
    });

    it('fails without authorization code', async () => {
      handlerRequest.req.url = 'https://test.com';
      return expect(
        pinnipedAuthenticator.authenticate(handlerRequest, authCtx),
      ).rejects.toThrow('Unexpected redirect');
    });

    it('fails without oauth state', async () => {
      return expect(
        pinnipedAuthenticator.authenticate(
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
          authCtx,
        ),
      ).rejects.toThrow(
        'Authentication rejected, state missing from the response',
      );
    });

    it('fails when request has no session', async () => {
      return expect(
        pinnipedAuthenticator.authenticate(
          {
            req: {
              method: 'GET',
              url: 'https://test.com',
            } as unknown as express.Request,
          },
          authCtx,
        ),
      ).rejects.toThrow('authentication requires session support');
    });

    it('refreshes oidc metadata after a failed fetch', async () => {
      mswServer.use(
        rest.get(
          'https://federationDomain.test/.well-known/openid-configuration',
          (_req, res, _ctx) => res.networkError('Timeout'),
        ),
      );

      const authCtxCreatedWhileSupervisorUnavailable =
        pinnipedAuthenticator.initialize({
          callbackUrl: 'https://backstage.test/callback',
          config: new ConfigReader({
            federationDomain: 'https://federationDomain.test',
            clientId: 'clientId',
            clientSecret: 'clientSecret',
          }),
        });

      mswServer.use(
        rest.get(
          'https://federationDomain.test/.well-known/openid-configuration',
          (_req, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(issuerMetadata),
            ),
        ),
      );

      const response = await pinnipedAuthenticator.authenticate(
        handlerRequest,
        authCtxCreatedWhileSupervisorUnavailable,
      );
      expect(response.session.accessToken).toEqual('accessToken');
    });

    it('caches oidc metadata after a success', async () => {
      let supervisorCalls: number = 1;

      mswServer.use(
        rest.get(
          'https://federationDomain.test/.well-known/openid-configuration',
          (_req, res, ctx) => {
            supervisorCalls += 1;
            return res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(issuerMetadata),
            );
          },
        ),
      );

      await pinnipedAuthenticator.authenticate(handlerRequest, authCtx);

      await pinnipedAuthenticator.authenticate(
        {
          req: {
            method: 'GET',
            url: `https://test?code=authorization_code&state=${encodeOAuthState(
              oauthState,
            )}`,
            session: {
              'oidc:pinniped.test': {
                state: encodeOAuthState(oauthState),
              },
            },
          } as unknown as express.Request,
        },
        authCtx,
      );

      expect(supervisorCalls).toEqual(1);
    });

    it('refreshes oidc metadata when current one in cache expires', async () => {
      let supervisorCalls: number = 0;
      const fixedTime = DateTime.local();
      jest.spyOn(DateTime, 'local').mockImplementation(() => fixedTime);

      mswServer.use(
        rest.get(
          'https://federationDomain.test/.well-known/openid-configuration',
          (_req, res, ctx) => {
            supervisorCalls += 1;
            return res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(issuerMetadata),
            );
          },
        ),
      );

      authCtx = pinnipedAuthenticator.initialize({
        callbackUrl: 'https://backstage.test/callback',
        config: new ConfigReader({
          federationDomain: 'https://federationDomain.test',
          clientId: 'clientId',
          clientSecret: 'clientSecret',
        }),
      });

      await pinnipedAuthenticator.authenticate(handlerRequest, authCtx);

      jest
        .spyOn(DateTime, 'local')
        .mockImplementation(() => fixedTime.plus({ seconds: 60000 }));

      await pinnipedAuthenticator.authenticate(
        {
          req: {
            method: 'GET',
            url: `https://test?code=authorization_code&state=${encodeOAuthState(
              oauthState,
            )}`,
            session: {
              'oidc:pinniped.test': {
                state: encodeOAuthState(oauthState),
              },
            },
          } as unknown as express.Request,
        },
        authCtx,
      );

      expect(supervisorCalls).toEqual(2);
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
      const refreshResponse = await pinnipedAuthenticator.refresh(
        refreshRequest,
        authCtx,
      );

      expect(refreshResponse.session.refreshToken).toBe('refreshToken');
    });

    it('gets access token', async () => {
      const refreshResponse = await pinnipedAuthenticator.refresh(
        refreshRequest,
        authCtx,
      );

      expect(refreshResponse.session.accessToken).toBe('accessToken');
    });

    it('gets id token', async () => {
      const refreshResponse = await pinnipedAuthenticator.refresh(
        refreshRequest,
        authCtx,
      );

      expect(refreshResponse.session.idToken).toBe(idToken);
    });

    it('refreshes oidc metadata after a failed fetch', async () => {
      mswServer.use(
        rest.get(
          'https://federationDomain.test/.well-known/openid-configuration',
          (_req, res, _ctx) => res.networkError('Timeout'),
        ),
      );

      const authCtxCreatedWhileSupervisorUnavailable =
        pinnipedAuthenticator.initialize({
          callbackUrl: 'https://backstage.test/callback',
          config: new ConfigReader({
            federationDomain: 'https://federationDomain.test',
            clientId: 'clientId',
            clientSecret: 'clientSecret',
          }),
        });

      mswServer.use(
        rest.get(
          'https://federationDomain.test/.well-known/openid-configuration',
          (_req, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(issuerMetadata),
            ),
        ),
      );

      const response = await pinnipedAuthenticator.refresh(
        refreshRequest,
        authCtxCreatedWhileSupervisorUnavailable,
      );
      expect(response.session.accessToken).toEqual('accessToken');
    });

    it('caches oidc metadata after a success', async () => {
      let supervisorCalls: number = 1;

      mswServer.use(
        rest.get(
          'https://federationDomain.test/.well-known/openid-configuration',
          (_req, res, ctx) => {
            supervisorCalls += 1;
            return res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(issuerMetadata),
            );
          },
        ),
      );

      await pinnipedAuthenticator.refresh(refreshRequest, authCtx);
      await pinnipedAuthenticator.refresh(refreshRequest, authCtx);

      expect(supervisorCalls).toEqual(1);
    });

    it('refreshes oidc metadata when current one in cache expires', async () => {
      let supervisorCalls: number = 1;
      const fixedTime = DateTime.local();
      jest.spyOn(DateTime, 'local').mockImplementation(() => fixedTime);

      mswServer.use(
        rest.get(
          'https://federationDomain.test/.well-known/openid-configuration',
          (_req, res, ctx) => {
            supervisorCalls += 1;
            return res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(issuerMetadata),
            );
          },
        ),
      );

      await pinnipedAuthenticator.refresh(refreshRequest, authCtx);

      jest
        .spyOn(DateTime, 'local')
        .mockImplementation(() => fixedTime.plus({ seconds: 60000 }));

      await pinnipedAuthenticator.refresh(refreshRequest, authCtx);

      expect(supervisorCalls).toEqual(2);
    });
  });
});
