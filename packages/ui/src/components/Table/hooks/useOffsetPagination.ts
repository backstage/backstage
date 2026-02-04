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
import { useState, useCallback } from 'react';
import type { TableItem } from '../types';
import type {
  UseTableOffsetOptions,
  OffsetParams,
  QueryState,
  PaginationResult,
} from './types';
import { usePageCache } from './usePageCache';
import { useStableCallback } from './useStableCallback';
import { useDebouncedReload } from './useDebouncedReload';
import { getEffectivePageSize } from './getEffectivePageSize';

export function useOffsetPagination<T extends TableItem, TFilter>(
  options: UseTableOffsetOptions<T, TFilter>,
  query: QueryState<TFilter>,
): PaginationResult<T> & { reload: () => void } {
  const { getData: getDataProp, paginationOptions = {} } = options;
  const { initialOffset = 0 } = paginationOptions;
  const defaultPageSize = getEffectivePageSize(paginationOptions);

  const getData = useStableCallback(getDataProp);
  const { sort, filter, search } = query;

  const [pageSize, setPageSize] = useState(defaultPageSize);

  const wrappedGetData = useCallback(
    async ({
      cursor,
      signal,
    }: {
      cursor: number | undefined;
      signal: AbortSignal;
    }) => {
      const currentOffset = cursor ?? 0;

      const params: OffsetParams<TFilter> = {
        offset: currentOffset,
        pageSize,
        sort,
        filter,
        search,
        signal,
      };

      const response = await getData(params);

      const prevCursor =
        currentOffset > 0 ? Math.max(0, currentOffset - pageSize) : undefined;
      const nextCursor =
        currentOffset + pageSize < response.totalCount
          ? currentOffset + pageSize
          : undefined;

      return {
        data: response.data,
        prevCursor,
        nextCursor,
        totalCount: response.totalCount,
      };
    },
    [getData, pageSize, sort, filter, search],
  );

  const cache = usePageCache<T, number>({
    getData: wrappedGetData,
    initialCurrentCursor: initialOffset > 0 ? initialOffset : undefined,
  });

  useDebouncedReload(query, pageSize, cache.reload);

  const onPageSizeChange = useCallback(
    (newSize: number) => setPageSize(newSize),
    [],
  );

  return {
    data: cache.data,
    loading: cache.loading,
    error: cache.error,
    totalCount: cache.totalCount,
    offset: cache.currentCursor ?? 0,
    pageSize,
    hasNextPage: cache.hasNextPage,
    hasPreviousPage: cache.hasPreviousPage,
    onNextPage: cache.onNextPage,
    onPreviousPage: cache.onPreviousPage,
    onPageSizeChange,
    reload: cache.reload,
  };
}
