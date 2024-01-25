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
import { createAppTree } from './createAppTree';

const extBase = {
  id: 'test',
  attachTo: { id: 'app', input: 'root' },
  output: {},
  factory: () => ({}),
};

describe('createAppTree', () => {
  it('throws an error when a app extension is parametrized', () => {
    const config = new MockConfigApi({
      app: {
        extensions: [
          {
            app: {},
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
      createAppTree({ features, config, builtinExtensions: [] }),
    ).toThrow("Configuration of the 'app' extension is forbidden");
  });

  it('throws an error when a app extension is overridden', () => {
    const config = new MockConfigApi({});
    const features = [
      createExtensionOverrides({
        extensions: [
          createExtension({
            name: 'app',
            attachTo: { id: 'app/routes', input: 'route' },
            inputs: {},
            output: {},
            factory: () => ({}),
          }),
        ],
      }),
    ];
    expect(() =>
      createAppTree({ features, config, builtinExtensions: [] }),
    ).toThrow(
      "It is forbidden to override the following extension(s): 'app', which is done by one or more extension overrides",
    );
  });

  it('throws an error when duplicated extension overrides are detected', () => {
    expect(() =>
      createAppTree({
        features: [
          createExtensionOverrides({
            extensions: [
              createExtension({ ...extBase, name: 'a' }),
              createExtension({ ...extBase, name: 'a' }),
              createExtension({ ...extBase, name: 'b' }),
            ],
          }),
          createExtensionOverrides({
            extensions: [createExtension({ ...extBase, name: 'b' })],
          }),
        ],
        config: new MockConfigApi({}),
        builtinExtensions: [],
      }),
    ).toThrow('The following extensions had duplicate overrides: a, b');
  });
});
