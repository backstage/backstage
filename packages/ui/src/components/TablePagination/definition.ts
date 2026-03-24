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
import type { TablePaginationOwnProps, PageSizeOption } from './types';
import styles from './TablePagination.module.css';

const DEFAULT_PAGE_SIZE_OPTIONS: PageSizeOption[] = [
  { label: 'Show 5 results', value: 5 },
  { label: 'Show 10 results', value: 10 },
  { label: 'Show 20 results', value: 20 },
  { label: 'Show 30 results', value: 30 },
  { label: 'Show 40 results', value: 40 },
  { label: 'Show 50 results', value: 50 },
];

/**
 * Component definition for TablePagination
 * @public
 */
export const TablePaginationDefinition =
  defineComponent<TablePaginationOwnProps>()({
    styles,
    classNames: {
      root: 'bui-TablePagination',
      left: 'bui-TablePaginationLeft',
      right: 'bui-TablePaginationRight',
      select: 'bui-TablePaginationSelect',
    },
    propDefs: {
      pageSize: {},
      pageSizeOptions: { default: DEFAULT_PAGE_SIZE_OPTIONS },
      offset: {},
      totalCount: {},
      hasNextPage: {},
      hasPreviousPage: {},
      onNextPage: {},
      onPreviousPage: {},
      onPageSizeChange: {},
      showPageSizeOptions: { default: true },
      getLabel: {},
    },
  });
