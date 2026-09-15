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

import { createElement } from 'react';
import { act, screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { Route, Routes } from 'react-router-dom';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { pagesPlugin } from './examples/pagesPlugin';

// Exercise actual exported pages and their loaders. Importing an adapter does
// not prove that a page renders its content inside it.
describe('production page router declarations', () => {
  it("scopes the example page's own routes and links through its declared adapter", async () => {
    const { appHistory } = renderTestApp({
      extensions: [
        pagesPlugin.getExtension('page:pages/index'),
        pagesPlugin.getExtension('page:pages/page1'),
        pagesPlugin.getExtension('page:pages/pageX'),
      ],
      initialRouteEntries: ['/page1'],
    });

    expect(
      await screen.findByRole('heading', { name: 'This is also page 1' }),
    ).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Page 2' });
    expect(link).toHaveAttribute('href', '/page1/page2');
    await act(async () => link.click());
    expect(
      await screen.findByRole('heading', { name: 'This is page 2' }),
    ).toBeInTheDocument();
    expect(appHistory.location.pathname).toBe('/page1/page2');

    await act(async () => appHistory.navigate(-1));
    expect(
      await screen.findByRole('heading', { name: 'This is also page 1' }),
    ).toBeInTheDocument();
    expect(appHistory.location.pathname).toBe('/page1');
  });

  it('keeps the published settings page navigable in the old frontend', async () => {
    await renderInTestApp(
      createElement(TestApiProvider, {
        apis: [[catalogApiRef, catalogApiMock()]],
        children: createElement(
          Routes,
          {},
          createElement(Route, {
            path: '/settings/*',
            element: createElement(UserSettingsPage),
          }),
        ),
      }),
      {
        routeEntries: ['/settings'],
        mountedRoutes: { '/catalog/:namespace/:kind/:name': entityRouteRef },
      },
    );
    const featureFlags = await screen.findByRole('tab', {
      name: 'Feature Flags',
    });
    expect(featureFlags).toHaveAttribute('href', '/settings/feature-flags');
    await act(async () => featureFlags.click());
    expect(
      await screen.findByRole('heading', { name: 'No Feature Flags' }),
    ).toBeInTheDocument();
  });
});
