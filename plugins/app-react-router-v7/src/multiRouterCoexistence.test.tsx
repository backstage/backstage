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

import path from 'node:path';
import { act, screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  PageBlueprint,
  RouteLink,
  SubPageBlueprint,
  appHistoryApiRef,
  createFrontendPlugin,
  createRouteRef,
  useApi,
  useAppNavigate,
  useHref as useFrameworkHref,
} from '@backstage/frontend-plugin-api';
import { useAppHistoryLocation, usePageMount } from '@internal/frontend';
import { Link, useLocation, useResolvedPath } from 'react-router';
import { ReactRouterV6PageRouter } from '@backstage/plugin-app-react-router-v6';
import { ReactRouterV7PageRouter } from './ReactRouterV7PageRouter';

/**
 * React Router v6, resolved the way the v6 adapter itself resolves it.
 *
 * A bare `import ... from 'react-router-dom'` in this file is v7, because that
 * is what the specifier means from inside this package — which is what makes
 * the v7 half of these tests genuinely v7. It also used to mean the v6 half
 * could only be probed through framework APIs, since there was no way to spell
 * "the other one" from here.
 *
 * Resolving from the v6 adapter package's own directory is that spelling.
 * Module resolution starts in `ReactRouterV6PageRouter`'s directory, so this
 * is the very module instance the adapter binds its contexts from,
 * not a lookalike — the same file, and therefore the same entry in the module
 * registry. Deriving the directory from the package rather than writing a path
 * through `node_modules` keeps it true whichever copy hoisting puts where.
 */
const reactRouterV6 = require(require.resolve('react-router-dom', {
  paths: [
    path.dirname(
      require.resolve('@backstage/plugin-app-react-router-v6/package.json'),
    ),
  ],
})) as typeof import('react-router-dom');

/**
 * Prove the RR v6 and RR v7 adapters coexist on the wired path (AppRouteSwitch
 * + memory-history harness).
 *
 * Each page and sub-page declares its own adapter inside the loader, while
 * the framework retains a root v6 context for shared UI. The nesting case
 * verifies that both libraries keep their own page matches.
 *
 * Lives here so the v7 pages can import React Router v7 APIs. `react-router`
 * resolves to v7 from inside this package, so the v6 half is probed through
 * framework APIs rather than v6 hooks wherever framework APIs can answer the
 * question. The v6 adapter itself resolves its own copy from where it lives,
 * so it is really v6 that is running here.
 *
 * The one question framework APIs cannot answer is whether v6's own hooks
 * still work with a v7 adapter above them, which is why `reactRouterV6` below
 * reaches for the v6 copy explicitly. Both nesting orders are covered as a
 * result: v7 inside v6, and v6 inside v7.
 */
