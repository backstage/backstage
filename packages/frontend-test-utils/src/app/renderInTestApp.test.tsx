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
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
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
  useHref,
  appHistoryApiRef,
} from '@backstage/frontend-plugin-api';
import {
  UNSAFE_LocationContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
  useLocation,
  useParams,
  useInRouterContext,
  Link,
} from 'react-router-dom';
import { renderInTestApp } from './renderInTestApp';

/**
 * The current path, read from the app's own navigation rather than from a
 * routing library — which is what content that declares no router has.
 */
function PathProbe() {
  const appHistory = useApi(appHistoryApiRef);
  const location = useSyncExternalStore(
    useCallback(
      onStoreChange => {
        const subscription = appHistory.location$.subscribe(() =>
          onStoreChange(),
        );
        return () => subscription.unsubscribe();
      },
      [appHistory],
    ),
    () => appHistory.location,
  );
  return <span>Path: {location.pathname}</span>;
}

function HrefProbe(props: { to: string }) {
  return (
    <a data-testid="probe" href={useHref(props.to)}>
      probe
    </a>
  );
}

/**
 * Stands in for a real page router adapter such as `ReactRouterV6PageRouter`,
 * which lives in a package that depends on this one.
 *
 * Like a real adapter it injects React Router's contexts rather than nesting a
 * `<Router>`, which is what lets a page render one inside the app-root
 * projection above it — but unlike a real one it states a fixed match instead
 * of deriving it from the page mount and the app history. All this option has
 * to do is render the element inside the component it was given; what an
 * adapter puts in that context is its own conformance suite's business.
 */
function TestPageRouter(props: { children?: ReactNode }) {
  return (
    <UNSAFE_NavigationContext.Provider
      value={
        {
          basename: '',
          navigator: { createHref: (to: any) => to.pathname },
          static: false,
          future: { v7_relativeSplatPath: false },
        } as any
      }
    >
      <UNSAFE_LocationContext.Provider
        value={
          {
            location: {
              pathname: '/things/alpha',
              search: '',
              hash: '',
              state: null,
              key: 'default',
            },
            navigationType: 'POP',
          } as any
        }
      >
        <UNSAFE_RouteContext.Provider
          value={
            {
              outlet: null,
              matches: [
                {
                  params: { id: 'alpha' },
                  pathname: '/things/alpha',
                  pathnameBase: '/things/alpha',
                  route: { path: '/things/:id' },
                },
              ],
              isDataRoute: false,
            } as any
          }
        >
          {props.children}
        </UNSAFE_RouteContext.Provider>
      </UNSAFE_LocationContext.Provider>
    </UNSAFE_NavigationContext.Provider>
  );
}

