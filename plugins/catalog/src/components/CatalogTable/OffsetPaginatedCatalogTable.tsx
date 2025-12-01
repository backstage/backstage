/*
 * Copyright 2023 The Backstage Authors
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

import { useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import useDebounce from 'react-use/lib/useDebounce';
import type { SortDescriptor } from 'react-aria-components';
import {
  useEntityList,
  EntityTextFilter,
} from '@backstage/plugin-catalog-react';
import {
  Flex,
  Table,
  TableHeader,
  TableBody,
  Row,
  Text,
  Column,
  TablePagination,
  useTable,
  SearchField,
  Box,
} from '@backstage/ui';
import { TableColumn } from '@backstage/core-components';
import { CatalogTableRow } from './types';
import { renderCell } from './renderCell';

/**
 * Helper function to extract value from object using dot-notation path
 */
function extractValueByField(data: any, field: string): any | undefined {
  if (!field) return undefined;
  const path = field.split('.');
  let value = data[path[0]];

  for (let i = 1; i < path.length; ++i) {
    if (value === undefined || value === null) {
      return value;
    }
    value = value[path[i]];
  }

  return value;
}

interface OffsetPaginatedCatalogTableProps {
  columns: TableColumn<CatalogTableRow>[];
  data: CatalogTableRow[];
  title?: string;
  subtitle?: string;
  emptyContent?: ReactNode;
  isLoading?: boolean;
}

/**
 * @internal
 */
export function OffsetPaginatedCatalogTable(
  props: OffsetPaginatedCatalogTableProps,
) {
  const {
    columns,
    data: rawData,
    title,
    subtitle,
    emptyContent,
    isLoading,
  } = props;
  const {
    setLimit,
    setOffset,
    limit,
    totalItems,
    offset,
    updateFilters,
    queryParameters: { text: textParameter },
  } = useEntityList();

  // TODO: Figure out why this is needed
  // We need to make sure that the offset is working with the URL
  const [, setPage] = useState(
    offset && limit ? Math.floor(offset / limit) : 0,
  );

  // Ensure rawData is an array (it might be a query function)
  // Wrap in useMemo to avoid dependency issues
  const rawTableData = useMemo(
    () => (Array.isArray(rawData) ? rawData : []),
    [rawData],
  );

  // Sorting state
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(
    null,
  );

  // Sort the table data based on sortDescriptor
  const tableData = useMemo(() => {
    if (!sortDescriptor || !sortDescriptor.column) {
      return rawTableData;
    }

    const sortedData = [...rawTableData];
    const column = columns?.find(
      col => (col.field || String(col.title)) === sortDescriptor.column,
    );

    if (!column) {
      return sortedData;
    }

    // Use customSort if available, otherwise use field-based sorting
    if (column.customSort) {
      sortedData.sort((a, b) => {
        // Material Table's customSort signature: (data1, data2) => number
        // TypeScript may expect 3 params but in practice it's 2
        const result = (column.customSort as any)(a, b);
        return sortDescriptor.direction === 'descending' ? -result : result;
      });
    } else if (column.field) {
      sortedData.sort((a, b) => {
        const valueA = extractValueByField(a, column.field!);
        const valueB = extractValueByField(b, column.field!);

        // Handle arrays (like tags)
        if (Array.isArray(valueA) && Array.isArray(valueB)) {
          const strA = valueA.join(', ').toLowerCase();
          const strB = valueB.join(', ').toLowerCase();
          const result = strA.localeCompare(strB);
          return sortDescriptor.direction === 'descending' ? -result : result;
        }

        // Handle strings and other primitives
        const strA =
          valueA !== undefined && valueA !== null
            ? String(valueA).toLowerCase()
            : '';
        const strB =
          valueB !== undefined && valueB !== null
            ? String(valueB).toLowerCase()
            : '';
        const result = strA.localeCompare(strB);
        return sortDescriptor.direction === 'descending' ? -result : result;
      });
    }

    return sortedData;
  }, [rawTableData, sortDescriptor, columns]);

  const handleSortChange = useCallback(
    (descriptor: SortDescriptor) => {
      // Handle three-state cycle: none -> ascending -> descending -> none
      // If clicking the same column that's already descending and react-aria
      // wants to cycle back to ascending, reset to none instead
      if (
        sortDescriptor &&
        sortDescriptor.column === descriptor.column &&
        sortDescriptor.direction === 'descending' &&
        descriptor.direction === 'ascending'
      ) {
        // Reset to no sort
        setSortDescriptor(null);
      } else {
        setSortDescriptor(descriptor);
      }
    },
    [sortDescriptor],
  );

  const { paginationProps } = useTable({
    // Don't pass data since it's already paginated server-side
    // Pass rowCount and use controlled pagination
    pagination: {
      offset: offset ?? 0,
      pageSize: limit ?? 10,
      rowCount: totalItems,
      onOffsetChange: (newOffset: number) => {
        setOffset!(newOffset);
        if (limit) {
          setPage(Math.floor(newOffset / limit));
        }
      },
      onPageSizeChange: (newPageSize: number) => {
        setLimit!(newPageSize);
        setOffset!(0);
        setPage(0);
      },
    },
  });

  // Sync page state with offset changes
  useEffect(() => {
    if (offset !== undefined && limit) {
      setPage(Math.floor(offset / limit));
    }
  }, [offset, limit]);

  const firstVisibleColumnIndex =
    columns?.findIndex(column => column.hidden !== true) ?? -1;
  const columnsWithRowHeader = columns?.map((column, index) => ({
    ...column,
    isRowHeader: index === firstVisibleColumnIndex,
  }));

  // Search state management
  const queryParamTextFilter = useMemo(
    () => [textParameter].flat()[0],
    [textParameter],
  );

  const [search, setSearch] = useState(queryParamTextFilter ?? '');

  useDebounce(
    () => {
      updateFilters({
        text: search.length ? new EntityTextFilter(search) : undefined,
      });
    },
    250,
    [search, updateFilters],
  );

  useEffect(() => {
    if (queryParamTextFilter) {
      setSearch(queryParamTextFilter);
    }
  }, [queryParamTextFilter]);

  return (
    <>
      <Flex justify="between" align="center" mb="4">
        <Flex direction="column" gap="0">
          {title && (
            <Text variant="title-small" as="h2">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text variant="body-medium" color="secondary">
              {subtitle}
            </Text>
          )}
        </Flex>
        <Box style={{ maxWidth: '300px', width: '100%' }}>
          <SearchField
            aria-label="Search"
            placeholder="Search"
            value={search}
            onChange={setSearch}
          />
        </Box>
      </Flex>
      <Table
        sortDescriptor={sortDescriptor || undefined}
        onSortChange={handleSortChange}
      >
        <TableHeader columns={columnsWithRowHeader}>
          {column => (
            <Column
              id={column.field || String(column.title)}
              isRowHeader={column.isRowHeader}
              hidden={column.hidden}
              allowsSorting={!column.hidden}
            >
              {column.title}
            </Column>
          )}
        </TableHeader>
        <TableBody
          items={tableData}
          renderEmptyState={() =>
            emptyContent && !isLoading ? (
              <Box mt="4">
                <Text>No results found.</Text>
              </Box>
            ) : null
          }
        >
          {item => {
            return (
              <Row id={item.resolved.entityRef} columns={columnsWithRowHeader}>
                {column => renderCell(item, column)}
              </Row>
            );
          }}
        </TableBody>
      </Table>
      <TablePagination {...paginationProps} />
    </>
  );
}
