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

import { ReactNode, useMemo } from 'react';
import {
  Alert,
  Flex,
  SearchField,
  Select,
  Table,
  Text,
  type ColumnConfig,
  type SortDescriptor,
  type TableItem,
  useTable,
} from '@backstage/ui';
import { useQueryParams } from './useQueryParams';

const ALL_PLUGINS = '__all__';

/** Fields that every telemetry row shares. */
export interface TelemetryRow extends TableItem {
  id: string;
  pluginId: string;
  name: string;
}

/** Props for {@link TelemetryTable}. */
export interface TelemetryTableProps<T extends TelemetryRow> {
  /** Used in the accessible names of the search and filter fields. */
  noun: string;
  rows: T[] | undefined;
  error?: Error;
  columnConfig: ColumnConfig<T>[];
  /** Extra fields to match the search text against, besides name and plugin. */
  searchText?: (row: T) => Array<string | undefined>;
  /** Returns the value to sort a row by for the given column ID. */
  sortValue: (row: T, column: string) => string | number | undefined;
  /** The sort order used when the URL doesn't set one. */
  defaultSort: SortDescriptor;
  /** Columns that sort highest first when they're first clicked. */
  descendingFirst?: string[];
  emptyState: ReactNode;
}

function compareValues(
  a: string | number | undefined,
  b: string | number | undefined,
): number {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  return String(a).localeCompare(String(b), 'en-US', { sensitivity: 'base' });
}

/**
 * A searchable, sortable table of telemetry definitions with a plugin filter.
 *
 * The search text, plugin filter, and sort order are kept in the query string
 * (`q`, `plugin`, `sort`, and `order`), so a filtered view can be shared and
 * survives a page refresh. Default values are left out of the URL.
 */
export function TelemetryTable<T extends TelemetryRow>(
  props: TelemetryTableProps<T>,
) {
  const {
    noun,
    rows,
    error,
    columnConfig,
    searchText,
    sortValue,
    defaultSort,
    descendingFirst = [],
    emptyState,
  } = props;

  const [params, updateParams] = useQueryParams();

  const sortableColumns = columnConfig
    .filter(column => column.isSortable)
    .map(column => column.id);
  const sortParam = params.get('sort');
  const hasSortParam = !!sortParam && sortableColumns.includes(sortParam);
  const sortColumn = hasSortParam ? sortParam : String(defaultSort.column);
  const urlDirection =
    params.get('order') === 'desc' ? 'descending' : 'ascending';
  const sortDirection = hasSortParam ? urlDirection : defaultSort.direction;
  // The table resets to the first page whenever the sort object changes, so
  // keep the same object for as long as the column and direction stay put.
  const sort: SortDescriptor = useMemo(
    () => ({ column: sortColumn, direction: sortDirection }),
    [sortColumn, sortDirection],
  );

  const handleSortChange = (next: SortDescriptor) => {
    const column = String(next.column);
    const direction =
      column !== String(sort.column) && descendingFirst.includes(column)
        ? 'descending'
        : next.direction;
    const isDefault =
      column === String(defaultSort.column) &&
      direction === defaultSort.direction;
    updateParams({
      sort: isDefault ? undefined : column,
      order: isDefault || direction === 'ascending' ? undefined : 'desc',
    });
  };

  const pluginOptions = useMemo(() => {
    const ids = Array.from(new Set((rows ?? []).map(r => r.pluginId))).sort();
    return [
      { id: ALL_PLUGINS, label: 'All plugins' },
      ...ids.map(id => ({ id, label: id })),
    ];
  }, [rows]);

  const { tableProps, search, filter } = useTable<T, string>({
    mode: 'complete',
    data: rows,
    filter: params.get('plugin') ?? ALL_PLUGINS,
    onFilterChange: pluginId =>
      updateParams({
        plugin: pluginId === ALL_PLUGINS ? undefined : pluginId,
      }),
    search: params.get('q') ?? '',
    onSearchChange: query => updateParams({ q: query || undefined }),
    sort,
    onSortChange: handleSortChange,
    sortFn: (data, { column, direction }) => {
      const sign = direction === 'descending' ? -1 : 1;
      return [...data].sort((a, b) => {
        const av = sortValue(a, String(column));
        const bv = sortValue(b, String(column));
        // Rows without a value always go last, whichever way the sort goes.
        const aEmpty = av === undefined || av === '';
        const bEmpty = bv === undefined || bv === '';
        if (aEmpty !== bEmpty) {
          return aEmpty ? 1 : -1;
        }
        return sign * compareValues(av, bv) || compareValues(a.name, b.name);
      });
    },
    paginationOptions: { pageSize: 20 },
    filterFn: (data, pluginId) =>
      pluginId === ALL_PLUGINS
        ? data
        : data.filter(row => row.pluginId === pluginId),
    searchFn: (data, query) => {
      const needle = query.trim().toLocaleLowerCase('en-US');
      if (!needle) {
        return data;
      }
      return data.filter(row =>
        [row.name, row.pluginId, ...(searchText?.(row) ?? [])].some(value =>
          value?.toLocaleLowerCase('en-US').includes(needle),
        ),
      );
    },
  });

  if (error) {
    return <Alert status="danger" description={error.message} />;
  }

  return (
    <Flex direction="column" gap="4">
      <Flex gap="4" align="end" style={{ flexWrap: 'wrap' }}>
        <SearchField
          aria-label={`Search ${noun}`}
          placeholder={`Search ${noun}`}
          value={search.value}
          onChange={search.onChange}
          style={{ flex: '0 1 300px', minWidth: 0 }}
        />
        <Select
          aria-label={`Filter ${noun} by plugin`}
          options={pluginOptions}
          value={filter.value ?? ALL_PLUGINS}
          onChange={key => filter.onChange(String(key ?? ALL_PLUGINS))}
          style={{ flex: '0 1 180px', minWidth: 0 }}
        />
      </Flex>
      <Table
        columnConfig={columnConfig}
        emptyState={
          rows?.length ? (
            <Text>No {noun} match your search or filter.</Text>
          ) : (
            emptyState
          )
        }
        {...tableProps}
      />
    </Flex>
  );
}
