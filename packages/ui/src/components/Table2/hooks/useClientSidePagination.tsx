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
import { useState, useCallback, useMemo } from 'react';
import { ClientSidePaginationConfig } from '../types';

// Internal hook for managing client-side pagination state
export function useClientSidePagination(
  pagination: ClientSidePaginationConfig,
) {
  const initialOffset = pagination.initialOffset ?? 0;
  const initialPageSize = pagination.initialPageSize ?? 20;
  const [offset, setOffset] = useState(initialOffset);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Slice the data based on current offset and pageSize
  const paginatedData = useMemo(() => {
    return pagination.data.slice(offset, offset + pageSize);
  }, [pagination.data, offset, pageSize]);

  const totalCount = pagination.data.length;

  const handleOffsetChange = useCallback(
    (newOffset: number) => {
      setOffset(newOffset);
      pagination.onOffsetChange?.(newOffset);
    },
    [pagination],
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      setOffset(0); // Reset to first page when page size changes
      pagination.onPageSizeChange?.(newPageSize);
    },
    [pagination],
  );

  return {
    data: paginatedData,
    loading: false, // No async operations
    error: null, // No errors possible
    offset,
    pageSize,
    totalCount,
    setOffset: handleOffsetChange,
    setPageSize: handlePageSizeChange,
  };
}
