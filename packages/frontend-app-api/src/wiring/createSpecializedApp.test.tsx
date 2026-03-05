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
  analyticsApiRef,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import { screen, render } from '@testing-library/react';
import { createSpecializedApp } from './createSpecializedApp';
import { mockApis, TestApiRegistry } from '@backstage/test-utils';
import { configApiRef, featureFlagsApiRef } from '@backstage/core-plugin-api';
import { MemoryRouter } from 'react-router-dom';
import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import { Fragment } from 'react';

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
describe('createSpecializedApp', () => {
  it('should render the root app', () => {
    const app = createSpecializedApp({
      features: [makeAppPlugin()],
    });

    render(app.tree.root.instance!.getData(coreExtensionData.reactElement));

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should deduplicate features keeping the last received one', () => {
    const app = createSpecializedApp({
      features: [makeAppPlugin('Test 1'), makeAppPlugin('Test 2')],
    });

    render(app.tree.root.instance!.getData(coreExtensionData.reactElement));

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

    render(app.tree.root.instance!.getData(coreExtensionData.reactElement));

    expect(screen.getByText('Test foo')).toBeInTheDocument();
  });

  it('should support APIs and feature flags', async () => {
    const flags = new Array<{ name: string; pluginId: string }>();
    const app = createSpecializedApp({
      features: [
        createFrontendPlugin({
          pluginId: 'test',
          featureFlags: [{ name: 'a' }, { name: 'b' }],
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

    render(app.tree.root.instance!.getData(coreExtensionData.reactElement));

    expect(screen.getByText('flags:test=a,test=b')).toBeInTheDocument();

    expect(app.apis).toMatchInlineSnapshot(`
      ApiResolver {
        "apis": Map {
          "core.featureflags" => {
            "getRegisteredFlags": [Function],
            "registerFlag": [Function],
          },
        },
        "factories": ApiFactoryRegistry {
          "factories": Map {
            "core.featureflags" => {
              "factory": {
                "api": ApiRefImpl {
                  "config": {
                    "id": "core.featureflags",
                  },
                },
                "deps": {},
                "factory": [Function],
              },
              "priority": 10,
            },
            "core.app-tree" => {
              "factory": {
                "api": ApiRefImpl {
                  "config": {
                    "id": "core.app-tree",
                  },
                },
                "deps": {},
                "factory": [Function],
              },
              "priority": 100,
            },
            "core.config" => {
              "factory": {
                "api": ApiRefImpl {
                  "config": {
                    "id": "core.config",
                  },
                },
                "deps": {},
                "factory": [Function],
              },
              "priority": 100,
            },
            "core.route-resolution" => {
              "factory": {
                "api": ApiRefImpl {
                  "config": {
                    "id": "core.route-resolution",
                  },
                },
                "deps": {},
                "factory": [Function],
              },
              "priority": 100,
            },
            "core.identity" => {
              "factory": {
                "api": ApiRefImpl {
                  "config": {
                    "id": "core.identity",
                  },
                },
                "deps": {},
                "factory": [Function],
              },
              "priority": 100,
            },
          },
        },
      }
    `);
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

    render(app.tree.root.instance!.getData(coreExtensionData.reactElement));

    expect(mockAnalyticsApi).toHaveBeenCalled();
  });

  it('should select the API factory from the owning plugin on conflict', () => {
    const testApiRef = createApiRef<{ value: string }>({ id: 'test.api' });

    const app = createSpecializedApp({
      features: [
        makeAppPlugin(),
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

    expect(app.apis.get(testApiRef)).toEqual({ value: 'owner' });
  });

  it('should allow API overrides within the same plugin', () => {
    const testApiRef = createApiRef<{ value: string }>({ id: 'test.api' });

    const app = createSpecializedApp({
      features: [
        makeAppPlugin(),
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
    expect(app.apis.get(testApiRef)).toEqual({ value: 'module' });
  });

  it('should use provided apis', async () => {
    const app = createSpecializedApp({
      advanced: {
        apis: TestApiRegistry.from([
          configApiRef,
          new ConfigReader({ anything: 'config' }),
        ]),
      },
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
                    providedApis:
                    {apis.get(configApiRef)!.getString('anything')}
                  </div>,
                ),
              ],
            }),
          ],
        }),
      ],
    });

    render(app.tree.root.instance!.getData(coreExtensionData.reactElement));

    expect(screen.getByText('providedApis:config')).toBeInTheDocument();

    expect(app.apis).toMatchInlineSnapshot(`
      TestApiRegistry {
        "apis": Map {
          "core.config" => ConfigReader {
            "context": "mock-config",
            "data": {
              "anything": "config",
            },
            "fallback": undefined,
            "filteredKeys": undefined,
            "notifiedFilteredKeys": Set {},
            "prefix": "",
          },
        },
      }
    `);
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
});
