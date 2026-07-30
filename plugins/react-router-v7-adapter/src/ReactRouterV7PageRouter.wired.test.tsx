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
} from '@backstage/frontend-plugin-api';
import { Link, useLocation, useParams } from 'react-router';
import { ReactRouterV7PageRouter } from './ReactRouterV7PageRouter';

/**
 * Wired-path coverage: a real page extension with a `router` input override
 * using the v7 adapter, rendered through the production AppRouteSwitch /
 * memory-history harness (not mock-contract-only).
 *
 * Lives in this package so the page content can import React Router v7 APIs
 * without conflicting with the app plugin's v6 peer dependency.
 */
describe('ReactRouterV7PageRouter wired path', () => {
  it('should run a page with router override on v7 with in-plugin nav and cross-page navigate', async () => {
    const SettingsWithNav = () => {
      const location = useLocation();
      return (
        <div data-testid="settings-page">
          <div data-testid="pathname">{location.pathname}</div>
          <div data-testid="router-version">v7</div>
          <Link to="./general" data-testid="general-link">
            General
          </Link>
          <Link to="./auth" data-testid="auth-link">
            Auth
          </Link>
        </div>
      );
    };

    const settingsPage = PageBlueprint.make({
      name: 'settings-v7',
      params: {
        path: '/settings-v7',
        loader: async () => <SettingsWithNav />,
      },
    });

    // renderTestApp wraps extensions in pluginId "test", so page ids are
    // page:test/<name>.
    const settingsV7Router = PageRouterBlueprint.make({
      name: 'v7',
      attachTo: { id: 'page:test/settings-v7', input: 'router' },
      params: {
        component: ReactRouterV7PageRouter,
      },
    });

    const { navigationController } = renderTestApp({
      extensions: [settingsPage, settingsV7Router],
      initialRouteEntries: ['/settings-v7'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      expect(screen.getByTestId('router-version')).toHaveTextContent('v7');
      expect(screen.getByTestId('pathname')).toHaveTextContent('/settings-v7');
    });

    await act(async () => {
      screen.getByTestId('general-link').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/settings-v7/general',
      );
    });

    // v7 relative splat resolution uses the full matched pathname for `./`
    // links, so return to the page root before the next relative hop.
    // AppHistoryApi has no programmatic `go` — navigate directly instead.
    await act(async () => {
      navigationController.navigate('/settings-v7');
    });

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent('/settings-v7');
    });

    await act(async () => {
      screen.getByTestId('auth-link').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/settings-v7/auth',
      );
    });

    await act(async () => {
      navigationController.navigate('/settings-v7');
    });

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent('/settings-v7');
    });

    await act(async () => {
      navigationController.navigate('/settings-v7/auth');
    });

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/settings-v7/auth',
      );
    });

    // Page stayed on the v7 adapter through in-plugin nav and controller nav.
    expect(screen.getByTestId('router-version')).toHaveTextContent('v7');
  });

  it('should expose route params via the v7 page adapter override', async () => {
    const EntityParams = () => {
      const params = useParams();
      return (
        <div data-testid="entity-page">
          <span data-testid="namespace">{params.namespace}</span>
          <span data-testid="kind">{params.kind}</span>
          <span data-testid="name">{params.name}</span>
          <span data-testid="splat">{params['*'] ?? ''}</span>
        </div>
      );
    };

    const entityPage = PageBlueprint.make({
      name: 'entity-v7',
      params: {
        path: '/entity-v7/:namespace/:kind/:name',
        loader: async () => <EntityParams />,
      },
    });

    const entityV7Router = PageRouterBlueprint.make({
      name: 'v7',
      attachTo: { id: 'page:test/entity-v7', input: 'router' },
      params: {
        component: ReactRouterV7PageRouter,
      },
    });

    renderTestApp({
      extensions: [entityPage, entityV7Router],
      initialRouteEntries: ['/entity-v7/default/component/my-entity/overview'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('namespace')).toHaveTextContent('default');
      expect(screen.getByTestId('kind')).toHaveTextContent('component');
      expect(screen.getByTestId('name')).toHaveTextContent('my-entity');
      expect(screen.getByTestId('splat')).toHaveTextContent('overview');
    });
  });
});
