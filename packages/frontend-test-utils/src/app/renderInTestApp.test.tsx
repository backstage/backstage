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

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { act, screen, fireEvent } from '@testing-library/react';
import { mockApis, TestApiProvider } from '@backstage/frontend-test-utils';
import {
  useAnalytics,
  createRouteRef,
  createExternalRouteRef,
  useRouteRef,
  useRouteRefParams,
  identityApiRef,
  useApi,
  coreApis,
  ApiBlueprint,
  createFrontendModule,
  createFrontendPlugin,
  type FrontendFeature,
  coreExtensionData,
  createExtension,
  type StorageApi,
  useAppHref,
} from '@backstage/frontend-plugin-api';
import { useRouteMatches } from '@internal/frontend';
import type { AppError } from '@backstage/frontend-app-api';
import { renderInTestApp } from './renderInTestApp';
import { renderTestApp } from './renderTestApp';
import { AnalyticsImplementationBlueprint } from '@backstage/plugin-app-react';

/**
 * The current path, read from the app's own navigation rather than from a
 * routing library — which is what content that declares no router has.
 */
function PathProbe() {
  const appHistory = useApi(coreApis.appHistory);
  const { location } = useSyncExternalStore(
    appHistory.subscribe,
    appHistory.getSnapshot,
  );
  return <span>Path: {location.pathname}</span>;
}

function HrefProbe(props: { to: string }) {
  return (
    <a data-testid="probe" href={useAppHref(props.to)}>
      probe
    </a>
  );
}

