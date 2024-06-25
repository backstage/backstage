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

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AzureUrlReader as _AzureUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/AzureUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { BitbucketCloudUrlReader as _BitbucketCloudUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/BitbucketCloudUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { BitbucketUrlReader as _BitbucketUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/BitbucketUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { BitbucketServerUrlReader as _BitbucketServerUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/BitbucketServerUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { GerritUrlReader as _GerritUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/GerritUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { GithubUrlReader as _GithubUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/GithubUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { GitlabUrlReader as _GitlabUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/GitlabUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { GiteaUrlReader as _GiteaUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/GiteaUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { HarnessUrlReader as _HarnessUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/HarnessUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AwsS3UrlReader as _AwsS3UrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/AwsS3UrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { FetchUrlReader as _FetchUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/FetchUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { UrlReaders as _UrlReaders } from '../../../backend-defaults/src/entrypoints/urlReader/lib/UrlReaders';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { ReadUrlResponseFactory as _ReadUrlResponseFactory } from '../../../backend-defaults/src/entrypoints/urlReader/lib/ReadUrlResponseFactory';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type { UrlReadersOptions as _UrlReadersOptions } from '../../../backend-defaults/src/entrypoints/urlReader/lib/UrlReaders';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type { FromReadableArrayOptions as _FromReadableArrayOptions } from '../../../backend-defaults/src/entrypoints/urlReader/lib/types';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type {
  ReaderFactory as _ReaderFactory,
  ReadTreeResponseFactory as _ReadTreeResponseFactory,
  ReadTreeResponseFactoryOptions as _ReadTreeResponseFactoryOptions,
  ReadUrlResponseFactoryFromStreamOptions as _ReadUrlResponseFactoryFromStreamOptions,
  UrlReaderPredicateTuple as _UrlReaderPredicateTuple,
} from '../../../backend-defaults/src/entrypoints/urlReader/lib/types';

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
  ReadTreeOptions as _ReadTreeOptions,
  ReadTreeResponse as _ReadTreeResponse,
  ReadTreeResponseFile as _ReadTreeResponseFile,
  ReadTreeResponseDirOptions as _ReadTreeResponseDirOptions,
  ReadUrlOptions as _ReadUrlOptions,
  ReadUrlResponse as _ReadUrlResponse,
  SearchOptions as _SearchOptions,
  SearchResponse as _SearchResponse,
  SearchResponseFile as _SearchResponseFile,
  UrlReaderService as _UrlReaderService,
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

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export class AzureUrlReader extends _AzureUrlReader {}

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export class BitbucketCloudUrlReader extends _BitbucketCloudUrlReader {}

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export class BitbucketUrlReader extends _BitbucketUrlReader {}

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export class BitbucketServerUrlReader extends _BitbucketServerUrlReader {}

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export class GerritUrlReader extends _GerritUrlReader {}

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export class GithubUrlReader extends _GithubUrlReader {}

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export class GitlabUrlReader extends _GitlabUrlReader {}

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export class GiteaUrlReader extends _GiteaUrlReader {}

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export class HarnessUrlReader extends _HarnessUrlReader {}

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export class AwsS3UrlReader extends _AwsS3UrlReader {}

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export class FetchUrlReader extends _FetchUrlReader {}

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export class UrlReaders extends _UrlReaders {}

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export class ReadUrlResponseFactory extends _ReadUrlResponseFactory {}

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export type UrlReadersOptions = _UrlReadersOptions;

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export type FromReadableArrayOptions = _FromReadableArrayOptions;

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export type ReaderFactory = _ReaderFactory;

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export type ReadTreeResponseFactory = _ReadTreeResponseFactory;

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export type ReadTreeResponseFactoryOptions = _ReadTreeResponseFactoryOptions;

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export type ReadUrlResponseFactoryFromStreamOptions =
  _ReadUrlResponseFactoryFromStreamOptions;

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export type UrlReaderPredicateTuple = _UrlReaderPredicateTuple;

/**
 * @public
 * @deprecated Use `UrlReaderServiceReadTreeOptions` from `@backstage/backend-plugin-api` instead
 */
export type ReadTreeOptions = _ReadTreeOptions;

/**
 * @public
 * @deprecated Use `UrlReaderServiceReadTreeResponse` from `@backstage/backend-plugin-api` instead
 */
export type ReadTreeResponse = _ReadTreeResponse;

/**
 * @public
 * @deprecated Use `UrlReaderServiceReadTreeResponseFile` from `@backstage/backend-plugin-api` instead
 */
export type ReadTreeResponseFile = _ReadTreeResponseFile;

/**
 * @public
 * @deprecated Use `UrlReaderServiceReadTreeResponseDirOptions` from `@backstage/backend-plugin-api` instead
 */
export type ReadTreeResponseDirOptions = _ReadTreeResponseDirOptions;

/**
 * @public
 * @deprecated Use `UrlReaderServiceReadUrlOptions` from `@backstage/backend-plugin-api` instead
 */
export type ReadUrlOptions = _ReadUrlOptions;

/**
 * @public
 * @deprecated Use `UrlReaderServiceReadUrlResponse` from `@backstage/backend-plugin-api` instead
 */
export type ReadUrlResponse = _ReadUrlResponse;

/**
 * @public
 * @deprecated Use `UrlReaderServiceSearchOptions` from `@backstage/backend-plugin-api` instead
 */
export type SearchOptions = _SearchOptions;

/**
 * @public
 * @deprecated Use `UrlReaderServiceSearchResponse` from `@backstage/backend-plugin-api` instead
 */
export type SearchResponse = _SearchResponse;

/**
 * @public
 * @deprecated Use `UrlReaderServiceSearchResponseFile` from `@backstage/backend-plugin-api` instead
 */
export type SearchResponseFile = _SearchResponseFile;

/**
 * @public
 * @deprecated Use `UrlReaderService` from `@backstage/backend-plugin-api` instead
 */
export type UrlReader = _UrlReaderService;
