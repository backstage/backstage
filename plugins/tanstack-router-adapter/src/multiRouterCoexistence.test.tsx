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

import { useCallback, useSyncExternalStore } from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  PageBlueprint,
  PageRouterBlueprint,
  RouteLink,
  SubPageBlueprint,
  appHistoryApiRef,
  createFrontendPlugin,
  createRouteRef,
  useApi,
  useAppNavigate,
} from '@backstage/frontend-plugin-api';
import { useLocation as useTanStackLocation } from '@tanstack/react-router';
import { TanStackPageRouter } from './TanStackPageRouter';

/**
 * Subscribes to the app-absolute location. Written out here rather than
 * pulled from `@internal/frontend`, because that package is inlined into its
 * consumers and would make this TanStack adapter forward a `react-router-dom`
 * peer dependency it has no business having.
 */
function useAppLocation() {
  const appHistory = useApi(appHistoryApiRef);
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const subscription = appHistory.location$.subscribe(() =>
        onStoreChange(),
      );
      return () => subscription.unsubscribe();
    },
    [appHistory],
  );
  // `AppHistoryApi.location` is a stable reference, so it is the snapshot.
  const getSnapshot = useCallback(() => appHistory.location, [appHistory]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Pudding-style coexistence: default RR v6 and TanStack in one app, both as
 * peer pages and with a TanStack sub-page nested under a default-v6 parent
 * page — the case that only became possible once the framework started
 * handing sub-pages over as data, and the one that would notice a TanStack
 * page mis-scoping itself to its parent's prefix.
 */
describe('TanStack + RR v6 coexistence', () => {
  const catalogRouteRef = createRouteRef();
  const toolsRouteRef = createRouteRef();

  it('should coexist v6 default + TanStack page with cross-plugin and app history navigate', async () => {
    const CatalogV6Page = () => {
      const location = useAppLocation();
      return (
        <div data-testid="catalog-page">
          <div data-testid="adapter">v6-default</div>
          <div data-testid="pathname">{location.pathname}</div>
          <RouteLink routeRef={toolsRouteRef} data-testid="to-tools">
            Tools (TanStack)
          </RouteLink>
        </div>
      );
    };

    const ToolsPage = () => {
      const location = useAppLocation();
      return (
        <div data-testid="tools-page">
          <div data-testid="adapter">tanstack</div>
          <div data-testid="pathname">{location.pathname}</div>
          <RouteLink routeRef={catalogRouteRef} data-testid="to-catalog">
            Catalog (v6)
          </RouteLink>
        </div>
      );
    };

    const catalogPlugin = createFrontendPlugin({
      pluginId: 'catalog-pudding-ts',
      routes: { root: catalogRouteRef },
      extensions: [
        PageBlueprint.make({
          name: 'index',
          params: {
            path: '/catalog-pudding-ts',
            routeRef: catalogRouteRef,
            loader: async () => <CatalogV6Page />,
          },
        }),
      ],
    });

    const toolsPlugin = createFrontendPlugin({
      pluginId: 'tools-pudding-ts',
      routes: { root: toolsRouteRef },
      extensions: [
        PageBlueprint.make({
          name: 'index',
          params: {
            path: '/tools-pudding-ts',
            routeRef: toolsRouteRef,
            loader: async () => <ToolsPage />,
          },
        }),
        PageRouterBlueprint.make({
          name: 'tanstack',
          attachTo: { id: 'page:tools-pudding-ts/index', input: 'router' },
          params: {
            component: TanStackPageRouter,
          },
        }),
      ],
    });

    const { appHistory } = renderTestApp({
      features: [catalogPlugin, toolsPlugin],
      initialRouteEntries: ['/catalog-pudding-ts'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6-default');
    });

    await act(async () => {
      screen.getByTestId('to-tools').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('tools-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('tanstack');
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/tools-pudding-ts',
      );
    });

    await act(async () => {
      screen.getByTestId('to-catalog').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6-default');
    });

    // AppHistoryApi has no programmatic `go` — navigate directly instead.
    await act(async () => {
      appHistory.navigate('/tools-pudding-ts');
    });

    await waitFor(() => {
      expect(screen.getByTestId('tools-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('tanstack');
    });

    await act(async () => {
      appHistory.navigate('/catalog-pudding-ts');
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6-default');
    });
  });

  it('should run a TanStack subpage under a default-v6 parent with cross-page nav', async () => {
    const homeRouteRef = createRouteRef();

    const HomeV6Page = () => {
      const location = useAppLocation();
      const navigate = useAppNavigate();
      return (
        <div data-testid="home-page">
          <div data-testid="adapter">v6-default</div>
          <div data-testid="pathname">{location.pathname}</div>
          <button
            type="button"
            data-testid="to-tree"
            onClick={() => navigate('/visualizer-pudding-ts/tree')}
          >
            Tree subpage
          </button>
        </div>
      );
    };

    const TreeTanStackSubPage = () => {
      const frameworkLocation = useAppLocation();
      const scopedLocation = useTanStackLocation();
      return (
        <div data-testid="tree-subpage">
          <div data-testid="adapter">tanstack</div>
          <div data-testid="pathname">{frameworkLocation.pathname}</div>
          {/* Scoped to the sub-page's own mount, not to its parent page. */}
          <div data-testid="scoped-pathname">{scopedLocation.pathname}</div>
          <RouteLink routeRef={homeRouteRef} data-testid="to-home">
            Home (v6)
          </RouteLink>
        </div>
      );
    };

    const homePage = PageBlueprint.make({
      name: 'home',
      params: {
        path: '/home-pudding-ts',
        routeRef: homeRouteRef,
        loader: async () => <HomeV6Page />,
      },
    });

    const visualizerPage = PageBlueprint.make({
      name: 'visualizer',
      params: {
        path: '/visualizer-pudding-ts',
        title: 'Visualizer',
      },
    });

    const treeSubPage = SubPageBlueprint.make({
      name: 'tree',
      attachTo: { id: 'page:test/visualizer', input: 'pages' },
      params: {
        path: 'tree',
        title: 'Tree',
        loader: async () => <TreeTanStackSubPage />,
      },
    });

    const treeTanStackRouter = PageRouterBlueprint.make({
      name: 'tree-tanstack',
      attachTo: { id: 'sub-page:test/tree', input: 'router' },
      params: {
        component: TanStackPageRouter,
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [homePage, visualizerPage, treeSubPage, treeTanStackRouter],
      initialRouteEntries: ['/home-pudding-ts'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6-default');
    });

    await act(async () => {
      screen.getByTestId('to-tree').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('tree-subpage')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('tanstack');
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/visualizer-pudding-ts/tree',
      );
      expect(screen.getByTestId('scoped-pathname')).toHaveTextContent('/');
    });

    await act(async () => {
      screen.getByTestId('to-home').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6-default');
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/home-pudding-ts',
      );
    });

    // AppHistoryApi has no programmatic `go` — navigate directly instead.
    await act(async () => {
      appHistory.navigate('/visualizer-pudding-ts/tree');
    });

    await waitFor(() => {
      expect(screen.getByTestId('tree-subpage')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('tanstack');
      expect(screen.getByTestId('scoped-pathname')).toHaveTextContent('/');
    });

    await act(async () => {
      appHistory.navigate('/home-pudding-ts');
    });

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6-default');
    });
  });
});
