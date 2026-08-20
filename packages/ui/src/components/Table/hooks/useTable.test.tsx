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

import { act, renderHook } from '@testing-library/react';
import type { SortDescriptor } from '../types';
import type { CursorParams, OffsetParams } from './types';
import { useTable } from './useTable';

type Item = { id: number; name: string };

const makeItems = (count: number): Item[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));

const ids = (data: Item[] | undefined) => data?.map(item => item.id);

const flushPromises = () =>
  act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

/** Creates a deferred getData for asserting on in-flight state. */
function createDeferredSource<TResponse>() {
  const pending: Array<{
    resolve: (value: TResponse) => void;
    reject: (error: Error) => void;
    signal: AbortSignal;
  }> = [];
  const getData = jest.fn(
    (params: { signal: AbortSignal }) =>
      new Promise<TResponse>((resolve, reject) => {
        pending.push({ resolve, reject, signal: params.signal });
      }),
  );
  return { getData, pending };
}

describe('useTable', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('complete mode', () => {
    it('paginates client-side data, honors initialOffset and clamps at both boundaries', () => {
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'complete',
          data: makeItems(12),
          paginationOptions: { pageSize: 5, initialOffset: 10 },
        }),
      );

      const pagination = () => result.current.tableProps.pagination;
      expect(ids(result.current.tableProps.data)).toEqual([11, 12]);
      expect(pagination()).toMatchObject({
        type: 'page',
        offset: 10,
        pageSize: 5,
        totalCount: 12,
        hasNextPage: false,
        hasPreviousPage: true,
      });
      expect(result.current.tableProps.isPending).toBe(false);

      // Next at the last page is a no-op.
      act(() => (pagination() as any).onNextPage());
      expect(pagination()).toMatchObject({ offset: 10 });

      act(() => (pagination() as any).onPreviousPage());
      act(() => (pagination() as any).onPreviousPage());
      expect(ids(result.current.tableProps.data)).toEqual([1, 2, 3, 4, 5]);
      expect(pagination()).toMatchObject({
        offset: 0,
        hasNextPage: true,
        hasPreviousPage: false,
      });

      // Previous at the first page is a no-op.
      act(() => (pagination() as any).onPreviousPage());
      expect(pagination()).toMatchObject({ offset: 0 });
    });

    it('moves to the last available page when the data shrinks below the current offset', () => {
      const { result, rerender } = renderHook(
        ({ data }: { data: Item[] }) =>
          useTable<Item>({
            mode: 'complete',
            data,
            paginationOptions: { pageSize: 5 },
          }),
        { initialProps: { data: makeItems(12) } },
      );
      const pagination = () => result.current.tableProps.pagination as any;

      act(() => pagination().onNextPage());
      act(() => pagination().onNextPage());
      expect(ids(result.current.tableProps.data)).toEqual([11, 12]);

      rerender({ data: makeItems(7) });
      expect(ids(result.current.tableProps.data)).toEqual([6, 7]);
      expect(pagination()).toMatchObject({
        offset: 5,
        totalCount: 7,
        hasNextPage: false,
        hasPreviousPage: true,
      });

      rerender({ data: [] });
      expect(result.current.tableProps.data).toEqual([]);
      expect(pagination()).toMatchObject({
        offset: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it('applies filter, search and sort, resetting to the first page when they change', () => {
      const onSearchChange = jest.fn();
      const { result } = renderHook(() =>
        useTable<Item, { minId: number }>({
          mode: 'complete',
          data: makeItems(30),
          paginationOptions: { pageSize: 5 },
          filterFn: (data, filter) => data.filter(i => i.id >= filter.minId),
          searchFn: (data, search) => data.filter(i => i.name.includes(search)),
          sortFn: (data, sort) =>
            [...data].sort((a, b) =>
              sort.direction === 'ascending' ? a.id - b.id : b.id - a.id,
            ),
          onSearchChange,
        }),
      );
      const pagination = () => result.current.tableProps.pagination as any;

      act(() => pagination().onNextPage());
      expect(pagination().offset).toBe(5);

      act(() => result.current.filter.onChange({ minId: 20 }));
      expect(pagination()).toMatchObject({ offset: 0, totalCount: 11 });
      expect(ids(result.current.tableProps.data)).toEqual([20, 21, 22, 23, 24]);
      expect(result.current.filter.value).toEqual({ minId: 20 });

      act(() => result.current.search.onChange('2'));
      expect(onSearchChange).toHaveBeenCalledWith('2');
      expect(result.current.search.value).toBe('2');
      // 20-29 all contain "2"; 30 does not
      expect(pagination().totalCount).toBe(10);

      act(() => pagination().onNextPage());
      expect(pagination().offset).toBe(5);

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
      expect(pagination().offset).toBe(0);
      expect(ids(result.current.tableProps.data)).toEqual([29, 28, 27, 26, 25]);
    });

    it('supports controlled sort, filter and search without keeping internal copies', () => {
      const onSortChange = jest.fn();
      const onFilterChange = jest.fn();
      const initialSort: SortDescriptor = {
        column: 'name',
        direction: 'ascending',
      };
      const { result, rerender } = renderHook(
        (props: { sort: SortDescriptor | null; search: string }) =>
          useTable<Item, string>({
            mode: 'complete',
            data: makeItems(3),
            sort: props.sort,
            onSortChange,
            filter: 'x',
            onFilterChange,
            search: props.search,
            searchFn: (data, search) =>
              data.filter(i => i.name.includes(search)),
          }),
        {
          initialProps: {
            sort: initialSort as SortDescriptor | null,
            search: '',
          },
        },
      );

      expect(result.current.tableProps.sort?.descriptor).toEqual(initialSort);
      act(() =>
        result.current.tableProps.sort?.onSortChange({
          column: 'name',
          direction: 'descending',
        }),
      );
      expect(onSortChange).toHaveBeenCalledWith({
        column: 'name',
        direction: 'descending',
      });
      // Controlled: value does not change until the parent re-renders.
      expect(result.current.tableProps.sort?.descriptor).toEqual(initialSort);

      rerender({ sort: null, search: '3' });
      expect(result.current.tableProps.sort?.descriptor).toBeNull();
      expect(result.current.search.value).toBe('3');
      expect(ids(result.current.tableProps.data)).toEqual([3]);

      act(() => result.current.filter.onChange('y'));
      expect(onFilterChange).toHaveBeenCalledWith('y');
      expect(result.current.filter.value).toBe('x');
    });

    it('debounces search before it reaches searchFn while keeping the input value live', () => {
      jest.useFakeTimers();
      const searchFn = jest.fn((data: Item[], search: string) =>
        data.filter(i => i.name.includes(search)),
      );
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'complete',
          data: makeItems(12),
          paginationOptions: { pageSize: 5 },
          searchFn,
          searchDebounceMs: 300,
        }),
      );
      const pagination = () => result.current.tableProps.pagination as any;
      act(() => pagination().onNextPage());

      act(() => result.current.search.onChange('1'));
      expect(result.current.search.value).toBe('1');
      expect(searchFn).not.toHaveBeenCalled();
      expect(pagination().offset).toBe(5);

      act(() => result.current.search.onChange('12'));
      act(() => jest.advanceTimersByTime(299));
      expect(searchFn).not.toHaveBeenCalled();
      act(() => jest.advanceTimersByTime(1));
      // Only the settled value reaches searchFn — never the intermediate "1".
      expect(searchFn.mock.calls.map(([, search]) => search)).toEqual(
        expect.arrayContaining(['12']),
      );
      expect(searchFn.mock.calls.map(([, search]) => search)).not.toContain(
        '1',
      );
      expect(ids(result.current.tableProps.data)).toEqual([12]);
      expect(pagination().offset).toBe(0);
    });

    it('follows pageSize option changes after mount and validates against pageSizeOptions', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const { result, rerender } = renderHook(
        ({ pageSize }: { pageSize: number }) =>
          useTable<Item>({
            mode: 'complete',
            data: makeItems(12),
            paginationOptions: { pageSize, pageSizeOptions: [5, 10] },
          }),
        { initialProps: { pageSize: 5 } },
      );
      const pagination = () => result.current.tableProps.pagination as any;
      act(() => pagination().onNextPage());
      expect(pagination().offset).toBe(5);

      rerender({ pageSize: 10 });
      expect(pagination()).toMatchObject({ pageSize: 10, offset: 0 });
      expect(result.current.tableProps.data).toHaveLength(10);

      act(() => pagination().onPageSizeChange(5));
      expect(pagination()).toMatchObject({ pageSize: 5, offset: 0 });

      // A pageSize outside the options falls back to the first option.
      rerender({ pageSize: 7 });
      expect(pagination().pageSize).toBe(5);
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('pageSize 7 is not in pageSizeOptions'),
      );
      warn.mockRestore();
    });

    it('loads async getData, exposes errors, and keeps rows visible as stale during reload', async () => {
      const source = createDeferredSource<Item[]>();
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'complete',
          getData: () =>
            source.getData({ signal: new AbortController().signal }),
          paginationOptions: { pageSize: 5 },
        }),
      );

      expect(result.current.tableProps).toMatchObject({
        isPending: true,
        loading: true,
        isStale: false,
        data: undefined,
      });

      await act(async () => source.pending[0].resolve(makeItems(12)));
      expect(result.current.tableProps.isPending).toBe(false);
      expect(ids(result.current.tableProps.data)).toEqual([1, 2, 3, 4, 5]);
      act(() => (result.current.tableProps.pagination as any).onNextPage());

      act(() => result.current.reload());
      expect(source.getData).toHaveBeenCalledTimes(2);
      // Previous rows stay visible, flagged stale, and pagination resets.
      expect(result.current.tableProps).toMatchObject({
        isPending: true,
        isStale: true,
      });
      expect(ids(result.current.tableProps.data)).toEqual([1, 2, 3, 4, 5]);

      await act(async () => source.pending[1].reject(new Error('boom')));
      expect(result.current.tableProps.error?.message).toBe('boom');
      expect(result.current.tableProps.isPending).toBe(false);

      act(() => result.current.reload());
      expect(result.current.tableProps.error).toBeUndefined();
      await act(async () => source.pending[2].resolve(makeItems(3)));
      expect(ids(result.current.tableProps.data)).toEqual([1, 2, 3]);
      expect(result.current.tableProps.pagination).toMatchObject({
        totalCount: 3,
        hasNextPage: false,
      });
    });

    it('does not refetch when getData identity changes between renders', async () => {
      const getData = jest.fn(() => makeItems(3));
      const { result, rerender } = renderHook(() =>
        useTable<Item>({ mode: 'complete', getData: () => getData() }),
      );
      await flushPromises();
      rerender();
      rerender();
      expect(getData).toHaveBeenCalledTimes(1);
      expect(ids(result.current.tableProps.data)).toEqual([1, 2, 3]);
    });

    it("returns everything on one page with pagination type 'none'", () => {
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'complete',
          data: makeItems(40),
          paginationOptions: { type: 'none' },
        }),
      );
      expect(result.current.tableProps.pagination).toEqual({ type: 'none' });
      expect(result.current.tableProps.data).toHaveLength(40);
    });

    it('throws if the mode changes after mount', () => {
      const error = jest.spyOn(console, 'error').mockImplementation(() => {});
      const { rerender } = renderHook(
        ({ mode }: { mode: 'complete' | 'offset' }) =>
          mode === 'complete'
            ? useTable<Item>({ mode, data: [] })
            : useTable<Item>({
                mode,
                getData: async () => ({ data: [], totalCount: 0 }),
              }),
        { initialProps: { mode: 'complete' } },
      );
      expect(() => rerender({ mode: 'offset' })).toThrow(
        /mode cannot change from 'complete' to 'offset'/,
      );
      error.mockRestore();
    });
  });

  describe('offset mode', () => {
    const allItems = makeItems(12);
    const offsetSource = () =>
      jest.fn(async ({ offset, pageSize, search }: OffsetParams<unknown>) => {
        const matching = allItems.filter(i => i.name.includes(search));
        return {
          data: matching.slice(offset, offset + pageSize),
          totalCount: matching.length,
        };
      });

    it('fetches pages on demand, exposes stale rows while loading, and serves cached pages synchronously', async () => {
      const source = createDeferredSource<{
        data: Item[];
        totalCount: number;
      }>();
      const getData = jest.fn((params: OffsetParams<unknown>) =>
        source.getData(params).then(res => res),
      );
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'offset',
          getData,
          paginationOptions: { pageSize: 5 },
        }),
      );
      const pagination = () => result.current.tableProps.pagination as any;

      expect(result.current.tableProps).toMatchObject({
        isPending: true,
        isStale: false,
        data: undefined,
      });
      expect(getData).toHaveBeenLastCalledWith(
        expect.objectContaining({
          offset: 0,
          pageSize: 5,
          sort: null,
          search: '',
          signal: expect.any(AbortSignal),
        }),
      );

      await act(async () =>
        source.pending[0].resolve({
          data: allItems.slice(0, 5),
          totalCount: 12,
        }),
      );
      expect(result.current.tableProps.isPending).toBe(false);
      expect(pagination()).toMatchObject({
        offset: 0,
        totalCount: 12,
        hasNextPage: true,
        hasPreviousPage: false,
      });

      act(() => pagination().onNextPage());
      expect(getData).toHaveBeenLastCalledWith(
        expect.objectContaining({ offset: 5 }),
      );
      // Rows and navigation state from the visible page are kept while loading.
      expect(result.current.tableProps).toMatchObject({
        isPending: true,
        isStale: true,
      });
      expect(ids(result.current.tableProps.data)).toEqual([1, 2, 3, 4, 5]);
      expect(pagination()).toMatchObject({
        offset: 5,
        hasNextPage: true,
        hasPreviousPage: false,
      });

      // Repeated clicks during loading do not trigger extra requests.
      act(() => pagination().onNextPage());
      expect(getData).toHaveBeenCalledTimes(2);

      await act(async () =>
        source.pending[1].resolve({
          data: allItems.slice(5, 10),
          totalCount: 12,
        }),
      );
      expect(ids(result.current.tableProps.data)).toEqual([6, 7, 8, 9, 10]);
      expect(pagination()).toMatchObject({
        offset: 5,
        hasNextPage: true,
        hasPreviousPage: true,
      });

      act(() => pagination().onNextPage());
      await act(async () =>
        source.pending[2].resolve({ data: allItems.slice(10), totalCount: 12 }),
      );
      expect(ids(result.current.tableProps.data)).toEqual([11, 12]);
      expect(pagination()).toMatchObject({
        offset: 10,
        hasNextPage: false,
        hasPreviousPage: true,
      });

      // Going back is served from cache without a request.
      act(() => pagination().onPreviousPage());
      expect(getData).toHaveBeenCalledTimes(3);
      expect(result.current.tableProps.isPending).toBe(false);
      expect(ids(result.current.tableProps.data)).toEqual([6, 7, 8, 9, 10]);
    });

    it('starts at initialOffset and reload returns to the first page with a fresh request', async () => {
      const getData = offsetSource();
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'offset',
          getData,
          paginationOptions: { pageSize: 5, initialOffset: 5 },
        }),
      );
      await flushPromises();
      expect(ids(result.current.tableProps.data)).toEqual([6, 7, 8, 9, 10]);
      expect(result.current.tableProps.pagination).toMatchObject({
        offset: 5,
        hasPreviousPage: true,
        hasNextPage: true,
      });

      act(() => result.current.reload());
      await flushPromises();
      expect(getData).toHaveBeenCalledTimes(2);
      expect(getData).toHaveBeenLastCalledWith(
        expect.objectContaining({ offset: 0 }),
      );
      expect(ids(result.current.tableProps.data)).toEqual([1, 2, 3, 4, 5]);
      expect(result.current.tableProps.pagination).toMatchObject({
        offset: 0,
        hasPreviousPage: false,
      });
    });

    it('debounces query changes into a single first-page request and aborts superseded requests', async () => {
      jest.useFakeTimers();
      const source = createDeferredSource<{
        data: Item[];
        totalCount: number;
      }>();
      const getData = jest.fn((params: OffsetParams<unknown>) =>
        source.getData(params),
      );
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'offset',
          getData,
          paginationOptions: { pageSize: 5 },
        }),
      );
      await act(async () =>
        source.pending[0].resolve({
          data: allItems.slice(0, 5),
          totalCount: 12,
        }),
      );
      act(() => (result.current.tableProps.pagination as any).onNextPage());
      await act(async () =>
        source.pending[1].resolve({
          data: allItems.slice(5, 10),
          totalCount: 12,
        }),
      );
      expect(result.current.tableProps.pagination).toMatchObject({ offset: 5 });

      act(() => result.current.search.onChange('1'));
      act(() => result.current.search.onChange('12'));
      act(() => jest.advanceTimersByTime(150));
      expect(getData).toHaveBeenCalledTimes(2);
      act(() => jest.advanceTimersByTime(100));
      expect(getData).toHaveBeenCalledTimes(3);
      expect(getData).toHaveBeenLastCalledWith(
        expect.objectContaining({ offset: 0, search: '12' }),
      );
      expect(result.current.tableProps.isStale).toBe(true);

      // A further change while the request is in flight aborts it.
      act(() => result.current.search.onChange('11'));
      act(() => jest.advanceTimersByTime(200));
      expect(source.pending[2].signal.aborted).toBe(true);
      expect(getData).toHaveBeenCalledTimes(4);

      // A late response from the aborted request is ignored.
      await act(async () =>
        source.pending[2].resolve({ data: [allItems[11]], totalCount: 1 }),
      );
      expect(ids(result.current.tableProps.data)).toEqual([6, 7, 8, 9, 10]);
      await act(async () =>
        source.pending[3].resolve({ data: [allItems[10]], totalCount: 1 }),
      );
      expect(ids(result.current.tableProps.data)).toEqual([11]);
      expect(result.current.tableProps.pagination).toMatchObject({
        offset: 0,
        totalCount: 1,
        hasNextPage: false,
      });
    });

    it('navigating right after a query change applies the new query from the first page', async () => {
      jest.useFakeTimers();
      const getData = offsetSource();
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'offset',
          getData,
          paginationOptions: { pageSize: 5 },
        }),
      );
      await flushPromises();

      act(() => result.current.search.onChange('1'));
      act(() => jest.advanceTimersByTime(50));
      act(() => (result.current.tableProps.pagination as any).onNextPage());
      await flushPromises();
      act(() => jest.advanceTimersByTime(500));
      await flushPromises();

      expect(
        getData.mock.calls.map(([params]) => [params.offset, params.search]),
      ).toEqual([
        [0, ''],
        [0, '1'],
      ]);
      expect(ids(result.current.tableProps.data)).toEqual([1, 10, 11, 12]);
      expect(result.current.tableProps.pagination).toMatchObject({
        offset: 0,
        totalCount: 4,
      });
    });

    it('page size changes from the user or from options refetch from the first page', async () => {
      jest.useFakeTimers();
      const getData = offsetSource();
      const { result, rerender } = renderHook(
        ({ pageSize }: { pageSize: number }) =>
          useTable<Item>({
            mode: 'offset',
            getData,
            paginationOptions: { pageSize },
          }),
        { initialProps: { pageSize: 5 } },
      );
      const pagination = () => result.current.tableProps.pagination as any;
      await flushPromises();
      act(() => pagination().onNextPage());
      await flushPromises();
      expect(pagination().offset).toBe(5);

      act(() => pagination().onPageSizeChange(10));
      expect(pagination().pageSize).toBe(10);
      act(() => jest.advanceTimersByTime(200));
      await flushPromises();
      expect(getData).toHaveBeenLastCalledWith(
        expect.objectContaining({ offset: 0, pageSize: 10 }),
      );
      expect(result.current.tableProps.data).toHaveLength(10);
      expect(pagination()).toMatchObject({ offset: 0, hasNextPage: true });

      rerender({ pageSize: 20 });
      expect(pagination().pageSize).toBe(20);
      act(() => jest.advanceTimersByTime(200));
      await flushPromises();
      expect(getData).toHaveBeenLastCalledWith(
        expect.objectContaining({ offset: 0, pageSize: 20 }),
      );
      expect(result.current.tableProps.data).toHaveLength(12);
      expect(pagination().hasNextPage).toBe(false);
    });

    it('surfaces request errors and recovers on reload', async () => {
      let shouldFail = true;
      const getData = jest.fn(
        async ({ offset, pageSize }: OffsetParams<unknown>) => {
          if (shouldFail) {
            throw new Error('server down');
          }
          return {
            data: allItems.slice(offset, offset + pageSize),
            totalCount: 12,
          };
        },
      );
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'offset',
          getData,
          paginationOptions: { pageSize: 5 },
        }),
      );
      await flushPromises();
      expect(result.current.tableProps.error?.message).toBe('server down');
      expect(result.current.tableProps.isPending).toBe(false);

      shouldFail = false;
      act(() => result.current.reload());
      expect(result.current.tableProps.error).toBeUndefined();
      await flushPromises();
      expect(ids(result.current.tableProps.data)).toEqual([1, 2, 3, 4, 5]);
    });

    it('aborts the in-flight request on unmount', () => {
      const source = createDeferredSource<{
        data: Item[];
        totalCount: number;
      }>();
      const { unmount } = renderHook(() =>
        useTable<Item>({ mode: 'offset', getData: source.getData }),
      );
      expect(source.pending[0].signal.aborted).toBe(false);
      unmount();
      expect(source.pending[0].signal.aborted).toBe(true);
    });
  });

  describe('cursor mode', () => {
    const allItems = makeItems(12);
    const cursorSource = (withTotal = true) =>
      jest.fn(async ({ cursor, pageSize, search }: CursorParams<unknown>) => {
        const matching = allItems.filter(i => i.name.includes(search));
        const start = cursor ? Number(cursor) : 0;
        const end = start + pageSize;
        return {
          data: matching.slice(start, end),
          nextCursor: end < matching.length ? String(end) : undefined,
          prevCursor:
            start > 0 ? String(Math.max(0, start - pageSize)) : undefined,
          ...(withTotal ? { totalCount: matching.length } : {}),
        };
      });

    it('navigates with cursors from the response, caches visited pages and reports no offset', async () => {
      const getData = cursorSource();
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'cursor',
          getData,
          paginationOptions: { pageSize: 5 },
        }),
      );
      const pagination = () => result.current.tableProps.pagination as any;
      await flushPromises();
      expect(getData).toHaveBeenLastCalledWith(
        expect.objectContaining({ cursor: undefined, pageSize: 5 }),
      );
      expect(pagination()).toMatchObject({
        offset: undefined,
        totalCount: 12,
        hasNextPage: true,
        hasPreviousPage: false,
      });

      act(() => pagination().onNextPage());
      expect(getData).toHaveBeenLastCalledWith(
        expect.objectContaining({ cursor: '5' }),
      );
      await flushPromises();
      act(() => pagination().onNextPage());
      await flushPromises();
      expect(ids(result.current.tableProps.data)).toEqual([11, 12]);
      expect(pagination()).toMatchObject({
        hasNextPage: false,
        hasPreviousPage: true,
      });

      act(() => pagination().onPreviousPage());
      expect(getData).toHaveBeenCalledTimes(3);
      expect(ids(result.current.tableProps.data)).toEqual([6, 7, 8, 9, 10]);
      act(() => pagination().onPreviousPage());
      expect(ids(result.current.tableProps.data)).toEqual([1, 2, 3, 4, 5]);
      expect(pagination().hasPreviousPage).toBe(false);
    });

    it('works without totalCount and resets to the first page on query and page size changes', async () => {
      jest.useFakeTimers();
      const getData = cursorSource(false);
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'cursor',
          getData,
          paginationOptions: { pageSize: 5 },
        }),
      );
      const pagination = () => result.current.tableProps.pagination as any;
      await flushPromises();
      expect(pagination().totalCount).toBeUndefined();

      act(() => pagination().onNextPage());
      await flushPromises();
      expect(ids(result.current.tableProps.data)).toEqual([6, 7, 8, 9, 10]);

      act(() => result.current.search.onChange('1'));
      act(() => jest.advanceTimersByTime(200));
      await flushPromises();
      expect(getData).toHaveBeenLastCalledWith(
        expect.objectContaining({ cursor: undefined, search: '1' }),
      );
      expect(ids(result.current.tableProps.data)).toEqual([1, 10, 11, 12]);
      expect(pagination()).toMatchObject({
        hasNextPage: false,
        hasPreviousPage: false,
      });

      act(() => result.current.search.onChange(''));
      act(() => jest.advanceTimersByTime(200));
      await flushPromises();
      act(() => pagination().onNextPage());
      await flushPromises();
      act(() => pagination().onPageSizeChange(10));
      act(() => jest.advanceTimersByTime(200));
      await flushPromises();
      expect(getData).toHaveBeenLastCalledWith(
        expect.objectContaining({ cursor: undefined, pageSize: 10 }),
      );
      expect(result.current.tableProps.data).toHaveLength(10);
      expect(pagination().hasPreviousPage).toBe(false);
    });

    it('reload refetches the first page and drops cached pages', async () => {
      const getData = cursorSource();
      const { result } = renderHook(() =>
        useTable<Item>({
          mode: 'cursor',
          getData,
          paginationOptions: { pageSize: 5 },
        }),
      );
      const pagination = () => result.current.tableProps.pagination as any;
      await flushPromises();
      act(() => pagination().onNextPage());
      await flushPromises();
      expect(getData).toHaveBeenCalledTimes(2);

      act(() => result.current.reload());
      expect(result.current.tableProps.isStale).toBe(true);
      await flushPromises();
      expect(getData).toHaveBeenCalledTimes(3);
      expect(ids(result.current.tableProps.data)).toEqual([1, 2, 3, 4, 5]);

      act(() => pagination().onNextPage());
      expect(getData).toHaveBeenCalledTimes(4);
    });
  });
});