describe('multi-router coexistence', () => {
  const catalogRouteRef = createRouteRef();
  const settingsRouteRef = createRouteRef();

  it('should coexist as peer pages, each declaring its own adapter', async () => {
    const CatalogV6Page = () => {
      const location = useAppHistoryLocation(useApi(appHistoryApiRef));
      return (
        <div data-testid="catalog-page">
          <div data-testid="adapter">v6</div>
          <div data-testid="pathname">{location?.pathname}</div>
          <RouteLink routeRef={settingsRouteRef} data-testid="to-settings">
            Settings (v7)
          </RouteLink>
        </div>
      );
    };

    const SettingsV7Page = () => {
      const location = useLocation();
      return (
        <div data-testid="settings-page">
          <div data-testid="adapter">v7</div>
          <div data-testid="pathname">{location.pathname}</div>
          <Link to="./general" data-testid="in-plugin-general">
            General
          </Link>
          <RouteLink routeRef={catalogRouteRef} data-testid="to-catalog">
            Catalog (v6)
          </RouteLink>
        </div>
      );
    };

    const catalogPlugin = createFrontendPlugin({
      pluginId: 'catalog-pudding',
      routes: { root: catalogRouteRef },
      extensions: [
        PageBlueprint.make({
          name: 'index',
          params: {
            path: '/catalog-pudding',
            routeRef: catalogRouteRef,
            loader: async () => (
              <ReactRouterV6PageRouter>
                <CatalogV6Page />
              </ReactRouterV6PageRouter>
            ),
          },
        }),
      ],
    });

    const settingsPlugin = createFrontendPlugin({
      pluginId: 'settings-pudding',
      routes: { root: settingsRouteRef },
      extensions: [
        PageBlueprint.make({
          name: 'index',
          params: {
            path: '/settings-pudding',
            routeRef: settingsRouteRef,
            loader: async () => (
              <ReactRouterV7PageRouter>
                <SettingsV7Page />
              </ReactRouterV7PageRouter>
            ),
          },
        }),
      ],
    });

    const { appHistory } = renderTestApp({
      features: [catalogPlugin, settingsPlugin],
      initialRouteEntries: ['/catalog-pudding'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6');
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/catalog-pudding',
      );
    });

    await act(async () => {
      screen.getByTestId('to-settings').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v7');
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/settings-pudding',
      );
    });

    await act(async () => {
      screen.getByTestId('in-plugin-general').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/settings-pudding/general',
      );
      expect(screen.getByTestId('adapter')).toHaveTextContent('v7');
    });

    await act(async () => {
      screen.getByTestId('to-catalog').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6');
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/catalog-pudding',
      );
    });

    // AppHistoryApi has no programmatic `go` — navigate directly instead.
    await act(async () => {
      appHistory.navigate('/settings-pudding/general');
    });

    await waitFor(() => {
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v7');
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/settings-pudding/general',
      );
    });

    await act(async () => {
      appHistory.navigate('/settings-pudding');
    });

    await waitFor(() => {
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/settings-pudding',
      );
    });

    await act(async () => {
      appHistory.navigate('/catalog-pudding');
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6');
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/catalog-pudding',
      );
    });

    await act(async () => {
      appHistory.navigate('/settings-pudding');
    });

    await waitFor(() => {
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v7');
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/settings-pudding',
      );
    });
  });

  it('should mix a v7 sub-page and a v6 sub-page under one page', async () => {
    // A tabbed page owns no content region of its own and so declares no
    // adapter — each sub-page picks its own library, and tabbing between them
    // exercises the pairing in both directions.
    const homeRouteRef = createRouteRef();

    const HomeV6Page = () => {
      const location = useAppHistoryLocation(useApi(appHistoryApiRef));
      const navigate = useAppNavigate();
      return (
        <div data-testid="home-page">
          <div data-testid="adapter">v6</div>
          <div data-testid="pathname">{location?.pathname}</div>
          <button
            type="button"
            data-testid="to-tree"
            onClick={() => navigate('/visualizer-pudding/tree')}
          >
            Tree subpage
          </button>
        </div>
      );
    };

    const TreeV7SubPage = () => {
      const location = useLocation();
      const pageMount = usePageMount();
      return (
        <div data-testid="tree-subpage">
          <div data-testid="adapter">v7</div>
          <div data-testid="pathname">{location.pathname}</div>
          <div data-testid="contract-base">{pageMount?.basePath}</div>
          {/* The sibling tab is routed by the v6 adapter it declared for
              itself, so there is no v7 route context around this one to
              inherit — and `..` still has to mean the page, not the app
              root. */}
          <div data-testid="up">{useResolvedPath('..').pathname}</div>
          <Link to="../graph" data-testid="to-graph">
            Graph tab
          </Link>
          <RouteLink routeRef={homeRouteRef} data-testid="to-home">
            Home (v6)
          </RouteLink>
        </div>
      );
    };

    const homePage = PageBlueprint.make({
      name: 'home',
      params: {
        path: '/home-pudding',
        routeRef: homeRouteRef,
        loader: async () => (
          <ReactRouterV6PageRouter>
            <HomeV6Page />
          </ReactRouterV6PageRouter>
        ),
      },
    });

    const visualizerPage = PageBlueprint.make({
      name: 'visualizer',
      params: {
        path: '/visualizer-pudding',
        title: 'Visualizer',
      },
    });

    const treeSubPage = SubPageBlueprint.make({
      name: 'tree',
      attachTo: { id: 'page:test/visualizer', input: 'pages' },
      params: {
        path: 'tree',
        title: 'Tree',
        loader: async () => (
          <ReactRouterV7PageRouter>
            <TreeV7SubPage />
          </ReactRouterV7PageRouter>
        ),
      },
    });

    const graphSubPage = SubPageBlueprint.make({
      name: 'graph',
      attachTo: { id: 'page:test/visualizer', input: 'pages' },
      params: {
        path: 'graph',
        title: 'Graph',
        loader: async () => (
          <ReactRouterV6PageRouter>
            <div data-testid="graph-subpage">Graph</div>
          </ReactRouterV6PageRouter>
        ),
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [homePage, visualizerPage, treeSubPage, graphSubPage],
      initialRouteEntries: ['/home-pudding'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6');
    });

    await act(async () => {
      screen.getByTestId('to-tree').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('tree-subpage')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v7');
      expect(screen.getByTestId('contract-base').textContent).toBe(
        '/visualizer-pudding/tree',
      );
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/visualizer-pudding/tree',
      );
    });

    // Crossing libraries at the sub-page boundary must not move where a
    // relative target lands: `..` is the page above, and the sibling tab href
    // has to be followable.
    expect(screen.getByTestId('up').textContent).toBe('/visualizer-pudding');
    expect(screen.getByTestId('to-graph')).toHaveAttribute(
      'href',
      '/visualizer-pudding/graph',
    );

    await act(async () => {
      screen.getByTestId('to-graph').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('graph-subpage')).toBeInTheDocument();
      expect(appHistory.location.pathname).toBe('/visualizer-pudding/graph');
    });
    expect(screen.queryByTestId('tree-subpage')).not.toBeInTheDocument();

    await act(async () => {
      appHistory.navigate('/visualizer-pudding/tree');
    });
    await waitFor(() => {
      expect(screen.getByTestId('tree-subpage')).toBeInTheDocument();
    });

    await act(async () => {
      screen.getByTestId('to-home').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6');
      expect(screen.getByTestId('pathname').textContent).toBe('/home-pudding');
    });

    // AppHistoryApi has no programmatic `go` — navigate directly instead.
    await act(async () => {
      appHistory.navigate('/visualizer-pudding/tree');
    });

    await waitFor(() => {
      expect(screen.getByTestId('tree-subpage')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v7');
    });

    await act(async () => {
      appHistory.navigate('/home-pudding');
    });

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6');
    });
  });

  it('should nest a v7 context inside a v6 one without either being displaced', async () => {
    // Adapters are added, not selected: an outer adapter from another library
    // publishes a different React context object, so it can neither answer nor
    // swallow the inner one's hooks. The old framework picked exactly one
    // adapter per page, which is precisely what this case would have caught.
    const NestedProbe = () => {
      const location = useLocation();
      const mount = usePageMount();
      return (
        <div data-testid="nested-probe">
          {/* Answered by the inner v7 adapter, scoped to the page mount. */}
          <span data-testid="v7-pathname">{location.pathname}</span>
          <span data-testid="mount-base">{mount?.basePath}</span>
          <Link to="./deep" data-testid="v7-relative">
            Deep
          </Link>
        </div>
      );
    };

    const nestedPage = PageBlueprint.make({
      name: 'nested',
      params: {
        path: '/nested/:id',
        loader: async () => (
          <ReactRouterV6PageRouter>
            <div data-testid="outer-v6">
              <ReactRouterV7PageRouter>
                <NestedProbe />
              </ReactRouterV7PageRouter>
            </div>
          </ReactRouterV6PageRouter>
        ),
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [nestedPage],
      initialRouteEntries: ['/nested/alpha'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('nested-probe')).toBeInTheDocument();
    });
    // The outer v6 adapter is still on screen, and the inner v7 one still
    // answers with the page's own location rather than the app root.
    expect(screen.getByTestId('outer-v6')).toContainElement(
      screen.getByTestId('nested-probe'),
    );
    expect(screen.getByTestId('v7-pathname').textContent).toBe('/nested/alpha');
    expect(screen.getByTestId('mount-base').textContent).toBe('/nested/alpha');
    expect(screen.getByTestId('v7-relative')).toHaveAttribute(
      'href',
      '/nested/alpha/deep',
    );

    // The same page at a different concrete prefix: neither adapter is torn
    // down, and the inner one follows the app history.
    await act(async () => {
      appHistory.navigate('/nested/beta');
    });

    await waitFor(() => {
      expect(screen.getByTestId('v7-pathname').textContent).toBe(
        '/nested/beta',
      );
    });
    expect(screen.getByTestId('outer-v6')).toContainElement(
      screen.getByTestId('nested-probe'),
    );
  });

  it('should nest a v6 context inside a v7 one without either being displaced', async () => {
    // The other order, which matters on its own rather than by symmetry: the
    // two adapters are different code, projecting different context objects,
    // and only in this direction is the *inner* one the one that has to find
    // an ancestor route context it cannot read. Whichever library is outside,
    // the inner adapter derives its match from the framework's page mount and
    // the live location, so its answer must not depend on who is above it.
    const NestedProbe = () => {
      const v6Params = reactRouterV6.useParams();
      const v6Resolved = reactRouterV6.useResolvedPath('deep').pathname;
      const v7Location = useLocation();
      const mount = usePageMount();
      return (
        <div data-testid="nested-probe">
          {/* Answered by the inner v6 adapter, scoped to the page mount. */}
          <span data-testid="v6-id">{v6Params.id}</span>
          <span data-testid="v6-resolved">{v6Resolved}</span>
          {/* The outer v7 adapter is still answering its own hooks. */}
          <span data-testid="v7-pathname">{v7Location.pathname}</span>
          <span data-testid="mount-base">{mount?.basePath}</span>
        </div>
      );
    };

    const nestedPage = PageBlueprint.make({
      name: 'nested-reverse',
      params: {
        path: '/nested-reverse/:id',
        loader: async () => (
          <ReactRouterV7PageRouter>
            <div data-testid="outer-v7">
              <ReactRouterV6PageRouter>
                <NestedProbe />
              </ReactRouterV6PageRouter>
            </div>
          </ReactRouterV7PageRouter>
        ),
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [nestedPage],
      initialRouteEntries: ['/nested-reverse/alpha'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('nested-probe')).toBeInTheDocument();
    });
    expect(screen.getByTestId('outer-v7')).toContainElement(
      screen.getByTestId('nested-probe'),
    );
    expect(screen.getByTestId('v6-id').textContent).toBe('alpha');
    expect(screen.getByTestId('v6-resolved').textContent).toBe(
      '/nested-reverse/alpha/deep',
    );
    expect(screen.getByTestId('v7-pathname').textContent).toBe(
      '/nested-reverse/alpha',
    );
    expect(screen.getByTestId('mount-base').textContent).toBe(
      '/nested-reverse/alpha',
    );

    // The same page at a different concrete prefix: neither adapter is torn
    // down, and both follow the app history together.
    await act(async () => {
      appHistory.navigate('/nested-reverse/beta');
    });

    await waitFor(() => {
      expect(screen.getByTestId('v6-id').textContent).toBe('beta');
    });
    expect(screen.getByTestId('v6-resolved').textContent).toBe(
      '/nested-reverse/beta/deep',
    );
    expect(screen.getByTestId('v7-pathname').textContent).toBe(
      '/nested-reverse/beta',
    );
    expect(screen.getByTestId('outer-v7')).toContainElement(
      screen.getByTestId('nested-probe'),
    );
  });

  /**
   * Where a target written at sub-page depth lands, with the two React Router
   * majors as the mixed pair.
   *
   * The page above a tab owns no content region and so declares no adapter,
   * which means the mount it contributes is published by nobody: the tab's own
   * adapter finds no route context above it to climb through, whichever major
   * the *other* tab happens to use. The framework's chain of page mounts is
   * what stands in — `projectAncestorMounts` in `createAppHistoryRouter` — and
   * it is what decides whether the page's segment appears in the answer once,
   * twice, or not at all.
   *
   * Both majors share that projection but not their contexts, so this asks the
   * same question of each: a target below, the climb to the page, and a target
   * that spells the page's own segment, cross-checked against the framework's
   * own `useHref`, which walks page mounts with no routing library at all.
   */
  describe('where a target written at sub-page depth lands', () => {
    const PAGE_PATTERN = '/catalog-majors';

    /**
     * The same three answers from whichever copy of React Router is passed in,
     * plus the framework's answer to the same target.
     */
    function TargetProbe(props: {
      testId: string;
      selfSegment: string;
      useResolved: (to: string) => { pathname: string };
    }) {
      const { testId, selfSegment, useResolved } = props;
      return (
        <div data-testid={testId}>
          <span data-testid={`${testId}-below`}>
            {useResolved('edit').pathname}
          </span>
          <span data-testid={`${testId}-up`}>{useResolved('..').pathname}</span>
          <span data-testid={`${testId}-self-naming`}>
            {useResolved(selfSegment).pathname}
          </span>
          <span data-testid={`${testId}-framework-href`}>
            {useFrameworkHref('edit')}
          </span>
        </div>
      );
    }

    function renderCatalogMajors(initialPath: string) {
      const catalogPage = PageBlueprint.make({
        name: 'catalog-majors',
        params: { path: PAGE_PATTERN, title: 'Catalog' },
      });

      const overviewSubPage = SubPageBlueprint.make({
        name: 'overview',
        attachTo: { id: 'page:test/catalog-majors', input: 'pages' },
        params: {
          path: 'overview',
          title: 'Overview',
          loader: async () => (
            <ReactRouterV7PageRouter>
              <TargetProbe
                testId="v7-probe"
                selfSegment="catalog-majors"
                useResolved={useResolvedPath}
              />
            </ReactRouterV7PageRouter>
          ),
        },
      });

      const createSubPage = SubPageBlueprint.make({
        name: 'create',
        attachTo: { id: 'page:test/catalog-majors', input: 'pages' },
        params: {
          path: 'create',
          title: 'Create',
          loader: async () => (
            <ReactRouterV6PageRouter>
              <TargetProbe
                testId="v6-probe"
                selfSegment="catalog-majors"
                useResolved={reactRouterV6.useResolvedPath}
              />
            </ReactRouterV6PageRouter>
          ),
        },
      });

      // A page that owns its whole content region: the same probe one mount
      // shallower, so the extra segment above is visibly the sub-page's.
      const toolsPage = PageBlueprint.make({
        name: 'tools-majors',
        params: {
          path: '/tools-majors',
          loader: async () => (
            <ReactRouterV7PageRouter>
              <TargetProbe
                testId="v7-probe"
                selfSegment="tools-majors"
                useResolved={useResolvedPath}
              />
            </ReactRouterV7PageRouter>
          ),
        },
      });

      return renderTestApp({
        extensions: [catalogPage, overviewSubPage, createSubPage, toolsPage],
        initialRouteEntries: [initialPath],
      });
    }

    it('should resolve v7 and v6 sub-page targets alike against the page and the sub-page', async () => {
      // The two copies have to be two copies. Everything below is a comparison
      // between them, and a single shared instance would agree with itself no
      // matter what the projection did.
      expect(reactRouterV6.useResolvedPath).not.toBe(useResolvedPath);

      const { appHistory } = renderCatalogMajors('/catalog-majors/overview');

      await waitFor(() => {
        expect(screen.getByTestId('v7-probe')).toBeInTheDocument();
      });

      // The v7 tab: below lands under both segments, the climb stops at the
      // page rather than the app root, and asking for the page's own segment
      // by name appends it instead of re-applying the mount.
      expect(screen.getByTestId('v7-probe-below').textContent).toBe(
        '/catalog-majors/overview/edit',
      );
      expect(screen.getByTestId('v7-probe-up').textContent).toBe(
        '/catalog-majors',
      );
      expect(screen.getByTestId('v7-probe-self-naming').textContent).toBe(
        '/catalog-majors/overview/catalog-majors',
      );
      expect(screen.getByTestId('v7-probe-framework-href').textContent).toBe(
        '/catalog-majors/overview/edit',
      );

      // The sibling tab, routed by the other major. The page above published
      // no v6 context on the way here — the tab that published anything was
      // v7's — so these answers come from the mount chain.
      await act(async () => {
        appHistory.navigate('/catalog-majors/create');
      });

      await waitFor(() => {
        expect(screen.getByTestId('v6-probe')).toBeInTheDocument();
      });
      expect(screen.queryByTestId('v7-probe')).not.toBeInTheDocument();
      expect(screen.getByTestId('v6-probe-below').textContent).toBe(
        '/catalog-majors/create/edit',
      );
      expect(screen.getByTestId('v6-probe-up').textContent).toBe(
        '/catalog-majors',
      );
      expect(screen.getByTestId('v6-probe-self-naming').textContent).toBe(
        '/catalog-majors/create/catalog-majors',
      );
      expect(screen.getByTestId('v6-probe-framework-href').textContent).toBe(
        '/catalog-majors/create/edit',
      );

      // The control: a page's own content, one mount shallower. Every answer
      // is the sub-page answer with the sub-page's segment removed, which is
      // what says the segment came from the sub-page mount and not from the
      // page's pattern being applied twice.
      await act(async () => {
        appHistory.navigate('/tools-majors');
      });

      await waitFor(() => {
        expect(screen.getByTestId('v7-probe')).toBeInTheDocument();
      });
      expect(screen.getByTestId('v7-probe-below').textContent).toBe(
        '/tools-majors/edit',
      );
      expect(screen.getByTestId('v7-probe-up').textContent).toBe('/');
      expect(screen.getByTestId('v7-probe-self-naming').textContent).toBe(
        '/tools-majors/tools-majors',
      );
      expect(screen.getByTestId('v7-probe-framework-href').textContent).toBe(
        '/tools-majors/edit',
      );
    });
  });
});
