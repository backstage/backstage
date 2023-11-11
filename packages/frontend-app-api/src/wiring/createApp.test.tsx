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
  createPageExtension,
  createPlugin,
  createThemeExtension,
} from '@backstage/frontend-plugin-api';
import { screen, waitFor } from '@testing-library/react';
import { createApp } from './createApp';
import { MockConfigApi, renderWithEffects } from '@backstage/test-utils';
import React from 'react';
import { useApi } from '@backstage/core-plugin-api';

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

  it('should deduplicate features keeping the last received one', async () => {
    const duplicatedFeatureId = 'test';
    const app = createApp({
      configLoader: async () => new MockConfigApi({}),
      features: [
        createPlugin({
          id: duplicatedFeatureId,
          extensions: [
            createPageExtension({
              id: 'test.page.first',
              defaultPath: '/',
              loader: async () => <div>First Page</div>,
            }),
          ],
        }),
        createPlugin({
          id: duplicatedFeatureId,
          extensions: [
            createPageExtension({
              id: 'test.page.last',
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

  it('should make the app structure available through the AppTreeApi', async () => {
    let appTreeApi: AppTreeApi | undefined = undefined;

    const app = createApp({
      configLoader: async () => new MockConfigApi({}),
      features: [
        createPlugin({
          id: 'my-plugin',
          extensions: [
            createPageExtension({
              id: 'plugin.my-plugin.page',
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
          <core.layout out=[core.reactElement]>
            content [
              <core.routes out=[core.reactElement]>
                routes [
                  <plugin.my-plugin.page out=[core.routing.path, core.routing.ref, core.reactElement] />
                ]
              </core.routes>
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
});
