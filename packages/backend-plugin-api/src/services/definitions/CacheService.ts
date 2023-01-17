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

import { JsonValue } from '@backstage/types';

/**
 * Manages access to cache stores that plugins get.
 *
 * @public
 */
export interface CacheService {
  /**
   * Provides backend plugins cache connections for themselves.
   *
   * @remarks
   *
   * The purpose of this method is to allow plugins to get isolated data stores
   * so that plugins are discouraged from cache-level integration and/or cache
   * key collisions.
   */
  getClient: (options?: CacheClientOptions) => CacheClient;
}

/**
 * Options passed to {@link CacheClient.set}.
 *
 * @public
 */
export type CacheClientSetOptions = {
  /**
   * Optional TTL in milliseconds. Defaults to the TTL provided when the client
   * was set up (or no TTL if none are provided).
   */
  ttl?: number;
};

/**
 * A pre-configured, storage agnostic cache client suitable for use by
 * Backstage plugins.
 *
 * @public
 */
export interface CacheClient {
  /**
   * Reads data from a cache store for the given key. If no data was found,
   * returns undefined.
   */
  get(key: string): Promise<JsonValue | undefined>;

  /**
   * Writes the given data to a cache store, associated with the given key. An
   * optional TTL may also be provided, otherwise it defaults to the TTL that
   * was provided when the client was instantiated.
   */
  set(
    key: string,
    value: JsonValue,
    options?: CacheClientSetOptions,
  ): Promise<void>;

  /**
   * Removes the given key from the cache store.
   */
  delete(key: string): Promise<void>;
}

/**
 * Options given when constructing a {@link CacheClient}.
 *
 * @public
 */
export type CacheClientOptions = {
  /**
   * An optional default TTL (in milliseconds) to be set when getting a client
   * instance. If not provided, data will persist indefinitely by default (or
   * can be configured per entry at set-time).
   */
  defaultTtl?: number;
};
