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
import {
  CellText,
  Column,
  Table,
  useTable,
  type ColumnConfig,
  type SortDescriptor,
  type TableItem,
} from '@backstage/ui';
import { PackageDependency } from '@backstage/plugin-devtools-common';

type PackageDependencyRow = PackageDependency & TableItem;

const columnConfig: ColumnConfig<PackageDependencyRow>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    isSortable: true,
    header: () => (
      <Column id="name" isRowHeader allowsSorting>
        Name
      </Column>
    ),
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
  const data = useMemo<PackageDependencyRow[]>(
    () =>
      (infoDependencies ?? []).map(dep => ({
        ...dep,
        id: dep.name,
      })),
    [infoDependencies],
  );

  const sortFn = useCallback(
    (items: PackageDependencyRow[], sort: SortDescriptor) => {
      if (sort.column !== 'name') return items;
      const direction = sort.direction === 'descending' ? -1 : 1;
      return [...items].sort(
        (a, b) => a.name.localeCompare(b.name) * direction,
      );
    },
    [],
  );

  const { tableProps } = useTable({
    mode: 'complete',
    data,
    sortFn,
    paginationOptions: {
      pageSize: 15,
      pageSizeOptions: [15, 30, 100],
    },
  });

  return <Table columnConfig={columnConfig} {...tableProps} />;
};
