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
import { IdentityAuthInjectorFetchMiddleware } from './IdentityAuthInjectorFetchMiddleware';
import { mockApis } from '@backstage/test-utils';

describe('IdentityAuthInjectorFetchMiddleware', () => {
  it('creates using defaults', async () => {
    const middleware = IdentityAuthInjectorFetchMiddleware.create({
      identityApi: undefined as any,
    });
    expect(middleware.allowUrl('anything')).toEqual(false);
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
    expect(middleware.allowUrl('https://example.com/api')).toEqual(true);
    expect(middleware.allowUrl('https://example.com/api/sss')).toEqual(true);
    expect(middleware.allowUrl('https://evil.com/api')).toEqual(false);
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
    expect(middleware.allowUrl('https://a.com')).toEqual(true);
    expect(middleware.allowUrl('https://a.com:8080')).toEqual(false);
    expect(middleware.allowUrl('https://a.com/sss')).toEqual(true);
    expect(middleware.allowUrl('http://b.com:8080')).toEqual(true);
  });

  it('injects the header only when a token is available', async () => {
    const identityApi = mockApis.identity.mock();

    const middleware = new IdentityAuthInjectorFetchMiddleware(
      identityApi,
      () => true,
      'Authorization',
      token => `Bearer ${token}`,
    );
    const inner = jest.fn();
    const outer = middleware.apply(inner);

    // No token available
    identityApi.getCredentials.mockResolvedValueOnce({ token: undefined });
    await outer(new Request('https://example.com'));
    expect([...inner.mock.calls[0][0].headers.entries()]).toEqual([]);

    // Supply a token, header gets added
    identityApi.getCredentials.mockResolvedValueOnce({ token: 'token' });
    await outer(new Request('https://example.com'));
    expect([...inner.mock.calls[1][0].headers.entries()]).toEqual([
      ['authorization', 'Bearer token'],
    ]);

    // Token no longer available
    identityApi.getCredentials.mockResolvedValueOnce({ token: undefined });
    await outer(new Request('https://example.com'));
    expect([...inner.mock.calls[2][0].headers.entries()]).toEqual([]);
  });

  it('does not overwrite an existing header with the same name', async () => {
    const identityApi = mockApis.identity({ token: 'token' });

    const middleware = new IdentityAuthInjectorFetchMiddleware(
      identityApi,
      () => true,
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

  describe('.getDiscoveryUrlPrefixes', () => {
    it('works with no endpoints', () => {
      const config = new ConfigReader({
        backend: { baseUrl: 'https://a.com' },
      });
      expect(
        IdentityAuthInjectorFetchMiddleware.getDiscoveryUrlPrefixes(config),
      ).toEqual([]);
    });

    it('works with endpoints', () => {
      const config = new ConfigReader({
        backend: { baseUrl: 'https://a.com' },
        discovery: {
          endpoints: [
            { target: 'https://b.com', plugins: ['p1'] },
            { target: 'https://c.com/{{pluginId}}', plugins: ['p2', 'p3'] },
            { target: { external: 'https://d.com' }, plugins: ['q1'] },
            {
              target: { external: 'https://e.com/{{pluginId}}' },
              plugins: ['q2', 'q3'],
            },
            {
              target: {
                external: 'https://{{ pluginId   }}.e.com/{{pluginId}}',
              },
              plugins: ['q4'],
            },
          ],
        },
      });
      expect(
        IdentityAuthInjectorFetchMiddleware.getDiscoveryUrlPrefixes(config),
      ).toEqual([
        'https://b.com',
        'https://c.com/p2',
        'https://c.com/p3',
        'https://d.com',
        'https://e.com/q2',
        'https://e.com/q3',
        'https://q4.e.com/q4',
      ]);
    });
  });
});
