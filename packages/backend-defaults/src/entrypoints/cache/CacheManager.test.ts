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
import KeyvRedis from '@keyv/redis';
import KeyvMemcache from '@keyv/memcache';
import { CacheManager } from './CacheManager';

// This test is in a separate file because the main test file uses other mocking
// that might interfere with this one.

// Contrived code because it's hard to spy on a default export
jest.mock('@keyv/redis', () => {
  const Actual = jest.requireActual('@keyv/redis');
  return jest.fn((...args: any[]) => {
    return new Actual(...args);
  });
});
jest.mock('@keyv/memcache', () => {
  const Actual = jest.requireActual('@keyv/memcache');
  return jest.fn((...args: any[]) => {
    return new Actual(...args);
  });
});

describe('CacheManager integration', () => {
  const caches = TestCaches.create();

  afterEach(jest.clearAllMocks);

  it.each(caches.eachSupportedId())(
    'only creates one underlying connection, %p',
    async cacheId => {
      const { store, connection } = await caches.init(cacheId);

      const manager = CacheManager.fromConfig(
        mockServices.rootConfig({
          data: { backend: { cache: { store, connection } } },
        }),
      );

      manager.forPlugin('p1').getClient();
      manager.forPlugin('p1').getClient({ defaultTtl: 200 });
      manager.forPlugin('p2').getClient();
      manager.forPlugin('p3').getClient({});

      if (store === 'redis') {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(KeyvRedis).toHaveBeenCalledTimes(1);
      } else if (store === 'memcache') {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(KeyvMemcache).toHaveBeenCalledTimes(1);
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

      const plugin1 = manager.forPlugin('p1').getClient();
      const plugin2a = manager.forPlugin('p2').getClient();
      const plugin2b = manager.forPlugin('p2').getClient({ defaultTtl: 2000 });

      await plugin1.set('a', 'plugin1');
      await plugin2a.set('a', 'plugin2a');
      await plugin2b.set('a', 'plugin2b');

      await expect(plugin1.get('a')).resolves.toBe('plugin1');
      await expect(plugin2a.get('a')).resolves.toBe('plugin2b');
      await expect(plugin2b.get('a')).resolves.toBe('plugin2b');
    },
  );
});
