/*
 * Copyright 2023 The Backstage Authors
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
  coreServices,
  createBackendPlugin,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { mockServices } from '@backstage/backend-test-utils';
import {
  ConnectionsService,
  connectionsServiceRef,
  declareConnection,
  DefaultConnectionsService,
} from '@backstage/connections';
import { createBackend } from './CreateBackend';

function createTestBackend() {
  const backend = createBackend();
  backend.add(
    mockServices.rootConfig.factory({
      data: { backend: { baseUrl: 'http://localhost:7007' } },
    }),
  );
  backend.add(mockServices.rootHttpRouter.mock().factory);
  return backend;
}

describe('createBackend', () => {
  it('should not throw when overriding a default service implementation', async () => {
    const backend = createBackend();

    backend.add(
      createServiceFactory({
        service: coreServices.rootConfig,
        deps: {},
        factory(): never {
          throw new Error('NOPE');
        },
      }),
    );

    // We expect the service factory error to be thrown, rather than any earlier validation
    await expect(backend.start()).rejects.toThrow('NOPE');
  });

  it('should throw on duplicate service implementations', async () => {
    const backend = createBackend();

    backend.add(
      createServiceFactory({
        service: coreServices.rootLifecycle,
        deps: {},
        factory: async () => ({
          addStartupHook: () => {},
          addBeforeShutdownHook: () => {},
          addShutdownHook: () => {},
        }),
      }),
    );
    backend.add(
      createServiceFactory({
        service: coreServices.rootLifecycle,
        deps: {},
        factory: async () => ({
          addStartupHook: () => {},
          addBeforeShutdownHook: () => {},
          addShutdownHook: () => {},
        }),
      }),
    );

    await expect(backend.start()).rejects.toThrow(
      'Duplicate service implementations provided for core.rootLifecycle',
    );
  });

  it('should throw when providing a plugin metadata service implementation', async () => {
    const backend = createBackend();
    backend.add(
      createServiceFactory({
        service: coreServices.pluginMetadata,
        deps: {},
        factory: () => ({ getId: () => 'test' }),
      }),
    );

    await expect(backend.start()).rejects.toThrow(
      'The core.pluginMetadata service cannot be overridden',
    );
  });

  it('should provide the connections service by default', async () => {
    const backend = createTestBackend();
    let connections: ConnectionsService | undefined;
    backend.add(
      createBackendPlugin({
        pluginId: 'test',
        register(reg) {
          reg.registerInit({
            deps: { connections: connectionsServiceRef },
            async init(deps) {
              connections = deps.connections;
            },
          });
        },
      }),
    );

    await backend.start();
    expect(connections).toBeDefined();
    await backend.stop();
  });

  it('should allow overriding the default connections service', async () => {
    const backend = createTestBackend();
    const customConnections: ConnectionsService = {
      find: jest.fn(),
    };
    const customFactory = jest.fn(() => customConnections);
    let connections: ConnectionsService | undefined;
    backend.add(
      createServiceFactory({
        service: connectionsServiceRef,
        deps: {},
        factory: customFactory,
      }),
    );
    backend.add(
      createBackendPlugin({
        pluginId: 'test',
        register(reg) {
          declareConnection(reg, {
            type: 'github',
            description: 'Used to test the custom service override',
          });
          reg.registerInit({
            deps: { connections: connectionsServiceRef },
            async init(deps) {
              connections = deps.connections;
            },
          });
        },
      }),
    );

    await backend.start();
    expect(customFactory).toHaveBeenCalledTimes(1);
    await connections?.find({
      type: 'github',
      url: 'https://github.com/backstage/backstage',
      authMethods: ['token'],
    });
    expect(customConnections.find).toHaveBeenCalledWith({
      type: 'github',
      url: 'https://github.com/backstage/backstage',
      authMethods: ['token'],
    });
    await backend.stop();
  });

  it('should not initialize the connections service unless requested', async () => {
    const createConnections = jest.spyOn(DefaultConnectionsService, 'create');
    const backend = createTestBackend();
    backend.add(
      createBackendPlugin({
        pluginId: 'test',
        register(reg) {
          reg.registerInit({
            deps: {},
            async init() {},
          });
        },
      }),
    );

    await backend.start();
    expect(createConnections).not.toHaveBeenCalled();
    await backend.stop();
  });
});
