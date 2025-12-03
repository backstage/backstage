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
import { OffsetPaginationConfig } from '../types';

// Internal hook for managing offset pagination state and data fetching using useAsyncList
export function useOffsetPagination(pagination: OffsetPaginationConfig) {
  const initialOffset = pagination.initialOffset ?? 0;
  const initialPageSize = pagination.initialPageSize ?? 20;
  const [offset, setOffset] = useState(initialOffset);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(pagination.totalCount ?? 0);

  // Use refs to access current offset/pageSize in the load function
  // This allows the load function to always use the latest values
  const offsetRef = useRef(offset);
  const pageSizeRef = useRef(pageSize);

  // Update refs when values change
  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    pageSizeRef.current = pageSize;
  }, [pageSize]);

  // Use useAsyncList - we'll use offset/pageSize from refs, not cursor
  // The cursor is used to track if there are more pages available
  const list = useAsyncList<Record<string, any>>({
    async load() {
      // Always use current offset and pageSize from refs
      const currentOffset = offsetRef.current;
      const currentPageSize = pageSizeRef.current;

      try {
        const result = await pagination.fetchData(
          currentOffset,
          currentPageSize,
        );
        setTotalCount(result.totalCount);
        pagination.onOffsetChange?.(currentOffset);
        pagination.onPageSizeChange?.(currentPageSize);

        // Calculate next cursor to indicate if there are more pages
        // Format: "offset:pageSize" or undefined if no more pages
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

  // Reload when offset changes (but not on initial mount, as useAsyncList handles that)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Trigger reload when offset changes after initial mount
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

  const handleOffsetChange = useCallback((newOffset: number) => {
    setOffset(newOffset);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setOffset(0); // Reset to first page when page size changes
  }, []);

  return {
    data: list.items,
    loading: list.isLoading,
    error: list.error,
    offset,
    pageSize,
    totalCount,
    setOffset: handleOffsetChange,
    setPageSize: handlePageSizeChange,
  };
}
