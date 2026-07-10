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
  createRouteDescriptor,
  createRouteRef,
  useFrameworkLocation,
} from '@backstage/frontend-plugin-api';
import { Link, useParams } from '@tanstack/react-router';
import { TanStackPageRouter } from './TanStackPageRouter';

/**
 * Pudding-style coexistence: default RR v6 page + TanStack page override with
 * the same descriptor shape, cross-plugin nav, and back/forward.
 */
describe('TanStack + RR v6 coexistence', () => {
  const catalogRouteRef = createRouteRef();
  const toolsRouteRef = createRouteRef();

  it('should coexist v6 default + TanStack descriptor page with cross-plugin nav', async () => {
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

    const ToolsOverview = () => (
      <div data-testid="tools-overview">
        <div data-testid="adapter">tanstack</div>
        <Link
          to="/entities/$id"
          params={{ id: 'beta' }}
          data-testid="to-entity"
        >
          Entity
        </Link>
        <RouteLink routeRef={catalogRouteRef} data-testid="to-catalog">
          Catalog (v6)
        </RouteLink>
      </div>
    );

    const EntityPage = () => {
      const params = useParams({ strict: false }) as { id?: string };
      return (
        <div data-testid="entity-page">
          <div data-testid="adapter">tanstack</div>
          <span data-testid="entity-id">{params.id}</span>
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
            routes: [
              createRouteDescriptor({
                index: true,
                component: ToolsOverview,
              }),
              createRouteDescriptor({
                path: 'entities/:id',
                component: EntityPage,
              }),
            ],
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

    const { navigationController } = renderTestApp({
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
      expect(screen.getByTestId('tools-overview')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('tanstack');
    });

    await act(async () => {
      screen.getByTestId('to-entity').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('entity-page')).toBeInTheDocument();
      expect(screen.getByTestId('entity-id')).toHaveTextContent('beta');
    });

    await act(async () => {
      screen.getByTestId('to-catalog').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6-default');
    });

    await act(async () => {
      navigationController.go(-1);
    });

    await waitFor(() => {
      expect(screen.getByTestId('entity-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('tanstack');
    });

    await act(async () => {
      navigationController.go(1);
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
    });
  });
});
