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
  ApiBlueprint,
  createRouteRef,
  createExternalRouteRef,
  createExtensionInput,
  useRouteRef,
  analyticsApiRef,
} from '@backstage/frontend-plugin-api';
import { screen, render } from '@testing-library/react';
import { createSpecializedApp } from './createSpecializedApp';
import { MockConfigApi } from '@backstage/test-utils';
import React from 'react';
import {
  configApiRef,
  createApiFactory,
  featureFlagsApiRef,
} from '@backstage/core-plugin-api';
import { MemoryRouter } from 'react-router-dom';
import { ApiProvider } from '@backstage/core-app-api';

describe('createSpecializedApp', () => {
  it('should render the root app', () => {
    const app = createSpecializedApp({
      features: [
        createFrontendPlugin({
          id: 'test',
          extensions: [
            createExtension({
              attachTo: { id: 'root', input: 'app' },
              output: [coreExtensionData.reactElement],
              factory: () => [coreExtensionData.reactElement(<div>Test</div>)],
            }),
          ],
        }),
      ],
    });

    render(app.createRoot());

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should deduplicate features keeping the last received one', () => {
    const app = createSpecializedApp({
      features: [
        createFrontendPlugin({
          id: 'test',
          extensions: [
            createExtension({
              attachTo: { id: 'root', input: 'app' },
              output: [coreExtensionData.reactElement],
              factory: () => [
                coreExtensionData.reactElement(<div>Test 1</div>),
              ],
            }),
          ],
        }),
        createFrontendPlugin({
          id: 'test',
          extensions: [
            createExtension({
              attachTo: { id: 'root', input: 'app' },
              output: [coreExtensionData.reactElement],
              factory: () => [
                coreExtensionData.reactElement(<div>Test 2</div>),
              ],
            }),
          ],
        }),
      ],
    });

    render(app.createRoot());

    expect(screen.getByText('Test 2')).toBeInTheDocument();
  });

  it('should forward config', () => {
    const app = createSpecializedApp({
      config: new MockConfigApi({ test: 'foo' }),
      features: [
        createFrontendPlugin({
          id: 'test',
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

    render(app.createRoot());

    expect(screen.getByText('Test foo')).toBeInTheDocument();
  });

  it('should support APIs and feature flags', async () => {
    const flags = new Array<{ name: string; pluginId: string }>();
    const app = createSpecializedApp({
      features: [
        createFrontendPlugin({
          id: 'test',
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
              params: {
                factory: createApiFactory(featureFlagsApiRef, {
                  registerFlag(flag) {
                    flags.push(flag);
                  },
                  getRegisteredFlags() {
                    return flags;
                  },
                } as typeof featureFlagsApiRef.T),
              },
            }),
          ],
        }),
      ],
    });

    render(app.createRoot());

    expect(screen.getByText('flags:test=a,test=b')).toBeInTheDocument();
  });

  it('should intitialize the APIs in the correct order to allow for overrides', () => {
    const mockAnalyticsApi = jest.fn(() => ({ captureEvent: jest.fn() }));

    const app = createSpecializedApp({
      features: [
        createFrontendPlugin({
          id: 'first',
          extensions: [
            ApiBlueprint.make({
              params: {
                factory: createApiFactory({
                  api: analyticsApiRef,
                  deps: {},
                  factory: () => {
                    throw new Error('BROKEN');
                  },
                }),
              },
            }),
          ],
        }),
        createFrontendPlugin({
          id: 'test',
          featureFlags: [{ name: 'a' }, { name: 'b' }],
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
              params: {
                factory: createApiFactory({
                  api: analyticsApiRef,
                  deps: {},
                  factory: mockAnalyticsApi,
                }),
              },
            }),
          ],
        }),
      ],
    });

    render(app.createRoot());

    expect(mockAnalyticsApi).toHaveBeenCalled();
  });

  it('should make the app structure available through the AppTreeApi', async () => {
    let appTreeApi: AppTreeApi | undefined = undefined;

    createSpecializedApp({
      features: [
        createFrontendPlugin({
          id: 'test',
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
  });

  it('should support route bindings', async () => {
    const routeRef = createRouteRef();
    const extRouteRef = createExternalRouteRef();

    const pluginA = createFrontendPlugin({
      id: 'a',
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
                      <React.Fragment key={i.node.spec.id}>
                        {i.get(coreExtensionData.reactElement)}
                      </React.Fragment>
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
      id: 'b',
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
      }).createRoot(),
    );

    expect(screen.getByText('link: /test')).toBeInTheDocument();
  });
});
