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

import { useState, useMemo, useCallback } from 'react';
import type { TablePaginationProps } from '../../TablePagination/types';
import type {
  UseTableConfig,
  UseTableResult,
  UseTablePagination,
} from './types';

/**
 * Hook for managing table state including pagination and future features like sorting.
 * Supports both controlled and uncontrolled modes using offset/pageSize pattern (Backstage style).
 *
 * @public
 */
export function useTable<T = any>(
  config: UseTableConfig<T> = {},
): UseTableResult<T> {
  const { data, pagination: paginationConfig = {} } = config;

  const {
    rowCount: providedRowCount,
    offset: controlledOffset,
    pageSize: controlledPageSize,
    onOffsetChange,
    onPageSizeChange,
    defaultPageSize = 10,
    defaultOffset = 0,
    onNextPage,
    onPreviousPage,
    showPageSizeOptions = true,
  } = paginationConfig;

  // Determine if we're in controlled mode
  const isControlled =
    controlledOffset !== undefined || controlledPageSize !== undefined;

  // Calculate row count from data or use provided value
  const rowCount = data?.length ?? providedRowCount ?? 0;

  // Internal state for uncontrolled mode
  const [internalOffset, setInternalOffset] = useState(defaultOffset);
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);

  // Calculate current values
  const currentOffset = controlledOffset ?? internalOffset;
  const currentPageSize = controlledPageSize ?? internalPageSize;

  // Calculate sliced data if data array is provided
  const currentData = useMemo(() => {
    if (!data) return undefined;
    return data.slice(currentOffset, currentOffset + currentPageSize);
  }, [data, currentOffset, currentPageSize]);

  // Update functions
  const setOffset = useCallback(
    (newOffset: number) => {
      if (isControlled) {
        onOffsetChange?.(newOffset);
      } else {
        setInternalOffset(newOffset);
      }
    },
    [isControlled, onOffsetChange],
  );

  const setPageSize = useCallback(
    (newPageSize: number) => {
      // When changing page size, reset to first page to avoid showing empty results
      const newOffset = 0;

      if (isControlled) {
        onPageSizeChange?.(newPageSize);
        onOffsetChange?.(newOffset);
      } else {
        setInternalPageSize(newPageSize);
        setInternalOffset(newOffset);
      }
    },
    [isControlled, onPageSizeChange, onOffsetChange],
  );

  const nextPage = useCallback(() => {
    const nextOffset = currentOffset + currentPageSize;
    if (nextOffset < rowCount) {
      onNextPage?.();
      setOffset(nextOffset);
    }
  }, [currentOffset, currentPageSize, rowCount, onNextPage, setOffset]);

  const previousPage = useCallback(() => {
    if (currentOffset > 0) {
      onPreviousPage?.();
      const prevOffset = Math.max(0, currentOffset - currentPageSize);
      setOffset(prevOffset);
    }
  }, [currentOffset, currentPageSize, onPreviousPage, setOffset]);

  // Pagination props for TablePagination component
  const paginationProps: TablePaginationProps = useMemo(
    () => ({
      offset: currentOffset,
      pageSize: currentPageSize,
      rowCount,
      setOffset,
      setPageSize,
      onNextPage,
      onPreviousPage,
      showPageSizeOptions,
    }),
    [
      currentOffset,
      currentPageSize,
      rowCount,
      setOffset,
      setPageSize,
      onNextPage,
      onPreviousPage,
      showPageSizeOptions,
    ],
  );

  const pagination: UseTablePagination<T> = useMemo(
    () => ({
      paginationProps,
      offset: currentOffset,
      pageSize: currentPageSize,
      data: currentData,
      nextPage,
      previousPage,
      setOffset,
      setPageSize,
    }),
    [
      paginationProps,
      currentOffset,
      currentPageSize,
      currentData,
      nextPage,
      previousPage,
      setOffset,
      setPageSize,
    ],
  );

  return {
    data: currentData,
    paginationProps,
    pagination,
  };
}
