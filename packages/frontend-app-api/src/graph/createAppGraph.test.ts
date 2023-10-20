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
  createPlugin,
} from '@backstage/frontend-plugin-api';
import { MockConfigApi } from '@backstage/test-utils';
import { createAppGraph } from './createAppGraph';

const extBase = {
  id: 'test',
  attachTo: { id: 'core', input: 'root' },
  output: {},
  factory() {},
};

describe('createAppGraph', () => {
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
    expect(() =>
      createAppGraph({ features, config, builtinExtensions: [] }),
    ).toThrow("Configuration of the 'core' extension is forbidden");
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
    expect(() =>
      createAppGraph({ features, config, builtinExtensions: [] }),
    ).toThrow(
      "It is forbidden to override the following extension(s): 'core', which is done by the following plugin(s): 'plugin'",
    );
  });

  it('throws an error when duplicated extensions are detected', () => {
    const config = new MockConfigApi({});

    const ExtensionA = createExtension({ ...extBase, id: 'A' });

    const ExtensionB = createExtension({ ...extBase, id: 'B' });

    const PluginA = createPlugin({
      id: 'A',
      extensions: [ExtensionA, ExtensionA],
    });

    const PluginB = createPlugin({
      id: 'B',
      extensions: [ExtensionA, ExtensionB, ExtensionB],
    });

    const features = [PluginA, PluginB];

    expect(() =>
      createAppGraph({ features, config, builtinExtensions: [] }),
    ).toThrow(
      "The following extensions are duplicated: The extension 'A' was provided 2 time(s) by the plugin 'A' and 1 time(s) by the plugin 'B', The extension 'B' was provided 2 time(s) by the plugin 'B'",
    );
  });

  it('throws an error when duplicated extension overrides are detected', () => {
    expect(() =>
      createAppGraph({
        features: [
          createExtensionOverrides({
            extensions: [
              createExtension({ ...extBase, id: 'a' }),
              createExtension({ ...extBase, id: 'a' }),
              createExtension({ ...extBase, id: 'b' }),
            ],
          }),
          createExtensionOverrides({
            extensions: [createExtension({ ...extBase, id: 'b' })],
          }),
        ],
        config: new MockConfigApi({}),
        builtinExtensions: [],
      }),
    ).toThrow('The following extensions had duplicate overrides: a, b');
  });
});
