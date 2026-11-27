/*
 * Copyright 2024 The Backstage Authors
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
  CacheService,
  CacheServiceSetOptions,
} from '@backstage/backend-plugin-api';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';
import { SignJWT, exportJWK, generateKeyPair } from 'jose';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { createRequest } from 'node-mocks-http';
import { randomUUID as uuid } from 'node:crypto';
import { AuthHelper } from './helpers';
import { CF_JWT_HEADER, CloudflareAccessIdentityProfile } from './types';

interface AnyJWK extends Record<string, string> {
  use: 'sig';
  alg: string;
  kid: string;
  kty: string;
}

const MOCK_AUDIENCE = 'backstage-app-aud-tag';

class MockTokenFactory {
  private readonly publicKeys = new Array<AnyJWK>();

  async userToken(
    audience: string | null = MOCK_AUDIENCE,
    expiresInSeconds = 5,
    issuedAtSeconds = 1600000000,
  ): Promise<string> {
    const { privateKey, kid } = await this.makeKeys();
    return new SignJWT({
      iss: `https://mock-team.cloudflareaccess.com`,
      ...(audience ? { aud: [audience] } : {}),
      sub: '1234567890',
      name: 'User Name',
      iat: issuedAtSeconds,
      exp: issuedAtSeconds + expiresInSeconds,
    })
      .setProtectedHeader({
        alg: 'ES256',
        typ: 'JWT',
        kid: kid,
      })
      .sign(privateKey);
  }

  async serviceToken(): Promise<string> {
    const { privateKey, kid } = await this.makeKeys();
    return new SignJWT({
      iss: `https://mock-team.cloudflareaccess.com`,
      aud: [MOCK_AUDIENCE],
      name: 'Bot',
      common_name: 'test_token_id.access',
      iat: 1600000000,
      exp: 1600000005,
    })
      .setProtectedHeader({
        alg: 'ES256',
        typ: 'JWT',
        kid: kid,
      })
      .sign(privateKey);
  }

  listPublicKeys(): AnyJWK[] {
    return [...this.publicKeys];
  }

  private async makeKeys() {
    const pair = await generateKeyPair('ES256');
    const publicKey = await exportJWK(pair.publicKey);
    const kid = uuid();
    publicKey.kid = kid;
    this.publicKeys.push(publicKey as AnyJWK);
    return { privateKey: pair.privateKey, kid };
  }
}

// msw 3 answers requests through process.nextTick, so leave that real
function useFakeClock(now: number) {
  jest.useFakeTimers({ now, doNotFake: ['nextTick'] });
}

describe('helpers', () => {
  const tokenFactory = new MockTokenFactory();
  const server = setupServer();
  registerMswTestHooks(server);

  let cache: jest.Mocked<CacheService>;
  let cacheStore: Map<string, { value: unknown; expiresAtMs: number }>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Wire the mocked cache with a store that expires entries once the
    // TTL given to set has elapsed
    cache = mockServices.cache.mock() as jest.Mocked<CacheService>;
    cacheStore = new Map();
    cache.get.mockImplementation(async (key: string) => {
      const entry = cacheStore.get(key);
      if (!entry) {
        return undefined;
      }
      if (Date.now() >= entry.expiresAtMs) {
        cacheStore.delete(key);
        return undefined;
      }
      return entry.value as any;
    });
    cache.set.mockImplementation(
      async (key: string, value: unknown, options?: CacheServiceSetOptions) => {
        let ttlMs: number;
        if (options?.ttl === undefined) {
          ttlMs = Number.POSITIVE_INFINITY;
        } else if (typeof options.ttl === 'number') {
          ttlMs = options.ttl;
        } else {
          ttlMs = durationToMilliseconds(options.ttl);
        }
        cacheStore.set(key, {
          value,
          expiresAtMs: Date.now() + ttlMs,
        });
      },
    );

    server.use(
      http.get(
        `https://mock-team.cloudflareaccess.com/cdn-cgi/access/certs`,
        () => {
          return HttpResponse.json({
            keys: tokenFactory.listPublicKeys(),
          });
        },
      ),
      http.get(
        `https://mock-team.cloudflareaccess.com/cdn-cgi/access/get-identity`,
        () => {
          return HttpResponse.json({
            email: 'hello@example.com',
            groups: [{ id: '123', email: 'foo@bar.com', name: 'foo' }],
            id: '1234567890',
            name: 'User Name',
          } satisfies CloudflareAccessIdentityProfile);
        },
      ),
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('requires an application audience', () => {
    expect(() =>
      AuthHelper.fromConfig(new ConfigReader({ teamName: 'mock-team' })),
    ).toThrow(/audience/);
  });

  it('rejects tokens issued for a different application audience', async () => {
    useFakeClock(1600000004000);

    const helper = AuthHelper.fromConfig(
      new ConfigReader({
        teamName: 'mock-team',
        audience: MOCK_AUDIENCE,
      }),
      { cache },
    );
    const token = await tokenFactory.userToken('other-app-aud-tag');
    const request = createRequest({
      headers: { [CF_JWT_HEADER]: token },
    });

    await expect(helper.authenticate(request)).rejects.toThrow(
      'unexpected "aud" claim value',
    );
  });

  it('rejects tokens without an application audience', async () => {
    useFakeClock(1600000004000);

    const helper = AuthHelper.fromConfig(
      new ConfigReader({
        teamName: 'mock-team',
        audience: MOCK_AUDIENCE,
      }),
      { cache },
    );
    const token = await tokenFactory.userToken(null);
    const request = createRequest({
      headers: { [CF_JWT_HEADER]: token },
    });

    await expect(helper.authenticate(request)).rejects.toThrow(
      'missing required "aud" claim',
    );
  });

  it('works for regular tokens, through header auth', async () => {
    useFakeClock(1600000004000);

    const helper = AuthHelper.fromConfig(
      new ConfigReader({
        teamName: 'mock-team',
        audience: MOCK_AUDIENCE,
      }),
      { cache },
    );
    const token = await tokenFactory.userToken();
    const request = createRequest({
      headers: { [CF_JWT_HEADER]: token },
    });

    const expected = {
      cfIdentity: {
        email: 'hello@example.com',
        groups: [{ id: '123', email: 'foo@bar.com', name: 'foo' }],
        id: '1234567890',
        name: 'User Name',
      },
      claims: {
        iss: `https://mock-team.cloudflareaccess.com`,
        aud: [MOCK_AUDIENCE],
        sub: '1234567890',
        name: 'User Name',
        iat: 1600000000,
        exp: 1600000005,
      },
      expiresInSeconds: 5,
    };

    await expect(helper.authenticate(request)).resolves.toEqual({
      ...expected,
      token: token,
    });
    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set.mock.calls[0][0]).toBe(
      'providers/cloudflare-access/profile-v1/1234567890/1600000000',
    );
    expect(JSON.parse(cache.set.mock.calls[0][1] as string)).toEqual(expected);
  });

  it('works for regular tokens, through cookie auth', async () => {
    useFakeClock(1600000004000);

    const helper = AuthHelper.fromConfig(
      new ConfigReader({
        teamName: 'mock-team',
        audience: MOCK_AUDIENCE,
      }),
      { cache },
    );
    const token = await tokenFactory.userToken();
    const request = createRequest({
      cookies: { CF_Authorization: token },
    });

    const expected = {
      cfIdentity: {
        email: 'hello@example.com',
        groups: [{ id: '123', email: 'foo@bar.com', name: 'foo' }],
        id: '1234567890',
        name: 'User Name',
      },
      claims: {
        iss: `https://mock-team.cloudflareaccess.com`,
        aud: [MOCK_AUDIENCE],
        sub: '1234567890',
        name: 'User Name',
        iat: 1600000000,
        exp: 1600000005,
      },
      expiresInSeconds: 5,
    };

    await expect(helper.authenticate(request)).resolves.toEqual({
      ...expected,
      token: token,
    });
  });

  it('works for service tokens, through header auth', async () => {
    useFakeClock(1600000004000);

    const helper = AuthHelper.fromConfig(
      new ConfigReader({
        teamName: 'mock-team',
        audience: MOCK_AUDIENCE,
        serviceTokens: [
          {
            token: 'test_token_id.access',
            subject: 'test_token_id.access@example.com',
          },
        ],
      }),
      { cache },
    );
    const token = await tokenFactory.serviceToken();
    const request = createRequest({
      headers: { [CF_JWT_HEADER]: token },
    });

    await expect(helper.authenticate(request)).resolves.toEqual({
      cfIdentity: {
        email: 'test_token_id.access@example.com',
        groups: [],
        id: 'test_token_id.access',
        name: 'Bot',
      },
      claims: {
        iss: `https://mock-team.cloudflareaccess.com`,
        aud: [MOCK_AUDIENCE],
        name: 'Bot',
        common_name: 'test_token_id.access',
        iat: 1600000000,
        exp: 1600000005,
      },
      expiresInSeconds: 5,
      token: token,
    });
  });

  it('works for regular tokens, through jwtHeaderName header', async () => {
    useFakeClock(1600000004000);

    const helper = AuthHelper.fromConfig(
      new ConfigReader({
        teamName: 'mock-team',
        audience: MOCK_AUDIENCE,
        jwtHeaderName: 'X-Auth-Token',
      }),
      { cache },
    );
    const token = await tokenFactory.userToken();
    const request = createRequest({
      headers: { ['X-Auth-Token']: token },
    });

    const expected = {
      cfIdentity: {
        email: 'hello@example.com',
        groups: [{ id: '123', email: 'foo@bar.com', name: 'foo' }],
        id: '1234567890',
        name: 'User Name',
      },
      claims: {
        iss: `https://mock-team.cloudflareaccess.com`,
        aud: [MOCK_AUDIENCE],
        sub: '1234567890',
        name: 'User Name',
        iat: 1600000000,
        exp: 1600000005,
      },
      expiresInSeconds: 5,
    };

    await expect(helper.authenticate(request)).resolves.toEqual({
      ...expected,
      token: token,
    });
    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set.mock.calls[0][0]).toBe(
      'providers/cloudflare-access/profile-v1/1234567890/1600000000',
    );
    expect(JSON.parse(cache.set.mock.calls[0][1] as string)).toEqual(expected);
  });

  it('works for regular tokens, through authorizationCookieName cookie name', async () => {
    useFakeClock(1600000004000);

    const helper = AuthHelper.fromConfig(
      new ConfigReader({
        teamName: 'mock-team',
        audience: MOCK_AUDIENCE,
        authorizationCookieName: 'CF_Auth',
      }),
      { cache },
    );
    const token = await tokenFactory.userToken();
    const request = createRequest({
      cookies: { CF_Auth: token },
    });

    const expected = {
      cfIdentity: {
        email: 'hello@example.com',
        groups: [{ id: '123', email: 'foo@bar.com', name: 'foo' }],
        id: '1234567890',
        name: 'User Name',
      },
      claims: {
        iss: `https://mock-team.cloudflareaccess.com`,
        aud: [MOCK_AUDIENCE],
        sub: '1234567890',
        name: 'User Name',
        iat: 1600000000,
        exp: 1600000005,
      },
      expiresInSeconds: 5,
    };

    await expect(helper.authenticate(request)).resolves.toEqual({
      ...expected,
      token: token,
    });
  });

  it('returns the cached identity when the same token is used again within the cache TTL', async () => {
    useFakeClock(1600000004000);

    const identity = {
      email: 'hello@example.com',
      groups: [{ id: '123', email: 'foo@bar.com', name: 'foo' }],
      id: '1234567890',
      name: 'User Name',
    } satisfies CloudflareAccessIdentityProfile;
    const getIdentity = jest.fn(() => HttpResponse.json(identity));
    server.use(
      http.get(
        `https://mock-team.cloudflareaccess.com/cdn-cgi/access/get-identity`,
        () => getIdentity(),
      ),
    );

    const helper = AuthHelper.fromConfig(
      new ConfigReader({
        teamName: 'mock-team',
        audience: MOCK_AUDIENCE,
      }),
      { cache },
    );
    const token = await tokenFactory.userToken(MOCK_AUDIENCE, 300);
    await helper.authenticate(
      createRequest({ headers: { [CF_JWT_HEADER]: token } }),
    );
    expect(getIdentity).toHaveBeenCalledTimes(1);

    // The clock moves past the JWKS fetch cooldown so that the token's
    // signing key can still be fetched, but stays within the cache TTL.
    jest.setSystemTime(1600000004000 + 31_000);
    const result = await helper.authenticate(
      createRequest({ headers: { [CF_JWT_HEADER]: token } }),
    );

    expect(getIdentity).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.get).toHaveBeenCalledWith(
      'providers/cloudflare-access/profile-v1/1234567890/1600000000',
    );
    // The TTL is bounded by the maximum cache TTL, which is shorter than
    // the lifetime of this token
    expect(cache.set).toHaveBeenCalledWith(
      'providers/cloudflare-access/profile-v1/1234567890/1600000000',
      expect.any(String),
      { ttl: { seconds: 60 } },
    );
    expect(result).toEqual({
      claims: {
        iss: `https://mock-team.cloudflareaccess.com`,
        aud: [MOCK_AUDIENCE],
        sub: '1234567890',
        name: 'User Name',
        iat: 1600000000,
        exp: 1600000300,
      },
      cfIdentity: identity,
      expiresInSeconds: 300,
      token: token,
    });
  });

  it('fetches a fresh identity on a later sign-in with a new token within the cache TTL', async () => {
    useFakeClock(1600000004000);

    const identity = {
      email: 'hello@example.com',
      groups: [{ id: '123', email: 'foo@bar.com', name: 'foo' }],
      id: '1234567890',
      name: 'User Name',
    } satisfies CloudflareAccessIdentityProfile;
    const getIdentity = jest.fn(() => HttpResponse.json(identity));
    server.use(
      http.get(
        `https://mock-team.cloudflareaccess.com/cdn-cgi/access/get-identity`,
        () => getIdentity(),
      ),
    );

    const helper = AuthHelper.fromConfig(
      new ConfigReader({
        teamName: 'mock-team',
        audience: MOCK_AUDIENCE,
      }),
      { cache },
    );
    const token = await tokenFactory.userToken(MOCK_AUDIENCE, 300);
    await helper.authenticate(
      createRequest({ headers: { [CF_JWT_HEADER]: token } }),
    );
    expect(getIdentity).toHaveBeenCalledTimes(1);

    // Group membership is revoked upstream before the user signs in again
    identity.groups = [];

    // A fresh sign-in carries a new token with a new issued-at time, so
    // the identity cached for the earlier token is never reused, even
    // within the cache TTL. The clock moves past the JWKS fetch cooldown
    // so that the fresh token's key can be fetched.
    jest.setSystemTime(1600000004000 + 31_000);
    const secondToken = await tokenFactory.userToken(
      MOCK_AUDIENCE,
      300,
      1600000031,
    );
    const result = await helper.authenticate(
      createRequest({ headers: { [CF_JWT_HEADER]: secondToken } }),
    );

    expect(getIdentity).toHaveBeenCalledTimes(2);
    expect(cache.set).toHaveBeenCalledTimes(2);
    expect(cache.get).toHaveBeenCalledWith(
      'providers/cloudflare-access/profile-v1/1234567890/1600000031',
    );
    expect(result.cfIdentity.groups).toEqual([]);
    expect(result.token).toBe(secondToken);
  });

  it('caps the cache TTL at the token expiry', async () => {
    useFakeClock(1600000004000);

    const identity = {
      email: 'hello@example.com',
      groups: [{ id: '123', email: 'foo@bar.com', name: 'foo' }],
      id: '1234567890',
      name: 'User Name',
    } satisfies CloudflareAccessIdentityProfile;
    server.use(
      http.get(
        `https://mock-team.cloudflareaccess.com/cdn-cgi/access/get-identity`,
        () => HttpResponse.json(identity),
      ),
    );

    const helper = AuthHelper.fromConfig(
      new ConfigReader({
        teamName: 'mock-team',
        audience: MOCK_AUDIENCE,
      }),
      { cache },
    );
    // The token expires 26 seconds after the fake clock, sooner than the
    // maximum cache TTL
    const token = await tokenFactory.userToken(MOCK_AUDIENCE, 30);
    await helper.authenticate(
      createRequest({ headers: { [CF_JWT_HEADER]: token } }),
    );

    expect(cache.set).toHaveBeenCalledWith(
      'providers/cloudflare-access/profile-v1/1234567890/1600000000',
      expect.any(String),
      { ttl: { seconds: 26 } },
    );
  });

  it('refetches the identity on a later sign-in once the cache TTL has elapsed', async () => {
    useFakeClock(1600000004000);

    const identity = {
      email: 'hello@example.com',
      groups: [{ id: '123', email: 'foo@bar.com', name: 'foo' }],
      id: '1234567890',
      name: 'User Name',
    } satisfies CloudflareAccessIdentityProfile;
    const getIdentity = jest.fn(() => HttpResponse.json(identity));
    server.use(
      http.get(
        `https://mock-team.cloudflareaccess.com/cdn-cgi/access/get-identity`,
        () => getIdentity(),
      ),
    );

    const helper = AuthHelper.fromConfig(
      new ConfigReader({
        teamName: 'mock-team',
        audience: MOCK_AUDIENCE,
      }),
      { cache },
    );
    const token = await tokenFactory.userToken(MOCK_AUDIENCE, 300);
    await helper.authenticate(
      createRequest({ headers: { [CF_JWT_HEADER]: token } }),
    );
    expect(getIdentity).toHaveBeenCalledTimes(1);

    // Group membership is revoked upstream before the user signs in again
    identity.groups = [];

    // The cached identity has outlived its TTL, even though the same
    // token is presented again
    jest.setSystemTime(1600000004000 + 60_000 + 1);

    const result = await helper.authenticate(
      createRequest({ headers: { [CF_JWT_HEADER]: token } }),
    );

    expect(getIdentity).toHaveBeenCalledTimes(2);
    expect(cache.set).toHaveBeenCalledTimes(2);
    expect(result.cfIdentity.groups).toEqual([]);
    expect(result.token).toBe(token);
  });
});
