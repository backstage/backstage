/*
 * Copyright 2020 The Backstage Authors
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

import { LoggerService } from '@backstage/backend-plugin-api';
import { HumanDuration, durationToMilliseconds } from '@backstage/types';
import { RedisClusterOptions, KeyvRedisOptions } from '@keyv/redis';

/**
 * Options for Redis cache store.
 *
 * @public
 */
export type RedisCacheStoreOptions = {
  client?: KeyvRedisOptions;
  cluster?: RedisClusterOptions;
};

/**
 * Union type of all cache store options.
 *
 * @public
 */
export type CacheStoreOptions = RedisCacheStoreOptions;

/**
 * Options given when constructing a {@link CacheManager}.
 *
 * @public
 */
export type CacheManagerOptions = {
  /**
   * An optional logger for use by the PluginCacheManager.
   */
  logger?: LoggerService;

  /**
   * An optional handler for connection errors emitted from the underlying data
   * store.
   */
  onError?: (err: Error) => void;
};

export function ttlToMilliseconds(ttl: number | HumanDuration): number {
  return typeof ttl === 'number' ? ttl : durationToMilliseconds(ttl);
}
