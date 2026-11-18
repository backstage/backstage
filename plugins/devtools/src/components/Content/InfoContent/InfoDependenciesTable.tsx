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
import { coreComponentsTranslationRef } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import type { PackageDependency } from '@backstage/plugin-devtools-common';
import {
  Box,
  CellText,
  Flex,
  SearchField,
  Table,
  Text,
  useTable,
  type ColumnConfig,
  type SortDescriptor,
} from '@backstage/ui';

interface PackageDependencyRow extends PackageDependency {
  id: string;
}

const columnConfig: ColumnConfig<PackageDependencyRow>[] = [
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
    isSortable: true,
    cell: item => <CellText title={item.versions} />,
  },
];

const pageSizeOptions = [15, 30, 100];

const sortDependencies = (
  dependencies: PackageDependencyRow[],
  { column, direction }: SortDescriptor,
) => {
  if (column !== 'name' && column !== 'versions') {
    return dependencies;
  }

  return [...dependencies].sort((a, b) => {
    const comparison = a[column].localeCompare(b[column]);
    return direction === 'descending' ? -comparison : comparison;
  });
};

const searchDependencies = (
  dependencies: PackageDependencyRow[],
  query: string,
) => {
  const search = query.toLowerCase();
  return dependencies.filter(
    dependency =>
      dependency.name.toLowerCase().includes(search) ||
      dependency.versions.toLowerCase().includes(search),
  );
};

export const InfoDependenciesTable = ({
  infoDependencies,
}: {
  infoDependencies: PackageDependency[] | undefined;
}) => {
  const { t } = useTranslationRef(coreComponentsTranslationRef);
  const data = useMemo(
    () =>
      (infoDependencies ?? []).map(dependency => ({
        ...dependency,
        id: dependency.name,
      })),
    [infoDependencies],
  );
  const { tableProps, search } = useTable({
    mode: 'complete',
    data,
    initialSort: { column: 'name', direction: 'ascending' },
    paginationOptions: {
      pageSize: 15,
      pageSizeOptions,
    },
    sortFn: sortDependencies,
    searchFn: searchDependencies,
    searchDebounceMs: 200,
  });

  return (
    <Flex direction="column" gap="3">
      <Flex
        direction={{ initial: 'column', md: 'row' }}
        align={{ initial: 'stretch', md: 'center' }}
        justify="between"
        gap="3"
      >
        <Text as="h2" variant="title-small">
          Package Dependencies
        </Text>
        <Box width="100%" maxWidth="280px">
          <SearchField
            aria-label={t('table.toolbar.search')}
            placeholder={t('table.toolbar.search')}
            value={search.value}
            onChange={search.onChange}
          />
        </Box>
      </Flex>
      <Table
        columnConfig={columnConfig}
        emptyState={<Text>{t('table.body.emptyDataSourceMessage')}</Text>}
        {...tableProps}
      />
    </Flex>
  );
};
