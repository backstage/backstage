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
  createPageExtension,
  createPlugin,
} from '@backstage/frontend-plugin-api';
import { createInstances } from './createApp';

import { MockConfigApi } from '@backstage/test-utils';
import React from 'react';
import { createRouteRef } from '@backstage/core-plugin-api';

describe('createInstances', () => {
  it('throws an error when a root extension is parametrized', () => {
    const config = new MockConfigApi({
      app: {
        extensions: [
          {
            root: {
              at: '',
            },
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
            at: 'core.routes/route',
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