describe('renderInTestApp', () => {
  it('should throw for app errors that would show the error page', () => {
    const conflictingPlugin = createFrontendPlugin({
      pluginId: 'conflict',
      extensions: [
        ApiBlueprint.make({
          name: 'discovery',
          params: defineParams =>
            defineParams({
              api: coreApis.discovery,
              deps: {},
              factory: () => ({ getBaseUrl: async () => '' }),
            }),
        }),
      ],
    });

    expect(() =>
      renderInTestApp(<div />, { features: [conflictingPlugin] }),
    ).toThrow(
      /API 'core.discovery' is already provided by plugin 'app'[^]*error\.code === 'API_FACTORY_CONFLICT'/,
    );
  });

  describe('with an app warning', () => {
    const pluginWithInvalidFlag = createFrontendPlugin({
      pluginId: 'flags',
      featureFlags: [{ name: 'Invalid_Flag' }],
    });

    it('should throw by default', () => {
      expect(() =>
        renderInTestApp(<div />, { features: [pluginWithInvalidFlag] }),
      ).toThrow(
        /declared invalid feature flag 'Invalid_Flag'[^]*error => error\.code === 'FEATURE_FLAG_INVALID'/,
      );
    });

    it('should not throw for an expected error code', () => {
      renderInTestApp(<div>rendered</div>, {
        features: [pluginWithInvalidFlag],
        isExpectedError: error => error.code === 'FEATURE_FLAG_INVALID',
      });

      expect(screen.getByText('rendered')).toBeInTheDocument();
    });

    it('should not throw for an error matched by its context', () => {
      const isExpectedError = (error: AppError) =>
        error.code === 'FEATURE_FLAG_INVALID' &&
        error.context.pluginId === 'flags';

      renderInTestApp(<div>rendered</div>, {
        features: [pluginWithInvalidFlag],
        isExpectedError,
      });

      expect(screen.getByText('rendered')).toBeInTheDocument();
    });
  });

  it.each(['component', 'extensions'])(
    'exposes the app APIs with isolated defaults and explicit overrides for %s rendering',
    async mode => {
      let toast: ReturnType<typeof mockApis.toast>;
      let storage: StorageApi;
      function Probe() {
        toast = useApi(coreApis.toast) as ReturnType<typeof mockApis.toast>;
        storage = useApi(coreApis.storage);
        const analytics = useAnalytics();
        return (
          <button
            onClick={() => {
              toast.post({ title: 'Saved' });
              analytics.captureEvent('click', 'Save');
            }}
          >
            Save
          </button>
        );
      }
      function renderProbe(
        apis: Array<ReturnType<typeof mockApis.toast.mock>> = [],
        features: FrontendFeature[] = [],
      ) {
        if (mode === 'component') {
          return renderInTestApp(<Probe />, { apis, features });
        }
        return renderTestApp({
          extensions: [
            createExtension({
              name: 'probe',
              attachTo: { id: 'app/root', input: 'elements' },
              output: [coreExtensionData.reactElement],
              factory: () => [coreExtensionData.reactElement(<Probe />)],
            }),
          ],
          apis,
          features,
        });
      }

      const first = renderProbe();
      expect(
        first.apis.get(coreApis.internal.appLifecycle)?.isFinalized(),
      ).toBe(true);
      const firstToast = first.apis.get(coreApis.toast);
      fireEvent.click(await screen.findByRole('button', { name: 'Save' }));
      expect(firstToast).toBe(toast!);
      expect(first.apis.get(coreApis.storage)).toBe(storage!);
      expect(toast!.getToasts()).toEqual([{ title: 'Saved' }]);
      expect(screen.queryByText('Saved')).not.toBeInTheDocument();
      await storage!.set('saved', true);
      expect(storage!.snapshot('saved').value).toBe(true);
      first.unmount();

      const second = renderProbe();
      await screen.findByRole('button', { name: 'Save' });
      expect(second.apis.get(coreApis.toast)).toBe(toast!);
      expect(second.apis.get(coreApis.toast)).not.toBe(firstToast);
      expect(toast!.getToasts()).toEqual([]);
      expect(storage!.snapshot('saved').value).toBeUndefined();
      second.unmount();

      const captureEvent = jest.fn();
      const featureToast = mockApis.toast.mock();
      const feature = createFrontendModule({
        pluginId: 'app',
        extensions: [
          ApiBlueprint.make({
            name: 'toast',
            params: defineParams =>
              defineParams({
                api: coreApis.toast,
                deps: {},
                factory: () => featureToast,
              }),
          }),
          AnalyticsImplementationBlueprint.make({
            name: 'test',
            params: defineParams =>
              defineParams({ deps: {}, factory: () => ({ captureEvent }) }),
          }),
        ],
      });
      const third = renderProbe([], [feature]);
      fireEvent.click(await screen.findByRole('button', { name: 'Save' }));
      expect(third.apis.get(coreApis.toast)).toBe(featureToast);
      expect(toast!).toBe(featureToast);
      expect(featureToast.post).toHaveBeenCalledTimes(1);
      expect(captureEvent).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'click', subject: 'Save' }),
      );
      third.unmount();

      const override = mockApis.toast.mock();
      const fourth = renderProbe([override], [feature]);
      expect(fourth.apis.get(coreApis.toast)).toBe(override);
      fireEvent.click(await screen.findByRole('button', { name: 'Save' }));
      expect(toast!).toBe(override);
      expect(override.post).toHaveBeenCalledWith({ title: 'Saved' });
      expect(featureToast.post).toHaveBeenCalledTimes(1);
    },
  );

  it.each(['component', 'extensions'])(
    'preserves test extensions when a plugin with ID "test" is supplied for %s rendering',
    mode => {
      const routeRef = createRouteRef();
      function Probe() {
        const link = useRouteRef(routeRef);
        return <a href={link?.()}>Mounted route</a>;
      }
      const features = [
        createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            createExtension({
              name: 'plugin-content',
              attachTo: { id: 'app/root', input: 'elements' },
              output: [coreExtensionData.reactElement],
              factory: () => [
                coreExtensionData.reactElement(<div>Plugin content</div>),
              ],
            }),
          ],
        }),
      ];
      const mountedRoutes = { '/mounted': routeRef };

      if (mode === 'component') {
        renderInTestApp(<Probe />, { features, mountedRoutes });
      } else {
        renderTestApp({
          features,
          mountedRoutes,
          initialRouteEntries: ['/mounted'],
          extensions: [
            createExtension({
              name: 'probe',
              attachTo: { id: 'app/root', input: 'elements' },
              output: [coreExtensionData.reactElement],
              factory: () => [coreExtensionData.reactElement(<Probe />)],
            }),
          ],
        });
      }

      expect(
        screen.getByRole('link', { name: 'Mounted route' }),
      ).toHaveAttribute('href', '/mounted');
      expect(screen.getByText('Plugin content')).toBeInTheDocument();
    },
  );

  it('should render the given component in a page', async () => {
    const IndexPage = () => <div>Index Page</div>;
    renderInTestApp(<IndexPage />);
    expect(screen.getByText('Index Page')).toBeInTheDocument();
  });

  it('should works with apis provider', async () => {
    const IndexPage = () => {
      const analyticsApi = useAnalytics();
      const handleClick = useCallback(() => {
        analyticsApi.captureEvent('click', 'See details');
      }, [analyticsApi]);
      return (
        <div>
          Index Page
          <a href="/details" onClick={handleClick}>
            See details
          </a>
        </div>
      );
    };

    const analyticsApiMock = mockApis.analytics();

    renderInTestApp(
      <TestApiProvider apis={[analyticsApiMock]}>
        <IndexPage />
      </TestApiProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'See details' }));

    expect(analyticsApiMock.getEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          action: 'click',
          subject: 'See details',
        }),
      ]),
    );
  });

  it('should support setting different locations in the history stack', async () => {
    const { apis } = renderInTestApp(<PathProbe />, {
      initialRouteEntries: ['/second-page'],
    });
    const appHistory = apis.get(coreApis.appHistory)!;

    expect(screen.getByText('Path: /second-page')).toBeInTheDocument();
    expect(appHistory.getSnapshot().location.pathname).toBe('/second-page');
  });

  it('should support API overrides via options', async () => {
    const IndexPage = () => {
      const analyticsApi = useAnalytics();
      const handleClick = useCallback(() => {
        analyticsApi.captureEvent('click', 'Test action');
      }, [analyticsApi]);
      return (
        <div>
          <button onClick={handleClick}>Click me</button>
        </div>
      );
    };

    const analyticsApiMock = mockApis.analytics();

    renderInTestApp(<IndexPage />, {
      apis: [analyticsApiMock],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Click me' }));

    expect(analyticsApiMock.getEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          action: 'click',
          subject: 'Test action',
        }),
      ]),
    );
  });

  it('should allow mounting route refs', () => {
    const testRouteRef = createRouteRef({
      params: ['name'],
    });

    const LinkComponent = () => {
      const link = useRouteRef(testRouteRef);
      return <div>Link: {link?.({ name: 'test-name' }) ?? 'none'}</div>;
    };

    renderInTestApp(<LinkComponent />, {
      mountedRoutes: {
        '/test-path/:name': testRouteRef,
      },
    });

    expect(screen.getByText('Link: /test-path/test-name')).toBeInTheDocument();
  });

  it('should allow mounting external route refs', () => {
    const externalRef = createExternalRouteRef({ params: ['name'] });

    const ExternalLinkComponent = () => {
      const link = useRouteRef(externalRef);
      return <div>Link: {link?.({ name: 'test' }) ?? 'none'}</div>;
    };

    renderInTestApp(<ExternalLinkComponent />, {
      mountedRoutes: {
        '/items/:name': externalRef,
      },
    });

    expect(screen.getByText('Link: /items/test')).toBeInTheDocument();
  });

  describe('identity api', () => {
    const IdentityPage = () => {
      const identityApi = useApi(identityApiRef);
      const [userEntityRef, setUserEntityRef] = useState<string>();

      useEffect(() => {
        identityApi
          .getBackstageIdentity()
          .then(identity => setUserEntityRef(identity.userEntityRef));
      }, [identityApi]);

      return <div>{userEntityRef ?? 'Loading...'}</div>;
    };

    it('should use the overridden identity API instead of the default proxy', async () => {
      renderInTestApp(<IdentityPage />, {
        apis: [
          mockApis.identity({
            userEntityRef: 'user:default/i-just-made-this-up',
          }),
        ],
      });

      expect(
        await screen.findByText('user:default/i-just-made-this-up'),
      ).toBeInTheDocument();
    });

    it('should render with test user entity when no custom value provided', async () => {
      renderInTestApp(<IdentityPage />, {
        apis: [mockApis.identity()],
      });

      expect(await screen.findByText('user:default/test')).toBeInTheDocument();
    });

    it('should not render guest user entity when custom identity is provided', async () => {
      renderInTestApp(<IdentityPage />, {
        apis: [
          mockApis.identity({
            userEntityRef: 'user:default/i-just-made-this-up',
          }),
        ],
      });

      await screen.findByText('user:default/i-just-made-this-up');
      expect(screen.queryByText('user:default/guest')).not.toBeInTheDocument();
    });
  });

  it.each(['component', 'app'])(
    'honors explicit history overrides in %s rendering',
    async mode => {
      const history = mockApis.appHistory({ initialLocation: '/custom' });
      function Probe() {
        const activeHistory = useApi(coreApis.appHistory);
        expect(activeHistory).toBe(history);
        return <div>Custom history</div>;
      }
      const apis = [[coreApis.appHistory, history] as const];
      const result =
        mode === 'component'
          ? renderInTestApp(<Probe />, { apis })
          : renderTestApp({
              apis,
              extensions: [
                createExtension({
                  name: 'history-probe',
                  attachTo: { id: 'app/root', input: 'elements' },
                  output: [coreExtensionData.reactElement],
                  factory: () => [coreExtensionData.reactElement(<Probe />)],
                }),
              ],
            });
      expect(await screen.findByText('Custom history')).toBeInTheDocument();
      expect(result.apis.get(coreApis.appHistory)).toBe(history);
    },
  );

  it('should drive navigation through the in-memory app history', async () => {
    const LocationProbe = () => {
      const navigation = useApi(coreApis.appHistory);
      return (
        <div>
          <PathProbe />
          <button type="button" onClick={() => navigation.navigate('/next')}>
            Go next
          </button>
        </div>
      );
    };

    const { apis } = renderInTestApp(<LocationProbe />, {
      initialRouteEntries: ['/start'],
    });
    const appHistory = apis.get(coreApis.appHistory)!;

    expect(screen.getByText('Path: /start')).toBeInTheDocument();

    const locations: string[] = [];
    appHistory.subscribe(() =>
      locations.push(appHistory.getSnapshot().location.pathname),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go next' }));

    expect(await screen.findByText('Path: /next')).toBeInTheDocument();
    expect(locations).toContain('/next');
  });

  it('should resolve locations under an app basename', async () => {
    const LocationProbe = () => (
      <div>
        <PathProbe />
        <HrefProbe to="/catalog" />
      </div>
    );

    const { apis } = renderInTestApp(<LocationProbe />, {
      initialRouteEntries: ['/start'],
      config: {
        app: { baseUrl: 'http://localhost:3000/backstage' },
        backend: { baseUrl: 'http://localhost:7007' },
      },
    });
    const appHistory = apis.get(coreApis.appHistory)!;

    expect(screen.getByText('Path: /start')).toBeInTheDocument();
    expect(screen.getByTestId('probe')).toHaveAttribute(
      'href',
      '/backstage/catalog',
    );

    // Driving the store from outside React, so the resulting re-render has to
    // be wrapped or React warns that state was updated outside act().
    act(() => {
      appHistory.navigate('/catalog');
    });
    expect(await screen.findByText('Path: /catalog')).toBeInTheDocument();
  });

  // A framework page mount binds route params, but app hrefs remain absolute.
  // Page-relative targets belong to a page router adapter.
  describe('mountPath', () => {
    it.each([
      ['an app-absolute target', '/techdocs', '/techdocs'],
      [
        'a query-only target',
        '?tab=readme',
        '/catalog/default/component/foo?tab=readme',
      ],
      ['an absolute target', '/settings', '/settings'],
    ])('resolves %s against the mount', async (_name, to, expected) => {
      renderInTestApp(<HrefProbe to={to} />, {
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: ['/catalog/default/component/foo'],
      });

      expect(screen.getByTestId('probe')).toHaveAttribute('href', expected);
    });

    it('tracks mounted page params and visibility through framework navigation', async () => {
      const ref = createRouteRef({ params: ['name'] });
      function Page() {
        const { name } = useRouteRefParams(ref);
        const matches = useRouteMatches();
        return (
          <span>
            Page: {name} at {matches.at(-1)?.basePath}
          </span>
        );
      }
      const { apis } = renderInTestApp(<Page />, {
        mountPath: '/items/:name',
        initialRouteEntries: ['/items/first/details'],
        mountedRoutes: { '/elsewhere': createRouteRef() },
        config: {
          app: { baseUrl: 'http://localhost:3000/backstage' },
          backend: { baseUrl: 'http://localhost:7007' },
        },
      });
      const appHistory = apis.get(coreApis.appHistory)!;
      expect(
        await screen.findByText('Page: first at /items/first'),
      ).toBeInTheDocument();
      act(() => appHistory.navigate('/ITEMS/second?tab=info'));
      expect(
        await screen.findByText('Page: second at /ITEMS/second'),
      ).toBeInTheDocument();
      act(() => appHistory.navigate('/elsewhere'));
      expect(screen.queryByText(/^Page:/)).not.toBeInTheDocument();
      act(() => appHistory.navigate(-1));
      expect(
        await screen.findByText('Page: second at /ITEMS/second'),
      ).toBeInTheDocument();
    });

    it('unmounts page errors off-route and recovers when returning', async () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      let shouldThrow = true;
      function Page() {
        if (shouldThrow) {
          throw new Error('Page failed to render');
        }
        return <span>Recovered page</span>;
      }
      try {
        const { apis } = renderInTestApp(<Page />, {
          mountPath: '/items',
          initialRouteEntries: ['/items'],
        });
        const appHistory = apis.get(coreApis.appHistory)!;
        expect(
          await screen.findByText('Page failed to render'),
        ).toBeInTheDocument();
        act(() => appHistory.navigate('/elsewhere'));
        expect(
          screen.queryByText('Page failed to render'),
        ).not.toBeInTheDocument();
        shouldThrow = false;
        act(() => appHistory.navigate(-1));
        expect(await screen.findByText('Recovered page')).toBeInTheDocument();
        expect(
          screen.queryByText('Page failed to render'),
        ).not.toBeInTheDocument();
      } finally {
        consoleError.mockRestore();
      }
    });

    it('leaves the mount unpublished when the location does not reach it', async () => {
      renderInTestApp(<HrefProbe to="/techdocs" />, {
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: ['/somewhere-else'],
      });

      expect(screen.queryByTestId('probe')).not.toBeInTheDocument();
    });

    // Both spellings of the app root must also match deeper locations.
    it.each(['/', '/*'])(
      'hosts a deeper location when mounted at the app root with %s',
      async mountPath => {
        function Content() {
          const mount = useRouteMatches().at(-1);
          return (
            <>
              <span>Mount: {mount?.basePath ?? 'none'}</span>
              <HrefProbe to="/techdocs" />
            </>
          );
        }
        renderInTestApp(<Content />, {
          mountPath,
          initialRouteEntries: ['/deeper/path'],
          mountedRoutes: { '/deeper/path': createRouteRef() },
        });
        expect(screen.getByText('Mount: /')).toBeInTheDocument();

        expect(screen.getByTestId('probe')).toHaveAttribute(
          'href',
          '/techdocs',
        );
      },
    );
  });

  describe('without a page adapter', () => {
    it('leaves framework routing working', async () => {
      const routeRef = createRouteRef({ params: ['name'] });

      function FrameworkProbe() {
        const link = useRouteRef(routeRef);
        const params = useRouteRefParams(routeRef);
        return (
          <div>
            <span>Link: {link?.({ name: 'test-name' }) ?? 'none'}</span>
            <span>Name: {params.name ?? 'none'}</span>
            <HrefProbe to="/techdocs" />
          </div>
        );
      }

      renderInTestApp(<FrameworkProbe />, {
        mountedRoutes: { '/test-path/:name': routeRef },
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: ['/catalog/default/component/foo'],
      });

      expect(
        screen.getByText('Link: /test-path/test-name'),
      ).toBeInTheDocument();
      // Bound from the pattern the page is mounted at, which is where params
      // come from once React Router is not the one answering.
      expect(screen.getByText('Name: foo')).toBeInTheDocument();
      expect(screen.getByTestId('probe')).toHaveAttribute('href', '/techdocs');
    });
  });

  // Chrome is not a page and must not be tested as one: it renders above every
  // page, inside the app's own root React Router projection, so it has a router
  // in a real app and keeps one here.
  describe("renderAs: 'chrome'", () => {
    it('renders app-wide elements independently of the page mount', async () => {
      function ChromeProbe() {
        const href = useAppHref('/catalog');
        return (
          <div>
            <PathProbe />
            <a href={href}>Catalog</a>
          </div>
        );
      }

      renderInTestApp(<ChromeProbe />, {
        renderAs: 'chrome',
        mountPath: '/another-page',
        initialRouteEntries: ['/catalog/default/component/foo'],
      });

      expect(
        await screen.findByText('Path: /catalog/default/component/foo'),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute(
        'href',
        '/catalog',
      );
    });
  });

  it('should expose the app history through the API holder to drive the app', async () => {
    const { apis } = renderInTestApp(<PathProbe />, {
      initialRouteEntries: ['/start'],
    });
    const appHistory = apis.get(coreApis.appHistory)!;

    expect(appHistory.getSnapshot().location.pathname).toBe('/start');
    expect(appHistory.createHref('/catalog?q=1')).toBe('/catalog?q=1');

    act(() => {
      appHistory.navigate('/elsewhere');
    });

    expect(await screen.findByText('Path: /elsewhere')).toBeInTheDocument();
    expect(appHistory.getSnapshot().location.pathname).toBe('/elsewhere');
  });
});
