/*
 * Copyright 2020 Spotify AB
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

import { makeStyles } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import React, { FC, useCallback } from 'react';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';

import { FixedSizeList } from 'react-window';
import MUITable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import TextField from '@material-ui/core/TextField';

// const useStyles = makeStyles<typeof BackstageTheme>(theme => ({ }));
type GlobalFilterProps = {
  setGlobalFilter: any;
  preGlobalFilteredRows: any;
  globalFilter: any;
};

const GlobalFilter: FC<GlobalFilterProps> = ({
  setGlobalFilter,
  preGlobalFilteredRows,
  globalFilter,
}) => {
  const count = preGlobalFilteredRows.length;

  return (
    <TextField
      value={globalFilter || ''}
      placeholder={`${count} records...`}
      label="Search"
      onChange={e => {
        setGlobalFilter(e.target.value || undefined);
      }}
    />
  );
};

type TableProps = {
  data: Array<any>;
  columns: Array<any>;
};

const Table: FC<TableProps> = ({ columns, data }) => {
  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    state,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
  );

  // Used for react-window rendering. Which means not at all right now.
  const renderRow = useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <TableRow style={style} {...row.getRowProps()}>
          {row.cells.map(cell => {
            return (
              <TableCell {...cell.getCellProps()}>
                {cell.render('Cell')}
              </TableCell>
            );
          })}
        </TableRow>
      );
    },
    [prepareRow, rows],
  );

  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        setGlobalFilter={setGlobalFilter}
        globalFilter={state.globalFilter}
      />
      <TableContainer>
        <MUITable {...getTableProps()}>
          <TableHead>
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableCell
                    align={column.align === 'right' ? 'right' : 'left'}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <TableSortLabel
                      active={column.isSorted}
                      direction={column.isSortedDesc ? 'desc' : 'asc'}
                    >
                      {column.render('Header')}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <TableCell
                        align={cell.column.align === 'right' ? 'right' : 'left'}
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </MUITable>
      </TableContainer>
    </>
  );
};

/*
<FixedSizeList height={400} itemCount={rows.length} itemSize={35}>
  {renderRow}
</FixedSizeList>
*/

export default Table;
