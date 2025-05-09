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
  InfinispanCacheStoreOptions,
  InfinispanClientBehaviorOptions,
  InfinispanServerConfig,
  InfinispanSslOptions,
  InfinispanAuthOptions,
  InfinispanDataFormatOptions,
} from './types';
import { durationToMilliseconds } from '@backstage/types';
import { readDurationFromConfig } from '@backstage/config';

import { createInfinispanStoreFactory_sync_facade } from './InfispanStoreFactory.ts';

type StoreFactory = (pluginId: string, defaultTtl: number | undefined) => Keyv;

/**
 * Implements a Cache Manager which will automatically create new cache clients
 * for plugins when requested. All requested cache clients are created with the
 * connection details provided.
 *
 * @public
 */
export class CacheManager {
  private storeFactories: {
    redis: StoreFactory;
    valkey: StoreFactory;
    memcache: StoreFactory;
    memory: StoreFactory;
    infinispan?: StoreFactory; // Infinispan factory is set conditionally
  };

  private readonly logger?: LoggerService;
  private readonly store: string; // Keep as string, validation done in constructor
  private readonly connection: string;
  private readonly errorHandler: CacheManagerOptions['onError'];
  private readonly defaultTtl?: number;
  private readonly storeOptions?: CacheStoreOptions;

  public infinispanClientShutdownMethod?: () => Promise<void>;

  static fromConfig(
    config: RootConfigService,
    options: CacheManagerOptions = {},
  ): CacheManager {
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

    const storeOptions = CacheManager.parseStoreOptions(store, config, logger);

    const manager = new CacheManager(
      store,
      connectionString,
      options.onError,
      logger,
      defaultTtl,
      storeOptions,
    );
    return manager;
  }

  private static parseStoreOptions(
    store: string,
    config: RootConfigService,
    logger?: LoggerService,
  ): CacheStoreOptions | undefined {
    const storeConfigPath = `backend.cache.${store}`;
    if (!config.has(storeConfigPath)) {
      if (
        store !== 'memory' &&
        store !== 'memcache' &&
        store !== 'redis' &&
        store !== 'valkey' &&
        store !== 'infinispan'
      ) {
        logger?.warn(
          `No configuration found for cache store '${store}' at '${storeConfigPath}'.`,
        );
      }
      return undefined;
    }

    if (store === 'redis' || store === 'valkey') {
      return CacheManager.parseRedisOptions(storeConfigPath, config, logger);
    }
    if (store === 'infinispan') {
      return CacheManager.parseInfinispanOptions(
        storeConfigPath,
        config,
        logger,
      );
    }
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
        behaviorOptions.version = versionStr; // Assign the string directly
      } else if (versionStr === undefined || versionStr === null) {
        behaviorOptions.version = versionStr; // Assign undefined or null
      } else if (versionStr) {
        // Log a warning if the version string is present but not one of the allowed values
        logger?.warn(
          `Invalid Infinispan client version "${versionStr}" in config at ${storeConfigPath}.options.version. Must be "2.9", "2.5", or "2.2". It will be ignored, and the client may use a default or fail.`,
        );
        // Do not assign behaviorOptions.version, let it be undefined if not valid
      }

      if (clientOptsConfig.has('cacheName'))
        behaviorOptions.cacheName =
          clientOptsConfig.getOptionalString('cacheName');
      if (clientOptsConfig.has('maxRetries'))
        behaviorOptions.maxRetries =
          clientOptsConfig.getOptionalNumber('maxRetries');
      if (clientOptsConfig.has('connectionTimeout'))
        behaviorOptions.connectionTimeout =
          clientOptsConfig.getOptionalNumber('connectionTimeout');
      if (clientOptsConfig.has('socketTimeout'))
        behaviorOptions.socketTimeout =
          clientOptsConfig.getOptionalNumber('socketTimeout');
      if (clientOptsConfig.has('topologyUpdates'))
        behaviorOptions.topologyUpdates =
          clientOptsConfig.getOptionalBoolean('topologyUpdates');

      if (clientOptsConfig.has('authentication')) {
        const authConfig = clientOptsConfig.getConfig('authentication');
        const parsedAuthConfig: Partial<InfinispanAuthOptions> = {
          enabled: authConfig.getBoolean('enabled'), // Assuming 'enabled' is mandatory for the block
        };
        if (authConfig.has('saslMechanism'))
          parsedAuthConfig.saslMechanism =
            authConfig.getOptionalString('saslMechanism');
        if (authConfig.has('userName'))
          parsedAuthConfig.userName = authConfig.getOptionalString('userName');
        if (authConfig.has('password'))
          parsedAuthConfig.password = authConfig.getOptionalString('password');
        if (authConfig.has('token'))
          parsedAuthConfig.token = authConfig.getOptionalString('token');
        if (authConfig.has('realm'))
          parsedAuthConfig.realm = authConfig.getOptionalString('realm');
        behaviorOptions.authentication =
          parsedAuthConfig as InfinispanAuthOptions;
      }

