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

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import {
  catalogApiRef,
  entityRouteRef,
  EntityKindFilter,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { Cell } from '@backstage/ui';
import { NextCatalogPage } from './NextCatalogPage';
import type { CatalogColumnHeader } from '@backstage/plugin-catalog-react/alpha';

function SeedKindFilter() {
  const { updateFilters } = useEntityList();
  useEffect(() => {
    updateFilters({ kind: new EntityKindFilter('component', 'Component') });
  }, [updateFilters]);
  return null;
}

const columns: Array<{
  header: CatalogColumnHeader;
  cell: () => ReactElement;
}> = [
  {
    header: { id: 'name', label: 'Name', orderField: 'metadata.name' },
    cell: () => <Cell>cell-name</Cell>,
  },
  {
    header: { id: 'kind', label: 'Kind' },
    cell: () => <Cell>cell-kind</Cell>,
  },
];

describe('NextCatalogPage', () => {
  it('renders a column header for each provided column', async () => {
    const catalogApi = catalogApiMock.mock({
      queryEntities: jest.fn().mockResolvedValue({
        items: [],
        pageInfo: {},
        totalItems: 0,
      }),
    });

    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <NextCatalogPage filters={null} columns={columns} pagination />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(
      await screen.findByRole('columnheader', { name: 'Name' }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('columnheader', { name: 'Kind' }),
    ).toBeInTheDocument();
  });

  it('renders one row per entity from useEntityList', async () => {
    const entityA = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'alpha', namespace: 'default' },
    };
    const entityB = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'beta', namespace: 'default' },
    };

    const catalogApi = catalogApiMock.mock({
      queryEntities: jest.fn().mockResolvedValue({
        items: [entityA, entityB],
        pageInfo: {},
        totalItems: 2,
      }),
    });

    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <NextCatalogPage
          filters={<SeedKindFilter />}
          columns={[
            {
              header: { id: 'name', label: 'Name' },
              cell: entity => <Cell>{entity.metadata.name}</Cell>,
            },
          ]}
          pagination
        />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(await screen.findByText('alpha')).toBeInTheDocument();
    expect(await screen.findByText('beta')).toBeInTheDocument();
  });

  it('dispatches an EntityOrderFilter when a sortable header is clicked', async () => {
    const user = userEvent.setup();
    const mockCatalogApi = catalogApiMock.mock({
      queryEntities: jest.fn().mockResolvedValue({
        items: [],
        pageInfo: {},
        totalItems: 0,
      }),
    });

    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApi]]}>
        <NextCatalogPage
          filters={<SeedKindFilter />}
          columns={[
            {
              header: {
                id: 'name',
                label: 'Name',
                orderField: 'metadata.name',
              },
              cell: entity => <Cell>{entity.metadata.name}</Cell>,
            },
          ]}
          pagination
        />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    // Wait for the initial fetch to settle.
    await screen.findByRole('columnheader', { name: 'Name' });
    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalled();
    });

    mockCatalogApi.queryEntities.mockClear();
    // Click twice so the toggle yields a descending sort that differs from
    // the provider's default ascending order — otherwise the second fetch is
    // skipped because the backend filter is unchanged.
    await user.click(screen.getByRole('columnheader', { name: 'Name' }));
    await user.click(screen.getByRole('columnheader', { name: 'Name' }));

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          orderFields: [{ field: 'metadata.name', order: 'desc' }],
        }),
      );
    });
  });

  it('dispatches an EntityTextFilter with the union of searchFields when typing', async () => {
    const user = userEvent.setup();
    const mockCatalogApi = catalogApiMock.mock({
      queryEntities: jest.fn().mockResolvedValue({
        items: [],
        pageInfo: {},
        totalItems: 0,
      }),
    });

    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApi]]}>
        <NextCatalogPage
          filters={<SeedKindFilter />}
          columns={[
            {
              header: {
                id: 'name',
                label: 'Name',
                searchFields: ['metadata.name', 'metadata.title'],
              },
              cell: entity => <Cell>{entity.metadata.name}</Cell>,
            },
            {
              header: {
                id: 'tags',
                label: 'Tags',
                searchFields: ['metadata.tags'],
              },
              cell: entity => (
                <Cell>{(entity.metadata.tags ?? []).join(',')}</Cell>
              ),
            },
          ]}
          pagination
        />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    // Wait for the page to render.
    await screen.findByRole('columnheader', { name: 'Name' });

    mockCatalogApi.queryEntities.mockClear();
    const search = await screen.findByRole('searchbox', { name: /search/i });
    await user.type(search, 'foo');

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          fullTextFilter: {
            term: 'foo',
            fields: ['metadata.name', 'metadata.title', 'metadata.tags'],
          },
        }),
      );
    });
  });

  it('links each row to the entity page route', async () => {
    const mockCatalogApi = catalogApiMock.mock({
      queryEntities: jest.fn().mockResolvedValueOnce({
        items: [
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: { name: 'alpha', namespace: 'default' },
          },
        ],
        pageInfo: {},
        totalItems: 1,
      }),
    });

    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApi]]}>
        <NextCatalogPage
          filters={<SeedKindFilter />}
          columns={[
            {
              header: { id: 'name', label: 'Name' },
              cell: entity => <Cell>{entity.metadata.name}</Cell>,
            },
          ]}
          pagination
        />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    // BUI's `Table` exposes the resolved row href via the `data-href`
    // attribute on the row element rather than rendering an inner `<a>`.
    const cell = await screen.findByRole('rowheader', { name: 'alpha' });
    const row = cell.closest('[role="row"]');
    expect(row).toHaveAttribute(
      'data-href',
      '/catalog/default/component/alpha',
    );
  });

  it('renders an empty cell for entities the column filter rejects', async () => {
    const componentEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'alpha', namespace: 'default' },
    };
    const apiEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'beta', namespace: 'default' },
    };

    const mockCatalogApi = catalogApiMock.mock({
      queryEntities: jest.fn().mockResolvedValueOnce({
        items: [componentEntity, apiEntity],
        pageInfo: {},
        totalItems: 2,
      }),
    });

    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApi]]}>
        <NextCatalogPage
          filters={<SeedKindFilter />}
          columns={[
            {
              header: {
                id: 'lifecycle',
                label: 'Lifecycle',
                filter: entity => entity.kind === 'Component',
              },
              cell: () => (
                <Cell>
                  <span data-testid="lifecycle-cell">prod</span>
                </Cell>
              ),
            },
          ]}
          pagination
        />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    // Wait for both data rows (plus the header row) to render.
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(3));

    // Only one of the two entity rows should render the lifecycle cell content.
    expect(screen.getAllByTestId('lifecycle-cell')).toHaveLength(1);
  });
});
