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

import { QueryEntitiesInitialRequest } from '@backstage/catalog-client';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { TableColumn, TableProps } from '@backstage/core-components';
import { identityApiRef, storageApiRef } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  entityRouteRef,
  MockStarredEntitiesApi,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { mockBreakpoint } from '@backstage/core-components/testUtils';
import {
  TestApiProvider,
  mockApis,
  renderInTestApp,
} from '@backstage/test-utils';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { createComponentRouteRef } from '../../routes';
import { CatalogTableRow } from '../CatalogTable';
import { DefaultCatalogPage } from './DefaultCatalogPage';

import { CatalogTableColumnsFunc } from '../CatalogTable/types';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

describe('DefaultCatalogPage', () => {
  const origReplaceState = window.history.replaceState;
  beforeEach(() => {
    window.history.replaceState = jest.fn();
  });
  afterEach(() => {
    window.history.replaceState = origReplaceState;
    jest.clearAllMocks();
  });

  const catalogApi = catalogApiMock.mock({
    getEntities: jest.fn().mockImplementation(() =>
      Promise.resolve({
        items: [
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'Entity1',
              namespace: 'default',
            },
            spec: {
              owner: 'tools',
              type: 'service',
            },
            relations: [
              {
                type: RELATION_OWNED_BY,
                targetRef: 'group:default/tools',
              },
            ],
          },
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'Entity2',
              namespace: 'default',
            },
            spec: {
              owner: 'not-tools',
              type: 'service',
            },
            relations: [
              {
                type: RELATION_OWNED_BY,
                targetRef: 'group:default/not-tools',
                target: {
                  kind: 'group',
                  name: 'not-tools',
                  namespace: 'default',
                },
              },
            ],
          },
        ],
      }),
    ),
    getLocationByRef: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ id: 'id', type: 'url', target: 'url' }),
      ),
    getEntityFacets: jest.fn().mockImplementation(async () => ({
      facets: {
        'relations.ownedBy': [
          { count: 1, value: 'group:default/not-tools' },
          { count: 1, value: 'group:default/tools' },
        ],
      },
    })),
    getEntitiesByRefs: jest.fn().mockImplementation(async () => ({
      items: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Group',
          metadata: {
            name: 'not-tools',
            namespace: 'default',
          },
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Group',
          metadata: {
            name: 'tools',
            namespace: 'default',
          },
        },
      ],
    })),
    queryEntities: jest
      .fn()
      .mockImplementation(async (request: QueryEntitiesInitialRequest) => {
        if ((request.filter as any)['relations.ownedBy']) {
          // owned entities
          return { items: [], totalItems: 3, pageInfo: {} };
        }

        if ((request.filter as any)['metadata.name']) {
          // starred entities
          return {
            items: [
              {
                apiVersion: '1',
                kind: 'component',
                metadata: { name: 'Entity1', namespace: 'default' },
              },
            ],
            totalItems: 1,
            pageInfo: {},
          };
        }
        // all items
        return { items: [], totalItems: 2, pageInfo: {} };
      }),
  });

  const identityApi = mockApis.identity({
    userEntityRef: 'user:default/guest',
    ownershipEntityRefs: ['user:default/guest', 'group:default/tools'],
    displayName: 'Display Name',
  });

  const renderWrapped = (children: React.ReactNode) =>
    renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [identityApiRef, identityApi],
          [storageApiRef, mockApis.storage()],
          [starredEntitiesApiRef, new MockStarredEntitiesApi()],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        {children}
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/create': createComponentRouteRef,
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

  // TODO(freben): The test timeouts are bumped in this file, because it seems
  // page and table rerenders accumulate to occasionally go over the default
  // limit. We should investigate why these timeouts happen.

  it('should render the default column of the grid', async () => {
    await renderWrapped(<DefaultCatalogPage />);

    const columnHeader = screen
      .getAllByRole('button')
      .filter(c => c.tagName === 'SPAN');
    const columnHeaderLabels = columnHeader.map(c => c.textContent);

    expect(columnHeaderLabels).toEqual([
      'Name',
      'System',
      'Owner',
      'Type',
      'Lifecycle',
      'Description',
      'Tags',
      'Actions',
    ]);
  }, 20_000);

  it('should render the custom column passed as prop', async () => {
    const columns: TableColumn<CatalogTableRow>[] = [
      { title: 'Foo', field: 'entity.foo' },
      { title: 'Bar', field: 'entity.bar' },
      { title: 'Baz', field: 'entity.spec.lifecycle' },
    ];
    await renderWrapped(<DefaultCatalogPage columns={columns} />);

    const columnHeader = screen
      .getAllByRole('button')
      .filter(c => c.tagName === 'SPAN');
    const columnHeaderLabels = columnHeader.map(c => c.textContent);
    expect(columnHeaderLabels).toEqual(['Foo', 'Bar', 'Baz', 'Actions']);
  }, 20_000);

  it('should render the custom column function passed as prop', async () => {
    const columns: CatalogTableColumnsFunc = ({ filters, entities }) => {
      return filters.kind?.value === 'component' && entities.length
        ? [
            { title: 'Foo', field: 'entity.foo' },
            { title: 'Bar', field: 'entity.bar' },
            { title: 'Baz', field: 'entity.spec.lifecycle' },
          ]
        : [];
    };
    await renderWrapped(<DefaultCatalogPage columns={columns} />);

    const columnHeader = screen
      .getAllByRole('button')
      .filter(c => c.tagName === 'SPAN');
    const columnHeaderLabels = columnHeader.map(c => c.textContent);
    expect(columnHeaderLabels).toEqual(['Foo', 'Bar', 'Baz', 'Actions']);
  }, 20_000);

  it('should render the default actions of an item in the grid', async () => {
    await renderWrapped(<DefaultCatalogPage />);
    await waitFor(() => expect(catalogApi.queryEntities).toHaveBeenCalled());

    fireEvent.click(screen.getByTestId('user-picker-owned'));
    await expect(
      screen.findByText(/Owned Components \(1\)/),
    ).resolves.toBeInTheDocument();
    await expect(screen.findByTitle(/View/)).resolves.toBeInTheDocument();
    await expect(screen.findByTitle(/Edit/)).resolves.toBeInTheDocument();
    await expect(
      screen.findByTitle(/Add to favorites/),
    ).resolves.toBeInTheDocument();
  }, 20_000);

  it('should render the custom actions of an item passed as prop', async () => {
    const actions: TableProps<CatalogTableRow>['actions'] = [
      () => {
        return {
          icon: () => <DashboardIcon fontSize="small" />,
          tooltip: 'Foo Action',
          disabled: false,
          onClick: () => jest.fn(),
        };
      },
      () => {
        return {
          icon: () => <DashboardIcon fontSize="small" />,
          tooltip: 'Bar Action',
          disabled: true,
          onClick: () => jest.fn(),
        };
      },
    ];

    await renderWrapped(<DefaultCatalogPage actions={actions} />);
    await waitFor(() => expect(catalogApi.queryEntities).toHaveBeenCalled());

    fireEvent.click(screen.getByTestId('user-picker-owned'));
    await expect(
      screen.findByText(/Owned Components \(1\)/),
    ).resolves.toBeInTheDocument();
    await expect(screen.findByTitle(/Foo Action/)).resolves.toBeInTheDocument();
    await expect(screen.findByTitle(/Bar Action/)).resolves.toBeInTheDocument();
    await expect(
      screen.findByTitle(/Bar Action/).then(e => e.firstChild),
    ).resolves.toBeDisabled();
  }, 20_000);

  // this test right now causes some red lines in the log output when running tests
  // related to some theme issues in mui-table
  // https://github.com/mbrn/material-table/issues/1293
  it('should render', async () => {
    await renderWrapped(<DefaultCatalogPage />);
    await waitFor(() => expect(catalogApi.queryEntities).toHaveBeenCalled());

    fireEvent.click(screen.getByTestId('user-picker-owned'));

    await expect(
      screen.findByText(/Owned Components \(1\)/),
    ).resolves.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('user-picker-all'));
    await expect(
      screen.findByText(/All Components \(2\)/),
    ).resolves.toBeInTheDocument();
  }, 20_000);

  it('should set initial filter correctly', async () => {
    await renderWrapped(<DefaultCatalogPage initiallySelectedFilter="all" />);
    await expect(
      screen.findByText(/All Components \(2\)/),
    ).resolves.toBeInTheDocument();
  }, 20_000);

  // this test is for fixing the bug after favoriting an entity, the matching
  // entities defaulting to "owned" filter and not based on the selected filter
  it('should render the correct entities filtered on the selected filter', async () => {
    await renderWrapped(<DefaultCatalogPage />);
    await waitFor(() => expect(catalogApi.queryEntities).toHaveBeenCalled());

    fireEvent.click(screen.getByTestId('user-picker-owned'));
    await expect(
      screen.findByText(/Owned Components \(1\)/),
    ).resolves.toBeInTheDocument();
    // The "Starred" menu option should initially be disabled, since there
    // aren't any starred entities.
    expect(screen.getByTestId('user-picker-starred')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    fireEvent.click(screen.getByTestId('user-picker-all'));
    await expect(
      screen.findByText(/All Components \(2\)/),
    ).resolves.toBeInTheDocument();

    const starredIcons = await screen.findAllByTitle('Add to favorites');
    fireEvent.click(starredIcons[0]);
    await expect(
      screen.findByText(/All Components \(2\)/),
    ).resolves.toBeInTheDocument();

    // Now that we've starred an entity, the "Starred" menu option should be
    // enabled.
    expect(
      await screen.findByTestId('user-picker-starred'),
    ).not.toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(screen.getByTestId('user-picker-starred'));
    await expect(
      screen.findByText(/Starred components \(1\)/),
    ).resolves.toBeInTheDocument();
  }, 20_000);

  it('should wrap filter in drawer on smaller screens', async () => {
    mockBreakpoint({ matches: true });
    await renderWrapped(<DefaultCatalogPage />);
    const button = screen.getByRole('button', { name: 'Filters' });
    expect(
      screen.getByRole('presentation', { hidden: true }),
    ).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByRole('presentation')).toBeVisible();
  }, 20_000);
});
