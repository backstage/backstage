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

import { default as React, PropsWithChildren } from 'react';
import { default as tlr, render, renderHook } from '@testing-library/react';
import {
  Link as RouterLink,
  MemoryRouter,
  Outlet,
  Route,
  Routes,
  useHref as useRouterHref,
} from 'react-router-dom';
import { TestApiProvider } from '@backstage/test-utils';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import { PageMountProvider, type PageMount } from '@internal/frontend';
import { appHistoryApiRef } from './AppHistoryApi';
import { useAppHref, useHref } from './useHref';
import { useApiHolder } from '../apis/system';

/** Chrome resolves the app history from the API holder; tests do it inline. */
function useOptionalAppHistory() {
  return useApiHolder().get(appHistoryApiRef);
}

describe('useHref', () => {
  const appHistory = createMockAppHistory({ basename: '/backstage' });

  const targets = [
    '/catalog',
    '/search?q=https://example.com',
    'https://example.com/x',
    '//example.com/x',
    'mailto:support@example.com',
    'tel:+15555550123',
  ];

  // Every spelling a browser executes rather than navigates to, including the
  // ones it only executes after dropping the tabs and newlines from the URL.
  const executableTargets = [
    // eslint-disable-next-line no-script-url
    'javascript:alert(1)',
    // eslint-disable-next-line no-script-url
    'JavaScript:alert(1)',
    '\tjavascript:alert(1)',
    'java\tscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
  ];

  const withAppHistory = ({ children }: PropsWithChildren<{}>) => (
    <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
      <MemoryRouter>{children}</MemoryRouter>
    </TestApiProvider>
  );

  // No app history registered — the old frontend system path, where React
  // Router's own useHref would otherwise resolve and prefix these.
  const withReactRouterOnly = ({ children }: PropsWithChildren<{}>) => (
    <TestApiProvider apis={[]}>
      <MemoryRouter basename="/backstage" initialEntries={['/backstage/']}>
        {children}
      </MemoryRouter>
    </TestApiProvider>
  );

  const renderTargets = (
    wrapper: (props: PropsWithChildren<{}>) => JSX.Element,
    hrefs: string[] = targets,
  ) =>
    hrefs.map(to => renderHook(() => useHref(to), { wrapper }).result.current);

  it('should apply the app basename to app-relative targets and pass others through', () => {
    expect(renderTargets(withAppHistory)).toEqual([
      '/backstage/catalog',
      '/backstage/search?q=https://example.com',
      'https://example.com/x',
      '//example.com/x',
      'mailto:support@example.com',
      'tel:+15555550123',
    ]);
  });

  it('should pass non-app-relative targets through on the React Router fallback too', () => {
    expect(renderTargets(withReactRouterOnly)).toEqual([
      '/backstage/catalog',
      '/backstage/search?q=https://example.com',
      'https://example.com/x',
      '//example.com/x',
      'mailto:support@example.com',
      'tel:+15555550123',
    ]);
  });

  it('should hand the target back when there is no router at all', () => {
    // A framework app can legitimately have no React Router: `RouterBlueprint`
    // may be swapped for a passthrough, and `createSpecializedApp` without
    // `@backstage/plugin-app` mounts none. React Router's own `useHref` throws
    // there, so this hook must not be built on it.
    const withoutRouter = ({ children }: PropsWithChildren<{}>) => (
      <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
        {children}
      </TestApiProvider>
    );
    const withNeitherAuthority = ({ children }: PropsWithChildren<{}>) => (
      <TestApiProvider apis={[]}>{children}</TestApiProvider>
    );

    // The app history still knows the deploy basename without a router.
    expect(renderTargets(withoutRouter)).toEqual([
      '/backstage/catalog',
      '/backstage/search?q=https://example.com',
      'https://example.com/x',
      '//example.com/x',
      'mailto:support@example.com',
      'tel:+15555550123',
    ]);
    // With neither authority there is no basename and nothing to render the
    // href with, so every target comes back as written.
    expect(renderTargets(withNeitherAuthority)).toEqual(targets);
  });

  it('should return an inert href for targets a browser would execute', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const inert = executableTargets.map(() => 'about:blank');

    expect(renderTargets(withAppHistory, executableTargets)).toEqual(inert);
    expect(renderTargets(withReactRouterOnly, executableTargets)).toEqual(
      inert,
    );

    // Matched on the message: React Router warns about its own future flags
    // through the same spy.
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('about:blank'));
    warn.mockRestore();
  });
});

