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
  createFrontendPlugin,
  createFrontendModule,
  ApiBlueprint,
  createApiRef,
  createRouteRef,
  createExternalRouteRef,
  createExtensionInput,
  useRouteRef,
  useApi,
  analyticsApiRef,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import { act, render, screen } from '@testing-library/react';
import { createSpecializedApp } from './createSpecializedApp';
import {
  FinalizedSpecializedApp,
  prepareSpecializedApp,
  PreparedSpecializedApp,
} from './prepareSpecializedApp';
import { mockApis, TestApiRegistry } from '@backstage/test-utils';
import {
  configApiRef,
  featureFlagsApiRef,
  IdentityApi,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { MemoryRouter } from 'react-router-dom';
import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import { ComponentType, Fragment, useEffect, useState } from 'react';
import appPluginOriginal from '@backstage/plugin-app';

const signInPageComponentDataRef = createExtensionDataRef<
  ComponentType<{ onSignInSuccess(identity: IdentityApi): void }>
>().with({ id: 'core.sign-in-page.component' });

function makeAppPlugin(label: string = 'Test') {
  return createFrontendPlugin({
    pluginId: 'app',
    extensions: [
      createExtension({
        attachTo: { id: 'root', input: 'app' },
        output: [coreExtensionData.reactElement],
        factory: () => [coreExtensionData.reactElement(<div>{label}</div>)],
      }),
    ],
  });
}

function renderPreparedBootstrap(preparedApp: PreparedSpecializedApp) {
  const bootstrapApp = preparedApp.getBootstrapApp();
  const bootstrapElement = bootstrapApp.element;
  if (!bootstrapElement) {
    throw new Error('Expected bootstrap tree to expose a root element');
  }

  render(bootstrapElement);
}

async function waitForFinalizedApp(preparedApp: PreparedSpecializedApp) {
  return new Promise<FinalizedSpecializedApp>(resolve => {
    preparedApp.onFinalized(resolve);
  });
}

describe('createSpecializedApp', () => {
  const appPlugin = appPluginOriginal.withOverrides({
    extensions: [
      appPluginOriginal.getExtension('app/layout').override({
        factory: () => [coreExtensionData.reactElement(<div>App Layout</div>)],
      }),
    ],
  });

  it('should render the root app', () => {
    const app = createSpecializedApp({
      features: [makeAppPlugin()],
    });

    render(app.element);

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should deduplicate features keeping the last received one', () => {
    const app = createSpecializedApp({
      features: [makeAppPlugin('Test 1'), makeAppPlugin('Test 2')],
    });

    render(app.element);

    expect(screen.getByText('Test 2')).toBeInTheDocument();
  });

  it('should forward config', () => {
    const app = createSpecializedApp({
      config: mockApis.config({ data: { test: 'foo' } }),
      features: [
        createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            createExtension({
              attachTo: { id: 'root', input: 'app' },
              output: [coreExtensionData.reactElement],
              factory: ({ apis }) => [
                coreExtensionData.reactElement(
                  <div>Test {apis.get(configApiRef)!.getString('test')}</div>,
                ),
              ],
            }),
          ],
        }),
      ],
    });

    render(app.element);

    expect(screen.getByText('Test foo')).toBeInTheDocument();
  });

  it('should warn and ignore bootstrap-visible if predicates', () => {
    const app = createSpecializedApp({
      features: [
        createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            createExtension({
              name: 'conditional-root',
              attachTo: { id: 'root', input: 'app' },
              if: { featureFlags: { $contains: 'test-flag' } },
              output: [coreExtensionData.reactElement],
              factory: () => [
                coreExtensionData.reactElement(<div>Ignored Predicate</div>),
              ],
            }),
          ],
        }),
      ],
    });

    render(app.element);

    expect(screen.getByText('Ignored Predicate')).toBeInTheDocument();
    expect(app.errors).toEqual([
      expect.objectContaining({
        code: 'EXTENSION_BOOTSTRAP_PREDICATE_IGNORED',
      }),
    ]);
  });

  it('should support APIs and feature flags', async () => {
    const flags = new Array<{ name: string; pluginId: string }>();
    const app = createSpecializedApp({
      features: [
        createFrontendPlugin({
          pluginId: 'test',
          featureFlags: [
            { name: 'a' },
            { name: 'b', description: 'Feature B description' },
          ],
          extensions: [
            createExtension({
              attachTo: { id: 'root', input: 'app' },
              output: [coreExtensionData.reactElement],
              factory: ({ apis }) => [
                coreExtensionData.reactElement(
                  <div>
                    flags:
                    {apis
                      .get(featureFlagsApiRef)!
                      .getRegisteredFlags()
                      .map(f => `${f.pluginId}=${f.name}`)
                      .join(',')}
                  </div>,
                ),
              ],
            }),
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: featureFlagsApiRef,
                  deps: {},
                  factory: () =>
                    ({
                      registerFlag(flag) {
                        flags.push(flag);
                      },
                      getRegisteredFlags() {
                        return flags;
                      },
                    } as typeof featureFlagsApiRef.T),
                }),
            }),
          ],
        }),
      ],
    });

    render(app.element);

    expect(screen.getByText('flags:test=a,test=b')).toBeInTheDocument();

    expect(flags).toEqual([
      { name: 'a', pluginId: 'test' },
      { name: 'b', pluginId: 'test', description: 'Feature B description' },
    ]);
    expect(app.sessionState).toBeDefined();
  });

  it('should initialize the APIs in the correct order to allow for overrides', () => {
    const mockAnalyticsApi = jest.fn(() => ({ captureEvent: jest.fn() }));

    const app = createSpecializedApp({
      features: [
        makeAppPlugin(),
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: analyticsApiRef,
                  deps: {},
                  factory: () => {
                    throw new Error('BROKEN');
                  },
                }),
            }),
          ],
        }),
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            createExtension({
              attachTo: { id: 'root', input: 'app' },
              output: [coreExtensionData.reactElement],
              factory: ({ apis }) => {
                const Component = () => {
                  const analytics = apis.get(analyticsApiRef);
                  return (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                    <div
                      onClick={() =>
                        analytics!.captureEvent({
                          action: 'asd',
                          subject: 'asd',
                          context: { extensionId: 'asd', pluginId: 'asd' },
                        })
                      }
                    >
                      Click me
                    </div>
                  );
                };

                return [coreExtensionData.reactElement(<Component />)];
              },
            }),
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: analyticsApiRef,
                  deps: {},
                  factory: mockAnalyticsApi,
                }),
            }),
          ],
        }),
      ],
    });

    render(app.element);

    expect(mockAnalyticsApi).toHaveBeenCalled();
  });

  it('should select the API factory from the owning plugin on conflict', () => {
    const testApiRef = createApiRef<{ value: string }>({ id: 'test.api' });
    const appRootPlugin = createFrontendPlugin({
      pluginId: 'app',
      extensions: [
        createExtension({
          attachTo: { id: 'root', input: 'app' },
          output: [coreExtensionData.reactElement],
          factory: ({ apis }) => [
            coreExtensionData.reactElement(
              <div>Selected API: {apis.get(testApiRef)!.value}</div>,
            ),
          ],
        }),
      ],
    });

    const app = createSpecializedApp({
      features: [
        appRootPlugin,
        createFrontendPlugin({
          pluginId: 'other-before',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: testApiRef,
                  deps: {},
                  factory: () => ({ value: 'other' }),
                }),
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: testApiRef,
                  deps: {},
                  factory: () => ({ value: 'owner' }),
                }),
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'other-after',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: testApiRef,
                  deps: {},
                  factory: () => ({ value: 'other' }),
                }),
            }),
          ],
        }),
      ],
    });

    expect(app.errors).toEqual([
      expect.objectContaining({
        code: 'API_FACTORY_CONFLICT',
        message: expect.stringContaining("API 'test.api'"),
      }),
      expect.objectContaining({
        code: 'API_FACTORY_CONFLICT',
        message: expect.stringContaining("API 'test.api'"),
      }),
    ]);

    render(app.element);
    expect(screen.getByText('Selected API: owner')).toBeInTheDocument();
  });

  it('should allow API overrides within the same plugin', () => {
    const testApiRef = createApiRef<{ value: string }>({ id: 'test.api' });
    const appRootPlugin = createFrontendPlugin({
      pluginId: 'app',
      extensions: [
        createExtension({
          attachTo: { id: 'root', input: 'app' },
          output: [coreExtensionData.reactElement],
          factory: ({ apis }) => [
            coreExtensionData.reactElement(
              <div>Selected API: {apis.get(testApiRef)!.value}</div>,
            ),
          ],
        }),
      ],
    });

    const app = createSpecializedApp({
      features: [
        appRootPlugin,
        createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: testApiRef,
                  deps: {},
                  factory: () => ({ value: 'plugin' }),
                }),
            }),
          ],
        }),
        createFrontendModule({
          pluginId: 'test',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: testApiRef,
                  deps: {},
                  factory: () => ({ value: 'module' }),
                }),
            }),
          ],
        }),
      ],
    });

    expect(app.errors).toBeUndefined();
    render(app.element);
    expect(screen.getByText('Selected API: module')).toBeInTheDocument();
  });

  it('should reuse provided apis', async () => {
    const testApiRef = createApiRef<{ value: string }>({ id: 'test.api' });
    const app = createSpecializedApp({
      features: [
        createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            createExtension({
              attachTo: { id: 'root', input: 'app' },
              output: [coreExtensionData.reactElement],
              factory: ({ apis }) => [
                coreExtensionData.reactElement(
                  <div>
                    reusedApis:
                    {apis.get(configApiRef)!.getString('anything')}:
                    {apis.get(testApiRef)!.value}
                  </div>,
                ),
              ],
            }),
          ],
        }),
      ],
      advanced: {
        apis: TestApiRegistry.from(
          [configApiRef, new ConfigReader({ anything: 'config' })],
          [testApiRef, { value: 'from-apis' }],
        ),
      },
    });

    render(app.tree.root.instance!.getData(coreExtensionData.reactElement));

    expect(screen.getByText('reusedApis:config:from-apis')).toBeInTheDocument();
  });

  it('should make the app structure available through the AppTreeApi', async () => {
    let appTreeApi: AppTreeApi | undefined = undefined;

    const { tree } = createSpecializedApp({
      features: [
        createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            createExtension({
              attachTo: { id: 'root', input: 'app' },
              output: [coreExtensionData.reactElement],
              factory: ({ apis }) => {
                appTreeApi = apis.get(appTreeApiRef);
                return [coreExtensionData.reactElement(<div />)];
              },
            }),
          ],
        }),
      ],
    });

    expect(String(appTreeApi!.getTree().tree.root)).toMatchInlineSnapshot(`
      "<root out=[core.reactElement]>
        app [
          <test out=[core.reactElement] />
        ]
      </root>"
    `);

    expect(tree).toMatchInlineSnapshot(`
      {
        "nodes": Map {
          "test" => {
            "attachments": undefined,
            "id": "test",
            "output": [
              "core.reactElement",
            ],
          },
          "root" => {
            "attachments": {
              "app": [
                {
                  "attachments": undefined,
                  "id": "test",
                  "output": [
                    "core.reactElement",
                  ],
                },
              ],
            },
            "id": "root",
            "output": [
              "core.reactElement",
            ],
          },
        },
        "orphans": [],
        "root": {
          "attachments": {
            "app": [
              {
                "attachments": undefined,
                "id": "test",
                "output": [
                  "core.reactElement",
                ],
              },
            ],
          },
          "id": "root",
          "output": [
            "core.reactElement",
          ],
        },
      }
    `);
  });

  it('should support route bindings', async () => {
    const routeRef = createRouteRef();
    const extRouteRef = createExternalRouteRef();

    const pluginA = createFrontendPlugin({
      pluginId: 'a',
      externalRoutes: {
        ext: extRouteRef,
      },
      extensions: [
        createExtension({
          name: 'parent',
          attachTo: { id: 'root', input: 'app' },
          inputs: {
            children: createExtensionInput([coreExtensionData.reactElement]),
          },
          output: [coreExtensionData.reactElement],
          factory: ({ apis, inputs }) => {
            return [
              coreExtensionData.reactElement(
                <ApiProvider apis={apis}>
                  <MemoryRouter>
                    {inputs.children.map(i => (
                      <Fragment key={i.node.spec.id}>
                        {i.get(coreExtensionData.reactElement)}
                      </Fragment>
                    ))}
                  </MemoryRouter>
                </ApiProvider>,
              ),
            ];
          },
        }),
        createExtension({
          name: 'child',
          attachTo: { id: 'a/parent', input: 'children' },
          output: [coreExtensionData.reactElement],
          factory: () => {
            const Component = () => {
              const link = useRouteRef(extRouteRef);
              return <div>link: {link?.() ?? 'none'}</div>;
            };
            return [coreExtensionData.reactElement(<Component />)];
          },
        }),
      ],
    });
    const pluginB = createFrontendPlugin({
      pluginId: 'b',
      routes: {
        root: routeRef,
      },
      extensions: [
        createExtension({
          name: 'child',
          attachTo: { id: 'a/parent', input: 'children' },
          output: [
            coreExtensionData.reactElement,
            coreExtensionData.routePath,
            coreExtensionData.routeRef,
          ],
          factory: () => {
            return [
              coreExtensionData.reactElement(<div />),
              coreExtensionData.routePath('/test'),
              coreExtensionData.routeRef(routeRef),
            ];
          },
        }),
      ],
    });

    render(
      createSpecializedApp({
        features: [pluginA, pluginB],
        bindRoutes({ bind }) {
          bind(pluginA.externalRoutes, { ext: pluginB.routes.root });
        },
      }).tree.root.instance!.getData(coreExtensionData.reactElement),
    );

    expect(screen.getByText('link: /test')).toBeInTheDocument();
  });

  it('should support multiple attachment points', async () => {
    let appTreeApi: AppTreeApi | undefined = undefined;

    createSpecializedApp({
      features: [
        createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            createExtension({
              name: 'root',
              attachTo: { id: 'root', input: 'app' },
              inputs: {
                children: createExtensionInput([
                  coreExtensionData.reactElement,
                ]),
              },
              output: [coreExtensionData.reactElement],
              factory: ({ apis }) => {
                appTreeApi = apis.get(appTreeApiRef);
                return [coreExtensionData.reactElement(<div />)];
              },
            }),
            createExtension({
              name: 'a',
              attachTo: { id: 'test/root', input: 'children' },
              inputs: {
                children: createExtensionInput([
                  coreExtensionData.reactElement,
                ]),
              },
              output: [coreExtensionData.reactElement],
              factory: () => [coreExtensionData.reactElement(<div />)],
            }),
            createExtension({
              name: 'b',
              attachTo: { id: 'test/root', input: 'children' },
              inputs: {
                children: createExtensionInput([
                  coreExtensionData.reactElement,
                ]),
              },
              output: [coreExtensionData.reactElement],
              factory: () => [coreExtensionData.reactElement(<div />)],
            }),
            // Test backward compatibility - runtime still supports multiple attachment points
            createExtension({
              name: 'cloned',
              attachTo: [
                { id: 'test/a', input: 'children' },
                { id: 'test/b', input: 'children' },
              ] as any,
              output: [coreExtensionData.reactElement],
              factory: () => [coreExtensionData.reactElement(<div />)],
            }),
          ],
        }),
      ],
    });

    expect(String(appTreeApi!.getTree().tree.root)).toMatchInlineSnapshot(`
      "<root out=[core.reactElement]>
        app [
          <test/root out=[core.reactElement]>
            children [
              <test/a out=[core.reactElement]>
                children [
                  <test/cloned out=[core.reactElement] />
                ]
              </test/a>
              <test/b out=[core.reactElement]>
                children [
                  <test/cloned out=[core.reactElement] />
                ]
              </test/b>
            ]
          </test/root>
        ]
      </root>"
    `);
  });

  it('should apply multiple middlewares in order', () => {
    const textDataRef = createExtensionDataRef<string>().with({ id: 'text' });

    const app = createSpecializedApp({
      features: [
        createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            createExtension({
              attachTo: { id: 'root', input: 'app' },
              inputs: {
                text: createExtensionInput([textDataRef], {
                  singleton: true,
                }),
              },
              output: [coreExtensionData.reactElement],
              factory: ({ inputs }) => [
                coreExtensionData.reactElement(
                  <>{inputs.text.get(textDataRef)}</>,
                ),
              ],
            }),
            createExtension({
              name: 'child',
              attachTo: { id: 'test', input: 'text' },
              config: {
                schema: {
                  text: z => z.string().default('test'),
                },
              },
              output: [textDataRef],
              factory: ({ config }) => [textDataRef(config.text)],
            }),
          ],
        }),
      ],
      advanced: {
        extensionFactoryMiddleware: [
          function* middleware(originalFactory, { config }) {
            const result = originalFactory({
              config: config && { text: `1-${config.text}` },
            });
            yield* result;
            const el = result.get(textDataRef);
            if (el) {
              yield textDataRef(`${el}-1`);
            }
          },
          function* middleware(originalFactory, { config }) {
            const result = originalFactory({
              config: config && { text: `2-${config.text}` },
            });
            yield* result;
            const el = result.get(textDataRef);
            if (el) {
              yield textDataRef(`${el}-2`);
            }
          },
        ],
      },
    });

    const root = app.tree.root.instance!.getData(
      coreExtensionData.reactElement,
    );

    expect(render(root).container.textContent).toBe('1-2-test-1-2');
  });

  describe('plugin info', () => {
    const testExtension = createExtension({
      attachTo: { id: 'root', input: 'app' },
      output: [coreExtensionData.reactElement],
      factory: () => [coreExtensionData.reactElement(<div>Test</div>)],
    });

    it('should throw unless accessed via an app', async () => {
      const plugin = createFrontendPlugin({
        pluginId: 'test',
        extensions: [testExtension],
      });

      const errorMsg =
        "Attempted to load plugin info for plugin 'test', but the plugin instance is not installed in an app";
      await expect(plugin.info()).rejects.toThrow(errorMsg);

      const app = createSpecializedApp({ features: [plugin] });

      await expect(plugin.info()).rejects.toThrow(errorMsg);

      const installedPlugin = app.tree.nodes.get('test')?.spec.plugin;
      expect(installedPlugin).toBeDefined();
      const info = await installedPlugin?.info();
      expect(info).toEqual({});
    });

    it('should forward plugin info', async () => {
      const plugin = createFrontendPlugin({
        pluginId: 'test',
        info: {
          packageJson: () => import('../../package.json'),
        },
        extensions: [testExtension],
      });

      const app = createSpecializedApp({ features: [plugin] });
      const info = await app.tree.nodes.get('test')?.spec.plugin?.info();
      expect(info).toMatchObject({
        packageName: '@backstage/frontend-app-api',
      });
    });

    it('should allow overriding plugin info per plugin', async () => {
      const plugin = createFrontendPlugin({
        pluginId: 'test',
        info: {
          packageJson: () => import('../../package.json'),
        },
        extensions: [testExtension],
      });

      const overriddenPlugin = plugin.withOverrides({
        extensions: [],
        info: {
          packageJson: () => Promise.resolve({ name: 'test-override' }),
        },
      });

      const app = createSpecializedApp({ features: [overriddenPlugin] });
      const info = await app.tree.nodes.get('test')?.spec.plugin?.info();
      expect(info).toMatchObject({
        packageName: 'test-override',
      });
    });

    it('should merge with plugin info from manifest', async () => {
      const plugin = createFrontendPlugin({
        pluginId: 'test',
        info: {
          packageJson: () => import('../../package.json'),
          manifest: async () => ({
            metadata: {
              links: [{ title: 'Example', url: 'https://example.com' }],
            },
            spec: {
              owner: 'cubic-belugas',
            },
          }),
        },
        extensions: [testExtension],
      });

      const app = createSpecializedApp({ features: [plugin] });
      const info = await app.tree.nodes.get('test')?.spec.plugin?.info();
      expect(info).toEqual({
        packageName: '@backstage/frontend-app-api',
        version: expect.any(String),
        links: [{ title: 'Example', url: 'https://example.com' }],
        ownerEntityRefs: ['group:default/cubic-belugas'],
      });
    });

    it('should allow overriding of the plugin info resolver', async () => {
      const plugin = createFrontendPlugin({
        pluginId: 'test',
        info: {
          packageJson: () => import('../../package.json'),
        },
        extensions: [testExtension],
      });

      const app = createSpecializedApp({
        features: [plugin],
        advanced: {
          pluginInfoResolver: async ctx => {
            const { info } = await ctx.defaultResolver({
              packageJson: await ctx.packageJson(),
              manifest: await ctx.manifest(),
            });
            return { info: { packageName: `decorated:${info.packageName}` } };
          },
        },
      });
      const info = await app.tree.nodes.get('test')?.spec.plugin?.info();
      expect(info).toEqual({
        packageName: 'decorated:@backstage/frontend-app-api',
      });
    });
  });

  describe('prepareSpecializedApp', () => {
    it('should accept session state through advanced options', () => {
      const originalApp = createSpecializedApp({
        features: [makeAppPlugin('Original')],
      });
      const preparedApp = prepareSpecializedApp({
        features: [makeAppPlugin('Prepared')],
        advanced: {
          sessionState: originalApp.sessionState,
        },
      });

      const app = preparedApp.finalize();

      render(app.tree.root.instance!.getData(coreExtensionData.reactElement));

      expect(screen.getByText('Prepared')).toBeInTheDocument();
    });

    it('should reject finalize after selecting onFinalized', () => {
      const preparedApp = prepareSpecializedApp({
        features: [makeAppPlugin()],
      });

      const unsubscribe = preparedApp.onFinalized(() => {});

      expect(() => preparedApp.finalize()).toThrow(
        'prepareSpecializedApp only supports using either onFinalized() or finalize(), not both',
      );

      unsubscribe();
    });

    it('should reject onFinalized after selecting finalize', () => {
      const preparedApp = prepareSpecializedApp({
        features: [makeAppPlugin()],
      });

      preparedApp.finalize();

      expect(() => preparedApp.onFinalized(() => {})).toThrow(
        'prepareSpecializedApp only supports using either onFinalized() or finalize(), not both',
      );
    });

    it('should synchronously finalize feature flag predicates without sign-in', async () => {
      const featureFlagsApi = {
        isActive: jest.fn((name: string) => name === 'test-flag'),
        registerFlag: jest.fn(),
        getRegisteredFlags: () => [],
        save: jest.fn(),
      } as unknown as typeof featureFlagsApiRef.T;
      const noSignInAppPlugin = appPluginOriginal.withOverrides({
        extensions: [
          appPluginOriginal
            .getExtension('sign-in-page:app')
            .override({ disabled: true }),
        ],
      });
      const preparedApp = prepareSpecializedApp({
        features: [
          noSignInAppPlugin,
          createFrontendPlugin({
            pluginId: 'test',
            featureFlags: [{ name: 'test-flag' }],
            extensions: [
              createExtension({
                name: 'bootstrap-element',
                attachTo: { id: 'app/root', input: 'elements' },
                output: [coreExtensionData.reactElement],
                factory: () => [
                  coreExtensionData.reactElement(<div>Bootstrap Element</div>),
                ],
              }),
              createExtension({
                name: 'deferred-element',
                attachTo: { id: 'app/root', input: 'elements' },
                if: { featureFlags: { $contains: 'test-flag' } },
                output: [coreExtensionData.reactElement],
                factory: () => [
                  coreExtensionData.reactElement(<div>Deferred Element</div>),
                ],
              }),
            ],
          }),
          createFrontendModule({
            pluginId: 'app',
            extensions: [
              ApiBlueprint.make({
                params: defineParams =>
                  defineParams({
                    api: featureFlagsApiRef,
                    deps: {},
                    factory: () => featureFlagsApi,
                  }),
              }),
            ],
          }),
        ],
      });

      renderPreparedBootstrap(preparedApp);

      expect(screen.getByText('Bootstrap Element')).toBeInTheDocument();
      expect(screen.queryByText('Deferred Element')).not.toBeInTheDocument();

      const finalizedApp = preparedApp.finalize();
      render(
        finalizedApp.tree.root.instance!.getData(
          coreExtensionData.reactElement,
        ),
      );

      expect(featureFlagsApi.isActive).toHaveBeenCalledWith('test-flag');
      await expect(
        screen.findByText('Deferred Element'),
      ).resolves.toBeInTheDocument();
    });

    it('should defer conditional api roots without resetting visible api instances', () => {
      const featureFlagsApi = {
        isActive: jest.fn((name: string) => name === 'test-flag'),
        registerFlag: jest.fn(),
        getRegisteredFlags: () => [],
        save: jest.fn(),
      } as unknown as typeof featureFlagsApiRef.T;
      const visibleApiExtension = ApiBlueprint.make({
        name: 'visible-api',
        params: defineParams =>
          defineParams({
            api: createApiRef<{ value: string }>({ id: 'test.visible-api' }),
            deps: {},
            factory: () => ({ value: 'visible' }),
          }),
      });
      const deferredApiExtension = ApiBlueprint.make({
        name: 'deferred-api',
        params: defineParams =>
          defineParams({
            api: createApiRef<{ value: string }>({ id: 'test.deferred-api' }),
            deps: {},
            factory: () => ({ value: 'deferred' }),
          }),
      }).override({
        if: { featureFlags: { $contains: 'test-flag' } },
      });
      const preparedApp = prepareSpecializedApp({
        features: [
          makeAppPlugin(),
          createFrontendPlugin({
            pluginId: 'test',
            featureFlags: [{ name: 'test-flag' }],
            extensions: [
              visibleApiExtension,
              deferredApiExtension,
              ApiBlueprint.make({
                name: 'feature-flags',
                params: defineParams =>
                  defineParams({
                    api: featureFlagsApiRef,
                    deps: {},
                    factory: () => featureFlagsApi,
                  }),
              }),
            ],
          }),
        ],
      });

      const bootstrapTree = preparedApp.getBootstrapApp().tree;
      const apiNodes = bootstrapTree.root.edges.attachments.get('apis') ?? [];
      const visibleApiNode = apiNodes.find(
        node => node.spec.id === 'api:test/visible-api',
      );
      const deferredApiNode = apiNodes.find(
        node => node.spec.id === 'api:test/deferred-api',
      );

      expect(visibleApiNode?.instance).toBeDefined();
      expect(deferredApiNode?.instance).toBeUndefined();

      const visibleApiInstance = visibleApiNode?.instance;
      preparedApp.finalize();

      expect(visibleApiNode?.instance).toBe(visibleApiInstance);
      expect(deferredApiNode?.instance).toBeDefined();
    });

    it('should ignore deferred overrides of materialized bootstrap APIs', () => {
      const apiRef = createApiRef<{ value: string }>({
        id: 'test.bootstrap-frozen-api',
      });
      let bootstrapApiValue: string | undefined;
      let finalApiValue: string | undefined;
      const featureFlagsApi = {
        isActive: jest.fn((name: string) => name === 'test-flag'),
        registerFlag: jest.fn(),
        getRegisteredFlags: () => [],
        save: jest.fn(),
      } as unknown as typeof featureFlagsApiRef.T;
      const noSignInAppPlugin = appPluginOriginal.withOverrides({
        extensions: [
          appPluginOriginal
            .getExtension('sign-in-page:app')
            .override({ disabled: true }),
        ],
      });
      const preparedApp = prepareSpecializedApp({
        features: [
          noSignInAppPlugin,
          createFrontendPlugin({
            pluginId: 'test',
            featureFlags: [{ name: 'test-flag' }],
            extensions: [
              ApiBlueprint.make({
                name: 'bootstrap-api',
                params: defineParams =>
                  defineParams({
                    api: apiRef,
                    deps: {},
                    factory: () => ({ value: 'bootstrap' }),
                  }),
              }),
              ApiBlueprint.make({
                name: 'deferred-api',
                params: defineParams =>
                  defineParams({
                    api: apiRef,
                    deps: {},
                    factory: () => ({ value: 'final' }),
                  }),
              }).override({
                if: { featureFlags: { $contains: 'test-flag' } },
              }),
              createExtension({
                name: 'bootstrap-reader',
                attachTo: { id: 'app/root', input: 'elements' },
                output: [coreExtensionData.reactElement],
                factory: ({ apis }) => {
                  bootstrapApiValue = apis.get(apiRef)?.value;
                  return [
                    coreExtensionData.reactElement(<div>Bootstrap Reader</div>),
                  ];
                },
              }),
              createExtension({
                name: 'final-reader',
                attachTo: { id: 'app/root', input: 'elements' },
                if: { featureFlags: { $contains: 'test-flag' } },
                output: [coreExtensionData.reactElement],
                factory: ({ apis }) => {
                  finalApiValue = apis.get(apiRef)?.value;
                  return [
                    coreExtensionData.reactElement(<div>Final Reader</div>),
                  ];
                },
              }),
            ],
          }),
          createFrontendModule({
            pluginId: 'app',
            extensions: [
              ApiBlueprint.make({
                params: defineParams =>
                  defineParams({
                    api: featureFlagsApiRef,
                    deps: {},
                    factory: () => featureFlagsApi,
                  }),
              }),
            ],
          }),
        ],
      });

      renderPreparedBootstrap(preparedApp);
      expect(bootstrapApiValue).toBe('bootstrap');

      const finalizedApp = preparedApp.finalize();

      expect(featureFlagsApi.isActive).toHaveBeenCalledWith('test-flag');
      expect(finalApiValue).toBe('bootstrap');
      expect(finalizedApp.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: 'EXTENSION_BOOTSTRAP_API_OVERRIDE_IGNORED',
            context: expect.objectContaining({
              apiRefId: apiRef.id,
            }),
          }),
        ]),
      );
    });

    it('should allow deferred overrides of bootstrap APIs that were not materialized', () => {
      const apiRef = createApiRef<{ value: string }>({
        id: 'test.bootstrap-overridable-api',
      });
      let finalApiValue: string | undefined;
      const featureFlagsApi = {
        isActive: jest.fn((name: string) => name === 'test-flag'),
        registerFlag: jest.fn(),
        getRegisteredFlags: () => [],
        save: jest.fn(),
      } as unknown as typeof featureFlagsApiRef.T;
      const noSignInAppPlugin = appPluginOriginal.withOverrides({
        extensions: [
          appPluginOriginal
            .getExtension('sign-in-page:app')
            .override({ disabled: true }),
        ],
      });
      const preparedApp = prepareSpecializedApp({
        features: [
          noSignInAppPlugin,
          createFrontendPlugin({
            pluginId: 'test',
            featureFlags: [{ name: 'test-flag' }],
            extensions: [
              ApiBlueprint.make({
                name: 'bootstrap-api',
                params: defineParams =>
                  defineParams({
                    api: apiRef,
                    deps: {},
                    factory: () => ({ value: 'bootstrap' }),
                  }),
              }),
              ApiBlueprint.make({
                name: 'deferred-api',
                params: defineParams =>
                  defineParams({
                    api: apiRef,
                    deps: {},
                    factory: () => ({ value: 'final' }),
                  }),
              }).override({
                if: { featureFlags: { $contains: 'test-flag' } },
              }),
              createExtension({
                name: 'bootstrap-element',
                attachTo: { id: 'app/root', input: 'elements' },
                output: [coreExtensionData.reactElement],
                factory: () => [
                  coreExtensionData.reactElement(<div>Bootstrap Element</div>),
                ],
              }),
              createExtension({
                name: 'final-reader',
                attachTo: { id: 'app/root', input: 'elements' },
                if: { featureFlags: { $contains: 'test-flag' } },
                output: [coreExtensionData.reactElement],
                factory: ({ apis }) => {
                  finalApiValue = apis.get(apiRef)?.value;
                  return [
                    coreExtensionData.reactElement(<div>Final Reader</div>),
                  ];
                },
              }),
            ],
          }),
          createFrontendModule({
            pluginId: 'app',
            extensions: [
              ApiBlueprint.make({
                params: defineParams =>
                  defineParams({
                    api: featureFlagsApiRef,
                    deps: {},
                    factory: () => featureFlagsApi,
                  }),
              }),
            ],
          }),
        ],
      });

      renderPreparedBootstrap(preparedApp);
      expect(screen.getByText('Bootstrap Element')).toBeInTheDocument();

      const finalizedApp = preparedApp.finalize();

      expect(featureFlagsApi.isActive).toHaveBeenCalledWith('test-flag');
      expect(finalApiValue).toBe('final');
      expect(finalizedApp.errors ?? []).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: 'EXTENSION_BOOTSTRAP_API_OVERRIDE_IGNORED',
            context: expect.objectContaining({
              apiRefId: apiRef.id,
            }),
          }),
        ]),
      );
    });

    it('should defer app root children until finalize', async () => {
      const identityApi = {
        getProfileInfo: async () => ({ displayName: 'Test User' }),
        getBackstageIdentity: async () => ({
          type: 'user' as const,
          userEntityRef: 'user:default/test-user',
          ownershipEntityRefs: ['user:default/test-user'],
        }),
        getCredentials: async () => ({ token: 'token' }),
        signOut: async () => {},
      };
      const appLayoutFactory = jest.fn(() => [
        coreExtensionData.reactElement(<div>App Layout</div>),
      ]);
      const phasedAppPlugin = appPluginOriginal.withOverrides({
        extensions: [
          appPluginOriginal.getExtension('app/layout').override({
            factory: appLayoutFactory,
          }),
        ],
      });
      let onSignInSuccess: ((identity: IdentityApi) => void) | undefined;

      const preparedApp = prepareSpecializedApp({
        features: [
          phasedAppPlugin,
          createFrontendModule({
            pluginId: 'app',
            extensions: [
              phasedAppPlugin.getExtension('sign-in-page:app').override({
                factory: () => {
                  function SignInPage(props: {
                    onSignInSuccess(identity: IdentityApi): void;
                  }) {
                    onSignInSuccess = props.onSignInSuccess;
                    return <div>Custom Sign In</div>;
                  }

                  return [signInPageComponentDataRef(SignInPage)];
                },
              }),
            ],
          }),
        ],
      });

      renderPreparedBootstrap(preparedApp);
      await expect(
        screen.findByText('Custom Sign In'),
      ).resolves.toBeInTheDocument();

      const finalizedAppPromise = waitForFinalizedApp(preparedApp);
      if (!onSignInSuccess) {
        throw new Error('Expected sign-in success callback to be captured');
      }
      const triggerSignInSuccess = onSignInSuccess;
      act(() => {
        triggerSignInSuccess(identityApi);
      });

      const finalizedApp = await finalizedAppPromise;
      expect(appLayoutFactory).toHaveBeenCalledTimes(1);
      render(
        finalizedApp.tree.root.instance!.getData(
          coreExtensionData.reactElement,
        ),
      );

      expect(screen.getByText('App Layout')).toBeInTheDocument();
      expect(appLayoutFactory).toHaveBeenCalledTimes(1);
    });

    it('should expose a sign-in page element and finalize with the captured identity', async () => {
      const identityApi = {
        getProfileInfo: async () => ({ displayName: 'Test User' }),
        getBackstageIdentity: async () => ({
          type: 'user' as const,
          userEntityRef: 'user:default/test-user',
          ownershipEntityRefs: ['user:default/test-user'],
        }),
        getCredentials: async () => ({ token: 'token' }),
        signOut: async () => {},
      };
      const identityAppPlugin = appPluginOriginal.withOverrides({
        extensions: [
          appPluginOriginal.getExtension('app/layout').override({
            factory: () => {
              function IdentityReader() {
                const [identity, setIdentity] = useState<string>();
                const appIdentityApi = useApi(identityApiRef);

                useEffect(() => {
                  void appIdentityApi.getBackstageIdentity().then(result => {
                    setIdentity(result.userEntityRef);
                  });
                }, [appIdentityApi]);

                return <div>Identity: {identity}</div>;
              }

              return [coreExtensionData.reactElement(<IdentityReader />)];
            },
          }),
        ],
      });
      let onSignInSuccess: ((identity: IdentityApi) => void) | undefined;

      const preparedApp = prepareSpecializedApp({
        features: [
          identityAppPlugin,
          createFrontendModule({
            pluginId: 'app',
            extensions: [
              identityAppPlugin.getExtension('sign-in-page:app').override({
                factory: () => {
                  function SignInPage(props: {
                    onSignInSuccess(identity: IdentityApi): void;
                  }) {
                    onSignInSuccess = props.onSignInSuccess;
                    return <div>Custom Sign In</div>;
                  }

                  return [signInPageComponentDataRef(SignInPage)];
                },
              }),
            ],
          }),
        ],
      });

      renderPreparedBootstrap(preparedApp);
      await expect(
        screen.findByText('Custom Sign In'),
      ).resolves.toBeInTheDocument();

      const finalizedAppPromise = waitForFinalizedApp(preparedApp);
      if (!onSignInSuccess) {
        throw new Error('Expected sign-in success callback to be captured');
      }
      const triggerSignInSuccess = onSignInSuccess;
      act(() => {
        triggerSignInSuccess(identityApi);
      });

      const finalizedApp = await finalizedAppPromise;
      render(
        finalizedApp.tree.root.instance!.getData(
          coreExtensionData.reactElement,
        ),
      );
      await expect(
        screen.findByText('Identity: user:default/test-user'),
      ).resolves.toBeInTheDocument();
    });

    it('should reuse predicate context gathered during sign-in completion', async () => {
      const identityApi = {
        getProfileInfo: async () => ({ displayName: 'Test User' }),
        getBackstageIdentity: async () => ({
          type: 'user' as const,
          userEntityRef: 'user:default/test-user',
          ownershipEntityRefs: ['user:default/test-user'],
        }),
        getCredentials: async () => ({ token: 'token' }),
        signOut: async () => {},
      };
      const featureFlagsApi = {
        isActive: jest.fn((name: string) => name === 'test-flag'),
        registerFlag: jest.fn(),
        getRegisteredFlags: () => [],
        save: jest.fn(),
      } as unknown as typeof featureFlagsApiRef.T;
      const gatedAppPlugin = appPluginOriginal.withOverrides({
        extensions: [
          appPluginOriginal.getExtension('app/layout').override({
            if: { featureFlags: { $contains: 'test-flag' } },
            factory: () => [
              coreExtensionData.reactElement(<div>Flagged Layout</div>),
            ],
          }),
        ],
      });
      let onSignInSuccess: ((identity: IdentityApi) => void) | undefined;

      const preparedApp = prepareSpecializedApp({
        features: [
          gatedAppPlugin,
          createFrontendModule({
            pluginId: 'app',
            extensions: [
              ApiBlueprint.make({
                params: defineParams =>
                  defineParams({
                    api: featureFlagsApiRef,
                    deps: {},
                    factory: () => featureFlagsApi,
                  }),
              }),
              gatedAppPlugin.getExtension('sign-in-page:app').override({
                factory: () => {
                  function SignInPage(props: {
                    onSignInSuccess(identity: IdentityApi): void;
                  }) {
                    onSignInSuccess = props.onSignInSuccess;
                    return <div>Custom Sign In</div>;
                  }

                  return [signInPageComponentDataRef(SignInPage)];
                },
              }),
            ],
          }),
        ],
      });

      renderPreparedBootstrap(preparedApp);
      await expect(
        screen.findByText('Custom Sign In'),
      ).resolves.toBeInTheDocument();

      const finalizedAppPromise = waitForFinalizedApp(preparedApp);
      if (!onSignInSuccess) {
        throw new Error('Expected sign-in success callback to be captured');
      }
      const triggerSignInSuccess = onSignInSuccess;
      act(() => {
        triggerSignInSuccess(identityApi);
      });

      const finalizedApp = await finalizedAppPromise;
      expect(featureFlagsApi.isActive).toHaveBeenCalledWith('test-flag');
      expect(featureFlagsApi.isActive).toHaveBeenCalledTimes(1);
      render(
        finalizedApp.tree.root.instance!.getData(
          coreExtensionData.reactElement,
        ),
      );

      expect(screen.getByText('Flagged Layout')).toBeInTheDocument();
    });

    it('should defer conditional app root elements until finalize', async () => {
      const identityApi = {
        getProfileInfo: async () => ({ displayName: 'Test User' }),
        getBackstageIdentity: async () => ({
          type: 'user' as const,
          userEntityRef: 'user:default/test-user',
          ownershipEntityRefs: ['user:default/test-user'],
        }),
        getCredentials: async () => ({ token: 'token' }),
        signOut: async () => {},
      };
      const featureFlagsApi = {
        isActive: jest.fn((name: string) => name === 'test-flag'),
        registerFlag: jest.fn(),
        getRegisteredFlags: () => [],
        save: jest.fn(),
      } as unknown as typeof featureFlagsApiRef.T;

      const preparedApp = prepareSpecializedApp({
        features: [
          appPluginOriginal,
          createFrontendPlugin({
            pluginId: 'test',
            featureFlags: [{ name: 'test-flag' }],
            extensions: [
              createExtension({
                name: 'bootstrap-element',
                attachTo: { id: 'app/root', input: 'elements' },
                output: [coreExtensionData.reactElement],
                factory: () => [
                  coreExtensionData.reactElement(<div>Bootstrap Element</div>),
                ],
              }),
              createExtension({
                name: 'deferred-element',
                attachTo: { id: 'app/root', input: 'elements' },
                if: { featureFlags: { $contains: 'test-flag' } },
                output: [coreExtensionData.reactElement],
                factory: () => [
                  coreExtensionData.reactElement(<div>Deferred Element</div>),
                ],
              }),
            ],
          }),
          createFrontendModule({
            pluginId: 'app',
            extensions: [
              ApiBlueprint.make({
                params: defineParams =>
                  defineParams({
                    api: featureFlagsApiRef,
                    deps: {},
                    factory: () => featureFlagsApi,
                  }),
              }),
              appPluginOriginal.getExtension('sign-in-page:app').override({
                factory: () => {
                  function SignInPage(props: {
                    onSignInSuccess(identity: IdentityApi): void;
                  }) {
                    useEffect(() => {
                      props.onSignInSuccess(identityApi);
                    }, [props]);
                    return <div>Custom Sign In</div>;
                  }

                  return [signInPageComponentDataRef(SignInPage)];
                },
              }),
            ],
          }),
        ],
      });

      renderPreparedBootstrap(preparedApp);
      await expect(
        screen.findByText('Bootstrap Element'),
      ).resolves.toBeInTheDocument();
      expect(screen.queryByText('Deferred Element')).not.toBeInTheDocument();

      const finalizedApp = await waitForFinalizedApp(preparedApp);
      render(
        finalizedApp.tree.root.instance!.getData(
          coreExtensionData.reactElement,
        ),
      );

      await expect(
        screen.findByText('Deferred Element'),
      ).resolves.toBeInTheDocument();
    });

    it('should warn when bootstrap extensions access APIs that appear during finalization', async () => {
      const identityApi = {
        getProfileInfo: async () => ({ displayName: 'Test User' }),
        getBackstageIdentity: async () => ({
          type: 'user' as const,
          userEntityRef: 'user:default/test-user',
          ownershipEntityRefs: ['user:default/test-user'],
        }),
        getCredentials: async () => ({ token: 'token' }),
        signOut: async () => {},
      };
      const delayedApiRef = createApiRef<{ value: string }>({
        id: 'test.delayed-api',
      });
      const featureFlagsApi = {
        isActive: jest.fn((name: string) => name === 'test-flag'),
        registerFlag: jest.fn(),
        getRegisteredFlags: () => [],
        save: jest.fn(),
      } as unknown as typeof featureFlagsApiRef.T;

      const preparedApp = prepareSpecializedApp({
        features: [
          appPluginOriginal,
          createFrontendPlugin({
            pluginId: 'test',
            featureFlags: [{ name: 'test-flag' }],
            extensions: [
              createExtension({
                name: 'bootstrap-api-reader',
                attachTo: { id: 'app/root', input: 'elements' },
                output: [coreExtensionData.reactElement],
                factory: ({ apis }) => {
                  const delayedApi = apis.get(delayedApiRef);
                  return [
                    coreExtensionData.reactElement(
                      <div>
                        Bootstrap API:{' '}
                        {delayedApi ? delayedApi.value : 'missing'}
                      </div>,
                    ),
                  ];
                },
              }),
              ApiBlueprint.make({
                name: 'delayed-api',
                params: defineParams =>
                  defineParams({
                    api: delayedApiRef,
                    deps: {},
                    factory: () => ({ value: 'ready' }),
                  }),
              }).override({
                if: { featureFlags: { $contains: 'test-flag' } },
              }),
            ],
          }),
          createFrontendModule({
            pluginId: 'app',
            extensions: [
              ApiBlueprint.make({
                params: defineParams =>
                  defineParams({
                    api: featureFlagsApiRef,
                    deps: {},
                    factory: () => featureFlagsApi,
                  }),
              }),
              appPluginOriginal.getExtension('sign-in-page:app').override({
                factory: () => {
                  function SignInPage(props: {
                    onSignInSuccess(identity: IdentityApi): void;
                  }) {
                    useEffect(() => {
                      props.onSignInSuccess(identityApi);
                    }, [props]);
                    return <div>Custom Sign In</div>;
                  }

                  return [signInPageComponentDataRef(SignInPage)];
                },
              }),
            ],
          }),
        ],
      });

      renderPreparedBootstrap(preparedApp);
      await expect(
        screen.findByText('Bootstrap API: missing'),
      ).resolves.toBeInTheDocument();

      const finalizedApp = await waitForFinalizedApp(preparedApp);

      expect(finalizedApp.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: 'EXTENSION_BOOTSTRAP_API_UNAVAILABLE',
            context: expect.objectContaining({
              apiRefId: delayedApiRef.id,
            }),
          }),
        ]),
      );
    });

    it('should gate finalize behind internal async sign-in finalization', async () => {
      const identityApi = {
        getProfileInfo: async () => ({ displayName: 'Test User' }),
        getBackstageIdentity: async () => ({
          type: 'user' as const,
          userEntityRef: 'user:default/test-user',
          ownershipEntityRefs: ['user:default/test-user'],
        }),
        getCredentials: async () => ({ token: 'token' }),
        signOut: async () => {},
      };
      let onSignInSuccess: ((identity: IdentityApi) => void) | undefined;

      const preparedApp = prepareSpecializedApp({
        features: [
          appPlugin,
          createFrontendModule({
            pluginId: 'app',
            extensions: [
              appPlugin.getExtension('sign-in-page:app').override({
                factory: () => {
                  function SignInPage(props: {
                    onSignInSuccess(identity: IdentityApi): void;
                  }) {
                    onSignInSuccess = props.onSignInSuccess;
                    return <div>Custom Sign In</div>;
                  }

                  return [signInPageComponentDataRef(SignInPage)];
                },
              }),
            ],
          }),
        ],
      });

      renderPreparedBootstrap(preparedApp);
      await expect(
        screen.findByText('Custom Sign In'),
      ).resolves.toBeInTheDocument();

      expect(() => preparedApp.finalize()).toThrow(
        'prepareSpecializedApp requires waiting for the bootstrap app to be ready before calling finalize()',
      );

      if (!onSignInSuccess) {
        throw new Error('Expected sign-in success callback to be captured');
      }
      const triggerSignInSuccess = onSignInSuccess;
      act(() => {
        triggerSignInSuccess(identityApi);
      });
      expect(() => preparedApp.finalize()).toThrow(
        'prepareSpecializedApp requires waiting for the bootstrap app to be ready before calling finalize()',
      );
    });
  });
});
