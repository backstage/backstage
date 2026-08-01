/*
 * Copyright 2026 The Backstage Authors
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

import { PropsWithChildren, ReactNode } from 'react';
import {
  MemoryRouter,
  Outlet,
  Route,
  Routes,
  useHref,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import { appHistoryApiRef, useApiHolder } from '@backstage/frontend-plugin-api';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import { TestApiProvider } from '@backstage/test-utils';
import { PageMountProvider, type PageMount } from './PageMountContext';
import {
  normalizeBasePath,
  useAppGoBack,
  useAppHref,
  useAppLocation,
  useAppResolvedPath,
} from './AppRouting';

/** Chrome resolves the app history from the API holder; tests do it inline. */
function useOptionalAppHistory() {
  return useApiHolder().get(appHistoryApiRef);
}

type MockAppHistory = ReturnType<typeof createMockAppHistory>;

function frameworkWrapper(options: {
  location?: string;
  pageMount?: PageMount;
  appHistory?: MockAppHistory;
  basename?: string;
}) {
  const appHistory =
    options.appHistory ??
    createMockAppHistory({
      initialLocation: options.location ?? '/',
      basename: options.basename,
    });
  const { pageMount } = options;
  return ({ children }: PropsWithChildren<{}>) => (
    <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
      <MemoryRouter initialEntries={[options.location ?? '/']}>
        {pageMount ? (
          <PageMountProvider mount={pageMount}>{children}</PageMountProvider>
        ) : (
          children
        )}
      </MemoryRouter>
    </TestApiProvider>
  );
}

/**
 * Stands in for the `Sidebar`: it reads the same three authority-dependent
 * values (current location, resolved target, rendered href) and renders the
 * same things out of them — an active nav link — so a broken authority shows up
 * as wrong output rather than as a hook that happened not to throw.
 */
function ChromeStandIn(props: { to: string }) {
  const appHistory = useOptionalAppHistory();
  const location = useAppLocation(appHistory);
  const resolved = useAppResolvedPath(appHistory, props.to);
  const href = useAppHref(appHistory, props.to);

  return (
    <nav aria-label="Chrome">
      <a
        href={href}
        aria-current={
          location.pathname === resolved.pathname ? 'page' : undefined
        }
      >
        Catalog
      </a>
      <p>at {location.pathname}</p>
      <p>target {resolved.pathname}</p>
    </nav>
  );
}

describe('normalizeBasePath', () => {
  it('strips trailing slashes and collapses the app root to an empty prefix', () => {
    expect(normalizeBasePath(undefined)).toBe('');
    expect(normalizeBasePath('/')).toBe('');
    expect(normalizeBasePath('///')).toBe('');
    expect(normalizeBasePath('/catalog')).toBe('/catalog');
    expect(normalizeBasePath('/catalog/')).toBe('/catalog');
  });
});

