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
  } = options;
  const { initialOffset = 0 } = paginationOptions;
  const defaultPageSize = getEffectivePageSize(paginationOptions);

  const getData = useStableCallback(getDataProp);
  const { sort, filter, search } = query;

  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(data ? false : true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loadCount, setLoadCount] = useState(0);

  const [offset, setOffset] = useState(initialOffset);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Load data on mount and when loadCount changes (reload trigger)
  useEffect(() => {
    if (data) {
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(undefined);

    (async () => {
      try {
        const result = getData();
        const data = result instanceof Promise ? await result : result;
        if (!cancelled) {
          setItems(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [data, getData, loadCount]);

  // Reset offset when query changes (query object is memoized)
  const prevQueryRef = useRef(query);
  useEffect(() => {
    if (prevQueryRef.current !== query) {
      prevQueryRef.current = query;
      setOffset(0);
    }
  }, [query]);

  const resolvedItems = useMemo(() => data ?? items, [data, items]);

  // Process data client-side (filter, search, sort)
  const processedData = useMemo(() => {
    let result = [...resolvedItems];
    if (filter !== undefined && filterFn) {
      result = filterFn(result, filter);
    }
    if (search && searchFn) {
      result = searchFn(result, search);
    }
    if (sort && sortFn) {
      result = sortFn(result, sort);
    }
    return result;
  }, [resolvedItems, sort, filter, search, filterFn, searchFn, sortFn]);

  const totalCount = processedData.length;

  // Paginate the processed data
  const paginatedData = useMemo(
    () => processedData.slice(offset, offset + pageSize),
    [processedData, offset, pageSize],
  );

  const hasNextPage = offset + pageSize < totalCount;
  const hasPreviousPage = offset > 0;

  const onNextPage = useCallback(() => {
    if (offset + pageSize < totalCount) {
      setOffset(offset + pageSize);
    }
  }, [offset, pageSize, totalCount]);

  const onPreviousPage = useCallback(() => {
    if (offset > 0) {
      setOffset(Math.max(0, offset - pageSize));
    }
  }, [offset, pageSize]);

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
    loading: isLoading,
    error,
    totalCount,
    offset,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    onNextPage,
    onPreviousPage,
    onPageSizeChange,
    reload,
  };
}
