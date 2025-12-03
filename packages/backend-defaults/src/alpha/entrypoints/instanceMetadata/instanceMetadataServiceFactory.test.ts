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

import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import {
  instanceMetadataServiceFactory,
  instanceMetadataServiceRef,
} from './instanceMetadataServiceFactory';
import { startTestBackend } from '@backstage/backend-test-utils';
import Router from 'express-promise-router';
import request from 'supertest';

describe('instanceMetadataServiceFactory', () => {
  it('should create an instance metadata service', async () => {
    const pluginSubject = createBackendPlugin({
      pluginId: 'my-plugin',
      register(reg) {
        reg.registerInit({
          deps: {
            instanceMetadata: instanceMetadataServiceRef,
            httpRouter: coreServices.httpRouter,
          },
          async init({ instanceMetadata, httpRouter }) {
            const router = Router();
            router.get('/instance-metadata', async (_, res) => {
              const metadata = await instanceMetadata.getInstalledFeatures();
              res.json(metadata);
            });
            httpRouter.use(router);
          },
        });
      },
    });

    const { server } = await startTestBackend({
      features: [pluginSubject, instanceMetadataServiceFactory],
    });

    const response = await request(server)
      .get('/api/my-plugin/instance-metadata')
      .expect(200);
    expect(response.body).toEqual([{ pluginId: 'my-plugin', type: 'plugin' }]);
  });
});