describe('without a root React Router', () => {
  it('renders app chrome from the app history alone', async () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog',
      basename: '/backstage',
    });

    // No <MemoryRouter> anywhere: this is an app whose RouterBlueprint has been
    // swapped for a passthrough, or a createSpecializedApp without plugin-app.
    render(
      <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
        <ChromeStandIn to="/catalog" />
      </TestApiProvider>,
    );

    const link = await screen.findByRole('link', { name: 'Catalog' });
    expect(link).toHaveAttribute('href', '/backstage/catalog');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('at /catalog')).toBeInTheDocument();
    expect(screen.getByText('target /catalog')).toBeInTheDocument();

    act(() => {
      appHistory.navigate('/docs');
    });

    expect(screen.getByText('at /docs')).toBeInTheDocument();
    expect(link).not.toHaveAttribute('aria-current');
  });

  it('renders app chrome at the app root when there is no app history either', async () => {
    // Pre-branch behaviour of the deleted useChromePathname: no router and no
    // framework means the app root, not a blank app.
    render(<ChromeStandIn to="catalog" />);

    const link = await screen.findByRole('link', { name: 'Catalog' });
    expect(link).toHaveAttribute('href', 'catalog');
    expect(link).not.toHaveAttribute('aria-current');
    expect(screen.getByText('at /')).toBeInTheDocument();
    expect(screen.getByText('target /catalog')).toBeInTheDocument();
  });

  it('answers every hook from the app root when neither authority is present', () => {
    const { result } = renderHook(() => ({
      location: useAppLocation(undefined),
      empty: useAppResolvedPath(undefined, ''),
      relative: useAppResolvedPath(undefined, 'catalog/create'),
      absolute: useAppResolvedPath(undefined, '/catalog?kind=component'),
      href: useAppHref(undefined, '/catalog'),
      externalHref: useAppHref(undefined, 'mailto:someone@example.com'),
    }));

    expect(result.current.location).toEqual({
      pathname: '/',
      search: '',
      hash: '',
    });
    expect(result.current.empty.pathname).toBe('/');
    expect(result.current.relative.pathname).toBe('/catalog/create');
    expect(result.current.absolute).toMatchObject({
      pathname: '/catalog',
      search: '?kind=component',
    });
    expect(result.current.href).toBe('/catalog');
    expect(result.current.externalHref).toBe('mailto:someone@example.com');
  });
});

describe('useAppResolvedPath', () => {
  it('resolves relative targets against the page mount, not the location (framework)', () => {
    const resolve = (to: string, location: string, pageMount?: PageMount) =>
      renderHook(() => useAppResolvedPath(useOptionalAppHistory(), to), {
        wrapper: frameworkWrapper({ location, pageMount }),
      }).result.current.pathname;

    // App chrome renders outside the route tree, so there is no page mount and
    // relative targets resolve against the app root - the same answer React
    // Router gives when no route matched.
    expect(resolve('catalog', '/catalog')).toBe('/catalog');
    expect(resolve('catalog', '/catalog/default/component/foo')).toBe(
      '/catalog',
    );
    expect(resolve('', '/catalog/default/component/foo')).toBe('/');

    const pageMount: PageMount = {
      basePath: '/catalog/default/component/foo',
      routePattern: '/catalog/:namespace/:kind/:name',
    };
    expect(
      resolve('widgets', '/catalog/default/component/foo/docs', pageMount),
    ).toBe('/catalog/default/component/foo/widgets');
  });

  it('keeps absolute targets and their search string intact (framework)', () => {
    const { result } = renderHook(
      () =>
        useAppResolvedPath(useOptionalAppHistory(), '/catalog?kind=component'),
      { wrapper: frameworkWrapper({ location: '/docs' }) },
    );

    expect(result.current).toMatchObject({
      pathname: '/catalog',
      search: '?kind=component',
    });
  });

  it('defers to React Router route matching when there is no app history', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/catalog/default/component/foo']}>
        <Routes>
          <Route path="/catalog/*" element={children} />
        </Routes>
      </MemoryRouter>
    );

    const { result } = renderHook(
      () => useAppResolvedPath(useOptionalAppHistory(), 'widgets'),
      {
        wrapper,
      },
    );
    const { result: emptyResult } = renderHook(
      () => useAppResolvedPath(useOptionalAppHistory(), ''),
      {
        wrapper,
      },
    );

    expect(result.current.pathname).toBe('/catalog/widgets');
    expect(emptyResult.current.pathname).toBe('/catalog');
  });
});

