/*
 * Copyright 2024 The Backstage Authors
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

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from '../Table';
import { components } from './mocked-data/components';
import {
  // ColumnFiltersState,
  // SortingState,
  // VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { columns } from './mocked-data/columns';
import { TablePagination } from '../TablePagination';

const meta = {
  title: 'Components/Table',
  component: Table.Root,
  subcomponents: {
    Body: Table.Body as React.ComponentType<unknown>,
    Cell: Table.Cell as React.ComponentType<unknown>,
    Pagination: TablePagination as React.ComponentType<unknown>,
    Head: Table.Head as React.ComponentType<unknown>,
    Header: Table.Header as React.ComponentType<unknown>,
    Row: Table.Row as React.ComponentType<unknown>,
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const table = useReactTable({
      data: components,
      columns,
      // onSortingChange: setSorting,
      // onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      // onColumnVisibilityChange: setColumnVisibility,
      // onRowSelectionChange: setRowSelection,
      // state: {
      //   sorting,
      //   columnFilters,
      //   columnVisibility,
      //   rowSelection,
      // },
    });

    return (
      <Table.Root>
        <Table.Header>
          {table.getHeaderGroups().map(headerGroup => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <Table.Head key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Table.Head>
                );
              })}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <Table.Row
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map(cell => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={columns.length} className="h-24 text-center">
                No results.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
        <TablePagination
          pageIndex={table.getState().pagination.pageIndex}
          pageSize={table.getState().pagination.pageSize}
          totalRows={table.getRowCount()}
          onClickPrevious={() => table.previousPage()}
          onClickNext={() => table.nextPage()}
          canPrevious={table.getCanPreviousPage()}
          canNext={table.getCanNextPage()}
          setPageSize={pageSize => table.setPageSize(pageSize)}
        />
      </Table.Root>
    );
  },
};
