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
import { Config } from '@backstage/config';
import type { Store } from 'express-rate-limit';
import KeyvRedis from '@keyv/redis';
import { RedisStore } from 'rate-limit-redis';

/**
 * Creates a store for `express-rate-limit` based on the configuration.
 *
 * @public
 */
export class RateLimitStoreFactory {
  constructor(private readonly config: Config) {}

  create(): Store | undefined {
    const storeType = this.config.getOptionalString('backend.rateLimit.store');
    if (!storeType) {
      return this.auto();
    }
    switch (storeType) {
      case 'redis':
        return this.redis();
      default:
        throw new Error(
          `Invalid 'backend.rateLimit.store' provided: ${storeType}`,
        );
    }
  }

  private auto(): Store | undefined {
    const cacheStore =
      this.config.getOptionalString('backend.cache.store') || 'memory';
    // Use redis as primary if available
    if (cacheStore === 'redis') {
      return this.redis();
    }

    // Fallback to undefined (memory)
    return undefined;
  }

  redis(): Store {
    const connectionString =
      this.config.getOptionalString('backend.cache.connection') || '';
    const useRedisSets =
      this.config.getOptionalBoolean('backend.cache.useRedisSets') ?? true;
    const keyv = new KeyvRedis(connectionString, {
      useRedisSets,
    });
    return new RedisStore({
      // Keyv uses ioredis under the hood
      sendCommand: (...args: string[]) => keyv.redis.call(...args),
    });
  }
}
