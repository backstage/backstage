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
  AppTreeApi,
  appTreeApiRef,
  coreExtensionData,
  createExtension,
  createExtensionOverrides,
  createPageExtension,
  createPlugin,
  createThemeExtension,
} from '@backstage/frontend-plugin-api';
import { screen, waitFor } from '@testing-library/react';
import { createApp } from './createApp';
import { MockConfigApi, renderWithEffects } from '@backstage/test-utils';
import React from 'react';
import { featureFlagsApiRef, useApi } from '@backstage/core-plugin-api';

describe('createApp', () => {
  it('should allow themes to be installed', async () => {
    const app = createApp({
      configLoader: async () =>
        new MockConfigApi({
          app: {
            extensions: [
              { 'theme:app/light': false },
              { 'theme:app/dark': false },
            ],
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

  it('should deduplicate features keeping the last received one', async () => {
    const duplicatedFeatureId = 'test';
    const app = createApp({
      configLoader: async () => new MockConfigApi({}),
      features: [
        createPlugin({
          id: duplicatedFeatureId,
          extensions: [
            createPageExtension({
              defaultPath: '/',
              loader: async () => <div>First Page</div>,
            }),
          ],
        }),
        createPlugin({
          id: duplicatedFeatureId,
          extensions: [
            createPageExtension({
              defaultPath: '/',
              loader: async () => <div>Last Page</div>,
            }),
          ],
        }),
      ],
    });

    await renderWithEffects(app.createRoot());

    await waitFor(() =>
      expect(screen.queryByText('First Page')).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.getByText('Last Page')).toBeInTheDocument(),
    );
  });

  it('should register feature flags', async () => {
    const app = createApp({
      configLoader: async () => new MockConfigApi({}),
      features: [
        createPlugin({
          id: 'test',
          featureFlags: [{ name: 'test-1' }],
          extensions: [
            createExtension({
              name: 'first',
              attachTo: { id: 'core', input: 'root' },
              output: { element: coreExtensionData.reactElement },
              factory() {
                const Component = () => {
                  const flagsApi = useApi(featureFlagsApiRef);
                  return (
                    <div>
                      Flags:{' '}
                      {flagsApi
                        .getRegisteredFlags()
                        .map(flag => `${flag.name} from '${flag.pluginId}'`)
                        .join(', ')}
                    </div>
                  );
                };
                return { element: <Component /> };
              },
            }),
          ],
        }),
        createExtensionOverrides({
          featureFlags: [{ name: 'test-2' }],
          extensions: [
            createExtension({
              namespace: 'core',
              name: 'router',
              attachTo: { id: 'core', input: 'root' },
              disabled: true,
              output: {},
              factory: () => ({}),
            }),
          ],
        }),
      ],
    });

    await renderWithEffects(app.createRoot());

    await expect(
      screen.findByText("Flags: test-1 from 'test', test-2 from ''"),
    ).resolves.toBeInTheDocument();
  });

  it('should make the app structure available through the AppTreeApi', async () => {
    let appTreeApi: AppTreeApi | undefined = undefined;

    const app = createApp({
      configLoader: async () => new MockConfigApi({}),
      features: [
        createPlugin({
          id: 'my-plugin',
          extensions: [
            createPageExtension({
              defaultPath: '/',
              loader: async () => {
                const Component = () => {
                  appTreeApi = useApi(appTreeApiRef);
                  return <div>My Plugin Page</div>;
                };
                return <Component />;
              },
            }),
          ],
        }),
      ],
    });

    await renderWithEffects(app.createRoot());

    expect(appTreeApi).toBeDefined();
    const { tree } = appTreeApi!.getTree();

    expect(String(tree.root)).toMatchInlineSnapshot(`
      "<core out=[core.reactElement]>
        root [
          <core/router out=[core.reactElement]>
            children [
              <core/layout out=[core.reactElement]>
                content [
                  <core/routes out=[core.reactElement]>
                    routes [
                      <page:my-plugin out=[core.routing.path, core.routing.ref, core.reactElement] />
                    ]
                  </core/routes>
                ]
                nav [
                  <core/nav out=[core.reactElement] />
                ]
              </core/layout>
            ]
          </core/router>
        ]
        components [
          <component:core.components.progress out=[component.ref] />
          <component:core.components.errorBoundaryFallback out=[component.ref] />
          <component:core.components.bootErrorPage out=[component.ref] />
          <component:core.components.notFoundErrorPage out=[component.ref] />
        ]
        themes [
          <theme:app/light out=[core.theme] />
          <theme:app/dark out=[core.theme] />
        ]
      </core>"
    `);
  });
});
