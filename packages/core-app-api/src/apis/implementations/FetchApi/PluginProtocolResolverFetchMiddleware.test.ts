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

import { DiscoveryApi } from '@backstage/core-plugin-api';
import { PluginProtocolResolverFetchMiddleware } from './PluginProtocolResolverFetchMiddleware';

describe('PluginProtocolResolverFetchMiddleware', () => {
  it.each([['https://passthrough.com/a']])(
    'passes through regular URLs, %p',
    async url => {
      const resolve = jest.fn();
      const discoveryApi = { getBaseUrl: resolve } as unknown as DiscoveryApi;
      const middleware = new PluginProtocolResolverFetchMiddleware(
        discoveryApi,
      );
      const inner = jest.fn();
      const outer = middleware.apply(inner);

      await outer(url);
      expect(inner.mock.calls[0][0]).toBe(url);
      expect(resolve).not.toHaveBeenCalled();
    },
  );

  it.each([
    [
      'plugin://my-plugin/sub/path',
      'my-plugin',
      'https://real.com/base',
      'https://real.com/base/sub/path',
    ],
    [
      'plugin://my-plugin/sub/path/',
      'my-plugin',
      'https://real.com/base/',
      'https://real.com/base/sub/path/',
    ],
    ['plugin://x', 'x', 'http://real.com:8080', 'http://real.com:8080'],
    [
      'plugin://x/a/b?c=d&e=f#g',
      'x',
      'https://real.com/base',
      'https://real.com/base/a/b?c=d&e=f#g',
    ],
    [
      'plugin://x?c=d&e=f#g',
      'x',
      'https://real.com:8080/base',
      'https://real.com:8080/base?c=d&e=f#g',
    ],
    [
      'plugin://username:password@x?c=d&e=f#g',
      'x',
      'https://real.com:8080/base',
      'https://username:password@real.com:8080/base?c=d&e=f#g',
    ],
    [
      'plugin://x?c=d&e=f#g',
      'x',
      'https://username:password@real.com:8080/base',
      'https://username:password@real.com:8080/base?c=d&e=f#g',
    ],
  ])(
    'resolves backstage URLs, %p',
    async (original, host, resolved, result) => {
      const resolve = jest.fn();
      const discoveryApi = { getBaseUrl: resolve } as unknown as DiscoveryApi;
      const middleware = new PluginProtocolResolverFetchMiddleware(
        discoveryApi,
      );
      const inner = jest.fn();
      const outer = middleware.apply(inner);

      resolve.mockResolvedValueOnce(resolved);
      await outer(original);
      expect(inner.mock.calls[0][0]).toBe(result);
      expect(resolve).toHaveBeenLastCalledWith(host);
    },
  );

  it('properly supports transferring request bodies too', async () => {
    const resolve = jest.fn();
    const discoveryApi = { getBaseUrl: resolve } as unknown as DiscoveryApi;
    const middleware = new PluginProtocolResolverFetchMiddleware(discoveryApi);
    const inner = jest.fn();
    const outer = middleware.apply(inner);

    resolve.mockResolvedValue('https://elsewhere.com');

    await outer('plugin://a', {
      method: 'POST',
      body: '123',
    });

    expect(inner.mock.calls[0][0]).toBe('https://elsewhere.com');
    expect(inner.mock.calls[0][1].body).toBe('123');

    await outer(
      new Request('plugin://a', {
        method: 'POST',
        body: '123',
      }),
    );

    expect(inner.mock.calls[1][0]).toBe('https://elsewhere.com');
    expect(inner.mock.calls[1][1].body).toEqual(Buffer.from('123', 'utf8'));
  });
});
