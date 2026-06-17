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

import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import {
  coreServices,
  createBackendPlugin,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import Router from 'express-promise-router';
import request from 'supertest';
import { rootSystemMetadataServiceFactory } from './rootSystemMetadataServiceFactory';
import { rootSystemMetadataServiceRef } from '@backstage/backend-plugin-api/alpha';

describe('SystemMetadataService', () => {
  describe('returns plugins from config', () => {
    const testPlugin = createBackendPlugin({
      pluginId: 'test-plugin',
      register(reg) {
        reg.registerInit({
          deps: {
            systemMetadata: rootSystemMetadataServiceRef,
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
    });

    it('should list all known instances', async () => {
      const { server } = await startTestBackend({
        features: [
          testPlugin,
          rootSystemMetadataServiceFactory,
          mockServices.rootConfig.factory({
            data: {
              backend: {
                listen: {
                  port: 0,
                },
                baseUrl: `http://localhost:0`,
              },
            },
          }),
        ],
      });

      const instanceResponse = await request(server).get(
        `/systemMetadata/plugins`,
      );

      expect(instanceResponse.status).toBe(200);
      expect(instanceResponse.body).toMatchObject([
        {
          pluginId: 'test-plugin',
        },
      ]);
    });

    it('should react to config updates', async () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            listen: {
              port: 0,
            },
            baseUrl: `http://localhost:0`,
          },
        },
      });
      const configFactory = createServiceFactory({
        service: coreServices.rootConfig,
        deps: {},
        factory: () => config,
      });
      const { server } = await startTestBackend({
        features: [testPlugin, configFactory, rootSystemMetadataServiceFactory],
      });

      const initialResponse = await request(server).get(
        `/systemMetadata/plugins`,
      );

      expect(initialResponse.status).toBe(200);
      expect(initialResponse.body).toMatchObject([
        {
          pluginId: 'test-plugin',
        },
      ]);

      config.update({
        data: {
          backend: {
            listen: {
              port: 0,
            },
            baseUrl: `http://localhost:0`,
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

      const responseAfterUpdate = await request(server).get(
        `/systemMetadata/plugins`,
      );

      expect(responseAfterUpdate.status).toBe(200);
      expect(responseAfterUpdate.body).toMatchObject([
        {
          pluginId: 'your-new-plugin',
        },
        {
          pluginId: 'test-plugin',
        },
      ]);
    });
  });
});
