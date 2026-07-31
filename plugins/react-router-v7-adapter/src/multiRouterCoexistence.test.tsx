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

import { act, screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  PageBlueprint,
  PageRouterBlueprint,
  RouteLink,
  SubPageBlueprint,
  createFrontendPlugin,
  createRouteRef,
  useAppNavigate,
  useFrameworkLocation,
} from '@backstage/frontend-plugin-api';
import { usePageMount } from '@internal/frontend';
import { Link, useLocation } from 'react-router';
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
      const location = useFrameworkLocation();
      return (
        <div data-testid="catalog-page">
          <div data-testid="adapter">v6-default</div>
          <div data-testid="pathname">{location.pathname}</div>
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
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/catalog-pudding',
      );
    });

    await act(async () => {
      screen.getByTestId('to-settings').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v7');
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/settings-pudding',
      );
    });

    await act(async () => {
      screen.getByTestId('in-plugin-general').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent(
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
      expect(screen.getByTestId('pathname')).toHaveTextContent(
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
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/settings-pudding/general',
      );
    });

    await act(async () => {
      appHistory.navigate('/settings-pudding');
    });

    await waitFor(() => {
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/settings-pudding',
      );
    });

    await act(async () => {
      appHistory.navigate('/catalog-pudding');
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6-default');
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/catalog-pudding',
      );
    });

    await act(async () => {
      appHistory.navigate('/settings-pudding');
    });

    await waitFor(() => {
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v7');
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/settings-pudding',
      );
    });
  });

  it('should run a v7 subpage under a default-v6 parent with cross-page nav', async () => {
    const homeRouteRef = createRouteRef();

    const HomeV6Page = () => {
      const location = useFrameworkLocation();
      const navigate = useAppNavigate();
      return (
        <div data-testid="home-page">
          <div data-testid="adapter">v6-default</div>
          <div data-testid="pathname">{location.pathname}</div>
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

    const treeV7Router = PageRouterBlueprint.make({
      name: 'tree-v7',
      attachTo: { id: 'sub-page:test/tree', input: 'router' },
      params: {
        component: ReactRouterV7PageRouter,
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [homePage, visualizerPage, treeSubPage, treeV7Router],
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
      expect(screen.getByTestId('contract-base')).toHaveTextContent(
        '/visualizer-pudding/tree',
      );
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/visualizer-pudding/tree',
      );
    });

    await act(async () => {
      screen.getByTestId('to-home').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6-default');
      expect(screen.getByTestId('pathname')).toHaveTextContent('/home-pudding');
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
});
