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
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { SignJWT, exportJWK, generateKeyPair } from 'jose';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { createRequest } from 'node-mocks-http';
import { v4 as uuid } from 'uuid';
import { AuthHelper } from './helpers';
import { CF_JWT_HEADER, CloudflareAccessIdentityProfile } from './types';

interface AnyJWK extends Record<string, string> {
  use: 'sig';
  alg: string;
  kid: string;
  kty: string;
}

class MockTokenFactory {
  private readonly publicKeys = new Array<AnyJWK>();

  async userToken(): Promise<string> {
    const { privateKey, kid } = await this.makeKeys();
    return new SignJWT({
      iss: `https://mock-team.cloudflareaccess.com`,
      sub: '1234567890',
      name: 'User Name',
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

  async serviceToken(): Promise<string> {
    const { privateKey, kid } = await this.makeKeys();
    return new SignJWT({
      iss: `https://mock-team.cloudflareaccess.com`,
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

describe('helpers', () => {
  const tokenFactory = new MockTokenFactory();
  const cache = mockServices.cache.mock();
  const server = setupServer();
  registerMswTestHooks(server);

  beforeEach(() => {
    jest.clearAllMocks();
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

  it('works for regular tokens, through header auth', async () => {
    jest.useFakeTimers({
      now: 1600000004000,
    });

    const helper = AuthHelper.fromConfig(
      new ConfigReader({ teamName: 'mock-team' }),
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
      'providers/cloudflare-access/profile-v1/1234567890',
    );
    expect(JSON.parse(cache.set.mock.calls[0][1] as string)).toEqual(expected);
  });

  it('works for regular tokens, through cookie auth', async () => {
    jest.useFakeTimers({
      now: 1600000004000,
    });

    const helper = AuthHelper.fromConfig(
      new ConfigReader({ teamName: 'mock-team' }),
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
    jest.useFakeTimers({
      now: 1600000004000,
    });

    const helper = AuthHelper.fromConfig(
      new ConfigReader({
        teamName: 'mock-team',
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
    jest.useFakeTimers({
      now: 1600000004000,
    });

    const helper = AuthHelper.fromConfig(
      new ConfigReader({
        teamName: 'mock-team',
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
      'providers/cloudflare-access/profile-v1/1234567890',
    );
    expect(JSON.parse(cache.set.mock.calls[0][1] as string)).toEqual(expected);
  });

  it('works for regular tokens, through authorizationCookieName cookie name', async () => {
    jest.useFakeTimers({
      now: 1600000004000,
    });

    const helper = AuthHelper.fromConfig(
      new ConfigReader({
        teamName: 'mock-team',
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
});
