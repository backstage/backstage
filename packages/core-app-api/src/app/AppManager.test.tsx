/*
 * Copyright 2020 The Backstage Authors
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

import { LocalStorageFeatureFlags, NoOpAnalyticsApi } from '../apis';
import {
  MockAnalyticsApi,
  renderWithEffects,
  withLogCollector,
} from '@backstage/test-utils';
import { render, screen } from '@testing-library/react';
import React, { PropsWithChildren, ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  configApiRef,
  createApiFactory,
  featureFlagsApiRef,
  createPlugin,
  useRouteRef,
  createExternalRouteRef,
  createRouteRef,
  createSubRouteRef,
  createRoutableExtension,
  analyticsApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { AppManager } from './AppManager';
import { AppComponents, AppIcons } from './types';
import { FeatureFlagged } from '../routing/FeatureFlagged';

describe('Integration Test', () => {
  const noOpAnalyticsApi = createApiFactory(
    analyticsApiRef,
    new NoOpAnalyticsApi(),
  );
  const plugin1RouteRef = createRouteRef({ id: 'ref-1' });
  const plugin1RouteRef2 = createRouteRef({ id: 'ref-1-2' });
  const plugin2RouteRef = createRouteRef({ id: 'ref-2', params: ['x'] });
  const subRouteRef1 = createSubRouteRef({
    id: 'sub1',
    path: '/sub1',
    parent: plugin1RouteRef,
  });
  const subRouteRef2 = createSubRouteRef({
    id: 'sub2',
    path: '/sub2/:x',
    parent: plugin1RouteRef,
  });
  const subRouteRef3 = createSubRouteRef({
    id: 'sub3',
    path: '/sub3',
    parent: plugin2RouteRef,
  });
  const subRouteRef4 = createSubRouteRef({
    id: 'sub4',
    path: '/sub4/:y',
    parent: plugin2RouteRef,
  });
  const extRouteRef1 = createExternalRouteRef({ id: 'extRouteRef1' });
  const extRouteRef2 = createExternalRouteRef({
    id: 'extRouteRef2',
    params: ['x'],
  });
  const extRouteRef3 = createExternalRouteRef({
    id: 'extRouteRef3',
    optional: true,
  });
  const extRouteRef4 = createExternalRouteRef({
    id: 'extRouteRef4',
    optional: true,
    params: ['x'],
  });

  const plugin1 = createPlugin({
    id: 'blob',
    // Both absolute and sub route refs should be assignable to the plugin routes
    routes: {
      ref1: plugin1RouteRef,
      ref2: plugin2RouteRef,
      ref3: subRouteRef1,
    },
    externalRoutes: {
      extRouteRef1,
      extRouteRef2,
      extRouteRef3,
      extRouteRef4,
    },
  });

  const plugin2 = createPlugin({
    id: 'plugin2',
  });

  const HiddenComponent = plugin2.provide(
    createRoutableExtension({
      name: 'HiddenComponent',
      component: () => Promise.resolve(() => <div />),
      mountPoint: plugin2RouteRef,
    }),
  );

  const ExposedComponent = plugin1.provide(
    createRoutableExtension({
      name: 'ExposedComponent',
      component: () =>
        Promise.resolve(() => {
          const link1 = useRouteRef(plugin1RouteRef);
          const link2 = useRouteRef(plugin2RouteRef);
          const subLink1 = useRouteRef(subRouteRef1);
          const subLink2 = useRouteRef(subRouteRef2);
          const subLink3 = useRouteRef(subRouteRef3);
          const subLink4 = useRouteRef(subRouteRef4);
          const extLink1 = useRouteRef(extRouteRef1);
          const extLink2 = useRouteRef(extRouteRef2);
          const extLink3 = useRouteRef(extRouteRef3);
          const extLink4 = useRouteRef(extRouteRef4);
          return (
            <div>
              <span>link1: {link1()}</span>
              <span>link2: {link2({ x: 'a' })}</span>
              <span>subLink1: {subLink1()}</span>
              <span>subLink2: {subLink2({ x: 'a' })}</span>
              <span>subLink3: {subLink3({ x: 'b' })}</span>
              <span>subLink4: {subLink4({ x: 'c', y: 'd' })}</span>
              <span>extLink1: {extLink1()}</span>
              <span>extLink2: {extLink2({ x: 'a' })}</span>
              <span>extLink3: {extLink3?.() ?? '<none>'}</span>
              <span>extLink4: {extLink4?.({ x: 'b' }) ?? '<none>'}</span>
            </div>
          );
        }),
      mountPoint: plugin1RouteRef,
    }),
  );

  const NavigateComponent = plugin1.provide(
    createRoutableExtension({
      name: 'NavigateComponent',
      component: () =>
        Promise.resolve((_: PropsWithChildren<{ path?: string }>) => {
          return <Navigate to="/foo" />;
        }),
      mountPoint: plugin1RouteRef2,
    }),
  );

  const components: AppComponents = {
    NotFoundErrorPage: () => null,
    BootErrorPage: () => null,
    Progress: () => null,
    Router: BrowserRouter,
    ErrorBoundaryFallback: () => null,
    ThemeProvider: ({ children }) => <>{children}</>,
  };

  const icons = {} as AppIcons;
  const themes = [
    {
      id: 'light',
      title: 'Light Theme',
      variant: 'light' as const,
      Provider: ({ children }: { children: ReactNode }) => <>{children}</>,
    },
  ];

  it('runs happy paths', async () => {
    const app = new AppManager({
      apis: [noOpAnalyticsApi],
      defaultApis: [],
      themes,
      icons,
      plugins: [],
      components,
      configLoader: async () => [],
      bindRoutes: ({ bind }) => {
        bind(plugin1.externalRoutes, {
          extRouteRef1: plugin1RouteRef,
          extRouteRef2: plugin2RouteRef,
          extRouteRef3: subRouteRef1,
          extRouteRef4: plugin2RouteRef,
        });
      },
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();

    await renderWithEffects(
      <Provider>
        <Router>
          <Routes>
            <Route path="/" element={<ExposedComponent />} />
            <Route path="/foo/:x" element={<HiddenComponent />} />
          </Routes>
        </Router>
      </Provider>,
    );

    expect(screen.getByText('link1: /')).toBeInTheDocument();
    expect(screen.getByText('link2: /foo/a')).toBeInTheDocument();
    expect(screen.getByText('subLink1: /sub1')).toBeInTheDocument();
    expect(screen.getByText('subLink2: /sub2/a')).toBeInTheDocument();
    expect(screen.getByText('subLink3: /foo/b/sub3')).toBeInTheDocument();
    expect(screen.getByText('subLink4: /foo/c/sub4/d')).toBeInTheDocument();
    expect(screen.getByText('extLink1: /')).toBeInTheDocument();
    expect(screen.getByText('extLink2: /foo/a')).toBeInTheDocument();
    expect(screen.getByText('extLink3: /sub1')).toBeInTheDocument();
    expect(screen.getByText('extLink4: /foo/b')).toBeInTheDocument();

    // Plugins should be discovered through element tree
    expect(app.getPlugins()).toEqual([plugin1, plugin2]);
  });

  it('runs happy paths without optional routes', async () => {
    const app = new AppManager({
      apis: [noOpAnalyticsApi],
      defaultApis: [],
      themes,
      icons,
      plugins: [],
      components,
      configLoader: async () => [],
      bindRoutes: ({ bind }) => {
        bind(plugin1.externalRoutes, {
          extRouteRef1: plugin1RouteRef,
          extRouteRef2: plugin2RouteRef,
        });
      },
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();

    await renderWithEffects(
      <Provider>
        <Router>
          <Routes>
            <Route path="/" element={<ExposedComponent />} />
            <Route path="/foo" element={<HiddenComponent />} />
          </Routes>
        </Router>
      </Provider>,
    );

    expect(screen.getByText('extLink1: /')).toBeInTheDocument();
    expect(screen.getByText('extLink2: /foo')).toBeInTheDocument();
    expect(screen.getByText('extLink3: <none>')).toBeInTheDocument();
    expect(screen.getByText('extLink4: <none>')).toBeInTheDocument();
  });

  it('should wait for the config to load before calling feature flags', async () => {
    const storageFlags = new LocalStorageFeatureFlags();
    jest.spyOn(storageFlags, 'registerFlag');

    const apis = [
      noOpAnalyticsApi,
      createApiFactory({
        api: featureFlagsApiRef,
        deps: { configApi: configApiRef },
        factory() {
          return storageFlags;
        },
      }),
    ];

    const app = new AppManager({
      apis,
      defaultApis: [],
      themes,
      icons,
      plugins: [
        createPlugin({
          id: 'test',
          featureFlags: [{ name: 'name' }],
        }),
      ],
      components,
      configLoader: async () => [],
      bindRoutes: ({ bind }) => {
        bind(plugin1.externalRoutes, {
          extRouteRef1: plugin1RouteRef,
          extRouteRef2: plugin2RouteRef,
        });
      },
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();

    await renderWithEffects(
      <Provider>
        <Router>
          <Routes>
            <Route path="/" element={<ExposedComponent />} />
            <Route path="/foo" element={<HiddenComponent />} />
          </Routes>
        </Router>
      </Provider>,
    );

    expect(storageFlags.registerFlag).toHaveBeenCalledWith({
      name: 'name',
      pluginId: 'test',
    });
  });

  it('getFeatureFlags should return feature flags', async () => {
    const storageFlags = new LocalStorageFeatureFlags();
    jest.spyOn(storageFlags, 'registerFlag');

    const apis = [
      noOpAnalyticsApi,
      createApiFactory({
        api: featureFlagsApiRef,
        deps: { configApi: configApiRef },
        factory() {
          return storageFlags;
        },
      }),
    ];

    const app = new AppManager({
      apis,
      defaultApis: [],
      themes,
      icons,
      plugins: [
        createPlugin({
          id: 'test',
          featureFlags: [
            {
              name: 'foo',
            },
          ],
        }),
        // We still support consuming the old feature flag API for a little while longer
        {
          getId() {
            return 'old-test';
          },
          getApis() {
            return [];
          },
          output() {
            return [
              {
                type: 'feature-flag',
                name: 'old-feature-flag',
              },
            ];
          },
        } as any,
      ],
      components,
      configLoader: async () => [],
      bindRoutes: ({ bind }) => {
        bind(plugin1.externalRoutes, {
          extRouteRef1: plugin1RouteRef,
          extRouteRef2: plugin2RouteRef,
        });
      },
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();

    await renderWithEffects(
      <Provider>
        <Router>
          <Routes>
            <Route path="/" element={<ExposedComponent />} />
            <Route path="/foo" element={<HiddenComponent />} />
          </Routes>
        </Router>
      </Provider>,
    );

    expect(storageFlags.registerFlag).toHaveBeenCalledWith({
      name: 'foo',
      pluginId: 'test',
    });
    expect(storageFlags.registerFlag).toHaveBeenCalledWith({
      name: 'old-feature-flag',
      pluginId: 'old-test',
    });
  });

  it('feature flags should be available immediately', async () => {
    const app = new AppManager({
      apis: [
        createApiFactory({
          api: featureFlagsApiRef,
          deps: { configApi: configApiRef },
          factory() {
            return new LocalStorageFeatureFlags();
          },
        }),
      ],
      defaultApis: [],
      themes,
      icons,
      plugins: [createPlugin({ id: 'test', featureFlags: [{ name: 'foo' }] })],
      components,
      configLoader: async () => [],
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();

    const FeatureFlags = () => {
      const featureFlags = useApi(featureFlagsApiRef).getRegisteredFlags();
      return <div>Flags: {featureFlags.map(f => f.name).join(',')}</div>;
    };

    await renderWithEffects(
      <Provider>
        <Router>
          <FeatureFlags />
        </Router>
      </Provider>,
    );

    expect(screen.getByText('Flags: foo')).toBeInTheDocument();
  });

  it('should prevent duplicate feature flags from being rendered', async () => {
    const p1 = createPlugin({
      id: 'p1',
      featureFlags: [{ name: 'show-p1-feature' }],
    });
    const p2 = createPlugin({
      id: 'p2',
      featureFlags: [{ name: 'show-p2-feature' }],
    });

    const app = new AppManager({
      apis: [],
      defaultApis: [],
      themes,
      icons,
      plugins: [p1, p2],
      components,
      configLoader: async () => [],
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();

    function FeatureFlags() {
      const featureFlags = useApi(featureFlagsApiRef);
      return (
        <div>{`Flags: ${featureFlags
          .getRegisteredFlags()
          .map(f => f.name)
          .join(',')}`}</div>
      );
    }

    await renderWithEffects(
      <Provider>
        <Router>
          <FeatureFlagged with="show-p1-feature">
            <div>My feature behind a flag</div>
          </FeatureFlagged>
          <FeatureFlagged with="show-p2-feature">
            <div>My feature behind a flag</div>
          </FeatureFlagged>
          <FeatureFlags />
        </Router>
      </Provider>,
    );

    expect(
      screen.getByText('Flags: show-p1-feature,show-p2-feature'),
    ).toBeInTheDocument();
  });

  it('should track route changes via analytics api', async () => {
    const mockAnalyticsApi = new MockAnalyticsApi();
    const apis = [createApiFactory(analyticsApiRef, mockAnalyticsApi)];
    const app = new AppManager({
      apis,
      defaultApis: [],
      themes,
      icons,
      plugins: [],
      components,
      configLoader: async () => [],
      bindRoutes: ({ bind }) => {
        bind(plugin1.externalRoutes, {
          extRouteRef1: plugin1RouteRef,
          extRouteRef2: plugin2RouteRef,
        });
      },
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();

    await renderWithEffects(
      <Provider>
        <Router>
          <Routes>
            <Route path="/" element={<NavigateComponent />} />
            <Route path="/foo" element={<HiddenComponent />} />
          </Routes>
        </Router>
      </Provider>,
    );

    // Capture initial and subsequent navigation events with expected context.
    const capturedEvents = mockAnalyticsApi.getEvents();
    expect(capturedEvents[0]).toMatchObject({
      action: 'navigate',
      subject: '/',
      context: {
        extension: 'App',
        pluginId: 'blob',
        routeRef: 'ref-1-2',
      },
    });
    expect(capturedEvents[1]).toMatchObject({
      action: 'navigate',
      subject: '/foo',
      context: {
        extension: 'App',
        pluginId: 'plugin2',
        routeRef: 'ref-2',
      },
    });
    expect(capturedEvents).toHaveLength(2);
  });

  it('should throw some error when the route has duplicate params', () => {
    const app = new AppManager({
      apis: [],
      defaultApis: [],
      themes,
      icons,
      plugins: [],
      components,
      configLoader: async () => [],
      bindRoutes: ({ bind }) => {
        bind(plugin1.externalRoutes, {
          extRouteRef1: plugin1RouteRef,
          extRouteRef2: plugin2RouteRef,
        });
      },
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();
    const { error: errorLogs } = withLogCollector(() => {
      expect(() =>
        render(
          <Provider>
            <Router>
              <Routes>
                <Route path="/test/:thing" element={<ExposedComponent />}>
                  <Route path="/some/:thing" element={<HiddenComponent />} />
                </Route>
              </Routes>
            </Router>
          </Provider>,
        ),
      ).toThrow(
        'Parameter :thing is duplicated in path test/:thing/some/:thing',
      );
    });
    expect(errorLogs).toEqual([
      expect.stringContaining(
        'The above error occurred in the <Provider> component',
      ),
    ]);
  });

  it('should throw an error when required external plugin routes are not bound', () => {
    const app = new AppManager({
      apis: [],
      defaultApis: [],
      themes,
      icons,
      plugins: [],
      components,
      configLoader: async () => [],
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();
    const { error: errorLogs } = withLogCollector(() => {
      expect(() =>
        render(
          <Provider>
            <Router>
              <Routes>
                <Route path="/test/:thing" element={<ExposedComponent />} />
              </Routes>
            </Router>
          </Provider>,
        ),
      ).toThrow(
        /^External route 'extRouteRef1' of the 'blob' plugin must be bound to a target route/,
      );
    });
    expect(errorLogs).toEqual([
      expect.stringContaining(
        'The above error occurred in the <Provider> component',
      ),
    ]);
  });

  describe('relative url resolvers', () => {
    it.each([
      [
        ['http://localhost', 'http://localhost'],
        {
          backend: {
            baseUrl: 'http://localhost:8008',
          },
          app: {
            baseUrl: 'http://localhost:8008',
          },
        },
      ],
      [
        ['http://localhost/backstage', 'http://localhost/backstage'],
        {
          backend: {
            baseUrl: 'http://test.com/backstage',
          },
          app: {
            baseUrl: 'http://test.com/backstage',
          },
        },
      ],
      [
        [
          'http://localhost/backstage/instance',
          'http://localhost/backstage/instance',
        ],
        {
          backend: {
            baseUrl: 'http://test.com/backstage/instance',
          },
          app: {
            baseUrl: 'http://test.com/backstage/instance',
          },
        },
      ],
      [
        [
          'http://localhost/backstage/instance',
          'http://test.com/backstage/instance',
        ],
        {
          backend: {
            baseUrl: 'http://test.com/backstage/instance',
          },
          app: {
            baseUrl: 'http://test-front.com/backstage/instance',
          },
        },
      ],
    ])(
      'should be %p when %p',
      async ([expectedAppUrl, expectedBackendUrl], data) => {
        const app = new AppManager({
          apis: [],
          defaultApis: [],
          themes: [
            {
              id: 'light',
              title: 'Light Theme',
              variant: 'light',
              Provider: ({ children }) => <>{children}</>,
            },
          ],
          icons,
          plugins: [],
          components,
          configLoader: async () => [
            {
              context: 'test',
              data,
            },
          ],
        });

        const Provider = app.getProvider();
        const ConfigDisplay = ({ configString }: { configString: string }) => {
          const config = useApi(configApiRef);
          return (
            <span>
              {configString}: {config?.getString(configString)}
            </span>
          );
        };

        const dom = await renderWithEffects(
          <Provider>
            <ConfigDisplay configString="app.baseUrl" />
            <ConfigDisplay configString="backend.baseUrl" />
          </Provider>,
        );

        expect(dom.getByText(`app.baseUrl: ${expectedAppUrl}`)).toBeTruthy();

        expect(
          dom.getByText(`backend.baseUrl: ${expectedBackendUrl}`),
        ).toBeTruthy();
      },
    );
  });
});