/**
 * The route trees both authorities are run through, each paired with the
 * browser URL it renders at — deploy basename included — so the same situation
 * can be set up on the framework path: an app history standing at that
 * location, under that basename, with the page mount a framework app would
 * publish for that shape.
 */
const trees: Array<{
  name: string;
  url: string;
  basename?: string;
  /** The mount a framework app publishes where this tree has route matches. */
  pageMount?: PageMount;
  wrapper: (p: PropsWithChildren) => any;
}> = [
  {
    name: 'no route match',
    url: '/catalog/x',
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/catalog/x']}>{children}</MemoryRouter>
    ),
  },
  {
    name: 'location with a trailing slash',
    url: '/catalog/',
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/catalog/']}>{children}</MemoryRouter>
    ),
  },
  {
    // The shape the two authorities used to disagree on: this page's match
    // spans four segments, so climbing a segment per `..` landed on
    // `/catalog/default/component`, which no route claims.
    name: 'one deep parameterized match',
    url: '/catalog/default/component/foo/docs',
    pageMount: {
      basePath: '/catalog/default/component/foo',
      routePattern: '/catalog/:namespace/:kind/:name',
    },
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/catalog/default/component/foo/docs']}>
        <Routes>
          <Route path="/catalog/:namespace/:kind/:name/*" element={children} />
        </Routes>
      </MemoryRouter>
    ),
  },
  {
    // A sub-page of a parameterized page: one match below it, so the first
    // `..` lands on the page and the second climbs off it.
    name: 'sub-page below a parameterized page',
    url: '/catalog/foo/tab-1',
    pageMount: {
      basePath: '/catalog/foo/tab-1',
      routePattern: '/catalog/:name/tab-1',
    },
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/catalog/foo/tab-1']}>
        <Routes>
          <Route path="/catalog/:name" element={<Outlet />}>
            <Route path="tab-1/*" element={children} />
          </Route>
        </Routes>
      </MemoryRouter>
    ),
  },
  {
    name: 'nested matches',
    url: '/catalog/sub/x',
    pageMount: { basePath: '/catalog/sub', routePattern: '/catalog/sub' },
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
    url: '/catalog/x',
    pageMount: { basePath: '/catalog', routePattern: '/catalog' },
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
    url: '/catalog',
    pageMount: { basePath: '/catalog', routePattern: '/catalog' },
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
    url: '/backstage',
    basename: '/backstage',
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

/**
 * The framework spelling of a React Router href.
 *
 * The one value the two authorities render differently:
 * `AppHistory.createHref` normalizes every target through `URL`, so a target
 * that lands on the app root renders as `${basename}/` where React Router
 * renders it as `${basename}`. Both address the app root, and only a deploy
 * basename makes the two spellings distinguishable at all.
 */
function appRootSpelling(routerHref: string, basename?: string): string {
  if (!basename) {
    return routerHref;
  }
  const rest = routerHref.slice(basename.length);
  const atAppRoot = rest === '' || rest.startsWith('?') || rest.startsWith('#');
  return atAppRoot ? `${basename}/${rest}` : routerHref;
}

describe('the React Router authority', () => {
  // Reading React Router's contexts instead of calling its hooks is only safe
  // if it gives the same answers, so the expectations here are computed from
  // React Router itself: both hooks render in the same tree and must agree.
  // This is the old frontend system's path, which is permanent and never
  // migrated, so nothing here may move.
  it.each(trees)('renders hrefs like React Router ($name)', ({ wrapper }) => {
    for (const to of targets) {
      const { result } = renderHook(
        () => ({
          routerHref: useRouterHref(to),
          appHref: useAppHref(undefined, to),
        }),
        { wrapper },
      );

      expect({ to, href: result.current.appHref }).toEqual({
        to,
        href: result.current.routerHref,
      });
    }
  });
});

describe('the framework authority', () => {
  // The framework renders an href for the page the target is written in, which
  // is the same question React Router answers, so every tree above is run
  // through it too: an app history standing at the tree's own location, and
  // the page mount a framework app would publish for the tree's shape. A
  // target that renders one href under the old frontend system and a different
  // one under the new fails here — there is no exemption list, because a
  // divergence is exactly the bug this suite exists to catch.
  it.each(trees)(
    'renders hrefs like React Router ($name)',
    ({ url, basename, pageMount, wrapper: Tree }) => {
      const appHistory = createMockAppHistory({
        initialLocation: url,
        basename,
      });
      const wrapper = ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
          <Tree>
            {pageMount ? (
              <PageMountProvider mount={pageMount}>
                {children}
              </PageMountProvider>
            ) : (
              children
            )}
          </Tree>
        </TestApiProvider>
      );

      for (const to of targets) {
        const { result } = renderHook(
          () => ({
            routerHref: useRouterHref(to),
            appHref: useAppHref(useOptionalAppHistory(), to),
          }),
          { wrapper },
        );

        expect({ to, href: result.current.appHref }).toEqual({
          to,
          href: appRootSpelling(result.current.routerHref, basename),
        });
      }
    },
  );

  // A page registered at `/catalog`, currently rendering `/catalog/foo`, in an
  // app deployed under `/backstage`.
  const PAGE_URL = '/backstage/catalog/foo';
  const pageMount: PageMount = {
    basePath: '/catalog',
    routePattern: '/catalog',
  };

  it('resolves a target against the page it is written in, chrome and content alike', () => {
    const appHistory = createMockAppHistory({
      initialLocation: PAGE_URL,
      basename: '/backstage',
    });

    /** A page's own chrome: inside the page mount, above its router adapter. */
    const chrome = ({ children }: PropsWithChildren<{}>) => (
      <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
        <MemoryRouter basename="/backstage" initialEntries={[PAGE_URL]}>
          <PageMountProvider mount={pageMount}>{children}</PageMountProvider>
        </MemoryRouter>
      </TestApiProvider>
    );

    /** A page's content: the match its adapter projects for the same mount. */
    const content = ({ children }: PropsWithChildren<{}>) => (
      <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
        <MemoryRouter basename="/backstage" initialEntries={[PAGE_URL]}>
          <Routes>
            <Route
              path="/catalog/*"
              element={
                <PageMountProvider mount={pageMount}>
                  {children}
                </PageMountProvider>
              }
            />
          </Routes>
        </MemoryRouter>
      </TestApiProvider>
    );

    /** The same page under the old frontend system. */
    const legacy = ({ children }: PropsWithChildren<{}>) => (
      <TestApiProvider apis={[]}>
        <MemoryRouter basename="/backstage" initialEntries={[PAGE_URL]}>
          <Routes>
            <Route path="/catalog/*" element={children} />
          </Routes>
        </MemoryRouter>
      </TestApiProvider>
    );

    const hrefs = (wrapper: (props: PropsWithChildren<{}>) => JSX.Element) =>
      Object.fromEntries(
        [
          '#frag',
          '?query=x',
          'sub',
          './x',
          '..',
          '/x',
          'https://example.com/x',
        ].map(to => [
          to,
          renderHook(() => useAppHref(useOptionalAppHistory(), to), { wrapper })
            .result.current,
        ]),
      );

    const onThePage = {
      // No pathname of their own, so they keep the location they were written
      // at rather than falling back to the app root.
      '#frag': '/backstage/catalog/foo#frag',
      '?query=x': '/backstage/catalog/foo?query=x',
      // Relative to the page's base, which is a segment above the location.
      sub: '/backstage/catalog/sub',
      './x': '/backstage/catalog/x',
      // The page is mounted a segment below the app root, so `..` climbs off
      // it.
      '..': '/backstage/',
      '/x': '/backstage/x',
      'https://example.com/x': 'https://example.com/x',
    };

    // The framework answers the same whether or not a React Router match
    // happens to be in context, which is what makes a page's answer
    // independent of the routing library hosting it.
    expect(hrefs(chrome)).toEqual(onThePage);
    expect(hrefs(content)).toEqual(onThePage);
    expect(hrefs(legacy)).toEqual({ ...onThePage, '..': '/backstage' });
  });

  it('climbs one match per leading `..` inside a sub-page', () => {
    const SUB_PAGE_URL = '/backstage/catalog/foo/tab-1';
    const appHistory = createMockAppHistory({
      initialLocation: SUB_PAGE_URL,
      basename: '/backstage',
    });
    const subPageMount: PageMount = {
      basePath: '/catalog/foo/tab-1',
      routePattern: '/catalog/:name/tab-1',
    };

    // The stack a sub-page runs under on the legacy path: the parent page's
    // match with the sub-page's own appended.
    const subPageTree = (element: React.ReactNode) => (
      <MemoryRouter basename="/backstage" initialEntries={[SUB_PAGE_URL]}>
        <Routes>
          <Route path="/catalog/:name" element={<Outlet />}>
            <Route path="tab-1/*" element={element} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const framework = (to: string) =>
      renderHook(() => useAppHref(useOptionalAppHistory(), to), {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
            {subPageTree(
              <PageMountProvider mount={subPageMount}>
                {children}
              </PageMountProvider>,
            )}
          </TestApiProvider>
        ),
      }).result.current;

    const legacy = (to: string) =>
      renderHook(() => useAppHref(useOptionalAppHistory(), to), {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <TestApiProvider apis={[]}>{subPageTree(children)}</TestApiProvider>
        ),
      }).result.current;

    // One `..` lands on the parent page, which is what makes a sub-page's
    // `../sibling` point at the sibling tab rather than at the app root. The
    // sub-page's pattern is its page's with `tab-1` appended, so the framework
    // reads the same boundary React Router does: the page's match ends where
    // its parameters do.
    expect(framework('..')).toBe('/backstage/catalog/foo');
    expect(framework('../tab-2')).toBe('/backstage/catalog/foo/tab-2');
    // A second `..` climbs off the page, rather than into
    // `/backstage/catalog`, which no route claims.
    expect(framework('../..')).toBe('/backstage/');
    expect(legacy('..')).toBe('/backstage/catalog/foo');
    expect(legacy('../tab-2')).toBe('/backstage/catalog/foo/tab-2');
    expect(legacy('../..')).toBe('/backstage');
  });
});

