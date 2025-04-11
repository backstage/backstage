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

import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from '.';
import { data, Component } from './mocked-components';
import { columns } from './mocked-columns';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

const meta = {
  title: 'Components/DataTable',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const table = useReactTable<Component>({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });

    return (
      <DataTable.Root table={table}>
        <DataTable.Table>
          <DataTable.Header>
            {table.getHeaderGroups().map(headerGroup => (
              <DataTable.Row key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <DataTable.Head key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </DataTable.Head>
                  );
                })}
              </DataTable.Row>
            ))}
          </DataTable.Header>
          <DataTable.Body>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <DataTable.Row
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <DataTable.Cell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </DataTable.Cell>
                  ))}
                </DataTable.Row>
              ))
            ) : (
              <DataTable.Row>
                <DataTable.Cell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable.Table>
        <DataTable.Pagination />
      </DataTable.Root>
    );
  },
};
