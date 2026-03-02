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
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import { catalogModelRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { catalogModelRegistryServiceFactory } from './catalogModelRegistryServiceFactory';
import { httpRouterServiceFactory } from '../../../entrypoints/httpRouter';
import request from 'supertest';

describe('catalogModelRegistryServiceFactory', () => {
  const defaultServices = [
    catalogModelRegistryServiceFactory,
    httpRouterServiceFactory,
  ];

  it('should list registered annotations as JSON Schema', async () => {
    const { server } = await startTestBackend({
      features: [
        createBackendPlugin({
          pluginId: 'test-plugin',
          register(reg) {
            reg.registerInit({
              deps: {
                catalogModelRegistry: catalogModelRegistryServiceRef,
              },
              async init({ catalogModelRegistry }) {
                catalogModelRegistry.registerAnnotations({
                  entityKind: 'Component',
                  annotations: zod =>
                    zod.object({
                      'test.io/my-annotation': zod
                        .string()
                        .describe('A test annotation'),
                    }),
                });
              },
            });
          },
        }),
        ...defaultServices,
      ],
    });

    const { body, status } = await request(server).get(
      '/api/test-plugin/.backstage/catalog-model/v1/annotations',
    );

    expect(status).toBe(200);
    expect(body).toMatchObject({
      annotations: [
        {
          key: 'test.io/my-annotation',
          pluginId: 'test-plugin',
          entityKind: 'Component',
          description: 'A test annotation',
          schema: { type: 'string', description: 'A test annotation' },
        },
      ],
    });
  });

  it('should list annotations from multiple registrations', async () => {
    const { server } = await startTestBackend({
      features: [
        createBackendPlugin({
          pluginId: 'multi-kind',
          register(reg) {
            reg.registerInit({
              deps: {
                catalogModelRegistry: catalogModelRegistryServiceRef,
              },
              async init({ catalogModelRegistry }) {
                catalogModelRegistry.registerAnnotations({
                  entityKind: 'Component',
                  annotations: zod =>
                    zod.object({
                      'test.io/component-only': zod.string(),
                    }),
                });
                catalogModelRegistry.registerAnnotations({
                  entityKind: 'Resource',
                  annotations: zod =>
                    zod.object({
                      'test.io/resource-only': zod.string(),
                    }),
                });
              },
            });
          },
        }),
        ...defaultServices,
      ],
    });

    const { body, status } = await request(server).get(
      '/api/multi-kind/.backstage/catalog-model/v1/annotations',
    );

    expect(status).toBe(200);
    expect(body.annotations).toHaveLength(2);
    expect(body.annotations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'test.io/component-only',
          entityKind: 'Component',
        }),
        expect.objectContaining({
          key: 'test.io/resource-only',
          entityKind: 'Resource',
        }),
      ]),
    );
  });

  it('should serialize optional annotations correctly', async () => {
    const { server } = await startTestBackend({
      features: [
        createBackendPlugin({
          pluginId: 'test-plugin',
          register(reg) {
            reg.registerInit({
              deps: {
                catalogModelRegistry: catalogModelRegistryServiceRef,
              },
              async init({ catalogModelRegistry }) {
                catalogModelRegistry.registerAnnotations({
                  entityKind: 'Component',
                  annotations: zod =>
                    zod.object({
                      'test.io/required': zod.string(),
                      'test.io/optional': zod.string().optional(),
                    }),
                });
              },
            });
          },
        }),
        ...defaultServices,
      ],
    });

    const { body, status } = await request(server).get(
      '/api/test-plugin/.backstage/catalog-model/v1/annotations',
    );

    expect(status).toBe(200);
    expect(body.annotations).toHaveLength(2);
  });
});
