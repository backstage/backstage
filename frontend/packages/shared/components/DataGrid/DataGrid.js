import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FilteringState,
  GroupingState,
  IntegratedFiltering,
  IntegratedGrouping,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedSorting,
  PagingState,
  SearchState,
  SelectionState,
  SortingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  PagingPanel,
  SearchPanel,
  Table,
  TableColumnResizing,
  TableColumnVisibility,
  TableFilterRow,
  TableGroupRow,
  TableHeaderRow,
  TableSelection,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';
import { AutoSizer } from 'react-virtualized';
import { withRouter } from 'react-router';
import debounce from 'lodash/debounce';

import { getFromStore, saveToStore } from 'shared/apis/storage/persistentStore';
import { Cell, Container, FilterCell, HeaderCell, HeaderCellSortLabel } from './RenderingComponents';
// Custom Plugins for dx-react-grid
import Toolbar from './Plugins/Toolbar';
import TableRowDetail from './Plugins/TableRowDetail';
import RowDetailState from './Plugins/RowDetailState';
import DataGridPopover from 'shared/components/DataGrid/Plugins/DataGridPopover';
import { DataGridContextProvider } from 'shared/components/DataGrid/Plugins/DataGridContext';
import { env } from 'shared/apis/env';

export const DEFAULT_ROW_HEIGHT = 32;
export const DEFAULT_HEADER_HEIGHT = 40;

/**
 * This is an experimental auto height version of DataGrid which is how devexpress recommends this to be solved.
 * @see https://github.com/DevExpress/devextreme-reactive/issues/697
 * @see https://codesandbox.io/s/n6pzmvq94
 */
export const AutoHeightDataGrid = ({ ...restProps }) => {
  delete restProps.height;
  delete restProps.fullHeight;
  delete restProps.style;

  return (
    <AutoSizer disableWidth>
      {autoSizerData => {
        return <DataGridWithRouter {...restProps} autoHeight={autoSizerData.height} />;
      }}
    </AutoSizer>
  );
};

/**
 * This Table is making use of the dx-react-grid
 * from https://devexpress.github.io/devextreme-reactive/react/grid/demos/
 *
 * Properties:
 *  columns: an array of objects determining which columns to render
 *    for reference on what properties these objects can have, see:
 *      - https://devexpress.github.io/devextreme-reactive/react/grid/docs/reference/table/#tablecolumnextension
 *      - https://devexpress.github.io/devextreme-reactive/react/grid/docs/reference/sorting-state/#sortingstatecolumnextension
 *      - https://devexpress.github.io/devextreme-reactive/react/grid/docs/reference/integrated-sorting/#integratedsortingcolumnextension
 *    in addition, you can supply the following:
 *      - renderer: a function to render the content of that column
 *      - expandRow: whether the column should be able to toggle an expandable detail state for the row
 *  columnResizing: enable resizable columns in data grid. Check defaultColumnWidths option to configure initial column width
 *  data: data array of objects
 *  defaultColumnWidths: An array of objects specifying column names and their minimum width.
 *                       Example: [{ columnName: 'id', width: 150 }]
 *                       If specified the array should have width set for all columns in the table. 'auto' as column width doesnt work.
 *                       If unspecified then datagrid sets a min width of 100 for all columns.
 *  defaultCurrentPage: the default page to render if paginated is true
 *  defaultExpandedRows: which rows to expand by default, example: `{<rowId>: <expandedColumn>}`
 *  defaultHiddenColumns: which columns to hide by default (using the columnSelector)
 *  defaultPageSize: the default amount of rows to render per page if paginated is true
 *  defaultSorting: provide the default sorting by specifying column and direction
 *  detailContentComponent: the component to render when expanding a column, gets expandedColumn as a prop for conditional rendering
 *  filtering: whether to provide integrated filtering, default: false
 *  filterLocationId: The search query URL parameter to replace in browser history when filter changes.
 *                    If set, this will update history and use that parameter in initial configuration.
 *                    If not set, no updates to browser history will occur when sorting state is changed,
 *                    and it will not be possible to deep-link filter state.
 *  fixedHeight: whether to use a fixed height table even if pagination is not used
 *  groupColumns: an array of objects determining which column(s) to group by
 *  localStorageId: an ID for localStorage in which to save DataGrid settings (only hiddenColumns for now)
 *  manualVisibility: let the users determine which columns should be visible, default: true
 *  onCurrentPageChange: a function to be called when the user goes to another page
 *  onExpandedRowsChange: a function to be called when the user toggles an expandable row
 *  onPageSizeChange: a function to be called when the user changes the amount of rows per page
 *  onSearchValueChange: a function to be called when the user changes the search filter
 *  onSelectionChange: a function to be called when the user changes their row selections
 *  onRowClick: a function to be called when a user clicks on a row
 *  pageLocationId: The search query URL parameter to replace when pagination is updated.
 *  paginate: whether the table data should be paginated, default: false
 *  selection: pass an array to enable table row selection UI. pass in default selection which is an array of indices in the data.
 *             The corresponding table rows will be enabled by default.
 *  showColumnsWhenGrouped: a boolean value that specifies whether the grid’s table displays a column by which data is grouped
 *  showSelectAll: adds a select all option for table row selection
 *  sorting: enable sorting on columns, default: true
 *  sortLocationId: The search query URL parameter to replace in browser history when sorting changes.
 *                  If set, this will update history and use that parameter in initial configuration.
 *                  If not set, no updates to browser history will occur when sorting state is changed,
 *                  and it will not be possible to deep-link sorting state.
 *  title: display a title above the table in the toolbar
 *  tableHeader: show or hide the table header row (which also contains the sorting controls), default: true

 *  toolbar: show or hide the toolbar with columnSelector, default: true
 *  toolbarItems: a single node or an array of nodes to render in the toolbar
 *
 *  How to enable sorting of your DataGrid:
 *  - if your column has a 'name' property that directly relates to a property
 *  on the row, then Grid will use that as the value of the cell when sorting.
 *  - if the data shown in the cell is nested or does not directly relate to a
 *  property on the row, you may need to declare a `getCellValue` property in
 *  the row so that the Grid can know what value to use when sorting
 *  - to implement a custom sorting algorithm, declare a `compare(a, b)`
 *  function in the row
 */
