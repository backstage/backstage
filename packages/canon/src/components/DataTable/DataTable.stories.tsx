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

import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { DataTable } from '.';
import { data, DataProps } from './mocked-components';
import { columns } from './mocked-columns';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Components/DataTable',
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Uncontrolled: Story = {
  render: () => {
    const table = useReactTable<DataProps>({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });

    return (
      <DataTable.Root table={table}>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable.Root>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 4,
      pageSize: 5,
    });

    const table = useReactTable<DataProps>({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      state: {
        pagination,
      },
      onPaginationChange: setPagination,
    });

    return (
      <DataTable.Root table={table}>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable.Root>
    );
  },
};

export const WithCustomTable: Story = {
  render: () => {
    const table = useReactTable<DataProps>({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });

    return (
      <DataTable.Root table={table}>
        <DataTable.TableRoot>
          <DataTable.TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <DataTable.TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <DataTable.TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </DataTable.TableHead>
                  );
                })}
              </DataTable.TableRow>
            ))}
          </DataTable.TableHeader>
          <DataTable.TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <DataTable.TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <DataTable.TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </DataTable.TableCell>
                  ))}
                </DataTable.TableRow>
              ))
            ) : (
              <DataTable.TableRow>
                <DataTable.TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </DataTable.TableCell>
              </DataTable.TableRow>
            )}
          </DataTable.TableBody>
        </DataTable.TableRoot>
        <DataTable.Pagination />
      </DataTable.Root>
    );
  },
};
