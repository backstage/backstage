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

import { Logger } from 'winston';
import { CacheClient } from './CacheClient';

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

/**
 * Options given when constructing a {@link CacheManager}.
 *
 * @public
 */
export type CacheManagerOptions = {
  /**
   * An optional logger for use by the PluginCacheManager.
   */
  logger?: Logger;

  /**
   * An optional handler for connection errors emitted from the underlying data
   * store.
   */
  onError?: (err: Error) => void;
};

/**
 * Manages access to cache stores that plugins get.
 *
 * @public
 */
export type PluginCacheManager = {
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
};
