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
import { Backend, createSpecializedBackend } from '@backstage/backend-app-api';
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
  describe('multiple backends testing', () => {
    let instance1: Backend;
    let instance2: Backend;
    let instance1HttpPort: number;
    let instance2HttpPort: number;

    const configFactory = (port: number) =>
      mockServices.rootConfig.factory({
        data: {
          backend: {
            listen: {
              port,
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
      });
    beforeEach(async () => {
      instance1HttpPort = await getPort();
      instance2HttpPort = await getPort();
      // Setup code for multiple backend instances
      instance1 = createSpecializedBackend({
        defaultServiceFactories: [
          ...baseFactories,
          systemMetadataServiceFactory,
          configFactory(instance1HttpPort),
        ],
      });

      instance2 = createSpecializedBackend({
        defaultServiceFactories: [
          ...baseFactories,
          systemMetadataServiceFactory,
          configFactory(instance2HttpPort),
        ],
      });
    });

    it('should list plugins across instances', async () => {
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

      const instance1Response = await fetch(
        `http://localhost:${instance1HttpPort}/.backstage/systemMetadata/v1/features/installed`,
      );

      expect(instance1Response.status).toBe(200);
      await expect(instance1Response.json()).resolves.toMatchObject({
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

      const instance2Response = await fetch(
        `http://localhost:${instance2HttpPort}/.backstage/systemMetadata/v1/features/installed`,
      );

      expect(instance2Response.status).toBe(200);

      await expect(instance2Response.json()).resolves.toMatchObject({
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

    it('should list all known instances', async () => {
      await instance1.start();
      await instance2.start();

      const instance1Response = await fetch(
        `http://localhost:${instance1HttpPort}/.backstage/systemMetadata/v1/instances`,
      );

      expect(instance1Response.status).toBe(200);
      await expect(instance1Response.json()).resolves.toMatchObject({
        items: [
          {
            externalUrl: `http://localhost:${instance1HttpPort}`,
            internalUrl: `http://localhost:${instance1HttpPort}`,
          },
          {
            externalUrl: `http://localhost:${instance2HttpPort}`,
            internalUrl: `http://localhost:${instance2HttpPort}`,
          },
        ],
      });

      const instance2Response = await fetch(
        `http://localhost:${instance2HttpPort}/.backstage/systemMetadata/v1/instances`,
      );

      expect(instance2Response.status).toBe(200);
      await expect(instance2Response.json()).resolves.toMatchObject({
        items: [
          {
            externalUrl: `http://localhost:${instance1HttpPort}`,
            internalUrl: `http://localhost:${instance1HttpPort}`,
          },
          {
            externalUrl: `http://localhost:${instance2HttpPort}`,
            internalUrl: `http://localhost:${instance2HttpPort}`,
          },
        ],
      });
    });

    afterEach(async () => {
      await instance1.stop();
      await instance2.stop();
    });
  });
});
