/*
 * Copyright 2024 The Backstage Authors
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
  ColumnProps as ReactAriaColumnProps,
  TableProps as ReactAriaTableProps,
  TableHeaderProps as ReactAriaTableHeaderProps,
  TableBodyProps as ReactAriaTableBodyProps,
  RowProps as ReactAriaRowProps,
} from 'react-aria-components';
import type { ReactElement, ReactNode } from 'react';
import type { SortDescriptor as ReactStatelySortDescriptor } from 'react-stately';
import type { ColumnSize, ColumnStaticSize } from '@react-types/table';
import type { TextColors } from '../../types';
import { TablePaginationProps } from '../TablePagination';

/**
 * @public
 */
export type SortDescriptor = ReactStatelySortDescriptor;

/** @public */
export interface SortState {
  descriptor: SortDescriptor | null;
  onSortChange: (descriptor: SortDescriptor) => void;
}

/** @public */
export type TableRootOwnProps = {
  stale?: boolean;
};

/** @public */
export interface TableRootProps
  extends TableRootOwnProps,
    Omit<ReactAriaTableProps, keyof TableRootOwnProps> {}

/** @public */
export type TableHeaderOwnProps<T = object> = {
  columns?: ReactAriaTableHeaderProps<T>['columns'];
  children?: ReactAriaTableHeaderProps<T>['children'];
};

/** @public */
export interface TableHeaderProps<T>
  extends TableHeaderOwnProps<T>,
    Omit<ReactAriaTableHeaderProps<T>, keyof TableHeaderOwnProps> {}

/** @public */
export type TableBodyOwnProps = {};

/** @public */
export interface TableBodyProps<T extends object>
  extends TableBodyOwnProps,
    Omit<ReactAriaTableBodyProps<T>, keyof TableBodyOwnProps> {}

/** @public */
export type RowOwnProps<T = object> = {
  columns?: ReactAriaRowProps<T>['columns'];
  children?: ReactAriaRowProps<T>['children'];
  href?: string;
};

/** @public */
export interface RowProps<T>
  extends RowOwnProps<T>,
    Omit<ReactAriaRowProps<T>, keyof RowOwnProps> {}

/** @public */
export type ColumnOwnProps = {
  children?: React.ReactNode;
  className?: string;
};

/** @public */
export interface ColumnProps
  extends ColumnOwnProps,
    Omit<ReactAriaColumnProps, keyof ColumnOwnProps> {}

/** @public */
export type CellOwnProps = {
  className?: string;
};

/** @public */
export interface CellProps
  extends CellOwnProps,
    Omit<ReactAriaCellProps, keyof CellOwnProps> {}

/** @public */
export type CellTextOwnProps = {
  title: string;
  description?: string;
  color?: TextColors;
  leadingIcon?: React.ReactNode | null;
  href?: string;
  className?: string;
};

/** @public */
export interface CellTextProps
  extends CellTextOwnProps,
    Omit<ReactAriaCellProps, keyof CellTextOwnProps> {}

/** @public */
export type CellProfileOwnProps = {
  src?: string;
  name?: string;
  href?: string;
  description?: string;
  color?: TextColors;
  className?: string;
};

/** @public */
export interface CellProfileProps
  extends CellProfileOwnProps,
    Omit<ReactAriaCellProps, keyof CellProfileOwnProps> {}

/** @public */
export interface TableItem {
  id: string | number;
}

/** @public */
export interface NoPagination {
  type: 'none';
}

/** @public */
export interface PagePagination extends TablePaginationProps {
  type: 'page';
}

/** @public */
export type TablePaginationType = NoPagination | PagePagination;

/** @public */
export interface ColumnConfig<T extends TableItem> {
  id: string;
  label: string;
  cell: (item: T) => ReactElement;
  header?: () => ReactElement;
  isSortable?: boolean;
  isHidden?: boolean;
  width?: ColumnSize | null;
  defaultWidth?: ColumnSize | null;
  minWidth?: ColumnStaticSize | null;
  maxWidth?: ColumnStaticSize | null;
  isRowHeader?: boolean;
}

/** @public */
export interface RowConfig<T extends TableItem> {
  getHref?: (item: T) => string | undefined;
  onClick?: (item: T) => void;
  getIsDisabled?: (item: T) => boolean;
}

/** @public */
export type RowRenderFn<T extends TableItem> = (params: {
  item: T;
  index: number;
}) => ReactNode;

/** @public */
export interface TableSelection {
  mode?: ReactAriaTableProps['selectionMode'];
  behavior?: ReactAriaTableProps['selectionBehavior'];
  selected?: ReactAriaTableProps['selectedKeys'];
  onSelectionChange?: ReactAriaTableProps['onSelectionChange'];
}

/** @public */
export interface TableProps<T extends TableItem> {
  columnConfig: readonly ColumnConfig<T>[];
  data: T[] | undefined;
  loading?: boolean;
  isStale?: boolean;
  error?: Error;
  pagination: TablePaginationType;
  sort?: SortState;
  rowConfig?: RowConfig<T> | RowRenderFn<T>;
  selection?: TableSelection;
  emptyState?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
