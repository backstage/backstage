/*
 * Copyright 2022 The Backstage Authors
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

import { useCallback, useMemo } from 'react';
import { PackageDependency } from '@backstage/plugin-devtools-common';
import {
  Card,
  CardBody,
  CardHeader,
  CellText,
  ColumnConfig,
  SearchField,
  SortDescriptor,
  Table,
  Text,
  useTable,
} from '@backstage/ui';
import styles from './InfoDependenciesTable.module.css';

interface PackageDependencyWithId extends PackageDependency {
  id: string;
}

export const InfoDependenciesTable = ({
  infoDependencies,
}: {
  infoDependencies: PackageDependency[] | undefined;
}) => {
  const infoDependenciesWithId = useMemo(
    () =>
      (infoDependencies ?? []).map(item => ({
        ...item,
        id: item.name,
      })),
    [infoDependencies],
  );

  const columns = useMemo<ColumnConfig<PackageDependencyWithId>[]>(
    () => [
      {
        id: 'name',
        label: 'Name',
        width: '70%',
        isSortable: true,
        isRowHeader: true,
        cell: item => <CellText title={item.name} />,
      },
      {
        id: 'versions',
        label: 'Versions',
        isSortable: true,
        cell: item => <CellText title={item.versions} />,
      },
    ],
    [],
  );

  const searchFn = useCallback(
    (items: PackageDependencyWithId[], query: string) => {
      const lowerQuery = query.toLowerCase();
      return items.filter(
        item =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.versions.toLowerCase().includes(lowerQuery),
      );
    },
    [],
  );

  const sortFn = useCallback(
    (
      items: PackageDependencyWithId[],
      { column, direction }: SortDescriptor,
    ) => {
      if (column !== 'name' && column !== 'versions') {
        return items;
      }
      return [...items].sort((a, b) => {
        const aVal = String(a[column]);
        const bVal = String(b[column]);
        const cmp = aVal.localeCompare(bVal);
        return direction === 'descending' ? -cmp : cmp;
      });
    },
    [],
  );

  const { tableProps, search } = useTable({
    mode: 'complete',
    data: infoDependenciesWithId || [],
    initialSort: { column: 'name', direction: 'ascending' },
    paginationOptions: {
      pageSize: 15,
      pageSizeOptions: [15, 30, 100],
    },
    searchFn,
    sortFn,
  });

  return (
    <Card className={styles.container}>
      <CardHeader className={styles.header}>
        <Text variant="title-small" weight="bold" as="h2">
          Package Dependencies
        </Text>
        <SearchField
          className={styles.searchField}
          aria-label="Search"
          placeholder="Search..."
          {...search}
        />
      </CardHeader>
      <CardBody>
        <Table
          columnConfig={columns}
          {...tableProps}
          emptyState={
            search.value ? (
              <Text>No results match "{search.value}"</Text>
            ) : (
              <Text>No records to display.</Text>
            )
          }
        />
      </CardBody>
    </Card>
  );
};
