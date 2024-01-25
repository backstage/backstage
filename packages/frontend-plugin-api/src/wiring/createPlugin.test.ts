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
import { createApp } from '@backstage/frontend-app-api';
import { screen } from '@testing-library/react';
import { createSchemaFromZod } from '../schema/createSchemaFromZod';
import { createPlugin } from './createPlugin';
import { JsonObject } from '@backstage/types';
import { createExtension } from './createExtension';
import { createExtensionDataRef } from './createExtensionDataRef';
import { coreExtensionData } from './coreExtensionData';
import { MockConfigApi, renderWithEffects } from '@backstage/test-utils';
import { createExtensionInput } from './createExtensionInput';
import { BackstagePlugin } from './types';

const nameExtensionDataRef = createExtensionDataRef<string>('name');

const Extension1 = createExtension({
  name: '1',
  attachTo: { id: 'test/output', input: 'names' },
  output: {
    name: nameExtensionDataRef,
  },
  factory() {
    return { name: 'extension-1' };
  },
});

const Extension2 = createExtension({
  name: '2',
  attachTo: { id: 'test/output', input: 'names' },
  output: {
    name: nameExtensionDataRef,
  },
  configSchema: createSchemaFromZod(z =>
    z.object({ name: z.string().default('extension-2') }),
  ),
  factory({ config }) {
    return { name: config.name };
  },
});

const Extension3 = createExtension({
  name: '3',
  attachTo: { id: 'test/output', input: 'names' },
  inputs: {
    addons: createExtensionInput({
      name: nameExtensionDataRef,
    }),
  },
  output: {
    name: nameExtensionDataRef,
  },
  factory({ inputs }) {
    return {
      name: `extension-3:${inputs.addons.map(n => n.output.name).join('-')}`,
    };
  },
});

const Child = createExtension({
  name: 'child',
  attachTo: { id: 'test/3', input: 'addons' },
  output: {
    name: nameExtensionDataRef,
  },
  configSchema: createSchemaFromZod(z =>
    z.object({ name: z.string().default('child') }),
  ),
  factory({ config }) {
    return { name: config.name };
  },
});

const Child2 = createExtension({
  name: 'child2',
  attachTo: { id: 'test/3', input: 'addons' },
  output: {
    name: nameExtensionDataRef,
  },
  configSchema: createSchemaFromZod(z =>
    z.object({ name: z.string().default('child2') }),
  ),
  factory({ config }) {
    return { name: config.name };
  },
});

const outputExtension = createExtension({
  name: 'output',
  attachTo: { id: 'app', input: 'root' },
  inputs: {
    names: createExtensionInput({
      name: nameExtensionDataRef,
    }),
  },
  output: {
    element: coreExtensionData.reactElement,
  },
  factory({ inputs }) {
    return {
      element: React.createElement('span', {}, [
        `Names: ${inputs.names.map(n => n.output.name).join(', ')}`,
      ]),
    };
  },
});

function createTestAppRoot({
  features,
  config = {},
}: {
  features: BackstagePlugin[];
  config: JsonObject;
}) {
  return createApp({
    features,
    configLoader: async () => ({ config: new MockConfigApi(config) }),
  }).createRoot();
}

describe('createPlugin', () => {
  it('should create an empty plugin', () => {
    const plugin = createPlugin({ id: 'test' });

    expect(plugin).toBeDefined();
    expect(String(plugin)).toBe('Plugin{id=test}');
  });

  it('should create a plugin with extension instances', async () => {
    const plugin = createPlugin({
      id: 'test',
      extensions: [Extension1, Extension2, outputExtension],
    });
    expect(plugin).toBeDefined();

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
    const plugin = createPlugin({
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
        'Names: extension-1, extension-2-renamed, extension-3:child',
      ),
    ).resolves.toBeInTheDocument();
  });

  it('should create a plugin with nested extension instances and multiple children', async () => {
    const plugin = createPlugin({
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
      createPlugin({
        id: 'test',
        extensions: [Extension1, Extension1],
      }),
    ).toThrow("Plugin 'test' provided duplicate extensions: test/1");

    expect(() =>
      createPlugin({
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
});
