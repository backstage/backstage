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

import { createContext, useContext } from 'react';
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
  pageRouterApiRef,
  useApi,
  useAppNavigate,
  type PageRouterComponent,
} from '@backstage/frontend-plugin-api';
import { useAppHistoryLocation, usePageMount } from '@internal/frontend';
import { Link, useLocation, useResolvedPath } from 'react-router';
import { ReactRouterV7PageRouter } from './ReactRouterV7PageRouter';

/**
 * Prove default RR v6 and RR v7 adapters coexist on the wired path
 * (AppRouteSwitch + memory-history harness).
 *
 * Lives here so the v7 page/subpage can import React Router v7 APIs without
 * conflicting with the app plugin's v6 peer dependency. The default-v6 page
 * uses framework navigation only (no react-router import) so this package's
 * v7 peers do not shadow the app-plugin default adapter.
 */
describe('multi-router coexistence', () => {
  const catalogRouteRef = createRouteRef();
  const settingsRouteRef = createRouteRef();

  it('should coexist v6 default + v7 pages with cross-plugin and app history navigate', async () => {
    const CatalogV6Page = () => {
      const location = useAppHistoryLocation(useApi(appHistoryApiRef));
      return (
        <div data-testid="catalog-page">
          <div data-testid="adapter">v6-default</div>
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
            loader: async () => <CatalogV6Page />,
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
            loader: async () => <SettingsV7Page />,
          },
        }),
        PageRouterBlueprint.make({
          name: 'v7',
          attachTo: { id: 'page:settings-pudding/index', input: 'router' },
          params: {
            component: ReactRouterV7PageRouter,
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
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6-default');
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
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6-default');
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
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6-default');
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

  it('should run a v7 subpage under a default-v6 parent with cross-page nav', async () => {
    const homeRouteRef = createRouteRef();

    const HomeV6Page = () => {
      const location = useAppHistoryLocation(useApi(appHistoryApiRef));
      const navigate = useAppNavigate();
      return (
        <div data-testid="home-page">
          <div data-testid="adapter">v6-default</div>
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
          {/* The page above this sub-page is routed by the default v6
              adapter, so there is no v7 route context around this one to
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
        loader: async () => <HomeV6Page />,
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
        loader: async () => <TreeV7SubPage />,
      },
    });

    const graphSubPage = SubPageBlueprint.make({
      name: 'graph',
      attachTo: { id: 'page:test/visualizer', input: 'pages' },
      params: {
        path: 'graph',
        title: 'Graph',
        loader: async () => <div data-testid="graph-subpage">Graph</div>,
      },
    });

    const treeV7Router = PageRouterBlueprint.make({
      name: 'tree-v7',
      attachTo: { id: 'sub-page:test/tree', input: 'router' },
      params: {
        component: ReactRouterV7PageRouter,
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [
        homePage,
        visualizerPage,
        treeSubPage,
        graphSubPage,
        treeV7Router,
      ],
      initialRouteEntries: ['/home-pudding'],
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
      expect(screen.getByTestId('adapter')).toHaveTextContent('v7');
      expect(screen.getByTestId('contract-base').textContent).toBe(
        '/visualizer-pudding/tree',
      );
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/visualizer-pudding/tree',
      );
    });

    // Crossing libraries at the page/sub-page boundary must not move where a
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
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6-default');
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
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6-default');
    });
  });

  it('should select one router while sub-pages inherit or override the page router', async () => {
    const RouterStack = createContext<readonly string[]>([]);

    const DefaultRouter: PageRouterComponent = props => {
      const stack = useContext(RouterStack);
      return (
        <RouterStack.Provider value={[...stack, 'default']}>
          <div data-testid="default-router">{props.children}</div>
        </RouterStack.Provider>
      );
    };

    const PageV7Router: PageRouterComponent = props => {
      const mount = usePageMount();
      const stack = useContext(RouterStack);
      return (
        <RouterStack.Provider value={[...stack, 'v7']}>
          <div data-testid="page-v7-router" data-mount={mount?.basePath}>
            <ReactRouterV7PageRouter>{props.children}</ReactRouterV7PageRouter>
          </div>
        </RouterStack.Provider>
      );
    };

    const AlternateSubPageRouter: PageRouterComponent = props => {
      const mount = usePageMount();
      const stack = useContext(RouterStack);
      return (
        <RouterStack.Provider value={[...stack, 'alternate']}>
          <div
            data-testid="alternate-subpage-router"
            data-mount={mount?.basePath}
          >
            {props.children}
          </div>
        </RouterStack.Provider>
      );
    };

    const InheritedSubPage = (props: { name: string }) => {
      const mount = usePageMount();
      const location = useLocation();
      const stack = useContext(RouterStack);
      return (
        <div
          data-testid={`inherited-${props.name}`}
          data-mount={mount?.basePath}
          data-router-stack={stack.join('>')}
        >
          {location.pathname}
        </div>
      );
    };

    const OverriddenSubPage = () => {
      const mount = usePageMount();
      const stack = useContext(RouterStack);
      return (
        <div
          data-testid="overridden"
          data-mount={mount?.basePath}
          data-router-stack={stack.join('>')}
        />
      );
    };

    const page = PageBlueprint.make({
      name: 'router-selection',
      params: { path: '/router-selection', title: 'Router selection' },
    });
    const inheritedSubPages = ['first', 'second'].map(name =>
      SubPageBlueprint.make({
        name,
        attachTo: { id: 'page:test/router-selection', input: 'pages' },
        params: {
          path: name,
          title: name,
          loader: async () => <InheritedSubPage name={name} />,
        },
      }),
    );
    const overriddenSubPage = SubPageBlueprint.make({
      name: 'overridden',
      attachTo: { id: 'page:test/router-selection', input: 'pages' },
      params: {
        path: 'overridden',
        title: 'Overridden',
        loader: async () => <OverriddenSubPage />,
      },
    });
    const pageRouter = PageRouterBlueprint.make({
      name: 'page-v7',
      attachTo: { id: 'page:test/router-selection', input: 'router' },
      params: { component: PageV7Router },
    });
    const subPageRouter = PageRouterBlueprint.make({
      name: 'subpage-alternate',
      attachTo: { id: 'sub-page:test/overridden', input: 'router' },
      params: { component: AlternateSubPageRouter },
    });
    const { appHistory } = renderTestApp({
      apis: [[pageRouterApiRef, DefaultRouter]],
      extensions: [
        page,
        ...inheritedSubPages,
        overriddenSubPage,
        pageRouter,
        subPageRouter,
      ],
      initialRouteEntries: ['/router-selection/first'],
    });

    const inheritedFirst = await screen.findByTestId('inherited-first');
    expect(inheritedFirst).toHaveAttribute(
      'data-mount',
      '/router-selection/first',
    );
    expect(inheritedFirst).toHaveTextContent('/router-selection/first');
    expect(inheritedFirst).toHaveAttribute('data-router-stack', 'v7');
    expect(screen.getByTestId('page-v7-router')).toHaveAttribute(
      'data-mount',
      '/router-selection',
    );
    expect(screen.queryByTestId('default-router')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('alternate-subpage-router'),
    ).not.toBeInTheDocument();

    const pageShell = screen.getByRole('tablist');
    const inheritedPageRouter = screen.getByTestId('page-v7-router');
    await act(async () => {
      appHistory.navigate('/router-selection/second');
    });

    const inheritedSecond = await screen.findByTestId('inherited-second');
    expect(inheritedSecond).toHaveAttribute(
      'data-mount',
      '/router-selection/second',
    );
    expect(inheritedSecond).toHaveAttribute('data-router-stack', 'v7');
    expect(screen.getByTestId('page-v7-router')).toBe(inheritedPageRouter);
    expect(screen.getByRole('tablist')).toBe(pageShell);
    expect(screen.queryByTestId('default-router')).not.toBeInTheDocument();

    await act(async () => {
      appHistory.navigate('/router-selection/overridden');
    });

    const overridden = await screen.findByTestId('overridden');
    expect(overridden).toHaveAttribute(
      'data-mount',
      '/router-selection/overridden',
    );
    expect(overridden).toHaveAttribute('data-router-stack', 'alternate');
    expect(screen.getByTestId('alternate-subpage-router')).toHaveAttribute(
      'data-mount',
      '/router-selection/overridden',
    );
    expect(screen.queryByTestId('page-v7-router')).not.toBeInTheDocument();
    expect(screen.queryByTestId('default-router')).not.toBeInTheDocument();
    expect(screen.getByRole('tablist')).toBe(pageShell);

    await act(async () => {
      appHistory.navigate('/router-selection/first');
    });

    expect(await screen.findByTestId('inherited-first')).toHaveAttribute(
      'data-mount',
      '/router-selection/first',
    );
    expect(screen.getByTestId('page-v7-router')).toHaveAttribute(
      'data-mount',
      '/router-selection',
    );
    expect(
      screen.queryByTestId('alternate-subpage-router'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('default-router')).not.toBeInTheDocument();
    expect(screen.getByRole('tablist')).toBe(pageShell);
  });
});
