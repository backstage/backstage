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

import { CacheService } from '@backstage/backend-plugin-api';
import type {
  Store,
  Options,
  IncrementResponse,
  ClientRateLimitInfo,
} from 'express-rate-limit';

type CacheStoreOptions = {
  /**
   * Optional field to differentiate hit countswhen multiple rate-limits are in use
   */
  prefix?: string;
  /**
   * The cache service to use for storing the hit counts.
   */
  cache: CacheService;
};

type CacheStoreValue = {
  totalHits: number;
  resetTime: number;
};

/**
 * A `Store` that stores the hit count for each client.
 */
export class RateLimitStore implements Store {
  /**
   * The duration of time before which all hit counts are reset (in milliseconds).
   * default: 15 minutes
   */
  windowMs: number = 15 * 60 * 1000;
  prefix: string;
  #cache: CacheService;

  private constructor(options: CacheStoreOptions) {
    this.prefix = options.prefix ?? 'rl_';
    this.#cache = options.cache;
  }

  static fromOptions(options: CacheStoreOptions): RateLimitStore {
    return new RateLimitStore(options);
  }

  #getDefaultValue() {
    return { totalHits: 0, resetTime: Date.now() + this.windowMs };
  }

  init(options: Partial<Options>): void {
    if (options.windowMs) {
      this.windowMs = options.windowMs;
    }
  }

  prefixKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get(key: string): Promise<ClientRateLimitInfo | undefined> {
    const value =
      (await this.#cache.get<CacheStoreValue>(this.prefixKey(key))) ??
      this.#getDefaultValue();
    return {
      totalHits: value.totalHits,
      resetTime: new Date(value.resetTime),
    };
  }

  async increment(key: string): Promise<IncrementResponse> {
    const value =
      (await this.#cache.get<CacheStoreValue>(this.prefixKey(key))) ??
      this.#getDefaultValue();
    const totalHits = value.totalHits + 1;
    const resetTime = value.resetTime;
    await this.#cache.set(
      this.prefixKey(key),
      { totalHits, resetTime },
      { ttl: this.windowMs },
    );
    return {
      totalHits,
      resetTime: new Date(resetTime),
    };
  }

  async decrement(key: string): Promise<void> {
    const value =
      (await this.#cache.get<CacheStoreValue>(this.prefixKey(key))) ??
      this.#getDefaultValue();
    const totalHits = value.totalHits > 0 ? value.totalHits - 1 : 0;
    const resetTime = value.resetTime;
    await this.#cache.set(
      this.prefixKey(key),
      { totalHits, resetTime },
      { ttl: this.windowMs },
    );
  }

  async resetKey(key: string): Promise<void> {
    await this.#cache.delete(this.prefixKey(key));
  }
}
