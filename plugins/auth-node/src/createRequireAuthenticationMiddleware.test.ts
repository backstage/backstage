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
import { createRequireAuthenticationMiddleware } from './createRequireAuthenticationMiddleware';
import { TokenManagerService } from '@backstage/backend-plugin-api';
import { AuthenticationError } from '@backstage/errors';
import { FakeTokenFactory, useFixture } from './setupTests';
import {
  DefaultIdentityClient,
  IdentityApi,
} from '@backstage/plugin-auth-node';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { randomUUID } from 'crypto';

const acceptServerToken = {
  authenticate: (_: string) => Promise.resolve(),
} as TokenManagerService;

const rejectServerToken = {
  authenticate: (_: string) => Promise.reject(new AuthenticationError('test')),
} as TokenManagerService;

const mockBaseUrl = 'http://backstage:9191/i-am-a-mock-base';
const discovery: PluginEndpointDiscovery = {
  async getBaseUrl() {
    return mockBaseUrl;
  },
  async getExternalBaseUrl() {
    return mockBaseUrl;
  },
};

const createMiddleware = (
  identityApi: IdentityApi,
  tokenManager: TokenManagerService,
) =>
  useFixture(createRequireAuthenticationMiddleware(identityApi, tokenManager));

const server = setupServer();

describe('createRequireTokenMiddleware', () => {
  let identityApi: IdentityApi;
  let issuer: FakeTokenFactory;

  const keyDurationSeconds = 5;
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  beforeEach(() => {
    identityApi = DefaultIdentityClient.create({
      discovery,
      issuer: mockBaseUrl,
    });
    issuer = new FakeTokenFactory({
      issuer: `${mockBaseUrl}`,
      keyDurationSeconds,
    });

    server.use(
      rest.get(`${mockBaseUrl}/.well-known/jwks.json`, async (_, res, ctx) => {
        const keys = await issuer.listPublicKeys();
        return res(ctx.json(keys));
      }),
    );
  });

  it('should throw AuthenticationError when the token is not specified', async () => {
    const middleware = createMiddleware(identityApi, rejectServerToken);
    const err = await middleware({});

    expect(err).toBeDefined();
    expect(err?.name).toBe('AuthenticationError');
  });

  describe('using user token', () => {
    it('should next when the token is valid', async () => {
      const middleware = createMiddleware(identityApi, rejectServerToken);
      const token = await issuer.issueToken();
      const err = await middleware({
        headers: { authorization: `Bearer ${token}` },
      });

      expect(err).toBeUndefined();
    });

    it('should throw AuthenticationError when the token has different issuer', async () => {
      const middleware = createMiddleware(identityApi, rejectServerToken);
      const token = await issuer.issueToken({
        issuer: 'https://different-issuer',
      });
      const err = await middleware({
        headers: { authorization: `Bearer ${token}` },
      });

      expect(err).toBeDefined();
      expect(err?.name).toBe('AuthenticationError');
    });

    it('should throw AuthenticationError when the token has a different audience', async () => {
      const middleware = createMiddleware(identityApi, rejectServerToken);
      const token = await issuer.issueToken({ audience: 'other audience' });

      const err = await middleware({
        headers: { authorization: `Bearer ${token}` },
      });

      expect(err).toBeDefined();
      expect(err?.name).toBe('AuthenticationError');
    });

    it('should throw AuthenticationError when the token has expired', async () => {
      const middleware = createMiddleware(identityApi, rejectServerToken);
      const token = await issuer.issueToken({
        expiresAt: Math.floor(Date.now() / 1000) - 1000,
      });

      const err = await middleware({
        headers: { authorization: `Bearer ${token}` },
      });

      expect(err).toBeDefined();
      expect(err?.name).toBe('AuthenticationError');
    });
  });

  describe('using server token', () => {
    it('should next when the token is valid', async () => {
      const middleware = createMiddleware(identityApi, acceptServerToken);
      const err = await middleware({
        headers: {
          authorization: `Bearer ${randomUUID()}`,
        },
      });

      expect(err).toBeUndefined();
    });

    it('should throw AuthenticationError when the token is not valid', async () => {
      const middleware = createMiddleware(identityApi, rejectServerToken);

      const err = await middleware({
        headers: {
          authorization: `Bearer ${randomUUID()}`,
        },
      });

      expect(err).toBeDefined();
      expect(err?.name).toBe('AuthenticationError');
    });
  });
});
