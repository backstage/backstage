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

import {
  createBackendModule,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import request from 'supertest';
import { catalogModelRegistryServiceRef } from './catalogModelRegistryService';

describe('catalogModelRegistryServiceRef', () => {
  it('should serve registered kind extensions via the router', async () => {
    const testPlugin = createBackendPlugin({
      pluginId: 'test',
      register(env) {
        env.registerInit({
          deps: {},
          async init() {},
        });
      },
    });

    const testModule = createBackendModule({
      moduleId: 'test-model',
      pluginId: 'test',
      register(env) {
        env.registerInit({
          deps: {
            modelRegistry: catalogModelRegistryServiceRef,
          },
          async init({ modelRegistry }) {
            modelRegistry.registerModelExtension('my-model', model => {
              model.addKind({
                group: 'example.com',
                names: {
                  kind: 'MyKind',
                  singular: 'mykind',
                  plural: 'mykinds',
                },
                description: 'A test kind',
                versions: [
                  {
                    name: 'v1alpha1',
                    schema: { jsonSchema: { type: 'object', properties: {} } },
                  },
                ],
              });
            });
          },
        });
      },
    });

    const { server } = await startTestBackend({
      features: [testPlugin, testModule],
    });

    const res = await request(server).get(
      '/api/test/.backstage/catalog-model/v1/extensions',
    );

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      extensions: [
        expect.objectContaining({
          pluginId: 'test',
          modelName: 'my-model',
        }),
      ],
    });

    const extension = res.body.extensions[0];
    expect(extension.ops).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'declareKind.v1',
          kind: 'MyKind',
          properties: {
            singular: 'mykind',
            plural: 'mykinds',
            description: 'A test kind',
          },
        }),
      ]),
    );
  });

  it('should return empty extensions when nothing is registered', async () => {
    const testPlugin = createBackendPlugin({
      pluginId: 'test',
      register(env) {
        env.registerInit({
          deps: {},
          async init() {},
        });
      },
    });

    const testModule = createBackendModule({
      moduleId: 'test-model',
      pluginId: 'test',
      register(env) {
        env.registerInit({
          deps: {
            modelRegistry: catalogModelRegistryServiceRef,
          },
          async init() {},
        });
      },
    });

    const { server } = await startTestBackend({
      features: [testPlugin, testModule],
    });

    const res = await request(server).get(
      '/api/test/.backstage/catalog-model/v1/extensions',
    );

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ extensions: [] });
  });
});