describe('renderInTestApp', () => {
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
    const { appHistory } = renderInTestApp(<PathProbe />, {
      initialRouteEntries: ['/second-page'],
    });

    expect(screen.getByText('Path: /second-page')).toBeInTheDocument();
    expect(appHistory.location.pathname).toBe('/second-page');
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

  it('should drive navigation through the in-memory app history', async () => {
    const LocationProbe = () => {
      const navigation = useApi(appHistoryApiRef);
      return (
        <div>
          <PathProbe />
          <button type="button" onClick={() => navigation.navigate('/next')}>
            Go next
          </button>
        </div>
      );
    };

    const { appHistory } = renderInTestApp(<LocationProbe />, {
      initialRouteEntries: ['/start'],
    });

    expect(screen.getByText('Path: /start')).toBeInTheDocument();

    const locations: string[] = [];
    appHistory.location$.subscribe(loc => locations.push(loc.pathname));

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

    const { appHistory } = renderInTestApp(<LocationProbe />, {
      initialRouteEntries: ['/start'],
      config: {
        app: { baseUrl: 'http://localhost:3000/backstage' },
        backend: { baseUrl: 'http://localhost:7007' },
      },
    });

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

  // The element renders as a page mounted at `mountPath`, so page-relative
  // targets have to resolve against that mount. Nothing here publishes one
  // the way a real app's route switch does, and without it every target
  // below resolves against the app root instead.
  describe('mountPath', () => {
    it.each([
      [
        'a relative target',
        'techdocs',
        '/catalog/default/component/foo/techdocs',
      ],
      // The whole pattern is one match, so `..` climbs off the page rather
      // than into `/catalog/default/component`, where no page is mounted.
      ['a climbing target', '../bar', '/bar'],
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

    it('leaves the mount unpublished when the location does not reach it', async () => {
      renderInTestApp(<HrefProbe to="techdocs" />, {
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: ['/somewhere-else'],
      });

      expect(screen.queryByTestId('probe')).not.toBeInTheDocument();
    });

    // `'/'` and `'/*'` are the app root written two ways — the second is what
    // a caller gets by default when they name a `router` and no mount — so
    // they have to host what sits below them alike. A root mount that matched
    // only the root itself rendered nothing at any deeper location, and said
    // no more than "unable to find element" about it.
    it.each(['/', '/*'])(
      'hosts a deeper location when mounted at the app root with %s',
      async mountPath => {
        renderInTestApp(<HrefProbe to="techdocs" />, {
          mountPath,
          initialRouteEntries: ['/deeper/path'],
        });

        expect(screen.getByTestId('probe')).toHaveAttribute(
          'href',
          '/techdocs',
        );
      },
    );
  });

  describe('without a router adapter', () => {
    it('retains the production root router and follows app history', async () => {
      function Probe() {
        const location = useLocation();
        const inRouter = useInRouterContext();
        return (
          <div>
            <span>Root router: {String(inRouter)}</span>
            <span>Location: {location.pathname}</span>
            <Link to="next">Next</Link>
          </div>
        );
      }
      const { appHistory } = renderInTestApp(<Probe />, {
        initialRouteEntries: ['/catalog/foo'],
      });
      expect(await screen.findByText('Root router: true')).toBeInTheDocument();
      expect(screen.getByText('Location: /catalog/foo')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Next' })).toHaveAttribute(
        'href',
        '/next',
      );
      await act(async () => screen.getByRole('link', { name: 'Next' }).click());
      expect(appHistory.location.pathname).toBe('/next');
      expect(screen.getByText('Location: /next')).toBeInTheDocument();
    });

    it('leaves framework routing working', async () => {
      const routeRef = createRouteRef({ params: ['name'] });

      function FrameworkProbe() {
        const link = useRouteRef(routeRef);
        const params = useRouteRefParams(routeRef);
        return (
          <div>
            <span>Link: {link?.({ name: 'test-name' }) ?? 'none'}</span>
            <span>Name: {params.name ?? 'none'}</span>
            <HrefProbe to="techdocs" />
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
      expect(screen.getByTestId('probe')).toHaveAttribute(
        'href',
        '/catalog/default/component/foo/techdocs',
      );
    });
  });

  // Chrome is not a page and must not be tested as one: it renders above every
  // page, inside the app's own root React Router projection, so it has a router
  // in a real app and keeps one here.
  describe("renderAs: 'chrome'", () => {
    it('renders app-wide elements inside the app root router', async () => {
      function ChromeProbe() {
        const { pathname } = useLocation();
        return (
          <div>
            <span>Chrome at: {pathname}</span>
            <Link to="/catalog">Catalog</Link>
          </div>
        );
      }

      renderInTestApp(<ChromeProbe />, {
        renderAs: 'chrome',
        initialRouteEntries: ['/catalog/default/component/foo'],
      });

      expect(
        await screen.findByText('Chrome at: /catalog/default/component/foo'),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute(
        'href',
        '/catalog',
      );
    });
  });

  describe('router', () => {
    it('renders the element inside the adapter the page declares', async () => {
      function LibraryProbe() {
        const params = useParams();
        return <span>Id: {params.id}</span>;
      }

      renderInTestApp(<LibraryProbe />, { router: TestPageRouter });

      expect(screen.getByText('Id: alpha')).toBeInTheDocument();
    });

    it('keeps the page mount, so framework routing still answers', async () => {
      renderInTestApp(<HrefProbe to="techdocs" />, {
        router: TestPageRouter,
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: ['/catalog/default/component/foo'],
      });

      expect(screen.getByTestId('probe')).toHaveAttribute(
        'href',
        '/catalog/default/component/foo/techdocs',
      );
    });
  });

  it('should expose an appHistory on the render result that drives the app', async () => {
    const { appHistory } = renderInTestApp(<PathProbe />, {
      initialRouteEntries: ['/start'],
    });

    expect(appHistory.location.pathname).toBe('/start');
    expect(appHistory.createHref('/catalog?q=1')).toBe('/catalog?q=1');

    act(() => {
      appHistory.navigate('/elsewhere');
    });

    expect(await screen.findByText('Path: /elsewhere')).toBeInTheDocument();
    expect(appHistory.location.pathname).toBe('/elsewhere');
  });
});
