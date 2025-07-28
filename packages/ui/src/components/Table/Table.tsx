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

import clsx from 'clsx';
import { TableProps } from './types';
import {
  RawTable,
  RawTableRow,
  RawTableHeader,
  RawTableHead,
  RawTableBody,
  RawTableCell,
} from './RawTable';
import { flexRender } from '@tanstack/react-table';

function getAriaSort(sortDirection: string | false) {
  if (sortDirection === 'asc') {
    return 'ascending';
  }
  if (sortDirection === 'desc') {
    return 'descending';
  }
  return 'none';
}

/**
 * A table component built on top of TanStack Table with built-in styling.
 *
 * @public
 */
export function Table<TData>(
  props: TableProps<TData> & { ref?: React.ForwardedRef<HTMLTableElement> },
) {
  const { className, table, onRowClick, ref, ...rest } = props;

  return (
    <RawTable
      ref={ref}
      style={{ minWidth: table.getTotalSize() }}
      className={clsx(className)}
      {...rest}
    >
      <RawTableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <RawTableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              if (header.isPlaceholder) {
                return null;
              }

              return (
                <RawTableHead
                  key={header.id}
                  style={{ width: header.getSize() }}
                  aria-sort={getAriaSort(header.column.getIsSorted())}
                  header={header}
                />
              );
            })}
          </RawTableRow>
        ))}
      </RawTableHeader>
      <RawTableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map(row => {
            const handleRowClick = onRowClick
              ? (e: React.MouseEvent<HTMLTableRowElement>) => {
                  // Only call onRowClick if the event hasn't been handled by a child element
                  if (!e.isPropagationStopped()) {
                    onRowClick(row.original, e);
                  }
                }
              : undefined;

            return (
              <RawTableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                data-clickable={!!onRowClick}
                onClick={handleRowClick}
              >
                {row.getVisibleCells().map(cell => (
                  <RawTableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </RawTableCell>
                ))}
              </RawTableRow>
            );
          })
        ) : (
          <RawTableRow>
            <RawTableCell
              colSpan={table.getAllColumns().length}
              className="h-24 text-center"
              style={{ width: table.getTotalSize() }}
            >
              No results.
            </RawTableCell>
          </RawTableRow>
        )}
      </RawTableBody>
    </RawTable>
  );
}
