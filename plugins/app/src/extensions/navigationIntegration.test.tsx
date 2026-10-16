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

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { PageBlueprint, useNavigation } from '@backstage/frontend-plugin-api';
import { ReactRouterV6PageRouter } from '@backstage/plugin-app-react-router-v6';
import { Routes, Route, Outlet } from 'react-router-dom';
import {
  RouterProvider,
  Link,
  GridList,
  GridListItem,
} from 'react-aria-components';

function Controls() {
  const navigation = useNavigation();
  return (
    <RouterProvider
      useHref={navigation.createHref}
      navigate={navigation.navigate}
    >
      <Link href="../sibling">Relative anchor</Link>
      <GridList aria-label="Routes">
        <GridListItem id="other" textValue="Other page" href="/catalog">
          Other page
        </GridListItem>
      </GridList>
    </RouterProvider>
  );
}

it('integrates React Aria anchors and non-anchor collection items using only the public contract', async () => {
  const user = userEvent.setup();
  const { appHistory } = renderTestApp({
    initialRouteEntries: ['/tools/section/item'],
    config: {
      app: { baseUrl: 'https://example.com/base' },
      backend: { baseUrl: 'http://localhost:7007' },
    },
    extensions: [
      PageBlueprint.make({
        name: 'tools',
        params: {
          path: '/tools',
          loader: async () => (
            <ReactRouterV6PageRouter>
              <Routes>
                <Route path="section" element={<Outlet />}>
                  <Route path="item" element={<Controls />} />
                  <Route path="sibling" element={<Controls />} />
                </Route>
              </Routes>
            </ReactRouterV6PageRouter>
          ),
        },
      }),
      PageBlueprint.make({
        name: 'other',
        params: {
          path: '/catalog',
          loader: async () => <div>Catalog destination</div>,
        },
      }),
    ],
  });
  expect(
    await screen.findByRole('link', { name: 'Relative anchor' }),
  ).toHaveAttribute('href', '/base/tools/section/sibling');
  await user.click(screen.getByRole('link', { name: 'Relative anchor' }));
  expect(appHistory.location.pathname).toBe('/tools/section/sibling');
  const row = await screen.findByRole('row', { name: 'Other page' });
  expect(row.tagName).not.toBe('A');
  await user.click(row);
  expect(await screen.findByText('Catalog destination')).toBeInTheDocument();
  expect(appHistory.location.pathname).toBe('/catalog');
});
