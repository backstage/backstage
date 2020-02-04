import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Plugin, Template, Getter, TemplateConnector } from '@devexpress/dx-react-core';
import {
  tableDetailCellColSpanGetter,
  isDetailTableCell,
  isDetailTableRow,
  TABLE_DETAIL_TYPE,
  TABLE_DATA_TYPE,
} from '@devexpress/dx-grid-core';
import { Table } from '@devexpress/dx-react-grid-material-ui';
import Button from 'shared/components/Button';
import { Icon, withStyles } from '@material-ui/core';

/*
  This plugin is derived from the original TableRowDetail plugin made by the Devexpress team.
  (https://github.com/DevExpress/devextreme-reactive/blob/master/packages/dx-react-grid/src/plugins/table-row-detail.jsx)

  Contrary to the original implementation, ours allows the user to make any column expandable.
  A contentComponent is still necessary, and is supplied to and passed down from the DataGrid
  as "detailContentComponent". In the detailContentComponent you get the expandedColumn in addition
  to the default props, so you can conditionally render something based on which column is expanded.
*/

const styles = theme => ({
  detailRow: {
    backgroundColor: 'rgba(125,125,125,0.1)',
    borderTop: `1px solid ${theme.palette.textVerySubtle}`,
    borderBottom: `1px solid ${theme.palette.textVerySubtle}`,
  },
});

const DefaultToggleContent = props => {
  const action = props.expanded ? 'Close' : 'View';
  const label = `${action} ${props.column.title || props.column.name}`;

  return (
    <Button size="small" style={{ textTransform: 'none', fontWeight: 'normal' }} gaprops={{ label }}>
      {action}
      <Icon style={{ fontSize: 20 }}>{props.expanded ? 'arrow_drop_up' : 'arrow_drop_down'}</Icon>
    </Button>
  );
};

class TableRowDetail extends PureComponent {
  static propTypes = {
    contentComponent: PropTypes.elementType,
    toggleCellComponent: PropTypes.elementType.isRequired,
    cellComponent: PropTypes.elementType.isRequired,
    rowComponent: PropTypes.elementType.isRequired,
    rowHeight: PropTypes.number,
  };

  static defaultProps = {
    toggleCellComponent: Table.Cell,
    cellComponent: Table.Cell,
    rowComponent: Table.Row,
    detailContentComponent: () => null,
  };

  static pluginDependencies = [{ name: 'RowDetailState' }, { name: 'Table' }];

  isDetailRowExpanded(expandedRows, rowId) {
    return Boolean(expandedRows[rowId]);
  }

  isColumnExpanded(expandedRows, rowId, columnName) {
    return Boolean(expandedRows[rowId] === columnName);
  }

  tableBodyRowsComputed = ({ tableBodyRows, expandedRows }) => {
    const { rowHeight } = this.props;
    let result = [...tableBodyRows];
    for (let id in expandedRows) {
      if (this.isDetailRowExpanded(expandedRows, id)) {
        const rowIndex = result.findIndex(tableRow => {
          return tableRow.type === TABLE_DATA_TYPE && `${tableRow.rowId}` === `${id}`;
        });
        if (rowIndex !== -1) {
          const insertIndex = rowIndex + 1;
          const resultRowIndex = result[rowIndex];
          const row = resultRowIndex.row;
          const rowId = resultRowIndex.rowId;
          result = [
            ...result.slice(0, insertIndex),
            {
              key: `${TABLE_DETAIL_TYPE.toString()}_${rowId}`,
              type: TABLE_DETAIL_TYPE,
              rowId,
              row,
              colSpanStart: 0,
              height: rowHeight,
            },
            ...result.slice(insertIndex),
          ];
        }
      }
    }
    return result;
  };

  getCellColSpanComputed = ({ getTableCellColSpan }) => tableDetailCellColSpanGetter(getTableCellColSpan);

  isColumnExpandable({ tableColumn, tableRow }) {
    return tableColumn.column && tableColumn.column.expandRow && tableRow.type !== 'heading';
  }

  render() {
    const {
      toggleCellComponent: ToggleCell,
      cellComponent: Cell,
      rowComponent: Row,
      detailContentComponent: Content,
    } = this.props;

    return (
      <Plugin name="TableRowDetail" dependencies={TableRowDetail.pluginDependencies}>
        <Getter name="tableBodyRows" computed={this.tableBodyRowsComputed} />
        <Getter name="getTableCellColSpan" computed={this.getCellColSpanComputed} />
        <Template name="tableCell" predicate={this.isColumnExpandable}>
          {({ tableRow, tableColumn }) => (
            <TemplateConnector>
              {({ expandedRows }, { toggleDetailRowExpanded }) => {
                if (!tableRow.row) return null;
                const { row, rowId } = tableRow;
                const { column } = tableColumn;
                const { name, renderer } = column;

                const onToggle = () => toggleDetailRowExpanded({ rowId, column: name });
                const expanded = this.isColumnExpanded(expandedRows, tableRow.rowId, name);
                const props = {
                  row,
                  column,
                  onToggle,
                  expanded,
                };

                return (
                  <ToggleCell onClick={onToggle}>
                    {renderer ? renderer(props) : <DefaultToggleContent {...props} />}
                  </ToggleCell>
                );
              }}
            </TemplateConnector>
          )}
        </Template>
        <Template name="tableCell" predicate={({ tableRow }) => isDetailTableRow(tableRow)}>
          {params => (
            <TemplateConnector>
              {({ expandedRows, tableColumns }) => {
                const { tableRow } = params;
                if (isDetailTableCell(params.tableColumn, tableColumns)) {
                  return (
                    <Cell {...params} row={params.tableRow.row}>
                      <Content
                        row={params.tableRow.row}
                        rowId={tableRow.rowId}
                        expandedColumn={expandedRows[tableRow.rowId]}
                      />
                    </Cell>
                  );
                }
                return null;
              }}
            </TemplateConnector>
          )}
        </Template>
        <Template name="tableRow" predicate={({ tableRow }) => isDetailTableRow(tableRow)}>
          {params => {
            return <Row {...params} row={params.tableRow.row} className={this.props.classes.detailRow} />;
          }}
        </Template>
      </Plugin>
    );
  }
}

export default withStyles(styles)(TableRowDetail);
