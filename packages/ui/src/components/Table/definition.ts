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

import { defineComponent } from '../../hooks/useDefinition';
import type {
  TableRootOwnProps,
  TableHeaderOwnProps,
  TableBodyOwnProps,
  RowOwnProps,
  ColumnOwnProps,
  CellOwnProps,
  CellTextOwnProps,
  CellProfileOwnProps,
} from './types';
import styles from './Table.module.css';

/**
 * Component definition for Table
 * @public
 */
export const TableDefinition = defineComponent<TableRootOwnProps>()({
  styles,
  classNames: {
    root: 'bui-Table',
  },
  propDefs: {
    stale: { dataAttribute: true },
  },
});

/**
 * Component definition for TableHeader
 * @internal
 */
export const TableHeaderDefinition = defineComponent<TableHeaderOwnProps>()({
  styles,
  classNames: {
    root: 'bui-TableHeader',
    headSelection: 'bui-TableHeadSelection',
  },
  propDefs: {
    columns: {},
    children: {},
  },
});

/**
 * Component definition for TableBody
 * @internal
 */
export const TableBodyDefinition = defineComponent<TableBodyOwnProps>()({
  styles,
  classNames: {
    root: 'bui-TableBody',
  },
  propDefs: {},
});

/**
 * Component definition for Row
 * @internal
 */
export const RowDefinition = defineComponent<RowOwnProps>()({
  styles,
  classNames: {
    root: 'bui-TableRow',
    cell: 'bui-TableCell',
    cellSelection: 'bui-TableCellSelection',
  },
  propDefs: {
    columns: {},
    children: {},
    href: {},
  },
});

/**
 * Component definition for Column
 * @internal
 */
export const ColumnDefinition = defineComponent<ColumnOwnProps>()({
  styles,
  classNames: {
    root: 'bui-TableHead',
    headContent: 'bui-TableHeadContent',
    headSortButton: 'bui-TableHeadSortButton',
  },
  propDefs: {
    children: {},
    className: {},
  },
});

/**
 * Component definition for Cell
 * @internal
 */
export const CellDefinition = defineComponent<CellOwnProps>()({
  styles,
  classNames: {
    root: 'bui-TableCell',
  },
  propDefs: {
    className: {},
  },
});

/**
 * Component definition for CellText
 * @internal
 */
export const CellTextDefinition = defineComponent<CellTextOwnProps>()({
  styles,
  classNames: {
    root: 'bui-TableCell',
    cellContentWrapper: 'bui-TableCellContentWrapper',
    cellContent: 'bui-TableCellContent',
    cellIcon: 'bui-TableCellIcon',
  },
  propDefs: {
    title: {},
    description: {},
    color: { default: 'primary' },
    leadingIcon: {},
    href: {},
    className: {},
  },
});

/**
 * Component definition for CellProfile
 * @internal
 */
export const CellProfileDefinition = defineComponent<CellProfileOwnProps>()({
  styles,
  classNames: {
    root: 'bui-TableCell',
    cellContentWrapper: 'bui-TableCellContentWrapper',
    cellContent: 'bui-TableCellContent',
  },
  propDefs: {
    src: {},
    name: {},
    href: {},
    description: {},
    color: { default: 'primary' },
    className: {},
  },
});
