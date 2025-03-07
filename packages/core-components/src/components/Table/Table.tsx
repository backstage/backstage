/*
 * Copyright 2020 The Backstage Authors
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

import {
  TranslationFunction,
  useTranslationRef,
} from '@backstage/core-plugin-api/alpha';
import MTable, {
  Column,
  Icons,
  MaterialTableProps,
  MTableBody,
  MTableHeader,
  MTableToolbar,
  Options,
} from '@material-table/core';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import {
  makeStyles,
  Theme,
  useTheme,
  withStyles,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import Search from '@material-ui/icons/Search';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { isEqual, transform } from 'lodash';
import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { coreComponentsTranslationRef } from '../../translation';
import { SelectProps } from '../Select/Select';
import { Filter, Filters, SelectedFilters, Without } from './Filters';
import { TableLoadingBody } from './TableLoadingBody';

// Material-table is not using the standard icons available in in material-ui. https://github.com/mbrn/material-table/issues/51
const tableIcons: Icons = {
  Add: forwardRef<SVGSVGElement>((props, ref) => (
    <AddBox {...props} ref={ref} />
  )),
  Check: forwardRef<SVGSVGElement>((props, ref) => (
    <Check {...props} ref={ref} />
  )),
  Clear: forwardRef<SVGSVGElement>((props, ref) => (
    <Clear {...props} ref={ref} />
  )),
  Delete: forwardRef<SVGSVGElement>((props, ref) => (
    <DeleteOutline {...props} ref={ref} />
  )),
  DetailPanel: forwardRef<SVGSVGElement>((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef<SVGSVGElement>((props, ref) => (
    <Edit {...props} ref={ref} />
  )),
  Export: forwardRef<SVGSVGElement>((props, ref) => (
    <SaveAlt {...props} ref={ref} />
  )),
  Filter: forwardRef<SVGSVGElement>((props, ref) => (
    <FilterList {...props} ref={ref} />
  )),
  FirstPage: forwardRef<SVGSVGElement>((props, ref) => (
    <FirstPage {...props} ref={ref} />
  )),
  LastPage: forwardRef<SVGSVGElement>((props, ref) => (
    <LastPage {...props} ref={ref} />
  )),
  NextPage: forwardRef<SVGSVGElement>((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  PreviousPage: forwardRef<SVGSVGElement>((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef<SVGSVGElement>((props, ref) => (
    <Clear {...props} ref={ref} />
  )),
  Search: forwardRef<SVGSVGElement>((props, ref) => (
    <Search {...props} ref={ref} />
  )),
  SortArrow: forwardRef<SVGSVGElement>((props, ref) => (
    <ArrowUpward {...props} ref={ref} />
  )),
  ThirdStateCheck: forwardRef<SVGSVGElement>((props, ref) => (
    <Remove {...props} ref={ref} />
  )),
  ViewColumn: forwardRef<SVGSVGElement>((props, ref) => (
    <ViewColumn {...props} ref={ref} />
  )),
};

// TODO: Material table might already have such a function internally that we can use?
function extractValueByField(data: any, field: string): any | undefined {
  const path = field.split('.');
  let value = data[path[0]];

  for (let i = 1; i < path.length; ++i) {
    if (value === undefined) {
      return value;
    }

    const f = path[i];
    value = value[f];
  }

  return value;
}

export type TableHeaderClassKey = 'header';

const StyledMTableHeader = withStyles(
  theme => ({
    header: {
      padding: theme.spacing(1, 2, 1, 2.5),
      borderTop: `1px solid ${theme.palette.grey.A100}`,
      borderBottom: `1px solid ${theme.palette.grey.A100}`,
      // withStyles hasn't a generic overload for theme
      fontWeight: theme.typography.fontWeightBold,
      position: 'static',
      wordBreak: 'normal',
      textTransform: 'uppercase',
    },
  }),
  { name: 'BackstageTableHeader' },
)(MTableHeader);

export type TableToolbarClassKey = 'root' | 'title' | 'searchField';

const StyledMTableToolbar = withStyles(
  theme => ({
    root: {
      padding: theme.spacing(3, 0, 2.5, 2.5),
    },
    title: {
      '& > h6': {
        fontWeight: theme.typography.fontWeightBold,
      },
    },
    searchField: {
      paddingRight: theme.spacing(2),
    },
  }),
  { name: 'BackstageTableToolbar' },
)(MTableToolbar);

/** @public */
export type FiltersContainerClassKey = 'root' | 'title';

const useFilterStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: 18,
      whiteSpace: 'nowrap',
    },
  }),
  { name: 'BackstageTableFiltersContainer' },
);

export type TableClassKey = 'root';

const useTableStyles = makeStyles(
  () => ({
    root: {
      display: 'flex',
      alignItems: 'start',
    },
  }),
  { name: 'BackstageTable' },
);

