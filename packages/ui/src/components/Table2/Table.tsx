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
import { TableProps } from './types';
import {
  Table as ReactAriaTable,
  TableBody as ReactAriaTableBody,
  TableHeader as ReactAriaTableHeader,
  Column as ReactAriaColumn,
  Row as ReactAriaRow,
  Cell as ReactAriaCell,
} from 'react-aria-components';
import { TablePagination } from '../TablePagination2';
import { useOffsetPagination } from './hooks/useOffsetPagination';
import { useCursorPagination } from './hooks/useCursorPagination';
import { useClientSidePagination } from './hooks/useClientSidePagination';

export const Table = (props: TableProps) => {
  const { columns, data: staticData, pagination } = props;

  // Use appropriate pagination hook based on mode
  const offsetPaginationState =
    pagination?.mode === 'offset' ? useOffsetPagination(pagination) : null;
  const cursorPaginationState =
    pagination?.mode === 'cursor' ? useCursorPagination(pagination) : null;
  const clientPaginationState =
    pagination?.mode === 'client' ? useClientSidePagination(pagination) : null;

  // Determine which data to use
  const tableData =
    offsetPaginationState?.data ??
    cursorPaginationState?.data ??
    clientPaginationState?.data ??
    staticData ??
    [];
  const isLoading =
    offsetPaginationState?.loading ??
    cursorPaginationState?.loading ??
    clientPaginationState?.loading ??
    false;
  const error =
    offsetPaginationState?.error ??
    cursorPaginationState?.error ??
    clientPaginationState?.error;

  return (
    <>
      {error && (
        <div style={{ color: 'red', padding: '10px' }}>
          Error: {error.message}
        </div>
      )}
      {isLoading && <div style={{ padding: '10px' }}>Loading...</div>}
      <ReactAriaTable aria-label="Files" {...props}>
        <ReactAriaTableHeader columns={columns}>
          {column => (
            <ReactAriaColumn isRowHeader={column.isRowHeader}>
              {column.name}
            </ReactAriaColumn>
          )}
        </ReactAriaTableHeader>
        <ReactAriaTableBody items={tableData} dependencies={[columns]}>
          {item => (
            <ReactAriaRow columns={columns}>
              {column => <ReactAriaCell>{item[column.id]}</ReactAriaCell>}
            </ReactAriaRow>
          )}
        </ReactAriaTableBody>
      </ReactAriaTable>
      {/* Offset pagination controls */}
      {offsetPaginationState && pagination?.mode === 'offset' && (
        <TablePagination.Offset
          offset={offsetPaginationState.offset}
          pageSize={offsetPaginationState.pageSize}
          rowCount={offsetPaginationState.totalCount}
          setOffset={offsetPaginationState.setOffset}
          setPageSize={offsetPaginationState.setPageSize}
          showPageSizeOptions={pagination.showPageSizeOptions ?? true}
        />
      )}

      {/* Cursor pagination controls */}
      {cursorPaginationState && pagination?.mode === 'cursor' && (
        <TablePagination.Cursor
          nextCursor={cursorPaginationState.nextCursor}
          prevCursor={cursorPaginationState.prevCursor}
          totalCount={cursorPaginationState.totalCount}
          currentPage={cursorPaginationState.currentPage}
          limit={cursorPaginationState.limit}
          fetchNext={cursorPaginationState.fetchNext}
          fetchPrev={cursorPaginationState.fetchPrev}
          setLimit={cursorPaginationState.setLimit}
          showPageSizeOptions={
            pagination.mode === 'cursor'
              ? pagination.showPageSizeOptions ?? true
              : true
          }
          isLoading={isLoading}
        />
      )}

      {/* Client-side pagination controls */}
      {clientPaginationState && pagination?.mode === 'client' && (
        <TablePagination.Offset
          offset={clientPaginationState.offset}
          pageSize={clientPaginationState.pageSize}
          rowCount={clientPaginationState.totalCount}
          setOffset={clientPaginationState.setOffset}
          setPageSize={clientPaginationState.setPageSize}
          showPageSizeOptions={pagination.showPageSizeOptions ?? true}
        />
      )}
    </>
  );
};