      if (clientOptsConfig.has('ssl')) {
        const sslConfig = clientOptsConfig.getConfig('ssl');
        const parsedSslOptions: Partial<InfinispanSslOptions> = {
          enabled: sslConfig.getBoolean('enabled'), // Assuming 'enabled' is mandatory
        };
        if (sslConfig.has('secureProtocol'))
          parsedSslOptions.secureProtocol =
            sslConfig.getOptionalString('secureProtocol');
        if (sslConfig.has('caFile'))
          parsedSslOptions.caFile = sslConfig.getOptionalString('caFile');
        if (sslConfig.has('clientCertificateFile'))
          parsedSslOptions.clientCertificateFile = sslConfig.getOptionalString(
            'clientCertificateFile',
          );
        if (sslConfig.has('clientKeyFile'))
          parsedSslOptions.clientKeyFile =
            sslConfig.getOptionalString('clientKeyFile');
        if (sslConfig.has('clientKeyPassword'))
          parsedSslOptions.clientKeyPassword =
            sslConfig.getOptionalString('clientKeyPassword');
        if (sslConfig.has('sniHostname'))
          parsedSslOptions.sniHostname =
            sslConfig.getOptionalString('sniHostname');
        behaviorOptions.ssl = parsedSslOptions as InfinispanSslOptions;
      }

      if (clientOptsConfig.has('dataFormat')) {
        const dfConfig = clientOptsConfig.getConfig('dataFormat');
        const parsedDfOptions: Partial<InfinispanDataFormatOptions> = {};
        if (dfConfig.has('keyType'))
          parsedDfOptions.keyType = dfConfig.getOptionalString('keyType');
        if (dfConfig.has('valueType'))
          parsedDfOptions.valueType = dfConfig.getOptionalString('valueType');
        const mediaTypeString = dfConfig.getOptionalString('mediaType');
        if (
          mediaTypeString === 'text/plain' ||
          mediaTypeString === 'application/json'
        ) {
          parsedDfOptions.mediaType = mediaTypeString;
        } else if (mediaTypeString === null) {
          parsedDfOptions.mediaType = null;
        } else if (mediaTypeString !== undefined) {
          logger?.warn(
            `Invalid mediaType "${mediaTypeString}" in Infinispan dataFormat config at ${storeConfigPath}.options.dataFormat. Allowed: "text/plain", "application/json", or null. Ignored.`,
          );
        }
        behaviorOptions.dataFormat =
          parsedDfOptions as InfinispanDataFormatOptions;
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
    this.store = store;
    this.connection = connectionString;
    this.errorHandler = errorHandler;
    this.defaultTtl = defaultTtl;
    this.storeOptions = storeOptions;

    this.storeFactories = {
      redis: this.createRedisStoreFactory(),
      valkey: this.createValkeyStoreFactory(),
      memcache: this.createMemcacheStoreFactory(),
      memory: this.createMemoryStoreFactory(),
    };

    if (store === 'infinispan') {
      if (!this.storeOptions || !('servers' in this.storeOptions)) {
        const errorMsg =
          'Infinispan store selected but required storeOptions (InfinispanCacheStoreOptions) are missing or invalid.';
        this.logger?.error(errorMsg);
        throw new Error(errorMsg);
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
    if (!this.storeFactories[this.store as keyof typeof this.storeFactories]) {
      throw new Error(`Unknown or uninitialized cache store: ${this.store}`);
    }
  }

  forPlugin(pluginId: string): CacheService {
    const clientFactory = (options: CacheServiceOptions) => {
      const ttl = options.defaultTtl ?? this.defaultTtl;
      const selectedStoreFactory =
        this.storeFactories[this.store as keyof typeof this.storeFactories];
      if (!selectedStoreFactory) {
        // This should ideally be caught in constructor, but as a safeguard:
        this.logger?.error(
          `Cache store factory for '${this.store}' not found when creating client for plugin '${pluginId}'.`,
        );
        throw new Error(`Cache store factory for '${this.store}' not found.`);
      }
      return selectedStoreFactory(
        pluginId,
        ttl !== undefined ? ttlToMilliseconds(ttl) : undefined,
      );
    };
    return new DefaultCacheClient(clientFactory({}), clientFactory, {});
  }

  // Method specific to shutting down the Infinispan client if it was initialized.
  public async stopInfinispanClient(): Promise<void> {
    if (this.infinispanClientShutdownMethod) {
      this.logger?.info('CacheManager is stopping the Infinispan client...');
      await this.infinispanClientShutdownMethod();
      this.logger?.info(
        'Infinispan client shutdown process completed via CacheManager.',
      );
    } else {
      this.logger?.debug(
        'No Infinispan client shutdown method registered with CacheManager.',
      );
    }
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
}
