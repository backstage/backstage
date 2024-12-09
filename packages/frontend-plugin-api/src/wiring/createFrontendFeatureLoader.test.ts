/*
 * Copyright 2023 The Backstage Authors
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
import { createFrontendFeatureLoader } from './createFrontendFeatureLoader';
import { FrontendFeature } from './types';

const nameExtensionDataRef = createExtensionDataRef<string>().with({
  id: 'name',
});

function createTestAppRoot({
  features,
  config = {},
}: {
  features: FrontendFeature[];
  config: JsonObject;
}) {
  return createApp({
    features: [...features],
    configLoader: async () => ({ config: mockApis.config({ data: config }) }),
  }).createRoot();
}

describe('createFrontendFeatureLoader', () => {
  it('should create several plugins with only one feature loader', async () => {
    const featureLoader: FrontendFeature = createFrontendFeatureLoader({
      name: 'test-frontend-feature-loader',
      async load({ config }) {
        const pluginIdPrefix = config.getOptionalString('pluginIdPrefix');
        const extensionNamePrefix = config.getOptionalString(
          'extensionNamePrefix',
        );
        return {
          features: [
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
            }),
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
            }),
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
            }),
          ],
        };
      },
    });

    expect(featureLoader).toBeDefined();
    expect(String(featureLoader)).toBe(
      'FeatureLoader{name=test-frontend-feature-loader}',
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
    const featureLoader: FrontendFeature = createFrontendFeatureLoader({
      name: 'test-frontend-feature-loader',
      async load(_) {
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
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to read frontend features from loader 'test-frontend-feature-loader', TypeError: boom"`,
    );
  });

  it('should support loading feature loaders', async () => {
    const featureLoader: FrontendFeature = createFrontendFeatureLoader({
      name: 'test-frontend-feature-loader',
      async load(_) {
        return {
          features: [
            createFrontendFeatureLoader({
              name: 'nested-frontent-feature-loader',
              load: async __ => ({
                features: [
                  createFrontendPlugin({
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
                  }),
                  createFrontendFeatureLoader({
                    name: 'nested-nested-frontent-feature-loader',
                    load: async ___ => ({
                      features: [
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
                    }),
                  }),
                ],
              }),
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
          ],
        };
      },
    });

    expect(featureLoader).toBeDefined();
    expect(String(featureLoader)).toBe(
      'FeatureLoader{name=test-frontend-feature-loader}',
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
      screen.findByText('Names: extension-1, extension-2'),
    ).resolves.toBeInTheDocument();
  });

  it('should guard against infinite recursion of nested feature loaders', async () => {
    const nestedFeatureLoaderHolder: {
      loader?: FrontendFeature;
    } = {};
    const featureLoader: FrontendFeature = createFrontendFeatureLoader({
      name: 'test-frontend-feature-loader',
      async load(_) {
        return {
          features: [nestedFeatureLoaderHolder.loader].filter<FrontendFeature>(
            (f): f is FrontendFeature => f !== undefined,
          ),
        };
      },
    });
    nestedFeatureLoaderHolder.loader = featureLoader;

    expect(featureLoader).toBeDefined();
    expect(String(featureLoader)).toBe(
      'FeatureLoader{name=test-frontend-feature-loader}',
    );

    await expect(
      renderWithEffects(
        createTestAppRoot({
          features: [featureLoader],
          config: {
            app: { extensions: [{ 'app/root': false }] },
          },
        }),
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Duplicate feature loaders with name: 'test-frontend-feature-loader'"`,
    );
  });
});
