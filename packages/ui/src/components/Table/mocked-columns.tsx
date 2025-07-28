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

import { ColumnDef } from '@tanstack/react-table';
import { DataProps } from './mocked-components';
import { Checkbox } from '../Checkbox';
import { TableCellText } from './TableCellText/TableCellText';
import { TableCellProfile } from './TableCellProfile/TableCellProfile';

export const columns: ColumnDef<DataProps>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onChange={(checked: boolean) =>
          table.toggleAllPageRowsSelected(checked)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(checked: boolean) => row.toggleSelected(checked)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <TableCellText
        title={row.getValue('name')}
        description={row.original.description}
        href="/"
      />
    ),
    size: 450,
    enableSorting: false,
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
    cell: ({ row }) => {
      const owner = row.getValue('owner') as DataProps['owner'];

      return (
        <TableCellProfile
          name={owner.name}
          src={owner.profilePicture}
          href={owner.link}
        />
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <TableCellText title={row.getValue('type')} />,
    size: 150,
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => <TableCellText title={row.getValue('tags')} />,
    size: 150,
  },
];

export const columns2: ColumnDef<DataProps>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <TableCellText title={row.getValue('type')} color="secondary" />
    ),
    size: 100,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <TableCellText title={row.getValue('name')} href="/" />,
    size: 450,
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
    cell: ({ row }) => {
      const owner = row.getValue('owner') as DataProps['owner'];

      return (
        <TableCellProfile
          name={owner.name}
          src={owner.profilePicture}
          href={owner.link}
          color="secondary"
        />
      );
    },
  },
  {
    accessorKey: 'lifecycle',
    header: 'Lifecycle',
    cell: ({ row }) => (
      <TableCellText title={row.getValue('lifecycle')} color="secondary" />
    ),
    size: 100,
  },
  {
    accessorKey: 'system',
    header: 'System',
    cell: ({ row }) => (
      <TableCellText title={row.getValue('lifecycle')} color="secondary" />
    ),
    size: 100,
  },
];
