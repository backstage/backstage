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
  createExtensionDataRef,
  createExtensionInput,
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

  describe('throws an error when immediate cyclical dependencies are found', () => {
    it('in an immediate level (e.g., A -> A)', () => {
      const config = new MockConfigApi({});

      const addonExtensionData =
        createExtensionDataRef<JSX.Element>('plugin.page.addon');

      const CyclicalA = createExtension({
        id: 'A', // Same id as ancestor A
        at: 'A/addons',
        inputs: {},
        output: {
          element: addonExtensionData,
        },
        factory({ bind }) {
          bind({
            element: <div key="cyclical-a">Cyclical A</div>,
          });
        },
      });

      const A = createPageExtension({
        id: 'A',
        defaultPath: '/',
        routeRef: createRouteRef({ id: 'A.route' }),
        inputs: {
          addons: createExtensionInput({
            element: addonExtensionData,
          }),
        },
        loader: async ({ inputs }) => (
          <div>A {inputs.addons.map(({ element }) => element)}</div>
        ),
      });

      const plugins = [
        createPlugin({
          id: 'plugin',
          extensions: [A, CyclicalA],
        }),
      ];

      expect(() => createInstances({ config, plugins })).toThrow(
        /There is a cyclical dependency with the extension "A": (.*) → A → A/,
      );
    });

    it('in an intermediate level (e.g., A -> B -> A)', () => {
      const config = new MockConfigApi({});

      const addonExtensionData =
        createExtensionDataRef<JSX.Element>('plugin.page.addon');

      const CyclicalA = createExtension({
        id: 'A', // Same id as ancestor A
        at: 'B/addons',
        inputs: {
          addons: createExtensionInput({
            element: addonExtensionData,
          }),
        },
        output: {
          element: addonExtensionData,
        },
        factory({ bind }) {
          bind({
            element: <div key="cyclical-a">Cyclical A</div>,
          });
        },
      });

      const B = createExtension({
        id: 'B',
        at: 'A/addons',
        inputs: {
          addons: createExtensionInput({
            element: addonExtensionData,
          }),
        },
        output: {
          element: addonExtensionData,
        },
        factory({ bind }) {
          bind({
            element: <div key="b">B</div>,
          });
        },
      });

      const A = createPageExtension({
        id: 'A',
        defaultPath: '/',
        routeRef: createRouteRef({ id: 'A.route' }),
        inputs: {
          addons: createExtensionInput({
            element: addonExtensionData,
          }),
        },
        loader: async ({ inputs }) => (
          <div>A {inputs.addons.map(({ element }) => element)}</div>
        ),
      });

      const plugins = [
        createPlugin({
          id: 'plugin',
          extensions: [A, B, CyclicalA],
        }),
      ];

      expect(() => createInstances({ config, plugins })).toThrow(
        /There is a cyclical dependency with the extension "A": (.*) → A → B → A/,
      );
    });

    it('in an deep level (e.g., A -> B -> C -> D -> B)', () => {
      const config = new MockConfigApi({});

      const addonRendererInput =
        createExtensionDataRef<() => JSX.Element>('A.addon.renderer');

      const addonElementInput =
        createExtensionDataRef<JSX.Element>('A.addon.element');

      const CyclicalB = createExtension({
        id: 'B', // Same id as ancestor B
        at: 'D/addons',
        inputs: {},
        output: {
          element: addonElementInput,
        },
        factory({ bind }) {
          bind({
            element: <div key="cyclical-b">Cyclical B</div>,
          });
        },
      });

      const D = createExtension({
        id: 'D',
        at: 'C/addons',
        inputs: {
          addons: createExtensionInput({
            element: addonElementInput,
          }),
        },
        output: {
          element: addonElementInput,
        },
        factory({ bind }) {
          bind({
            element: <div key="d">D</div>,
          });
        },
      });

      const C = createExtension({
        id: 'C',
        at: 'B/renderer',
        inputs: {
          addons: createExtensionInput({
            element: addonElementInput,
          }),
        },
        output: {
          renderer: addonRendererInput,
        },
        factory({ bind }) {
          bind({
            renderer: () => <div key="c">C</div>,
          });
        },
      });

      const B = createExtension({
        id: 'B',
        at: 'A/addons',
        inputs: {
          renderer: createExtensionInput(
            {
              element: addonRendererInput,
            },
            { singleton: true, required: false },
          ),
        },
        output: {
          element: addonElementInput,
        },
        factory({ bind, inputs }) {
          bind({
            element: inputs.renderer?.element() ?? <div key="b">B</div>,
          });
        },
      });

      const A = createPageExtension({
        id: 'A',
        defaultPath: '/',
        routeRef: createRouteRef({ id: 'A.route' }),
        inputs: {
          addons: createExtensionInput({
            element: addonElementInput,
          }),
        },
        loader: async ({ inputs }) => (
          <div>A {inputs.addons.map(({ element }) => element)}</div>
        ),
      });

      const plugins = [
        createPlugin({
          id: 'plugin',
          extensions: [A, B, C, D, CyclicalB],
        }),
      ];

      expect(() => createInstances({ config, plugins })).toThrow(
        /There is a cyclical dependency with the extension "B": (.*) → A → B → C → D → B/,
      );
    });
  });
});
