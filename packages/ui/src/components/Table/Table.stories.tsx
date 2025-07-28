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

import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { Table, TablePagination } from '.';
import { data, DataProps } from './mocked-components';
import { columns } from './mocked-columns';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
  ColumnDef,
} from '@tanstack/react-table';
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { TableCellText } from './TableCellText/TableCellText';

const meta = {
  title: 'Components/Table',
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
      getSortedRowModel: getSortedRowModel(),
    });

    console.log(table.getState().sorting);

    return (
      <>
        <Table table={table} />
        <TablePagination table={table} />
      </>
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
      <>
        <Table table={table} />
        <TablePagination table={table} />
      </>
    );
  },
};

export const WithRowClick: Story = {
  render: () => {
    const table = useReactTable<DataProps>({
      data,
      columns, // Use default columns with no custom cell interactions
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });

    const handleRowClick = (rowData: DataProps) => {
      console.log('Pure row click:', rowData.name);
      alert(`Navigating to: ${rowData.name}`);
    };

    return (
      <>
        <Table table={table} onRowClick={handleRowClick} />
        <TablePagination table={table} />
      </>
    );
  },
};

export const WithClickableCells: Story = {
  render: () => {
    // Create columns with clickable name cells
    const clickableColumns: ColumnDef<DataProps>[] = [
      ...columns.slice(0, 1), // Keep select and name columns, but modify name
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div
            onClick={e => {
              e.stopPropagation(); // Prevent row click
              alert(`Clicked on: ${row.original.name}`);
              console.log('Cell clicked:', row.original);
            }}
            style={{ cursor: 'pointer' }}
          >
            <TableCellText
              title={row.getValue('name')}
              description={row.original.description}
            />
          </div>
        ),
        size: 450,
        enableSorting: false,
      },
      ...columns.slice(2), // Keep remaining columns
    ];

    const table = useReactTable<DataProps>({
      data,
      columns: clickableColumns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });

    return (
      <>
        <Table table={table} />
        <TablePagination table={table} />
      </>
    );
  },
};
