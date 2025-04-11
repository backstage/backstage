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
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import { createPermissionResourceRef } from '@backstage/plugin-permission-node';
import { permissionsRegistryServiceFactory } from './permissionsRegistryServiceFactory';

describe('permissionsRegistryServiceFactory', () => {
  it('should reject resource refs from other plugins', async () => {
    await expect(
      startTestBackend({
        features: [
          permissionsRegistryServiceFactory,
          createBackendPlugin({
            pluginId: 'test',
            register(reg) {
              reg.registerInit({
                deps: { permissionsRegistry: coreServices.permissionsRegistry },
                async init({ permissionsRegistry }) {
                  permissionsRegistry.addResourceType({
                    resourceRef: createPermissionResourceRef<
                      unknown,
                      unknown
                    >().with({
                      pluginId: 'other',
                      resourceType: 'some-resource',
                    }),
                    rules: [],
                  });
                },
              });
            },
          }),
        ],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Plugin 'test' startup failed; caused by Error: Resource type 'some-resource' belongs to plugin 'other', but was used with plugin 'test'"`,
    );

    await expect(
      startTestBackend({
        features: [
          permissionsRegistryServiceFactory,
          createBackendPlugin({
            pluginId: 'test',
            register(reg) {
              reg.registerInit({
                deps: { permissionsRegistry: coreServices.permissionsRegistry },
                async init({ permissionsRegistry }) {
                  permissionsRegistry.getPermissionRuleset(
                    createPermissionResourceRef<unknown, unknown>().with({
                      pluginId: 'other',
                      resourceType: 'some-resource',
                    }),
                  );
                },
              });
            },
          }),
        ],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Plugin 'test' startup failed; caused by Error: Resource type 'some-resource' belongs to plugin 'other', but was used with plugin 'test'"`,
    );
  });
});
