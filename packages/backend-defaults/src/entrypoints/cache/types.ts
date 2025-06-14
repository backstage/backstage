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

/**
 * Options for Redis cache store.
 *
 * @public
 */
export type RedisCacheStoreOptions = {
  client?: KeyvRedisOptions;
  cluster?: RedisClusterOptions;
};

/**
 * Configuration for a single Infinispan server.
 * @public
 */
export interface InfinispanServerConfig {
  host: string;
  port: number;
}

/**
 * SSL/TLS options for the Infinispan client.
 * @public
 */
export interface InfinispanSslOptions {
  enabled: boolean;
  secureProtocol?: string | null;
  caFile?: string | null;
  clientCertificateFile?: string | null;
  clientKeyFile?: string | null;
  clientKeyPassword?: string | null;
  sniHostname?: string | null;
}

/**
 * Authentication options for the Infinispan client.
 * @public
 */
export interface InfinispanAuthOptions {
  enabled: boolean;
  saslMechanism?: string | null;
  userName?: string | null;
  password?: string | null;
  token?: string | null;
  realm?: string | null;
}

/**
 * Data format options for the Infinispan client.
 * @public
 */
export interface InfinispanDataFormatOptions {
  keyType?: string | null;
  valueType?: string | null;
  mediaType?: 'text/plain' | 'application/json' | null;
}

/**
 * Detailed client behavior options for the Infinispan client.
 * @public
 */
export interface InfinispanClientBehaviorOptions {
  version?: '2.9' | '2.5' | '2.2' | null;
  cacheName?: string | null;
  maxRetries?: number | null;
  connectionTimeout?: number | null;
  socketTimeout?: number | null;
  authentication?: InfinispanAuthOptions | null;
  ssl?: InfinispanSslOptions | null;
  dataFormat?: InfinispanDataFormatOptions | null;
  topologyUpdates?: boolean | null;
}

/**
 * Options for the Infinispan cache store, designed to be configured
 * in app-config.yaml under `backend.cache.infinispan`.
 * @public
 */
export type InfinispanCacheStoreOptions = {
  servers: InfinispanServerConfig | InfinispanServerConfig[];
  options?: InfinispanClientBehaviorOptions;
};

/**
 * Interface defining the required methods for an Infinispan client.
 * Re-exported from InfinispanKeyvStore for convenience.
 * @public
 */
export interface ClientInterface {
  get(key: string): Promise<string | null | undefined>;
  put(key: string, value: string, options?: any): Promise<any>;
  remove(key: string): Promise<boolean>;
  clear(): Promise<void>;
  disconnect(): Promise<void>;
  on?(event: 'error' | string, listener: (...args: any[]) => void): this;
  connect?(): Promise<any>;
  query?(query: string): Promise<any[] | null>;
  containsKey?(key: string): Promise<boolean>;
}

/**
 * Options for creating an InfinispanKeyvStore instance.
 * @public
 */
export interface InfinispanKeyvStoreOptions {
  clientPromise: Promise<ClientInterface>;
  logger: LoggerService;
  defaultTtl?: number; // TTL in milliseconds
}

/**
 * Union type of all cache store options.
 *
 * @public
 */
export type CacheStoreOptions =
  | RedisCacheStoreOptions
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

/**
 * Converts a TTL (Time To Live) value to milliseconds.
 * Accepts either a number (milliseconds) or a HumanDuration object.
 *
 * @param ttl - The TTL value to convert, either as milliseconds or a HumanDuration object
 * @returns The TTL value in milliseconds
 * @public
 */
export function ttlToMilliseconds(ttl: number | HumanDuration): number {
  return typeof ttl === 'number' ? ttl : durationToMilliseconds(ttl);
}