/** Both authorities for the same target, side by side on the same page. */
function LinkSeam(props: { to: string }) {
  return (
    <>
      <RouterLink to={props.to}>link</RouterLink>
      <a href={useHref(props.to)}>hook</a>
    </>
  );
}

describe('the seam between the two', () => {
  // `Link` hands an internal target to React Router's own `Link`, so on a page
  // hosted by the React Router v6 adapter the href a plugin author gets from
  // their markup is the one rendered here, while `AppRoot` injects `useHref`
  // into Backstage UI's provider and every `@backstage/ui` anchor on the same
  // page renders through that instead. Comparing the two hooks is not enough:
  // the component is a separate authority, so it is rendered beside the hook
  // in one tree and the pair have to agree, target for target.
  it.each(trees)(
    'renders the same href through a link as through the hook ($name)',
    ({ url, basename, pageMount, wrapper: Tree }) => {
      const appHistory = createMockAppHistory({
        initialLocation: url,
        basename,
      });

      for (const to of targets) {
        const view = render(
          <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
            <Tree>
              {pageMount ? (
                <PageMountProvider mount={pageMount}>
                  <LinkSeam to={to} />
                </PageMountProvider>
              ) : (
                <LinkSeam to={to} />
              )}
            </Tree>
          </TestApiProvider>,
        );
        const hrefOf = (name: string) =>
          view.getByRole('link', { name }).getAttribute('href');

        expect({ to, href: hrefOf('hook') }).toEqual({
          to,
          href: appRootSpelling(hrefOf('link')!, basename),
        });
        view.unmount();
      }
    },
  );
});

