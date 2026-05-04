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
});
