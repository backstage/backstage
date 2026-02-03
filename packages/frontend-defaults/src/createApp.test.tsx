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
  PageBlueprint,
  createFrontendPlugin,
  createFrontendFeatureLoader,
  createFrontendModule,
  useAppNode,
  FrontendPluginInfo,
} from '@backstage/frontend-plugin-api';
import { ThemeBlueprint } from '@backstage/plugin-app-react';
import { screen, waitFor } from '@testing-library/react';
import { createApp } from './createApp';
import { mockApis, renderWithEffects } from '@backstage/test-utils';
import { featureFlagsApiRef, useApi } from '@backstage/core-plugin-api';
import { default as appPluginOriginal } from '@backstage/plugin-app';
import { useState, useEffect } from 'react';

describe('createApp', () => {
  const appPlugin = appPluginOriginal.withOverrides({
    extensions: [
      appPluginOriginal
        .getExtension('sign-in-page:app')
        .override({ disabled: true }),
    ],
  });

  it('should allow themes to be installed', async () => {
    const app = createApp({
      advanced: {
        configLoader: async () => ({
          config: mockApis.config({
            data: {
              app: {
                extensions: [
                  { 'theme:app/light': false },
                  { 'theme:app/dark': false },
                ],
              },
            },
          }),
        }),
      },
      features: [
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            ThemeBlueprint.make({
              name: 'derp',
              params: {
                theme: {
                  id: 'derp',
                  title: 'Derp',
                  variant: 'dark',
                  Provider: () => <div>Derp</div>,
                },
              },
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
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        createFrontendPlugin({
          pluginId: duplicatedFeatureId,
          extensions: [
            PageBlueprint.make({
              params: {
                path: '/',
                loader: async () => <div>First Page</div>,
              },
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: duplicatedFeatureId,
          extensions: [
            PageBlueprint.make({
              params: {
                path: '/',
                loader: async () => <div>Last Page</div>,
              },
            }),
          ],
        }),
        appPlugin,
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

  it('should allow overriding the plugin info resolver', async () => {
    function TestComponent() {
      const appNode = useAppNode();
      const [info, setInfo] = useState<FrontendPluginInfo | undefined>(
        undefined,
      );

      useEffect(() => {
        appNode?.spec.plugin?.info().then(setInfo);
      }, [appNode]);

      return <div>Package name: {info?.packageName}</div>;
    }

    const app = createApp({
      features: [
        appPlugin,
        createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            PageBlueprint.make({
              params: {
                path: '/',
                loader: async () => <TestComponent />,
              },
            }),
          ],
        }),
      ],
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
        pluginInfoResolver: async () => {
          return {
            info: {
              packageName: '@test/test',
            },
          };
        },
      },
    });

    await renderWithEffects(app.createRoot());

    await expect(
      screen.findByText('Package name: @test/test'),
    ).resolves.toBeInTheDocument();
  });

  it('should support feature loaders', async () => {
    const loader = createFrontendFeatureLoader({
      async *loader({ config }) {
        yield createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            PageBlueprint.make({
              params: {
                path: '/',
                loader: async () => <div>{config.getString('key')}</div>,
              },
            }),
          ],
        });
      },
    });

    const app = createApp({
      advanced: {
        configLoader: async () => ({
          config: mockApis.config({ data: { key: 'config-value' } }),
        }),
      },
      features: [appPlugin, loader],
    });

    await renderWithEffects(app.createRoot());

    await expect(
      screen.findByText('config-value'),
    ).resolves.toBeInTheDocument();
  });

  it('should propagate errors thrown by feature loaders', async () => {
    const loader = createFrontendFeatureLoader({
      async loader() {
        throw new TypeError('boom');
      },
    });

    const app = createApp({
      advanced: {
        configLoader: async () => ({
          config: mockApis.config(),
        }),
      },
      features: [loader],
    });

    await expect(renderWithEffects(app.createRoot())).rejects.toThrow(
      /Failed to read frontend features from loader created at '.*\/createApp\.test\.tsx:\d+:\d+': TypeError: boom/,
    );
  });

  it('should register feature flags', async () => {
    const app = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPlugin.withOverrides({
          extensions: [
            appPlugin
              .getExtension('app/root')
              .override({ disabled: true, factory: orig => orig() }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'test',
          featureFlags: [{ name: 'test-1' }],
          extensions: [
            createExtension({
              name: 'first',
              attachTo: { id: 'app', input: 'root' },
              output: [coreExtensionData.reactElement],
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
                return [coreExtensionData.reactElement(<Component />)];
              },
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'other',
          featureFlags: [{ name: 'test-2' }],
          extensions: [],
        }),
      ],
    });

    await renderWithEffects(app.createRoot());

    await expect(
      screen.findByText("Flags: test-1 from 'test', test-2 from 'other'"),
    ).resolves.toBeInTheDocument();
  });

  it('should allow unknown extension config if the flag is set', async () => {
    const app = createApp({
      features: [
        appPlugin,
        createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            PageBlueprint.make({
              params: {
                path: '/',
                loader: async () => <div>Derp</div>,
              },
            }),
          ],
        }),
      ],
      advanced: {
        allowUnknownExtensionConfig: true,
        configLoader: async () => ({
          config: mockApis.config({
            data: {
              app: {
                extensions: [{ 'unknown:lols/wut': false }],
              },
            },
          }),
        }),
      },
    });

    await renderWithEffects(app.createRoot());

    await expect(screen.findByText('Derp')).resolves.toBeInTheDocument();
  });
  it('should make the app structure available through the AppTreeApi', async () => {
    let appTreeApi: AppTreeApi | undefined = undefined;

    const app = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPlugin,
        createFrontendPlugin({
          pluginId: 'my-plugin',
          extensions: [
            PageBlueprint.make({
              params: {
                path: '/',
                loader: async () => {
                  const Component = () => {
                    appTreeApi = useApi(appTreeApiRef);
                    return <div>My Plugin Page</div>;
                  };
                  return <Component />;
                },
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
      "<root out=[core.reactElement]>
        apis [
          <api:app/dialog out=[core.api.factory] />
          <api:app/discovery out=[core.api.factory] />
          <api:app/alert out=[core.api.factory] />
          <api:app/analytics out=[core.api.factory] />
          <api:app/error out=[core.api.factory] />
          <api:app/storage out=[core.api.factory] />
          <api:app/fetch out=[core.api.factory] />
          <api:app/oauth-request out=[core.api.factory] />
          <api:app/google-auth out=[core.api.factory] />
          <api:app/microsoft-auth out=[core.api.factory] />
          <api:app/github-auth out=[core.api.factory] />
          <api:app/okta-auth out=[core.api.factory] />
          <api:app/gitlab-auth out=[core.api.factory] />
          <api:app/onelogin-auth out=[core.api.factory] />
          <api:app/bitbucket-auth out=[core.api.factory] />
          <api:app/bitbucket-server-auth out=[core.api.factory] />
          <api:app/atlassian-auth out=[core.api.factory] />
          <api:app/vmware-cloud-auth out=[core.api.factory] />
          <api:app/openshift-auth out=[core.api.factory] />
          <api:app/permission out=[core.api.factory] />
          <api:app/scm-auth out=[core.api.factory] />
          <api:app/scm-integrations out=[core.api.factory] />
          <api:app/app-language out=[core.api.factory] />
          <api:app/app-theme out=[core.api.factory]>
            themes [
              <theme:app/dark out=[core.theme.theme] />
              <theme:app/light out=[core.theme.theme] />
            ]
          </api:app/app-theme>
          <api:app/swappable-components out=[core.api.factory]>
            components [
              <component:app/core-progress out=[core.swappableComponent] />
              <component:app/core-not-found-error-page out=[core.swappableComponent] />
              <component:app/core-error-display out=[core.swappableComponent] />
            ]
          </api:app/swappable-components>
          <api:app/icons out=[core.api.factory] />
          <api:app/feature-flags out=[core.api.factory] />
          <api:app/plugin-wrapper out=[core.api.factory] />
          <api:app/translations out=[core.api.factory] />
          <api:app/components out=[core.api.factory] />
        ]
        app [
          <app out=[core.reactElement]>
            root [
              <app/root out=[core.reactElement]>
                children [
                  <app/layout out=[core.reactElement]>
                    nav [
                      <app/nav out=[core.reactElement] />
                    ]
                    content [
                      <app/routes out=[core.reactElement]>
                        routes [
                          <page:my-plugin out=[core.routing.path, core.reactElement] />
                        ]
                      </app/routes>
                    ]
                  </app/layout>
                ]
                elements [
                  <app-root-element:app/oauth-request-dialog out=[core.reactElement] />
                  <app-root-element:app/alert-display out=[core.reactElement] />
                  <app-root-element:app/dialog-display out=[core.reactElement] />
                ]
                signInPage [
                  <sign-in-page:app />
                ]
              </app/root>
            ]
          </app>
        ]
      </root>"
    `);
  });

  it('should use <Progress /> as the default suspense fallback', async () => {
    const app = createApp({
      advanced: {
        configLoader: () => new Promise(() => {}),
      },
    });

    await renderWithEffects(app.createRoot());

    await expect(screen.findByTestId('progress')).resolves.toBeInTheDocument();
  });

  it('should use no suspense fallback if the loadingElement is null', async () => {
    const app = createApp({
      advanced: {
        configLoader: () => new Promise(() => {}),
        loadingElement: null,
      },
    });

    await renderWithEffects(app.createRoot());

    expect(screen.queryByTestId('progress')).toBeNull();
  });

  it('should use a custom loadingElement', async () => {
    const app = createApp({
      advanced: {
        configLoader: () => new Promise(() => {}),
        loadingElement: <span>Custom loading message</span>,
      },
    });

    await renderWithEffects(app.createRoot());

    expect(screen.queryByText('Custom loading message')).toBeInTheDocument();
  });

  it('should allow overriding the app plugin', async () => {
    const app = createApp({
      advanced: {
        configLoader: () => new Promise(() => {}),
      },
      features: [
        appPlugin.withOverrides({
          extensions: [
            appPlugin.getExtension('app/root').override({
              factory: () => [
                coreExtensionData.reactElement(
                  <div>Custom app root element</div>,
                ),
              ],
            }),
          ],
        }),
      ],
    });

    await renderWithEffects(app.createRoot());

    expect(screen.queryByText('Custom app root element')).toBeNull();
  });

  it('should use a custom extensionFactoryMiddleware', async () => {
    const app = createApp({
      features: [
        appPlugin,
        createFrontendPlugin({
          pluginId: 'test-plugin',
          extensions: [
            PageBlueprint.make({
              name: 'test-page',
              params: {
                path: '/',
                loader: async () => <>Test Page</>,
              },
            }),
          ],
        }),
      ],
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
        *extensionFactoryMiddleware(originalFactory, context) {
          const output = originalFactory();
          yield* output;
          const element = output.get(coreExtensionData.reactElement);

          if (element) {
            yield coreExtensionData.reactElement(
              <div data-testid={`wrapped(${context.node.spec.id})`}>
                {element}
              </div>,
            );
          }
        },
      },
    });

    await renderWithEffects(app.createRoot());

    await expect(
      screen.findByTestId('wrapped(page:test-plugin/test-page)'),
    ).resolves.toHaveTextContent('Test Page');
  });

  describe('modules', () => {
    it('should be able to override extensions with a plugin extension override', async () => {
      const mod = createFrontendModule({
        pluginId: 'app',
        extensions: [
          appPlugin.getExtension('app/root').override({
            factory: () => [
              coreExtensionData.reactElement(
                <div>Custom app root element</div>,
              ),
            ],
          }),
        ],
      });

      const app = createApp({
        advanced: {
          configLoader: () => new Promise(() => {}),
        },
        features: [mod],
      });

      await renderWithEffects(app.createRoot());

      expect(screen.queryByText('Custom app root element')).toBeNull();
    });

    it('should be able to override extensions with a standalone extension override', async () => {
      const mod = createFrontendModule({
        pluginId: 'app',
        extensions: [
          createExtension({
            name: 'root',
            attachTo: { id: 'app', input: 'root' },
            output: [coreExtensionData.reactElement],
            factory: () => [
              coreExtensionData.reactElement(
                <div>Custom app root element</div>,
              ),
            ],
          }),
        ],
      });

      const app = createApp({
        advanced: {
          configLoader: () => new Promise(() => {}),
        },
        features: [mod],
      });

      await renderWithEffects(app.createRoot());

      expect(screen.queryByText('Custom app root element')).toBeNull();
    });
  });
});
