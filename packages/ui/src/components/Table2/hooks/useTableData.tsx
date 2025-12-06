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
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ClientSidePaginationConfig } from '../types';
import { UseTableDataResult } from './types';

/**
 * Hook for managing all data with optional client-side pagination.
 * If pagination config is provided, data will be sliced client-side.
 * If no pagination config is provided, returns all data without pagination.
 * Returns all pagination information needed to feed TablePagination component.
 *
 * @public
 */
export function useTableData(
  config: ClientSidePaginationConfig,
): UseTableDataResult {
  const initialOffset = config.initialOffset ?? 0;
  const initialPageSize = config.initialPageSize ?? 20;
  const [offset, setOffset] = useState(initialOffset);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const configRef = useRef(config);
  const pageSizeRef = useRef(pageSize);

  const totalCount = config.data.length;

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    pageSizeRef.current = pageSize;
  }, [pageSize]);

  // Slice the data based on current offset and pageSize
  const paginatedData = useMemo(() => {
    return config.data.slice(offset, offset + pageSize);
  }, [config.data, offset, pageSize]);

  const handleOffsetChange = useCallback(
    (newOffset: number | ((prev: number) => number)) => {
      if (typeof newOffset === 'function') {
        setOffset(prev => {
          const next = newOffset(prev);
          configRef.current.onOffsetChange?.(next);
          return next;
        });
      } else {
        setOffset(newOffset);
        configRef.current.onOffsetChange?.(newOffset);
      }
    },
    [],
  );

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setOffset(0); // Reset to first page when page size changes
    configRef.current.onPageSizeChange?.(newPageSize);
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
    data: paginatedData,
    loading: false, // No async operations
    error: null, // No errors possible
    totalCount,
    fromCount,
    toCount,
    pageSize,
    onNextPage,
    onPreviousPage,
    onPageSizeChange,
    isNextDisabled,
    isPrevDisabled,
    showPageSizeOptions: config.showPageSizeOptions ?? true,
  };
}
