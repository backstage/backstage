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
import { CreateAppFeatureLoader, createApp } from './createApp';
import { MockConfigApi, renderWithEffects } from '@backstage/test-utils';
import React from 'react';
import { featureFlagsApiRef, useApi } from '@backstage/core-plugin-api';

describe('createApp', () => {
  it('should allow themes to be installed', async () => {
    const app = createApp({
      configLoader: async () => ({
        config: new MockConfigApi({
          app: {
            extensions: [
              { 'theme:app/light': false },
              { 'theme:app/dark': false },
            ],
          },
        }),
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
      configLoader: async () => ({ config: new MockConfigApi({}) }),
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

  it('should support feature loaders', async () => {
    const loader: CreateAppFeatureLoader = {
      getLoaderName() {
        return 'test-loader';
      },
      async load({ config }) {
        return {
          features: [
            createPlugin({
              id: 'test',
              extensions: [
                createPageExtension({
                  defaultPath: '/',
                  loader: async () => <div>{config.getString('key')}</div>,
                }),
              ],
            }),
          ],
        };
      },
    };

    const app = createApp({
      configLoader: async () => ({
        config: new MockConfigApi({ key: 'config-value' }),
      }),
      features: [loader],
    });

    await renderWithEffects(app.createRoot());

    await expect(
      screen.findByText('config-value'),
    ).resolves.toBeInTheDocument();
  });

  it('should propagate errors thrown by feature loaders', async () => {
    const loader: CreateAppFeatureLoader = {
      getLoaderName() {
        return 'test-loader';
      },
      async load() {
        throw new TypeError('boom');
      },
    };

    const app = createApp({
      configLoader: async () => ({
        config: new MockConfigApi({}),
      }),
      features: [loader],
    });

    await expect(
      renderWithEffects(app.createRoot()),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to read frontend features from loader 'test-loader', TypeError: boom"`,
    );
  });

  it('should register feature flags', async () => {
    const app = createApp({
      configLoader: async () => ({ config: new MockConfigApi({}) }),
      features: [
        createPlugin({
          id: 'test',
          featureFlags: [{ name: 'test-1' }],
          extensions: [
            createExtension({
              name: 'first',
              attachTo: { id: 'app', input: 'root' },
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
              namespace: 'app',
              name: 'root',
              attachTo: { id: 'app', input: 'root' },
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
      configLoader: async () => ({ config: new MockConfigApi({}) }),
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
      "<app out=[core.reactElement]>
        root [
          <app/root out=[core.reactElement]>
            children [
              <app/layout out=[core.reactElement]>
                content [
                  <app/routes out=[core.reactElement]>
                    routes [
                      <page:my-plugin out=[core.routing.path, core.routing.ref, core.reactElement] />
                    ]
                  </app/routes>
                ]
                nav [
                  <app/nav out=[core.reactElement] />
                ]
              </app/layout>
            ]
            elements [
              <app-root-element:app/oauth-request-dialog out=[core.reactElement] />
              <app-root-element:app/alert-display out=[core.reactElement] />
            ]
          </app/root>
        ]
        components [
          <component:core.components.progress out=[core.component.component] />
          <component:core.components.errorBoundaryFallback out=[core.component.component] />
          <component:core.components.notFoundErrorPage out=[core.component.component] />
        ]
        themes [
          <theme:app/light out=[core.theme.theme] />
          <theme:app/dark out=[core.theme.theme] />
        ]
        apis [
          <api:core.discovery out=[core.api.factory] />
          <api:core.alert out=[core.api.factory] />
          <api:core.analytics out=[core.api.factory] />
          <api:core.error out=[core.api.factory] />
          <api:core.storage out=[core.api.factory] />
          <api:core.fetch out=[core.api.factory] />
          <api:core.oauthrequest out=[core.api.factory] />
          <api:core.auth.google out=[core.api.factory] />
          <api:core.auth.microsoft out=[core.api.factory] />
          <api:core.auth.github out=[core.api.factory] />
          <api:core.auth.okta out=[core.api.factory] />
          <api:core.auth.gitlab out=[core.api.factory] />
          <api:core.auth.onelogin out=[core.api.factory] />
          <api:core.auth.bitbucket out=[core.api.factory] />
          <api:core.auth.bitbucket-server out=[core.api.factory] />
          <api:core.auth.atlassian out=[core.api.factory] />
          <api:core.auth.vmware-cloud out=[core.api.factory] />
          <api:plugin.permission.api out=[core.api.factory] />
        ]
      </app>"
    `);
  });
});
