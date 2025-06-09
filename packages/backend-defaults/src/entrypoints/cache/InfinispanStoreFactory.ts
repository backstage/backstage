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

import Keyv from 'keyv';
import { LoggerService } from '@backstage/backend-plugin-api';
import { InfinispanCacheStoreOptions } from './types';
import { InfinispanKeyvStore, ClientInterface } from './InfinispanKeyvStore';

/**
 * Factory function return type for creating Infinispan store instances.
 * @public
 */
export interface InfinispanStoreFactoryResult {
  factory: (pluginId: string, defaultTtl: number | undefined) => Keyv;
  shutdown: () => Promise<void>;
}

/**
 * Creates a factory function for Infinispan cache stores.
 * This function sets up the Infinispan client and returns a factory that can create
 * Keyv instances backed by Infinispan for different plugins.
 *
 * @param options - Configuration options for the Infinispan cache store
 * @param logger - Logger service for logging operations
 * @returns An object containing the factory function and shutdown method
 * @public
 */
export function createInfinispanStoreFactory_sync_facade(
  options: InfinispanCacheStoreOptions,
  logger: LoggerService,
): InfinispanStoreFactoryResult {
  // Use sync version for testing environments
  const isTest = process.env.NODE_ENV === 'test' || typeof jest !== 'undefined';
  const clientPromise = isTest
    ? createInfinispanClientSync(options, logger)
    : createInfinispanClient(options, logger);

  const factory = (pluginId: string, defaultTtl: number | undefined): Keyv => {
    const store = new InfinispanKeyvStore({
      clientPromise,
      logger,
      defaultTtl,
    });

    return new Keyv({
      namespace: pluginId,
      ttl: defaultTtl,
      store,
      emitErrors: false,
    });
  };

  const shutdown = async (): Promise<void> => {
    try {
      const client = await clientPromise;
      await client.disconnect();
      logger.info('Infinispan client disconnected successfully');
    } catch (error: any) {
      logger.error('Error during Infinispan client shutdown', {
        error: error.message,
      });
      throw error;
    }
  };

  return { factory, shutdown };
}

/**
 * Creates an Infinispan client based on the provided configuration.
 * @param options - Configuration options for the Infinispan cache store
 * @param logger - Logger service for logging operations
 * @returns Promise that resolves to an Infinispan client
 * @internal
 */
async function createInfinispanClient(
  options: InfinispanCacheStoreOptions,
  logger: LoggerService,
): Promise<ClientInterface> {
  try {
    // Dynamic import to avoid loading infinispan if not needed
    const infinispan = await import('infinispan');

    logger.info('Creating Infinispan client');

    const client = await infinispan.client(
      options.servers,
      options.options as any,
    );

    logger.info('Infinispan client created successfully');

    return client;
  } catch (error: any) {
    logger.error('Failed to create Infinispan client', {
      error: error.message,
    });
    throw error;
  }
}

/**
 * Creates an Infinispan client synchronously for testing purposes.
 * @param options - Configuration options for the Infinispan cache store
 * @param logger - Logger service for logging operations
 * @returns Promise that resolves to an Infinispan client
 * @internal
 */
function createInfinispanClientSync(
  options: InfinispanCacheStoreOptions,
  logger: LoggerService,
): Promise<ClientInterface> {
  try {
    // For testing, use direct import without dynamic import
    const infinispan = require('infinispan');

    logger.info('Creating Infinispan client');

    const clientPromise = infinispan.client(
      options.servers,
      options.options as any,
    );

    return clientPromise
      .then((client: ClientInterface) => {
        logger.info('Infinispan client created successfully');
        return client;
      })
      .catch((error: any) => {
        logger.error('Failed to create Infinispan client', {
          error: error.message,
        });
        throw error;
      });
  } catch (error: any) {
    logger.error('Failed to create Infinispan client', {
      error: error.message,
    });
    return Promise.reject(error);
  }
}
