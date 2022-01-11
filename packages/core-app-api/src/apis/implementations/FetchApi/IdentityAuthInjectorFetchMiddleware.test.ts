/*
 * Copyright 2021 The Backstage Authors
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
import { IdentityApi } from '@backstage/core-plugin-api';
import { IdentityAuthInjectorFetchMiddleware } from './IdentityAuthInjectorFetchMiddleware';

describe('IdentityAuthInjectorFetchMiddleware', () => {
  it('creates using defaults', async () => {
    const middleware = IdentityAuthInjectorFetchMiddleware.create({
      identityApi: undefined as any,
    });
    expect(middleware.urlPrefixAllowlist).toEqual([]);
    expect(middleware.headerName).toEqual('authorization');
    expect(middleware.headerValue('t')).toEqual('Bearer t');
  });

  it('creates using config', async () => {
    const middleware = IdentityAuthInjectorFetchMiddleware.create({
      identityApi: undefined as any,
      config: new ConfigReader({
        backend: { baseUrl: 'https://example.com/api' },
      }),
      header: { name: 'auth', value: t => `${t}!` },
    });
    expect(middleware.urlPrefixAllowlist).toEqual(['https://example.com/api']);
    expect(middleware.headerName).toEqual('auth');
    expect(middleware.headerValue('t')).toEqual('t!');
  });

  it('creates using explicit allowlist', async () => {
    const middleware = IdentityAuthInjectorFetchMiddleware.create({
      identityApi: undefined as any,
      config: new ConfigReader({
        backend: { baseUrl: 'https://example.com/api' },
      }),
      urlPrefixAllowlist: ['https://a.com', 'http://b.com:8080/'],
    });
    expect(middleware.urlPrefixAllowlist).toEqual([
      'https://a.com',
      'http://b.com:8080',
    ]);
  });

  it('injects the header only when a token is available', async () => {
    const tokenFunction = jest.fn();
    const identityApi = {
      getCredentials: tokenFunction,
    } as unknown as IdentityApi;

    const middleware = new IdentityAuthInjectorFetchMiddleware(
      identityApi,
      ['https://example.com'],
      'Authorization',
      token => `Bearer ${token}`,
    );
    const inner = jest.fn();
    const outer = middleware.apply(inner);

    // No token available
    tokenFunction.mockResolvedValueOnce({ token: undefined });
    await outer(new Request('https://example.com'));
    expect([...inner.mock.calls[0][0].headers.entries()]).toEqual([]);

    // Supply a token, header gets added
    tokenFunction.mockResolvedValueOnce({ token: 'token' });
    await outer(new Request('https://example.com'));
    expect([...inner.mock.calls[1][0].headers.entries()]).toEqual([
      ['authorization', 'Bearer token'],
    ]);

    // Token no longer available
    tokenFunction.mockResolvedValueOnce({ token: undefined });
    await outer(new Request('https://example.com'));
    expect([...inner.mock.calls[2][0].headers.entries()]).toEqual([]);
  });

  it('does not overwrite an existing header with the same name', async () => {
    const identityApi = {
      getCredentials: () => ({ token: 'token' }),
    } as unknown as IdentityApi;

    const middleware = new IdentityAuthInjectorFetchMiddleware(
      identityApi,
      ['https://example.com'],
      'Authorization',
      token => `Bearer ${token}`,
    );
    const inner = jest.fn();
    const outer = middleware.apply(inner);

    // No token available
    await outer(new Request('https://example.com'));
    expect([...inner.mock.calls[0][0].headers.entries()]).toEqual([
      ['authorization', 'Bearer token'],
    ]);

    // Supply a token, header gets added
    await outer(
      new Request('https://example.com', {
        headers: { authorization: 'do-not-clobber' },
      }),
    );
    expect([...inner.mock.calls[1][0].headers.entries()]).toEqual([
      ['authorization', 'do-not-clobber'],
    ]);
  });

  it('does not affect requests outside the allowlist', async () => {
    const identityApi = {
      getCredentials: () => ({ token: 'token' }),
    } as unknown as IdentityApi;

    const middleware = new IdentityAuthInjectorFetchMiddleware(
      identityApi,
      ['https://example.com:8080/root'],
      'Authorization',
      token => `Bearer ${token}`,
    );

    const inner = jest.fn();
    const outer = middleware.apply(inner);

    await outer(new Request('https://example.com:8080/root'));
    await outer(new Request('https://example.com:8080/root/sub'));
    await outer(new Request('https://example.com:8080/root2'));
    await outer(new Request('https://example.com/root'));
    await outer(new Request('http://example.com:8080/root'));
    await outer(new Request('https://example.com/root'));

    const no: string[][] = [];
    const yes: string[][] = [['authorization', 'Bearer token']];
    expect([...inner.mock.calls[0][0].headers.entries()]).toEqual(yes);
    expect([...inner.mock.calls[1][0].headers.entries()]).toEqual(yes);
    expect([...inner.mock.calls[2][0].headers.entries()]).toEqual(no);
    expect([...inner.mock.calls[3][0].headers.entries()]).toEqual(no);
    expect([...inner.mock.calls[4][0].headers.entries()]).toEqual(no);
    expect([...inner.mock.calls[5][0].headers.entries()]).toEqual(no);
  });
});
