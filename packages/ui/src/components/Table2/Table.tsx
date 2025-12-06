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
import { TablePagination } from '../TablePagination2';
import { useOffsetPagination } from './hooks/useOffsetPagination';
import { useCursorPagination } from './hooks/useCursorPagination';
import { useClientSidePagination } from './hooks/useClientSidePagination';
import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableRoot,
} from './components';

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

      <TableRoot {...props}>
        <TableHeader columns={columns}>
          {column => (
            <Column isRowHeader={column.isRowHeader}>{column.name}</Column>
          )}
        </TableHeader>
        <TableBody items={tableData} dependencies={[columns]}>
          {item => (
            <Row columns={columns}>
              {column => <Cell>{item[column.id]}</Cell>}
            </Row>
          )}
        </TableBody>
      </TableRoot>
      {/* Pagination controls */}
      {pagination &&
        (() => {
          // Calculate display values based on pagination mode
          let fromCount: number;
          let toCount: number;
          let totalCount: number | undefined;
          let pageSize: number;
          let isNextDisabled: boolean;
          let isPrevDisabled: boolean;
          let onNextPage: () => void;
          let onPreviousPage: () => void;
          let onPageSizeChange: (pageSize: number) => void;
          const showPageSizeOptions = pagination.showPageSizeOptions ?? true;

          if (offsetPaginationState && pagination.mode === 'offset') {
            // Offset pagination
            fromCount = offsetPaginationState.offset + 1;
            toCount = Math.min(
              offsetPaginationState.offset + offsetPaginationState.pageSize,
              offsetPaginationState.totalCount,
            );
            totalCount = offsetPaginationState.totalCount;
            pageSize = offsetPaginationState.pageSize;
            isNextDisabled =
              offsetPaginationState.offset + offsetPaginationState.pageSize >=
              offsetPaginationState.totalCount;
            isPrevDisabled = offsetPaginationState.offset === 0;
            onNextPage = () => {
              pagination.onOffsetChange?.(
                offsetPaginationState.offset + offsetPaginationState.pageSize,
              );
              offsetPaginationState.setOffset(
                offsetPaginationState.offset + offsetPaginationState.pageSize,
              );
            };
            onPreviousPage = () => {
              const prevOffset = Math.max(
                0,
                offsetPaginationState.offset - offsetPaginationState.pageSize,
              );
              pagination.onOffsetChange?.(prevOffset);
              offsetPaginationState.setOffset(prevOffset);
            };
            onPageSizeChange = (newPageSize: number) => {
              pagination.onPageSizeChange?.(newPageSize);
              offsetPaginationState.setPageSize(newPageSize);
            };
          } else if (cursorPaginationState && pagination.mode === 'cursor') {
            // Cursor pagination
            fromCount =
              (cursorPaginationState.currentPage - 1) *
                cursorPaginationState.limit +
              1;
            toCount =
              cursorPaginationState.totalCount !== undefined
                ? Math.min(
                    cursorPaginationState.currentPage *
                      cursorPaginationState.limit,
                    cursorPaginationState.totalCount,
                  )
                : cursorPaginationState.currentPage *
                  cursorPaginationState.limit;
            totalCount = cursorPaginationState.totalCount;
            pageSize = cursorPaginationState.limit;
            isNextDisabled = !cursorPaginationState.nextCursor;
            isPrevDisabled = cursorPaginationState.prevCursor === undefined;
            onNextPage = () => {
              pagination.onCursorChange?.(cursorPaginationState.nextCursor);
              cursorPaginationState.fetchNext();
            };
            onPreviousPage = () => {
              pagination.onCursorChange?.(cursorPaginationState.prevCursor);
              cursorPaginationState.fetchPrev();
            };
            onPageSizeChange = (newLimit: number) => {
              pagination.onLimitChange?.(newLimit);
              cursorPaginationState.setLimit(newLimit);
            };
          } else if (clientPaginationState && pagination.mode === 'client') {
            // Client-side pagination
            fromCount = clientPaginationState.offset + 1;
            toCount = Math.min(
              clientPaginationState.offset + clientPaginationState.pageSize,
              clientPaginationState.totalCount,
            );
            totalCount = clientPaginationState.totalCount;
            pageSize = clientPaginationState.pageSize;
            isNextDisabled =
              clientPaginationState.offset + clientPaginationState.pageSize >=
              clientPaginationState.totalCount;
            isPrevDisabled = clientPaginationState.offset === 0;
            onNextPage = () => {
              const nextOffset =
                clientPaginationState.offset + clientPaginationState.pageSize;
              pagination.onOffsetChange?.(nextOffset);
              clientPaginationState.setOffset(nextOffset);
            };
            onPreviousPage = () => {
              const prevOffset = Math.max(
                0,
                clientPaginationState.offset - clientPaginationState.pageSize,
              );
              pagination.onOffsetChange?.(prevOffset);
              clientPaginationState.setOffset(prevOffset);
            };
            onPageSizeChange = (newPageSize: number) => {
              pagination.onPageSizeChange?.(newPageSize);
              clientPaginationState.setPageSize(newPageSize);
            };
          } else {
            return null;
          }

          return (
            <TablePagination
              fromCount={fromCount}
              toCount={toCount}
              totalCount={totalCount}
              pageSize={pageSize}
              onNextPage={onNextPage}
              onPreviousPage={onPreviousPage}
              onPageSizeChange={onPageSizeChange}
              isNextDisabled={isNextDisabled}
              isPrevDisabled={isPrevDisabled}
              isLoading={isLoading}
              showPageSizeOptions={showPageSizeOptions}
            />
          );
        })()}
    </>
  );
};
