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
import { createSpecializedBackend } from '@backstage/backend-app-api';
import { systemMetadataServiceFactory } from './systemMetadataServiceFactory';
import { mockServices } from '@backstage/backend-test-utils';
import getPort from 'get-port';
import { createBackendPlugin } from '@backstage/backend-plugin-api';

const baseFactories = [
  mockServices.rootHealth.factory(),
  mockServices.rootLogger.factory(),
  mockServices.rootLifecycle.factory(),
  mockServices.rootHttpRouter.factory(),
  mockServices.lifecycle.factory(),
  mockServices.logger.factory(),
];

describe('SystemMetadataService', () => {
  it('should list plugins across instances', async () => {
    const instance1HttpPort = await getPort();
    const instance2HttpPort = await getPort();
    const instance1 = createSpecializedBackend({
      defaultServiceFactories: [
        ...baseFactories,
        systemMetadataServiceFactory,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              listen: {
                port: instance1HttpPort,
              },
            },
            discovery: {
              instances: [
                {
                  baseUrl: `http://localhost:${instance1HttpPort}`,
                },
                {
                  baseUrl: `http://localhost:${instance2HttpPort}`,
                },
              ],
            },
          },
        }),
      ],
    });

    const instance2 = createSpecializedBackend({
      defaultServiceFactories: [
        ...baseFactories,
        systemMetadataServiceFactory,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              listen: {
                port: instance2HttpPort,
              },
            },
            discovery: {
              instances: [
                {
                  baseUrl: `http://localhost:${instance1HttpPort}`,
                },
                {
                  baseUrl: `http://localhost:${instance2HttpPort}`,
                },
              ],
            },
          },
        }),
      ],
    });

    instance1.add(
      createBackendPlugin({
        pluginId: 'test',
        register(reg) {
          reg.registerInit({
            deps: {},
            async init() {
              // do nothing
            },
          });
        },
      }),
    );

    instance2.add(
      createBackendPlugin({
        pluginId: 'test-other',
        register(reg) {
          reg.registerInit({
            deps: {},
            async init() {
              // do nothing
            },
          });
        },
      }),
    );

    await instance1.start();
    await instance2.start();

    const installedFeatures = await fetch(
      `http://localhost:${instance1HttpPort}/.backstage/systemMetadata/v1/features/installed`,
    );

    expect(installedFeatures.status).toBe(200);

    await expect(installedFeatures.json()).resolves.toMatchObject({
      test: [
        {
          externalUrl: `http://localhost:${instance1HttpPort}`,
          internalUrl: `http://localhost:${instance1HttpPort}`,
        },
      ],
      'test-other': [
        {
          externalUrl: `http://localhost:${instance2HttpPort}`,
          internalUrl: `http://localhost:${instance2HttpPort}`,
        },
      ],
    });
  });
});
