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
import { useState, useCallback, useEffect, useRef } from 'react';
import type { TableItem } from '../types';
import type {
  UseTableCursorOptions,
  CursorParams,
  QueryState,
  PaginationResult,
} from './types';
import { usePageCache } from './usePageCache';
import { useStableCallback } from './useStableCallback';
import { useDebouncedReload } from './useDebouncedReload';
import { getEffectivePageSize } from './getEffectivePageSize';

export function useCursorPagination<T extends TableItem, TFilter>(
  options: UseTableCursorOptions<T, TFilter>,
  query: QueryState<TFilter>,
): PaginationResult<T> & { reload: () => void } {
  const { getData: getDataProp, paginationOptions = {} } = options;
  const defaultPageSize = getEffectivePageSize(paginationOptions);

  const getData = useStableCallback(getDataProp);
  const { sort, filter, search } = query;

  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Follow the caller's `paginationOptions.pageSize` when it changes after
  // mount, matching the behavior of complete mode.
  const prevDefaultPageSizeRef = useRef(defaultPageSize);
  useEffect(() => {
    if (prevDefaultPageSizeRef.current !== defaultPageSize) {
      prevDefaultPageSizeRef.current = defaultPageSize;
      setPageSize(defaultPageSize);
    }
  }, [defaultPageSize]);

  const wrappedGetData = useCallback(
    async ({
      cursor,
      signal,
    }: {
      cursor: string | undefined;
      signal: AbortSignal;
    }) => {
      const params: CursorParams<TFilter> = {
        cursor,
        pageSize,
        sort,
        filter,
        search,
        signal,
      };

      const response = await getData(params);

      return {
        data: response.data,
        prevCursor: response.prevCursor,
        nextCursor: response.nextCursor,
        totalCount: response.totalCount,
      };
    },
    [getData, pageSize, sort, filter, search],
  );

  const cache = usePageCache<T, string>({ getData: wrappedGetData });

  const debouncedReload = useDebouncedReload(query, pageSize, cache.reload);

  // When the query or page size changed but the debounced reload has not run
  // yet, navigating would fetch a page for the new query at the old position.
  // Flush the pending reload instead so the table lands on the first page of
  // the new result set.
  const { flush } = debouncedReload;
  const { onNextPage: cacheNextPage, onPreviousPage: cachePreviousPage } =
    cache;
  const onNextPage = useCallback(() => {
    if (!flush()) {
      cacheNextPage();
    }
  }, [flush, cacheNextPage]);
  const onPreviousPage = useCallback(() => {
    if (!flush()) {
      cachePreviousPage();
    }
  }, [flush, cachePreviousPage]);

  const onPageSizeChange = useCallback(
    (newSize: number) => setPageSize(newSize),
    [],
  );

  return {
    data: cache.data,
    isPending: cache.isPending,
    error: cache.error,
    totalCount: cache.totalCount,
    offset: undefined,
    pageSize,
    hasNextPage: cache.hasNextPage,
    hasPreviousPage: cache.hasPreviousPage,
    onNextPage,
    onPreviousPage,
    onPageSizeChange,
    reload: cache.reload,
  };
}
