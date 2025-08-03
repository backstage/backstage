/*
 * Copyright 2025 The Backstage Authors
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

import { EventEmitter } from 'events';
import { LoggerService } from '@backstage/backend-plugin-api';
import { InfinispanPutOptions } from '../../types';

/**
 * Interface defining the required methods for an Infinispan client.
 * @public
 */
export interface InfinispanClientCacheInterface {
  get(key: string): Promise<string | null | undefined>;
  put(key: string, value: string, options?: InfinispanPutOptions): Promise<any>;
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
 */
export interface InfinispanKeyvStoreOptions {
  clientPromise: Promise<InfinispanClientCacheInterface>;
  logger: LoggerService;
  defaultTtl?: number; // TTL in milliseconds
}

/**
 * A Keyv store implementation that uses Infinispan as the backend.
 * This store implements the Keyv store interface and provides caching functionality
 * using Infinispan's distributed cache capabilities.
 */
export class InfinispanKeyvStore extends EventEmitter {
  private readonly clientPromise: Promise<InfinispanClientCacheInterface>;
  private readonly logger: LoggerService;
  private readonly defaultTtl?: number;
  private resolvedClient: InfinispanClientCacheInterface | null = null;

  public readonly namespace?: string; // Keyv expects this

  constructor(options: InfinispanKeyvStoreOptions) {
    super();
    this.clientPromise = options.clientPromise;
    this.logger = options.logger.child({ class: InfinispanKeyvStore.name });
    this.defaultTtl = options.defaultTtl;

    // Eagerly try to resolve the client to attach error listeners early
    // and to have it ready for disconnect if resolved.
    this.clientPromise
      .then(client => {
        this.resolvedClient = client;
        if (typeof client.on === 'function') {
          client.on('error', (error: Error) => {
            this.logger.error('Native Infinispan client reported an error.', {
              error: error.message,
            });
            this.emit('error', error);
          });
        } else {
          this.logger.warn(
            'Native Infinispan client does not appear to support .on("error") event listening.',
          );
        }
      })
      .catch(err => {
        this.logger.error(
          'Failed to resolve Infinispan client promise in constructor.',
          { error: err.message },
        );
        // Errors from operations will also be emitted when clientPromise is awaited and rejects.
        this.emit('error', err);
      });
  }

  private async getClient(): Promise<InfinispanClientCacheInterface> {
    if (this.resolvedClient) {
      return this.resolvedClient;
    }
    // If not yet resolved (e.g. called very quickly or promise rejected and retrying implicitly)
    // Await the promise. This will throw if the promise is rejected.
    this.resolvedClient = await this.clientPromise;
    return this.resolvedClient;
  }

  async get(key: string): Promise<string | undefined> {
    this.logger.debug(`Getting key: ${key}`);
    try {
      const client = await this.getClient();
      const value = await client.get(key);
      if (value === null || value === undefined) {
        this.logger.debug(`Key not found or value is null/undefined: ${key}`);
        return undefined;
      }
      this.logger.debug(`Successfully retrieved key: ${key}`);
      return value;
    } catch (error: any) {
      this.logger.error(`Error getting key '${key}' from Infinispan.`, {
        error: error.message,
      });
      this.emit(
        'error',
        error instanceof Error ? error : new Error(String(error)),
      );
      throw error;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    this.logger.debug(`Setting key: ${key}`, { ttl });
    this.logger.debug(`Setting key: ${key}`, { ttlInput: ttl });
    const currentTtl = ttl ?? this.defaultTtl;
    this.logger.debug(`Calculated currentTtl for key ${key}: ${currentTtl}ms`); // Log do TTL calculado
    const storeOptions: InfinispanPutOptions = {};

    if (typeof currentTtl === 'number' && currentTtl > 0) {
      storeOptions.lifespan = `${currentTtl}ms`; // Ensure time unit is passed as string
      // Ensure this matches client expectations. If client expects string '10s', convert here.
      // For now, assuming number in ms is fine or string like '10000ms'.
      // The PutOptions defines lifespan as string | number | null.
    } else if (typeof currentTtl === 'string') {
      storeOptions.lifespan = currentTtl;
    }

    try {
      const client = await this.getClient();
      await client.put(key, value, storeOptions);
      this.logger.debug(`Successfully set key: ${key}`);
    } catch (error: any) {
      this.logger.error(`Error setting key '${key}' in Infinispan.`, {
        error: error.message,
      });
      this.emit(
        'error',
        error instanceof Error ? error : new Error(String(error)),
      );
      throw error;
    }
  }

  async delete(key: string): Promise<boolean> {
    this.logger.debug(`Deleting key: ${key}`);
    try {
      const client = await this.getClient();
      const deleted = await client.remove(key);
      this.logger.debug(`Key deletion status for '${key}': ${deleted}`);
      return deleted;
    } catch (error: any) {
      this.logger.error(`Error deleting key '${key}' from Infinispan.`, {
        error: error.message,
      });
      this.emit(
        'error',
        error instanceof Error ? error : new Error(String(error)),
      );
      throw error;
    }
  }

  async clear(): Promise<void> {
    this.logger.info('Clearing all entries from Infinispan cache.');
    try {
      const client = await this.getClient();
      await client.clear();
      this.logger.info('Infinispan cache cleared successfully.');
    } catch (error: any) {
      this.logger.error('Error clearing Infinispan cache.', {
        error: error.message,
      });
      this.emit(
        'error',
        error instanceof Error ? error : new Error(String(error)),
      );
      throw error;
    }
  }

  // This disconnect is for the Keyv store instance, but the actual client is shared.
  // The CacheManager should handle the shared client's disconnection.
  // However, if Keyv calls this, we shouldn't error.
  async disconnect(): Promise<void> {
    this.logger.info(
      'InfinispanKeyvStore disconnect called. Shared client managed by CacheManager.',
    );
    // No-op for this store instance as the actual client is managed externally by CacheManager.
    // The CacheManager's stop() method will disconnect the shared native client.
    return Promise.resolve();
  }
}
