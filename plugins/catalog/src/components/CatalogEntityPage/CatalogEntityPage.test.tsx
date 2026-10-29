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

import { Entity } from '@backstage/catalog-model';
import { ApiProvider } from '@backstage/core-app-api';
import { alertApiRef } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  entityRouteRef,
  starredEntitiesApiRef,
  MockStarredEntitiesApi,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { mockApis } from '@backstage/frontend-test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { CatalogEntityPage } from './CatalogEntityPage';
import { EntityLayout } from '../EntityLayout';
import { rootRouteRef } from '../../routes';

describe('CatalogEntityPage', () => {
  const renamedEntity: Entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      namespace: 'default',
      name: 'new-name',
      annotations: { 'backstage.io/former-names': 'old-name' },
    },
    spec: { type: 'service', owner: 'me', lifecycle: 'production' },
  };

  const apis = TestApiRegistry.from(
    [catalogApiRef, catalogApiMock({ entities: [renamedEntity] })],
    [alertApiRef, mockApis.alert()],
    [starredEntitiesApiRef, new MockStarredEntitiesApi()],
    [permissionApiRef, mockApis.permission()],
  );

  const renderPage = (entry: string) =>
    renderInTestApp(
      <ApiProvider apis={apis}>
        <Routes>
          <Route
            path="/catalog/:namespace/:kind/:name/*"
            element={<CatalogEntityPage />}
          >
            <Route
              path="*"
              element={
                <EntityLayout>
                  <EntityLayout.Route path="/" title="Overview">
                    <div>overview-content</div>
                  </EntityLayout.Route>
                  <EntityLayout.Route path="/docs" title="Docs">
                    <div>docs-content</div>
                  </EntityLayout.Route>
                </EntityLayout>
              }
            />
          </Route>
        </Routes>
      </ApiProvider>,
      {
        routeEntries: [entry],
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/catalog': rootRouteRef,
        },
      },
    );

  it('redirects an old entity URL to the renamed entity and shows a dismissible notice', async () => {
    await renderPage('/catalog/default/component/old-name/docs');

    expect(await screen.findByText('docs-content')).toBeInTheDocument();
    expect(screen.getAllByText('new-name').length).toBeGreaterThan(0);
    expect(
      await screen.findByText(
        'This entity was renamed from component:default/old-name',
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

    await waitFor(() =>
      expect(
        screen.queryByText(
          'This entity was renamed from component:default/old-name',
        ),
      ).not.toBeInTheDocument(),
    );
    expect(screen.getByText('docs-content')).toBeInTheDocument();
  });

  it('still shows Entity not found for an unknown name', async () => {
    await renderPage('/catalog/default/component/unknown/docs');

    expect(await screen.findByText(/Entity not found/)).toBeInTheDocument();
    expect(
      screen.queryByText(/This entity was renamed from/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Dismiss' }),
    ).not.toBeInTheDocument();
  });
});
