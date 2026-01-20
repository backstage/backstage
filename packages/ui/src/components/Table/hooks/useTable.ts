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
import { useMemo, useRef } from 'react';
import type { SortState, TableItem, TableProps } from '../types';
import type {
  PaginationOptions,
  PaginationResult,
  UseTableOptions,
  UseTableResult,
} from './types';
import { useQueryState } from './useQueryState';
import { useCompletePagination } from './useCompletePagination';
import { useCursorPagination } from './useCursorPagination';
import { useOffsetPagination } from './useOffsetPagination';

function useTableProps<T extends TableItem>(
  paginationResult: PaginationResult<T>,
  sortState: SortState,
  paginationOptions: PaginationOptions = {},
): Omit<
  TableProps<T>,
  'columnConfig' | 'rowConfig' | 'selection' | 'emptyState'
> {
  const {
    showPageSizeOptions = true,
    pageSizeOptions,
    onPageSizeChange: onPageSizeChangeCallback,
    onNextPage: onNextPageCallback,
    onPreviousPage: onPreviousPageCallback,
    getLabel,
  } = paginationOptions;

  const previousDataRef = useRef(paginationResult.data);
  if (paginationResult.data) {
    previousDataRef.current = paginationResult.data;
  }

  const displayData = paginationResult.data ?? previousDataRef.current;
  const isStale = paginationResult.loading && displayData !== undefined;

  const pagination = useMemo(
    () => ({
      type: 'page' as const,
      pageSize: paginationResult.pageSize,
      pageSizeOptions,
      offset: paginationResult.offset,
      totalCount: paginationResult.totalCount,
      hasNextPage: paginationResult.hasNextPage,
      hasPreviousPage: paginationResult.hasPreviousPage,
      onNextPage: () => {
        paginationResult.onNextPage();
        onNextPageCallback?.();
      },
      onPreviousPage: () => {
        paginationResult.onPreviousPage();
        onPreviousPageCallback?.();
      },
      onPageSizeChange: (size: number) => {
        paginationResult.onPageSizeChange(size);
        onPageSizeChangeCallback?.(size);
      },
      showPageSizeOptions,
      getLabel,
    }),
    [
      paginationResult.pageSize,
      pageSizeOptions,
      paginationResult.offset,
      paginationResult.totalCount,
      paginationResult.hasNextPage,
      paginationResult.hasPreviousPage,
      paginationResult.onNextPage,
      paginationResult.onPreviousPage,
      paginationResult.onPageSizeChange,
      onNextPageCallback,
      onPreviousPageCallback,
      onPageSizeChangeCallback,
    ],
  );

  return useMemo(
    () => ({
      data: displayData,
      loading: paginationResult.loading,
      isStale,
      error: paginationResult.error,
      pagination,
      sort: sortState,
    }),
    [
      displayData,
      paginationResult.loading,
      isStale,
      paginationResult.error,
      pagination,
      showPageSizeOptions,
      getLabel,
      sortState,
    ],
  );
}

/** @public */
export function useTable<T extends TableItem, TFilter = unknown>(
  options: UseTableOptions<T, TFilter>,
): UseTableResult<T, TFilter> {
  const query = useQueryState<TFilter>(options);

  const initialModeRef = useRef(options.mode);
  if (initialModeRef.current !== options.mode) {
    throw new Error(
      `useTable mode cannot change from '${initialModeRef.current}' to '${options.mode}'. ` +
        `The mode must remain stable for the lifetime of the component.`,
    );
  }

  let pagination: PaginationResult<T> & { reload: () => void };

  if (options.mode === 'complete') {
    pagination = useCompletePagination(options, query);
  } else if (options.mode === 'offset') {
    pagination = useOffsetPagination(options, query);
  } else if (options.mode === 'cursor') {
    pagination = useCursorPagination(options, query);
  } else {
    throw new Error('Invalid mode');
  }

  const sortState: SortState = useMemo(
    () => ({ descriptor: query.sort, onSortChange: query.setSort }),
    [query.sort, query.setSort],
  );

  const tableProps = useTableProps(
    pagination,
    sortState,
    options.paginationOptions ?? {},
  );

  return {
    tableProps,
    reload: pagination.reload,
    filter: { value: query.filter, onChange: query.setFilter },
    search: { value: query.search, onChange: query.setSearch },
  };
}
