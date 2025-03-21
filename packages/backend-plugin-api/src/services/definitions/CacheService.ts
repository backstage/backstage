/*
 * Copyright 2022 The Backstage Authors
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

import { HumanDuration, JsonValue } from '@backstage/types';

/**
 * Options passed to {@link CacheService.set}.
 *
 * @public
 */
export type CacheServiceSetOptions = {
  /**
   * Optional TTL (in milliseconds if given as a number). Defaults to the TTL provided when the client
   * was set up (or no TTL if none are provided).
   */
  ttl?: number | HumanDuration;
};

/**
 * Options passed to {@link CacheService.withOptions}.
 *
 * @public
 */
export type CacheServiceOptions = {
  /**
   * An optional default TTL (in milliseconds if given as a number) to be set when getting a client
   * instance. If not provided, data will persist indefinitely by default (or
   * can be configured per entry at set-time).
   */
  defaultTtl?: number | HumanDuration;
};

/**
 * A pre-configured, storage agnostic cache service suitable for use by
 * Backstage plugins.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/cache | service documentation} for more details.
 *
 * @public
 */
export interface CacheService {
  /**
   * Reads data from a cache store for the given key. If no data was found,
   * returns undefined.
   */
  get<TValue extends JsonValue>(key: string): Promise<TValue | undefined>;

  /**
   * Writes the given data to a cache store, associated with the given key. An
   * optional TTL may also be provided, otherwise it defaults to the TTL that
   * was provided when the client was instantiated.
   */
  set(
    key: string,
    value: JsonValue,
    options?: CacheServiceSetOptions,
  ): Promise<void>;

  /**
   * Removes the given key from the cache store.
   */
  delete(key: string): Promise<void>;

  /**
   * Creates a new {@link CacheService} instance with the given options.
   */
  withOptions(options: CacheServiceOptions): CacheService;
}
