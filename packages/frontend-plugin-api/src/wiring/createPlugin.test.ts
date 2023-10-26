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
import { createPlugin, BackstagePlugin } from './createPlugin';
import { JsonObject } from '@backstage/types';
import { createExtension } from './createExtension';
import { createExtensionDataRef } from './createExtensionDataRef';
import { coreExtensionData } from './coreExtensionData';
import { MockConfigApi, renderWithEffects } from '@backstage/test-utils';
import { createExtensionInput } from './createExtensionInput';

const nameExtensionDataRef = createExtensionDataRef<string>('name');

const TechRadarPage = createExtension({
  id: 'plugin.techradar.page',
  attachTo: { id: 'test.output', input: 'names' },
  output: {
    name: nameExtensionDataRef,
  },
  factory({ bind }) {
    bind({ name: 'TechRadar' });
  },
});

const CatalogPage = createExtension({
  id: 'plugin.catalog.page',
  attachTo: { id: 'test.output', input: 'names' },
  output: {
    name: nameExtensionDataRef,
  },
  configSchema: createSchemaFromZod(z =>
    z.object({ name: z.string().default('Catalog') }),
  ),
  factory({ bind, config }) {
    bind({ name: config.name });
  },
});

const TechDocsAddon = createExtension({
  id: 'plugin.techdocs.addon.example',
  attachTo: { id: 'plugin.techdocs.page', input: 'addons' },
  output: {
    name: nameExtensionDataRef,
  },
  configSchema: createSchemaFromZod(z =>
    z.object({ name: z.string().default('TechDocsAddon') }),
  ),
  factory({ bind, config }) {
    bind({ name: config.name });
  },
});

const TechDocsPage = createExtension({
  id: 'plugin.techdocs.page',
  attachTo: { id: 'test.output', input: 'names' },
  inputs: {
    addons: createExtensionInput({
      name: nameExtensionDataRef,
    }),
  },
  output: {
    name: nameExtensionDataRef,
  },
  factory({ bind, inputs }) {
    bind({ name: `TechDocs-${inputs.addons.map(n => n.name).join('-')}` });
  },
});

const outputExtension = createExtension({
  id: 'test.output',
  attachTo: { id: 'core', input: 'root' },
  inputs: {
    names: createExtensionInput({
      name: nameExtensionDataRef,
    }),
  },
  output: {
    element: coreExtensionData.reactElement,
  },
  factory({ bind, inputs }) {
    bind({
      element: React.createElement('span', {}, [
        `Names: ${inputs.names.map(n => n.name).join(', ')}`,
      ]),
    });
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
    configLoader: async () => new MockConfigApi(config),
  }).createRoot();
}

describe('createPlugin', () => {
  it('should create an empty plugin', () => {
    const plugin = createPlugin({ id: 'empty' });

    expect(plugin).toBeDefined();
  });

  it('should create a plugin with extension instances', async () => {
    const plugin = createPlugin({
      id: 'empty',
      extensions: [TechRadarPage, CatalogPage, outputExtension],
    });
    expect(plugin).toBeDefined();

    await renderWithEffects(
      createTestAppRoot({
        features: [plugin],
        config: { app: { extensions: [{ 'core.layout': false }] } },
      }),
    );

    await expect(
      screen.findByText('Names: TechRadar, Catalog'),
    ).resolves.toBeInTheDocument();
  });

  it('should create a plugin with nested extension instances', async () => {
    const plugin = createPlugin({
      id: 'empty',
      extensions: [
        TechRadarPage,
        CatalogPage,
        TechDocsPage,
        TechDocsAddon,
        outputExtension,
      ],
    });
    expect(plugin).toBeDefined();

    await renderWithEffects(
      createTestAppRoot({
        features: [plugin],
        config: {
          app: {
            extensions: [
              { 'core.layout': false },
              {
                'plugin.catalog.page': {
                  config: { name: 'CatalogRenamed' },
                },
              },
            ],
          },
        },
      }),
    );

    await expect(
      screen.findByText(
        'Names: TechRadar, CatalogRenamed, TechDocs-TechDocsAddon',
      ),
    ).resolves.toBeInTheDocument();
  });
});
