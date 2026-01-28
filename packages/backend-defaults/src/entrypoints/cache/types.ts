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

import { LoggerService } from '@backstage/backend-plugin-api';
import { HumanDuration, durationToMilliseconds } from '@backstage/types';
import { RedisClusterOptions, KeyvRedisOptions } from '@keyv/redis';
import { KeyvValkeyOptions } from '@keyv/valkey';

/**
 * Options for Redis cache store.
 *
 * @public
 */
export type RedisCacheStoreOptions = {
  type: 'redis';
  client?: KeyvRedisOptions;
  cluster?: RedisClusterOptions;
};

/**
 * Options for Valkey cache store.
 *
 * @public
 */
export type ValkeyCacheStoreOptions = {
  type: 'valkey';
  client?: KeyvValkeyOptions;
  cluster?: RedisClusterOptions;
};

/**
 * Union type of all cache store options.
 *
 * @public
 */
export type CacheStoreOptions =
  | RedisCacheStoreOptions
  | ValkeyCacheStoreOptions
  | InfinispanCacheStoreOptions;

/**
 * Options given when constructing a {@link CacheManager}.
 *
 * @public
 */
export type CacheManagerOptions = {
  /**
   * An optional logger for use by the PluginCacheManager.
   */
  logger?: LoggerService;

  /**
   * An optional handler for connection errors emitted from the underlying data
   * store.
   */
  onError?: (err: Error) => void;
};

export function ttlToMilliseconds(ttl: number | HumanDuration): number {
  return typeof ttl === 'number' ? ttl : durationToMilliseconds(ttl);
}

/**
 * Configuration for a single Infinispan server.
 */
export type InfinispanServerConfig = {
  host: string;
  port: number;
};

/**
 * Options for putting values into Infinispan cache.
 */
export type InfinispanPutOptions = {
  lifespan?: string;
  maxIdle?: string;
  previous?: boolean;
  flags?: string[];
};
/**
 * SSL/TLS options for the Infinispan client.
 */
export type InfinispanSslOptions = {
  enabled: boolean;
  secureProtocol?: string;
  trustCerts?: string[]; // Array of trusted CA certificates
  clientAuth?: InfinispanClientAuthOptions;
  cryptoStore?: InfinispanCryptoStoreOptions;
  sniHostName?: string;
};

/**
 * Authentication options for the Infinispan client.
 * This is used for client-side authentication with the Infinispan server.
 */
export type InfinispanClientAuthOptions = {
  key?: string;
  passphrase?: string;
  cert?: string;
};

/**
 * Options for the Infinispan client crypto store.
 * This is used for storing keys and certificates securely.
 */
export type InfinispanCryptoStoreOptions = {
  path?: string;
  passphrase?: string;
};

/**
 * Authentication options for the Infinispan client.
 */
export type InfinispanAuthOptions = {
  enabled: boolean;
  saslMechanism?: string;
  userName?: string;
  password?: string;
  token?: string;
  authzid?: string;
};

/**
 * Options for the Infinispan cache store, designed to be configured
 * in app-config.yaml under `backend.cache.infinispan`.
 */
export type InfinispanCacheStoreOptions = {
  type: 'infinispan';
  servers: InfinispanServerConfig | InfinispanServerConfig[];
  options?: InfinispanClientBehaviorOptions;
};

export type InfinispanClusterConfig = {
  name?: string;
  servers: InfinispanServerConfig[];
};

export type DataFormatOptions = {
  keyType: 'text/plain' | 'application/json';
  valueType: 'text/plain' | 'application/json';
};

/**
 * Detailed client behavior options for the Infinispan client.
 * @public
 */
export type InfinispanClientBehaviorOptions = {
  version?: '2.9' | '2.5' | '2.2';
  cacheName?: string;
  maxRetries?: number;
  connectionTimeout?: number;
  socketTimeout?: number;
  authentication?: InfinispanAuthOptions;
  ssl?: InfinispanSslOptions;
  mediaType?: 'text/plain' | 'application/json';
  topologyUpdates?: boolean;
  clusters?: InfinispanClusterConfig[];
  dataFormat: DataFormatOptions;
};
