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
  createRouteDescriptor,
} from '@backstage/frontend-plugin-api';
import { Link, Routes, Route, useParams } from 'react-router';
import { ReactRouterV7PageRouter } from './ReactRouterV7PageRouter';

/**
 * Same descriptor tree as the v6 wired test, exercised under the v7 adapter
 * override — proves adapters compile descriptors independently of PageBlueprint's
 * former React Router-only path.
 */
describe('ReactRouterV7PageRouter descriptors', () => {
  it('should render the same descriptor tree as v6 with nested routes, params, splat, and lazy loaders', async () => {
    const EntityOverview = () => (
      <div data-testid="overview">
        Overview
        <Link to="./docs/intro" data-testid="docs-link">
          Docs
        </Link>
      </div>
    );

    const EntityDocs = () => {
      const params = useParams();
      return (
        <div data-testid="docs">
          <span data-testid="doc-splat">{params['*'] ?? ''}</span>
        </div>
      );
    };

    const EntityLayout = () => {
      const params = useParams();
      return (
        <div data-testid="entity-layout">
          <span data-testid="entity-id">{params.id}</span>
          <Link to="." data-testid="overview-link">
            Overview
          </Link>
        </div>
      );
    };

    const toolsPage = PageBlueprint.make({
      name: 'tools-v7',
      params: {
        path: '/tools-v7',
        routes: [
          createRouteDescriptor({
            path: 'entities/:id',
            component: EntityLayout,
            children: [
              createRouteDescriptor({
                index: true,
                loader: async () => <EntityOverview />,
              }),
              createRouteDescriptor({
                path: 'docs/*',
                loader: async () => <EntityDocs />,
              }),
            ],
          }),
        ],
      },
    });

    const toolsV7Router = PageRouterBlueprint.make({
      name: 'v7',
      attachTo: { id: 'page:test/tools-v7', input: 'router' },
      params: {
        component: ReactRouterV7PageRouter,
      },
    });

    const { navigationController } = renderTestApp({
      extensions: [toolsPage, toolsV7Router],
      initialRouteEntries: ['/tools-v7/entities/alpha'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('entity-layout')).toBeInTheDocument();
      expect(screen.getByTestId('entity-id')).toHaveTextContent('alpha');
      expect(screen.getByTestId('overview')).toBeInTheDocument();
    });

    await act(async () => {
      screen.getByTestId('docs-link').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('docs')).toBeInTheDocument();
      expect(screen.getByTestId('doc-splat')).toHaveTextContent('intro');
    });

    await act(async () => {
      navigationController.go(-1);
    });

    await waitFor(() => {
      expect(screen.getByTestId('overview')).toBeInTheDocument();
    });
  });

  it('should still support opaque React Router children under the v7 page adapter', async () => {
    const OpaqueSettings = () => (
      <div data-testid="opaque-root">
        <Routes>
          <Route index element={<div data-testid="opaque-index">Index</div>} />
          <Route
            path="general"
            element={<div data-testid="opaque-general">General</div>}
          />
        </Routes>
        <Link to="./general" data-testid="opaque-general-link">
          General
        </Link>
      </div>
    );

    const settingsPage = PageBlueprint.make({
      name: 'opaque-v7',
      params: {
        path: '/opaque-v7',
        loader: async () => <OpaqueSettings />,
      },
    });

    const settingsV7Router = PageRouterBlueprint.make({
      name: 'v7',
      attachTo: { id: 'page:test/opaque-v7', input: 'router' },
      params: {
        component: ReactRouterV7PageRouter,
      },
    });

    renderTestApp({
      extensions: [settingsPage, settingsV7Router],
      initialRouteEntries: ['/opaque-v7'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('opaque-index')).toBeInTheDocument();
    });

    await act(async () => {
      screen.getByTestId('opaque-general-link').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('opaque-general')).toBeInTheDocument();
    });
  });
});
