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

import { LocalStorageFeatureFlags } from '../apis';
import {
  mockApis,
  renderWithEffects,
  withLogCollector,
  registerMswTestHooks,
} from '@backstage/test-utils';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
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
  errorApiRef,
  fetchApiRef,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { AppRouter } from './AppRouter';
import { AppManager } from './AppManager';
import { AppComponents, AppIcons } from './types';
import { FeatureFlagged } from '../routing/FeatureFlagged';
import {
  createTranslationRef,
  useTranslationRef,
} from '@backstage/core-plugin-api/alpha';

describe('Integration Test', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  const noOpAnalyticsApi = createApiFactory(
    analyticsApiRef,
    mockApis.analytics(),
  );
  const noopErrorApi = createApiFactory(errorApiRef, {
    error$() {
      return {
        subscribe() {
          return { unsubscribe() {}, closed: true };
        },
        [Symbol.observable]() {
          return this;
        },
      };
    },
    post() {},
  });
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

  afterEach(() => {
    localStorage.clear();
  });

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

  it('runs success with __experimentalTranslations', async () => {
    const app = new AppManager({
      apis: [noOpAnalyticsApi, noopErrorApi],
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
      __experimentalTranslations: {
        availableLanguages: ['en', 'de'],
        defaultLanguage: 'de',
      },
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();

    const translationRef = createTranslationRef({
      id: 'test',
      messages: {
        foo: 'Foo',
      },
      translations: {
        de: () => Promise.resolve({ default: { foo: 'Bar' } }),
      },
    });

    const TranslatedComponent = () => {
      const { t } = useTranslationRef(translationRef);
      return <div>translation: {t('foo')}</div>;
    };

    await renderWithEffects(
      <Provider>
        <Router>
          <Routes>
            <Route path="/" element={<TranslatedComponent />} />
          </Routes>
        </Router>
      </Provider>,
    );

    await expect(
      screen.findByText('translation: Bar'),
    ).resolves.toBeInTheDocument();
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
            {
              name: 'bar',
              description: 'test',
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
      name: 'bar',
      pluginId: 'test',
      description: 'test',
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
    const mockAnalyticsApi = mockApis.analytics();
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
    expect(mockAnalyticsApi.captureEvent).toHaveBeenCalledTimes(2);
    expect(mockAnalyticsApi.captureEvent).toHaveBeenNthCalledWith(1, {
      action: 'navigate',
      subject: '/',
      attributes: {},
      context: {
        extension: 'App',
        pluginId: 'blob',
        routeRef: 'ref-1-2',
      },
    });
    expect(mockAnalyticsApi.captureEvent).toHaveBeenNthCalledWith(2, {
      action: 'navigate',
      subject: '/foo',
      attributes: {},
      context: {
        extension: 'App',
        pluginId: 'plugin2',
        routeRef: 'ref-2',
      },
    });
  });

  it('should throw some error when the route has duplicate params', async () => {
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

    const expectedMessage =
      'Parameter :thing is duplicated in path test/:thing/some/:thing';

    const Provider = app.getProvider();
    const Router = app.getRouter();
    const { error: errorLogs } = await withLogCollector(async () => {
      await expect(() =>
        renderWithEffects(
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
      ).rejects.toThrow(expectedMessage);
    });

    expect(errorLogs).toEqual([
      expect.objectContaining({
        detail: new Error(expectedMessage),
        type: 'unhandled exception',
      }),
      expect.objectContaining({
        detail: new Error(expectedMessage),
        type: 'unhandled exception',
      }),
      expect.stringContaining(
        'The above error occurred in the <Provider> component:',
      ),
    ]);
  });

  it('should throw an error when required external plugin routes are not bound', async () => {
    const app = new AppManager({
      apis: [],
      defaultApis: [],
      themes,
      icons,
      plugins: [],
      components,
      configLoader: async () => [],
    });

    const expectedMessage =
      "External route 'extRouteRef1' of the 'blob' plugin must be bound to a target route. See https://backstage.io/link?bind-routes for details.";

    const Provider = app.getProvider();
    const Router = app.getRouter();
    const { error: errorLogs } = await withLogCollector(async () => {
      await expect(() =>
        renderWithEffects(
          <Provider>
            <Router>
              <Routes>
                <Route path="/test/:thing" element={<ExposedComponent />} />
              </Routes>
            </Router>
          </Provider>,
        ),
      ).rejects.toThrow(expectedMessage);
    });
    expect(errorLogs).toEqual([
      expect.objectContaining({
        detail: new Error(expectedMessage),
        type: 'unhandled exception',
      }),
      expect.objectContaining({
        detail: new Error(expectedMessage),
        type: 'unhandled exception',
      }),
      expect.stringContaining(
        'The above error occurred in the <Provider> component:',
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
        ['http://localhost', 'http://localhost'],
        {
          backend: {
            baseUrl: 'http://localhost:80',
          },
          app: {
            baseUrl: 'http://localhost:80',
          },
        },
      ],
      [
        ['http://localhost', 'http://localhost'],
        {
          backend: {
            baseUrl: 'http://localhost',
          },
          app: {
            baseUrl: 'http://localhost',
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
      'should be %p when %p (%#)',
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

  it('should clear app cookie when the user logs out', async () => {
    const logoutSignal = jest.fn();
    server.use(
      rest.delete(
        'http://localhost:7007/app/.backstage/auth/v1/cookie',
        (_req, res, ctx) => {
          logoutSignal();
          return res(ctx.status(200));
        },
      ),
    );

    const meta = global.document.createElement('meta');
    meta.name = 'backstage-app-mode';
    meta.content = 'protected';
    global.document.head.appendChild(meta);

    const fetchApiMock = {
      fetch: jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        }),
      }),
    };
    const discoveryApiMock = mockApis.discovery.mock({
      getBaseUrl: async () => 'http://localhost:7007/app',
    });

    const app = new AppManager({
      icons,
      themes,
      components,
      configLoader: async () => [],
      defaultApis: [
        noopErrorApi,
        createApiFactory({
          api: fetchApiRef,
          deps: {},
          factory: () => fetchApiMock,
        }),
        createApiFactory({
          api: discoveryApiRef,
          deps: {},
          factory: () => discoveryApiMock,
        }),
      ],
    });

    const SignOutButton = () => {
      const identityApi = useApi(identityApiRef);
      return <button onClick={() => identityApi.signOut()}>Sign Out</button>;
    };

    const Root = app.createRoot(
      <AppRouter>
        <meta name="backstage-app-mode" content="protected" />
        <SignOutButton />
      </AppRouter>,
    );
    await renderWithEffects(<Root />);

    await act(async () => {
      await userEvent.click(screen.getByText('Sign Out'));
    });

    expect(logoutSignal).toHaveBeenCalled();

    global.document.head.removeChild(meta);
  });
});
