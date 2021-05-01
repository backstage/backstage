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

import { Config } from '@backstage/config';
import cacheManager from 'cache-manager';
// @ts-expect-error
import Memcache from 'memcache-pp';
// @ts-expect-error
import memcachedStore from 'cache-manager-memcached-store';

/**
 * A Cache Manager, which is able to retrieve a `node-cache-manager`-compliant
 * cache client, configured according to app configuration. If no cache is
 * configured, or an unknown store is provided, a no-op cache instance will be
 * returned.
 */
export class CacheManager {
  private readonly storeGetterMap = {
    memcache: this.getMemcacheClient,
    memory: this.getMemoryClient,
    none: this.getNoneClient,
  };

  /**
   * Creates a new CacheManager instance by reading from the `backend` config
   * section, specifically the `.cache` key.
   *
   * @param config The loaded application configuration.
   */
  static fromConfig(config: Config): CacheManager {
    return new CacheManager(config.getConfig('backend.cache'));
  }

  private constructor(private readonly config: Config) {}

  getClientWithTtl(ttl: number): cacheManager.Cache {
    const store = this.config.getOptionalString(
      'store',
    ) as keyof CacheManager['storeGetterMap'];

    if (this.storeGetterMap.hasOwnProperty(store)) {
      return this.storeGetterMap[store].call(this, ttl);
    }
    return this.storeGetterMap.none.call(this, ttl);
  }

  private getMemcacheClient(ttl: number): cacheManager.Cache {
    const hosts = this.config.getStringArray('connection.hosts');
    const netTimeout = this.config.getOptionalNumber('connection.netTimeout');
    return cacheManager.caching({
      store: memcachedStore,
      driver: Memcache,
      options: {
        hosts,
        ...(netTimeout && { netTimeout }),
      },
      ttl,
    });
  }

  private getMemoryClient(ttl: number): cacheManager.Cache {
    return cacheManager.caching({
      store: 'memory',
      ttl,
    });
  }

  private getNoneClient(ttl: number): cacheManager.Cache {
    return cacheManager.caching({
      store: 'none',
      ttl,
    });
  }
}
