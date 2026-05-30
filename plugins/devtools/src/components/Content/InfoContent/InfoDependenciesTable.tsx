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

import { useMemo } from 'react';
import {
  Box,
  CellText,
  Flex,
  SearchField,
  Table,
  Text,
  useTable,
  type ColumnConfig,
} from '@backstage/ui';
import { PackageDependency } from '@backstage/plugin-devtools-common';

type Row = PackageDependency & { id: string };

const columns: ColumnConfig<Row>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    isSortable: true,
    cell: item => <CellText title={item.name} />,
  },
  {
    id: 'versions',
    label: 'Versions',
    cell: item => <CellText title={item.versions} />,
  },
];

export const InfoDependenciesTable = ({
  infoDependencies,
}: {
  infoDependencies: PackageDependency[] | undefined;
}) => {
  const rows = useMemo<Row[] | undefined>(
    () => infoDependencies?.map(d => ({ ...d, id: d.name })),
    [infoDependencies],
  );

  const { tableProps, search } = useTable({
    mode: 'complete',
    data: rows,
    paginationOptions: {
      pageSize: 15,
      pageSizeOptions: [15, 30, 100],
    },
    initialSort: { column: 'name', direction: 'ascending' },
    sortFn: (items, { column, direction }) => {
      return [...items].sort((a, b) => {
        const aVal = column === 'name' ? a.name : a.versions;
        const bVal = column === 'name' ? b.name : b.versions;
        const cmp = aVal.localeCompare(bVal);
        return direction === 'descending' ? -cmp : cmp;
      });
    },
    searchFn: (items, query) => {
      const lowerQuery = query.toLowerCase();
      return items.filter(
        item =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.versions.toLowerCase().includes(lowerQuery),
      );
    },
  });

  return (
    <Box>
      <Flex justify="between" align="center" pb="2">
        <Text variant="title-medium" weight="bold">
          Package Dependencies
        </Text>
        <SearchField aria-label="Filter" placeholder="Filter" {...search} />
      </Flex>
      <Table columnConfig={columns} {...tableProps} />
    </Box>
  );
};
