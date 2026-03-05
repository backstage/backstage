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
import type { SortDescriptor, TableItem, TableProps } from '../types';

/** @public */
export interface FilterState<TFilter> {
  value: TFilter | undefined;
  onChange: (value: TFilter) => void;
}

/** @public */
export interface SearchState {
  value: string;
  onChange: (value: string) => void;
}

/** @public */
export interface QueryOptions<TFilter> {
  initialSort?: SortDescriptor;
  sort?: SortDescriptor | null;
  onSortChange?: (sort: SortDescriptor) => void;

  initialFilter?: TFilter;
  filter?: TFilter;
  onFilterChange?: (filter: TFilter) => void;

  initialSearch?: string;
  search?: string;
  onSearchChange?: (search: string) => void;
}

/** @public */
export interface PaginationOptions
  extends Partial<
    Pick<
      TablePaginationProps,
      | 'pageSize'
      | 'pageSizeOptions'
      | 'onPageSizeChange'
      | 'onNextPage'
      | 'onPreviousPage'
      | 'showPageSizeOptions'
      | 'getLabel'
    >
  > {
  initialOffset?: number;
}

/** @public */
export interface OffsetParams<TFilter> {
  offset: number;
  pageSize: number;
  sort: SortDescriptor | null;
  filter: TFilter | undefined;
  search: string;
  signal: AbortSignal;
}

/** @public */
export interface CursorParams<TFilter> {
  cursor: string | undefined;
  pageSize: number;
  sort: SortDescriptor | null;
  filter: TFilter | undefined;
  search: string;
  signal: AbortSignal;
}

/** @public */
export interface OffsetResponse<T> {
  data: T[];
  totalCount: number;
}

/** @public */
export interface CursorResponse<T> {
  data: T[];
  nextCursor?: string;
  prevCursor?: string;
  totalCount?: number;
}

/** @public */
export type UseTableCompleteOptions<
  T extends TableItem,
  TFilter = unknown,
> = QueryOptions<TFilter> & {
  mode: 'complete';
  paginationOptions?: PaginationOptions;
  sortFn?: (data: T[], sort: SortDescriptor) => T[];
  filterFn?: (data: T[], filter: TFilter) => T[];
  searchFn?: (data: T[], search: string) => T[];
} & (
    | {
        data: T[] | undefined;
        getData?: never;
      }
    | {
        data?: never;
        getData: () => T[] | Promise<T[]>;
      }
  );

/** @public */
export interface UseTableOffsetOptions<T extends TableItem, TFilter = unknown>
  extends QueryOptions<TFilter> {
  mode: 'offset';
  getData: (params: OffsetParams<TFilter>) => Promise<OffsetResponse<T>>;
  paginationOptions?: PaginationOptions;
}

/** @public */
export interface UseTableCursorOptions<T extends TableItem, TFilter = unknown>
  extends QueryOptions<TFilter> {
  mode: 'cursor';
  getData: (params: CursorParams<TFilter>) => Promise<CursorResponse<T>>;
  paginationOptions?: Omit<PaginationOptions, 'initialOffset'>;
}

/** @public */
export type UseTableOptions<T extends TableItem, TFilter = unknown> =
  | UseTableCompleteOptions<T, TFilter>
  | UseTableOffsetOptions<T, TFilter>
  | UseTableCursorOptions<T, TFilter>;

/** @public */
export interface UseTableResult<T extends TableItem, TFilter = unknown> {
  tableProps: Omit<
    TableProps<T>,
    'columnConfig' | 'rowConfig' | 'selection' | 'emptyState'
  >;
  reload: () => void;
  filter: FilterState<TFilter>;
  search: SearchState;
}

/** @internal */
export interface PaginationResult<T> {
  data: T[] | undefined;
  loading: boolean;
  error: Error | undefined;
  totalCount: number | undefined;
  offset?: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPageSizeChange: (size: number) => void;
}

/** @internal */
export interface QueryState<TFilter> {
  sort: SortDescriptor | null;
  setSort: (sort: SortDescriptor) => void;

  filter: TFilter | undefined;
  setFilter: (filter: TFilter) => void;

  search: string;
  setSearch: (search: string) => void;
}
