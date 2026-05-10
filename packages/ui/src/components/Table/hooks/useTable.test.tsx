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

import { act, renderHook, waitFor } from '@testing-library/react';
import { useTable } from './useTable';

type Item = { id: string; name: string };

const ITEMS: Item[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i),
  name: `name-${i}`,
}));

describe('useTable (infinite mode)', () => {
  it('exposes an infinite pagination shape and marks tableProps as virtualized (complete mode)', async () => {
    const { result } = renderHook(() =>
      useTable<Item>({
        mode: 'complete',
        getData: () => ITEMS,
        paginationOptions: { infinite: true, pageSize: 5 },
      }),
    );

    await waitFor(() => expect(result.current.tableProps.data).toBeDefined());

    const { tableProps } = result.current;
    expect(tableProps.virtualized).toBe(true);

    const { pagination } = tableProps;
    if (pagination.type !== 'infinite') {
      throw new Error(`expected infinite pagination, got ${pagination.type}`);
    }
    expect(pagination.hasMoreItems).toBe(true);
    expect(pagination.isLoading).toBe(false);
    expect(tableProps.data?.length).toBe(5);

    // Load more grows the slice from 0.
    act(() => pagination.onLoadMore());
    await waitFor(() =>
      expect(result.current.tableProps.data?.length).toBe(10),
    );

    const paginationAfter = result.current.tableProps.pagination;
    if (paginationAfter.type !== 'infinite') {
      throw new Error('expected infinite pagination');
    }
    expect(paginationAfter.hasMoreItems).toBe(true);
  });

  it('falls back to page pagination shape when infinite is not set', async () => {
    const { result } = renderHook(() =>
      useTable<Item>({
        mode: 'complete',
        getData: () => ITEMS,
        paginationOptions: { pageSize: 5 },
      }),
    );

    await waitFor(() => expect(result.current.tableProps.data).toBeDefined());

    expect(result.current.tableProps.virtualized).toBeUndefined();
    expect(result.current.tableProps.pagination.type).toBe('page');
  });

  it('accumulates data across onLoadMore calls in offset mode', async () => {
    const getData = jest.fn(
      async ({ offset, pageSize }: { offset: number; pageSize: number }) => ({
        data: ITEMS.slice(offset, offset + pageSize),
        totalCount: ITEMS.length,
      }),
    );

    const { result } = renderHook(() =>
      useTable<Item>({
        mode: 'offset',
        getData,
        paginationOptions: { infinite: true, pageSize: 5 },
      }),
    );

    await waitFor(() => expect(result.current.tableProps.data?.length).toBe(5));

    const pagination = result.current.tableProps.pagination;
    if (pagination.type !== 'infinite') {
      throw new Error('expected infinite pagination');
    }

    act(() => pagination.onLoadMore());
    await waitFor(() =>
      expect(result.current.tableProps.data?.length).toBe(10),
    );

    const names = result.current.tableProps.data?.map(i => i.name);
    expect(names).toEqual([
      'name-0',
      'name-1',
      'name-2',
      'name-3',
      'name-4',
      'name-5',
      'name-6',
      'name-7',
      'name-8',
      'name-9',
    ]);
  });
});
