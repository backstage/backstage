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

import { ConfigReader } from '@backstage/config';
import express from 'express';
import request, { SuperAgentTest } from 'supertest';
import cookieParser from 'cookie-parser';
import PromiseRouter from 'express-promise-router';
import { AuthProviderRouteHandlers, AuthResolverContext } from '../types';
import { createOAuthRouteHandlers } from './createOAuthRouteHandlers';
import { OAuthAuthenticator } from './types';
import { encodeOAuthState, OAuthState } from './state';
import { PassportProfile } from '../passport';
import { parseWebMessageResponse } from '../flow/__testUtils__/parseWebMessageResponse';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { mockServices } from '@backstage/backend-test-utils';

const mockAuthenticator: jest.Mocked<OAuthAuthenticator<unknown, unknown>> = {
  initialize: jest.fn(_r => ({ ctx: 'authenticator' })),
  start: jest.fn(),
  authenticate: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
  defaultProfileTransform: jest.fn(async (_r, _c) => ({ profile: {} })),
};

const mockBackstageToken = `a.${btoa(
  JSON.stringify({ sub: 'user:default/mock', ent: [] }),
)}.c`;

const mockSession = {
  accessToken: 'access-token',
  expiresInSeconds: 3,
  scope: 'my-scope',
  tokenType: 'bear',
  idToken: 'id-token',
  refreshToken: 'refresh-token',
};

const fiveKilobyteRefreshToken =
  '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';

const baseConfig = {
  authenticator: mockAuthenticator,
  appUrl: 'http://127.0.0.1',
  baseUrl: 'http://127.0.0.1:7007',
  isOriginAllowed: () => true,
  providerId: 'my-provider',
  config: new ConfigReader({}),
  resolverContext: { ctx: 'resolver' } as unknown as AuthResolverContext,
};

function wrapInApp(handlers: AuthProviderRouteHandlers) {
  const middleware = MiddlewareFactory.create({
    logger: mockServices.logger.mock(),
    config: mockServices.rootConfig(),
  });
  const app = express();

  const router = PromiseRouter();

  router.use(cookieParser());
  app.use('/my-provider', router);
  app.use(middleware.error());

  router.get('/start', handlers.start.bind(handlers));
  router.get('/handler/frame', handlers.frameHandler.bind(handlers));
  router.post('/handler/frame', handlers.frameHandler.bind(handlers));
  if (handlers.logout) {
    router.post('/logout', handlers.logout.bind(handlers));
  }
  if (handlers.refresh) {
    router.get('/refresh', handlers.refresh.bind(handlers));
    router.post('/refresh', handlers.refresh.bind(handlers));
  }

  return app;
}

function getNonceCookie(test: SuperAgentTest) {
  return test.jar.getCookie('my-provider-nonce', {
    domain: '127.0.0.1',
    path: '/my-provider/handler',
    script: false,
    secure: false,
  });
}

function getRefreshTokenCookie(test: SuperAgentTest, chunkNumber?: number) {
  if (chunkNumber !== undefined) {
    return test.jar.getCookie(`my-provider-refresh-token-${chunkNumber}`, {
      domain: '127.0.0.1',
      path: '/my-provider',
      script: false,
      secure: false,
    });
  }
  return test.jar.getCookie('my-provider-refresh-token', {
    domain: '127.0.0.1',
    path: '/my-provider',
    script: false,
    secure: false,
  });
}

function getGrantedScopesCookie(test: SuperAgentTest) {
  return test.jar.getCookie('my-provider-granted-scope', {
    domain: '127.0.0.1',
    path: '/my-provider',
    script: false,
    secure: false,
  });
}

