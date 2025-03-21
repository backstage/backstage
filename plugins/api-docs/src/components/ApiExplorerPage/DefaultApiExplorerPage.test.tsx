/*
 * Copyright 2021 The Backstage Authors
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

import { TableColumn, TableProps } from '@backstage/core-components';
import { configApiRef, storageApiRef } from '@backstage/core-plugin-api';
import {
  CatalogTableRow,
  DefaultStarredEntitiesApi,
} from '@backstage/plugin-catalog';
import {
  catalogApiRef,
  entityRouteRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import {
  mockApis,
  TestApiProvider,
  renderInTestApp,
} from '@backstage/test-utils';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { apiDocsConfigRef } from '../../config';
import { DefaultApiExplorerPage } from './DefaultApiExplorerPage';
import { permissionApiRef } from '@backstage/plugin-permission-react';

describe('DefaultApiExplorerPage', () => {
  const catalogApi = catalogApiMock.mock({
    getEntities: () =>
      Promise.resolve({
        items: [
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'API',
            metadata: {
              name: 'Entity1',
              annotations: {
                'backstage.io/view-url': 'viewurl',
                'backstage.io/edit-url': 'editurl',
              },
            },
            spec: { type: 'openapi' },
          },
        ],
      }),
    getLocationByRef: () =>
      Promise.resolve({ id: 'id', type: 'url', target: 'url' }),
    getEntitiesByRefs: () => Promise.resolve({ items: [] }),
    getEntityFacets: async () => ({
      facets: { 'relations.ownedBy': [] },
    }),
    queryEntities: async () => ({
      items: [],
      pageInfo: {},
      totalItems: 0,
    }),
  });

  const configApi = mockApis.config({
    data: { organization: { name: 'My Company' } },
  });

  const apiDocsConfig = {
    getApiDefinitionWidget: () => undefined,
  };

  const storageApi = mockApis.storage();

  const renderWrapped = (children: React.ReactNode) =>
    renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [configApiRef, configApi],
          [storageApiRef, storageApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({ storageApi }),
          ],
          [apiDocsConfigRef, apiDocsConfig],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        {children}
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

  // this test right now causes some red lines in the log output when running tests
  // related to some theme issues in mui-table
  // https://github.com/mbrn/material-table/issues/1293
  it('should render', async () => {
    await renderWrapped(<DefaultApiExplorerPage />);
    expect(
      await screen.findByText(/My Company API Explorer/),
    ).toBeInTheDocument();
  });

  it('should render the default column of the grid', async () => {
    await renderWrapped(<DefaultApiExplorerPage />);

    const columnHeader = screen
      .getAllByRole('button')
      .filter(c => c.tagName === 'SPAN');
    const columnHeaderLabels = columnHeader.map(c => c.textContent);

    await waitFor(() =>
      expect(columnHeaderLabels).toEqual([
        'Name',
        'System',
        'Owner',
        'Type',
        'Lifecycle',
        'Description',
        'Tags',
        'Actions',
      ]),
    );
  });

  it('should render the custom column passed as prop', async () => {
    const columns: TableColumn<CatalogTableRow>[] = [
      { title: 'Foo', field: 'entity.foo' },
      { title: 'Bar', field: 'entity.bar' },
      { title: 'Baz', field: 'entity.spec.lifecycle' },
    ];
    await renderWrapped(<DefaultApiExplorerPage columns={columns} />);

    const columnHeader = screen
      .getAllByRole('button')
      .filter(c => c.tagName === 'SPAN');
    const columnHeaderLabels = columnHeader.map(c => c.textContent);

    await waitFor(() =>
      expect(columnHeaderLabels).toEqual(['Foo', 'Bar', 'Baz', 'Actions']),
    );
  });

  it('should render the default actions of an item in the grid', async () => {
    await renderWrapped(<DefaultApiExplorerPage />);
    await waitFor(() => {
      expect(screen.getByText(/All apis \(1\)/)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByTitle(/Add to favorites/)).toBeInTheDocument();
  });

  it('should render the custom actions of an item passed as prop', async () => {
    const actions: TableProps<CatalogTableRow>['actions'] = [
      {
        icon: () => <DashboardIcon fontSize="small" />,
        tooltip: 'Foo Action',
        disabled: false,
        onClick: jest.fn(),
      },
      {
        icon: () => <DashboardIcon fontSize="small" />,
        tooltip: 'Bar Action',
        disabled: true,
        onClick: jest.fn(),
      },
    ];

    await renderWrapped(<DefaultApiExplorerPage actions={actions} />);
    await waitFor(() => {
      expect(screen.getByText(/All apis \(1\)/)).toBeInTheDocument();
    });
    expect(screen.getByTitle(/Foo Action/)).toBeInTheDocument();
    expect(screen.getByTitle(/Bar Action/)).toBeInTheDocument();
    expect(screen.getByTitle(/Bar Action/).firstChild).toBeDisabled();
  });
});
