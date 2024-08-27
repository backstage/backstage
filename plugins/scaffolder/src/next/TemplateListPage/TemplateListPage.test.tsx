/*
 * Copyright 2022 The Backstage Authors
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
import { DefaultStarredEntitiesApi } from '@backstage/plugin-catalog';
import {
  catalogApiRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  MockStorageApi,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import React from 'react';
import { rootRouteRef } from '../../routes';
import { TemplateListPage } from './TemplateListPage';

describe('TemplateListPage', () => {
  const mockCatalogApi = {
    getEntities: async () => ({
      items: [
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Template',
          metadata: { name: 'blob', tags: ['blob'] },
          spec: {
            type: 'service',
          },
        },
      ],
    }),
    getEntityFacets: async () => ({
      facets: { 'spec.type': [{ value: 'service', count: 1 }] },
    }),
    getEntitiesByRefs: async () => ({
      items: [],
    }),
  };

  it('should render the search bar for templates', async () => {
    const { getByPlaceholderText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: MockStorageApi.create(),
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      { mountedRoutes: { '/': rootRouteRef } },
    );

    expect(getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('should render the all and starred filters', async () => {
    const { getByRole } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: MockStorageApi.create(),
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      { mountedRoutes: { '/': rootRouteRef } },
    );

    expect(getByRole('menuitem', { name: /All/ })).toBeInTheDocument();
    expect(getByRole('menuitem', { name: /Starred/ })).toBeInTheDocument();
  });

  it('should render the category picker', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: MockStorageApi.create(),
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      { mountedRoutes: { '/': rootRouteRef } },
    );

    expect(getByText('Categories')).toBeInTheDocument();
  });

  it('should render the EntityOwnerPicker', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: MockStorageApi.create(),
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      { mountedRoutes: { '/': rootRouteRef } },
    );

    expect(getByText('Owner')).toBeInTheDocument();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should render the EntityTag picker', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: MockStorageApi.create(),
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
    );

    expect(getByText('Tags')).toBeInTheDocument();
  });

  describe('scaffolder page context menu', () => {
    it('should render if context menu props are not set to false', async () => {
      const { queryByTestId } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockCatalogApi],
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: MockStorageApi.create(),
              }),
            ],
            [permissionApiRef, {}],
          ]}
        >
          <TemplateListPage />
        </TestApiProvider>,
        { mountedRoutes: { '/': rootRouteRef } },
      );
      expect(queryByTestId('menu-button')).toBeInTheDocument();
    });

    it('should not render if context menu props are set to false', async () => {
      const { queryByTestId } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockCatalogApi],
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: MockStorageApi.create(),
              }),
            ],
            [permissionApiRef, {}],
          ]}
        >
          <TemplateListPage
            contextMenu={{
              editor: false,
              actions: false,
              tasks: false,
            }}
          />
        </TestApiProvider>,
        { mountedRoutes: { '/': rootRouteRef } },
      );
      expect(queryByTestId('menu-button')).not.toBeInTheDocument();
    });
  });
});
