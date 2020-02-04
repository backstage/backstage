import React, { PureComponent } from 'react';
import { Table, TableHeaderRow, TableFilterRow } from '@devexpress/dx-react-grid-material-ui';
import { withStyles, TableCell } from '@material-ui/core';

const headerCellStyles = {
  headerCell: {
    textTransform: 'uppercase',
  },
};

const HeaderCellSortLabel = ({ column, ...restProps }) => (
  <TableHeaderRow.SortLabel
    column={column}
    {...restProps}
    getMessage={() => column.tooltip || column.title || column.name || column.id}
  />
);

class HeaderCell extends PureComponent {
  render() {
    const { tableColumn, classes, style = {}, ...props } = this.props;
    const { ...column } = tableColumn.column;
    delete column.wordWrapEnabled;
    if (column.align && !style.textAlign) {
      style.textAlign = column.align;
    }
    return <TableHeaderRow.Cell {...props} column={column} className={classes.headerCell} style={style} />;
  }
}
const styledHeaderCell = withStyles(headerCellStyles)(HeaderCell);

const Cell = props => {
  const { column } = props;
  if (column.renderer) {
    return (
      <Table.Cell {...props} style={column.cellStyle}>
        {column.renderer(props)}
      </Table.Cell>
    );
  } else {
    return <Table.Cell {...props} style={column.cellStyle} />;
  }
};

const FilterCell = props => {
  if (props.column.filteringEnabled) {
    if (props.column.filterCell) {
      return props.column.filterCell(props);
    }
    return <TableFilterRow.Cell {...props} />;
  }
  return <TableCell />;
};

const containerStyles = {
  table: {
    overflow: 'auto',
    '& table:first-child': {
      zIndex: 2,
    },
  },
};

const Container = ({ classes, ...restProps }) => <div {...restProps} className={classes.table} />;
const styledContainer = withStyles(containerStyles)(Container);

export { Cell, styledHeaderCell as HeaderCell, FilterCell, HeaderCellSortLabel, styledContainer as Container };
