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

import {
  createExtension,
  createExtensionInput,
  createPageExtension,
  createPlugin,
  createThemeExtension,
} from '@backstage/frontend-plugin-api';
import { createApp, createInstances } from './createApp';
import { screen } from '@testing-library/react';
import { MockConfigApi, renderWithEffects } from '@backstage/test-utils';
import React from 'react';
import { createRouteRef } from '@backstage/core-plugin-api';
import { createExtensionInstance } from './createExtensionInstance';

describe('createInstances', () => {
  it('throws an error when a root extension is parametrized', () => {
    const config = new MockConfigApi({
      app: {
        extensions: [
          {
            root: {},
          },
        ],
      },
    });
    const plugins = [
      createPlugin({
        id: 'plugin',
        extensions: [],
      }),
    ];
    expect(() => createInstances({ config, plugins })).toThrow(
      "A 'root' extension configuration was detected, but the root extension is not configurable",
    );
  });

  it('throws an error when a root extension is overridden', () => {
    const config = new MockConfigApi({});
    const plugins = [
      createPlugin({
        id: 'plugin',
        extensions: [
          createExtension({
            id: 'root',
            attachTo: { id: 'core.routes', input: 'route' },
            inputs: {},
            output: {},
            factory() {},
          }),
        ],
      }),
    ];
    expect(() => createInstances({ config, plugins })).toThrow(
      "The following plugin(s) are overriding the 'root' extension which is forbidden: plugin",
    );
  });

  it('throws an error when duplicated extensions are detected', () => {
    const config = new MockConfigApi({});

    const ExtensionA = createPageExtension({
      id: 'A',
      defaultPath: '/',
      routeRef: createRouteRef({ id: 'A.route' }),
      loader: async () => <div>Extension A</div>,
    });

    const ExtensionB = createPageExtension({
      id: 'B',
      defaultPath: '/',
      routeRef: createRouteRef({ id: 'B.route' }),
      loader: async () => <div>Extension B</div>,
    });

    const PluginA = createPlugin({
      id: 'A',
      extensions: [ExtensionA, ExtensionA],
    });

    const PluginB = createPlugin({
      id: 'B',
      extensions: [ExtensionA, ExtensionB, ExtensionB],
    });

    const plugins = [PluginA, PluginB];

    expect(() => createInstances({ config, plugins })).toThrow(
      "The following extensions are duplicated: The extension 'A' was provided 2 time(s) by the plugin 'A' and 1 time(s) by the plugin 'B', The extension 'B' was provided 2 time(s) by the plugin 'B'",
    );
  });
});

describe('createApp', () => {
  it('should allow themes to be installed', async () => {
    const app = createApp({
      configLoader: async () =>
        new MockConfigApi({
          app: {
            extensions: [{ 'themes.light': false }, { 'themes.dark': false }],
          },
        }),
      plugins: [
        createPlugin({
          id: 'test',
          extensions: [
            createThemeExtension({
              id: 'derp',
              title: 'Derp',
              variant: 'dark',
              Provider: () => <div>Derp</div>,
            }),
          ],
        }),
      ],
    });

    await renderWithEffects(app.createRoot());

    await expect(screen.findByText('Derp')).resolves.toBeInTheDocument();
  });

  it('should log an app', () => {
    const { rootInstances } = createInstances({
      config: new MockConfigApi({}),
      plugins: [],
    });
    const root = createExtensionInstance({
      extension: createExtension({
        id: 'root',
        attachTo: { id: '', input: '' },
        inputs: {
          children: createExtensionInput({}),
        },
        output: {},
        factory() {},
      }),
      config: undefined,
      attachments: new Map([['children', rootInstances]]),
    });

    expect(String(root)).toMatchInlineSnapshot(`
      "<root>
        children [
          <core>
            themes [
              <themes.light out=[core.theme] />
              <themes.dark out=[core.theme] />
            ]
          </core>
          <core.layout out=[core.reactElement]>
            content [
              <core.routes out=[core.reactElement] />
            ]
            nav [
              <core.nav out=[core.reactElement] />
            ]
          </core.layout>
        ]
      </root>"
    `);
  });

  it('should serialize an app as JSON', () => {
    const { rootInstances } = createInstances({
      config: new MockConfigApi({}),
      plugins: [],
    });
    const root = createExtensionInstance({
      extension: createExtension({
        id: 'root',
        attachTo: { id: '', input: '' },
        inputs: {
          children: createExtensionInput({}),
        },
        output: {},
        factory() {},
      }),
      config: undefined,
      attachments: new Map([['children', rootInstances]]),
    });

    expect(JSON.parse(JSON.stringify(root))).toMatchInlineSnapshot(`
      {
        "attachments": {
          "children": [
            {
              "attachments": {
                "themes": [
                  {
                    "id": "themes.light",
                    "output": [
                      "core.theme",
                    ],
                  },
                  {
                    "id": "themes.dark",
                    "output": [
                      "core.theme",
                    ],
                  },
                ],
              },
              "id": "core",
            },
            {
              "attachments": {
                "content": [
                  {
                    "id": "core.routes",
                    "output": [
                      "core.reactElement",
                    ],
                  },
                ],
                "nav": [
                  {
                    "id": "core.nav",
                    "output": [
                      "core.reactElement",
                    ],
                  },
                ],
              },
              "id": "core.layout",
              "output": [
                "core.reactElement",
              ],
            },
          ],
        },
        "id": "root",
      }
    `);
  });
});
