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

import { forwardRef } from 'react';
import { Table } from '../Table';
import { DataTableRoot } from './Root/DataTableRoot';
import { DataTablePagination } from './Pagination/DataTablePagination';
import { Table as TanstackTable } from '@tanstack/react-table';
import { DataTableTable } from './Table/DataTableTable';

const TableRoot = forwardRef<
  React.ElementRef<typeof Table.Root>,
  React.ComponentPropsWithoutRef<typeof Table.Root>
>(({ className, ...props }, ref) => <Table.Root ref={ref} {...props} />);
TableRoot.displayName = Table.Root.displayName;

/**
 * DataTable component for displaying tabular data with pagination
 * @public
 */
export const DataTable = {
  Root: DataTableRoot as <TData>(
    props: {
      table: TanstackTable<TData>;
    } & React.HTMLAttributes<HTMLDivElement>,
  ) => JSX.Element,
  Pagination: DataTablePagination,
  Table: DataTableTable,
  TableRoot: TableRoot,
  TableHeader: Table.Header,
  TableBody: Table.Body,
  TableRow: Table.Row,
  TableCell: Table.Cell,
  TableCellText: Table.CellText,
  TableCellLink: Table.CellLink,
  TableCellProfile: Table.CellProfile,
  TableHead: Table.Head,
};