export class DataGrid extends Component {
  static propTypes = {
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        title: PropTypes.string,
        getCellValue: PropTypes.func,
        renderer: PropTypes.func,
        width: PropTypes.number,
        align: PropTypes.oneOf(['left', 'right', 'center']),
        compare: PropTypes.func,
        sortingEnabled: PropTypes.bool,
        expandRow: PropTypes.bool,
      }),
    ),
    columnResizing: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    defaultColumnWidths: PropTypes.arrayOf(
      PropTypes.shape({
        columnName: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
      }),
    ),
    defaultCurrentPage: PropTypes.number,
    defaultExpandedRows: PropTypes.object,
    defaultHiddenColumns: PropTypes.arrayOf(PropTypes.string),
    defaultPageSize: PropTypes.number,
    defaultSorting: PropTypes.arrayOf(
      PropTypes.shape({
        columnName: PropTypes.string.isRequired,
        direction: PropTypes.string.isRequired,
      }),
    ),
    detailContentComponent: PropTypes.elementType,
    expandedGroups: PropTypes.arrayOf(PropTypes.string),
    filtering: PropTypes.bool,
    filterLocationId: PropTypes.string,
    fixedHeight: PropTypes.bool,
    getRowId: PropTypes.func,
    groupColumns: PropTypes.arrayOf(
      PropTypes.shape({
        columnName: PropTypes.string.isRequired,
      }),
    ),
    localStorageId: PropTypes.string,
    manualVisibility: PropTypes.bool,
    onCurrentPageChange: PropTypes.func,
    onExpandedRowsChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    onSearchValueChange: PropTypes.func,
    onSelectionChange: PropTypes.func,
    onRowClick: PropTypes.func,
    paginate: PropTypes.bool,
    pageLocationId: PropTypes.string,
    selection: PropTypes.array,
    showColumnsWhenGrouped: PropTypes.bool,
    showSelectAll: PropTypes.bool,
    sortLocationId: PropTypes.string,
    title: PropTypes.string,
    toolbar: PropTypes.bool,
    toolbarItems: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  };

  static defaultProps = {
    columns: [],
    data: [],
    defaultCurrentPage: 0,
    defaultHiddenColumns: [],
    defaultPageSize: 25,
    manualVisibility: true,
    pageSizes: [25, 50, 100],
    sorting: true,
    toolbar: true,
    tableHeader: true,
  };

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    if (props.columns !== state.previousColumns) {
      const columns = props.columns ? props.columns.map(column => ({ ...column, columnName: column.name })) : [];
      const hasExpandableContent = Boolean(columns.find(column => column.expandRow));
      Object.assign(newState, { previousColumns: props.columns, columns, hasExpandableContent });
    }
    if (props.rowComponent && props.rowComponent !== state.rowComponent) {
      Object.assign(newState, { rowComponent: props.rowComponent });
    }
    if (Object.keys(newState).length) {
      return newState;
    }
    return null;
  }

  state = {
    hiddenColumns: [],
    gridHeight: undefined,
    rowComponent: ({ row, ...restProps }) => (
      <Table.Row
        {...restProps}
        hover={!!this.props.onRowClick}
        onClick={e => {
          if (this.props.onRowClick) {
            this.props.onRowClick(row, e);
          }
        }}
      />
    ),
  };

  componentDidMount() {
    const {
      defaultCurrentPage,
      defaultHiddenColumns,
      localStorageId,
      sortLocationId,
      filterLocationId,
      pageLocationId,
      location,
    } = this.props;

    const hiddenColumns = localStorageId && getFromStore(localStorageId, 'hiddenColumns', defaultHiddenColumns);

    this.setState({
      hiddenColumns: hiddenColumns || defaultHiddenColumns,
      locationSorting: this.getLocationParams(sortLocationId, location),
      locationFiltering: this.getLocationParams(filterLocationId, location),
      paginationPage: this.getLocationParams(pageLocationId, location) || defaultCurrentPage,
    });
  }

  getLocationParams(id, location) {
    if (!id) {
      return null;
    }
    try {
      return (location.search || '?')
        .slice(1)
        .split('&')
        .filter(params => params.split('=')[0] === id)
        .map(params => JSON.parse(decodeURIComponent(params.split('=')[1])))[0];
    } catch (e) {
      console.error('Error decoding sorting param', e);
      return null;
    }
  }

  updateHistory = (newState, locationId, history, location) => {
    if (!locationId) {
      return;
    }
    const newStateObject = encodeURIComponent(JSON.stringify(newState));
    const newSearch = (location.search || '?')
      .slice(1)
      .split('&')
      .filter(param => param.split('=')[0] !== locationId)
      .concat([`${locationId}=${newStateObject}`])
      .join('&');
    history.replace({
      ...location,
      search: `?${newSearch}`,
    });
  };

  toggleHiddenColumn = name => {
    const hiddenColumns = [...this.state.hiddenColumns];
    if (hiddenColumns.includes(name)) {
      hiddenColumns.splice(hiddenColumns.indexOf(name), 1);
    } else {
      hiddenColumns.push(name);
    }
    this.setState({ hiddenColumns });
    if (this.props.localStorageId) {
      saveToStore(this.props.localStorageId, 'hiddenColumns', hiddenColumns);
    }
  };

  render() {
    const { data } = this.props;
    const { columns, hasExpandableContent, hiddenColumns, rowComponent, paginationPage } = this.state;

    const {
      autoHeight,
      classes,
      defaultExpandedRows,
      defaultHiddenColumns,
      defaultPageSize,
      defaultSearchValue,
      defaultSorting,
      detailContentComponent,
      expandedGroups,
      filtering,
      filterLocationId,
      fixedHeight,
      fullHeight, // deprecated
      groupColumns,
      history,
      height, // deprecated
      location,
      manualVisibility,
      onCurrentPageChange,
      onExpandedRowsChange,
      onPageSizeChange,
      onSearchValueChange,
      pageSizes,
      pageLocationId,
      searching,
      showColumnsWhenGrouped,
      sorting,
      tableHeader,
      title,
      toolbar,
      toolbarItems,
      selection,
      onSelectionChange,
      showSelectAll,
      sortLocationId,
      getRowId,
      style,
      columnResizing,
    } = this.props;
    let { defaultColumnWidths = [] } = this.props;
    const sortingProps = this.state.locationSorting
      ? {
          sorting: this.state.locationSorting,
        }
      : {};
    const filteringProps = this.state.locationFiltering
      ? {
          filters: this.state.locationFiltering,
        }
      : {};
    let { paginate } = this.props;
    // When paginate is false DataGrid uses VirtualTable and renders only 2 columns.
    // Setting paginate to true for tests here as a workaround.
    paginate = paginate || env.isTest;

    const rowSelection = typeof selection !== 'undefined';

    const heightStyle = fullHeight ? '100%' : '';
    if (height || fullHeight || style) {
      console.warn(
        'DataGrid: The component is using one or more of deprecated properties height, fullHeight, style)',
        this.props,
      );
    }

    const historyListener = (locationId, onUpdate) => {
      return value => {
        if (locationId) {
          this.updateHistory(value, locationId, history, location);
        }
        if (onUpdate) {
          onUpdate(value);
        }
      };
    };

    if (columnResizing && !defaultColumnWidths.length) {
      defaultColumnWidths = columns.map(col => {
        return {
          columnName: col.name,
          width: col.width || 100,
        };
      });
    }

    return (
      <DataGridContextProvider>
        <Grid
          rows={data}
          columns={columns}
          style={{ height: heightStyle, ...style }}
          getRowId={getRowId}
          classes={classes}
        >
          {searching && <SearchState defaultValue={defaultSearchValue} onValueChange={onSearchValueChange} />}
          {sorting && (
            <SortingState
              defaultSorting={sortingProps.sorting ? sortingProps.sorting : defaultSorting}
              columnExtensions={columns}
              onSortingChange={historyListener(sortLocationId)}
            />
          )}
          {paginate && (
            <PagingState
              defaultCurrentPage={paginationPage}
              defaultPageSize={defaultPageSize}
              onCurrentPageChange={historyListener(pageLocationId, onCurrentPageChange)}
              onPageSizeChange={onPageSizeChange}
            />
          )}
          {rowSelection && <SelectionState selection={selection} onSelectionChange={onSelectionChange} />}
          {rowSelection && showSelectAll && <IntegratedSelection />}
          {sorting && <IntegratedSorting columnExtensions={columns} />}
          {filtering && (
            <FilteringState
              defaultFilters={filteringProps.filters}
              columnExtensions={columns}
              onFiltersChange={debounce(historyListener(filterLocationId), 200)}
            />
          )}
          {(filtering || searching) && <IntegratedFiltering />}
          {groupColumns && <GroupingState grouping={groupColumns} defaultExpandedGroups={expandedGroups || []} />}
          {groupColumns && <IntegratedGrouping />}
          <RowDetailState defaultExpandedRows={defaultExpandedRows} onExpandedRowsChange={onExpandedRowsChange} />
          {paginate && <IntegratedPaging />}
          {(paginate || fixedHeight) && (
            <Table columnExtensions={columns} cellComponent={Cell} rowComponent={rowComponent} />
          )}
          {!(paginate || fixedHeight) && (
            <VirtualTable
              height={autoHeight}
              columnExtensions={columns}
              cellComponent={Cell}
              rowComponent={rowComponent}
              containerComponent={Container}
            />
          )}
          {columnResizing && <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />}
          {hasExpandableContent && <TableRowDetail detailContentComponent={detailContentComponent} />}
          {tableHeader && (
            <TableHeaderRow
              showSortingControls={sorting}
              cellComponent={HeaderCell}
              sortLabelComponent={HeaderCellSortLabel}
            />
          )}
          {rowSelection && (showSelectAll ? <TableSelection showSelectAll /> : <TableSelection />)}
          {groupColumns && <TableGroupRow showColumnsWhenGrouped={showColumnsWhenGrouped} />}
          {filtering && <TableFilterRow cellComponent={FilterCell} />}
          <TableColumnVisibility defaultHiddenColumnNames={defaultHiddenColumns} hiddenColumnNames={hiddenColumns} />
          {toolbar && (
            <Toolbar
              columns={columns}
              hidden={hiddenColumns}
              manualVisibility={manualVisibility}
              title={title}
              toggleHiddenColumn={this.toggleHiddenColumn}
            >
              {toolbarItems}
            </Toolbar>
          )}
          {toolbar && searching && <SearchPanel />}
          {paginate && <PagingPanel pageSizes={pageSizes} />}
          <DataGridPopover />
        </Grid>
      </DataGridContextProvider>
    );
  }
}

const DataGridWithRouter = withRouter(DataGrid);
export default DataGridWithRouter;
