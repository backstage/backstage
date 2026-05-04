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
  EntityOrderFilter,
  EntityTextFilter,
  entityRouteParams,
  entityRouteRef,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import type { CatalogColumnHeader } from '@backstage/plugin-catalog-react/alpha';
import { Cell, Table } from '@backstage/ui';
import type { ColumnConfig, SortDescriptor } from '@backstage/ui';
import { stringifyEntityRef } from '@backstage/catalog-model';
import type { Entity } from '@backstage/catalog-model';
import { useRouteRef } from '@backstage/core-plugin-api';
import { useEffect, useMemo, useState } from 'react';
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
    cell: row =>
      header.filter && !header.filter(row.entity) ? <Cell /> : cell(row.entity),
  }));
}

function NextCatalogTable(props: { columns: NextCatalogPageProps['columns'] }) {
  const { entities, loading, error, updateFilters } = useEntityList();
  const entityRoute = useRouteRef(entityRouteRef);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState('');

  const headersById = useMemo(
    () => new Map(props.columns.map(c => [c.header.id, c.header])),
    [props.columns],
  );

  const columnConfig = useMemo(
    () => buildColumnConfig(props.columns),
    [props.columns],
  );
  const rowConfig = useMemo(
    () => ({
      getHref: (row: EntityRow) => entityRoute(entityRouteParams(row.entity)),
    }),
    [entityRoute],
  );
  const rows = useMemo<EntityRow[]>(
    () =>
      (entities ?? []).map(entity => ({
        id: stringifyEntityRef(entity),
        entity,
      })),
    [entities],
  );

  const searchFields = useMemo(() => {
    const seen = new Set<string>();
    for (const { header } of props.columns) {
      for (const f of header.searchFields ?? []) {
        seen.add(f);
      }
    }
    return [...seen];
  }, [props.columns]);

  useEffect(() => {
    const handle = setTimeout(() => {
      updateFilters({
        text: searchTerm
          ? new EntityTextFilter([searchTerm, ...searchFields])
          : undefined,
      });
    }, 250);
    return () => clearTimeout(handle);
  }, [searchTerm, searchFields, updateFilters]);

  const onSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
    const header = headersById.get(String(descriptor.column));
    if (!header?.orderField) {
      return;
    }
    updateFilters({
      order: new EntityOrderFilter([
        [
          header.orderField,
          descriptor.direction === 'descending' ? 'desc' : 'asc',
        ],
      ]),
    });
  };

  return (
    <>
      <input
        type="search"
        aria-label="Search entities"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <Table<EntityRow>
        columnConfig={columnConfig}
        data={rows}
        isPending={loading}
        error={error}
        // Table-level pagination UI is not yet wired; the pagination prop on
        // NextCatalogPageProps controls EntityListProvider's fetch mode only.
        pagination={{ type: 'none' }}
        sort={{ descriptor: sortDescriptor, onSortChange }}
        rowConfig={rowConfig}
      />
    </>
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
