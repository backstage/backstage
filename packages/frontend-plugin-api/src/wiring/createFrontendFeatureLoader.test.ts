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

import React from 'react';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { createApp } from '../../../frontend-defaults/src/createApp';
import { screen } from '@testing-library/react';
import { createFrontendPlugin } from './createFrontendPlugin';
import { JsonObject } from '@backstage/types';
import { createExtension } from './createExtension';
import { createExtensionDataRef } from './createExtensionDataRef';
import { coreExtensionData } from './coreExtensionData';
import { mockApis, renderWithEffects } from '@backstage/test-utils';
import { createExtensionInput } from './createExtensionInput';
import {
  CreateFrontendFeatureLoaderOptions,
  InternalFrontendFeatureLoader,
  createFrontendFeatureLoader,
  FrontendFeatureLoader,
} from './createFrontendFeatureLoader';
import { FrontendFeature } from './types';

const nameExtensionDataRef = createExtensionDataRef<string>().with({
  id: 'name',
});

function createTestAppRoot({
  features,
  config = {},
}: {
  features: (FrontendFeature | FrontendFeatureLoader)[];
  config: JsonObject;
}) {
  return createApp({
    features: [...features],
    configLoader: async () => ({ config: mockApis.config({ data: config }) }),
  }).createRoot();
}

