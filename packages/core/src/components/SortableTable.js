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

import React from 'react';
import { pure } from 'recompose';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core';

/**
 * Table header which supports sorting ascending and desc
 */
const EnhancedTableHead = ({ columns, onRequestSort, order, orderBy }) => {
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map(column => (
          <TableCell
            key={column.id}
            align={column.numeric ? 'right' : 'left'}
            size={column.disablePadding ? 'small' : 'medium'}
            sortDirection={orderBy === column.id ? order : false}
            style={column.style}
          >
            <Tooltip
              title="Sort"
              placement={column.numeric ? 'bottom-end' : 'bottom-start'}
              enterDelay={300}
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={order}
                onClick={createSortHandler(column.id)}
                style={{ whiteSpace: 'nowrap' }}
              >
                {column.label}
              </TableSortLabel>
            </Tooltip>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      disablePadding: PropTypes.bool,
      style: PropTypes.object,
    }),
  ).isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

/**
 * CellContent can be an array or a string
 */
const CellContent = ({ data }) => {
  if (Array.isArray(data)) {
    return data.map((item, index) => (
      <span key={index}>
        {item}
        <br />
      </span>
    ));
  }
  return data;
};

CellContent.propTypes = {
  data: PropTypes.any.isRequired,
};

const DataTableCell = ({ column, row }) => {
  return (
    <TableCell
      align={column.numeric ? 'right' : 'left'}
      key={column.id}
      style={{ verticalAlign: 'top' }}
    >
      <CellContent data={row[column.id] || ''} />
    </TableCell>
  );
};

const noop = () => {};
const DataTableRow = pure(({ row, columns, handleRowClick, style }) => {
  const onClick = event => (handleRowClick || noop)(event, row.id);
  return (
    <TableRow onClick={onClick} key={row.id} style={style}>
      {columns.map(column => (
        <DataTableCell key={column.id} column={column} row={row} />
      ))}
    </TableRow>
  );
});

/**
 * Table with sorting capabilites automatic rendering of cells
 * Note that the objects in props.data needs have an id property
 * The columns array defines which columns from the data to show.
 *
 * @param {Array[Object]} data A list of data entries, where object properties must
 *     be strictly equal to column ids.
 *
 * @param {Array[Object]} columns A list of columns with the following shape:
 *   {
 *     // The column identifier must be strictly equal the relevant data entry
 *     // key:
 *     id: String,
 *
 *     // The display label for the column:
 *     label: String,
 *
 *     // If true, the column contents will be right-aligned:
 *     numeric: Boolean,
 *
 *     // If true, padding will be disabled for table cells:
 *     disablePadding: Boolean,
 *
 *     // A function taking a data row and returning a suitable primitive for
 *     // sorting:
 *     sortValue: (Object) => Any
 *   }
 *
 *  @param {String} orderBy The column ID initially used for sorting
 *
 *  @param {String} [dataVersion] A version identifier for the data which *must*
 *      be updated when the contents of the data changes.  This can be used for
 *      components where the same SortableTable element will be used to display
 *      variable sets of data.
 *
 *  @param {Array[Object]} [footerData] A list of data entries to be placed in
 *      the table footer, which will not be sorted.
 *
 *  @param {(String, Event) => Void} [onRowClicked] Get notified when a user clicks
 *      on the row.  The handler will receive the row id as the first argument, and
 *      the synthetic click event as the second argument.
 *
 * @example
 * render {
 *    const data = [
 *     { id: 'buffalos', amount: 1, status: <Error />, statusValue: 2 },
 *     { id: 'milk', amount: 3, status: <Warning />, statusValue: 1 }
 *   ];
 *   const columns = [
 *     { id: 'id', label: 'ID' },
 *     { id: 'amount', disablePadding: false, numeric: true, label: 'AMOUNT' },
 *     { id: 'status', label: 'STATUS', sortValue: row => row.statusValue },
 *   ];
 *   const footerData = [
 *     { id: 'total', amount: 4, statusValue: 2, status: <Error /> },
 *   ];
 *   return (
 *    <SortableTable data={data} footerData={footerData} orderBy={'id'} columns={columns}
 *            onRowClicked={(id, ev) => {console.log('Row:' + id + ' clicked');
 *     ev.preventDefault();}}/>)
 * }
 *
 * @deprecated use shared/components/DataGrid
 */
class SortableTable extends React.Component {
  static propTypes = {
    // TODO: figure out how to make id of the object requried while others are dynamic
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    orderBy: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRowClicked: PropTypes.func,
    dataVersion: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);

    this.state = {
      orderBy: props.orderBy,
      order: 'asc',
      data: props.data,
    };
  }

  handleRequestSort = (event, property) => {
    event.preventDefault();
    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    this.updateData(this.state.data, orderBy, order);
  };

  handleRowClick = (event, id) => {
    if (this.props.onRowClicked) {
      this.props.onRowClicked(id, event);
    }
  };

  updateData = (data, orderBy, order) => {
    const sortValueFn = (
      this.props.columns.filter(col => col.id === orderBy)[0] || {}
    ).sortValue;

    const sortedData = data.slice().sort((a, b) => {
      const valueA = sortValueFn ? sortValueFn(a) : a[orderBy];
      const valueB = sortValueFn ? sortValueFn(b) : b[orderBy];
      const inc = order === 'desc' ? -1 : 1;
      if (valueA === valueB) return 0;
      if (valueA === '' || valueA === null) return inc;
      if (valueB === '' || valueB === null) return -inc;
      return valueA < valueB ? -inc : inc;
    });
    this.setState({ data: sortedData, order, orderBy });
  };

  UNSAFE_componentWillReceiveProps(props) {
    if (props.dataVersion !== this.props.dataVersion) {
      this.updateData(props.data, this.state.orderBy, this.state.order);
    }
  }

  render() {
    const { data, order, orderBy } = this.state;
    const { columns, dataVersion, footerData } = this.props;

    let tableFoot = null;
    if (footerData && footerData.length > 0) {
      tableFoot = (
        <TableFooter>
          {footerData.map(row => (
            <DataTableRow
              key={row.id}
              columns={columns}
              row={row}
              style={{ height: 'auto' }}
            />
          ))}
        </TableFooter>
      );
    }
    return (
      <Table>
        <EnhancedTableHead
          columns={columns}
          onRequestSort={this.handleRequestSort}
          order={order}
          orderBy={orderBy}
        />
        <TableBody key={dataVersion}>
          {data.map(row => (
            <DataTableRow
              key={row.id}
              columns={columns}
              row={row}
              handleRowClick={this.handleRowClick}
            />
          ))}
        </TableBody>
        {tableFoot}
      </Table>
    );
  }
}

export default SortableTable;
