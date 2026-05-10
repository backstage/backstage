/*
 * Copyright 2025 The Backstage Authors
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

import { render, screen } from '@testing-library/react';
import { Table } from './components/Table';
import { CellText } from './components/CellText';
import type { ColumnConfig, InfiniteScrollPagination } from '.';

globalThis.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn().mockReturnValue([]),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

type Item = { id: string; name: string };

const columns: ColumnConfig<Item>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    cell: item => <CellText title={item.name} />,
  },
];

const data: Item[] = [
  { id: '1', name: 'alpha' },
  { id: '2', name: 'beta' },
];

function createMockInfinitePagination(
  overrides: Partial<InfiniteScrollPagination> = {},
): InfiniteScrollPagination {
  return {
    type: 'infinite',
    onLoadMore: () => {},
    onLoadPrevious: () => {},
    isLoading: false,
    hasMoreItems: false,
    hasPreviousPages: false,
    ...overrides,
  };
}

describe('Table (infinite mode)', () => {
  it('does not render TablePagination when pagination is infinite and renders bottom sentinel when hasMoreItems', () => {
    render(
      <Table<Item>
        columnConfig={columns}
        data={data}
        pagination={createMockInfinitePagination({ hasMoreItems: true })}
        virtualized
        style={{ height: 300 }}
      />,
    );

    // Row data renders.
    expect(screen.getByText('alpha')).toBeTruthy();

    // No page-pagination navigation controls.
    expect(
      screen.queryByRole('button', { name: /next table page/i }),
    ).toBeNull();
    expect(
      screen.queryByRole('button', { name: /previous table page/i }),
    ).toBeNull();
  });

  it('does not render the TablePagination controls when hasMoreItems is false and there are no previous pages', () => {
    render(
      <Table<Item>
        columnConfig={columns}
        data={data}
        pagination={createMockInfinitePagination()}
      />,
    );

    expect(screen.getByText('alpha')).toBeTruthy();
    expect(
      screen.queryByRole('combobox', { name: /select table page size/i }),
    ).toBeNull();
  });

  it('renders regular TablePagination controls when pagination type is page', () => {
    render(
      <Table<Item>
        columnConfig={columns}
        data={data}
        pagination={{
          type: 'page',
          pageSize: 5,
          offset: 0,
          totalCount: 2,
          hasNextPage: false,
          hasPreviousPage: false,
          onNextPage: () => {},
          onPreviousPage: () => {},
          onPageSizeChange: () => {},
        }}
      />,
    );

    expect(
      screen.getByRole('button', { name: /previous table page/i }),
    ).toBeTruthy();
  });
});
