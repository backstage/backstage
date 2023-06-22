/* not changing the working code at this point */
/* eslint no-nested-ternary: 0 */
/* eslint react-hooks/rules-of-hooks: 0 */

/*
 * Copyright 2023 The Backstage Authors
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

import React, { useEffect, useState } from 'react';
import { get, round } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import AllocationChart from './AllocationChart';
import { toCurrency } from '../util';

const useStyles = makeStyles({
  noResults: {
    padding: 24,
  },
});

function descendingComparator(a, b, orderBy) {
  if (get(b, orderBy) < get(a, orderBy)) {
    return -1;
  }
  if (get(b, orderBy) > get(a, orderBy)) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const headCells = [
  { id: 'name', numeric: false, label: 'Name', width: 'auto' },
  { id: 'cpuCost', numeric: true, label: 'CPU', width: 100 },
  { id: 'ramCost', numeric: true, label: 'RAM', width: 100 },
  { id: 'pvCost', numeric: true, label: 'PV', width: 100 },
  { id: 'totalEfficiency', numeric: true, label: 'Efficiency', width: 130 },
  { id: 'totalCost', numeric: true, label: 'Total cost', width: 130 },
];

const AllocationReport = ({
  allocationData,
  cumulativeData,
  totalData,
  currency,
}) => {
  const classes = useStyles();

  if (allocationData.length === 0) {
    return (
      <Typography variant="body2" className={classes.noResults}>
        No results
      </Typography>
    );
  }

  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('totalCost');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const numData = cumulativeData.length;

  useEffect(() => {
    setPage(0);
  }, [numData]);

  const lastPage = Math.floor(numData / rowsPerPage);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const createSortHandler = property => event =>
    handleRequestSort(event, property);

  const orderedRows = stableSort(cumulativeData, getComparator(order, orderBy));
  const pageRows = orderedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <div id="report">
      <AllocationChart
        allocationRange={allocationData}
        currency={currency}
        n={10}
        height={300}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map(cell => (
                <TableCell
                  key={cell.id}
                  colSpan={cell.colspan}
                  align={cell.numeric ? 'right' : 'left'}
                  sortDirection={orderBy === cell.id ? order : false}
                  style={{ width: cell.width }}
                >
                  <TableSortLabel
                    active={orderBy === cell.id}
                    direction={orderBy === cell.id ? order : 'asc'}
                    onClick={createSortHandler(cell.id)}
                  >
                    {cell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {headCells.map(cell => {
                return (
                  <TableCell
                    key={cell.id}
                    colSpan={cell.colspan}
                    align={cell.numeric ? 'right' : 'left'}
                    style={{ fontWeight: 500 }}
                  >
                    {cell.numeric
                      ? cell.label === 'Efficiency'
                        ? totalData.totalEfficiency === 1.0 &&
                          totalData.cpuReqCoreHrs === 0 &&
                          totalData.ramReqByteHrs === 0
                          ? 'Inf%'
                          : `${round(totalData.totalEfficiency * 100, 1)}%`
                        : toCurrency(totalData[cell.id], currency)
                      : totalData[cell.id]}
                  </TableCell>
                );
              })}
            </TableRow>
            {pageRows.map((row, key) => {
              if (row.name === '__unmounted__') {
                row.name = 'Unmounted PVs';
              }

              const isIdle = row.name.indexOf('__idle__') >= 0;
              const isUnallocated = row.name.indexOf('__unallocated__') >= 0;
              const isUnmounted = row.name.indexOf('Unmounted PVs') >= 0;

              // Replace "efficiency" with Inf if there is usage w/o request
              let efficiency = round(row.totalEfficiency * 100, 1);
              if (
                row.totalEfficiency === 1.0 &&
                row.cpuReqCoreHrs === 0 &&
                row.ramReqByteHrs === 0
              ) {
                efficiency = 'Inf';
              }

              // Do not allow drill-down for idle and unallocated rows
              if (isIdle || isUnallocated || isUnmounted) {
                return (
                  <TableRow key={key}>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="right">
                      {toCurrency(row.cpuCost, currency)}
                    </TableCell>
                    <TableCell align="right">
                      {toCurrency(row.ramCost, currency)}
                    </TableCell>
                    <TableCell align="right">
                      {toCurrency(row.pvCost, currency)}
                    </TableCell>
                    {isIdle ? (
                      <TableCell align="right">&mdash;</TableCell>
                    ) : (
                      <TableCell align="right">{efficiency}%</TableCell>
                    )}
                    <TableCell align="right">
                      {toCurrency(row.totalCost, currency)}
                    </TableCell>
                  </TableRow>
                );
              }

              return (
                <TableRow key={key}>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="right">
                    {toCurrency(row.cpuCost, currency)}
                  </TableCell>
                  <TableCell align="right">
                    {toCurrency(row.ramCost, currency)}
                  </TableCell>
                  <TableCell align="right">
                    {toCurrency(row.pvCost, currency)}
                  </TableCell>
                  <TableCell align="right">{efficiency}%</TableCell>
                  <TableCell align="right">
                    {toCurrency(row.totalCost, currency)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={numData}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
        page={Math.min(page, lastPage)}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default React.memo(AllocationReport);
