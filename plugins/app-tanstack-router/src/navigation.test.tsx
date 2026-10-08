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
import userEvent from '@testing-library/user-event';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  createRouteRef,
  PageBlueprint,
  useRouteRef,
  useNavigation,
  useAppNavigate,
  RouterLink,
} from '@backstage/frontend-plugin-api';

import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { createTanStackPageRouter } from './TanStackPageRouter';

it('binds neutral anchors and collection navigation to nested routes', async () => {
  const user = userEvent.setup();
  const otherRef = createRouteRef();
  function Controls() {
    const other = useRouteRef(otherRef)!();
    const navigation = useNavigation();
    const strictNavigate = useAppNavigate();
    const activate = () =>
      navigation.navigate('../sibling', { state: { source: 'collection' } });
    return (
      <>
        <RouterLink href="../sibling">Relative anchor</RouterLink>
        <RouterLink href={other}>Other page anchor</RouterLink>
        <RouterLink href="https://example.com">External</RouterLink>
        <output aria-label="Collection href">
          {navigation.createHref('../sibling')}
        </output>
        <output aria-label="Pathname">{navigation.pathname}</output>
        <div role="grid">
          <div
            role="row"
            tabIndex={0}
            onClick={activate}
            onKeyDown={event => {
              if (event.key === 'Enter') activate();
            }}
          >
            <span role="gridcell">Collection relative</span>
          </div>
        </div>
        <button
          onClick={() =>
            navigation.navigate('?view=docs#intro', { replace: true })
          }
        >
          Query
        </button>
        <button
          onClick={() => {
            expect(() => strictNavigate('../sibling')).toThrow(
              'App routing requires',
            );
            strictNavigate('/catalog');
          }}
        >
          Strict navigation
        </button>
      </>
    );
  }

  const PageRouter = createTanStackPageRouter({
    createRouter: ({ history, routePaths }) => {
      const root = createRootRoute({ component: Outlet });
      const mount = createRoute({
        getParentRoute: () => root,
        path: routePaths[0],
        component: Outlet,
      });
      const section = createRoute({
        getParentRoute: () => mount,
        path: 'section',
        component: Outlet,
      });
      const item = createRoute({
        getParentRoute: () => section,
        path: 'item',
        component: Controls,
      });
      const sibling = createRoute({
        getParentRoute: () => section,
        path: 'sibling',
        component: Controls,
      });
      return createRouter({
        history,
        routeTree: root.addChildren([
          mount.addChildren([section.addChildren([item, sibling])]),
        ]),
      });
    },
  });
  const page = PageBlueprint.make({
    name: 'tools',
    params: {
      path: '/tools/:name',
      loader: async () => <PageRouter />,
    },
  });
  const other = PageBlueprint.make({
    name: 'other',
    params: {
      path: '/catalog',
      routeRef: otherRef,
      loader: async () => <div>Other page</div>,
    },
  });
  const { appHistory } = renderTestApp({
    extensions: [page, other],
    initialRouteEntries: ['/tools/alpha/section/item'],
    config: {
      app: { baseUrl: 'https://example.com/base' },
      backend: { baseUrl: 'http://localhost:7007' },
    },
  });
  expect(
    await screen.findByRole('link', { name: 'Relative anchor' }),
  ).toHaveAttribute('href', '/base/tools/alpha/section/sibling');
  expect(
    screen.getByRole('status', { name: 'Collection href' }),
  ).toHaveTextContent('/base/tools/alpha/section/sibling');
  expect(screen.getByRole('status', { name: 'Pathname' })).toHaveTextContent(
    '/base/tools/alpha/section/item',
  );
  expect(
    screen.getByRole('link', { name: 'Other page anchor' }),
  ).toHaveAttribute('href', '/base/catalog');
  expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
    'href',
    'https://example.com',
  );
  await user.click(screen.getByRole('button', { name: 'Query' }));
  expect(appHistory.location).toMatchObject({
    pathname: '/tools/alpha/section/item',
    search: '?view=docs',
    hash: '#intro',
  });
  await user.click(screen.getByRole('row', { name: 'Collection relative' }));
  expect(appHistory.location).toMatchObject({
    pathname: '/tools/alpha/section/sibling',
    state: { source: 'collection' },
  });
  await act(async () => appHistory.navigate('/tools/alpha/section/item'));
  await user.click(
    await screen.findByRole('link', { name: 'Relative anchor' }),
  );
  expect(appHistory.location.pathname).toBe('/tools/alpha/section/sibling');
  await user.click(screen.getByRole('link', { name: 'Other page anchor' }));
  expect(await screen.findByText('Other page')).toBeInTheDocument();
  expect(appHistory.location.pathname).toBe('/catalog');
  await act(async () => appHistory.navigate('/tools/alpha/section/item'));
  await user.click(
    await screen.findByRole('button', { name: 'Strict navigation' }),
  );
  expect(await screen.findByText('Other page')).toBeInTheDocument();
  expect(appHistory.location.pathname).toBe('/catalog');
});
