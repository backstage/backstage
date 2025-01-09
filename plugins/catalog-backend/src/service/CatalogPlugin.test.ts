/*
 * Copyright 2022 The Backstage Authors
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
import request from 'supertest';
import { startTestBackend } from '@backstage/backend-test-utils';
import { catalogPlugin } from './CatalogPlugin';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { createCatalogPermissionRule } from '../permissions';

describe('catalogPlugin', () => {
  it('should support custom permission rules', async () => {
    const { server } = await startTestBackend({
      features: [
        catalogPlugin,
        createBackendModule({
          pluginId: 'catalog',
          moduleId: 'custom-rules',
          register(reg) {
            reg.registerInit({
              deps: {
                permissionsRegistry: coreServices.permissionsRegistry,
              },
              async init({ permissionsRegistry }) {
                permissionsRegistry.addPermissionRules([
                  createCatalogPermissionRule({
                    name: 'test',
                    resourceType: 'catalog-entity',
                    description: 'Test permission rule',
                    apply() {
                      return true;
                    },
                    toQuery() {
                      return { key: 'test' };
                    },
                  }),
                ]);
              },
            });
          },
        }),
      ],
    });

    const res = await request(server).get(
      '/api/catalog/.well-known/backstage/permissions/metadata',
    );

    expect(res.status).toBe(200);
    expect(res.body.rules).toContainEqual({
      name: 'test',
      resourceType: 'catalog-entity',
      paramsSchema: expect.any(Object),
      description: 'Test permission rule',
    });
  });
});
