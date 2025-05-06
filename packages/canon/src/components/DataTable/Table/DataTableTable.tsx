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
import clsx from 'clsx';
import { DataTableTableProps } from './types';
import { Table } from '../../Table';
import { useDataTable } from '../Root/DataTableRoot';
import { flexRender } from '@tanstack/react-table';

/** @public */
const DataTableTable = forwardRef(
  (props: DataTableTableProps, ref: React.ForwardedRef<HTMLTableElement>) => {
    const { className, ...rest } = props;
    const { table } = useDataTable();

    return (
      <Table.Root
        ref={ref}
        style={{ minWidth: table.getTotalSize() }}
        className={clsx(className)}
        {...rest}
      >
        <Table.Header>
          {table.getHeaderGroups().map(headerGroup => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <Table.Head
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
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
                  <Table.Cell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
                style={{ width: table.getTotalSize() }}
              >
                No results.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    );
  },
);

DataTableTable.displayName = 'DataTableRoot';

export { DataTableTable };
