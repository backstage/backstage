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
import { Table, ColumnConfig } from '@backstage/ui';
import { useMemo, ReactNode } from 'react';
import { EntityRow } from './columnFactories';

/** @public */
export interface EntityDataTableProps {
  columnConfig: ColumnConfig<EntityRow>[];
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

  return (
    <Table
      columnConfig={columnConfig}
      data={tableData}
      loading={loading}
      error={error}
      emptyState={emptyState}
      pagination={{ type: 'none' }}
    />
  );
}