function convertColumns<T extends object>(
  columns: TableColumn<T>[],
  theme: Theme,
): TableColumn<T>[] {
  return columns.map(column => {
    const headerStyle: React.CSSProperties = column.headerStyle ?? {};

    let cellStyle = column.cellStyle || {};

    if (column.highlight) {
      headerStyle.color = theme.palette.textContrast;

      if (typeof cellStyle === 'object') {
        (cellStyle as React.CSSProperties).fontWeight =
          theme.typography.fontWeightBold;
      } else {
        const cellStyleFn = cellStyle as (
          data: any,
          rowData: T,
          column?: Column<T>,
        ) => React.CSSProperties;
        cellStyle = (data, rowData, rowColumn) => {
          const style = cellStyleFn(data, rowData, rowColumn);
          return { ...style, fontWeight: theme.typography.fontWeightBold };
        };
      }
    }

    return {
      ...column,
      headerStyle,
      cellStyle,
    };
  });
}

function removeDefaultValues(state: any, defaultState: any): any {
  return transform(state, (result, value, key) => {
    if (!isEqual(value, defaultState[key])) {
      result[key] = value;
    }
  });
}

const defaultInitialState = {
  search: '',
  filtersOpen: false,
  filters: {},
};

export interface TableColumn<T extends object = {}> extends Column<T> {
  highlight?: boolean;
  width?: string;
}

export type TableFilter = {
  column: string;
  type: 'select' | 'multiple-select';
};

export type TableState = {
  search?: string;
  filtersOpen?: boolean;
  filters?: SelectedFilters;
};

export interface TableProps<T extends object = {}>
  extends MaterialTableProps<T> {
  columns: TableColumn<T>[];
  subtitle?: string;
  filters?: TableFilter[];
  initialState?: TableState;
  emptyContent?: ReactNode;
  isLoading?: boolean;
  onStateChange?: (state: TableState) => any;
}

export interface TableOptions<T extends object = {}> extends Options<T> {}

export function TableToolbar(toolbarProps: {
  toolbarRef: MutableRefObject<any>;
  setSearch: (value: string) => void;
  onSearchChanged: (value: string) => void;
  toggleFilters: () => void;
  hasFilters: boolean;
  selectedFiltersLength: number;
}) {
  const {
    toolbarRef,
    setSearch,
    hasFilters,
    selectedFiltersLength,
    toggleFilters,
  } = toolbarProps;
  const { t } = useTranslationRef(coreComponentsTranslationRef);
  const filtersClasses = useFilterStyles();
  const onSearchChanged = useCallback(
    (searchText: string) => {
      toolbarProps.onSearchChanged(searchText);
      setSearch(searchText);
    },
    [toolbarProps, setSearch],
  );

  if (hasFilters) {
    return (
      <Box className={filtersClasses.root}>
        <Box className={filtersClasses.root}>
          <IconButton onClick={toggleFilters} aria-label="filter list">
            <FilterList />
          </IconButton>
          <Typography className={filtersClasses.title}>
            {t('table.filter.title')} ({selectedFiltersLength})
          </Typography>
        </Box>
        <StyledMTableToolbar
          {...toolbarProps}
          ref={toolbarRef}
          onSearchChanged={onSearchChanged}
        />
      </Box>
    );
  }

  return (
    <StyledMTableToolbar
      {...toolbarProps}
      ref={toolbarRef}
      onSearchChanged={onSearchChanged}
    />
  );
}

/**
 * @public
 */