describe('the React Router authority', () => {
  // Reading React Router's contexts instead of calling its hooks is only safe
  // if it gives the same answers, so the expectations here are computed from
  // React Router itself: both hooks render in the same tree and must agree.
  const trees: Array<{ name: string; wrapper: (p: PropsWithChildren) => any }> =
    [
      {
        name: 'no route match',
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/catalog/x']}>
            {children}
          </MemoryRouter>
        ),
      },
      {
        name: 'location with a trailing slash',
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/catalog/']}>{children}</MemoryRouter>
        ),
      },
      {
        name: 'one deep parameterised match',
        wrapper: ({ children }) => (
          <MemoryRouter
            initialEntries={['/catalog/default/component/foo/docs']}
          >
            <Routes>
              <Route
                path="/catalog/:namespace/:kind/:name/*"
                element={children}
              />
            </Routes>
          </MemoryRouter>
        ),
      },
      {
        name: 'nested matches',
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/catalog/sub/x']}>
            <Routes>
              <Route path="/catalog" element={<Outlet />}>
                <Route path="sub/*" element={children} />
              </Route>
            </Routes>
          </MemoryRouter>
        ),
      },
      {
        name: 'pathless layout route',
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/catalog/x']}>
            <Routes>
              <Route element={<Outlet />}>
                <Route path="/catalog/*" element={children} />
              </Route>
            </Routes>
          </MemoryRouter>
        ),
      },
      {
        name: 'index route',
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/catalog']}>
            <Routes>
              <Route path="/catalog" element={<Outlet />}>
                <Route index element={children} />
              </Route>
            </Routes>
          </MemoryRouter>
        ),
      },
      {
        name: 'deployed under a basename',
        wrapper: ({ children }) => (
          <MemoryRouter basename="/backstage" initialEntries={['/backstage']}>
            {children}
          </MemoryRouter>
        ),
      },
    ];

  const targets = [
    '',
    '.',
    './',
    'widgets',
    'widgets/',
    'a/b',
    '/catalog',
    '/catalog/',
    '/catalog?kind=component',
    '/catalog#frag',
    '/search?query=https://example.com',
    '..',
    '../x',
    '../../x',
    '?tab=readme',
    '#section',
  ];

  it.each(trees)(
    'resolves and renders hrefs like React Router ($name)',
    ({ wrapper }) => {
      for (const to of targets) {
        const { result } = renderHook(
          () => ({
            routerPath: useResolvedPath(to),
            appPath: useAppResolvedPath(undefined, to),
            routerHref: useHref(to),
            appHref: useAppHref(undefined, to),
          }),
          { wrapper },
        );

        expect({ to, ...result.current.appPath }).toEqual({
          to,
          ...result.current.routerPath,
        });
        expect({ to, href: result.current.appHref }).toEqual({
          to,
          href: result.current.routerHref,
        });
      }
    },
  );
});

describe('useAppLocation', () => {
  it('reports the app history location, including its search string', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog?kind=component',
    });

    const { result } = renderHook(
      () => useAppLocation(useOptionalAppHistory()),
      {
        wrapper: frameworkWrapper({ location: '/from-router', appHistory }),
      },
    );

    // The framework wins over the ambient router, and `search` survives.
    expect(result.current).toMatchObject({
      pathname: '/catalog',
      search: '?kind=component',
    });

    act(() => {
      appHistory.navigate('/docs?tab=readme');
    });

    expect(result.current).toMatchObject({
      pathname: '/docs',
      search: '?tab=readme',
    });
  });

  it('falls back to React Router when there is no app history', () => {
    const { result } = renderHook(
      () => useAppLocation(useOptionalAppHistory()),
      {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <MemoryRouter initialEntries={['/explore?filter=all']}>
            {children}
          </MemoryRouter>
        ),
      },
    );

    expect(result.current).toMatchObject({
      pathname: '/explore',
      search: '?filter=all',
    });
  });
});

