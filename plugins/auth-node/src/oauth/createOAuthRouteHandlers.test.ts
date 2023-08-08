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
import { encodeOAuthState } from './state';

const mockAuthenticator: jest.Mocked<OAuthAuthenticator<unknown, unknown>> = {
  initialize: jest.fn(_r => ({ ctx: 'authenticator' })),
  start: jest.fn(),
  authenticate: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
  defaultProfileTransform: jest.fn(async (_r, _c) => ({ profile: {} })),
};

const baseConfig = {
  authenticator: mockAuthenticator,
  appUrl: 'http://localhost:3000',
  baseUrl: 'http://localhost:7007',
  isOriginAllowed: () => true,
  providerId: 'my-provider',
  config: new ConfigReader({}),
  resolverContext: { ctx: 'resolver' } as unknown as AuthResolverContext,
};

function wrapInApp(handlers: AuthProviderRouteHandlers) {
  const app = express();

  const router = PromiseRouter();

  router.use(cookieParser());
  app.use(router);
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
  return test.jar.getCookie(`my-provider-nonce`, {
    domain: 'localhost',
    path: '/my-provider/handler',
    script: false,
    secure: false,
  });
}

function getRefreshTokenCookie(test: SuperAgentTest) {
  return test.jar.getCookie(`my-provider-refresh-token`, {
    domain: 'localhost',
    path: '/my-provider',
    script: false,
    secure: false,
  });
}

function getGrantedScopesCookie(test: SuperAgentTest) {
  return test.jar.getCookie(`my-provider-granted-scope`, {
    domain: 'localhost',
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
      const res = await request(app).get('/start');

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

      const res = await agent.get('/start?env=development&scope=my-scope');

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

      const res = await agent.get('/start').query({
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

  describe('logout', () => {
    it('should log out', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-refresh-token=my-refresh-token',
        'localhost',
        '/my-provider',
      );

      expect(getRefreshTokenCookie(agent).value).toBe('my-refresh-token');

      const res = await agent
        .post('/logout')
        .set('X-Requested-With', 'XMLHttpRequest');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({});

      expect(getRefreshTokenCookie(agent)).toBeUndefined();
    });

    it('should reject requests without CSRF header', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));

      const res = await request(app).post('/logout');
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
        .post('/logout')
        .set('X-Requested-With', 'wrong-value');
      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        error: {
          name: 'AuthenticationError',
          message: 'Invalid X-Requested-With header',
        },
      });
    });
  });
});
