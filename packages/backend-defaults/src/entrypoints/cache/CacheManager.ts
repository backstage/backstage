/*
 * Copyright 2021 The Backstage Authors
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

import {
  CacheService,
  CacheServiceOptions,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import Keyv from 'keyv';
import { DefaultCacheClient } from './CacheClient';
import {
  CacheManagerOptions,
  ttlToMilliseconds,
  CacheStoreOptions,
  RedisCacheStoreOptions,
} from './types';
import { durationToMilliseconds } from '@backstage/types';
import { readDurationFromConfig } from '@backstage/config';

type StoreFactory = (pluginId: string, defaultTtl: number | undefined) => Keyv;

/**
 * Implements a Cache Manager which will automatically create new cache clients
 * for plugins when requested. All requested cache clients are created with the
 * connection details provided.
 *
 * @public
 */
export class CacheManager {
  /**
   * Keys represent supported `backend.cache.store` values, mapped to factories
   * that return Keyv instances appropriate to the store.
   */
  private readonly storeFactories = {
    redis: this.createRedisStoreFactory(),
    memcache: this.createMemcacheStoreFactory(),
    memory: this.createMemoryStoreFactory(),
  };

  private readonly logger?: LoggerService;
  private readonly store: keyof CacheManager['storeFactories'];
  private readonly connection: string;
  private readonly errorHandler: CacheManagerOptions['onError'];
  private readonly defaultTtl?: number;
  private readonly storeOptions?: CacheStoreOptions;

  /**
   * Creates a new {@link CacheManager} instance by reading from the `backend`
   * config section, specifically the `.cache` key.
   *
   * @param config - The loaded application configuration.
   */
  static fromConfig(
    config: RootConfigService,
    options: CacheManagerOptions = {},
  ): CacheManager {
    // If no `backend.cache` config is provided, instantiate the CacheManager
    // with an in-memory cache client.
    const store = config.getOptionalString('backend.cache.store') || 'memory';
    const defaultTtlConfig = config.getOptional('backend.cache.defaultTtl');
    const connectionString =
      config.getOptionalString('backend.cache.connection') || '';
    const logger = options.logger?.child({
      type: 'cacheManager',
    });

    if (config.has('backend.cache.useRedisSets')) {
      logger?.warn(
        "The 'backend.cache.useRedisSets' configuration key is deprecated and no longer has any effect. The underlying '@keyv/redis' library no longer supports redis sets.",
      );
    }

    let defaultTtl: number | undefined;
    if (defaultTtlConfig !== undefined) {
      if (typeof defaultTtlConfig === 'number') {
        defaultTtl = defaultTtlConfig;
      } else {
        defaultTtl = durationToMilliseconds(
          readDurationFromConfig(config, { key: 'backend.cache.defaultTtl' }),
        );
      }
    }

    // Read store-specific options from config
    const storeOptions = CacheManager.parseStoreOptions(store, config, logger);

    return new CacheManager(
      store,
      connectionString,
      options.onError,
      logger,
      defaultTtl,
      storeOptions,
    );
  }

  /**
   * Parse store-specific options from configuration.
   *
   * @param store - The cache store type ('redis', 'memcache', or 'memory')
   * @param config - The configuration service
   * @param logger - Optional logger for warnings
   * @returns The parsed store options
   */
  private static parseStoreOptions(
    store: string,
    config: RootConfigService,
    logger?: LoggerService,
  ): CacheStoreOptions | undefined {
    const storeConfigPath = `backend.cache.${store}`;

    if (store === 'redis' && config.has(storeConfigPath)) {
      return CacheManager.parseRedisOptions(storeConfigPath, config, logger);
    }

    return undefined;
  }

