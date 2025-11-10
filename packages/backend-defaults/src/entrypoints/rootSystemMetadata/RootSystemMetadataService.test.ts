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

import { mockServices } from '@backstage/backend-test-utils';
import { default as getPort } from 'get-port';
import {
  coreServices,
  createBackendPlugin,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { createBackend } from '../../CreateBackend';
import { Backend } from '@backstage/backend-app-api';
import Router from 'express-promise-router';

describe('SystemMetadataService', () => {
  describe('returns plugins from config', () => {
    let port: number;
    let instance: Backend;
    beforeEach(async () => {
      port = await getPort();
      instance = createBackend();
      instance.add(
        createBackendPlugin({
          pluginId: 'test-plugin',
          register(reg) {
            reg.registerInit({
              deps: {
                systemMetadata: coreServices.rootSystemMetadata,
                rootHttpRouter: coreServices.rootHttpRouter,
              },
              init: async ({ systemMetadata, rootHttpRouter }) => {
                const router = Router();
                router.use('/plugins', async (_, res) => {
                  res.json(await systemMetadata.getInstalledPlugins());
                });
                rootHttpRouter.use('/systemMetadata', router);
              },
            });
          },
        }),
      );
    });

    it('should list all known instances', async () => {
      instance.add(
        mockServices.rootConfig.factory({
          data: {
            backend: {
              listen: {
                port,
              },
              baseUrl: `http://localhost:${port}`,
            },
          },
        }),
      );
      await instance.start();

      const instanceResponse = await fetch(
        `http://localhost:${port}/systemMetadata/plugins`,
      );

      expect(instanceResponse.status).toBe(200);
      await expect(instanceResponse.json()).resolves.toMatchObject([
        {
          hosts: [
            {
              external: `http://localhost:${port}`,
              internal: `http://localhost:${port}`,
            },
          ],
          pluginId: 'test-plugin',
        },
      ]);
    });

    it('should react to config updates', async () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            listen: {
              port,
            },
            baseUrl: `http://localhost:${port}`,
          },
        },
      });
      const configFactory = createServiceFactory({
        service: coreServices.rootConfig,
        deps: {},
        factory: () => config,
      });
      instance.add(configFactory);
      await instance.start();

      const instance1Response = await fetch(
        `http://localhost:${port}/systemMetadata/plugins`,
      );

      expect(instance1Response.status).toBe(200);
      await expect(instance1Response.json()).resolves.toMatchObject([
        {
          hosts: [
            {
              external: `http://localhost:${port}`,
              internal: `http://localhost:${port}`,
            },
          ],
          pluginId: 'test-plugin',
        },
      ]);

      config.update({
        data: {
          backend: {
            listen: {
              port,
            },
            baseUrl: `http://localhost:${port}`,
          },
          discovery: {
            endpoints: [
              {
                target: `http://test.internal`,
                plugins: ['your-new-plugin'],
              },
            ],
          },
        },
      });

      const responseAfterUpdate = await fetch(
        `http://localhost:${port}/systemMetadata/plugins`,
      );

      expect(responseAfterUpdate.status).toBe(200);
      await expect(responseAfterUpdate.json()).resolves.toMatchObject([
        {
          hosts: [
            {
              external: 'http://test.internal',
              internal: 'http://test.internal',
            },
          ],
          pluginId: 'your-new-plugin',
        },
        {
          hosts: [
            {
              external: `http://localhost:${port}`,
              internal: `http://localhost:${port}`,
            },
          ],
          pluginId: 'test-plugin',
        },
      ]);
    });

    afterEach(async () => {
      await instance.stop();
    });
  });
});