export function Table<T extends object = {}>(props: TableProps<T>) {
  const {
    data,
    columns,
    emptyContent,
    options,
    title,
    subtitle,
    localization,
    filters,
    initialState,
    onStateChange,
    components,
    isLoading: loading,
    style,
    ...restProps
  } = props;
  const { t } = useTranslationRef(coreComponentsTranslationRef);
  const tableClasses = useTableStyles();

  const theme = useTheme();

  const calculatedInitialState = { ...defaultInitialState, ...initialState };

  const [filtersOpen, setFiltersOpen] = useState(
    calculatedInitialState.filtersOpen,
  );
  const toggleFilters = useCallback(
    () => setFiltersOpen(v => !v),
    [setFiltersOpen],
  );

  const [selectedFilters, setSelectedFilters] = useState(
    calculatedInitialState.filters,
  );

  const [search, setSearch] = useState(calculatedInitialState.search);

  useEffect(() => {
    if (onStateChange) {
      const state = removeDefaultValues(
        {
          search,
          filtersOpen,
          filters: selectedFilters,
        },
        defaultInitialState,
      );

      onStateChange(state);
    }
  }, [search, filtersOpen, selectedFilters, onStateChange]);

  const getFieldByTitle = useCallback(
    (titleValue: string | keyof T) =>
      columns.find(el => el.title === titleValue)?.field,
    [columns],
  );

  const tableData = useMemo(() => {
    if (typeof data === 'function' || !selectedFilters) {
      return data;
    }

    const selectedFiltersArray = Object.values(selectedFilters);
    if (data && selectedFiltersArray.flat().length) {
      const newData = (data as any[]).filter(
        el =>
          !!Object.entries(selectedFilters)
            .filter(([, value]) => !!(value as { length?: number }).length)
            .every(([key, filterValue]) => {
              const fieldValue = extractValueByField(
                el,
                getFieldByTitle(key) as string,
              );

              if (Array.isArray(fieldValue) && Array.isArray(filterValue)) {
                return fieldValue.some(v => filterValue.includes(v));
              } else if (Array.isArray(fieldValue)) {
                return fieldValue.includes(filterValue);
              } else if (Array.isArray(filterValue)) {
                return filterValue.includes(fieldValue);
              }

              return fieldValue === filterValue;
            }),
      );
      return newData;
    }
    return data;
  }, [data, selectedFilters, getFieldByTitle]);

  const selectedFiltersLength = Object.values(selectedFilters).flat().length;

  const hasFilters = !!filters?.length;
  const Toolbar = useCallback(
    (toolbarProps: any /* no type for this in material-table */) => {
      return (
        <TableToolbar
          setSearch={setSearch}
          hasFilters={hasFilters}
          selectedFiltersLength={selectedFiltersLength}
          toggleFilters={toggleFilters}
          {...toolbarProps}
        />
      );
    },
    [toggleFilters, hasFilters, selectedFiltersLength, setSearch],
  );

  const hasNoRows = typeof data !== 'function' && data.length === 0;
  const columnCount = columns.length;
  const Body = useMemo(
    () => makeBody({ hasNoRows, emptyContent, columnCount, loading }),
    [hasNoRows, emptyContent, columnCount, loading],
  );

  return (
    <Box className={tableClasses.root}>
      {filtersOpen && data && typeof data !== 'function' && filters?.length && (
        <Filters
          filters={constructFilters(filters, data as any[], columns, t)}
          selectedFilters={selectedFilters}
          onChangeFilters={setSelectedFilters}
        />
      )}
      <MTable<T>
        components={{
          Header: StyledMTableHeader,
          Body,
          Toolbar,
          ...components,
        }}
        options={options}
        columns={convertColumns(columns, theme)}
        icons={tableIcons}
        title={
          <>
            <Typography variant="h5" component="h2">
              {title}
            </Typography>
            {subtitle && (
              <Typography color="textSecondary" variant="body1">
                {subtitle}
              </Typography>
            )}
          </>
        }
        data={tableData}
        style={{ width: '100%', ...style }}
        localization={{
          ...localization,
          body: {
            emptyDataSourceMessage: t('table.body.emptyDataSourceMessage'),
            ...localization?.body,
          },
          pagination: {
            firstTooltip: t('table.pagination.firstTooltip'),
            labelDisplayedRows: t('table.pagination.labelDisplayedRows'),
            labelRowsSelect: t('table.pagination.labelRowsSelect'),
            lastTooltip: t('table.pagination.lastTooltip'),
            nextTooltip: t('table.pagination.nextTooltip'),
            previousTooltip: t('table.pagination.previousTooltip'),
            ...localization?.pagination,
          },
          toolbar: {
            searchPlaceholder: t('table.toolbar.search'),
            searchTooltip: t('table.toolbar.search'),
            ...localization?.toolbar,
          },
        }}
        {...restProps}
      />
    </Box>
  );
}

Table.icons = Object.freeze(tableIcons);

function makeBody({
  columnCount,
  emptyContent,
  hasNoRows,
  loading,
}: {
  hasNoRows: boolean;
  emptyContent: ReactNode;
  columnCount: number;
  loading?: boolean;
}) {
  return (bodyProps: any /* no type for this in material-table */) => {
    if (loading) {
      return <TableLoadingBody colSpan={columnCount} />;
    }

    if (emptyContent && hasNoRows) {
      return (
        <tbody>
          <tr>
            <td colSpan={columnCount}>{emptyContent}</td>
          </tr>
        </tbody>
      );
    }

    return <MTableBody {...bodyProps} />;
  };
}

function constructFilters<T extends object>(
  filterConfig: TableFilter[],
  dataValue: any[] | undefined,
  columns: TableColumn<T>[],
  t: TranslationFunction<typeof coreComponentsTranslationRef.T>,
): Filter[] {
  const extractDistinctValues = (field: string | keyof T): Set<any> => {
    const distinctValues = new Set<any>();
    const addValue = (value: any) => {
      if (value !== undefined && value !== null) {
        distinctValues.add(value);
      }
    };

    if (dataValue) {
      dataValue.forEach(el => {
        const value = extractValueByField(
          el,
          columns.find(c => c.title === field)?.field as string,
        );

        if (Array.isArray(value)) {
          (value as []).forEach(addValue);
        } else {
          addValue(value);
        }
      });
    }

    return distinctValues;
  };

  const constructSelect = (
    filter: TableFilter,
  ): Without<SelectProps, 'onChange'> => {
    return {
      placeholder: t('table.filter.placeholder'),
      label: filter.column,
      multiple: filter.type === 'multiple-select',
      items: [...extractDistinctValues(filter.column)].sort().map(value => ({
        label: value,
        value,
      })),
    };
  };

  return filterConfig.map(filter => ({
    type: filter.type,
    element: constructSelect(filter),
  }));
}
