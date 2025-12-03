/*
 * Copyright 2025 The Backstage Authors
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

import { useMemo, ReactNode } from 'react';
import {
  TablePagination,
  useTable,
  Table,
  TableHeader,
  TableBody,
  Row,
  Text,
  Column,
  Box,
} from '@backstage/ui';
import { TableColumn, TableProps } from '@backstage/core-components';
import { CatalogTableRow } from './types';
import { CatalogTableHeader } from './CatalogTableHeader';
import { useTableSorting } from './useTableSorting';
import { renderCell } from './renderCell';

/**
 * Pagination configuration for server-side pagination
 * @internal
 */
export interface ServerSidePaginationConfig {
  mode: 'server';
  offset: number;
  limit: number;
  totalItems: number;
  onOffsetChange: (offset: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

/**
 * Pagination configuration for client-side pagination
 * @internal
 */
export interface ClientSidePaginationConfig {
  mode: 'client';
  pageSize: number;
  rowCount: number;
  offset: number;
  onOffsetChange: (offset: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

/**
 * Props for CatalogTableBase
 * @internal
 */
export interface CatalogTableBaseProps {
  columns: TableColumn<CatalogTableRow>[];
  data: CatalogTableRow[];
  title?: string;
  subtitle?: string;
  emptyContent?: ReactNode;
  isLoading?: boolean;
  pagination: ServerSidePaginationConfig | ClientSidePaginationConfig;
  showPagination?: boolean;
  actions?: TableProps<CatalogTableRow>['actions'];
}

/**
 * Unified base component for catalog tables that handles sorting, table structure,
 * and pagination (both client-side and server-side)
 * @internal
 */
export function CatalogTableBase(props: CatalogTableBaseProps) {
  const {
    columns,
    data: rawData,
    title,
    subtitle,
    emptyContent,
    isLoading,
    pagination,
    showPagination = true,
    actions,
  } = props;

  // Ensure rawData is an array
  const tableData = useMemo(
    () => (Array.isArray(rawData) ? rawData : []),
    [rawData],
  );

  // Use sorting hook
  const { sortDescriptor, sortedData, handleSortChange } = useTableSorting(
    tableData,
    columns,
  );

  // Handle client-side pagination if needed
  const displayData = useMemo(() => {
    if (pagination.mode === 'client') {
      const start = pagination.offset;
      const end = start + pagination.pageSize;
      return sortedData.slice(start, end);
    }
    // Server-side: data is already paginated, just sort it
    return sortedData;
  }, [sortedData, pagination]);

  // Get pagination props based on mode
  const { paginationProps } = useTable({
    pagination: {
      offset: pagination.offset,
      pageSize:
        pagination.mode === 'server' ? pagination.limit : pagination.pageSize,
      rowCount:
        pagination.mode === 'server'
          ? pagination.totalItems
          : pagination.rowCount,
      onOffsetChange: pagination.onOffsetChange,
      onPageSizeChange: pagination.onPageSizeChange,
    },
  });

  // Determine if pagination should be shown
  const shouldShowPagination =
    showPagination &&
    (pagination.mode === 'server' ||
      (pagination.mode === 'client' &&
        pagination.rowCount > pagination.pageSize));

  // Prepare columns with row header information
  const firstVisibleColumnIndex =
    columns?.findIndex(column => column.hidden !== true) ?? -1;
  const columnsWithRowHeader = columns?.map((column, index) => ({
    ...column,
    isRowHeader: index === firstVisibleColumnIndex,
  }));

  // Add actions column if actions are provided
  const allColumns = useMemo(() => {
    if (actions && actions.length > 0) {
      return [
        ...columnsWithRowHeader,
        {
          title: 'Actions',
          field: '__actions__',
          hidden: false,
          isRowHeader: false,
        } as TableColumn<CatalogTableRow> & { isRowHeader: boolean },
      ];
    }
    return columnsWithRowHeader;
  }, [columnsWithRowHeader, actions]);

  return (
    <>
      <CatalogTableHeader title={title} subtitle={subtitle} />
      <Table
        sortDescriptor={sortDescriptor || undefined}
        onSortChange={handleSortChange}
      >
        <TableHeader columns={allColumns}>
          {column => {
            // Actions column is not sortable
            if (column.field === '__actions__') {
              return (
                <Column id="actions" hidden={false} allowsSorting={false}>
                  {column.title}
                </Column>
              );
            }
            return (
              <Column
                id={String(column.field || column.title)}
                isRowHeader={column.isRowHeader}
                hidden={column.hidden}
                allowsSorting={!column.hidden}
              >
                {column.title}
              </Column>
            );
          }}
        </TableHeader>
        <TableBody
          items={displayData}
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
              <Row id={item.resolved.entityRef} columns={allColumns}>
                {column => renderCell(item, column, actions)}
              </Row>
            );
          }}
        </TableBody>
      </Table>
      {shouldShowPagination && <TablePagination {...paginationProps} />}
    </>
  );
}
