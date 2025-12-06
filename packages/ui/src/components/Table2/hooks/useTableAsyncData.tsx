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
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAsyncList } from 'react-stately';
import { OffsetPaginationConfig, CursorPaginationConfig } from '../types';
import { UseTableAsyncDataResult } from './types';

/**
 * Hook for fetching partial data asynchronously with pagination support.
 * Handles both offset and cursor pagination modes.
 * Returns all pagination information needed to feed TablePagination component.
 *
 * @public
 */
export function useTableAsyncData(
  config: OffsetPaginationConfig | CursorPaginationConfig,
): UseTableAsyncDataResult {
  if (config.mode === 'offset') {
    return useTableAsyncDataOffset(config);
  } else {
    return useTableAsyncDataCursor(config);
  }
}

// Internal implementation for offset pagination
function useTableAsyncDataOffset(
  config: OffsetPaginationConfig,
): UseTableAsyncDataResult {
  const initialOffset = config.initialOffset ?? 0;
  const initialPageSize = config.initialPageSize ?? 20;
  const [offset, setOffset] = useState(initialOffset);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(config.totalCount ?? 0);

  // Use refs to access current offset/pageSize in the load function
  const offsetRef = useRef(offset);
  const pageSizeRef = useRef(pageSize);
  const configRef = useRef(config);

  // Update refs when values change
  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    pageSizeRef.current = pageSize;
  }, [pageSize]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Use useAsyncList for data fetching
  const list = useAsyncList<Record<string, any>>({
    async load() {
      const currentOffset = offsetRef.current;
      const currentPageSize = pageSizeRef.current;

      try {
        const result = await configRef.current.fetchData(
          currentOffset,
          currentPageSize,
        );
        setTotalCount(result.totalCount);
        configRef.current.onOffsetChange?.(currentOffset);
        configRef.current.onPageSizeChange?.(currentPageSize);

        // Calculate next cursor to indicate if there are more pages
        const nextOffset = currentOffset + currentPageSize;
        const nextCursor =
          nextOffset < result.totalCount
            ? `${nextOffset}:${currentPageSize}`
            : undefined;

        return {
          items: result.data,
          cursor: nextCursor,
        };
      } catch (err) {
        throw err instanceof Error ? err : new Error('Unknown error');
      }
    },
  });

  // Track if this is the initial mount to avoid double loading
  const isInitialMount = useRef(true);

  // Reload when offset changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    list.reload();
  }, [offset]);

  // Reload when pageSize changes
  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }
    if (pageSize !== initialPageSize) {
      setOffset(0); // Reset to first page when page size changes
      list.reload();
    }
  }, [pageSize, initialPageSize]);

  const handleOffsetChange = useCallback(
    (newOffset: number | ((prev: number) => number)) => {
      if (typeof newOffset === 'function') {
        setOffset(newOffset);
      } else {
        setOffset(newOffset);
      }
    },
    [],
  );

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setOffset(0); // Reset to first page when page size changes
  }, []);

  // Calculate pagination display values
  const fromCount = offset + 1;
  const toCount = Math.min(offset + pageSize, totalCount);
  const isNextDisabled = offset + pageSize >= totalCount;
  const isPrevDisabled = offset === 0;

  const onNextPage = useCallback(() => {
    handleOffsetChange(prevOffset => {
      const currentPageSize = pageSizeRef.current;
      const nextOffset = prevOffset + currentPageSize;
      configRef.current.onOffsetChange?.(nextOffset);
      return nextOffset;
    });
  }, [handleOffsetChange]);

  const onPreviousPage = useCallback(() => {
    handleOffsetChange(prevOffset => {
      const currentPageSize = pageSizeRef.current;
      const newOffset = Math.max(0, prevOffset - currentPageSize);
      configRef.current.onOffsetChange?.(newOffset);
      return newOffset;
    });
  }, [handleOffsetChange]);

  const onPageSizeChange = useCallback(
    (newPageSize: number) => {
      configRef.current.onPageSizeChange?.(newPageSize);
      handlePageSizeChange(newPageSize);
    },
    [handlePageSizeChange],
  );

  return {
    data: list.items,
    loading: list.isLoading,
    error: list.error ?? null,
    fromCount,
    toCount,
    totalCount,
    pageSize,
    onNextPage,
    onPreviousPage,
    onPageSizeChange,
    isNextDisabled,
    isPrevDisabled,
    showPageSizeOptions: config.showPageSizeOptions ?? true,
  };
}

