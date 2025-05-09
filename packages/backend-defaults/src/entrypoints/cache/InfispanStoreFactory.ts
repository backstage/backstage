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

import Keyv from 'keyv';
import { InfinispanKeyvStore } from './InfinispanKeyvStore';
import { ClientInterface as InfinispanNativeClient } from './InfinispanKeyvStore';
import { InfinispanCacheStoreOptions } from './types';
import { LoggerService } from '@backstage/backend-plugin-api';
import infinispan from 'infinispan';

/**
 * Output interface for the Infinispan store factory.
 * Contains the factory function to create Keyv instances and a shutdown method.
 * @public
 */
export interface InfinispanStoreFactoryOutput {
  factory: (pluginId: string, defaultTtlMs: number | undefined) => Keyv;
  shutdown: () => Promise<void>;
}

/**
 * Creates a factory for Infinispan-based Keyv stores.
 * This factory manages a shared Infinispan client connection and creates
 * Keyv instances that use this shared connection.
 *
 * @param options - Configuration options for the Infinispan connection
 * @param logger - Logger service for logging operations
 * @returns An object containing the factory function and a shutdown method
 * @public
 */
export function createInfinispanStoreFactory_sync_facade(
  options: InfinispanCacheStoreOptions,
  logger: LoggerService,
): InfinispanStoreFactoryOutput {
  let clientPromise: Promise<InfinispanNativeClient> | undefined = undefined;
  let rawClientForShutdown: InfinispanNativeClient | undefined = undefined;

  const getClientPromise = (): Promise<InfinispanNativeClient> => {
    if (!clientPromise) {
      logger.info('Initializing Infinispan client (shared promise)...', {
        servers: JSON.parse(JSON.stringify(options.servers)),
      });

      logger.info(
        'Attempting to connect to Infinispan with the following raw options:',
        {
          servers: JSON.parse(JSON.stringify(options.servers)),
          clientOptions: options.options
            ? JSON.parse(JSON.stringify(options.options))
            : undefined,
        },
      );
      if (options.options) {
        logger.info(
          `Value of options.options.version before calling infinispan.client: ${
            options.options.version
          }, type: ${typeof options.options.version}`,
        );
      } else {
        logger.warn(
          'options.options is undefined before calling infinispan.client',
        );
      }

      clientPromise = infinispan
        .client(options.servers, options.options as any) // Cast to any to bypass TS type check for version
        .then((client: InfinispanNativeClient) => {
          logger.info(
            'Infinispan client promise resolved. Client connected successfully.',
          );
          rawClientForShutdown = client;
          if (typeof client.on === 'function') {
            client.on('error', (error: Error) => {
              logger.error('Infinispan native client reported an error.', {
                error: error.message,
              });
            });
            client.on('connect', () => {
              logger.info('Infinispan native client event: connected.');
            });
            client.on('disconnect', () => {
              logger.info('Infinispan native client event: disconnected.');
              rawClientForShutdown = undefined;
            });
          }
          return client;
        })
        .catch((err: Error) => {
          logger.error(
            'Failed to connect to Infinispan server (shared promise).',
            {
              error: err.message,
              servers: JSON.parse(JSON.stringify(options.servers)),
              clientOptionsUsed: options.options
                ? JSON.parse(JSON.stringify(options.options))
                : undefined, // Log options used that led to failure
            },
          );
          rawClientForShutdown = undefined;
          clientPromise = undefined;
          throw new Error(`Infinispan connection failed: ${err.message}`);
        });
    }
    return clientPromise;
  };

  const factory = (
    pluginId: string,
    defaultTtlMs: number | undefined,
  ): Keyv => {
    const storeLogger = logger.child({
      plugin: pluginId,
      cacheStore: 'infinispan',
    });

    const infinispanStore = new InfinispanKeyvStore({
      clientPromise: getClientPromise(),
      logger: storeLogger,
      defaultTtl: defaultTtlMs,
    });

    return new Keyv({
      store: infinispanStore,
      namespace: pluginId,
      ttl: defaultTtlMs,
      serialize: JSON.stringify,
      deserialize: JSON.parse,
      emitErrors: true,
    });
  };

  const shutdown = async (): Promise<void> => {
    logger.info('Attempting to shutdown Infinispan client via CacheManager...');
    let clientToDisconnect: InfinispanNativeClient | undefined =
      rawClientForShutdown;

    if (!clientToDisconnect && clientPromise) {
      logger.info(
        'Infinispan client was initializing or promise existed; awaiting completion before shutdown...',
      );
      try {
        clientToDisconnect = await clientPromise;
      } catch (error: any) {
        logger.warn(
          'Error resolving Infinispan client promise during shutdown, client might not have connected.',
          { error: error.message },
        );
        clientToDisconnect = undefined;
      }
    }

    if (
      clientToDisconnect &&
      typeof clientToDisconnect.disconnect === 'function'
    ) {
      try {
        await clientToDisconnect.disconnect();
        logger.info(
          'Infinispan client disconnected successfully via CacheManager shutdown.',
        );
      } catch (error: any) {
        logger.error(
          'Error during Infinispan client disconnection via CacheManager shutdown.',
          { error: error.message },
        );
      }
    } else {
      logger.info(
        'Infinispan client was not connected or already disconnected; no shutdown action taken.',
      );
    }
    rawClientForShutdown = undefined;
    clientPromise = undefined;
  };

  return { factory, shutdown };
}
