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
import { FrontendPlugin, createFrontendPlugin } from './createFrontendPlugin';
import { JsonObject } from '@backstage/types';
import { createExtension } from './createExtension';
import { createExtensionDataRef } from './createExtensionDataRef';
import { coreExtensionData } from './coreExtensionData';
import { mockApis, renderWithEffects } from '@backstage/test-utils';
import { createExtensionInput } from './createExtensionInput';

const nameExtensionDataRef = createExtensionDataRef<string>().with({
  id: 'name',
});

const Extension1 = createExtension({
  name: '1',
  attachTo: { id: 'test/output', input: 'names' },
  output: [nameExtensionDataRef],
  factory() {
    return [nameExtensionDataRef('extension-1')];
  },
});

const Extension2 = createExtension({
  name: '2',
  attachTo: { id: 'test/output', input: 'names' },
  output: [nameExtensionDataRef],
  config: {
    schema: {
      name: z => z.string().default('extension-2'),
    },
  },
  factory({ config }) {
    return [nameExtensionDataRef(config.name)];
  },
});

const Extension3 = createExtension({
  name: '3',
  attachTo: { id: 'test/output', input: 'names' },
  inputs: {
    addons: createExtensionInput([nameExtensionDataRef]),
  },
  output: [nameExtensionDataRef],
  factory({ inputs }) {
    return [
      nameExtensionDataRef(
        `extension-3:${inputs.addons
          .map(n => n.get(nameExtensionDataRef))
          .join('-')}`,
      ),
    ];
  },
});

const Child = createExtension({
  name: 'child',
  attachTo: { id: 'test/3', input: 'addons' },
  output: [nameExtensionDataRef],
  config: {
    schema: {
      name: z => z.string().default('child'),
    },
  },
  factory({ config }) {
    return [nameExtensionDataRef(config.name)];
  },
});

const Child2 = createExtension({
  name: 'child2',
  attachTo: { id: 'test/3', input: 'addons' },
  output: [nameExtensionDataRef],
  config: {
    schema: {
      name: z => z.string().default('child2'),
    },
  },
  factory({ config }) {
    return [nameExtensionDataRef(config.name)];
  },
});

const outputExtension = createExtension({
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
});

function createTestAppRoot({
  features,
  config = {},
}: {
  features: FrontendPlugin[];
  config: JsonObject;
}) {
  return createApp({
    features: [...features],
    configLoader: async () => ({ config: mockApis.config({ data: config }) }),
  }).createRoot();
}

describe('createFrontendPlugin', () => {
  it('should create an empty plugin', () => {
    const plugin = createFrontendPlugin({ id: 'test' });

    expect(plugin).toBeDefined();
    expect(String(plugin)).toBe('Plugin{id=test}');
  });

  it('should create a plugin with extension instances', async () => {
    const plugin = createFrontendPlugin({
      id: 'test',
      extensions: [Extension1, Extension2, outputExtension],
    });
    expect(plugin).toBeDefined();

    expect(plugin.getExtension('test/1')).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "test/output",
          "input": "names",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": undefined,
        "name": "1",
        "namespace": "test",
        "output": [
          [Function],
        ],
        "override": [Function],
        "toString": [Function],
        "version": "v2",
      }
    `);
    // @ts-expect-error
    expect(() => plugin.getExtension('nonexistent')).toThrow(
      /Attempted to get non-existent extension/,
    );

    await renderWithEffects(
      createTestAppRoot({
        features: [plugin],
        config: { app: { extensions: [{ 'app/root': false }] } },
      }),
    );

    await expect(
      screen.findByText('Names: extension-1, extension-2'),
    ).resolves.toBeInTheDocument();
  });

  it('should create a plugin with nested extension instances', async () => {
    const plugin = createFrontendPlugin({
      id: 'test',
      extensions: [Extension1, Extension2, Extension3, Child, outputExtension],
    });
    expect(plugin).toBeDefined();

    await renderWithEffects(
      createTestAppRoot({
        features: [plugin],
        config: {
          app: {
            extensions: [
              { 'app/root': false },
              {
                'test/2': {
                  config: { name: 'extension-2-renamed' },
                },
              },
            ],
          },
        },
      }),
    );

    await expect(
      screen.findByText(
        'Names: extension-2-renamed, extension-1, extension-3:child',
      ),
    ).resolves.toBeInTheDocument();
  });

  it('should create a plugin with nested extension instances and multiple children', async () => {
    const plugin = createFrontendPlugin({
      id: 'test',
      extensions: [
        Extension1,
        Extension2,
        Extension3,
        Child,
        Child2,
        outputExtension,
      ],
    });
    expect(plugin).toBeDefined();

    await renderWithEffects(
      createTestAppRoot({
        features: [plugin],
        config: {
          app: {
            extensions: [{ 'app/root': false }],
          },
        },
      }),
    );

    await expect(
      screen.findByText(
        'Names: extension-1, extension-2, extension-3:child-child2',
      ),
    ).resolves.toBeInTheDocument();
  });

  it('should throw on duplicate extensions', async () => {
    expect(() =>
      createFrontendPlugin({
        id: 'test',
        extensions: [Extension1, Extension1],
      }),
    ).toThrow("Plugin 'test' provided duplicate extensions: test/1");

    expect(() =>
      createFrontendPlugin({
        id: 'test',
        extensions: [
          Extension1,
          Extension2,
          Extension2,
          Extension3,
          Extension3,
          Extension3,
        ],
      }),
    ).toThrow("Plugin 'test' provided duplicate extensions: test/2, test/3");
  });

  describe('overrides', () => {
    it('should return a plugin instance with the correct namespace', () => {
      const plugin = createFrontendPlugin({
        id: 'test',
        extensions: [Extension1, Extension2],
      });

      expect(plugin.getExtension('test/1')).toMatchInlineSnapshot(`
        {
          "$$type": "@backstage/ExtensionDefinition",
          "T": undefined,
          "attachTo": {
            "id": "test/output",
            "input": "names",
          },
          "configSchema": undefined,
          "disabled": false,
          "factory": [Function],
          "inputs": {},
          "kind": undefined,
          "name": "1",
          "namespace": "test",
          "output": [
            [Function],
          ],
          "override": [Function],
          "toString": [Function],
          "version": "v2",
        }
      `);
    });

    it('should allow overriding extensions that have a matching ID, while keeping old extensions that do not have overlapping IDs', async () => {
      const plugin = createFrontendPlugin({
        id: 'test',
        extensions: [Extension1, Extension2, outputExtension],
      });

      await renderWithEffects(
        createTestAppRoot({
          features: [
            plugin.withOverrides({
              extensions: [
                plugin.getExtension('test/1').override({
                  factory() {
                    return [nameExtensionDataRef('overridden')];
                  },
                }),
              ],
            }),
          ],
          config: {
            app: {
              extensions: [{ 'app/root': false }],
            },
          },
        }),
      );

      await expect(
        screen.findByText('Names: extension-2, overridden'),
      ).resolves.toBeInTheDocument();
    });
  });
});
