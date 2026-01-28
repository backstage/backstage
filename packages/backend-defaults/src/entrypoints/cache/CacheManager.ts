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
  InfinispanClientBehaviorOptions,
  InfinispanServerConfig,
  ValkeyCacheStoreOptions,
} from './types';
import { InfinispanOptionsMapper } from './providers/infinispan/InfinispanOptionsMapper';
import { durationToMilliseconds } from '@backstage/types';
import { ConfigReader, readDurationFromConfig } from '@backstage/config';
import {
  InfinispanClientCacheInterface,
  InfinispanKeyvStore,
} from './providers/infinispan/InfinispanKeyvStore';

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
    valkey: this.createValkeyStoreFactory(),
    memcache: this.createMemcacheStoreFactory(),
    memory: this.createMemoryStoreFactory(),
    infinispan: this.createInfinispanStoreFactory(),
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
   * @param options - Optional configuration for the CacheManager.
   * @returns A new CacheManager instance.
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
        "The 'backend.cache.useRedisSets' configuration key is deprecated and no longer has any effect. The underlying '@keyv/redis' and '@keyv/valkey' libraries no longer support redis sets.",
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
   * @param store - The cache store type ('redis', 'valkey', 'memcache', 'infinispan', or 'memory')
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

    if (store !== 'memory' && !config.has(storeConfigPath)) {
      logger?.warn(
        `No configuration found for cache store '${store}' at '${storeConfigPath}'.`,
      );
    }

    switch (store) {
      case 'redis':
        return CacheManager.parseRedisOptions(storeConfigPath, config, logger);
      case 'valkey':
        return CacheManager.parseValkeyOptions(storeConfigPath, config, logger);
      case 'infinispan':
        return InfinispanOptionsMapper.parseInfinispanOptions(
          storeConfigPath,
          config,
          logger,
        );
      default:
        return undefined;
    }
  }

  /**
   * Parse Redis-specific options from configuration.
   */
  private static parseRedisOptions(
    storeConfigPath: string,
    config: RootConfigService,
    logger?: LoggerService,
  ): RedisCacheStoreOptions {
    const redisOptions: RedisCacheStoreOptions = {
      type: 'redis',
    };

    const redisConfig =
      config.getOptionalConfig(storeConfigPath) ?? new ConfigReader({});

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

    const clientConfig = redisConfig.getOptionalConfig('client');
    const socketConfig = clientConfig?.getOptionalConfig('socket');
    const keepAliveConfig = socketConfig?.getOptional('keepAlive');
    const keepAlive =
      typeof keepAliveConfig === 'boolean' ||
      typeof keepAliveConfig === 'number'
        ? keepAliveConfig
        : undefined;
    const keepAliveInitialDelay = socketConfig?.getOptionalNumber(
      'keepAliveInitialDelay',
    );

    if (typeof keepAlive === 'number' && keepAliveInitialDelay !== undefined) {
      logger?.warn(
        "Both 'client.socket.keepAlive' (number) and 'client.socket.keepAliveInitialDelay' are set. Prefer 'keepAlive: true' with 'keepAliveInitialDelay'. Using 'keepAliveInitialDelay' and treating keepAlive as enabled.",
      );
    }

    if (keepAlive === false && keepAliveInitialDelay !== undefined) {
      logger?.warn(
        "Both 'client.socket.keepAlive' (false) and 'client.socket.keepAliveInitialDelay' are set. Ignoring 'keepAliveInitialDelay' because keepalive is disabled.",
      );
    }

    let keepAliveForSocket: number | false | undefined;
    let keepAliveInitialDelayForSocket: number | undefined;

    if (keepAlive === false) {
      keepAliveForSocket = false;
    } else if (typeof keepAlive === 'number') {
      if (keepAliveInitialDelay !== undefined) {
        keepAliveInitialDelayForSocket = keepAliveInitialDelay;
      } else {
        keepAliveForSocket = keepAlive;
      }
    } else {
      keepAliveInitialDelayForSocket = keepAliveInitialDelay;
    }

    const socketOptions =
      keepAliveForSocket !== undefined ||
      keepAliveInitialDelayForSocket !== undefined
        ? {
            ...(keepAliveForSocket !== undefined
              ? { keepAlive: keepAliveForSocket }
              : {}),
            ...(keepAliveInitialDelayForSocket !== undefined
              ? { keepAliveInitialDelay: keepAliveInitialDelayForSocket }
              : {}),
          }
        : undefined;

    if (socketOptions) {
      redisOptions.socket = socketOptions;
    }

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

      if (redisOptions.socket) {
        redisOptions.cluster.defaults = {
          ...(redisOptions.cluster.defaults ?? {}),
          socket: {
            ...((redisOptions.cluster.defaults as { socket?: object })
              ?.socket ?? {}),
            ...redisOptions.socket,
          },
        };
      }
    }

    return redisOptions;
  }

  /**
   * Parse Valkey-specific options from configuration.
   */
  private static parseValkeyOptions(
    storeConfigPath: string,
    config: RootConfigService,
    logger?: LoggerService,
  ): ValkeyCacheStoreOptions {
    const valkeyOptions: ValkeyCacheStoreOptions = {
      type: 'valkey',
    };

    const valkeyConfig =
      config.getOptionalConfig(storeConfigPath) ?? new ConfigReader({});

    valkeyOptions.client = {
      keyPrefix: valkeyConfig.getOptionalString('client.keyPrefix'),
    };

    if (valkeyConfig.has('cluster')) {
      const clusterConfig = valkeyConfig.getConfig('cluster');

      if (!clusterConfig.has('rootNodes')) {
        logger?.warn(
          `Valkey cluster config has no 'rootNodes' key, defaulting to non-clustered mode`,
        );
        return valkeyOptions;
      }

      valkeyOptions.cluster = {
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

    return valkeyOptions;
  }

  /**
   * Construct the full namespace based on the options and pluginId.
   *
   * @param pluginId - The plugin ID to namespace
   * @param storeOptions - Optional cache store configuration options
   * @returns The constructed namespace string combining the configured namespace with pluginId
   */
  private static constructNamespace(
    pluginId: string,
    storeOptions: RedisCacheStoreOptions | ValkeyCacheStoreOptions | undefined,
  ): string {
    let prefix: string;
    switch (storeOptions?.type) {
      case 'redis':
        prefix = storeOptions?.client?.namespace
          ? `${storeOptions.client.namespace}${
              storeOptions.client.keyPrefixSeparator ?? ':'
            }`
          : '';
        break;
      case 'valkey':
        prefix = storeOptions.client?.keyPrefix ?? '';
        break;
      default:
        prefix = '';
    }

    return `${prefix}${pluginId}`;
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
      if (this.storeOptions?.type !== 'redis') {
        throw new Error(
          `Internal error: Wrong config type passed to redis factory: ${this.storeOptions?.type}`,
        );
      }
      const storeOptions = this.storeOptions as RedisCacheStoreOptions;
      if (!stores[pluginId]) {
        const redisOptions = storeOptions.client || {
          keyPrefixSeparator: ':',
        };
        if (storeOptions.cluster) {
          // Create a Redis cluster
          const cluster = createCluster(storeOptions.cluster);
          stores[pluginId] = new KeyvRedis(cluster, redisOptions);
        } else {
          // Create a regular Redis connection
          const connection = storeOptions.socket
            ? { url: this.connection, socket: storeOptions.socket }
            : this.connection;
          stores[pluginId] = new KeyvRedis(connection, redisOptions);
        }

        // Always provide an error handler to avoid stopping the process
        stores[pluginId].on('error', (err: Error) => {
          this.logger?.error('Failed to create redis cache client', err);
          this.errorHandler?.(err);
        });
      }
      return new Keyv({
        namespace: CacheManager.constructNamespace(pluginId, this.storeOptions),
        ttl: defaultTtl,
        store: stores[pluginId],
        emitErrors: false,
        useKeyPrefix: false,
      });
    };
  }

  private createValkeyStoreFactory(): StoreFactory {
    const KeyvValkey = require('@keyv/valkey').default;
    // `@keyv/valkey` doesn't export a `createCluster` function, but is compatible with the one from `@keyv/redis`
    // See https://keyv.org/docs/storage-adapters/valkey
    const { createCluster } = require('@keyv/redis');
    const stores: Record<string, typeof KeyvValkey> = {};

    return (pluginId, defaultTtl) => {
      if (this.storeOptions?.type !== 'valkey') {
        throw new Error(
          `Internal error: Wrong config type passed to valkey factory: ${this.storeOptions?.type}`,
        );
      }
      if (!stores[pluginId]) {
        const valkeyOptions = this.storeOptions?.client;
        if (this.storeOptions?.cluster) {
          // Create a Valkey cluster (Redis cluster under the hood)
          const cluster = createCluster(this.storeOptions?.cluster);
          stores[pluginId] = new KeyvValkey(cluster, valkeyOptions);
        } else {
          // Create a regular Valkey connection
          stores[pluginId] = new KeyvValkey(this.connection, valkeyOptions);
        }

        // Always provide an error handler to avoid stopping the process
        stores[pluginId].on('error', (err: Error) => {
          this.logger?.error('Failed to create valkey cache client', err);
          this.errorHandler?.(err);
        });
      }
      return new Keyv({
        namespace: CacheManager.constructNamespace(pluginId, this.storeOptions),
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

  private createInfinispanStoreFactory(): StoreFactory {
    const stores: Record<string, InfinispanKeyvStore> = {};

    return (pluginId, defaultTtl) => {
      if (this.storeOptions?.type !== 'infinispan') {
        throw new Error(
          `Internal error: Wrong config type passed to infinispan factory: ${this.storeOptions?.type}`,
        );
      }

      if (!stores[pluginId]) {
        // Use sync version for testing environments
        const isTest =
          process.env.NODE_ENV === 'test' || typeof jest !== 'undefined';

        // Create the client promise ONCE and reuse it
        const clientPromise: Promise<InfinispanClientCacheInterface> = isTest
          ? this.createInfinispanClientSync()
          : this.createInfinispanClientAsync();

        this.logger?.info(
          `Creating Infinispan cache client for plugin ${pluginId} isTest = ${isTest}`,
        );
        const storeInstance = new InfinispanKeyvStore({
          clientPromise,
          logger: this.logger!,
        });

        stores[pluginId] = storeInstance;

        // Always provide an error handler to avoid stopping the process
        storeInstance.on('error', (err: Error) => {
          this.logger?.error('Failed to create infinispan cache client', err);
          this.errorHandler?.(err);
        });
      }

      return new Keyv({
        namespace: pluginId,
        ttl: defaultTtl,
        store: stores[pluginId],
        emitErrors: false,
      });
    };
  }

  /**
   * Creates an Infinispan client using dynamic import (production use).
   * @returns Promise that resolves to an Infinispan client
   */
  private async createInfinispanClientAsync(): Promise<InfinispanClientCacheInterface> {
    return this.createInfinispanClient(false);
  }

  /**
   * Creates an Infinispan client using synchronous import (testing purposes).
   * @returns Promise that resolves to an Infinispan client
   */
  private createInfinispanClientSync(): Promise<InfinispanClientCacheInterface> {
    return this.createInfinispanClient(true);
  }

  /**
   * Creates an Infinispan client based on the provided configuration.
   * @param useSync - Whether to use synchronous import (for testing) or dynamic import
   * @returns Promise that resolves to an Infinispan client
   */
  private async createInfinispanClient(
    useSync: boolean = false,
  ): Promise<InfinispanClientCacheInterface> {
    try {
      this.logger?.info('Creating Infinispan client');

      if (this.storeOptions?.type === 'infinispan') {
        // Import infinispan based on the useSync parameter
        const infinispan = useSync
          ? require('infinispan')
          : await import('infinispan');

        const client = await infinispan.client(
          this.storeOptions.servers as InfinispanServerConfig[],
          this.storeOptions.options as InfinispanClientBehaviorOptions,
        );

        this.logger?.info('Infinispan client created successfully');
        return client;
      }
      throw new Error('Infinispan store options are not defined');
    } catch (error: any) {
      this.logger?.error('Failed to create Infinispan client', {
        error: error.message,
      });
      throw error;
    }
  }
}
