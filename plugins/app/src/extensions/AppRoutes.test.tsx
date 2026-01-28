/*
 * Copyright 2025 The Backstage Authors
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

import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, type RouteObject } from 'react-router-dom';
import { PluginRouteProvider, usePluginRoute } from './PluginRouteContext';
import { PluginAwareRoutes } from './AppRoutes';

type TestRouteObject = RouteObject & {
  handle?: { pluginId?: string };
};

const PluginIdDisplay = () => {
  const { pluginId } = usePluginRoute();
  return <span data-testid="plugin-id">{pluginId}</span>;
};

describe('PluginAwareRoutes', () => {
  it('updates the plugin id based on the matched route handle', async () => {
    const routes: TestRouteObject[] = [
      {
        path: '/',
        element: <div>Catalog</div>,
        handle: { pluginId: 'catalog' },
      },
    ];

    render(
      <PluginRouteProvider initialPluginId="app">
        <PluginIdDisplay />
        <MemoryRouter initialEntries={['/']}>
          <PluginAwareRoutes routes={routes} />
        </MemoryRouter>
      </PluginRouteProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('plugin-id')).toHaveTextContent('catalog'),
    );
  });

  it('falls back to the initial plugin id when no plugin id is provided', async () => {
    const routes: TestRouteObject[] = [
      {
        path: '/',
        element: <div>Home</div>,
      },
    ];

    render(
      <PluginRouteProvider initialPluginId="app">
        <PluginIdDisplay />
        <MemoryRouter initialEntries={['/']}>
          <PluginAwareRoutes routes={routes} />
        </MemoryRouter>
      </PluginRouteProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('plugin-id')).toHaveTextContent('app'),
    );
  });
});
