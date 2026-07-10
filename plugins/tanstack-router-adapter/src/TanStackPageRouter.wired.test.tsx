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
  ApiBlueprint,
  PageBlueprint,
  PageRouterBlueprint,
  SubPageBlueprint,
  createFrontendModule,
  createRouteDescriptor,
  pageRouterApiRef,
} from '@backstage/frontend-plugin-api';
import {
  Link,
  useParams,
  useSearch,
  useNavigate,
  useBlocker,
} from '@tanstack/react-router';
import { TanStackPageRouter } from './TanStackPageRouter';

/**
 * Wired-path coverage for descriptor compilation under the TanStack page
 * adapter (page override and pageRouterApiRef default).
 */
describe('TanStackPageRouter descriptors', () => {
  it('should render a descriptor tree with nested routes, params, splat, lazy, and search params', async () => {
    const EntityOverview = () => {
      const search = useSearch({ strict: false }) as { q?: string };
      const navigate = useNavigate();
      return (
        <div data-testid="overview">
          Overview
          <span data-testid="search-q">{search.q ?? ''}</span>
          <Link to="./docs/intro" data-testid="docs-link">
            Docs
          </Link>
          <button
            type="button"
            data-testid="set-search"
            onClick={() =>
              navigate({
                to: '.',
                search: { q: 'hello' } as never,
              })
            }
          >
            Search
          </button>
        </div>
      );
    };

    const EntityDocs = () => {
      const params = useParams({ strict: false }) as { _splat?: string };
      return (
        <div data-testid="docs">
          <span data-testid="doc-splat">{params._splat ?? ''}</span>
        </div>
      );
    };

    const EntityLayout = () => {
      const params = useParams({ strict: false }) as { id?: string };
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
      name: 'tools-ts',
      params: {
        path: '/tools-ts',
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

    const tanstackRouter = PageRouterBlueprint.make({
      name: 'tanstack',
      attachTo: { id: 'page:test/tools-ts', input: 'router' },
      params: {
        component: TanStackPageRouter,
      },
    });

    const pushSpy = jest.spyOn(window.history, 'pushState');
    const replaceSpy = jest.spyOn(window.history, 'replaceState');

    const { navigationController } = renderTestApp({
      extensions: [toolsPage, tanstackRouter],
      initialRouteEntries: ['/tools-ts/entities/alpha'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('entity-layout')).toBeInTheDocument();
      expect(screen.getByTestId('entity-id')).toHaveTextContent('alpha');
      expect(screen.getByTestId('overview')).toBeInTheDocument();
    });

    await act(async () => {
      screen.getByTestId('set-search').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('search-q')).toHaveTextContent('hello');
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

  it('should register as pageRouterApiRef default and block in-adapter leave', async () => {
    const LeavePage = () => {
      const navigate = useNavigate();
      useBlocker({
        shouldBlockFn: () => true,
        enableBeforeUnload: false,
        withResolver: false,
      });
      return (
        <div data-testid="leave-page">
          Leave
          <button
            type="button"
            data-testid="try-leave"
            onClick={() => navigate({ to: '/other' })}
          >
            Leave
          </button>
        </div>
      );
    };

    const EnterPage = () => <div data-testid="enter-page">Enter</div>;

    const leavePage = PageBlueprint.make({
      name: 'leave-ts',
      params: {
        path: '/leave-ts',
        routes: [
          createRouteDescriptor({
            index: true,
            component: LeavePage,
          }),
          createRouteDescriptor({
            path: 'other',
            component: EnterPage,
          }),
        ],
      },
    });

    // Override the app-plugin page-router API (same id as production default).
    const tanstackDefaultModule = createFrontendModule({
      pluginId: 'app',
      extensions: [
        ApiBlueprint.make({
          name: 'page-router',
          params: defineParams =>
            defineParams({
              api: pageRouterApiRef,
              deps: {},
              factory: () => ({
                getDefaultRouter: () => TanStackPageRouter,
                getCapabilities: () => ({ supportsOpaqueChildren: false }),
              }),
            }),
        }),
      ],
    });

    renderTestApp({
      features: [tanstackDefaultModule],
      extensions: [leavePage],
      initialRouteEntries: ['/leave-ts'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('leave-page')).toBeInTheDocument();
    });

    await act(async () => {
      screen.getByTestId('try-leave').click();
    });

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    // Stay on leave — blocker prevented enter. Successful leave→enter when
    // unblocked is residual (chrome/framework bypass also not blocked).
    expect(screen.getByTestId('leave-page')).toBeInTheDocument();
    expect(screen.queryByTestId('enter-page')).not.toBeInTheDocument();
  });

  it('should fail fast when TanStack is default and page uses opaque loader', async () => {
    const opaquePage = PageBlueprint.make({
      name: 'opaque-ts',
      params: {
        path: '/opaque-ts',
        loader: async () => <div data-testid="opaque-content">Opaque</div>,
      },
    });

    const tanstackDefaultModule = createFrontendModule({
      pluginId: 'app',
      extensions: [
        ApiBlueprint.make({
          name: 'page-router',
          params: defineParams =>
            defineParams({
              api: pageRouterApiRef,
              deps: {},
              factory: () => ({
                getDefaultRouter: () => TanStackPageRouter,
                getCapabilities: () => ({ supportsOpaqueChildren: false }),
              }),
            }),
        }),
      ],
    });

    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    try {
      renderTestApp({
        features: [tanstackDefaultModule],
        extensions: [opaquePage],
        initialRouteEntries: ['/opaque-ts'],
      });

      await waitFor(() => {
        expect(
          screen.getAllByText(/does not support opaque React Router children/i)
            .length,
        ).toBeGreaterThan(0);
      });
      expect(screen.queryByTestId('opaque-content')).not.toBeInTheDocument();
    } finally {
      consoleError.mockRestore();
    }
  });

  it('should host SubPageBlueprint pages input via descriptors under TanStack override', async () => {
    // Unnamed parent → page:test; SubPageBlueprint's relative attach and the
    // TanStack router's default relative attach both resolve to it.
    const parentPage = PageBlueprint.make({
      params: {
        path: '/devtools-ts',
        title: 'DevTools',
      },
    });

    const infoSubPage = SubPageBlueprint.make({
      name: 'info',
      params: {
        path: 'info',
        title: 'Info',
        loader: async () => <div data-testid="info-page">Info</div>,
      },
    });

    const configSubPage = SubPageBlueprint.make({
      name: 'config',
      params: {
        path: 'config',
        title: 'Config',
        loader: async () => <div data-testid="config-page">Config</div>,
      },
    });

    const tanstackRouter = PageRouterBlueprint.make({
      name: 'tanstack',
      params: {
        component: TanStackPageRouter,
      },
    });

    const { navigationController } = renderTestApp({
      extensions: [parentPage, infoSubPage, configSubPage, tanstackRouter],
      initialRouteEntries: ['/devtools-ts/info'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('info-page')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Info' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Config' })).toBeInTheDocument();
    });

    await act(async () => {
      navigationController.navigate('/devtools-ts/config');
    });

    await waitFor(() => {
      expect(screen.getByTestId('config-page')).toBeInTheDocument();
    });
  });
});