describe('createFrontendFeatureLoader', () => {
  it('should create several plugins with only one feature loader', async () => {
    const featureLoader: FrontendFeatureLoader = createFrontendFeatureLoader({
      loader({ config }) {
        const pluginIdPrefix = config.getOptionalString('pluginIdPrefix');
        const extensionNamePrefix = config.getOptionalString(
          'extensionNamePrefix',
        );
        return [
          createFrontendPlugin({
            id: `${pluginIdPrefix}-1`,
            extensions: [
              createExtension({
                name: '1',
                attachTo: {
                  id: `${pluginIdPrefix}-output/output`,
                  input: 'names',
                },
                output: [nameExtensionDataRef],
                factory() {
                  return [nameExtensionDataRef(`${extensionNamePrefix}-1`)];
                },
              }),
            ],
          }) as FrontendFeature | FrontendFeatureLoader,
          createFrontendPlugin({
            id: `${pluginIdPrefix}-2`,
            extensions: [
              createExtension({
                name: '2',
                attachTo: {
                  id: `${pluginIdPrefix}-output/output`,
                  input: 'names',
                },
                output: [nameExtensionDataRef],
                factory() {
                  return [nameExtensionDataRef(`${extensionNamePrefix}-2`)];
                },
              }),
            ],
          }) as FrontendFeature | FrontendFeatureLoader,
          createFrontendPlugin({
            id: `${pluginIdPrefix}-output`,
            extensions: [
              createExtension({
                name: 'output',
                attachTo: { id: 'app', input: 'root' },
                inputs: {
                  names: createExtensionInput([nameExtensionDataRef]),
                },
                output: [coreExtensionData.reactElement],
                factory({ inputs }) {
                  return [
                    coreExtensionData.reactElement(
                      React.createElement('span', {}, [
                        `Names: ${inputs.names
                          .map(n => n.get(nameExtensionDataRef))
                          .join(', ')}`,
                      ]),
                    ),
                  ];
                },
              }),
            ],
          }) as FrontendFeature | FrontendFeatureLoader,
        ];
      },
    } as CreateFrontendFeatureLoaderOptions);

    expect(featureLoader).toBeDefined();
    expect(String(featureLoader)).toMatch(
      /^FeatureLoader{description=created at '.*\/packages\/frontend-plugin-api\/src\/wiring\/createFrontendFeatureLoader\.test\.ts:.*'}$/,
    );

    await renderWithEffects(
      createTestAppRoot({
        features: [featureLoader],
        config: {
          app: { extensions: [{ 'app/root': false }] },
          extensionNamePrefix: 'extension',
          pluginIdPrefix: 'plugin',
        },
      }),
    );

    await expect(
      screen.findByText('Names: extension-1, extension-2'),
    ).resolves.toBeInTheDocument();
  });

  it('should propagate errors thrown by feature loaders', async () => {
    const featureLoader: FrontendFeature | FrontendFeatureLoader =
      createFrontendFeatureLoader({
        async loader(_) {
          throw new TypeError('boom');
        },
      });

    await expect(
      renderWithEffects(
        createTestAppRoot({
          features: [featureLoader],
          config: {},
        }),
      ),
    ).rejects.toThrow(
      /^Failed to read frontend features from loader created at '.*\/packages\/frontend-plugin-api\/src\/wiring\/createFrontendFeatureLoader\.test\.ts:.*': TypeError: boom$/,
    );
  });

  it('should support loading feature loaders', async () => {
    const featureLoader: FrontendFeature | FrontendFeatureLoader =
      createFrontendFeatureLoader({
        async loader(_) {
          return [
            createFrontendPlugin({
              id: 'plugin-0',
              extensions: [
                createExtension({
                  name: '0',
                  attachTo: {
                    id: 'plugin-output/output',
                    input: 'names',
                  },
                  output: [nameExtensionDataRef],
                  factory() {
                    return [nameExtensionDataRef('extension-0')];
                  },
                }),
              ],
            }),
            createFrontendFeatureLoader({
              async *loader(__) {
                yield createFrontendPlugin({
                  id: 'plugin-1',
                  extensions: [
                    createExtension({
                      name: '1',
                      attachTo: {
                        id: 'plugin-output/output',
                        input: 'names',
                      },
                      output: [nameExtensionDataRef],
                      factory() {
                        return [nameExtensionDataRef('extension-1')];
                      },
                    }),
                  ],
                });
                yield createFrontendFeatureLoader({
                  loader: async ___ => [
                    createFrontendPlugin({
                      id: 'plugin-2',
                      extensions: [
                        createExtension({
                          name: '2',
                          attachTo: {
                            id: 'plugin-output/output',
                            input: 'names',
                          },
                          output: [nameExtensionDataRef],
                          factory() {
                            return [nameExtensionDataRef('extension-2')];
                          },
                        }),
                      ],
                    }),
                  ],
                });
              },
            }),
            createFrontendPlugin({
              id: 'plugin-output',
              extensions: [
                createExtension({
                  name: 'output',
                  attachTo: { id: 'app', input: 'root' },
                  inputs: {
                    names: createExtensionInput([nameExtensionDataRef]),
                  },
                  output: [coreExtensionData.reactElement],
                  factory({ inputs }) {
                    return [
                      coreExtensionData.reactElement(
                        React.createElement('span', {}, [
                          `Names: ${inputs.names
                            .map(n => n.get(nameExtensionDataRef))
                            .join(', ')}`,
                        ]),
                      ),
                    ];
                  },
                }),
              ],
            }),
          ];
        },
      });

    expect(featureLoader).toBeDefined();
    expect(String(featureLoader)).toMatch(
      /^FeatureLoader{description=created at '.*\/packages\/frontend-plugin-api\/src\/wiring\/createFrontendFeatureLoader\.test\.ts:.*'}$/,
    );

    await renderWithEffects(
      createTestAppRoot({
        features: [featureLoader],
        config: {
          app: { extensions: [{ 'app/root': false }] },
        },
      }),
    );

    await expect(
      screen.findByText('Names: extension-0, extension-1, extension-2'),
    ).resolves.toBeInTheDocument();
  });

  it('should guard against infinite recursion of nested feature loaders', async () => {
    const nestedFeatureLoaderHolder: {
      loader?: FrontendFeature | FrontendFeatureLoader;
    } = {};
    const featureLoader: FrontendFeature | FrontendFeatureLoader =
      createFrontendFeatureLoader({
        loader: () =>
          [
            nestedFeatureLoaderHolder.loader,
            createFrontendPlugin({
              id: 'plugin',
              extensions: [
                createExtension({
                  name: 'output',
                  attachTo: { id: 'app', input: 'root' },
                  inputs: {},
                  output: [coreExtensionData.reactElement],
                  factory() {
                    return [
                      coreExtensionData.reactElement(
                        React.createElement('span', {}, [`My Content`]),
                      ),
                    ];
                  },
                }),
              ],
            }),
          ].filter<FrontendFeature | FrontendFeatureLoader>(
            (f): f is FrontendFeature | FrontendFeatureLoader =>
              f !== undefined,
          ),
      });
    nestedFeatureLoaderHolder.loader = featureLoader;

    expect(featureLoader).toBeDefined();
    expect(String(featureLoader)).toMatch(
      /^FeatureLoader{description=created at '.*\/packages\/frontend-plugin-api\/src\/wiring\/createFrontendFeatureLoader\.test\.ts:.*'}$/,
    );

    await renderWithEffects(
      createTestAppRoot({
        features: [featureLoader],
        config: {
          app: { extensions: [{ 'app/root': false }] },
        },
      }),
    );
  });

  it('should support multiple output formats', async () => {
    const feature = createFrontendPlugin({
      id: 'test',
    });
    const dynamicFeature = Promise.resolve({ default: feature });

    async function extractResult(f: FrontendFeature | FrontendFeatureLoader) {
      const internal = f as InternalFrontendFeatureLoader;
      return internal.loader({ config: mockApis.config() });
    }

    await expect(
      extractResult(
        createFrontendFeatureLoader({
          loader() {
            return [feature];
          },
        }),
      ),
    ).resolves.toEqual([feature]);

    await expect(
      extractResult(
        createFrontendFeatureLoader({
          async loader() {
            return [feature];
          },
        }),
      ),
    ).resolves.toEqual([feature]);

    await expect(
      extractResult(
        createFrontendFeatureLoader({
          *loader() {
            yield feature;
          },
        }),
      ),
    ).resolves.toEqual([feature]);

    await expect(
      extractResult(
        createFrontendFeatureLoader({
          async *loader() {
            yield feature;
          },
        }),
      ),
    ).resolves.toEqual([feature]);

    await expect(
      extractResult(
        createFrontendFeatureLoader({
          loader() {
            return [dynamicFeature];
          },
        }),
      ),
    ).resolves.toEqual([feature]);

    await expect(
      extractResult(
        createFrontendFeatureLoader({
          async loader() {
            return [dynamicFeature];
          },
        }),
      ),
    ).resolves.toEqual([feature]);

    await expect(
      extractResult(
        createFrontendFeatureLoader({
          *loader() {
            yield dynamicFeature;
          },
        }),
      ),
    ).resolves.toEqual([feature]);

    await expect(
      extractResult(
        createFrontendFeatureLoader({
          async *loader() {
            yield dynamicFeature;
          },
        }),
      ),
    ).resolves.toEqual([feature]);
  });

  it('should limit feature loading recursion', async () => {
    const plugin = createFrontendPlugin({
      id: 'plugin',
      extensions: [
        createExtension({
          name: 'output',
          attachTo: { id: 'app', input: 'root' },
          inputs: {},
          output: [coreExtensionData.reactElement],
          factory() {
            return [
              coreExtensionData.reactElement(
                React.createElement('span', {}, [`My Content`]),
              ),
            ];
          },
        }),
      ],
    });

    const featureLoader: FrontendFeature | FrontendFeatureLoader =
      createFrontendFeatureLoader({
        loader: () => [
          createFrontendFeatureLoader({
            loader: () => [
              createFrontendFeatureLoader({
                loader: () => [
                  createFrontendFeatureLoader({
                    loader: () => [
                      createFrontendFeatureLoader({
                        loader: () => [
                          createFrontendFeatureLoader({
                            loader: () => [plugin],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      });

    await expect(
      renderWithEffects(
        createTestAppRoot({
          features: [featureLoader],
          config: {
            app: { extensions: [{ 'app/root': false }] },
          },
        }),
      ),
    ).rejects.toThrow(
      /^Maximum feature loading recursion depth \(5\) reached for the feature loader created at '.*\/packages\/frontend-plugin-api\/src\/wiring\/createFrontendFeatureLoader\.test\.ts:.*'$/,
    );

    const nestedLoaders = await (
      featureLoader as InternalFrontendFeatureLoader
    ).loader({ config: mockApis.config() });
    await renderWithEffects(
      createTestAppRoot({
        features: [nestedLoaders[0]],
        config: {
          app: { extensions: [{ 'app/root': false }] },
        },
      }),
    );

    await expect(screen.findByText('My Content')).resolves.toBeInTheDocument();
  });
});
