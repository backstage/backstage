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

import { default as React, PropsWithChildren, ReactNode } from 'react';
import {
  MemoryRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';
import {
  default as tlr,
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import { appHistoryApiRef } from '@backstage/frontend-plugin-api';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import { TestApiProvider } from '@backstage/test-utils';
import { PageMountProvider, type PageMount } from '@internal/frontend';
import { useAppGoBack, useAppLocation, useAppResolvedPath } from './appRouting';
import { useOptionalAppHistory } from '../hooks/useOptionalAppHistory';

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
 * Stands in for the `Sidebar`: it reads the same two authority-dependent values
 * (current location, resolved target) and renders the same thing out of them —
 * an active nav link — so a broken authority shows up as wrong output rather
 * than as a hook that happened not to throw.
 */
function ChromeStandIn(props: { to: string }) {
  const appHistory = useOptionalAppHistory();
  const location = useAppLocation(appHistory);
  const resolved = useAppResolvedPath(appHistory, props.to);

  return (
    <nav aria-label="Chrome">
      <a
        href={resolved.pathname}
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

describe('without a root React Router', () => {
  it('renders app chrome from the app history alone', async () => {
    const appHistory = createMockAppHistory({ initialLocation: '/catalog' });

    // No <MemoryRouter> anywhere: this is an app whose RouterBlueprint has been
    // swapped for a passthrough, or a createSpecializedApp without plugin-app.
    render(
      <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
        <ChromeStandIn to="/catalog" />
      </TestApiProvider>,
    );

    const link = await screen.findByRole('link', { name: 'Catalog' });
    expect(link).toHaveAttribute('href', '/catalog');
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
    // Pre-branch behavior of the deleted useChromePathname: no router and no
    // framework means the app root, not a blank app.
    render(<ChromeStandIn to="catalog" />);

    const link = await screen.findByRole('link', { name: 'Catalog' });
    expect(link).toHaveAttribute('href', '/catalog');
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

/**
 * The route trees the React Router authority is run through.
 *
 * Shared with the href differential in `@backstage/frontend-plugin-api`'s
 * `useHref.test.tsx`, which runs the same shapes through the other half of the
 * split.
 */
const trees: Array<{
  name: string;
  wrapper: (p: PropsWithChildren) => any;
}> = [
  {
    name: 'no route match',
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/catalog/x']}>{children}</MemoryRouter>
    ),
  },
  {
    name: 'location with a trailing slash',
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/catalog/']}>{children}</MemoryRouter>
    ),
  },
  {
    name: 'one deep parameterized match',
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/catalog/default/component/foo/docs']}>
        <Routes>
          <Route path="/catalog/:namespace/:kind/:name/*" element={children} />
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

describe('the React Router authority', () => {
  // Reading React Router's contexts instead of calling its hooks is only safe
  // if it gives the same answers, so the expectations here are computed from
  // React Router itself: both hooks render in the same tree and must agree.
  it.each(trees)('resolves paths like React Router ($name)', ({ wrapper }) => {
    for (const to of targets) {
      const { result } = renderHook(
        () => ({
          routerPath: useResolvedPath(to),
          appPath: useAppResolvedPath(undefined, to),
        }),
        { wrapper },
      );

      expect({ to, ...result.current.appPath }).toEqual({
        to,
        ...result.current.routerPath,
      });
    }
  });
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

/**
 * React Router v6 beta is still a supported version — `AppManager.compat.test`
 * runs the old frontend system against both, and the migration CLI writes
 * `'6.0.0-beta.0 || ^6.3.0'` — and it exports none of the `UNSAFE_*` context
 * objects this module reads. Each one used to be imported straight off the
 * module, so under beta they were `undefined` when handed to `useContext` and
 * no hook here could answer at all.
 *
 * That bites hardest in the configuration the fallbacks exist for: chrome
 * rendered with no ambient router under beta went through this module or
 * nowhere. Only running the suite against stable is why it shipped, so both
 * versions run here.
 *
 * The harness mirrors `AppManager.compat.test.tsx` and the beta arm of
 * `Link.test.tsx`: the module registry is reset so the hooks are re-required
 * against the mocked router, and React and Testing Library are pinned to the
 * instances this file already loaded so the re-required hooks still render
 * through them. The version aliases are the ones `@backstage/core-app-api`
 * declares. The mock app history is the one imported above, because it is a
 * plain object and a subscription rather than anything router-versioned.
 */
describe.each(['beta', 'stable'])('react-router %s', rrVersion => {
  beforeAll(() => {
    jest.resetModules();
    jest.doMock('react', () => React);
    jest.doMock('@testing-library/react', () => tlr);
    jest.doMock('react-router', () =>
      rrVersion === 'beta'
        ? jest.requireActual('react-router-beta')
        : jest.requireActual('react-router-stable'),
    );
    jest.doMock('react-router-dom', () =>
      rrVersion === 'beta'
        ? jest.requireActual('react-router-dom-beta')
        : jest.requireActual('react-router-dom-stable'),
    );
  });

  afterAll(() => {
    jest.resetModules();
  });

  /**
   * The hooks under test, and the page mount provider they read, both out of
   * the registry the mocks apply to. The mount context itself is a
   * `@backstage/version-bridge` global singleton, so the provider is the same
   * object either registry hands back — requiring it here only keeps the two
   * halves of the tree consistent.
   */
  function requireVersioned() {
    return {
      ...(require('./appRouting') as typeof import('./appRouting')),
      ...(require('@internal/frontend') as typeof import('@internal/frontend')),
    };
  }

  it('answers every hook from the app root with no router', () => {
    const versioned = requireVersioned();
    const historyBack = jest.spyOn(window.history, 'back').mockReturnValue();

    const { result } = renderHook(() => ({
      location: versioned.useAppLocation(undefined),
      basePath: versioned.useAppBasePath(),
      empty: versioned.useAppResolvedPath(undefined, ''),
      relative: versioned.useAppResolvedPath(undefined, 'catalog/create'),
      absolute: versioned.useAppResolvedPath(
        undefined,
        '/catalog?kind=component',
      ),
      goBack: versioned.useAppGoBack(undefined),
    }));

    // The same answers on both versions: the stand-in contexts report no
    // router and no matches under beta, and under stable there is no router
    // in this tree to report one.
    expect(result.current.location).toEqual({
      pathname: '/',
      search: '',
      hash: '',
    });
    expect(result.current.basePath).toBe('');
    expect(result.current.empty.pathname).toBe('/');
    expect(result.current.relative.pathname).toBe('/catalog/create');
    expect(result.current.absolute).toMatchObject({
      pathname: '/catalog',
      search: '?kind=component',
    });

    result.current.goBack();
    expect(historyBack).toHaveBeenCalledTimes(1);

    historyBack.mockRestore();
  });

  it('resolves the framework path against the page it is written in', () => {
    const versioned = requireVersioned();

    // A page registered at `/catalog`, currently rendering `/catalog/foo`, with
    // no React Router anywhere — the shape a `RouterBlueprint` passthrough or a
    // `createSpecializedApp` without `@backstage/plugin-app` leaves behind.
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog/foo',
    });
    const mount: PageMount = { basePath: '/catalog', routePattern: '/catalog' };
    const wrapper = ({ children }: PropsWithChildren<{}>) => (
      <versioned.PageMountProvider mount={mount}>
        {children}
      </versioned.PageMountProvider>
    );

    const { result } = renderHook(
      () => ({
        location: versioned.useAppLocation(appHistory),
        basePath: versioned.useAppBasePath(),
      }),
      { wrapper },
    );
    const resolved = (to: string) =>
      renderHook(() => versioned.useAppResolvedPath(appHistory, to), {
        wrapper,
      }).result.current.pathname;

    expect(result.current.location).toMatchObject({ pathname: '/catalog/foo' });
    expect(result.current.basePath).toBe('/catalog');

    // Targets with no pathname of their own keep the location they were
    // written at, relative ones resolve against the page's base, and `..`
    // climbs off the page. Rendering any of them runs the vendored
    // `parsePath`, `createPath` and `resolvePath`, none of which the beta has.
    expect({
      '#frag': resolved('#frag'),
      '?query=x': resolved('?query=x'),
      sub: resolved('sub'),
      './x': resolved('./x'),
      '..': resolved('..'),
      '/x': resolved('/x'),
    }).toEqual({
      '#frag': '/catalog/foo',
      '?query=x': '/catalog/foo',
      sub: '/catalog/sub',
      './x': '/catalog/x',
      '..': '/',
      '/x': '/x',
    });
  });
});