  /**
   * Parse Redis-specific options from configuration.
   */
  private static parseRedisOptions(
    storeConfigPath: string,
    config: RootConfigService,
    logger?: LoggerService,
  ): RedisCacheStoreOptions {
    const redisOptions: RedisCacheStoreOptions = {};
    const redisConfig = config.getConfig(storeConfigPath);

    redisOptions.client = {
      namespace: redisConfig.getOptionalString('client.namespace'),
      keyPrefixSeparator:
        redisConfig.getOptionalString('client.keyPrefixSeparator') || ':',
      clearBatchSize: redisConfig.getOptionalNumber('client.clearBatchSize'),
      useUnlink: redisConfig.getOptionalBoolean('client.useUnlink'),
      noNamespaceAffectsAll: redisConfig.getOptionalBoolean(
        'client.noNamespaceAffectsAll',
      ),
    };

    if (redisConfig.has('cluster')) {
      const clusterConfig = redisConfig.getConfig('cluster');

      if (!clusterConfig.has('rootNodes')) {
        logger?.warn(
          `Redis cluster config has no 'rootNodes' key, defaulting to non-clustered mode`,
        );
        return redisOptions;
      }

      redisOptions.cluster = {
        rootNodes: clusterConfig.get('rootNodes'),
        defaults: clusterConfig.getOptional('defaults'),
        minimizeConnections: clusterConfig.getOptionalBoolean(
          'minimizeConnections',
        ),
        useReplicas: clusterConfig.getOptionalBoolean('useReplicas'),
        maxCommandRedirections: clusterConfig.getOptionalNumber(
          'maxCommandRedirections',
        ),
      };
    }

    return redisOptions;
  }

  /** @internal */
  constructor(
    store: string,
    connectionString: string,
    errorHandler: CacheManagerOptions['onError'],
    logger?: LoggerService,
    defaultTtl?: number,
    storeOptions?: CacheStoreOptions,
  ) {
    if (!this.storeFactories.hasOwnProperty(store)) {
      throw new Error(`Unknown cache store: ${store}`);
    }
    this.logger = logger;
    this.store = store as keyof CacheManager['storeFactories'];
    this.connection = connectionString;
    this.errorHandler = errorHandler;
    this.defaultTtl = defaultTtl;
    this.storeOptions = storeOptions;
  }

  /**
   * Generates a PluginCacheManager for consumption by plugins.
   *
   * @param pluginId - The plugin that the cache manager should be created for.
   *        Plugin names should be unique.
   */
  forPlugin(pluginId: string): CacheService {
    const clientFactory = (options: CacheServiceOptions) => {
      const ttl = options.defaultTtl ?? this.defaultTtl;
      return this.getClientWithTtl(
        pluginId,
        ttl !== undefined ? ttlToMilliseconds(ttl) : undefined,
      );
    };

    return new DefaultCacheClient(clientFactory({}), clientFactory, {});
  }

  private getClientWithTtl(pluginId: string, ttl: number | undefined): Keyv {
    return this.storeFactories[this.store](pluginId, ttl);
  }

  private createRedisStoreFactory(): StoreFactory {
    const KeyvRedis = require('@keyv/redis').default;
    const { createCluster } = require('@keyv/redis');
    const stores: Record<string, typeof KeyvRedis> = {};

    return (pluginId, defaultTtl) => {
      if (!stores[pluginId]) {
        const redisOptions = this.storeOptions?.client || {
          keyPrefixSeparator: ':',
        };
        if (this.storeOptions?.cluster) {
          // Create a Redis cluster
          const cluster = createCluster(this.storeOptions?.cluster);
          stores[pluginId] = new KeyvRedis(cluster, redisOptions);
        } else {
          // Create a regular Redis connection
          stores[pluginId] = new KeyvRedis(this.connection, redisOptions);
        }

        // Always provide an error handler to avoid stopping the process
        stores[pluginId].on('error', (err: Error) => {
          this.logger?.error('Failed to create redis cache client', err);
          this.errorHandler?.(err);
        });
      }
      return new Keyv({
        namespace: pluginId,
        ttl: defaultTtl,
        store: stores[pluginId],
        emitErrors: false,
        useKeyPrefix: false,
      });
    };
  }

  private createMemcacheStoreFactory(): StoreFactory {
    const KeyvMemcache = require('@keyv/memcache').default;
    const stores: Record<string, typeof KeyvMemcache> = {};

    return (pluginId, defaultTtl) => {
      if (!stores[pluginId]) {
        stores[pluginId] = new KeyvMemcache(this.connection);
        // Always provide an error handler to avoid stopping the process
        stores[pluginId].on('error', (err: Error) => {
          this.logger?.error('Failed to create memcache cache client', err);
          this.errorHandler?.(err);
        });
      }
      return new Keyv({
        namespace: pluginId,
        ttl: defaultTtl,
        emitErrors: false,
        store: stores[pluginId],
      });
    };
  }

  private createMemoryStoreFactory(): StoreFactory {
    const store = new Map();
    return (pluginId, defaultTtl) =>
      new Keyv({
        namespace: pluginId,
        ttl: defaultTtl,
        emitErrors: false,
        store,
      });
  }
}
