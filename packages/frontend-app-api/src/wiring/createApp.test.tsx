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
  createExtensionOverrides,
  createPageExtension,
  createPlugin,
  createThemeExtension,
} from '@backstage/frontend-plugin-api';
import { createApp, createInstances } from './createApp';
import { screen } from '@testing-library/react';
import { MockConfigApi, renderWithEffects } from '@backstage/test-utils';
import React from 'react';
import { createRouteRef } from '@backstage/core-plugin-api';

const extBaseConfig = {
  id: 'test',
  attachTo: { id: 'root', input: 'default' },
  output: {},
  factory() {},
};

describe('createInstances', () => {
  it('throws an error when a core extension is parametrized', () => {
    const config = new MockConfigApi({
      app: {
        extensions: [
          {
            core: {},
          },
        ],
      },
    });
    const features = [
      createPlugin({
        id: 'plugin',
        extensions: [],
      }),
    ];
    expect(() => createInstances({ config, features })).toThrow(
      "A 'core' extension configuration was detected, but the core extension is not configurable",
    );
  });

  it('throws an error when a core extension is overridden', () => {
    const config = new MockConfigApi({});
    const features = [
      createPlugin({
        id: 'plugin',
        extensions: [
          createExtension({
            id: 'core',
            attachTo: { id: 'core.routes', input: 'route' },
            inputs: {},
            output: {},
            factory() {},
          }),
        ],
      }),
    ];
    expect(() => createInstances({ config, features })).toThrow(
      "The following plugin(s) are overriding the 'core' extension which is forbidden: plugin",
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

    const features = [PluginA, PluginB];

    expect(() => createInstances({ config, features })).toThrow(
      "The following extensions are duplicated: The extension 'A' was provided 2 time(s) by the plugin 'A' and 1 time(s) by the plugin 'B', The extension 'B' was provided 2 time(s) by the plugin 'B'",
    );
  });

  it('throws an error when duplicated extension overrides are detected', () => {
    expect(() =>
      createInstances({
        config: new MockConfigApi({}),
        features: [
          createExtensionOverrides({
            extensions: [
              createExtension({ ...extBaseConfig, id: 'a' }),
              createExtension({ ...extBaseConfig, id: 'a' }),
              createExtension({ ...extBaseConfig, id: 'b' }),
            ],
          }),
          createExtensionOverrides({
            extensions: [createExtension({ ...extBaseConfig, id: 'b' })],
          }),
        ],
      }),
    ).toThrow('The following extensions had duplicate overrides: a, b');
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
      features: [
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
    const { coreInstance } = createInstances({
      config: new MockConfigApi({}),
      features: [],
    });

    expect(String(coreInstance)).toMatchInlineSnapshot(`
      "<core out=[core.reactElement]>
        root [
          <core.layout out=[core.reactElement]>
            content [
              <core.routes out=[core.reactElement] />
            ]
            nav [
              <core.nav out=[core.reactElement] />
            ]
          </core.layout>
        ]
        themes [
          <themes.light out=[core.theme] />
          <themes.dark out=[core.theme] />
        ]
      </core>"
    `);
  });

  it('should serialize an app as JSON', () => {
    const { coreInstance } = createInstances({
      config: new MockConfigApi({}),
      features: [],
    });

    expect(JSON.parse(JSON.stringify(coreInstance))).toMatchInlineSnapshot(`
      {
        "attachments": {
          "root": [
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
        "output": [
          "core.reactElement",
        ],
      }
    `);
  });
});
