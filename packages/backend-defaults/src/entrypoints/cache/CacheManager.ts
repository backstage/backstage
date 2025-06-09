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
  CacheStoreOptions,
  InfinispanAuthOptions,
  InfinispanCacheStoreOptions,
  InfinispanClientBehaviorOptions,
  InfinispanDataFormatOptions,
  InfinispanServerConfig,
  InfinispanSslOptions,
  RedisCacheStoreOptions,
  ttlToMilliseconds,
} from './types';
import { durationToMilliseconds } from '@backstage/types';
import { readDurationFromConfig } from '@backstage/config';

import { createInfinispanStoreFactory_sync_facade } from './InfinispanStoreFactory';

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
  private readonly storeFactories: {
    redis: StoreFactory;
    valkey: StoreFactory;
    memcache: StoreFactory;
    memory: StoreFactory;
    infinispan?: StoreFactory; // Infinispan factory is set conditionally
  };

  private readonly logger?: LoggerService;
  private readonly store: keyof CacheManager['storeFactories'];
  private readonly connection: string;
  private readonly errorHandler: CacheManagerOptions['onError'];
  private readonly defaultTtl?: number;
  private readonly storeOptions?: CacheStoreOptions;
  private infinispanClientShutdownMethod?: () => Promise<void>;

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
   * @param store - The cache store type ('redis', 'valkey', 'memcache', 'memory', or 'infinispan')
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

    if (store === 'redis' || store === 'valkey') {
      if (!config.has(storeConfigPath)) {
        return undefined;
      }
      return CacheManager.parseRedisOptions(storeConfigPath, config, logger);
    }

    if (store === 'infinispan') {
      if (!config.has(storeConfigPath)) {
        logger?.warn(
          `No configuration found for cache store '${store}' at '${storeConfigPath}'.`,
        );
        return undefined;
      }
      return CacheManager.parseInfinispanOptions(
        storeConfigPath,
        config,
        logger,
      );
    }

    // For memory and memcache, no store options are needed
    return undefined;
  }

  private static parseInfinispanOptions(
    storeConfigPath: string,
    config: RootConfigService,
    logger?: LoggerService,
  ): InfinispanCacheStoreOptions | undefined {
    const infinispanConfig = config.getConfig(storeConfigPath);
    const parsedOptions: Partial<InfinispanCacheStoreOptions> = {};

    if (infinispanConfig.has('servers')) {
      const serversConfig = infinispanConfig.get('servers');
      if (Array.isArray(serversConfig)) {
        parsedOptions.servers = infinispanConfig.getConfigArray('servers').map(
          serverConf =>
            ({
              host: serverConf.getString('host'),
              port: serverConf.getNumber('port'),
            } as InfinispanServerConfig),
        );
      } else if (typeof serversConfig === 'object' && serversConfig !== null) {
        const serverConf = infinispanConfig.getConfig('servers');
        parsedOptions.servers = {
          host: serverConf.getString('host'),
          port: serverConf.getNumber('port'),
        } as InfinispanServerConfig;
      } else {
        logger?.error(
          `Infinispan 'servers' configuration at ${storeConfigPath} must be an object or an array.`,
        );
        throw new Error(
          `Infinispan 'servers' configuration at ${storeConfigPath} is invalid.`,
        );
      }
    } else {
      logger?.error(
        `Infinispan configuration at ${storeConfigPath} is missing the 'servers' definition.`,
      );
      throw new Error(
        `Infinispan configuration at ${storeConfigPath} must define 'servers'.`,
      );
    }

    if (infinispanConfig.has('options')) {
      const clientOptsConfig = infinispanConfig.getConfig('options');
      const behaviorOptions: Partial<InfinispanClientBehaviorOptions> = {};

      const versionStr = clientOptsConfig.getOptionalString('version');
      if (
        versionStr === '2.9' ||
        versionStr === '2.5' ||
        versionStr === '2.2'
      ) {
        behaviorOptions.version = versionStr as '2.9' | '2.5' | '2.2';
      } else if (versionStr === undefined || versionStr === null) {
        behaviorOptions.version = versionStr;
      } else if (versionStr) {
        logger?.warn(
          `Invalid Infinispan client version "${versionStr}" in config at ${storeConfigPath}.options.version. Must be "2.9", "2.5", or "2.2". It will be ignored, and the client may use a default or fail.`,
        );
      }

      behaviorOptions.cacheName =
        clientOptsConfig.getOptionalString('cacheName');

      if (clientOptsConfig.has('dataFormat')) {
        const dataFormatConfig = clientOptsConfig.getConfig('dataFormat');
        const dataFormat: Partial<InfinispanDataFormatOptions> = {};

        if (dataFormatConfig.has('keyType')) {
          dataFormat.keyType = dataFormatConfig.getString('keyType');
        }
        if (dataFormatConfig.has('valueType')) {
          dataFormat.valueType = dataFormatConfig.getString('valueType');
        }

        behaviorOptions.dataFormat = dataFormat as InfinispanDataFormatOptions;
      }

      if (clientOptsConfig.has('authentication')) {
        const authConfig = clientOptsConfig.getConfig('authentication');
        const auth: Partial<InfinispanAuthOptions> = {};

        if (authConfig.has('enabled')) {
          auth.enabled = authConfig.getBoolean('enabled');
        }
        if (authConfig.has('saslMechanism')) {
          auth.saslMechanism = authConfig.getString('saslMechanism');
        }
        if (authConfig.has('userName')) {
          auth.userName = authConfig.getString('userName');
        }
        if (authConfig.has('password')) {
          auth.password = authConfig.getString('password');
        }

        behaviorOptions.authentication = auth as InfinispanAuthOptions;
      }

      if (clientOptsConfig.has('ssl')) {
        const sslConfig = clientOptsConfig.getConfig('ssl');
        const ssl: Partial<InfinispanSslOptions> = {};

        if (sslConfig.has('enabled')) {
          ssl.enabled = sslConfig.getBoolean('enabled');
        }
        if (sslConfig.has('secureProtocol')) {
          ssl.secureProtocol = sslConfig.getString('secureProtocol');
        }
        if (sslConfig.has('caFile')) {
          ssl.caFile = sslConfig.getString('caFile');
        }
        if (sslConfig.has('clientCertificateFile')) {
          ssl.clientCertificateFile = sslConfig.getString(
            'clientCertificateFile',
          );
        }
        if (sslConfig.has('clientKeyFile')) {
          ssl.clientKeyFile = sslConfig.getString('clientKeyFile');
        }
        if (sslConfig.has('clientKeyPassword')) {
          ssl.clientKeyPassword = sslConfig.getString('clientKeyPassword');
        }
        if (sslConfig.has('sniHostname')) {
          ssl.sniHostname = sslConfig.getString('sniHostname');
        }

        behaviorOptions.ssl = ssl as InfinispanSslOptions;
      }

      parsedOptions.options =
        behaviorOptions as InfinispanClientBehaviorOptions;
    }

    return parsedOptions as InfinispanCacheStoreOptions;
  }

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
          `Redis cluster config at ${storeConfigPath} has no 'rootNodes' key, defaulting to non-clustered mode`,
        );
        return redisOptions;
      }
      redisOptions.cluster = {
        rootNodes: clusterConfig.get('rootNodes') as any[], // Config type might be broader
        defaults: clusterConfig.getOptional('defaults') as object | undefined,
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
    this.logger = logger;
    this.store = store as keyof CacheManager['storeFactories'];
    this.connection = connectionString;
    this.errorHandler = errorHandler;
    this.defaultTtl = defaultTtl;
    this.storeOptions = storeOptions;

    // Initialize standard store factories
    this.storeFactories = {
      redis: this.createRedisStoreFactory(),
      valkey: this.createValkeyStoreFactory(),
      memcache: this.createMemcacheStoreFactory(),
      memory: this.createMemoryStoreFactory(),
    };

    // Initialize Infinispan factory conditionally
    if (store === 'infinispan') {
      if (!this.storeOptions || !('servers' in this.storeOptions)) {
        throw new Error(
          'Infinispan store selected but required storeOptions (InfinispanCacheStoreOptions) are missing or invalid.',
        );
      }
      if (!this.logger) {
        throw new Error(
          'Logger is required for Infinispan cache store factory but was not provided to CacheManager.',
        );
      }
      const { factory, shutdown } = createInfinispanStoreFactory_sync_facade(
        this.storeOptions as InfinispanCacheStoreOptions,
        this.logger,
      );
      this.storeFactories.infinispan = factory;
      this.infinispanClientShutdownMethod = shutdown;
    }

    // Validate that the selected store has a configured factory
    if (!this.storeFactories[this.store]) {
      throw new Error(`Unknown cache store: ${this.store}`);
    }
  }

  forPlugin(pluginId: string): CacheService {
    const clientFactory = (options: CacheServiceOptions) => {
      const ttl = options.defaultTtl ?? this.defaultTtl;
      const storeFactory = this.storeFactories[this.store];
      if (!storeFactory) {
        throw new Error(`Cache store factory for '${this.store}' not found.`);
      }
      return storeFactory(
        pluginId,
        ttl !== undefined ? ttlToMilliseconds(ttl) : undefined,
      );
    };
    return new DefaultCacheClient(clientFactory({}), clientFactory, {});
  }

  private createRedisStoreFactory(): StoreFactory {
    const KeyvRedis = require('@keyv/redis').default;
    const { createCluster } = require('@keyv/redis');
    const stores: Record<string, typeof KeyvRedis> = {};
    return (pluginId, defaultTtl) => {
      if (!stores[pluginId]) {
        const redisStoreOptions = this.storeOptions as
          | RedisCacheStoreOptions
          | undefined;
        const clientOpts = redisStoreOptions?.client || {
          keyPrefixSeparator: ':',
        };
        if (redisStoreOptions?.cluster) {
          const cluster = createCluster(redisStoreOptions.cluster);
          stores[pluginId] = new KeyvRedis(cluster, clientOpts);
        } else {
          stores[pluginId] = new KeyvRedis(this.connection, clientOpts);
        }
        stores[pluginId].on('error', (err: Error) => {
          this.logger?.error('Redis cache client error', {
            error: err.message,
            pluginId,
          });
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

  private createValkeyStoreFactory(): StoreFactory {
    const KeyvValkey = require('@keyv/valkey').default;
    const { createCluster } = require('@keyv/valkey'); // Assuming @keyv/valkey has similar cluster setup
    const stores: Record<string, typeof KeyvValkey> = {};
    return (pluginId, defaultTtl) => {
      if (!stores[pluginId]) {
        const valkeyStoreOptions = this.storeOptions as
          | RedisCacheStoreOptions
          | undefined; // Valkey uses Redis options structure
        const clientOpts = valkeyStoreOptions?.client || {
          keyPrefixSeparator: ':',
        };
        if (valkeyStoreOptions?.cluster) {
          const cluster = createCluster(valkeyStoreOptions.cluster);
          stores[pluginId] = new KeyvValkey(cluster, clientOpts);
        } else {
          stores[pluginId] = new KeyvValkey(this.connection, clientOpts);
        }
        stores[pluginId].on('error', (err: Error) => {
          this.logger?.error('Valkey cache client error', {
            error: err.message,
            pluginId,
          });
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
        stores[pluginId].on('error', (err: Error) => {
          this.logger?.error('Memcache client error', {
            error: err.message,
            pluginId,
          });
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

  /** @internal */
  async shutdown(): Promise<void> {
    if (this.infinispanClientShutdownMethod) {
      this.logger?.info('CacheManager is shutting down Infinispan client...');
      await this.infinispanClientShutdownMethod();
      this.logger?.info('Infinispan client shutdown completed.');
    }
  }
}
