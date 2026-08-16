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

import { fireEvent, render, screen, within } from '@testing-library/react';
import { CellText, Table } from '.';
import type { ColumnConfig, TableProps } from '.';

interface Item {
  id: number;
  name: string;
  owner: string;
}

const items: Item[] = [
  { id: 1, name: 'Component Library', owner: 'Design System' },
  { id: 2, name: 'API Gateway', owner: 'Platform' },
  { id: 3, name: 'Documentation Site', owner: 'DevEx' },
];

const columns: ColumnConfig<Item>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    cell: item => <CellText title={item.name} />,
  },
  {
    id: 'owner',
    label: 'Owner',
    cell: item => <CellText title={item.owner} />,
  },
];

function renderTable(props: Partial<TableProps<Item>> = {}) {
  const defaultProps: TableProps<Item> = {
    columnConfig: columns,
    data: items,
    pagination: { type: 'none' },
  };
  return render(<Table {...defaultProps} {...props} />);
}

describe('Table', () => {
  it('renders headers, rows and cells from the column config', () => {
    renderTable({
      columnConfig: [
        ...columns,
        {
          id: 'secret',
          label: 'Secret',
          isHidden: true,
          cell: item => <CellText title={String(item.id)} />,
        },
      ],
    });

    const grid = screen.getByRole('grid');
    expect(
      within(grid).getByRole('columnheader', { name: 'Name' }),
    ).toBeInTheDocument();
    expect(
      within(grid).getByRole('columnheader', { name: 'Owner' }),
    ).toBeInTheDocument();
    expect(
      within(grid).queryByRole('columnheader', { name: 'Secret' }),
    ).toBeNull();

    expect(
      within(grid).getByRole('row', { name: /Component Library/ }),
    ).toBeInTheDocument();
    expect(within(grid).getByText('Platform')).toBeInTheDocument();
    expect(within(grid).getByText('DevEx')).toBeInTheDocument();
  });

  it('renders the empty state when there is no data', () => {
    renderTable({ data: [], emptyState: 'No results found' });
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders the error state', () => {
    renderTable({ error: new Error('something broke') });
    expect(screen.getByText('Error: something broke')).toBeInTheDocument();
    expect(screen.queryByRole('grid')).toBeNull();
  });

  it('shows a skeleton during initial load and keeps data visible while stale', () => {
    const { rerender } = renderTable({ data: undefined, isPending: true });

    const grid = screen.getByRole('grid');
    expect(grid).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('Component Library')).toBeNull();
    expect(screen.getByText('Loading table data.')).toBeInTheDocument();

    rerender(
      <Table
        columnConfig={columns}
        data={items}
        pagination={{ type: 'none' }}
      />,
    );
    expect(screen.getByText('Component Library')).toBeInTheDocument();
    expect(screen.getByRole('grid')).not.toHaveAttribute('aria-busy', 'true');

    // A stale reload keeps the previous rows on screen.
    rerender(
      <Table
        columnConfig={columns}
        data={items}
        isPending
        isStale
        pagination={{ type: 'none' }}
      />,
    );
    expect(screen.getByText('Component Library')).toBeInTheDocument();
    expect(screen.getByRole('grid')).toHaveAttribute('aria-busy', 'true');
  });

  it('announces page changes to assistive technology', () => {
    const pagination = {
      type: 'page' as const,
      pageSize: 10,
      offset: 10,
      totalCount: 25,
      hasNextPage: true,
      hasPreviousPage: true,
      onNextPage: jest.fn(),
      onPreviousPage: jest.fn(),
    };
    const { rerender } = renderTable({ pagination });

    const liveRegion = screen.getByText(
      'Table page loaded. Showing 11 to 20 of 25',
    );
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('grid')).toHaveAttribute(
      'aria-describedby',
      liveRegion.id,
    );

    rerender(
      <Table
        columnConfig={columns}
        data={items}
        isPending
        isStale
        pagination={pagination}
      />,
    );
    expect(screen.getByText('Loading table data.')).toBeInTheDocument();
  });

  it('wires up the pagination controls', () => {
    const onNextPage = jest.fn();
    const onPreviousPage = jest.fn();
    renderTable({
      pagination: {
        type: 'page',
        pageSize: 10,
        offset: 10,
        totalCount: 25,
        hasNextPage: true,
        hasPreviousPage: true,
        onNextPage,
        onPreviousPage,
      },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Next table page' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Previous table page' }),
    );
    expect(onNextPage).toHaveBeenCalledTimes(1);
    expect(onPreviousPage).toHaveBeenCalledTimes(1);
  });

  it('calls onSortChange when a sortable column header is clicked', () => {
    const onSortChange = jest.fn();
    renderTable({
      columnConfig: [{ ...columns[0], isSortable: true }, columns[1]],
      sort: { descriptor: null, onSortChange },
    });

    fireEvent.click(screen.getByRole('columnheader', { name: /Name/ }));
    expect(onSortChange).toHaveBeenCalledWith({
      column: 'name',
      direction: 'ascending',
    });
  });

  it('supports controlled selection with numeric item ids', () => {
    const onSelectionChange = jest.fn();
    renderTable({
      selection: {
        mode: 'multiple',
        behavior: 'toggle',
        selected: new Set([2]),
        onSelectionChange,
      },
    });

    const rows = screen.getAllByRole('row');
    const gatewayRow = screen.getByRole('row', { name: /API Gateway/ });
    expect(gatewayRow).toHaveAttribute('aria-selected', 'true');
    expect(
      rows.filter(row => row.getAttribute('aria-selected') === 'true'),
    ).toHaveLength(1);

    const libraryRow = screen.getByRole('row', { name: /Component Library/ });
    fireEvent.click(within(libraryRow).getByRole('checkbox'));
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    const selected = onSelectionChange.mock.calls[0][0];
    expect(Array.from(selected)).toContain('1');
  });

  it('disables rows through rowConfig.getIsDisabled and triggers row actions', () => {
    const onClick = jest.fn();
    renderTable({
      selection: { mode: 'multiple', behavior: 'toggle' },
      rowConfig: {
        onClick,
        getIsDisabled: item => item.id === 3,
      },
    });

    expect(
      screen.getByRole('row', { name: /Documentation Site/ }),
    ).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(screen.getByRole('row', { name: /API Gateway/ }));
    expect(onClick).toHaveBeenCalledWith(items[1]);
  });
});
