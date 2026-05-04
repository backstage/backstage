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

import {
  CatalogFilterLayout,
  EntityListPagination,
  EntityListProvider,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import type { CatalogColumnHeader } from '@backstage/plugin-catalog-react/alpha';
import { Table } from '@backstage/ui';
import type { ColumnConfig } from '@backstage/ui';
import { stringifyEntityRef } from '@backstage/catalog-model';
import type { Entity } from '@backstage/catalog-model';
import { useMemo } from 'react';
import type { ReactElement, ReactNode } from 'react';

/**
 * BUI's `Table<T>` requires `T extends { id: string | number }`.
 * Catalog entities don't carry a top-level `id`, so we wrap them in this
 * row shape internally. Adopters never see `EntityRow` — the public column
 * `cell` is `(entity: Entity) => ReactElement` and the wrapping is unwound
 * by the column-config adapter below.
 */
interface EntityRow {
  id: string;
  entity: Entity;
}

/**
 * Props for {@link NextCatalogPage}.
 *
 * @alpha
 */
export type NextCatalogPageProps = {
  filters: ReactNode;
  columns: Array<{
    header: CatalogColumnHeader;
    cell: (entity: Entity) => ReactElement;
  }>;
  /**
   * Controls the catalog backend pagination mode (forwarded to
   * `EntityListProvider`). The table itself does not yet render UI
   * pagination controls — they are scheduled for a future iteration.
   */
  pagination?: EntityListPagination;
};

function buildColumnConfig(
  columns: NextCatalogPageProps['columns'],
): ColumnConfig<EntityRow>[] {
  return columns.map(({ header, cell }, index) => ({
    id: header.id,
    label: header.label,
    width: header.width,
    isSortable: Boolean(header.orderField),
    isRowHeader: index === 0,
    cell: row => cell(row.entity),
  }));
}

function NextCatalogTable(props: { columns: NextCatalogPageProps['columns'] }) {
  const { entities, loading, error } = useEntityList();
  const columnConfig = useMemo(
    () => buildColumnConfig(props.columns),
    [props.columns],
  );
  const rows = useMemo<EntityRow[]>(
    () =>
      (entities ?? []).map(entity => ({
        id: stringifyEntityRef(entity),
        entity,
      })),
    [entities],
  );
  return (
    <Table<EntityRow>
      columnConfig={columnConfig}
      data={rows}
      isPending={loading}
      error={error}
      // Table-level pagination UI is not yet wired; the pagination prop on
      // NextCatalogPageProps controls EntityListProvider's fetch mode only.
      pagination={{ type: 'none' }}
    />
  );
}

/**
 * The next-generation catalog page that renders entity columns supplied via
 * props.
 *
 * @alpha
 */
export function NextCatalogPage(props: NextCatalogPageProps) {
  const { filters, columns, pagination } = props;
  return (
    <EntityListProvider pagination={pagination}>
      <CatalogFilterLayout>
        <CatalogFilterLayout.Filters>{filters}</CatalogFilterLayout.Filters>
        <CatalogFilterLayout.Content>
          <NextCatalogTable columns={columns} />
        </CatalogFilterLayout.Content>
      </CatalogFilterLayout>
    </EntityListProvider>
  );
}
