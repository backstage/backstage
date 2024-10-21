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
import { errorHandler } from '@backstage/backend-common';
import { encodeOAuthState, OAuthState } from './state';
import { PassportProfile } from '../passport';
import { parseWebMessageResponse } from '../flow/__testUtils__/parseWebMessageResponse';

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
  const app = express();

  const router = PromiseRouter();

  router.use(cookieParser());
  app.use('/my-provider', router);
  app.use(errorHandler());

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

function getRefreshTokenCookie(test: SuperAgentTest) {
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
