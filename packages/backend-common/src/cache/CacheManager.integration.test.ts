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

import { ConfigReader } from '@backstage/config';
import { CacheManager } from './CacheManager';
import KeyvRedis from '@keyv/redis';

// This test is in a separate file because the main test file uses other mocking
// that might interfere with this one.

// Contrived code because it's hard to spy on a default export
jest.mock('@keyv/redis', () => {
  const ActualKeyvRedis = jest.requireActual('@keyv/redis');
  return jest
    .fn()
    .mockImplementation((...args: any[]) => new ActualKeyvRedis(...args));
});

describe('CacheManager integration', () => {
  describe('redis', () => {
    it('only creates one underlying connection', async () => {
      const manager = CacheManager.fromConfig(
        new ConfigReader({
          backend: {
            cache: {
              store: 'redis',
              // no actual connection errors will be seen since we don't interact with it
              connection: 'redis://localhost:6379',
            },
          },
        }),
      );

      manager.forPlugin('p1').getClient();
      manager.forPlugin('p1').getClient({ defaultTtl: 200 });
      manager.forPlugin('p2').getClient();
      manager.forPlugin('p3').getClient({});

      expect(KeyvRedis).toHaveBeenCalledTimes(1);
    });

    it('interacts correctly with redis', async () => {
      // TODO(freben): This could be frameworkified as TestCaches just like
      // TestDatabases, but that will have to come some other day
      const connection =
        process.env.BACKSTAGE_TEST_CACHE_REDIS_CONNECTION_STRING;
      if (!connection) {
        return;
      }

      const manager = CacheManager.fromConfig(
        new ConfigReader({
          backend: {
            cache: {
              store: 'redis',
              connection,
            },
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
    });
  });
});
