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
  createFrontendPlugin,
  createRouteRef,
  useFrameworkLocation,
} from '@backstage/frontend-plugin-api';
import { TanStackPageRouter } from './TanStackPageRouter';

/**
 * Pudding-style coexistence: default RR v6 page + TanStack page override,
 * both rendering opaque single-page content, with cross-plugin and
 * app-history-driven navigation.
 */
describe('TanStack + RR v6 coexistence', () => {
  const catalogRouteRef = createRouteRef();
  const toolsRouteRef = createRouteRef();

  it('should coexist v6 default + TanStack page with cross-plugin and app history navigate', async () => {
    const CatalogV6Page = () => {
      const location = useFrameworkLocation();
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
      const location = useFrameworkLocation();
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
      expect(screen.getByTestId('pathname')).toHaveTextContent(
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
});
