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

import { mockServices, TestCaches } from '@backstage/backend-test-utils';
import KeyvRedis, { createCluster } from '@keyv/redis';
import KeyvMemcache from '@keyv/memcache';
import { CacheManager } from './CacheManager';

// This test is in a separate file because the main test file uses other mocking
// that might interfere with this one.

// Contrived code because it's hard to spy on a default export
jest.mock('@keyv/redis', () => {
  const Actual = jest.requireActual('@keyv/redis');
  const DefaultConstructor = Actual.default;
  return {
    ...Actual,
    __esModule: true,
    default: jest.fn((...args: any[]) => new DefaultConstructor(...args)),
    createCluster: jest.fn(),
  };
});
jest.mock('@keyv/memcache', () => {
  const Actual = jest.requireActual('@keyv/memcache');
  const DefaultConstructor = Actual.default;
  return {
    ...Actual,
    __esModule: true,
    default: jest.fn((...args: any[]) => new DefaultConstructor(...args)),
  };
});

describe('CacheManager integration', () => {
  const caches = TestCaches.create();

  afterEach(jest.clearAllMocks);

  it.each(caches.eachSupportedId())(
    'only creates one underlying connection per plugin, %p',
    async cacheId => {
      const { store, connection } = await caches.init(cacheId);

      const manager = CacheManager.fromConfig(
        mockServices.rootConfig({
          data: { backend: { cache: { store, connection } } },
        }),
      );

      manager.forPlugin('p1');
      manager.forPlugin('p1').withOptions({ defaultTtl: 200 });
      manager.forPlugin('p2');
      manager.forPlugin('p3').withOptions({});

      if (store === 'redis') {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(KeyvRedis).toHaveBeenCalledTimes(3);
      } else if (store === 'memcache') {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(KeyvMemcache).toHaveBeenCalledTimes(3);
      }
    },
  );

  it.each(caches.eachSupportedId())(
    'interacts correctly with store, %p',
    async cacheId => {
      const { store, connection } = await caches.init(cacheId);

      const manager = CacheManager.fromConfig(
        mockServices.rootConfig({
          data: {
            backend: { cache: { store, connection } },
          },
        }),
      );

      const plugin1 = manager.forPlugin('p1');
      const plugin2a = manager.forPlugin('p2');
      const plugin2b = manager
        .forPlugin('p2')
        .withOptions({ defaultTtl: 2000 });

      await plugin1.set('a', 'plugin1');
      await plugin2a.set('a', 'plugin2a');
      await plugin2b.set('a', 'plugin2b');

      await expect(plugin1.get('a')).resolves.toBe('plugin1');
      await expect(plugin2a.get('a')).resolves.toBe('plugin2b');
      await expect(plugin2b.get('a')).resolves.toBe('plugin2b');
    },
  );

  it.each(caches.eachSupportedId())(
    'supports both milliseconds and human durations throughout, %p',
    async cacheId => {
      const { store, connection } = await caches.init(cacheId);

      for (const defaultTtl of [200, { milliseconds: 200 }]) {
        const manager = CacheManager.fromConfig(
          mockServices.rootConfig({
            data: {
              backend: {
                cache: {
                  store,
                  connection,
                  defaultTtl,
                },
              },
            },
          }),
        ).forPlugin('p');

        const defaultClient = manager;
        const numberOverrideClient = manager.withOptions({ defaultTtl: 400 });
        const durationOverrideClient = manager.withOptions({
          defaultTtl: { milliseconds: 400 },
        });

        await defaultClient.set('a', 'x');
        await defaultClient.set('b', 'x');
        await numberOverrideClient.set('c', 'x');
        await durationOverrideClient.set('d', 'x');
        await defaultClient.set('e', 'x', { ttl: 400 });
        await defaultClient.set('f', 'x', { ttl: { milliseconds: 400 } });

        await expect(defaultClient.get('a')).resolves.toBe('x');
        await expect(defaultClient.get('b')).resolves.toBe('x');
        await expect(defaultClient.get('c')).resolves.toBe('x');
        await expect(defaultClient.get('d')).resolves.toBe('x');
        await expect(defaultClient.get('e')).resolves.toBe('x');
        await expect(defaultClient.get('f')).resolves.toBe('x');

        await new Promise(resolve => setTimeout(resolve, 50 + 200));

        await expect(defaultClient.get('a')).resolves.toBeUndefined();
        await expect(defaultClient.get('b')).resolves.toBeUndefined();
        await expect(defaultClient.get('c')).resolves.toBe('x');
        await expect(defaultClient.get('d')).resolves.toBe('x');
        await expect(defaultClient.get('e')).resolves.toBe('x');
        await expect(defaultClient.get('f')).resolves.toBe('x');

        await new Promise(resolve => setTimeout(resolve, 200));

        await expect(defaultClient.get('a')).resolves.toBeUndefined();
        await expect(defaultClient.get('b')).resolves.toBeUndefined();
        await expect(defaultClient.get('c')).resolves.toBeUndefined();
        await expect(defaultClient.get('d')).resolves.toBeUndefined();
        await expect(defaultClient.get('e')).resolves.toBeUndefined();
        await expect(defaultClient.get('f')).resolves.toBeUndefined();
      }
    },
  );

  it('rejects invalid defaultTtl', () => {
    expect(() =>
      CacheManager.fromConfig(
        mockServices.rootConfig({
          data: {
            backend: {
              cache: {
                store: 'memory',
              },
            },
          },
        }),
      ),
    ).not.toThrow();

    expect(() =>
      CacheManager.fromConfig(
        mockServices.rootConfig({
          data: {
            backend: {
              cache: {
                store: 'memory',
                defaultTtl: 'hello',
              },
            },
          },
        }),
      ),
    ).toThrow(/Invalid duration 'hello' in config/);
  });
});

describe('CacheManager store options', () => {
  it('uses default options when no store-specific config exists', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
            },
          },
        },
      }),
    );

    manager.forPlugin('p1');

    expect(KeyvRedis).toHaveBeenCalledWith('redis://localhost:6379', {
      keyPrefixSeparator: ':',
    });
  });

  it('defaults to non-clustered mode when cluster config is missing root nodes', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                cluster: {},
              },
            },
          },
        },
      }),
    );
    manager.forPlugin('p1');

    expect(KeyvRedis).toHaveBeenCalledWith('redis://localhost:6379', {
      keyPrefixSeparator: ':',
    });
  });

  it('uses cluster config when present', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                cluster: {
                  rootNodes: [{ url: 'redis://localhost:6379' }],
                },
              },
            },
          },
        },
      }),
    );
    manager.forPlugin('p1');

    expect(createCluster).toHaveBeenCalledWith({
      rootNodes: [{ url: 'redis://localhost:6379' }],
      defaults: undefined,
    });
  });

  it('respects client config for non-clustered mode', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                client: {
                  keyPrefixSeparator: '!',
                },
              },
            },
          },
        },
      }),
    );
    manager.forPlugin('p1');

    expect(KeyvRedis).toHaveBeenCalledWith('redis://localhost:6379', {
      keyPrefixSeparator: '!',
    });
  });

  it('accepts client config for clustered mode', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                client: {
                  keyPrefixSeparator: '!',
                },
                cluster: {
                  rootNodes: [{ url: 'redis://localhost:6379' }],
                },
              },
            },
          },
        },
      }),
    );
    manager.forPlugin('p1');

    expect(KeyvRedis).toHaveBeenCalledWith(expect.anything(), {
      keyPrefixSeparator: '!',
    });
  });
});
