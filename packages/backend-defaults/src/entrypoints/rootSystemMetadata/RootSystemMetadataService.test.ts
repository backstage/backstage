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

describe('SystemMetadataService', () => {
  describe('returns plugins from config', () => {
    let port: number;
    let testPlugin: ReturnType<typeof createBackendPlugin>;
    beforeEach(async () => {
      port = await getPort();
      testPlugin = createBackendPlugin({
        pluginId: 'test-plugin',
        register(reg) {
          reg.registerInit({
            deps: {},
            init: async () => {},
          });
        },
      });
    });

    it('should list all known instances', async () => {
      const instance = createBackend();
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
      instance.add(testPlugin);
      await instance.start();

      const instanceResponse = await fetch(
        `http://localhost:${port}/.backstage/systemMetadata/v1/plugins/installed`,
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
      const instance = createBackend();
      instance.add(configFactory);
      instance.add(testPlugin);
      await instance.start();

      const instance1Response = await fetch(
        `http://localhost:${port}/.backstage/systemMetadata/v1/plugins/installed`,
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
        `http://localhost:${port}/.backstage/systemMetadata/v1/plugins/installed`,
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
  });
});
