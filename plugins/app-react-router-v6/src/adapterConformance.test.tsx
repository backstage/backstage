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

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { testPageRouter } from '../../../packages/frontend-test-utils/src/__testUtils__/testPageRouter';
import { useContext, useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import {
  Link,
  MemoryRouter,
  Route,
  Routes,
  UNSAFE_RouteContext,
  useHref,
  useParams,
  useResolvedPath,
  useSearchParams,
} from 'react-router-dom';
import { ReactRouterV6PageRouter } from './ReactRouterV6PageRouter';
import { createScopedRouter } from './createScopedRouter';

/**
 * Page router adapter conformance.
 *
 * Exercises framework-selected subpages, navigation, and state preservation
 * with this library's adapter. Each adapter package keeps its own library
 * imports and matching probes.
 *
 * What a library does *inside* a page is the library's own business, so that
 * half is not hand-asserted: the second block below renders the same probe
 * under this adapter and under a real `react-router-dom` tree of the same
 * shape, and requires them to agree. That is what pins `pathname` /
 * `pathnameBase` / `route.path` in the injected route context to what React
 * Router itself would have produced, rather than to whatever an adapter
 * happened to pass.
 */

/**
 * The page content, written with this adapter's routing library. Carries a
 * piece of in-page state that a remount would reset, what the library makes
 * of the current search params, a relative link, and a nested route one level
 * deeper than the sub-page itself.
 */
function SubPageProbe(props: { name: string }) {
  const [bumped, setBumped] = useState(0);
  const [searchParams] = useSearchParams();
  return (
    <div>
      <span data-testid="sub-page">{props.name}</span>
      <span data-testid="bumped">{bumped}</span>
      <span data-testid="lib-query">{searchParams.get('q') ?? ''}</span>
      <button type="button" onClick={() => setBumped(n => n + 1)}>
        Bump
      </button>
      <Link to="./deep">Deep</Link>
      <Routes>
        <Route path="deep" element={<span data-testid="deep">deep</span>} />
      </Routes>
    </div>
  );
}

testPageRouter({
  name: 'React Router v6',
  PageRouter: ReactRouterV6PageRouter,
  SubPageProbe,
});

/**
 * The injected route context, compared against the real thing.
 *
 * Both sides render the same probe: once under this adapter, once under a
 * `<Route path={`${pattern}/*`}>` in a real router at the same URL. Anything
 * the adapter gets wrong about the match — the splat tail, which prefix
 * relative targets resolve against, whether descendant `<Routes>` see a
 * splat parent — shows up as a difference rather than as a plausible-looking
 * expectation nobody rechecks.
 */
const ROUTE_PATTERN = '/catalog/:namespace/:kind/:name';
const BASE_PATH = '/catalog/default/component/foo';

function ContextProbe() {
  const params = useParams();
  // The match stack itself, not just what the hooks make of it. `route.path`
  // in particular is only observable indirectly — a pattern that lost its
  // trailing splat still resolves relative targets and still matches
  // descendant `<Routes>`, and only tells React Router apart from the adapter
  // by way of a console warning nobody reads. Comparing the stack against the
  // real tree pins it.
  const { matches } = useContext(UNSAFE_RouteContext);
  return (
    <div>
      <span data-testid="dot">{useResolvedPath('./create').pathname}</span>
      <span data-testid="up">{useResolvedPath('../sibling').pathname}</span>
      <span data-testid="bare">{useResolvedPath('create').pathname}</span>
      <span data-testid="href">{useHref('./create')}</span>
      <span data-testid="params">{JSON.stringify(params)}</span>
      <span data-testid="matches">
        {JSON.stringify(
          matches.map(match => [
            match.pathname,
            match.pathnameBase,
            match.route.path,
          ]),
        )}
      </span>
      <Routes>
        <Route
          path="overview/*"
          element={<span data-testid="nested">nested</span>}
        />
      </Routes>
    </div>
  );
}

function readContextProbe() {
  return {
    dot: screen.getByTestId('dot').textContent,
    up: screen.getByTestId('up').textContent,
    bare: screen.getByTestId('bare').textContent,
    href: screen.getByTestId('href').textContent,
    params: screen.getByTestId('params').textContent,
    matches: screen.getByTestId('matches').textContent,
    nested: screen.queryByTestId('nested')?.textContent ?? 'no-match',
  };
}

describe(`React Router v6 route context matches a real router tree`, () => {
  it.each([
    ['at the page root', BASE_PATH],
    ['at a sub-page', `${BASE_PATH}/overview`],
    ['below a sub-page', `${BASE_PATH}/overview/deep`],
  ])('%s', (_name, url) => {
    const real = render(
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path={`${ROUTE_PATTERN}/*`} element={<ContextProbe />} />
        </Routes>
      </MemoryRouter>,
    );
    const expected = readContextProbe();
    real.unmount();

    const appHistory = createMockAppHistory({ initialLocation: url });
    const { Router } = createScopedRouter(appHistory, {
      routePattern: ROUTE_PATTERN,
    });
    render(
      <Router>
        <ContextProbe />
      </Router>,
    );

    expect(readContextProbe()).toEqual(expected);
  });

  it('should follow app history and fall back to a neutral context off the page', () => {
    const appHistory = createMockAppHistory({
      initialLocation: `${BASE_PATH}/overview`,
    });
    const { Router } = createScopedRouter(appHistory, {
      routePattern: ROUTE_PATTERN,
    });

    render(
      <Router>
        <ContextProbe />
      </Router>,
    );

    expect(screen.getByTestId('params')).toHaveTextContent('"name":"foo"');
    expect(screen.getByTestId('nested')).toBeInTheDocument();

    act(() => {
      appHistory.navigate(`${BASE_PATH}/settings`);
    });

    expect(screen.queryByTestId('nested')).not.toBeInTheDocument();
    expect(screen.getByTestId('params')).toHaveTextContent('"*":"settings"');

    // Off the page entirely — a real router would not have rendered the page
    // at this location, so the honest answer is the neutral no-route context
    // rather than an invented match that leaks a stale prefix. Anchored,
    // because the failure this guards against is a *longer* pathname with the
    // stale prefix still on the front, which a substring match would accept.
    act(() => {
      appHistory.navigate('/elsewhere');
    });

    expect(screen.getByTestId('params')).toHaveTextContent('{}');
    expect(screen.getByTestId('matches')).toHaveTextContent(/^\[\]$/);
    expect(screen.getByTestId('dot')).toHaveTextContent(/^\/create$/);
  });
});