describe('createOAuthRouteHandlers', () => {
  afterEach(() => jest.clearAllMocks());

  it('should be created', () => {
    const handlers = createOAuthRouteHandlers(baseConfig);
    expect(handlers).toEqual({
      start: expect.any(Function),
      frameHandler: expect.any(Function),
      refresh: expect.any(Function),
      logout: expect.any(Function),
    });
  });

  describe('start', () => {
    it('should require an env query', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));
      const res = await request(app).get('/my-provider/start');

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        error: {
          name: 'InputError',
          message: 'No env provided in request query parameters',
        },
      });
    });

    it('should start', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      mockAuthenticator.start.mockResolvedValue({
        url: 'https://example.com/redirect',
      });

      const res = await agent.get(
        '/my-provider/start?env=development&scope=my-scope',
      );

      const { value: nonce } = getNonceCookie(agent);

      expect(res.text).toBe('');
      expect(res.status).toBe(302);
      expect(res.get('Location')).toBe('https://example.com/redirect');
      expect(res.get('Content-Length')).toBe('0');

      expect(mockAuthenticator.start).toHaveBeenCalledWith(
        {
          req: expect.anything(),
          scope: 'my-scope',
          state: encodeOAuthState({
            nonce: decodeURIComponent(nonce),
            env: 'development',
          }),
        },
        { ctx: 'authenticator' },
      );
    });

    it('should start with additional parameters, transform state, and persist scopes', async () => {
      const agent = request.agent(
        wrapInApp(
          createOAuthRouteHandlers({
            ...baseConfig,
            authenticator: {
              ...mockAuthenticator,
              shouldPersistScopes: true,
            },
            stateTransform: async state => ({
              state: { ...state, nonce: '123' },
            }),
          }),
        ),
      );

      mockAuthenticator.start.mockResolvedValue({
        url: 'https://example.com/redirect',
      });

      const res = await agent.get('/my-provider/start').query({
        env: 'development',
        scope: 'my-scope',
        origin: 'https://remotehost',
        redirectUrl: 'https://remotehost/redirect',
        flow: 'redirect',
      });

      expect(res.text).toBe('');
      expect(res.status).toBe(302);
      expect(res.get('Location')).toBe('https://example.com/redirect');
      expect(res.get('Content-Length')).toBe('0');

      expect(mockAuthenticator.start).toHaveBeenCalledWith(
        {
          req: expect.anything(),
          scope: 'my-scope',
          state: encodeOAuthState({
            nonce: '123',
            env: 'development',
            origin: 'https://remotehost',
            redirectUrl: 'https://remotehost/redirect',
            flow: 'redirect',
            scope: 'my-scope',
          }),
        },
        { ctx: 'authenticator' },
      );
    });
  });

  describe('frameHandler', () => {
    it('should authenticate', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-nonce=123',
        '127.0.0.1',
        '/my-provider/handler',
      );

      mockAuthenticator.authenticate.mockResolvedValue({
        fullProfile: { id: 'id' } as PassportProfile,
        session: mockSession,
      });

      const res = await agent.get('/my-provider/handler/frame').query({
        state: encodeOAuthState({
          env: 'development',
          nonce: '123',
        } as OAuthState),
      });

      expect(mockAuthenticator.authenticate).toHaveBeenCalledWith(
        { req: expect.anything() },
        { ctx: 'authenticator' },
      );

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        response: {
          profile: {},
          providerInfo: {
            accessToken: 'access-token',
            expiresInSeconds: 3,
            idToken: 'id-token',
            scope: 'my-scope',
          },
        },
      });

      expect(getRefreshTokenCookie(agent).value).toBe('refresh-token');
      expect(getGrantedScopesCookie(agent)).toBeUndefined();
    });

    it('should authenticate when refresh token is bigger than 4KB', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-nonce=123',
        '127.0.0.1',
        '/my-provider/handler',
      );

      mockAuthenticator.authenticate.mockResolvedValue({
        fullProfile: { id: 'id' } as PassportProfile,
        session: {
          ...mockSession,
          refreshToken: fiveKilobyteRefreshToken,
        },
      });

      const res = await agent.get('/my-provider/handler/frame').query({
        state: encodeOAuthState({
          env: 'development',
          nonce: '123',
        } as OAuthState),
      });

      expect(mockAuthenticator.authenticate).toHaveBeenCalledWith(
        { req: expect.anything() },
        { ctx: 'authenticator' },
      );

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        response: {
          profile: {},
          providerInfo: {
            accessToken: 'access-token',
            expiresInSeconds: 3,
            idToken: 'id-token',
            scope: 'my-scope',
          },
        },
      });

      expect(getRefreshTokenCookie(agent, 0).value).toBe(
        fiveKilobyteRefreshToken.slice(0, 4000),
      );
      expect(getRefreshTokenCookie(agent, 1).value).toBe(
        fiveKilobyteRefreshToken.slice(4000),
      );
      expect(getGrantedScopesCookie(agent)).toBeUndefined();
    });

    it('should authenticate with sign-in, profile transform, and persisted scopes', async () => {
      const agent = request.agent(
        wrapInApp(
          createOAuthRouteHandlers({
            ...baseConfig,
            authenticator: {
              ...mockAuthenticator,
              shouldPersistScopes: true,
            },
            profileTransform: async () => ({ profile: { email: 'em@i.l' } }),
            signInResolver: async () => ({ token: mockBackstageToken }),
          }),
        ),
      );

      agent.jar.setCookie(
        'my-provider-nonce=123',
        '127.0.0.1',
        '/my-provider/handler',
      );

      mockAuthenticator.authenticate.mockResolvedValue({
        fullProfile: { id: 'id' } as PassportProfile,
        session: mockSession,
      });

      const res = await agent.get('/my-provider/handler/frame').query({
        state: encodeOAuthState({
          env: 'development',
          nonce: '123',
          scope: 'my-scope my-other-scope',
        } as OAuthState),
      });

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        response: {
          profile: { email: 'em@i.l' },
          providerInfo: {
            accessToken: 'access-token',
            expiresInSeconds: 3,
            idToken: 'id-token',
            scope: 'my-scope my-other-scope',
          },
          backstageIdentity: {
            identity: {
              type: 'user',
              ownershipEntityRefs: [],
              userEntityRef: 'user:default/mock',
            },
            token: mockBackstageToken,
          },
        },
      });

      expect(getRefreshTokenCookie(agent).value).toBe('refresh-token');
      expect(getGrantedScopesCookie(agent).value).toBe(
        'my-scope%20my-other-scope',
      );
    });

    it('should redirect with persisted scope', async () => {
      const agent = request.agent(
        wrapInApp(
          createOAuthRouteHandlers({
            ...baseConfig,
            authenticator: {
              ...mockAuthenticator,
              shouldPersistScopes: true,
            },
            profileTransform: async () => ({ profile: { email: 'em@i.l' } }),
            signInResolver: async () => ({ token: mockBackstageToken }),
          }),
        ),
      );

      agent.jar.setCookie(
        'my-provider-nonce=123',
        '127.0.0.1',
        '/my-provider/handler',
      );

      mockAuthenticator.authenticate.mockResolvedValue({
        fullProfile: { id: 'id' } as PassportProfile,
        session: mockSession,
      });

      const res = await agent.get('/my-provider/handler/frame').query({
        state: encodeOAuthState({
          env: 'development',
          nonce: '123',
          scope: 'my-scope my-other-scope',
          flow: 'redirect',
          redirectUrl: 'https://127.0.0.1:3000/redirect',
        } as OAuthState),
      });

      expect(res.status).toBe(302);
      expect(res.get('Location')).toBe('https://127.0.0.1:3000/redirect');

      expect(getRefreshTokenCookie(agent).value).toBe('refresh-token');
      expect(getGrantedScopesCookie(agent).value).toBe(
        'my-scope%20my-other-scope',
      );
    });

    it('should require a valid origin', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));
      const res = await request(app)
        .get('/my-provider/handler/frame')
        .query({
          state: encodeOAuthState({
            env: 'development',
            nonce: '123',
            origin: 'invalid-origin',
          }),
        });

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        error: {
          name: 'NotAllowedError',
          message: 'App origin is invalid, failed to parse',
        },
      });
    });

    it('should reject origins that are not allowed', async () => {
      const app = wrapInApp(
        createOAuthRouteHandlers({
          ...baseConfig,
          isOriginAllowed: () => false,
        }),
      );
      const res = await request(app)
        .get('/my-provider/handler/frame')
        .query({
          state: encodeOAuthState({
            env: 'development',
            nonce: '123',
            origin: 'http://localhost:3000',
          }),
        });

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        error: {
          name: 'NotAllowedError',
          message: "Origin 'http://localhost:3000' is not allowed",
        },
      });
    });

    it('should reject missing state env', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));
      const res = await request(app)
        .get('/my-provider/handler/frame')
        .query({
          state: encodeOAuthState({
            nonce: '123',
          } as OAuthState),
        });

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        error: {
          name: 'NotAllowedError',
          message: 'OAuth state is invalid, missing env',
        },
      });
    });

    it('should reject missing cookie nonce', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));
      const res = await request(app)
        .get('/my-provider/handler/frame')
        .query({
          state: encodeOAuthState({
            env: 'development',
            nonce: '123',
          }),
        });

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        error: {
          name: 'NotAllowedError',
          message: 'Auth response is missing cookie nonce',
        },
      });
    });

    it('should reject missing state nonce', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));
      const res = await request(app)
        .get('/my-provider/handler/frame')
        .query({
          state: encodeOAuthState({
            env: 'development',
          } as OAuthState),
        });

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        error: {
          name: 'NotAllowedError',
          message: 'OAuth state is invalid, missing nonce',
        },
      });
    });

    it('should reject mismatched nonce', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-nonce=456',
        '127.0.0.1',
        '/my-provider/handler',
      );

      const res = await agent.get('/my-provider/handler/frame').query({
        state: encodeOAuthState({
          env: 'development',
          nonce: '123',
        } as OAuthState),
      });

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        error: {
          name: 'NotAllowedError',
          message: 'Invalid nonce',
        },
      });
    });
  });

  describe('refresh', () => {
    it('should refresh', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-refresh-token=refresh-token',
        '127.0.0.1',
        '/my-provider',
      );

      mockAuthenticator.refresh.mockImplementation(async ({ scope }) => ({
        fullProfile: { id: 'id' } as PassportProfile,
        session: { ...mockSession, scope },
      }));

      const res = await agent
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'XMLHttpRequest')
        .query({ scope: 'my-scope' });

      expect(mockAuthenticator.refresh).toHaveBeenCalledWith(
        {
          req: expect.anything(),
          refreshToken: 'refresh-token',
          scope: 'my-scope',
        },
        { ctx: 'authenticator' },
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        profile: {},
        providerInfo: {
          accessToken: 'access-token',
          expiresInSeconds: 3,
          idToken: 'id-token',
          scope: 'my-scope',
        },
      });
    });

    it('should refresh for chunked token', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        `my-provider-refresh-token-0=${fiveKilobyteRefreshToken.slice(
          0,
          4000,
        )}`,
        '127.0.0.1',
        '/my-provider',
      );
      agent.jar.setCookie(
        `my-provider-refresh-token-1=${fiveKilobyteRefreshToken.slice(4000)}`,
        '127.0.0.1',
        '/my-provider',
      );

      mockAuthenticator.refresh.mockImplementation(async ({ scope }) => ({
        fullProfile: { id: 'id' } as PassportProfile,
        session: {
          ...mockSession,
          scope,
          refreshToken: fiveKilobyteRefreshToken,
        },
      }));

      const res = await agent
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'XMLHttpRequest')
        .query({ scope: 'my-scope' });

      expect(mockAuthenticator.refresh).toHaveBeenCalledWith(
        {
          req: expect.anything(),
          refreshToken: fiveKilobyteRefreshToken,
          scope: 'my-scope',
        },
        { ctx: 'authenticator' },
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        profile: {},
        providerInfo: {
          accessToken: 'access-token',
          expiresInSeconds: 3,
          idToken: 'id-token',
          scope: 'my-scope',
        },
      });
    });

    it('should refresh with sign-in, profile transform, and persisted scopes', async () => {
      const agent = request.agent(
        wrapInApp(
          createOAuthRouteHandlers({
            ...baseConfig,
            authenticator: {
              ...mockAuthenticator,
              shouldPersistScopes: true,
            },
            profileTransform: async () => ({ profile: { email: 'em@i.l' } }),
            signInResolver: async () => ({ token: mockBackstageToken }),
          }),
        ),
      );

      agent.jar.setCookie(
        'my-provider-refresh-token=refresh-token',
        '127.0.0.1',
        '/my-provider',
      );
      agent.jar.setCookie(
        'my-provider-granted-scope=persisted-scope',
        '127.0.0.1',
        '/my-provider',
      );

      mockAuthenticator.refresh.mockImplementation(async ({ scope }) => ({
        fullProfile: { id: 'id' } as PassportProfile,
        session: { ...mockSession, scope, refreshToken: 'new-refresh-token' },
      }));

      const res = await agent
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'XMLHttpRequest');

      expect(mockAuthenticator.refresh).toHaveBeenCalledWith(
        {
          req: expect.anything(),
          refreshToken: 'refresh-token',
          scope: 'persisted-scope',
          scopeAlreadyGranted: true,
        },
        { ctx: 'authenticator' },
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        profile: { email: 'em@i.l' },
        providerInfo: {
          accessToken: 'access-token',
          expiresInSeconds: 3,
          idToken: 'id-token',
          scope: 'persisted-scope',
        },
        backstageIdentity: {
          identity: {
            type: 'user',
            ownershipEntityRefs: [],
            userEntityRef: 'user:default/mock',
          },
          token: mockBackstageToken,
        },
      });
      expect(getRefreshTokenCookie(agent).value).toBe('new-refresh-token');
    });

    it('should forward errors', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-refresh-token=refresh-token',
        '127.0.0.1',
        '/my-provider',
      );

      mockAuthenticator.refresh.mockRejectedValue(new Error('NOPE'));

      const res = await agent
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'XMLHttpRequest');

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        error: {
          name: 'AuthenticationError',
          message: 'Refresh failed; caused by Error: NOPE',
        },
      });
    });

    it('should require refresh cookie', async () => {
      const res = await request(wrapInApp(createOAuthRouteHandlers(baseConfig)))
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'XMLHttpRequest');

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        error: {
          name: 'AuthenticationError',
          message:
            'Refresh failed; caused by InputError: Missing session cookie',
        },
      });
    });

    it('should reject requests without CSRF header', async () => {
      const res = await request(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      ).post('/my-provider/refresh');

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        error: {
          name: 'AuthenticationError',
          message: 'Invalid X-Requested-With header',
        },
      });
    });

    it('should reject requests with invalid CSRF header', async () => {
      const res = await request(wrapInApp(createOAuthRouteHandlers(baseConfig)))
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'invalid');

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        error: {
          name: 'AuthenticationError',
          message: 'Invalid X-Requested-With header',
        },
      });
    });

    it('should set sessionDuration to configured value', async () => {
      const baseConfigWithSessionDuration = {
        ...baseConfig,
        config: new ConfigReader({
          sessionDuration: { days: 7 },
        }),
      };

      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfigWithSessionDuration)),
      );

      agent.jar.setCookie(
        'my-provider-refresh-token=refresh-token',
        '127.0.0.1',
        '/my-provider',
      );

      mockAuthenticator.refresh.mockImplementation(async ({ scope }) => ({
        fullProfile: { id: 'id' } as PassportProfile,
        session: { ...mockSession, scope, refreshToken: 'new-refresh-token' },
      }));

      const res = await agent
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'XMLHttpRequest');

      expect(res.status).toBe(200);
      const expectedExpirationDate = Date.now() + 7 * 24 * 60 * 60 * 1000;
      const cookie = getRefreshTokenCookie(agent);
      expect(cookie.expiration_date).toBeGreaterThanOrEqual(
        expectedExpirationDate - 1000,
      );
      expect(cookie.expiration_date).toBeLessThanOrEqual(
        expectedExpirationDate + 1000,
      );
    });

    it('should set sessionDuration to default of 1000 days when not configured', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-refresh-token=refresh-token',
        '127.0.0.1',
        '/my-provider',
      );

      mockAuthenticator.refresh.mockImplementation(async ({ scope }) => ({
        fullProfile: { id: 'id' } as PassportProfile,
        session: { ...mockSession, scope, refreshToken: 'new-refresh-token' },
      }));

      const res = await agent
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'XMLHttpRequest');

      expect(res.status).toBe(200);
      const expectedExpirationDate = Date.now() + 1000 * 24 * 60 * 60 * 1000;
      const cookie = getRefreshTokenCookie(agent);
      expect(cookie.expiration_date).toBeGreaterThanOrEqual(
        expectedExpirationDate - 1000,
      );
      expect(cookie.expiration_date).toBeLessThanOrEqual(
        expectedExpirationDate + 1000,
      );
    });
  });

  describe('logout', () => {
    it('should log out', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-refresh-token=my-refresh-token',
        '127.0.0.1',
        '/my-provider',
      );

      expect(getRefreshTokenCookie(agent).value).toBe('my-refresh-token');

      const res = await agent
        .post('/my-provider/logout')
        .set('X-Requested-With', 'XMLHttpRequest');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({});

      expect(getRefreshTokenCookie(agent)).toBeUndefined();
    });

    it('should reject requests without CSRF header', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));

      const res = await request(app).post('/my-provider/logout');
      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        error: {
          name: 'AuthenticationError',
          message: 'Invalid X-Requested-With header',
        },
      });
    });

    it('should reject requests with invalid CSRF header', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));

      const res = await request(app)
        .post('/my-provider/logout')
        .set('X-Requested-With', 'wrong-value');
      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        error: {
          name: 'AuthenticationError',
          message: 'Invalid X-Requested-With header',
        },
      });
    });

    it('should set error search param and redirect on caught error', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));
      const res = await request(app)
        .get('/my-provider/handler/frame')
        .query({
          state: encodeOAuthState({
            env: 'development',
            nonce: '123',
            flow: 'redirect',
            redirectUrl: 'http://localhost:3000',
          }),
        });

      // Check if it redirects on error
      expect(res.status).toBe(302);

      // Extract the redirect URL from the location header
      const redirectLocation = res.header.location;
      expect(redirectLocation).toBeDefined();

      // Create a URL object from the redirect location
      const redirectUrl = new URL(redirectLocation);

      // Verify that the 'error' search param is set with the encoded error message
      const errorMessage = redirectUrl.searchParams.get('error');
      expect(errorMessage).toBe('Auth response is missing cookie nonce');
    });
  });
});
