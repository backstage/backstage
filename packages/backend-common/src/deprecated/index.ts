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

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { HostDiscovery as _HostDiscovery } from '../../../backend-defaults/src/entrypoints/discovery/HostDiscovery';

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { CacheManager as _CacheManager } from '../../../backend-defaults/src/entrypoints/cache/CacheManager';

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  type PluginCacheManager as _PluginCacheManager,
  type CacheManagerOptions as _CacheManagerOptions,
} from '../../../backend-defaults/src/entrypoints/cache/types';

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  dropDatabase as _dropDatabase,
  DatabaseManager as _DatabaseManager,
  type DatabaseManagerOptions as _DatabaseManagerOptions,
  type LegacyRootDatabaseService as _LegacyRootDatabaseService,
} from '../../../backend-defaults/src/entrypoints/database/DatabaseManager';

import {
  DiscoveryService,
  CacheService,
  CacheServiceOptions,
  CacheServiceSetOptions,
  DatabaseService as _PluginDatabaseManager,
  isDatabaseConflictError as _isDatabaseConflictError,
  resolvePackagePath as _resolvePackagePath,
  resolveSafeChildPath as _resolveSafeChildPath,
  isChildPath as _isChildPath,
  LifecycleService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';

export * from './hot';
export * from './config';
export * from './scm';
export * from './tokens';
export * from './logging';
export * from './service';
export * from './middleware';
export * from './util';

/**
 * @public
 * @deprecated Use `DiscoveryService` from `@backstage/backend-plugin-api` instead
 */
export type PluginEndpointDiscovery = DiscoveryService;

/**
 * HostDiscovery is a basic PluginEndpointDiscovery implementation
 * that can handle plugins that are hosted in a single or multiple deployments.
 *
 * The deployment may be scaled horizontally, as long as the external URL
 * is the same for all instances. However, internal URLs will always be
 * resolved to the same host, so there won't be any balancing of internal traffic.
 *
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/discovery` instead.
 */
export class HostDiscovery implements DiscoveryService {
  /**
   * Creates a new HostDiscovery discovery instance by reading
   * from the `backend` config section, specifically the `.baseUrl` for
   * discovering the external URL, and the `.listen` and `.https` config
   * for the internal one.
   *
   * Can be overridden in config by providing a target and corresponding plugins in `discovery.endpoints`.
   * eg.
   * ```yaml
   * discovery:
   *  endpoints:
   *    - target: https://internal.example.com/internal-catalog
   *      plugins: [catalog]
   *    - target: https://internal.example.com/secure/api/{{pluginId}}
   *      plugins: [auth, permission]
   *    - target:
   *        internal: https://internal.example.com/search
   *        external: https://example.com/search
   *      plugins: [search]
   * ```
   *
   * The basePath defaults to `/api`, meaning the default full internal
   * path for the `catalog` plugin will be `http://localhost:7007/api/catalog`.
   */
  static fromConfig(config: Config, options?: { basePath?: string }) {
    return new HostDiscovery(_HostDiscovery.fromConfig(config, options));
  }

  private constructor(private readonly impl: _HostDiscovery) {}

  async getBaseUrl(pluginId: string): Promise<string> {
    return this.impl.getBaseUrl(pluginId);
  }

  async getExternalBaseUrl(pluginId: string): Promise<string> {
    return this.impl.getExternalBaseUrl(pluginId);
  }
}

/**
 * SingleHostDiscovery is a basic PluginEndpointDiscovery implementation
 * that assumes that all plugins are hosted in a single deployment.
 *
 * The deployment may be scaled horizontally, as long as the external URL
 * is the same for all instances. However, internal URLs will always be
 * resolved to the same host, so there won't be any balancing of internal traffic.
 *
 * @public
 * @deprecated Use `HostDiscovery` from `@backstage/backend-defaults/discovery` instead
 */
export { HostDiscovery as SingleHostDiscovery };

/**
 * @public
 * @deprecated Use `CacheManager` from the `@backstage/backend-defaults` package instead
 */
export class CacheManager extends _CacheManager {}

/**
 * @public
 * @deprecated Use `CacheManagerOptions` from the `@backstage/backend-defaults` package instead
 */
export type CacheManagerOptions = _CacheManagerOptions;

/**
 * @public
 * @deprecated Use `PluginCacheManager` from the `@backstage/backend-defaults` package instead
 */
export type PluginCacheManager = _PluginCacheManager;

/**
 * @public
 * @deprecated Use `CacheService` from the `@backstage/backend-plugin-api` package instead
 */
export type CacheClient = CacheService;

/**
 * @public
 * @deprecated Use `CacheServiceSetOptions` from the `@backstage/backend-plugin-api` package instead
 */
export type CacheClientSetOptions = CacheServiceSetOptions;

/**
 * @public
 * @deprecated Use `CacheServiceOptions` from the `@backstage/backend-plugin-api` package instead
 */
export type CacheClientOptions = CacheServiceOptions;

/**
 * @public
 * @deprecated Use `DatabaseManager` from the `@backstage/backend-defaults` package instead
 */
export class DatabaseManager implements LegacyRootDatabaseService {
  private constructor(private readonly _databaseManager: _DatabaseManager) {}

  static fromConfig(
    config: Config,
    options?: DatabaseManagerOptions,
  ): DatabaseManager {
    const _databaseManager = _DatabaseManager.fromConfig(config, options);
    return new DatabaseManager(_databaseManager);
  }

  forPlugin(
    pluginId: string,
    deps?:
      | { lifecycle: LifecycleService; pluginMetadata: PluginMetadataService }
      | undefined,
  ): PluginDatabaseManager {
    return this._databaseManager.forPlugin(pluginId, deps);
  }
}

/**
 * @public
 * @deprecated Use `DatabaseManagerOptions` from the `@backstage/backend-defaults` package instead
 */
export type DatabaseManagerOptions = _DatabaseManagerOptions;

/**
 * @public
 * @deprecated Use `DatabaseService` from the `@backstage/backend-plugin-api` package instead
 */
export type PluginDatabaseManager = _PluginDatabaseManager;

/**
 * @public
 * @deprecated Use `LegacyRootDatabaseService` from the `@backstage/backend-defaults` package instead
 */
export type LegacyRootDatabaseService = _LegacyRootDatabaseService;

/**
 * @public
 * @deprecated Use `dropDatabase` from the `@backstage/backend-defaults` package instead
 */
export const dropDatabase = _dropDatabase;

/**
 * @public
 * @deprecated This function is deprecated and will be removed in a future release, see https://github.com/backstage/backstage/issues/24493.
 * Please use the `isDatabaseConflictError` function from the `@backstage/backend-plugin-api` package instead.
 */
export const isDatabaseConflictError = _isDatabaseConflictError;

/**
 * @public
 * @deprecated This function is deprecated and will be removed in a future release, see https://github.com/backstage/backstage/issues/24493.
 * Please use the `resolvePackagePath` function from the `@backstage/backend-plugin-api` package instead.
 */
export const resolvePackagePath = _resolvePackagePath;

/**
 * @public
 * @deprecated This function is deprecated and will be removed in a future release, see https://github.com/backstage/backstage/issues/24493.
 * Please use the `resolveSafeChildPath` function from the `@backstage/backend-plugin-api` package instead.
 */
export const resolveSafeChildPath = _resolveSafeChildPath;

/**
 * @public
 * @deprecated This function is deprecated and will be removed in a future release, see https://github.com/backstage/backstage/issues/24493.
 * Please use the `isChildPath` function from the `@backstage/cli-common` package instead.
 */
export const isChildPath = _isChildPath;
