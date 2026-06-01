/*
 * Copyright 2026 The Backstage Authors
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

import { CacheService } from '@backstage/backend-plugin-api';
import { mockServices } from '@backstage/backend-test-utils';
import {
  PassportHelpers,
  PassportOAuthAuthenticatorHelper,
} from '@backstage/plugin-auth-node';
import { createAuth0Authenticator } from './authenticator';
import express from 'express';

// Mock PassportHelpers so we don't need a real OAuth2 connection
jest.mock('@backstage/plugin-auth-node', () => {
  const actual = jest.requireActual('@backstage/plugin-auth-node');
  return {
    ...actual,
    PassportHelpers: {
      ...actual.PassportHelpers,
      executeRefreshTokenStrategy: jest.fn(),
    },
    PassportOAuthAuthenticatorHelper: {
      ...actual.PassportOAuthAuthenticatorHelper,
      defaultProfileTransform:
        actual.PassportOAuthAuthenticatorHelper.defaultProfileTransform,
      from: jest.fn(() => ({
        start: jest.fn(),
        authenticate: jest.fn(),
        fetchProfile: jest.fn(),
      })),
    },
  };
});

const mockExecuteRefresh =
  PassportHelpers.executeRefreshTokenStrategy as jest.MockedFunction<
    typeof PassportHelpers.executeRefreshTokenStrategy
  >;

const mockFrom = PassportOAuthAuthenticatorHelper.from as jest.MockedFunction<
  typeof PassportOAuthAuthenticatorHelper.from
>;

describe('createAuth0Authenticator', () => {
  const mockConfig = mockServices.rootConfig({
    data: {
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      domain: 'test.auth0.com',
    },
  });

  // Create a minimal valid JWT with a sub claim for decodeJwt
  function createTestIdToken(sub: string): string {
    const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString(
      'base64url',
    );
    const payload = Buffer.from(JSON.stringify({ sub })).toString('base64url');
    return `${header}.${payload}.`;
  }

  const mockProfile = {
    provider: 'auth0',
    id: 'user-123',
    displayName: 'Test User',
    emails: [{ value: 'test@example.com' }],
  };

  let cache: jest.Mocked<CacheService>;
  let cacheStore: Map<string, unknown>;
  let mockFetchProfile: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    cacheStore = new Map();
    cache = mockServices.cache.mock() as jest.Mocked<CacheService>;
    // withOptions should return a working cache scoped with TTL
    cache.withOptions.mockReturnValue(cache);
    cache.get.mockImplementation(
      async (key: string) => cacheStore.get(key) as any,
    );
    cache.set.mockImplementation(async (key: string, value: unknown) => {
      cacheStore.set(key, value);
    });

    mockFetchProfile = jest.fn().mockResolvedValue(mockProfile);
    mockFrom.mockReturnValue({
      start: jest.fn(),
      authenticate: jest.fn(),
      fetchProfile: mockFetchProfile,
    } as any);

    mockExecuteRefresh.mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      params: {
        token_type: 'bearer',
        scope: 'openid profile',
        expires_in: 3600,
        id_token: createTestIdToken('auth0|user-123'),
      },
    });
  });

  it('should fetch profile on cache miss and cache the result', async () => {
    const authenticator = createAuth0Authenticator({ cache });
    const ctx = authenticator.initialize({
      callbackUrl: 'http://localhost/callback',
      config: mockConfig,
    });

    const result = await authenticator.refresh(
      {
        refreshToken: 'my-refresh-token',
        scope: 'openid profile',
        req: {} as express.Request,
      },
      ctx,
    );

    expect(mockExecuteRefresh).toHaveBeenCalledWith(
      expect.anything(),
      'my-refresh-token',
      'openid profile',
    );
    expect(mockFetchProfile).toHaveBeenCalledWith('new-access-token');
    expect(result.fullProfile).toEqual(mockProfile);
    expect(result.session).toEqual({
      accessToken: 'new-access-token',
      tokenType: 'bearer',
      scope: 'openid profile',
      expiresInSeconds: 3600,
      idToken: createTestIdToken('auth0|user-123'),
      refreshToken: 'new-refresh-token',
    });
  });

  it('should return cached profile on cache hit without calling fetchProfile', async () => {
    const authenticator = createAuth0Authenticator({ cache });
    const ctx = authenticator.initialize({
      callbackUrl: 'http://localhost/callback',
      config: mockConfig,
    });

    // First call - populates cache
    await authenticator.refresh(
      {
        refreshToken: 'my-refresh-token',
        scope: 'openid profile',
        req: {} as express.Request,
      },
      ctx,
    );

    // Second call - should use cache
    mockFetchProfile.mockClear();
    mockExecuteRefresh.mockClear();
    mockExecuteRefresh.mockResolvedValue({
      accessToken: 'another-access-token',
      refreshToken: 'another-refresh-token',
      params: {
        token_type: 'bearer',
        scope: 'openid profile',
        expires_in: 3600,
        id_token: createTestIdToken('auth0|user-123'),
      },
    });

    const result = await authenticator.refresh(
      {
        refreshToken: 'my-refresh-token',
        scope: 'openid profile',
        req: {} as express.Request,
      },
      ctx,
    );

    // Token refresh still happens
    expect(mockExecuteRefresh).toHaveBeenCalledTimes(1);
    // But profile fetch is skipped because same sub
    expect(mockFetchProfile).not.toHaveBeenCalled();
    expect(result.fullProfile).toEqual(mockProfile);
    // Session uses fresh token data
    expect(result.session.accessToken).toBe('another-access-token');
  });

  it('should fetch profile again when sub claim changes', async () => {
    const authenticator = createAuth0Authenticator({ cache });
    const ctx = authenticator.initialize({
      callbackUrl: 'http://localhost/callback',
      config: mockConfig,
    });

    // First call with user-123
    await authenticator.refresh(
      {
        refreshToken: 'token-a',
        scope: 'openid profile',
        req: {} as express.Request,
      },
      ctx,
    );

    expect(mockFetchProfile).toHaveBeenCalledTimes(1);

    // Second call with a different sub - different user, should miss cache
    mockExecuteRefresh.mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      params: {
        token_type: 'bearer',
        scope: 'openid profile',
        expires_in: 3600,
        id_token: createTestIdToken('auth0|user-456'),
      },
    });
    const updatedProfile = { ...mockProfile, displayName: 'Updated User' };
    mockFetchProfile.mockResolvedValue(updatedProfile);

    const result = await authenticator.refresh(
      {
        refreshToken: 'token-b',
        scope: 'openid profile',
        req: {} as express.Request,
      },
      ctx,
    );

    expect(mockFetchProfile).toHaveBeenCalledTimes(2);
    expect(result.fullProfile).toEqual(updatedProfile);
  });

  it('should skip cache when id_token has no sub claim', async () => {
    const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString(
      'base64url',
    );
    const payload = Buffer.from(JSON.stringify({ aud: 'test' })).toString(
      'base64url',
    );
    const idTokenWithoutSub = `${header}.${payload}.`;

    mockExecuteRefresh.mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      params: {
        token_type: 'bearer',
        scope: 'openid profile',
        expires_in: 3600,
        id_token: idTokenWithoutSub,
      },
    });

    const authenticator = createAuth0Authenticator({ cache });
    const ctx = authenticator.initialize({
      callbackUrl: 'http://localhost/callback',
      config: mockConfig,
    });

    const result = await authenticator.refresh(
      {
        refreshToken: 'my-refresh-token',
        scope: 'openid profile',
        req: {} as express.Request,
      },
      ctx,
    );

    // Profile is fetched directly
    expect(mockFetchProfile).toHaveBeenCalledWith('new-access-token');
    expect(result.fullProfile).toEqual(mockProfile);
    // Cache is never read or written
    expect(cache.get).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });
});
