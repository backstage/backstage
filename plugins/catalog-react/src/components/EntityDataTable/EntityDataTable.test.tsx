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
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CellText } from '@backstage/ui';
import { EntityDataTable } from './EntityDataTable';
import { EntityColumnConfig } from './columnFactories';
import { entityRouteRef } from '../../routes';

const columns: EntityColumnConfig[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    isSortable: true,
    cell: entity => <CellText title={entity.metadata.name} />,
    sortValue: entity => entity.metadata.name,
  },
  {
    id: 'description',
    label: 'Description',
    cell: entity => <CellText title={entity.metadata.description ?? ''} />,
  },
];

const entities: Entity[] = [
  {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: { name: 'bravo', namespace: 'default', description: 'Second' },
  },
  {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: { name: 'alpha', namespace: 'default', description: 'First' },
  },
];

describe('<EntityDataTable />', () => {
  it('renders entity data in a table', async () => {
    await renderInTestApp(
      <EntityDataTable columnConfig={columns} data={entities} />,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('bravo')).toBeInTheDocument();
    expect(screen.getByText('alpha')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('First')).toBeInTheDocument();
  });

  it('renders empty state when data is empty', async () => {
    await renderInTestApp(
      <EntityDataTable
        columnConfig={columns}
        data={[]}
        emptyState={<div>No entities found</div>}
      />,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('No entities found')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    await renderInTestApp(
      <EntityDataTable
        columnConfig={columns}
        data={[]}
        error={new Error('Something went wrong')}
      />,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });

  it('sorts data when clicking a sortable column header', async () => {
    await renderInTestApp(
      <EntityDataTable columnConfig={columns} data={entities} />,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const rows = () => screen.getAllByRole('row').slice(1); // skip header row

    // Initial order: bravo, alpha (insertion order)
    expect(rows()[0]).toHaveTextContent('bravo');
    expect(rows()[1]).toHaveTextContent('alpha');

    // Click Name header to sort ascending
    await userEvent.click(screen.getByText('Name'));

    expect(rows()[0]).toHaveTextContent('alpha');
    expect(rows()[1]).toHaveTextContent('bravo');

    // Click again to sort descending
    await userEvent.click(screen.getByText('Name'));

    expect(rows()[0]).toHaveTextContent('bravo');
    expect(rows()[1]).toHaveTextContent('alpha');
  });

  it('shows all rows after loading completes', async () => {
    const { rerender } = await renderInTestApp(
      <EntityDataTable columnConfig={columns} data={[]} loading />,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    rerender(<EntityDataTable columnConfig={columns} data={entities} />);

    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('bravo');
    expect(rows[1]).toHaveTextContent('alpha');
  });

  it('does not sort when column has no sortValue', async () => {
    const unsortableColumns: EntityColumnConfig[] = [
      {
        id: 'name',
        label: 'Name',
        isRowHeader: true,
        cell: entity => <CellText title={entity.metadata.name} />,
      },
    ];

    await renderInTestApp(
      <EntityDataTable columnConfig={unsortableColumns} data={entities} />,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const rows = () => screen.getAllByRole('row').slice(1);

    // Should maintain insertion order
    expect(rows()[0]).toHaveTextContent('bravo');
    expect(rows()[1]).toHaveTextContent('alpha');
  });
});
