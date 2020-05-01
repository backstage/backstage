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

import React, { FC, CSSProperties, memo, useState, useEffect } from 'react';
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

type Column = {
  id: string;
  label: string;
  numeric?: boolean;
  disablePadding: boolean;
  style: CSSProperties;
  // FIXME (@Koroeskohr)
  sortValue: (obj: object) => any;
};

// XXX (@Koroeskohr): no idea what I did but this typechecks. Need answer for CellContentProps
type Row = { [name in string]: any };

type SortHandler = (
  event: React.MouseEvent<Element, MouseEvent>,
  property: string,
) => void;

type Order = 'asc' | 'desc';

type EnhancedTableHeadProps = {
  columns: Column[];
  onRequestSort: SortHandler;
  order: Order;
  orderBy: string;
};

/**
 * Table header which supports sorting ascending and desc
 */
const EnhancedTableHead: FC<EnhancedTableHeadProps> = ({
  columns,
  onRequestSort,
  order,
  orderBy,
}) => {
  const createSortHandler = (property: string) => (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
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

type CellContentProps = {
  // XXX (@Koroeskohr): what am I supposed to use here
  data: any | any[];
};

/**
 * CellContent can be an array or a string
 */
const CellContent: FC<CellContentProps> = ({ data }) => {
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

type DataTableCellProps = {
  column: Column;
  row: Row;
};

const DataTableCell: FC<DataTableCellProps> = ({ column, row }) => {
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
type DataTableRowProps = {
  row: Row;
  columns: Column[];
  handleRowClick?: (event: React.MouseEvent, rowId: string) => void;
  style?: React.CSSProperties;
};
const _DataTableRow: FC<DataTableRowProps> = ({
  row,
  columns,
  handleRowClick,
  style,
}) => {
  const onClick: React.MouseEventHandler = event =>
    (handleRowClick || noop)(event, row.id);
  return (
    <TableRow onClick={onClick} key={row.id} style={style}>
      {columns.map(column => (
        <DataTableCell key={column.id} column={column} row={row} />
      ))}
    </TableRow>
  );
};
const DataTableRow = memo(_DataTableRow);

/**
 * Table with sorting capabilites automatic rendering of cells
 * Note that the objects in props.data needs have an id property
 * The columns array defines which columns from the data to show.
 *
 * @param data A list of data entries, where object properties must
 *     be strictly equal to column ids.
 *
 * @param columns A list of columns with the following shape:
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
 *  @param orderBy The column ID initially used for sorting
 *
 *  @param dataVersion A version identifier for the data which *must*
 *      be updated when the contents of the data changes.  This can be used for
 *      components where the same SortableTable element will be used to display
 *      variable sets of data.
 *
 *  @param footerData A list of data entries to be placed in
 *      the table footer, which will not be sorted.
 *
 *  @param onRowClicked Get notified when a user clicks
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
 * // XXX (@koroeskohr): supposedly this is leftover from your internal doc
 * @deprecated use shared/components/DataGrid
 */

type SortableTableProps = {
  data: Row[];
  footerData: Row[];
  orderBy: string;
  columns: Column[];
  onRowClicked?: (
    id: string,
    event: React.MouseEvent<Element, MouseEvent>,
  ) => void;
  dataVersion: string;
};

type TableState = {
  orderBy: string;
  order: Order;
  data: Row[];
};

const SortableTable: FC<SortableTableProps> = props => {
  const [state, setState] = useState<TableState>({
    orderBy: props.orderBy,
    order: 'asc',
    data: props.data,
  });

  const updateData = (data: Row[], orderBy: string, order: Order) => {
    const sortValueFn = (props.columns.find(col => col.id === orderBy) || {})
      .sortValue;

    const sortedData = data.slice().sort((a, b) => {
      const valueA = sortValueFn ? sortValueFn(a) : a[orderBy];
      const valueB = sortValueFn ? sortValueFn(b) : b[orderBy];
      const inc = order === 'desc' ? -1 : 1;
      if (valueA === valueB) return 0;
      if (valueA === '' || valueA === null) return inc;
      if (valueB === '' || valueB === null) return -inc;
      return valueA < valueB ? -inc : inc;
    });
    setState({ data: sortedData, order, orderBy });
  };

  const handleRequestSort: SortHandler = (event, property) => {
    event.preventDefault();
    const orderBy = property;
    let order: Order = 'desc';
    if (state.orderBy === property && state.order === 'desc') {
      order = 'asc';
    }
    updateData(state.data, orderBy, order);
  };

  const handleRowClick = (event: React.MouseEvent, id: string): void => {
    if (props.onRowClicked) {
      props.onRowClicked(id, event);
    }
  };

  useEffect(() => {
    const { data } = props;
    const { orderBy, order } = state;
    updateData(data, orderBy, order);
  }, [props.dataVersion]);

  const { data, order, orderBy } = state;
  const { columns, dataVersion, footerData } = props;

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
        onRequestSort={handleRequestSort}
        order={order}
        orderBy={orderBy}
      />
      <TableBody key={dataVersion}>
        {data.map(row => (
          <DataTableRow
            key={row.id}
            columns={columns}
            row={row}
            handleRowClick={handleRowClick}
          />
        ))}
      </TableBody>
      {tableFoot}
    </Table>
  );
};

export default SortableTable;
