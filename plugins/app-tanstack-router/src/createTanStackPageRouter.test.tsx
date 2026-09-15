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
import {
  createMockAppHistory,
  renderInTestApp,
  renderTestApp,
  TestApiProvider,
} from '@backstage/frontend-test-utils';
import {
  AppHistoryApi,
  appHistoryApiRef,
  useApi,
  createExtension,
  createExtensionInput,
  coreExtensionData,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import { StrictMode, useState } from 'react';
import {
  Outlet,
  useCanGoBack,
  useLocation,
  useRouter,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import {
  TanStackPageContent,
  TanStackPageRouter,
  createTanStackPageRouter,
} from './TanStackPageRouter';

describe('createTanStackPageRouter', () => {
  it('keeps an optional parent scope outside a matched child during navigation', async () => {
    function ParentProbe() {
      const location = useLocation();
      const [count, setCount] = useState(0);
      return (
        <>
          <span>Scoped path: {location.pathname}</span>
          <button onClick={() => setCount(value => value + 1)}>
            Count {count}
          </button>
        </>
      );
    }
    const parent = createExtension({
      name: 'catalog',
      attachTo: { id: 'app/routes', input: 'routes' },
      inputs: {
        children: createExtensionInput([coreExtensionData.reactElement]),
      },
      output: [coreExtensionData.routePath, coreExtensionData.reactElement],
      factory({ node, inputs }) {
        return [
          coreExtensionData.routePath('/catalog/:id?'),
          coreExtensionData.reactElement(
            <ExtensionBoundary node={node}>
              <TanStackPageRouter>
                <ParentProbe />
                {inputs.children[0].get(coreExtensionData.reactElement)}
              </TanStackPageRouter>
            </ExtensionBoundary>,
          ),
        ];
      },
    });
    const child = createExtension({
      name: 'edit',
      attachTo: { id: 'test/catalog', input: 'children' },
      output: [coreExtensionData.routePath, coreExtensionData.reactElement],
      factory({ node }) {
        return [
          coreExtensionData.routePath('edit'),
          coreExtensionData.reactElement(
            <ExtensionBoundary node={node}>Edit child</ExtensionBoundary>,
          ),
        ];
      },
    });
    const { appHistory } = renderTestApp({
      extensions: [parent, child],
      initialRouteEntries: ['/catalog/edit'],
    });
    expect(await screen.findByText('Edit child')).toBeInTheDocument();
    expect(await screen.findByText('Scoped path: /edit')).toBeInTheDocument();
    await act(async () =>
      screen.getByRole('button', { name: 'Count 0' }).click(),
    );
    await act(async () => appHistory.navigate('/catalog/foo/edit'));
    expect(await screen.findByText('Scoped path: /edit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();
    await act(async () => appHistory.navigate('/catalog/edit'));
    expect(await screen.findByText('Scoped path: /edit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();
  });
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
  it('keeps TanStack back availability consistent with a custom host without entry facts', async () => {
    const inner = createMockAppHistory({ initialLocation: '/tools' });
    const appHistory: AppHistoryApi = {
      get location() {
        return inner.location;
      },
      location$: inner.location$,
      navigate: inner.navigate.bind(inner),
      createHref: inner.createHref.bind(inner),
    };
    function Probe() {
      const router = useRouter();
      const canGoBack = useCanGoBack();
      const location = useLocation();
      return (
        <div>
          <span>Location: {location.pathname}</span>
          <span>Hook back: {String(canGoBack)}</span>
          <span>History back: {String(router.history.canGoBack())}</span>
          <button type="button" onClick={() => router.navigate({ to: '/one' })}>
            Next
          </button>
          <button type="button" onClick={() => router.history.back()}>
            Back
          </button>
        </div>
      );
    }
    renderInTestApp(
      <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
        <TanStackPageRouter>
          <Probe />
        </TanStackPageRouter>
      </TestApiProvider>,
      {
        mountPath: '/tools',
        initialRouteEntries: ['/tools'],
      },
    );
    expect(await screen.findByText('Hook back: false')).toBeInTheDocument();
    await act(async () => screen.getByRole('button', { name: 'Next' }).click());
    expect(await screen.findByText('Location: /one')).toBeInTheDocument();
    expect(screen.getByText('Hook back: false')).toBeInTheDocument();
    expect(screen.getByText('History back: false')).toBeInTheDocument();
    await act(async () => screen.getByRole('button', { name: 'Back' }).click());
    expect(await screen.findByText('Location: /')).toBeInTheDocument();
    expect(inner.location.pathname).toBe('/tools');
  });
});
