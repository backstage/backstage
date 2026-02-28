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
  createBackendPlugin,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import {
  CatalogModelService,
  catalogModelRegistryServiceRef,
  catalogModelServiceRef,
} from '@backstage/backend-plugin-api/alpha';
import { catalogModelRegistryServiceFactory } from './catalogModelRegistryServiceFactory';
import { catalogModelServiceFactory } from '../catalogModel/catalogModelServiceFactory';
import {
  catalogModelStoreServiceRef,
  DefaultCatalogModelStore,
} from './CatalogModelStore';

describe('catalogModelRegistryServiceFactory', () => {
  const storeFactory = createServiceFactory({
    service: catalogModelStoreServiceRef,
    deps: {},
    factory: () => new DefaultCatalogModelStore(),
  });

  const defaultServices = [
    catalogModelRegistryServiceFactory,
    catalogModelServiceFactory,
    storeFactory,
  ];

  it('should register annotations and list them via the model service', async () => {
    expect.assertions(1);

    await startTestBackend({
      features: [
        createBackendPlugin({
          pluginId: 'test-plugin',
          register(reg) {
            reg.registerInit({
              deps: {
                catalogModelRegistry: catalogModelRegistryServiceRef,
                catalogModel: catalogModelServiceRef,
              },
              async init({ catalogModelRegistry, catalogModel }) {
                catalogModelRegistry.registerAnnotations({
                  entityKind: 'Component',
                  annotations: zod =>
                    zod.object({
                      'test.io/my-annotation': zod
                        .string()
                        .describe('A test annotation'),
                    }),
                });

                expect(catalogModel.listAnnotations()).toEqual(
                  expect.arrayContaining([
                    expect.objectContaining({
                      key: 'test.io/my-annotation',
                      pluginId: 'test-plugin',
                      entityKind: 'Component',
                      description: 'A test annotation',
                    }),
                  ]),
                );
              },
            });
          },
        }),
        ...defaultServices,
      ],
    });
  });

  it('should filter annotations by entity kind', async () => {
    expect.assertions(4);

    await startTestBackend({
      features: [
        createBackendPlugin({
          pluginId: 'multi-kind',
          register(reg) {
            reg.registerInit({
              deps: {
                catalogModelRegistry: catalogModelRegistryServiceRef,
                catalogModel: catalogModelServiceRef,
              },
              async init({ catalogModelRegistry, catalogModel }) {
                catalogModelRegistry.registerAnnotations({
                  entityKind: 'Component',
                  annotations: zod =>
                    zod.object({ 'test.io/component-only': zod.string() }),
                });
                catalogModelRegistry.registerAnnotations({
                  entityKind: 'Resource',
                  annotations: zod =>
                    zod.object({ 'test.io/resource-only': zod.string() }),
                });

                const component = catalogModel.listAnnotations({
                  entityKind: 'Component',
                });
                const resource = catalogModel.listAnnotations({
                  entityKind: 'Resource',
                });

                expect(component).toHaveLength(1);
                expect(component[0].key).toBe('test.io/component-only');
                expect(resource).toHaveLength(1);
                expect(resource[0].key).toBe('test.io/resource-only');
              },
            });
          },
        }),
        ...defaultServices,
      ],
    });
  });

  it('should namespace registrations by plugin ID', async () => {
    let catalogModel: CatalogModelService;

    await startTestBackend({
      features: [
        createBackendPlugin({
          pluginId: 'plugin-a',
          register(reg) {
            reg.registerInit({
              deps: {
                catalogModelRegistry: catalogModelRegistryServiceRef,
              },
              async init({ catalogModelRegistry }) {
                catalogModelRegistry.registerAnnotations({
                  entityKind: 'Component',
                  annotations: zod =>
                    zod.object({ 'a.io/annotation': zod.string() }),
                });
              },
            });
          },
        }),
        createBackendPlugin({
          pluginId: 'plugin-b',
          register(reg) {
            reg.registerInit({
              deps: {
                catalogModelRegistry: catalogModelRegistryServiceRef,
              },
              async init({ catalogModelRegistry }) {
                catalogModelRegistry.registerAnnotations({
                  entityKind: 'Component',
                  annotations: zod =>
                    zod.object({ 'b.io/annotation': zod.string() }),
                });
              },
            });
          },
        }),
        createBackendPlugin({
          pluginId: 'consumer',
          register(reg) {
            reg.registerInit({
              deps: { cm: catalogModelServiceRef },
              async init({ cm }) {
                catalogModel = cm;
              },
            });
          },
        }),
        ...defaultServices,
      ],
    });

    const annotations = catalogModel!.listAnnotations();
    expect(annotations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'a.io/annotation',
          pluginId: 'plugin-a',
        }),
        expect.objectContaining({
          key: 'b.io/annotation',
          pluginId: 'plugin-b',
        }),
      ]),
    );
  });

  it('should validate entity annotations against registered schemas', async () => {
    expect.assertions(2);

    await startTestBackend({
      features: [
        createBackendPlugin({
          pluginId: 'validator',
          register(reg) {
            reg.registerInit({
              deps: {
                catalogModelRegistry: catalogModelRegistryServiceRef,
                catalogModel: catalogModelServiceRef,
              },
              async init({ catalogModelRegistry, catalogModel }) {
                catalogModelRegistry.registerAnnotations({
                  entityKind: 'Component',
                  annotations: zod =>
                    zod.object({
                      'test.io/count': zod.coerce.number().int(),
                    }),
                });

                expect(
                  catalogModel.validateEntity({
                    kind: 'Component',
                    metadata: { annotations: { 'test.io/count': '42' } },
                  }),
                ).toEqual({ valid: true, errors: [] });

                expect(
                  catalogModel.validateEntity({
                    kind: 'Component',
                    metadata: {
                      annotations: { 'test.io/count': 'not-a-number' },
                    },
                  }),
                ).toEqual({
                  valid: false,
                  errors: [
                    expect.objectContaining({
                      pluginId: 'validator',
                      annotation: 'test.io/count',
                    }),
                  ],
                });
              },
            });
          },
        }),
        ...defaultServices,
      ],
    });
  });

  it('should skip validation for annotations not present on the entity', async () => {
    expect.assertions(1);

    await startTestBackend({
      features: [
        createBackendPlugin({
          pluginId: 'test-plugin',
          register(reg) {
            reg.registerInit({
              deps: {
                catalogModelRegistry: catalogModelRegistryServiceRef,
                catalogModel: catalogModelServiceRef,
              },
              async init({ catalogModelRegistry, catalogModel }) {
                catalogModelRegistry.registerAnnotations({
                  entityKind: 'Component',
                  annotations: zod =>
                    zod.object({ 'test.io/required-looking': zod.string() }),
                });

                expect(
                  catalogModel.validateEntity({
                    kind: 'Component',
                    metadata: { annotations: {} },
                  }),
                ).toEqual({ valid: true, errors: [] });
              },
            });
          },
        }),
        ...defaultServices,
      ],
    });
  });

  it('should only validate against schemas for the matching entity kind', async () => {
    expect.assertions(1);

    await startTestBackend({
      features: [
        createBackendPlugin({
          pluginId: 'test-plugin',
          register(reg) {
            reg.registerInit({
              deps: {
                catalogModelRegistry: catalogModelRegistryServiceRef,
                catalogModel: catalogModelServiceRef,
              },
              async init({ catalogModelRegistry, catalogModel }) {
                catalogModelRegistry.registerAnnotations({
                  entityKind: 'Resource',
                  annotations: zod =>
                    zod.object({
                      'test.io/resource-annotation': zod.coerce.number().int(),
                    }),
                });

                expect(
                  catalogModel.validateEntity({
                    kind: 'Component',
                    metadata: {
                      annotations: {
                        'test.io/resource-annotation': 'not-a-number',
                      },
                    },
                  }),
                ).toEqual({ valid: true, errors: [] });
              },
            });
          },
        }),
        ...defaultServices,
      ],
    });
  });
});
