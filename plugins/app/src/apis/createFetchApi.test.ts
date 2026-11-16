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

import { mockApis } from '@backstage/frontend-test-utils';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { FetchMiddlewares } from '../../../../packages/core-app-api/src/apis/implementations';
import { createFetchApi } from './createFetchApi';

it.each([undefined, []])(
  'resolves plugin URLs with middleware %j and discovers on every request',
  async middleware => {
    const discoveryApi = mockApis.discovery.mock({
      getBaseUrl: jest
        .fn()
        .mockResolvedValueOnce('https://example.com/api/catalog')
        .mockResolvedValueOnce('https://other.com/catalog/'),
    });
    const baseImplementation = jest.fn().mockResolvedValue(new Response());
    const api = createFetchApi({
      discoveryApi,
      middleware,
      baseImplementation,
    });
    const init = { method: 'POST', body: 'body' };

    await api.fetch('plugin://catalog/entities?filter=x=y#part', init);
    await api.fetch(new URL('plugin://catalog/entities'), init);
    await api.fetch('https://external.com/path', init);

    expect(baseImplementation.mock.calls).toEqual([
      ['https://example.com/api/catalog/entities?filter=x=y#part', init],
      ['https://other.com/catalog/entities', init],
      ['https://external.com/path', init],
    ]);
    expect(discoveryApi.getBaseUrl.mock.calls).toEqual([
      ['catalog'],
      ['catalog'],
    ]);
  },
);

it('resolves before custom middleware and authentication without mutating the list', async () => {
  const discoveryApi = mockApis.discovery.mock({
    getBaseUrl: async () => 'https://example.com/api/catalog',
  });
  const identityApi = mockApis.identity({ token: 'my-token' });
  const baseImplementation = jest.fn().mockResolvedValue(new Response());
  const calls: string[] = [];
  const middleware = [
    {
      apply:
        (next: typeof fetch): typeof fetch =>
        async (input, init) => {
          calls.push(`first: ${input}`);
          const response = await next(input, init);
          calls.push('last');
          return response;
        },
    },
    {
      apply:
        (next: typeof fetch): typeof fetch =>
        async (input, init) => {
          calls.push(`second: ${input}`);
          return next(input, init);
        },
    },
    FetchMiddlewares.injectIdentityAuth({
      identityApi,
      urlPrefixAllowlist: ['https://example.com/api'],
    }),
  ];
  const originalMiddleware = [...middleware];
  const api = createFetchApi({ discoveryApi, baseImplementation, middleware });
  const request = new Request('plugin://catalog/entities', {
    headers: { 'x-custom': 'value' },
  });

  await api.fetch(request);
  expect(calls).toEqual([
    'first: https://example.com/api/catalog/entities',
    'second: https://example.com/api/catalog/entities',
    'last',
  ]);
  const sentRequest = baseImplementation.mock.calls[0][0] as Request;
  expect(sentRequest.url).toBe('https://example.com/api/catalog/entities');
  expect(sentRequest.headers.get('authorization')).toBe('Bearer my-token');
  expect(sentRequest.headers.get('x-custom')).toBe('value');
  expect(discoveryApi.getBaseUrl).toHaveBeenCalledTimes(1);
  expect(middleware).toEqual(originalMiddleware);

  await api.fetch('https://external.com/path');
  expect(baseImplementation).toHaveBeenLastCalledWith(
    'https://external.com/path',
    undefined,
  );
});

it('supports a single middleware and an explicit opt-out for custom protocol handling', async () => {
  const discoveryApi = mockApis.discovery.mock({
    getBaseUrl: async () => 'https://example.com/catalog',
  });
  const baseImplementation = jest.fn().mockResolvedValue(new Response());
  const apply = jest.fn((next: typeof fetch) => next);
  const api = createFetchApi({
    discoveryApi,
    baseImplementation,
    middleware: { apply },
  });
  await api.fetch('plugin://catalog/entities');
  expect(baseImplementation).toHaveBeenLastCalledWith(
    'https://example.com/catalog/entities',
    undefined,
  );
  expect(apply).toHaveBeenCalledTimes(1);

  discoveryApi.getBaseUrl.mockClear();
  const customApi = createFetchApi({
    discoveryApi,
    baseImplementation,
    resolvePluginProtocol: false,
    middleware: { apply },
  });
  await customApi.fetch('plugin://catalog/entities');
  expect(baseImplementation).toHaveBeenLastCalledWith(
    'plugin://catalog/entities',
  );
  expect(discoveryApi.getBaseUrl).not.toHaveBeenCalled();
});

it('defaults to the global fetch implementation', async () => {
  const baseImplementation = jest
    .spyOn(global, 'fetch')
    .mockResolvedValue(new Response());
  try {
    const api = createFetchApi({
      discoveryApi: mockApis.discovery.mock({
        getBaseUrl: async () => 'https://example.com/catalog',
      }),
    });
    await api.fetch('plugin://catalog');
    expect(baseImplementation).toHaveBeenCalledWith(
      'https://example.com/catalog',
      undefined,
    );
  } finally {
    baseImplementation.mockRestore();
  }
});
