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

import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import { StrictMode, Suspense } from 'react';
import { CellText, Table, useTable } from '..';
import type { ColumnConfig } from '..';
import type {
  CursorParams,
  OffsetParams,
  PagePagination,
  SortDescriptor,
  UseTableCompleteOptions,
  UseTableResult,
} from '..';

interface Item {
  id: number;
  name: string;
}

function makeItems(count: number, start = 0): Item[] {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i,
    name: `Item ${start + i}`,
  }));
}

function getPagination<TFilter>(
  result: UseTableResult<Item, TFilter>,
): PagePagination {
  const { pagination } = result.tableProps;
  if (pagination.type !== 'page') {
    throw new Error(`Expected page pagination, got '${pagination.type}'`);
  }
  return pagination;
}

function ids<TFilter>(result: UseTableResult<Item, TFilter>): number[] {
  return result.tableProps.data?.map(item => item.id) ?? [];
}

function createOffsetGetData(items: Item[]) {
  return jest.fn(async (params: OffsetParams<unknown>) => {
    let filtered = items;
    if (params.search) {
      filtered = filtered.filter(item => item.name.includes(params.search));
    }
    return {
      data: filtered.slice(params.offset, params.offset + params.pageSize),
      totalCount: filtered.length,
    };
  });
}

function createCursorGetData(items: Item[]) {
  return jest.fn(async (params: CursorParams<unknown>) => {
    const pageIndex = params.cursor ? Number(params.cursor) : 0;
    const start = pageIndex * params.pageSize;
    return {
      data: items.slice(start, start + params.pageSize),
      nextCursor:
        start + params.pageSize < items.length
          ? String(pageIndex + 1)
          : undefined,
      prevCursor: pageIndex > 0 ? String(pageIndex - 1) : undefined,
      totalCount: items.length,
    };
  });
}

afterEach(() => {
  jest.useRealTimers();
});