describe('useAppHref', () => {
  it('applies the app deploy basename through the app history', () => {
    const { result } = renderHook(
      () => useAppHref(useOptionalAppHistory(), '/catalog'),
      {
        wrapper: frameworkWrapper({ basename: '/backstage' }),
      },
    );

    expect(result.current).toBe('/backstage/catalog');
  });

  it('falls back to React Router when there is no app history', () => {
    const { result } = renderHook(
      () => useAppHref(useOptionalAppHistory(), '/catalog'),
      {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <MemoryRouter basename="/backstage" initialEntries={['/backstage']}>
            {children}
          </MemoryRouter>
        ),
      },
    );

    expect(result.current).toBe('/backstage/catalog');
  });

  it('leaves targets that are not app-relative unchanged on both authorities', () => {
    const framework = (to: string) =>
      renderHook(() => useAppHref(useOptionalAppHistory(), to), {
        wrapper: frameworkWrapper({ basename: '/backstage' }),
      }).result.current;

    const legacy = (to: string) =>
      renderHook(() => useAppHref(useOptionalAppHistory(), to), {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <MemoryRouter basename="/backstage" initialEntries={['/backstage']}>
            {children}
          </MemoryRouter>
        ),
      }).result.current;

    for (const to of [
      'https://example.com/x',
      '//example.com/x',
      'mailto:someone@example.com',
      'tel:+15555550123',
    ]) {
      expect(framework(to)).toBe(to);
      expect(legacy(to)).toBe(to);
    }

    // A URL carried in the query string is still an app-relative target, so
    // the deploy basename is applied on both paths.
    expect(framework('/search?query=https://example.com')).toBe(
      '/backstage/search?query=https://example.com',
    );
    expect(legacy('/search?query=https://example.com')).toBe(
      '/backstage/search?query=https://example.com',
    );
  });
});

describe('useAppGoBack', () => {
  /** Renders the React Router location the surrounding tree is sitting at. */
  function RouterLocation() {
    const { pathname } = useLocation();
    return <h1>at {pathname}</h1>;
  }

  /** Stands in for `ErrorPage`'s go-back link. */
  function GoBackLink(props: { appHistory?: MockAppHistory }) {
    const goBack = useAppGoBack(props.appHistory);
    return <button onClick={goBack}>Go back</button>;
  }

  /** React Router's own answer, rendered beside it for comparison. */
  function RouterGoBackLink() {
    const navigate = useNavigate();
    return <button onClick={() => navigate(-1)}>Go back the router way</button>;
  }

  const entries = ['/one', '/two', '/three'];

  it('pops the history entry React Router navigate(-1) pops', async () => {
    // Reading the navigator out of the context instead of calling `useNavigate`
    // is only safe if it moves the same history the same way, so React Router's
    // own answer is rendered in the same tree and the two are compared.
    const goBackWith = async (button: string) => {
      const view = render(
        <MemoryRouter initialEntries={entries} initialIndex={2}>
          <RouterLocation />
          <GoBackLink />
          <RouterGoBackLink />
        </MemoryRouter>,
      );
      expect(await view.findByRole('heading')).toHaveTextContent('at /three');

      fireEvent.click(view.getByRole('button', { name: button }));
      const landedOn = view.getByRole('heading').textContent;
      view.unmount();
      return landedOn;
    };

    expect(await goBackWith('Go back')).toBe('at /two');
    expect(await goBackWith('Go back')).toBe(
      await goBackWith('Go back the router way'),
    );
  });

  it('goes back through the browser on the framework path, leaving the router alone', async () => {
    const historyBack = jest.spyOn(window.history, 'back').mockReturnValue();
    const appHistory = createMockAppHistory({ initialLocation: '/three' });

    const view = render(
      <MemoryRouter initialEntries={entries} initialIndex={2}>
        <RouterLocation />
        <GoBackLink appHistory={appHistory} />
      </MemoryRouter>,
    );
    fireEvent.click(await view.findByRole('button', { name: 'Go back' }));

    // The app history has no `go()` of its own, so the browser pops and the
    // `popstate` it fires is what the app history hears. The ambient router is
    // left where it was rather than popped a second time.
    expect(historyBack).toHaveBeenCalledTimes(1);
    expect(view.getByRole('heading')).toHaveTextContent('at /three');

    historyBack.mockRestore();
  });

  it('goes back through the browser when there is no router either', async () => {
    const historyBack = jest.spyOn(window.history, 'back').mockReturnValue();

    render(<GoBackLink />);
    fireEvent.click(await screen.findByRole('button', { name: 'Go back' }));

    // No navigator to ask, and the browser history is the only one there is.
    expect(historyBack).toHaveBeenCalledTimes(1);

    historyBack.mockRestore();
  });
});
