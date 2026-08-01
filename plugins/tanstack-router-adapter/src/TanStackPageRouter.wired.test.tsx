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
  pageRouterApiRef,
} from '@backstage/frontend-plugin-api';
import { useBlocker, useNavigate, useSearch } from '@tanstack/react-router';
import { TanStackPageRouter } from './TanStackPageRouter';

/**
 * Wired-path coverage for the TanStack page adapter: single-page (opaque
 * `loader`) content renders under a TanStack root route, `useBlocker` works
 * for in-page navigation initiated through TanStack's own `useNavigate`
 * (this adapter's `history.block` is a *local* seam — see the package
 * README), and sub-page tabs are hosted as real TanStack routes now that
 * `PageBlueprint` hands sub-pages over as data instead of as a React Router
 * tree.
 */
describe('TanStackPageRouter wired path', () => {
  it('should render single-page content under a TanStack root route', async () => {
    const toolsPage = PageBlueprint.make({
      name: 'tools-ts',
      params: {
        path: '/tools-ts',
        loader: async () => <div data-testid="tools-page">Tools</div>,
      },
    });

    const tanstackRouter = PageRouterBlueprint.make({
      name: 'tanstack',
      attachTo: { id: 'page:test/tools-ts', input: 'router' },
      params: {
        component: TanStackPageRouter,
      },
    });

    renderTestApp({
      extensions: [toolsPage, tanstackRouter],
      initialRouteEntries: ['/tools-ts'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('tools-page')).toBeInTheDocument();
    });
  });

  it('should block in-page TanStack navigation via useBlocker', async () => {
    const LeavePage = () => {
      useBlocker({
        shouldBlockFn: () => true,
        enableBeforeUnload: false,
        withResolver: false,
      });
      const navigate = useNavigate();
      const search = useSearch({ strict: false }) as { q?: string };
      return (
        <div data-testid="leave-page">
          <span data-testid="q">{search.q ?? ''}</span>
          <button
            type="button"
            data-testid="try-nav"
            onClick={() => navigate({ to: '.', search: { q: 'blocked' } })}
          >
            Navigate
          </button>
        </div>
      );
    };

    const leavePage = PageBlueprint.make({
      name: 'leave-ts',
      params: {
        path: '/leave-ts',
        loader: async () => <LeavePage />,
      },
    });

    const tanstackRouter = PageRouterBlueprint.make({
      name: 'tanstack',
      attachTo: { id: 'page:test/leave-ts', input: 'router' },
      params: {
        component: TanStackPageRouter,
      },
    });

    renderTestApp({
      extensions: [leavePage, tanstackRouter],
      initialRouteEntries: ['/leave-ts'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('leave-page')).toBeInTheDocument();
    });

    await act(async () => {
      screen.getByTestId('try-nav').click();
    });

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    // The blocker prevented the search-param update from committing.
    expect(screen.getByTestId('q')).toHaveTextContent('');
  });

  it('should host sub-page tabs, including as the app-wide default router', async () => {
    // Unnamed parent → page:test, so the named sub-pages attach relatively
    // (the same wiring production plugins use).
    const tabbedPage = PageBlueprint.make({
      params: {
        path: '/tabbed-ts',
        title: 'Tabbed',
      },
    });

    const overviewSubPage = SubPageBlueprint.make({
      name: 'overview',
      params: {
        path: 'overview',
        title: 'Overview',
        loader: async () => <div data-testid="overview-page">Overview</div>,
      },
    });

    const settingsSubPage = SubPageBlueprint.make({
      name: 'settings',
      params: {
        path: 'settings',
        title: 'Settings',
        loader: async () => <div data-testid="settings-page">Settings</div>,
      },
    });

    // TanStack as the app-wide default, i.e. no PageRouterBlueprint override
    // on the page — the path the old capability guard never covered.
    const tanstackDefaultModule = createFrontendModule({
      pluginId: 'app',
      extensions: [
        ApiBlueprint.make({
          name: 'page-router',
          params: defineParams =>
            defineParams({
              api: pageRouterApiRef,
              deps: {},
              factory: () => TanStackPageRouter,
            }),
        }),
      ],
    });

    const { appHistory } = renderTestApp({
      features: [tanstackDefaultModule],
      extensions: [tabbedPage, overviewSubPage, settingsSubPage],
      initialRouteEntries: ['/tabbed-ts/overview'],
    });

    expect(await screen.findByTestId('overview-page')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument();

    await act(async () => {
      appHistory.navigate('/tabbed-ts/settings');
    });

    expect(await screen.findByTestId('settings-page')).toBeInTheDocument();
    expect(screen.queryByTestId('overview-page')).not.toBeInTheDocument();

    // The page root redirects to the first sub-page.
    await act(async () => {
      appHistory.navigate('/tabbed-ts');
    });

    expect(await screen.findByTestId('overview-page')).toBeInTheDocument();
  });
});
