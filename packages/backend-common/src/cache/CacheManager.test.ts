/*
 * Copyright 2021 Spotify AB
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
import cacheManager from 'cache-manager';
import { DefaultCacheClient } from './CacheClient';
import { CacheManager } from './CacheManager';

cacheManager.caching = jest.fn() as jest.Mock;
jest.mock('./CacheClient', () => {
  return {
    DefaultCacheClient: jest.fn(),
  };
});

describe('CacheManager', () => {
  const defaultConfigOptions = {
    backend: {
      cache: {
        store: 'memory',
      },
    },
  };
  const defaultConfig = () => new ConfigReader(defaultConfigOptions);

  afterEach(() => jest.resetAllMocks());

  describe('CacheManager.fromConfig', () => {
    it('accesses the backend.cache key', () => {
      const getOptionalConfig = jest.fn();
      const getOptionalString = jest.fn();
      const config = defaultConfig();
      config.getOptionalConfig = getOptionalConfig;
      config.getOptionalString = getOptionalString;

      CacheManager.fromConfig(config);

      expect(getOptionalString.mock.calls[0][0]).toEqual('backend.cache.store');
      expect(getOptionalConfig.mock.calls[0][0]).toEqual(
        'backend.cache.connection',
      );
    });

    it('does not require the backend.cache key', () => {
      const config = new ConfigReader({ backend: {} });
      expect(() => {
        CacheManager.fromConfig(config);
      }).not.toThrowError();
    });

    it('throws on unknown cache store', () => {
      const config = new ConfigReader({
        backend: { cache: { store: 'notreal' } },
      });
      expect(() => {
        CacheManager.fromConfig(config);
      }).toThrowError();
    });
  });

  describe('CacheManager.forPlugin', () => {
    const manager = CacheManager.fromConfig(defaultConfig());

    it('connects to a cache store scoped to the plugin', async () => {
      const pluginId = 'test1';
      const expectedTtl = 3600;
      manager.forPlugin(pluginId).getClient({ defaultTtl: expectedTtl });

      const client = DefaultCacheClient as jest.Mock;
      expect(client).toHaveBeenCalledTimes(1);
    });

    it('provides different plugins different cache clients', async () => {
      const plugin1Id = 'test1';
      const plugin2Id = 'test2';
      const expectedTtl = 3600;
      manager.forPlugin(plugin1Id).getClient({ defaultTtl: expectedTtl });
      manager.forPlugin(plugin2Id).getClient({ defaultTtl: expectedTtl });

      const cache = cacheManager.caching as jest.Mock;
      const client = DefaultCacheClient as jest.Mock;
      expect(cache).toHaveBeenCalledTimes(2);
      expect(client).toHaveBeenCalledTimes(2);

      const plugin1CallArgs = client.mock.calls[0];
      const plugin2CallArgs = client.mock.calls[1];
      expect(plugin1CallArgs[0].pluginId).not.toEqual(
        plugin2CallArgs[0].pluginId,
      );
    });
  });

  describe('CacheManager.forPlugin stores', () => {
    it('returns none client when no cache is configured', () => {
      const manager = CacheManager.fromConfig(
        new ConfigReader({ backend: {} }),
      );
      const expectedTtl = 3600;
      manager.forPlugin('test').getClient({ defaultTtl: expectedTtl });

      const cache = cacheManager.caching as jest.Mock;
      const mockCalls = cache.mock.calls.splice(-1);
      const callArgs = mockCalls[0];
      expect(callArgs[0]).toMatchObject({
        store: 'none',
        ttl: expectedTtl,
      });
    });

    it('returns memory client when configured', () => {
      const manager = CacheManager.fromConfig(defaultConfig());
      const expectedTtl = 3600;
      manager.forPlugin('test').getClient({ defaultTtl: expectedTtl });

      const cache = cacheManager.caching as jest.Mock;
      const mockCalls = cache.mock.calls.splice(-1);
      const callArgs = mockCalls[0];
      expect(callArgs[0]).toMatchObject({
        store: 'memory',
        ttl: expectedTtl,
      });
    });

    it('returns a memcache client when configured', () => {
      const expectedHost = '127.0.0.1:11211';
      const expectedTimeout = 1000;
      const manager = CacheManager.fromConfig(
        new ConfigReader({
          backend: {
            cache: {
              store: 'memcache',
              connection: {
                hosts: [expectedHost],
                netTimeout: expectedTimeout,
              },
            },
          },
        }),
      );
      const expectedTtl = 3600;
      manager.forPlugin('test').getClient({ defaultTtl: expectedTtl });

      const cache = cacheManager.caching as jest.Mock;
      const mockCalls = cache.mock.calls.splice(-1);
      const callArgs = mockCalls[0];
      expect(callArgs[0]).toMatchObject({
        options: {
          hosts: [expectedHost],
          netTimeout: expectedTimeout,
        },
        ttl: expectedTtl,
      });
    });
  });
});
