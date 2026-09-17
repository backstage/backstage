/*
 * Copyright 2026 The Backstage Authors
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

import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  mockCredentials,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import {
  AuthorizeResult,
  createPermission,
} from '@backstage/plugin-permission-common';
import { adminPermission } from '@backstage/plugin-permission-common/alpha';
import {
  createAdminConditionalDecision,
  adminConditions,
  policyExtensionPoint,
} from '@backstage/plugin-permission-node/alpha';
import request from 'supertest';
import { permissionPlugin } from './plugin';

describe('shared administration permissions', () => {
  it('discovers permissions and resolves plugin scopes without granting unrelated permissions', async () => {
    let instanceAdmin = false;
    let pluginIds = ['catalog'];
    const { server } = await startTestBackend({
      features: [
        permissionPlugin,
        mockServices.auth.mock({
          isPrincipal: mockServices.auth().isPrincipal,
          // The default mock service token does not preserve the user actor.
          getPluginRequestToken: async () => ({
            token: mockCredentials.user.token('user:default/test', {
              actor: { subject: 'plugin:permission' },
            }),
          }),
        }).factory,
        mockServices.rootConfig.factory({
          data: { permission: { enabled: true } },
        }),
        mockServices.httpAuth.factory({
          defaultCredentials: mockCredentials.user(),
        }),
        createBackendModule({
          pluginId: 'permission',
          moduleId: 'test-policy',
          register(env) {
            env.registerInit({
              deps: { policy: policyExtensionPoint },
              async init({ policy }) {
                policy.setPolicy({
                  async handle({ permission }) {
                    if (permission.name === adminPermission.name) {
                      if (instanceAdmin) {
                        return { result: AuthorizeResult.ALLOW };
                      }
                      return createAdminConditionalDecision(
                        adminPermission,
                        adminConditions.isPlugin({
                          pluginIds,
                        }),
                      );
                    }
                    return { result: AuthorizeResult.DENY };
                  },
                });
              },
            });
          },
        }),
      ],
    });
    const metadata = await request(server).get(
      '/api/permission/.well-known/backstage/permissions/metadata',
    );
    expect(metadata.status).toBe(200);
    expect(metadata.body.permissions).toEqual([adminPermission]);
    expect(metadata.body.rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'IS_PLUGIN',
          resourceType: 'permission-plugin',
        }),
      ]),
    );

    const items = [
      { id: 'universal', permission: adminPermission, resourceRef: false },
      ...['catalog', 'scaffolder', 'Catalog', '*'].map(resourceRef => ({
        id: resourceRef,
        permission: adminPermission,
        resourceRef,
      })),
      {
        id: 'unrelated',
        permission: createPermission({
          name: 'test.read',
          attributes: { action: 'read' },
        }),
      },
    ];
    const scoped = await request(server)
      .post('/api/permission/authorize')
      .send({ items });
    expect(scoped.status).toBe(200);
    expect(scoped.body.items).toEqual(
      items.map(({ id }) => ({
        id,
        result: id === 'catalog' ? AuthorizeResult.ALLOW : AuthorizeResult.DENY,
      })),
    );

    pluginIds = [];
    const denied = await request(server)
      .post('/api/permission/authorize')
      .send({ items });
    expect(denied.status).toBe(200);
    expect(denied.body.items).toEqual(
      items.map(({ id }) => ({ id, result: AuthorizeResult.DENY })),
    );

    const missingScope = await request(server)
      .post('/api/permission/authorize')
      .send({ items: [{ id: 'missing', permission: adminPermission }] });
    expect(missingScope.status).toBe(400);

    for (const invalid of [
      { permission: adminPermission, resourceRef: true },
      { permission: adminPermission, resourceRef: [false] },
      { permission: items[items.length - 1].permission, resourceRef: false },
    ]) {
      const response = await request(server)
        .post('/api/permission/authorize')
        .send({ items: [{ id: 'invalid', ...invalid }] });
      expect(response.status).toBe(400);
    }

    instanceAdmin = true;
    const global = await request(server)
      .post('/api/permission/authorize')
      .send({ items });
    expect(global.status).toBe(200);
    expect(global.body.items).toEqual(
      items.map(({ id }) => ({
        id,
        result:
          id === 'unrelated' ? AuthorizeResult.DENY : AuthorizeResult.ALLOW,
      })),
    );
  });
});