describe('useTable', () => {
  describe('complete mode', () => {
    it('paginates static data and navigates across page boundaries', () => {
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'complete',
          data: makeItems(25),
          paginationOptions: { pageSize: 10 },
        }),
      );

      expect(result.current.tableProps.isPending).toBe(false);
      expect(ids(result.current)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(getPagination(result.current)).toMatchObject({
        offset: 0,
        totalCount: 25,
        hasPreviousPage: false,
        hasNextPage: true,
      });

      act(() => getPagination(result.current).onNextPage());
      act(() => getPagination(result.current).onNextPage());

      expect(ids(result.current)).toEqual([20, 21, 22, 23, 24]);
      expect(getPagination(result.current)).toMatchObject({
        offset: 20,
        hasPreviousPage: true,
        hasNextPage: false,
      });

      // Navigating past the last page is a no-op.
      act(() => getPagination(result.current).onNextPage());
      expect(getPagination(result.current).offset).toBe(20);

      act(() => getPagination(result.current).onPreviousPage());
      expect(ids(result.current)).toEqual([
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      ]);

      // Changing the page size resets to the first page.
      act(() => getPagination(result.current).onPageSizeChange?.(5));
      expect(getPagination(result.current)).toMatchObject({
        offset: 0,
        pageSize: 5,
      });
      expect(ids(result.current)).toEqual([0, 1, 2, 3, 4]);
    });

    it('starts at initialOffset', () => {
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'complete',
          data: makeItems(25),
          paginationOptions: { pageSize: 10, initialOffset: 10 },
        }),
      );

      expect(getPagination(result.current).offset).toBe(10);
      expect(ids(result.current)).toEqual([
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      ]);
      expect(getPagination(result.current).hasPreviousPage).toBe(true);

      act(() => getPagination(result.current).onPreviousPage());
      expect(ids(result.current)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('clamps to the last page when the data shrinks below the current offset', () => {
      const { result, rerender } = renderHook(
        ({ data }: { data: Item[] }) =>
          useTable<Item>({
            mode: 'complete',
            data,
            paginationOptions: { pageSize: 10 },
          }),
        { initialProps: { data: makeItems(25) } },
      );

      act(() => getPagination(result.current).onNextPage());
      act(() => getPagination(result.current).onNextPage());
      expect(getPagination(result.current).offset).toBe(20);

      rerender({ data: makeItems(15) });

      expect(getPagination(result.current)).toMatchObject({
        offset: 10,
        totalCount: 15,
        hasNextPage: false,
        hasPreviousPage: true,
      });
      expect(ids(result.current)).toEqual([10, 11, 12, 13, 14]);

      rerender({ data: [] });
      expect(getPagination(result.current)).toMatchObject({
        offset: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it('loads async data with getData, exposes errors, and reloads', async () => {
      let shouldFail = false;
      let items = makeItems(3);
      const getData = jest.fn(async () => {
        if (shouldFail) {
          throw new Error('load failed');
        }
        return items;
      });

      const { result } = renderHook(() =>
        useTable<Item>({ mode: 'complete', getData }),
      );

      expect(result.current.tableProps.isPending).toBe(true);
      expect(result.current.tableProps.data).toBeUndefined();

      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      expect(ids(result.current)).toEqual([0, 1, 2]);

      items = makeItems(4);
      act(() => result.current.reload());
      await waitFor(() => expect(ids(result.current)).toEqual([0, 1, 2, 3]));
      expect(getData).toHaveBeenCalledTimes(2);

      shouldFail = true;
      act(() => result.current.reload());
      await waitFor(() =>
        expect(result.current.tableProps.error?.message).toBe('load failed'),
      );
      expect(result.current.tableProps.isPending).toBe(false);
    });

    it('marks retained data as pending and stale when controlled data becomes undefined', () => {
      const { result, rerender } = renderHook(
        ({ data }: { data: Item[] | undefined }) =>
          useTable<Item>({
            mode: 'complete',
            data,
            paginationOptions: { pageSize: 10 },
          }),
        { initialProps: { data: makeItems(5) as Item[] | undefined } },
      );

      expect(result.current.tableProps.isPending).toBe(false);

      rerender({ data: undefined });

      // The previous page is retained for display, but the table reports
      // that a load is in progress again.
      expect(ids(result.current)).toEqual([0, 1, 2, 3, 4]);
      expect(result.current.tableProps.isPending).toBe(true);
      expect(result.current.tableProps.isStale).toBe(true);

      rerender({ data: makeItems(2) });
      expect(result.current.tableProps.isPending).toBe(false);
      expect(ids(result.current)).toEqual([0, 1]);
    });

    it('applies searchFn, filterFn and sortFn and resets the page on query changes', () => {
      const searchFn = (data: Item[], search: string) =>
        data.filter(item => item.name.includes(search));
      const filterFn = (data: Item[], filter: { even: boolean }) =>
        filter.even ? data.filter(item => item.id % 2 === 0) : data;
      const sortFn = (data: Item[], sort: SortDescriptor) =>
        [...data].sort(
          (a, b) => (a.id - b.id) * (sort.direction === 'descending' ? -1 : 1),
        );

      const { result } = renderHook(() =>
        useTable<Item, { even: boolean }>({
          mode: 'complete',
          data: makeItems(25),
          paginationOptions: { pageSize: 10 },
          searchFn,
          filterFn,
          sortFn,
        }),
      );

      act(() => getPagination(result.current).onNextPage());
      expect(getPagination(result.current).offset).toBe(10);

      // Searching resets to the first page of matching items.
      act(() => result.current.search.onChange('Item 2'));
      expect(result.current.search.value).toBe('Item 2');
      expect(getPagination(result.current).offset).toBe(0);
      // 'Item 2' matches 2 and 20-24
      expect(ids(result.current)).toEqual([2, 20, 21, 22, 23, 24]);

      act(() => result.current.search.onChange(''));
      act(() => result.current.filter.onChange({ even: true }));
      expect(getPagination(result.current).totalCount).toBe(13);
      expect(ids(result.current)).toEqual([0, 2, 4, 6, 8, 10, 12, 14, 16, 18]);

      act(() =>
        result.current.tableProps.sort?.onSortChange({
          column: 'name',
          direction: 'descending',
        }),
      );
      expect(result.current.tableProps.sort?.descriptor).toEqual({
        column: 'name',
        direction: 'descending',
      });
      expect(ids(result.current)).toEqual([
        24, 22, 20, 18, 16, 14, 12, 10, 8, 6,
      ]);
    });

    it('supports controlled search without mutating internal state', () => {
      const onSearchChange = jest.fn();
      const searchFn = (data: Item[], search: string) =>
        data.filter(item => item.name.includes(search));

      const { result, rerender } = renderHook(
        ({ search }: { search: string }) =>
          useTable<Item>({
            mode: 'complete',
            data: makeItems(25),
            paginationOptions: { pageSize: 10 },
            search,
            onSearchChange,
            searchFn,
          }),
        { initialProps: { search: 'Item 1' } },
      );

      expect(result.current.search.value).toBe('Item 1');
      expect(ids(result.current)).toEqual([
        1, 10, 11, 12, 13, 14, 15, 16, 17, 18,
      ]);

      // Changing through the handler notifies the owner but does not change
      // the controlled value by itself.
      act(() => result.current.search.onChange('Item 2'));
      expect(onSearchChange).toHaveBeenCalledWith('Item 2');
      expect(result.current.search.value).toBe('Item 1');

      rerender({ search: 'Item 2' });
      expect(result.current.search.value).toBe('Item 2');
      expect(ids(result.current)).toEqual([2, 20, 21, 22, 23, 24]);
    });

    it('throws when the mode changes after mount', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      try {
        const items = makeItems(3);
        // Intentionally violates the typed contract that the mode is fixed,
        // to exercise the runtime guard.
        const { rerender } = renderHook(
          ({ mode }: { mode: 'complete' | 'offset' }) =>
            useTable<Item>(
              (mode === 'complete'
                ? { mode, data: items }
                : {
                    mode,
                    getData: async () => ({ data: items, totalCount: 3 }),
                  }) as UseTableCompleteOptions<Item>,
            ),
          {
            initialProps: { mode: 'complete' } as {
              mode: 'complete' | 'offset';
            },
          },
        );

        expect(() => rerender({ mode: 'offset' })).toThrow(
          /mode cannot change/,
        );
      } finally {
        consoleError.mockRestore();
      }
    });
  });

  describe('offset mode', () => {
    it('fetches pages on demand, caches visited pages, and navigates back to the first page', async () => {
      const getData = createOffsetGetData(makeItems(25));
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'offset',
          getData,
          paginationOptions: { pageSize: 10 },
        }),
      );

      expect(result.current.tableProps.isPending).toBe(true);
      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );

      expect(getData).toHaveBeenCalledTimes(1);
      expect(getData.mock.calls[0][0]).toMatchObject({
        offset: 0,
        pageSize: 10,
        sort: null,
        search: '',
      });
      expect(getData.mock.calls[0][0].signal).toBeInstanceOf(AbortSignal);
      expect(ids(result.current)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(getPagination(result.current)).toMatchObject({
        offset: 0,
        totalCount: 25,
        hasPreviousPage: false,
        hasNextPage: true,
      });

      act(() => getPagination(result.current).onNextPage());
      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      expect(getData).toHaveBeenCalledTimes(2);
      expect(getData.mock.calls[1][0]).toMatchObject({ offset: 10 });
      expect(ids(result.current)).toEqual([
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      ]);

      // Going back serves the first page from the cache without refetching.
      act(() => getPagination(result.current).onPreviousPage());
      expect(ids(result.current)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(getData).toHaveBeenCalledTimes(2);
      expect(getPagination(result.current).hasPreviousPage).toBe(false);
    });

    it('can navigate back to the first page when mounted at an initialOffset', async () => {
      const getData = createOffsetGetData(makeItems(25));
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'offset',
          getData,
          paginationOptions: { pageSize: 10, initialOffset: 10 },
        }),
      );

      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      expect(getData.mock.calls[0][0]).toMatchObject({ offset: 10 });
      expect(ids(result.current)).toEqual([
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      ]);
      expect(getPagination(result.current)).toMatchObject({
        offset: 10,
        hasPreviousPage: true,
      });

      act(() => getPagination(result.current).onPreviousPage());
      await waitFor(() => expect(getPagination(result.current).offset).toBe(0));
      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      expect(ids(result.current)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(getPagination(result.current).hasPreviousPage).toBe(false);
    });

    it('keeps showing the previous page as stale while the next page loads', async () => {
      const items = makeItems(25);
      const resolvers: Array<() => void> = [];
      const getData = jest.fn(async (params: OffsetParams<unknown>) => {
        await new Promise<void>(resolve => resolvers.push(resolve));
        return {
          data: items.slice(params.offset, params.offset + params.pageSize),
          totalCount: items.length,
        };
      });

      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'offset',
          getData,
          paginationOptions: { pageSize: 10 },
        }),
      );

      await act(async () => resolvers.shift()?.());
      expect(result.current.tableProps.isPending).toBe(false);
      expect(result.current.tableProps.isStale).toBe(false);

      act(() => getPagination(result.current).onNextPage());

      expect(result.current.tableProps.isPending).toBe(true);
      expect(result.current.tableProps.isStale).toBe(true);
      expect(ids(result.current)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

      await act(async () => resolvers.shift()?.());
      expect(result.current.tableProps.isStale).toBe(false);
      expect(ids(result.current)).toEqual([
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      ]);
    });

    it('resets to the first page and refetches when the search changes, debounced', async () => {
      jest.useFakeTimers();
      const getData = createOffsetGetData(makeItems(25));
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'offset',
          getData,
          paginationOptions: { pageSize: 10 },
        }),
      );

      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      act(() => getPagination(result.current).onNextPage());
      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      expect(getData).toHaveBeenCalledTimes(2);

      act(() => result.current.search.onChange('Item 2'));
      expect(result.current.search.value).toBe('Item 2');

      // Rapid changes within the debounce window collapse into one reload.
      act(() => result.current.search.onChange('Item 22'));
      act(() => jest.advanceTimersByTime(150));
      expect(getData).toHaveBeenCalledTimes(2);

      act(() => jest.advanceTimersByTime(100));
      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      expect(getData).toHaveBeenCalledTimes(3);
      expect(getData.mock.calls[2][0]).toMatchObject({
        offset: 0,
        search: 'Item 22',
      });
      expect(ids(result.current)).toEqual([22]);
    });

    it('does not reload when callback options change identity without a value change', async () => {
      jest.useFakeTimers();
      const getData = createOffsetGetData(makeItems(25));
      const { result, rerender } = renderHook(
        ({ onSortChange }: { onSortChange: (sort: SortDescriptor) => void }) =>
          useTable<Item>({
            mode: 'offset',
            getData,
            paginationOptions: { pageSize: 10 },
            onSortChange,
          }),
        { initialProps: { onSortChange: () => {} } },
      );

      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      expect(getData).toHaveBeenCalledTimes(1);

      // A parent re-render typically passes new inline callback identities.
      rerender({ onSortChange: () => {} });
      rerender({ onSortChange: () => {} });

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });
      expect(getData).toHaveBeenCalledTimes(1);
    });

    it('recovers after a failed page load', async () => {
      const items = makeItems(25);
      let failOffset: number | undefined = 10;
      const getData = jest.fn(async (params: OffsetParams<unknown>) => {
        if (params.offset === failOffset) {
          throw new Error('page failed');
        }
        return {
          data: items.slice(params.offset, params.offset + params.pageSize),
          totalCount: items.length,
        };
      });

      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'offset',
          getData,
          paginationOptions: { pageSize: 10 },
        }),
      );

      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );

      act(() => getPagination(result.current).onNextPage());
      await waitFor(() =>
        expect(result.current.tableProps.error?.message).toBe('page failed'),
      );

      // Navigating back to the cached first page clears the error.
      act(() => getPagination(result.current).onPreviousPage());
      expect(result.current.tableProps.error).toBeUndefined();
      expect(ids(result.current)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

      // Retrying the failed page fetches it again.
      failOffset = undefined;
      act(() => getPagination(result.current).onNextPage());
      await waitFor(() =>
        expect(ids(result.current)).toEqual([
          10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        ]),
      );
      expect(result.current.tableProps.error).toBeUndefined();
    });

    it('reload refetches from the first page with a cleared cache', async () => {
      const getData = createOffsetGetData(makeItems(25));
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'offset',
          getData,
          paginationOptions: { pageSize: 10 },
        }),
      );

      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      act(() => getPagination(result.current).onNextPage());
      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );

      act(() => result.current.reload());
      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      expect(getData).toHaveBeenCalledTimes(3);
      expect(getData.mock.calls[2][0]).toMatchObject({ offset: 0 });
      expect(getPagination(result.current).offset).toBe(0);

      // The cache was cleared, so the next page is fetched again.
      act(() => getPagination(result.current).onNextPage());
      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      expect(getData).toHaveBeenCalledTimes(4);
    });
  });

  describe('cursor mode', () => {
    it('navigates using cursors from the response', async () => {
      const getData = createCursorGetData(makeItems(25));
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'cursor',
          getData,
          paginationOptions: { pageSize: 10 },
        }),
      );

      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      expect(getData.mock.calls[0][0]).toMatchObject({
        cursor: undefined,
        pageSize: 10,
      });
      expect(ids(result.current)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(getPagination(result.current)).toMatchObject({
        offset: undefined,
        totalCount: 25,
        hasPreviousPage: false,
        hasNextPage: true,
      });

      act(() => getPagination(result.current).onNextPage());
      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      expect(getData.mock.calls[1][0]).toMatchObject({ cursor: '1' });

      act(() => getPagination(result.current).onNextPage());
      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      expect(getData.mock.calls[2][0]).toMatchObject({ cursor: '2' });
      expect(ids(result.current)).toEqual([20, 21, 22, 23, 24]);
      expect(getPagination(result.current).hasNextPage).toBe(false);

      // Both previous pages come from the cache.
      act(() => getPagination(result.current).onPreviousPage());
      act(() => getPagination(result.current).onPreviousPage());
      expect(ids(result.current)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(getPagination(result.current).hasPreviousPage).toBe(false);
      expect(getData).toHaveBeenCalledTimes(3);
    });

    it('reload resets to the first page and pageSize changes trigger a debounced reload', async () => {
      jest.useFakeTimers();
      const getData = createCursorGetData(makeItems(25));
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'cursor',
          getData,
          paginationOptions: { pageSize: 10 },
        }),
      );

      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      act(() => getPagination(result.current).onNextPage());
      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );

      act(() => result.current.reload());
      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      expect(getData).toHaveBeenCalledTimes(3);
      expect(getData.mock.calls[2][0]).toMatchObject({ cursor: undefined });
      expect(ids(result.current)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

      act(() => getPagination(result.current).onPageSizeChange?.(5));
      await act(async () => {
        jest.advanceTimersByTime(250);
      });
      await waitFor(() =>
        expect(result.current.tableProps.isPending).toBe(false),
      );
      expect(getData.mock.calls[3][0]).toMatchObject({
        cursor: undefined,
        pageSize: 5,
      });
      expect(ids(result.current)).toEqual([0, 1, 2, 3, 4]);
      expect(getPagination(result.current).pageSize).toBe(5);
    });
  });

  describe('render lifecycle', () => {
    const columns: ColumnConfig<Item>[] = [
      {
        id: 'name',
        label: 'Name',
        isRowHeader: true,
        cell: item => <CellText title={item.name} />,
      },
    ];

    function OffsetHarness({
      getData,
    }: {
      getData: (
        params: OffsetParams<unknown>,
      ) => Promise<{ data: Item[]; totalCount: number }>;
    }) {
      const { tableProps } = useTable<Item>({
        mode: 'offset',
        getData,
        paginationOptions: { pageSize: 10 },
      });
      return <Table {...tableProps} columnConfig={columns} />;
    }

    it('recovers from the StrictMode double mount and keeps the page cache intact', async () => {
      const getData = createOffsetGetData(makeItems(25));

      render(
        <StrictMode>
          <OffsetHarness getData={getData} />
        </StrictMode>,
      );

      // The simulated unmount aborts the first mount fetch; the remount
      // fetches again. Every mount call targets the first page.
      expect(await screen.findByText('Item 0')).toBeInTheDocument();
      for (const [params] of getData.mock.calls) {
        expect(params.offset).toBe(0);
      }

      act(() => {
        screen.getByRole('button', { name: 'Next table page' }).click();
      });
      expect(await screen.findByText('Item 10')).toBeInTheDocument();
      const callsAfterNext = getData.mock.calls.length;
      expect(getData.mock.calls[callsAfterNext - 1][0].offset).toBe(10);

      // Going back must be served from the cache despite the double mount.
      act(() => {
        screen.getByRole('button', { name: 'Previous table page' }).click();
      });
      expect(await screen.findByText('Item 0')).toBeInTheDocument();
      expect(getData.mock.calls.length).toBe(callsAfterNext);
    });

    it('starts no fetch from a render that is abandoned by a suspended sibling', async () => {
      let resolveGate: () => void = () => {};
      const gate = new Promise<void>(resolve => {
        resolveGate = resolve;
      });
      let gateOpen = false;

      function Suspender() {
        if (!gateOpen) {
          throw gate.then(() => {
            gateOpen = true;
          });
        }
        return null;
      }

      const getData = createOffsetGetData(makeItems(25));

      render(
        <Suspense fallback={<div>suspense-fallback</div>}>
          <OffsetHarness getData={getData} />
          <Suspender />
        </Suspense>,
      );

      // The first render never commits, so no request may be started.
      expect(screen.getByText('suspense-fallback')).toBeInTheDocument();
      expect(getData).not.toHaveBeenCalled();

      await act(async () => {
        resolveGate();
        await gate;
      });

      expect(await screen.findByText('Item 0')).toBeInTheDocument();
      expect(getData).toHaveBeenCalledTimes(1);
    });

    it('honors initialOffset in complete mode under StrictMode', async () => {
      const getData = jest.fn(async () => makeItems(25));

      function CompleteHarness() {
        const { tableProps } = useTable<Item>({
          mode: 'complete',
          getData,
          paginationOptions: { pageSize: 10, initialOffset: 10 },
        });
        return <Table {...tableProps} columnConfig={columns} />;
      }

      render(
        <StrictMode>
          <CompleteHarness />
        </StrictMode>,
      );

      expect(await screen.findByText('Item 10')).toBeInTheDocument();
      expect(screen.getByText('11 - 20 of 25')).toBeInTheDocument();
    });
  });
});
