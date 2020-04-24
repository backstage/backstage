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

import React, { FC } from 'react';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import type { Column } from 'react-table';
import classNames from 'classnames';

import {
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  makeStyles,
} from '@material-ui/core';

const useHighlightCellStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.grey[900],
  }
}));

const useCellStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 2, 1, 2),
  }
}));

const useHeadStyles = makeStyles(theme => ({
  root: {
    '&:first-child': {
      fontWeight: 'bold',
    },
    borderBottom: `1px solid ${theme.palette.grey[500]}`,
    borderTop: `1px solid ${theme.palette.grey[500]}`,
    textTransform: 'uppercase',
  },
}));

const useSortLabelStyles = makeStyles(theme => ({
  icon: {
    margin: theme.spacing(0, 0.5, 0, 0.5),
  }
}));

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

export type ColumnProps = {
  align?: string;
  highlight?: boolean;
};

type TableProps = {
  data: Array<any>;
  columns: Array<Column<{}>> & ColumnProps;
  showFilter?: boolean;
};

const Table: FC<TableProps> = ({ columns, data, showFilter = true }) => {
  const headerClasses = useHeadStyles();
  const sortLabelClasses = useSortLabelStyles();
  const cellClasses = useCellStyles();
  const highlightClasses = useHighlightCellStyles();

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

  return (
    <>
      {showFilter ? (
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={state.globalFilter}
        />
      ) : null}
      <TableContainer>
        <MUITable {...getTableProps()}>
          <TableHead>
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableCell
                    className={classNames(
                      headerClasses.root,
                      cellClasses.root,
                      {[highlightClasses.root]: column.highlight}
                    )}
                    align={column.align === 'right' ? 'right' : 'left'}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <TableSortLabel
                      classes={sortLabelClasses}
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
            {rows.map((row, _i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <TableCell
                        className={cellClasses.root}
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

export default Table;
