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

import { act, screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { appHistoryApiRef, useApi } from '@backstage/frontend-plugin-api';
import { StrictMode } from 'react';
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import {
  TanStackPageContent,
  createTanStackPageRouter,
} from './TanStackPageRouter';

describe('createTanStackPageRouter', () => {
  it('binds a plugin-owned nested route tree to the page history', async () => {
    const rootRoute = createRootRoute({
      component: () => (
        <>
          <TanStackPageContent />
          <Outlet />
        </>
      ),
    });
    const detailsRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/details',
      component: () => <span>Nested details</span>,
    });
    const routeTree = rootRoute.addChildren([detailsRoute]);

    const PageRouter = createTanStackPageRouter({
      createRouter: ({ history }) => createRouter({ routeTree, history }),
    });

    renderInTestApp(
      <PageRouter>
        <span>Framework page content</span>
      </PageRouter>,
      {
        mountPath: '/things/*',
        initialRouteEntries: ['/things/details'],
      },
    );

    expect(
      await screen.findByText('Framework page content'),
    ).toBeInTheDocument();
    expect(await screen.findByText('Nested details')).toBeInTheDocument();
  });

  it('keeps the committed history alive across StrictMode effect replay and disposes it on unmount', async () => {
    const destroySpies: jest.SpyInstance[] = [];
    const PageRouter = createTanStackPageRouter({
      createRouter: ({ history }) => {
        destroySpies.push(jest.spyOn(history, 'destroy'));
        const rootRoute = createRootRoute({
          component: () => (
            <>
              <TanStackPageContent />
              <Outlet />
            </>
          ),
        });
        const detailsRoute = createRoute({
          getParentRoute: () => rootRoute,
          path: '/details',
          component: () => <span>Strict details</span>,
        });
        const indexRoute = createRoute({
          getParentRoute: () => rootRoute,
          path: '/',
          component: () => null,
        });
        return createRouter({
          routeTree: rootRoute.addChildren([indexRoute, detailsRoute]),
          history,
        });
      },
    });

    function NavigateFromFramework() {
      const appHistory = useApi(appHistoryApiRef);
      return (
        <button
          type="button"
          onClick={() => appHistory.navigate('/things/details')}
        >
          Show details
        </button>
      );
    }

    const rendered = renderInTestApp(
      <StrictMode>
        <PageRouter>
          <NavigateFromFramework />
        </PageRouter>
      </StrictMode>,
      {
        mountPath: '/things',
        initialRouteEntries: ['/things'],
      },
    );

    await screen.findByRole('button', { name: 'Show details' });
    const committedDestroy = destroySpies.at(-1)!;
    expect(committedDestroy).not.toHaveBeenCalled();

    act(() => screen.getByRole('button', { name: 'Show details' }).click());
    expect(await screen.findByText('Strict details')).toBeInTheDocument();
    expect(committedDestroy).not.toHaveBeenCalled();

    rendered.unmount();
    await act(async () => Promise.resolve());
    expect(committedDestroy).toHaveBeenCalledTimes(1);
  });
});
