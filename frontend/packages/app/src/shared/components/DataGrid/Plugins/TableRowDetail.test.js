import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { IntegratedPaging, PagingState } from '@devexpress/dx-react-grid';
import { Grid, PagingPanel, Table, TableHeaderRow, VirtualTable } from '@devexpress/dx-react-grid-material-ui';
import TableRowDetail from './TableRowDetail';
import RowDetailState from './RowDetailState';

const minProps = {
  columns: [{ name: 'id' }, { name: 'info', expandRow: true }],
  rows: [{ id: 'a', info: 'information for a' }],
};

function withTable(gridProps = {}, rowDetailStateProps = {}, tableRowDetailProps = {}) {
  return render(
    <Grid {...minProps} {...gridProps}>
      <RowDetailState {...rowDetailStateProps} />
      <Table />
      <TableRowDetail {...tableRowDetailProps} />
      <TableHeaderRow />
    </Grid>,
  );
}

function withPaginatedTable(gridProps = {}, rowDetailStateProps = {}, tableRowDetailProps = {}) {
  return render(
    <Grid {...minProps} {...gridProps}>
      <PagingState />
      <IntegratedPaging />
      <RowDetailState {...rowDetailStateProps} />
      <Table />
      <PagingPanel />
      <TableRowDetail {...tableRowDetailProps} />
      <TableHeaderRow />
    </Grid>,
  );
}

function withVirtualTable(gridProps = {}, rowDetailStateProps = {}, tableRowDetailProps = {}) {
  return render(
    <Grid {...minProps} {...gridProps}>
      <RowDetailState {...rowDetailStateProps} />
      <VirtualTable />
      <TableRowDetail {...tableRowDetailProps} />
      <TableHeaderRow />
    </Grid>,
  );
}

const tables = [withTable, withPaginatedTable, withVirtualTable];

describe('TableRowDetail', () => {
  it('does not explode when supplied to the grid', () => {
    expect(withTable()).toBeTruthy();
    expect(withPaginatedTable()).toBeTruthy();
    expect(withVirtualTable()).toBeTruthy();
  });

  it('renders columns with expandRow: true as default toggleable cells', () => {
    tables.forEach(table => {
      const { getByText } = table();
      expect(getByText('View')).toBeInTheDocument();
      fireEvent.click(getByText('View'));
      expect(getByText('Close')).toBeInTheDocument();
      cleanup();
    });
  });

  it('does not render a toggle in header cells', () => {
    tables.forEach(table => {
      const { getByText } = table();
      expect(getByText('id')).toBeInTheDocument();
      expect(getByText('info')).toBeInTheDocument();
      cleanup();
    });
  });

  it('calls onExpandedRowsChange on user toggle', () => {
    tables.forEach(table => {
      const onExpandedRowsChange = jest.fn();
      const { getByText } = table({}, { onExpandedRowsChange });
      fireEvent.click(getByText('View'));
      expect(onExpandedRowsChange).toHaveBeenCalledTimes(1);
      cleanup();
    });
  });

  it('renders custom toggle button if column has renderer function', () => {
    tables.forEach(table => {
      const columns = [{ name: 'custom', expandRow: true, renderer: () => <span>TOGGLE</span> }];
      const { getByText } = table({ columns });
      expect(getByText('custom')).toBeInTheDocument();
      expect(getByText('TOGGLE')).toBeInTheDocument();
      cleanup();
    });
  });

  it('detailContentComponent is shown/hidden when column is toggled', () => {
    tables.forEach(table => {
      const detailContentComponent = props => <div>{props.row.info}</div>;
      const { getByText, queryByText } = table({}, {}, { detailContentComponent });
      fireEvent.click(getByText('View'));
      expect(getByText('information for a')).toBeInTheDocument();
      fireEvent.click(getByText('Close'));
      expect(queryByText('information for a')).not.toBeInTheDocument();
      cleanup();
    });
  });

  it('propagates the name of the expanded column to detailContentComponent', () => {
    const expectedProps = {
      rowId: 0,
      row: minProps.rows[0],
      expandedColumn: 'info',
    };
    tables.forEach(table => {
      const detailContentComponent = jest.fn(() => <span>open</span>);
      const { getByText } = table({}, {}, { detailContentComponent });

      fireEvent.click(getByText('View'));
      expect(detailContentComponent.mock.calls[0][0]).toEqual(expectedProps);
      cleanup();
    });
  });

  it('only expands the toggled row(s)', () => {
    const rows = [...minProps.rows, { id: 'b', info: 'information for b' }];
    tables.forEach(table => {
      const onExpandedRowsChange = jest.fn();
      const { queryAllByText } = table({ rows }, { onExpandedRowsChange });
      const toggleButtons = queryAllByText('View');
      expect(toggleButtons).toHaveLength(2);
      fireEvent.click(toggleButtons[1]);
      expect(onExpandedRowsChange.mock.calls[0][0]).toEqual({ 1: 'info' });
      fireEvent.click(toggleButtons[0]);
      expect(onExpandedRowsChange.mock.calls[1][0]).toEqual({ 0: 'info', 1: 'info' });
      fireEvent.click(toggleButtons[1]);
      expect(onExpandedRowsChange.mock.calls[2][0]).toEqual({ 0: 'info', 1: '' });
      cleanup();
    });
  });
});
