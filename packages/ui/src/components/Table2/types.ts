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

import {
  CellProps as ReactAriaCellProps,
  ColumnProps as AriaColumnProps,
} from 'react-aria-components';
import type { TextColors } from '../../types';

export interface TableColumnDefinition {
  id: string;
  name: string;
  isRowHeader?: boolean;
  isHidden?: boolean;
  isSortable?: boolean;
}

export interface OffsetPaginationConfig {
  mode: 'offset';
  fetchData: (
    offset: number,
    pageSize: number,
  ) => Promise<{
    data: Record<string, any>[];
    totalCount: number;
  }>;
  totalCount?: number; // Optional, can be provided initially or fetched
  initialOffset?: number;
  initialPageSize?: number;
  onOffsetChange?: (offset: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPageSizeOptions?: boolean;
}

export interface CursorPaginationConfig {
  mode: 'cursor';
  fetchData: (
    cursor: string | undefined,
    limit: number,
  ) => Promise<{
    data: Record<string, any>[];
    nextCursor?: string;
    prevCursor?: string;
    totalCount?: number;
  }>;
  totalCount?: number; // Optional, can be provided initially or fetched
  initialCursor?: string;
  initialLimit?: number;
  showPageSizeOptions?: boolean; // Default: true
  onCursorChange?: (cursor: string | undefined) => void;
  onLimitChange?: (limit: number) => void;
}

export interface ClientSidePaginationConfig {
  mode: 'client';
  data: Record<string, any>[]; // All data to paginate
  initialPageSize?: number; // Default: 20
  initialOffset?: number; // Default: 0
  showPageSizeOptions?: boolean; // Default: true
  onOffsetChange?: (offset: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

import { UseTableAsyncDataResult, UseTableDataResult } from './hooks/types';

export interface TableProps {
  columns: TableColumnDefinition[];
  data: Record<string, any>[];
  pagination?: UseTableAsyncDataResult | UseTableDataResult;
  loading?: boolean;
  error?: Error | null;
}

/** @public */
export interface CellProps extends ReactAriaCellProps {}

/** @public */
export interface CellTextProps extends ReactAriaCellProps {
  title: string;
  description?: string;
  color?: TextColors;
  leadingIcon?: React.ReactNode | null;
  href?: string;
}

/** @public */
export interface CellProfileProps extends ReactAriaCellProps {
  src?: string;
  name?: string;
  href?: string;
  description?: string;
  color?: TextColors;
}

export interface ColumnProps extends Omit<AriaColumnProps, 'children'> {
  children?: React.ReactNode;
}
