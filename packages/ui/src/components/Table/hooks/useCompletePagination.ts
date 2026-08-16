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

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { TableItem } from '../types';
import type {
  PaginationResult,
  QueryState,
  UseTableCompleteOptions,
} from './types';
import { useStableCallback } from './useStableCallback';
import { useDebouncedValue } from './useDebouncedValue';
import { getEffectivePageSize } from './getEffectivePageSize';

/** @internal */
export function useCompletePagination<T extends TableItem, TFilter>(
  options: UseTableCompleteOptions<T, TFilter>,
  query: QueryState<TFilter>,
): PaginationResult<T> & { reload: () => void } {
  const {
    data,
    getData: getDataProp = () => [],
    paginationOptions = {},
    sortFn,
    filterFn,
    searchFn,
    searchDebounceMs = 0,
    filterDebounceMs = 0,
  } = options;
  const hasGetData = 'getData' in options;
  const noPagination = paginationOptions.type === 'none';
  const { initialOffset = 0 } = paginationOptions;
  const defaultPageSize = noPagination
    ? Infinity
    : getEffectivePageSize(paginationOptions);

  const getData = useStableCallback(getDataProp);
  const { sort, filter, search } = query;

  const [items, setItems] = useState<T[] | undefined>(undefined);
  const [isPending, setIsPending] = useState(!data);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loadCount, setLoadCount] = useState(0);

  const [offset, setOffset] = useState(initialOffset);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Sync pageSize when the caller changes paginationOptions.pageSize after
  // mount. Guarded by a ref so the mount run doesn't wipe initialOffset.
  const prevDefaultPageSizeRef = useRef(defaultPageSize);
  useEffect(() => {
    if (prevDefaultPageSizeRef.current !== defaultPageSize) {
      prevDefaultPageSizeRef.current = defaultPageSize;
      setPageSize(defaultPageSize);
      setOffset(0);
    }
  }, [defaultPageSize]);

  // Load data on mount and when loadCount changes (reload trigger)
  useEffect(() => {
    if (data) {
      setIsPending(false);
      return;
    }

    if (!hasGetData) {
      // With caller-managed data, `undefined` means a load is in progress.
      setIsPending(true);
      return;
    }

    let cancelled = false;
    setIsPending(true);
    setError(undefined);

    (async () => {
      try {
        const result = getData();
        const resolvedData = result instanceof Promise ? await result : result;
        if (!cancelled) {
          setItems(resolvedData);
          setIsPending(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsPending(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [data, getData, hasGetData, loadCount]);

  // Debounced surrogates of search and filter feed the processing pipeline.
  // At delayMs === 0 (the default) these are referentially equal to the live
  // values, so behavior is identical to before this refactor.
  const debouncedSearch = useDebouncedValue(search, searchDebounceMs);
  const debouncedFilter = useDebouncedValue(filter, filterDebounceMs);

  // Reset offset when the *debounced* query changes — keying on the live query
  // would briefly flash page 1 of unfiltered data while the debounce settles.
  const debouncedQuery = useMemo(
    () => ({ sort, filter: debouncedFilter, search: debouncedSearch }),
    [sort, debouncedFilter, debouncedSearch],
  );
  const prevDebouncedQueryRef = useRef(debouncedQuery);
  useEffect(() => {
    if (prevDebouncedQueryRef.current !== debouncedQuery) {
      prevDebouncedQueryRef.current = debouncedQuery;
      setOffset(0);
    }
  }, [debouncedQuery]);

  const resolvedItems = useMemo(() => data ?? items, [data, items]);

  // Process data client-side (filter, search, sort)
  const processedData = useMemo(() => {
    if (!resolvedItems) {
      return undefined;
    }
    let result = [...resolvedItems];
    if (debouncedFilter !== undefined && filterFn) {
      result = filterFn(result, debouncedFilter);
    }
    if (debouncedSearch && searchFn) {
      result = searchFn(result, debouncedSearch);
    }
    if (sort && sortFn) {
      result = sortFn(result, sort);
    }
    return result;
  }, [
    resolvedItems,
    sort,
    debouncedFilter,
    debouncedSearch,
    filterFn,
    searchFn,
    sortFn,
  ]);

  const totalCount = processedData?.length ?? 0;

  // Clamp to the last page when the data shrinks below the current offset,
  // e.g. when caller-managed data is replaced by a shorter array.
  const effectiveOffset = useMemo(() => {
    if (noPagination || totalCount === 0) {
      return 0;
    }
    if (offset >= totalCount) {
      return Math.floor((totalCount - 1) / pageSize) * pageSize;
    }
    return offset;
  }, [noPagination, offset, totalCount, pageSize]);

  // Paginate the processed data
  const paginatedData = useMemo(
    () =>
      noPagination
        ? processedData
        : processedData?.slice(effectiveOffset, effectiveOffset + pageSize),
    [processedData, effectiveOffset, pageSize, noPagination],
  );

  const hasNextPage = !noPagination && effectiveOffset + pageSize < totalCount;
  const hasPreviousPage = !noPagination && effectiveOffset > 0;

  const onNextPage = useCallback(() => {
    if (effectiveOffset + pageSize < totalCount) {
      setOffset(effectiveOffset + pageSize);
    }
  }, [effectiveOffset, pageSize, totalCount]);

  const onPreviousPage = useCallback(() => {
    if (effectiveOffset > 0) {
      setOffset(Math.max(0, effectiveOffset - pageSize));
    }
  }, [effectiveOffset, pageSize]);

  const onPageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setOffset(0);
  }, []);

  const reload = useCallback(() => {
    setOffset(0);
    setLoadCount(c => c + 1);
  }, []);

  return {
    data: paginatedData,
    isPending: isPending,
    error,
    totalCount,
    offset: effectiveOffset,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    onNextPage,
    onPreviousPage,
    onPageSizeChange,
    reload,
  };
}
