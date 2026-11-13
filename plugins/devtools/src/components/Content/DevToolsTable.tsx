/*
 * Copyright 2026 The Backstage Authors
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

import { ReactNode } from 'react';
import { get, orderBy } from 'lodash';
import {
  ColumnConfig,
  Flex,
  SearchField,
  Table,
  TableItem,
  Text,
  useTable,
} from '@backstage/ui';

/** Shared client-side sorting, search, and pagination for DevTools screens. */
export function DevToolsTable<T extends TableItem>({
  title,
  data,
  columns,
  pageSize = 5,
  pageSizeOptions = [5, 10, 20],
  initialSort,
  emptyState = <Text>No records to display</Text>,
}: {
  title: string;
  data: T[];
  columns: ColumnConfig<T>[];
  pageSize?: number;
  pageSizeOptions?: number[];
  initialSort?: string;
  emptyState?: ReactNode;
}) {
  const { tableProps, search } = useTable({
    mode: 'complete',
    data,
    paginationOptions: { pageSize, pageSizeOptions },
    initialSort: initialSort
      ? { column: initialSort, direction: 'ascending' }
      : undefined,
    sortFn: (items, sort) =>
      orderBy(
        items,
        [item => get(item, String(sort.column))],
        [sort.direction === 'ascending' ? 'asc' : 'desc'],
      ),
    searchFn: (items, query) =>
      items.filter(item =>
        columns.some(column =>
          String(get(item, column.id) ?? '')
            .toLocaleLowerCase()
            .includes(query.toLocaleLowerCase()),
        ),
      ),
  });

  return (
    <Flex direction="column" gap="4">
      <Flex align="center" justify="between" style={{ flexWrap: 'wrap' }}>
        <Text as="h2" variant="title-small">
          {title}
        </Text>
        <SearchField
          aria-label={`Search ${title}`}
          value={search.value}
          onChange={search.onChange}
        />
      </Flex>
      <Table {...tableProps} columnConfig={columns} emptyState={emptyState} />
    </Flex>
  );
}
