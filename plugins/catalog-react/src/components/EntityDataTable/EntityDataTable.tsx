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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { Table, useTable } from '@backstage/ui';
import { useCallback, useMemo, ReactNode } from 'react';
import { EntityRow, EntityColumnConfig } from './columnFactories';
import { SortDescriptor } from '@backstage/ui';

/** @public */
export interface EntityDataTableProps {
  columnConfig: EntityColumnConfig[];
  data: Entity[];
  loading?: boolean;
  error?: Error;
  emptyState?: ReactNode;
}

/** @public */
export function EntityDataTable(props: EntityDataTableProps) {
  const { columnConfig, data, loading, error, emptyState } = props;

  const tableData: EntityRow[] = useMemo(
    () =>
      data.map(entity => ({
        ...entity,
        id: stringifyEntityRef(entity),
      })),
    [data],
  );

  const sortFn = useCallback(
    (items: EntityRow[], sort: SortDescriptor) => {
      const column = columnConfig.find(c => c.id === sort.column);
      if (!column?.sortValue) {
        return items;
      }
      const getValue = column.sortValue;
      const direction = sort.direction === 'descending' ? -1 : 1;
      return [...items].sort(
        (a, b) => getValue(a).localeCompare(getValue(b)) * direction,
      );
    },
    [columnConfig],
  );

  const { tableProps } = useTable({
    mode: 'complete',
    data: tableData,
    sortFn,
    paginationOptions: { pageSize: tableData.length || 1 },
  });

  return (
    <Table
      columnConfig={columnConfig}
      {...tableProps}
      loading={loading}
      error={error}
      emptyState={emptyState}
      pagination={{ type: 'none' }}
    />
  );
}