// Internal implementation for cursor pagination
function useTableAsyncDataCursor(
  config: CursorPaginationConfig,
): UseTableAsyncDataResult {
  const initialCursor = config.initialCursor;
  const initialLimit = config.initialLimit ?? 20;
  const [limit, setLimit] = useState(initialLimit);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined);
  const [totalCount, setTotalCount] = useState(config.totalCount ?? 0);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(
    initialCursor,
  );
  // Track approximate page number for display purposes
  const [currentPage, setCurrentPage] = useState(1);

  // Use refs to access current limit and cursor in the load function
  const limitRef = useRef(limit);
  const cursorRef = useRef(currentCursor);
  const configRef = useRef(config);

  // Update refs when values change
  useEffect(() => {
    limitRef.current = limit;
  }, [limit]);

  useEffect(() => {
    cursorRef.current = currentCursor;
  }, [currentCursor]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Use useAsyncList for data fetching
  const list = useAsyncList<Record<string, any>>({
    async load({ cursor }) {
      // Use cursorRef for manual control, or cursor from useAsyncList on initial load
      const targetCursor = cursorRef.current ?? cursor ?? initialCursor;
      const currentLimit = limitRef.current;

      try {
        const result = await configRef.current.fetchData(
          targetCursor,
          currentLimit,
        );
        setTotalCount(prevTotal => result.totalCount ?? prevTotal);
        setNextCursor(result.nextCursor);
        setPrevCursor(result.prevCursor);
        setCurrentCursor(targetCursor);
        configRef.current.onCursorChange?.(targetCursor);
        configRef.current.onLimitChange?.(currentLimit);

        return {
          items: result.data,
          cursor: result.nextCursor,
        };
      } catch (err) {
        throw err instanceof Error ? err : new Error('Unknown error');
      }
    },
  });

  // Track if this is the initial mount to avoid double loading
  const isInitialMount = useRef(true);

  // Reload when limit changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (limit !== initialLimit) {
      // Update ref synchronously before reload to ensure load() uses the correct cursor
      cursorRef.current = initialCursor;
      setCurrentCursor(initialCursor);
      setCurrentPage(1);
      list.reload();
    }
  }, [limit, initialLimit, initialCursor]);

  const fetchNext = useCallback(() => {
    if (nextCursor) {
      // Update ref synchronously before reload to ensure load() uses the correct cursor
      cursorRef.current = nextCursor;
      setCurrentCursor(nextCursor);
      setCurrentPage(prev => prev + 1);
      list.reload();
    }
  }, [nextCursor]);

  const fetchPrev = useCallback(() => {
    if (prevCursor !== undefined) {
      // Update ref synchronously before reload to ensure load() uses the correct cursor
      cursorRef.current = prevCursor;
      setCurrentCursor(prevCursor);
      setCurrentPage(prev => Math.max(1, prev - 1));
      list.reload();
    }
  }, [prevCursor]);

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      setLimit(newLimit);
      setCurrentCursor(initialCursor);
    },
    [initialCursor],
  );

  // Calculate pagination display values
  const fromCount = (currentPage - 1) * limit + 1;
  const toCount =
    totalCount !== undefined
      ? Math.min(currentPage * limit, totalCount)
      : currentPage * limit;
  const isNextDisabled = !nextCursor || list.isLoading;
  const isPrevDisabled = prevCursor === undefined || list.isLoading;

  const onNextPage = useCallback(() => {
    if (nextCursor) {
      configRef.current.onCursorChange?.(nextCursor);
      fetchNext();
    }
  }, [nextCursor, fetchNext]);

  const onPreviousPage = useCallback(() => {
    if (prevCursor !== undefined) {
      configRef.current.onCursorChange?.(prevCursor);
      fetchPrev();
    }
  }, [prevCursor, fetchPrev]);

  const onPageSizeChange = useCallback(
    (newLimit: number) => {
      configRef.current.onLimitChange?.(newLimit);
      handleLimitChange(newLimit);
    },
    [handleLimitChange],
  );

  return {
    data: list.items,
    loading: list.isLoading,
    error: list.error ?? null,
    fromCount,
    toCount,
    totalCount,
    pageSize: limit,
    onNextPage,
    onPreviousPage,
    onPageSizeChange,
    isNextDisabled,
    isPrevDisabled,
    showPageSizeOptions: config.showPageSizeOptions ?? true,
  };
}
