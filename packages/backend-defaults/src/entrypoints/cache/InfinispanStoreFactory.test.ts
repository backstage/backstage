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

import { createInfinispanStoreFactory_sync_facade } from './InfispanStoreFactory';
import { mockServices } from '@backstage/backend-test-utils';
import infinispan from 'infinispan';
import { InfinispanCacheStoreOptions } from './types';

jest.mock('infinispan', () => ({
  client: jest.fn(),
}));

describe('InfinispanStoreFactory', () => {
  const logger = mockServices.logger.mock();
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      get: jest.fn(),
      put: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
      disconnect: jest.fn(),
      on: jest.fn(),
    };

    (infinispan.client as jest.Mock).mockResolvedValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a factory that returns Keyv instances', async () => {
    const { factory } = createInfinispanStoreFactory_sync_facade(
      {
        servers: { host: 'localhost', port: 11222 },
      },
      logger,
    );

    const keyv = factory('test-plugin', 1000);
    expect(keyv).toBeDefined();
    expect(keyv.namespace).toBe('test-plugin');
  });

  it('creates a factory that shares the same client instance', async () => {
    const { factory } = createInfinispanStoreFactory_sync_facade(
      {
        servers: { host: 'localhost', port: 11222 },
      },
      logger,
    );

    const keyv1 = factory('plugin1', 1000);
    const keyv2 = factory('plugin2', 2000);

    // Both instances should use the same underlying client
    expect(infinispan.client).toHaveBeenCalledTimes(1);
  });

  it('handles client connection errors', async () => {
    const error = new Error('Connection failed');
    (infinispan.client as jest.Mock).mockRejectedValueOnce(error);

    const { factory } = createInfinispanStoreFactory_sync_facade(
      {
        servers: { host: 'localhost', port: 11222 },
      },
      logger,
    );

    const keyv = factory('test-plugin', 1000);
    await expect(keyv.set('key', 'value')).rejects.toThrow('Connection failed');
  });

  it('shuts down the client properly', async () => {
    const { factory, shutdown } = createInfinispanStoreFactory_sync_facade(
      {
        servers: { host: 'localhost', port: 11222 },
      },
      logger,
    );

    const keyv = factory('test-plugin', 1000);
    await keyv.set('key', 'value');
    await shutdown();

    expect(mockClient.disconnect).toHaveBeenCalled();
  });

  it('handles shutdown errors gracefully', async () => {
    const error = new Error('Shutdown failed');
    mockClient.disconnect.mockRejectedValueOnce(error);

    const { factory, shutdown } = createInfinispanStoreFactory_sync_facade(
      {
        servers: { host: 'localhost', port: 11222 },
      },
      logger,
    );

    const keyv = factory('test-plugin', 1000);
    await keyv.set('key', 'value');
    await expect(shutdown()).rejects.toThrow('Shutdown failed');
  });

  it('configures client with provided options', async () => {
    const options: InfinispanCacheStoreOptions = {
      servers: { host: 'localhost', port: 11222 },
      options: {
        version: '2.9',
        cacheName: 'test-cache',
        maxRetries: 3,
        connectionTimeout: 5000,
        socketTimeout: 10000,
        topologyUpdates: true,
        authentication: {
          enabled: true,
          saslMechanism: 'PLAIN',
          userName: 'test-user',
          password: 'test-pass',
        },
        ssl: {
          enabled: true,
          secureProtocol: 'TLSv1_2',
        },
        dataFormat: {
          keyType: 'text/plain',
          valueType: 'application/json',
          mediaType: 'application/json',
        },
      },
    };

    createInfinispanStoreFactory_sync_facade(options, logger);

    expect(infinispan.client).toHaveBeenCalledWith(
      options.servers,
      options.options,
    );
  });
});