/**
 * React Router v6 beta is still a supported version — `AppManager.compat.test`
 * runs the old frontend system against both, and the migration CLI writes
 * `'6.0.0-beta.0 || ^6.3.0'` — and it exports none of the `UNSAFE_*` context
 * objects the React Router fallback in `useHref.ts` reads. Each one used to be
 * imported straight off the module, so under beta they were `undefined` when
 * handed to `useContext` and this hook could not answer at all.
 *
 * That bites hardest in the configuration the fallbacks exist for: a framework
 * app with no ambient router renders every BUI anchor's href through this
 * hook, so routerless chrome under beta went through it or nowhere. Only
 * running the suite against stable is why it shipped, so both versions run
 * here.
 *
 * The harness mirrors `AppManager.compat.test.tsx` and the beta arm of
 * `Link.test.tsx`: the module registry is reset so the hook is re-required
 * against the mocked router, and React and Testing Library are pinned to the
 * instances this file already loaded so the re-required hook still renders
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
   * The hook under test and the page mount provider it reads, both out of the
   * registry the mocks apply to. The mount context itself is a
   * `@backstage/version-bridge` global singleton, so the provider is the same
   * object either registry hands back — requiring it here only keeps the two
   * halves of the tree consistent.
   */
  function requireVersioned() {
    return {
      ...(require('./useHref') as typeof import('./useHref')),
      ...(require('@internal/frontend') as typeof import('@internal/frontend')),
    };
  }

  it('renders hrefs from the app history with no router at all', () => {
    const versioned = requireVersioned();

    // A page registered at `/catalog`, currently rendering `/catalog/foo`, in
    // an app deployed under `/backstage`, with no React Router anywhere — the
    // shape a `RouterBlueprint` passthrough or a `createSpecializedApp` without
    // `@backstage/plugin-app` leaves behind.
    const appHistory = createMockAppHistory({
      initialLocation: '/backstage/catalog/foo',
      basename: '/backstage',
    });
    const mount: PageMount = { basePath: '/catalog', routePattern: '/catalog' };
    const wrapper = ({ children }: PropsWithChildren<{}>) => (
      <versioned.PageMountProvider mount={mount}>
        {children}
      </versioned.PageMountProvider>
    );
    const href = (to: string) =>
      renderHook(() => versioned.useAppHref(appHistory, to), { wrapper }).result
        .current;

    // The answers the framework authority gives above, unchanged: targets with
    // no pathname of their own keep the location they were written at,
    // relative ones resolve against the page's base, `..` climbs off the page,
    // and the deploy basename is applied on the way out. Rendering any of them
    // runs the vendored `parsePath`, `createPath` and `resolvePath`, none of
    // which the beta exports.
    expect({
      '#frag': href('#frag'),
      '?query=x': href('?query=x'),
      sub: href('sub'),
      './x': href('./x'),
      '..': href('..'),
      '/x': href('/x'),
      'https://example.com/x': href('https://example.com/x'),
    }).toEqual({
      '#frag': '/backstage/catalog/foo#frag',
      '?query=x': '/backstage/catalog/foo?query=x',
      sub: '/backstage/catalog/sub',
      './x': '/backstage/catalog/x',
      '..': '/backstage/',
      '/x': '/backstage/x',
      'https://example.com/x': 'https://example.com/x',
    });
  });

  it('hands the target back with neither authority present', () => {
    const versioned = requireVersioned();
    const { result } = renderHook(() => ({
      href: versioned.useAppHref(undefined, '/catalog'),
      fragmentHref: versioned.useAppHref(undefined, '#section'),
      externalHref: versioned.useAppHref(
        undefined,
        'mailto:someone@example.com',
      ),
    }));

    // The stand-in contexts report no router under beta, and under stable
    // there is no router in this tree to report one.
    expect(result.current.href).toBe('/catalog');
    expect(result.current.fragmentHref).toBe('#section');
    expect(result.current.externalHref).toBe('mailto:someone@example.com');
  });
});
