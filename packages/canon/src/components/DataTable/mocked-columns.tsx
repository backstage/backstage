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
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Component } from './mocked-components';
import { Checkbox } from '../Checkbox';
import { Text } from '../Text';

export const columns: ColumnDef<Component>[] = [
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
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div>
        <Text variant="body">{row.getValue('name')}</Text>
        <Text variant="body" color="secondary">
          {row.original.description}
        </Text>
      </div>
    ),
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
    cell: ({ row }) => <Text variant="body">{row.getValue('owner')}</Text>,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <Text variant="body">{row.getValue('type')}</Text>,
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => <Text variant="body">{row.getValue('tags')}</Text>,
  },
];
