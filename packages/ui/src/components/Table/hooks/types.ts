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

import type { TablePaginationProps } from '../../TablePagination/types';

/** @public */
export interface UseTablePaginationConfig {
  /** Total number of rows in the dataset - only needed when data is not provided at the top level */
  rowCount?: number;

  // Controlled pagination with offset/pageSize (Backstage style)
  /** Current offset. When provided, pagination is controlled */
  offset?: number;
  /** Current page size. When provided, pagination is controlled */
  pageSize?: number;
  /** Callback when offset changes */
  onOffsetChange?: (offset: number) => void;
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;

  // Uncontrolled pagination defaults
  /** Default page size for uncontrolled mode */
  defaultPageSize?: number;
  /** Default offset for uncontrolled mode */
  defaultOffset?: number;

  // Analytics callbacks
  /** Callback when next page is clicked */
  onNextPage?: () => void;
  /** Callback when previous page is clicked */
  onPreviousPage?: () => void;

  // UI options
  /** Whether to show page size options */
  showPageSizeOptions?: boolean;
}

/** @public */
export interface UseTablePagination<T = any> {
  /** Props to pass to TablePagination component */
  paginationProps: TablePaginationProps;
  /** Current offset */
  offset: number;
  /** Current page size */
  pageSize: number;
  /** Sliced data for current page - only available when data is provided to useTable */
  data?: T[];
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  previousPage: () => void;
  /** Set specific offset */
  setOffset: (offset: number) => void;
  /** Set page size */
  setPageSize: (pageSize: number) => void;
}

/** @public */
export interface UseTableConfig<T = any> {
  /** Full dataset - when provided, rowCount is calculated automatically and sliced data is returned */
  data?: T[];
  /** Pagination configuration */
  pagination?: UseTablePaginationConfig;
}

/** @public */
export interface UseTableResult<T = any> {
  /** Sliced data for current page */
  data?: T[];
  /** Props to pass to TablePagination component */
  paginationProps: TablePaginationProps;
  /** Pagination utilities */
  pagination: UseTablePagination<T>;
}
