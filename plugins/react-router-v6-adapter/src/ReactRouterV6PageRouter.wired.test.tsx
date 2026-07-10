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
  createRouteDescriptor,
} from '@backstage/frontend-plugin-api';
import { Link, Routes, Route, useParams } from 'react-router-dom';

/**
 * Wired-path coverage for descriptor compilation under the v6 page adapter
 * (default pageRouterApiRef), plus the opaque-children expand path.
 */
describe('ReactRouterV6PageRouter descriptors', () => {
  it('should render a descriptor tree with nested routes, params, splat, and lazy loaders', async () => {
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
      name: 'tools-v6',
      params: {
        path: '/tools-v6',
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

    const pushSpy = jest.spyOn(window.history, 'pushState');
    const replaceSpy = jest.spyOn(window.history, 'replaceState');

    const { navigationController } = renderTestApp({
      extensions: [toolsPage],
      initialRouteEntries: ['/tools-v6/entities/alpha'],
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

    expect(pushSpy).not.toHaveBeenCalled();
    expect(replaceSpy).not.toHaveBeenCalled();
    pushSpy.mockRestore();
    replaceSpy.mockRestore();
  });

  it('should still support opaque React Router children under the page adapter', async () => {
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
      name: 'opaque-v6',
      params: {
        path: '/opaque-v6',
        loader: async () => <OpaqueSettings />,
      },
    });

    renderTestApp({
      extensions: [settingsPage],
      initialRouteEntries: ['/opaque-v6'],
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
