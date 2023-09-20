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
      'A "root" extension was detected on the config file and root extensions are not configurable',
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
      'The following plugins are overriding root extensions and root extensions cannot be overridden: plugin',
    );
  });

  describe('throws an error when immediate cyclical dependencies are found', () => {
    it('in an immediate level (e.g., A(plugin.page) -> A(plugin.page))', () => {
      const config = new MockConfigApi({});

      const addonExtensionData =
        createExtensionDataRef<JSX.Element>('plugin.page.addon');

      const addon = createExtension({
        id: 'plugin.page', // cyclical
        at: 'plugin.page/addons',
        inputs: {},
        output: {
          element: addonExtensionData,
        },
        factory({ bind }) {
          bind({
            element: <div key="addon">Addon</div>,
          });
        },
      });

      const page = createPageExtension({
        id: 'plugin.page',
        defaultPath: '/',
        routeRef: createRouteRef({ id: 'plugins.page.addon' }),
        inputs: {
          addons: createExtensionInput({
            element: addonExtensionData,
          }),
        },
        loader: async ({ inputs }) => (
          <div>Page {inputs.addons.map(({ element }) => element)}</div>
        ),
      });

      const plugins = [
        createPlugin({
          id: 'plugin',
          extensions: [page, addon],
        }),
      ];

      expect(() => createInstances({ config, plugins })).toThrow(
        'There is a cyclical dependency with the extension "plugin.page": core.layout → core.routes → plugin.page → plugin.page',
      );
    });

    it('in an intermediate level (e.g., A(core.routes) -> B(plugin.page) -> A(core.routes))', () => {
      const config = new MockConfigApi({});

      const addonExtensionData =
        createExtensionDataRef<JSX.Element>('plugin.page.addon');

      const addon = createExtension({
        id: 'core.routes', // cyclical
        at: 'plugin.page/addons',
        inputs: {},
        output: {
          element: addonExtensionData,
        },
        factory({ bind }) {
          bind({
            element: <div key="addon">Addon</div>,
          });
        },
      });

      const page = createPageExtension({
        id: 'plugin.page',
        defaultPath: '/',
        routeRef: createRouteRef({ id: 'plugins.page.addon' }),
        inputs: {
          addons: createExtensionInput({
            element: addonExtensionData,
          }),
        },
        loader: async ({ inputs }) => (
          <div>Page {inputs.addons.map(({ element }) => element)}</div>
        ),
      });

      const plugins = [
        createPlugin({
          id: 'plugin',
          extensions: [page, addon],
        }),
      ];

      expect(() => createInstances({ config, plugins })).toThrow(
        'There is a cyclical dependency with the extension "core.routes": core.layout → core.routes → plugin.page → core.routes',
      );
    });

    it('in an deep level (e.g., A(core.layout) -> B(core.routes) -> C(plugin.page) -> D(plugin.page.addon) -> B(core.routes))', () => {
      const config = new MockConfigApi({});

      const addonRendererInput = createExtensionDataRef<() => JSX.Element>(
        'plugin.page.addon.renderer',
      );

      const renderer = createExtension({
        id: 'core.routes', // cyclical
        at: 'plugin.page.addon/renderer',
        inputs: {},
        output: {
          renderer: addonRendererInput,
        },
        factory({ bind }) {
          bind({
            renderer: () => <div key="addon">Addon</div>,
          });
        },
      });

      const addonElementInput = createExtensionDataRef<JSX.Element>(
        'plugin.page.addon.element',
      );

      const addon = createExtension({
        id: 'plugin.page.addon',
        at: 'plugin.page/addons',
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
            element: inputs.renderer?.element() ?? <div key="addon">Addon</div>,
          });
        },
      });

      const page = createPageExtension({
        id: 'plugin.page',
        defaultPath: '/',
        routeRef: createRouteRef({ id: 'plugins.page.addon' }),
        inputs: {
          addons: createExtensionInput({
            element: addonElementInput,
          }),
        },
        loader: async ({ inputs }) => (
          <div>Page {inputs.addons.map(({ element }) => element)}</div>
        ),
      });

      const plugins = [
        createPlugin({
          id: 'plugin',
          extensions: [page, addon, renderer],
        }),
      ];

      expect(() => createInstances({ config, plugins })).toThrow(
        'There is a cyclical dependency with the extension "core.routes": core.layout → core.routes → plugin.page → plugin.page.addon → core.routes',
      );
    });
  });
});
