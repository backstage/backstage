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

import { useContext, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import {
  MemoryRouter,
  NavigationType,
  Route,
  Routes,
  UNSAFE_LocationContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
  matchPath,
  useLocation,
  useNavigate,
  useParams,
  useResolvedPath,
  useSearchParams,
} from 'react-router-dom';
import {
  createAppHistoryRouter,
  type ReactRouterAdapterBindings,
} from './createAppHistoryRouter';

const v6Bindings: ReactRouterAdapterBindings = {
  NavigationType,
  matchPath: matchPath as ReactRouterAdapterBindings['matchPath'],
  UNSAFE_NavigationContext:
    UNSAFE_NavigationContext as ReactRouterAdapterBindings['UNSAFE_NavigationContext'],
  UNSAFE_LocationContext:
    UNSAFE_LocationContext as ReactRouterAdapterBindings['UNSAFE_LocationContext'],
  UNSAFE_RouteContext:
    UNSAFE_RouteContext as ReactRouterAdapterBindings['UNSAFE_RouteContext'],
  useLocation: useLocation as ReactRouterAdapterBindings['useLocation'],
  useNavigate: useNavigate as ReactRouterAdapterBindings['useNavigate'],
  useParams: useParams as ReactRouterAdapterBindings['useParams'],
  useSearchParams,
};

/** The v6 default: relative targets resolve against the leaf `pathnameBase`. */
const V6_EXTRAS = { future: { v7_relativeSplatPath: false } };

function routerAt(initialLocation: string, routePattern?: string) {
  return createAppHistoryRouter(
    v6Bindings,
    createMockAppHistory({ initialLocation }),
    { routePattern, navigationContextExtras: V6_EXTRAS },
  );
}

const PAGE_PATTERN = '/things/:id';
const SUB_PAGE_PATTERN = `${PAGE_PATTERN}/overview`;

/**
 * What the route context in scope resolves to, plus the parts of the match
 * stack that produced it.
 */
function Probe() {
  const { matches } = useContext(UNSAFE_RouteContext);
  return (
    <div>
      <span data-testid="up">{useResolvedPath('..').pathname}</span>
      <span data-testid="up-sibling">
        {useResolvedPath('../settings').pathname}
      </span>
      <span data-testid="dot">{useResolvedPath('.').pathname}</span>
      <span data-testid="dot-child">{useResolvedPath('./child').pathname}</span>
      <span data-testid="bases">
        {matches.map(match => match.pathnameBase).join(' ')}
      </span>
      <span data-testid="params">{JSON.stringify(useParams())}</span>
      <Routes>
        <Route path="deep" element={<span data-testid="nested">nested</span>} />
      </Routes>
    </div>
  );
}

function readProbe() {
  return {
    up: screen.getByTestId('up').textContent,
    upSibling: screen.getByTestId('up-sibling').textContent,
    dot: screen.getByTestId('dot').textContent,
    dotChild: screen.getByTestId('dot-child').textContent,
    bases: screen.getByTestId('bases').textContent,
    params: screen.getByTestId('params').textContent,
    nested: screen.queryByTestId('nested')?.textContent ?? 'no-match',
  };
}

function readOnce(element: ReactNode) {
  const { unmount } = render(<>{element}</>);
  const probe = readProbe();
  unmount();
  return probe;
}

describe('createAppHistoryRouter', () => {
  /**
   * A sub-page is a mount inside its parent page's mount, which is two route
   * matches deep in React Router's terms. The oracle is the real thing: the
   * same probe under a `<Routes>` nested in a `<Routes>` at the same URL, which
   * is what the identical content composed with plain React Router gets. Both
   * shapes a sub-page is actually rendered in — handed straight to its own
   * router, and dispatched to by the parent adapter's `<Routes>` first — have
   * to agree with it, or two sibling composition mechanisms disagree about the
   * same relative target.
   */
  it.each([
    ['at the sub-page root', '/things/alpha/overview'],
    ['below the sub-page', '/things/alpha/overview/deep'],
  ])('should compose with the surrounding route context %s', (_name, url) => {
    const expected = readOnce(
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route
            path={`${PAGE_PATTERN}/*`}
            element={
              <Routes>
                <Route path="overview/*" element={<Probe />} />
              </Routes>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    const page = routerAt(url, PAGE_PATTERN);
    const subPage = routerAt(url, SUB_PAGE_PATTERN);

    expect(
      readOnce(
        <page.Router>
          <subPage.Router>
            <Probe />
          </subPage.Router>
        </page.Router>,
      ),
    ).toEqual(expected);

    expect(
      readOnce(
        <page.Router>
          <Routes>
            <Route
              path="overview/*"
              element={
                <subPage.Router>
                  <Probe />
                </subPage.Router>
              }
            />
          </Routes>
        </page.Router>,
      ),
    ).toEqual(expected);
  });

  it('should publish the page match alone at page scope, and nothing off the mount or at app root scope', () => {
    const page = routerAt('/things/alpha/overview', PAGE_PATTERN);

    // App chrome publishes no matches, so a page is the root of its own stack
    // and `..` leaves the page — exactly as a `<Route>` at the top of a real
    // router tree behaves.
    expect(
      readOnce(
        <page.Router>
          <Probe />
        </page.Router>,
      ),
    ).toEqual({
      up: '/',
      upSibling: '/settings',
      dot: '/things/alpha',
      dotChild: '/things/alpha/child',
      bases: '/things/alpha',
      params: JSON.stringify({ id: 'alpha', '*': 'overview' }),
      nested: 'no-match',
    });

    // A sub-page router whose location has moved off its own mount has no
    // match to project, and must not fall back to the ancestors it would
    // otherwise have carried over — that would leak a stale prefix back out.
    const offMount = routerAt('/things/alpha/settings', SUB_PAGE_PATTERN);
    expect(
      readOnce(
        <page.Router>
          <offMount.Router>
            <Probe />
          </offMount.Router>
        </page.Router>,
      ),
    ).toEqual(
      expect.objectContaining({ bases: '', up: '/', dot: '/', params: '{}' }),
    );

    // App root scope has no route to be mounted under at all.
    const chrome = routerAt('/things/alpha/overview');
    expect(
      readOnce(
        <chrome.Router>
          <Probe />
        </chrome.Router>,
      ),
    ).toEqual(expect.objectContaining({ bases: '', dot: '/' }));
  });

  it('should keep the projected match the splat pattern rooted at its own base', () => {
    const page = routerAt('/things/alpha/overview/deep', PAGE_PATTERN);
    const subPage = routerAt('/things/alpha/overview/deep', SUB_PAGE_PATTERN);

    function StackProbe() {
      const { matches } = useContext(UNSAFE_RouteContext);
      return (
        <span data-testid="stack">
          {JSON.stringify(
            matches.map(match => [
              match.pathname,
              match.pathnameBase,
              match.route.path,
            ]),
          )}
        </span>
      );
    }

    render(
      <page.Router>
        <subPage.Router>
          <StackProbe />
        </subPage.Router>
      </page.Router>,
    );

    // `pathnameBase` always comes from the match rather than from a separately
    // supplied base path, and `route.path` is the splat pattern so descendant
    // `<Routes>` see a splat parent.
    expect(JSON.parse(screen.getByTestId('stack').textContent!)).toEqual([
      ['/things/alpha/overview/deep', '/things/alpha', '/things/:id/*'],
      [
        '/things/alpha/overview/deep',
        '/things/alpha/overview',
        '/things/:id/overview/*',
      ],
    ]);
  });
});
