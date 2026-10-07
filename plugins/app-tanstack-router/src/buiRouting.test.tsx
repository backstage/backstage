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
} from '@backstage/frontend-plugin-api';
import {
  Link as BuiLink,
  ButtonLink,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from '@backstage/ui';
import {
  Link,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { createTanStackPageRouter } from './TanStackPageRouter';

it('uses the consuming library route for BUI links and preserves app-absolute route refs', async () => {
  const user = userEvent.setup();
  const otherRef = createRouteRef();
  function Controls() {
    const other = useRouteRef(otherRef)!();
    return (
      <>
        <Link to="../sibling">Native relative</Link>
        <BuiLink href="../sibling">BUI relative</BuiLink>
        <ButtonLink
          href="?view=docs#intro"
          routerOptions={{ replace: true, state: { source: 'bui' } }}
        >
          Query
        </ButtonLink>
        <Link to={other}>Native other</Link>
        <BuiLink href={other}>BUI other</BuiLink>
        <BuiLink href="https://example.com">External</BuiLink>
        <Tabs>
          <TabList>
            <Tab id="sibling" href="../sibling">
              Sibling tab
            </Tab>
          </TabList>
          <TabPanel id="sibling">Panel</TabPanel>
        </Tabs>
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
    await screen.findByRole('link', { name: 'BUI relative' }),
  ).toHaveAttribute('href', '/base/tools/alpha/section/sibling');
  expect(screen.getByRole('link', { name: 'Native relative' })).toHaveAttribute(
    'href',
    '/base/tools/alpha/section/sibling',
  );
  expect(screen.getByRole('tab', { name: 'Sibling tab' })).toHaveAttribute(
    'href',
    '/base/tools/alpha/section/sibling',
  );
  for (const name of ['Native other', 'BUI other']) {
    expect(screen.getByRole('link', { name })).toHaveAttribute(
      'href',
      '/base/catalog',
    );
  }
  expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
    'href',
    'https://example.com',
  );
  await user.click(screen.getByRole('link', { name: 'Query' }));
  expect(appHistory.location).toMatchObject({
    pathname: '/tools/alpha/section/item',
    search: '?view=docs',
    hash: '#intro',
    state: { source: 'bui' },
  });
  await user.click(screen.getByRole('link', { name: 'BUI relative' }));
  expect(appHistory.location.pathname).toBe('/tools/alpha/section/sibling');
  await user.click(screen.getByRole('link', { name: 'BUI other' }));
  expect(await screen.findByText('Other page')).toBeInTheDocument();
  expect(appHistory.location.pathname).toBe('/catalog');
  await act(async () => appHistory.navigate(-1));
  await user.click(await screen.findByRole('link', { name: 'Native other' }));
  expect(await screen.findByText('Other page')).toBeInTheDocument();
  expect(appHistory.location.pathname).toBe('/catalog');
});
