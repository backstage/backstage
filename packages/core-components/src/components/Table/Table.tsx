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

/**
 * Full-featured data table built on @tanstack/react-table v8.
 * Replaces the legacy @material-table/core implementation while preserving
 * the identical public API surface (TableColumn, TableProps, TableOptions,
 * TableFilter, TableState, Table.icons).
 */

import {
  TranslationFunction,
  useTranslationRef,
} from '@backstage/core-plugin-api/alpha';
import {
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
} from '@tanstack/react-table';
import {
  PlusSquare,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2,
  Pencil,
  Download,
  ListFilter,
  Search,
  ChevronsLeft,
  ChevronsRight,
  Minus,
  Columns3,
} from 'lucide-react';
import { isEqual, transform } from 'lodash';
import {
  type ComponentType,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { cn } from '../../lib/utils';
import { coreComponentsTranslationRef } from '../../translation';
import { SelectProps } from '../Select/Select';
import { Filter, Filters, SelectedFilters, Without } from './Filters';
import { TableLoadingBody } from './TableLoadingBody';

/* ---------------------------------------------------------------------------
 * Lucide icon map — preserves the legacy Table.icons contract
 * -------------------------------------------------------------------------- */

const tableIcons: Readonly<Record<string, ComponentType>> = Object.freeze({
  Add: PlusSquare,
  Check,
  Clear: X,
  Delete: Trash2,
  DetailPanel: ChevronRight,
  Edit: Pencil,
  Export: Download,
  Filter: ListFilter,
  FirstPage: ChevronsLeft,
  LastPage: ChevronsRight,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: X,
  Search,
  SortArrow: ArrowUp,
  ThirdStateCheck: Minus,
  ViewColumn: Columns3,
});

/* ---------------------------------------------------------------------------
 * Utility — deep-extract a dotted field path from a data row
 * -------------------------------------------------------------------------- */

function extractValueByField(data: any, field: string): any | undefined {
  const path = field.split('.');
  let value = data[path[0]];
  for (let i = 1; i < path.length; ++i) {
    if (value === undefined) {
      return value;
    }
    value = value[path[i]];
  }
  return value;
}

/* ---------------------------------------------------------------------------
 * Public types — backward-compatible with the legacy @material-table API
 * -------------------------------------------------------------------------- */

/** Class key for the table header overrides. */
export type TableHeaderClassKey = 'header';

/** Class key for the table toolbar overrides. */
export type TableToolbarClassKey = 'root' | 'title' | 'searchField';

/** @public */
export type FiltersContainerClassKey = 'root' | 'title';

/** Class key for the table root container. */
export type TableClassKey = 'root';

/**
 * Column definition providing a backward-compatible interface that mirrors the
 * legacy @material-table Column API while being powered by @tanstack/react-table
 * internally. Consumers supply `title`, `field`, `cellStyle`, `headerStyle`, and
 * the Table component converts these to @tanstack/react-table ColumnDef entries.
 *
 * @public
 */
export interface TableColumn<T extends object = {}> {
  /** Unique column identifier (optional — defaults to field or index). */
  id?: string;
  /** Column header display text — supports string or JSX. */
  title?: string | ReactNode;
  /** Dot-notation field path into the row data. */
  field?: string | keyof T;
  /** Whether to visually highlight this column (bold cells, colored header). */
  highlight?: boolean;
  /** Explicit column width (CSS value). */
  width?: string;
  /** Static or dynamic CSS for table cells. */
  cellStyle?:
    | CSSProperties
    | ((data: any, rowData: T, column?: TableColumn<T>) => CSSProperties);
  /** Static CSS for the column header cell. */
  headerStyle?: CSSProperties;
  /** Custom cell render function. */
  render?: (rowData: T) => ReactNode;
  /** Lookup map for enum-style filtering (legacy compat). */
  lookup?: Record<string, string>;
  /** Default sort direction (legacy compat). */
  defaultSort?: 'asc' | 'desc';
  /** Whether this column is hidden (legacy compat). */
  hidden?: boolean;
  /** Legacy column type (e.g. 'numeric', 'boolean', 'datetime'). */
  type?: string;
  /** Custom filter-and-search function (legacy compat). */
  customFilterAndSearch?: (query: string, rowData: T, columnDef: TableColumn<T>) => boolean;
  /** Custom sort comparison (legacy compat). */
  customSort?: (data1: T, data2: T, type: 'row' | 'group') => number;
  /** Whether this column is searchable (legacy compat). */
  searchable?: boolean;
  /** Column text alignment (legacy compat). */
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
  /** Whether sorting is enabled for this column (legacy compat). */
  sorting?: boolean;
  /** Allow additional legacy column properties to pass through. */
  [key: string]: any;
}

/** Filter configuration for the table sidebar. */
export type TableFilter = {
  column: string;
  type: 'select' | 'multiple-select';
};

/** Serialisable table state for persistence / URL sync. */
export type TableState = {
  search?: string;
  filtersOpen?: boolean;
  filters?: SelectedFilters;
};

/**
 * Table configuration options — backward-compatible subset of legacy options.
 * The generic parameter T is preserved for API compatibility with consumers
 * that pass `TableOptions<SomeType>`.
 *
 * @public
 */
export type TableOptions<_T extends object = {}> = {
  /** Number of rows per page (default 20). */
  pageSize?: number;
  /** Enable column sorting. */
  sorting?: boolean;
  /** Enable pagination. */
  paging?: boolean;
  /** Enable the search field in the toolbar. */
  search?: boolean;
  /** Legacy action column index. */
  actionsColumnIndex?: number;
  /** Row padding density. */
  padding?: 'default' | 'dense';
  /** Legacy toolbar visibility (preserved for backward compat). */
  toolbar?: boolean;
} & Record<string, unknown>;

/**
 * Props for the Table component.
 *
 * @public
 */
/**
 * Shape of a resolved action entry. Callers may also provide a function
 * `(rowData: T) => TableActionEntry<T>` to compute the action per row —
 * the Table component resolves it at render time.
 *
 * @public
 */
export interface TableActionEntry<T extends object = {}> {
  icon: ComponentType;
  tooltip?: string;
  onClick: (event: any, data: T | T[]) => void;
  isFreeAction?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  cellStyle?: CSSProperties;
  [key: string]: any;
}

export interface TableProps<T extends object = {}> {
  columns: TableColumn<T>[];
  data: T[] | (() => Promise<T[]>);
  emptyContent?: ReactNode;
  filters?: TableFilter[];
  initialState?: TableState;
  isLoading?: boolean;
  onStateChange?: (state: TableState) => any;
  options?: TableOptions<T>;
  subtitle?: string;
  title?: string | ReactElement;
  /** Row-level action buttons — static objects or per-row functions. */
  actions?: Array<
    TableActionEntry<T> | ((rowData: T) => TableActionEntry<T>)
  >;
  /** Callback when a row is clicked. */
  onRowClick?: (event: MouseEvent<HTMLElement>, row?: T) => void;
  /** Additional CSS class applied to the root container. */
  className?: string;
  /** Inline style applied to the table element. */
  style?: CSSProperties;
  /** Localisation overrides (legacy compat). */
  localization?: Record<string, any>;
  /** Component overrides (supports Row). */
  components?: {
    Row?: ComponentType<any>;
    [key: string]: ComponentType<any> | undefined;
  };
  /** External page index for server-side pagination. */
  page?: number;
  /** Callback when the page changes (server-side pagination). */
  onPageChange?: (page: number) => void;
  /** Callback when page size changes. */
  onRowsPerPageChange?: (pageSize: number) => void;
  /** External total row count for server-side pagination. */
  totalCount?: number;
}

/* ---------------------------------------------------------------------------
 * Internal defaults
 * -------------------------------------------------------------------------- */

const defaultInitialState: Required<TableState> = {
  search: '',
  filtersOpen: false,
  filters: {},
};

function removeDefaultValues(state: any, defaultState: any): any {
  return transform(state, (result, value, key) => {
    if (!isEqual(value, defaultState[key])) {
      result[key] = value;
    }
  });
}

/* ---------------------------------------------------------------------------
 * Column conversion: maps our backward-compat columns to @tanstack/react-table
 * -------------------------------------------------------------------------- */

function toTanstackColumns<T extends object>(
  columns: TableColumn<T>[],
): ColumnDef<T, unknown>[] {
  return columns
    .filter(c => !c.hidden)
    .map((col, idx) => {
      const colId = col.id ?? String(col.field ?? idx);
      const columnDef: ColumnDef<T, unknown> = {
        id: colId,
        accessorFn: col.field
          ? (row: T) => extractValueByField(row, String(col.field))
          : undefined,
        header: () => col.title ?? '',
        cell: col.render
          ? (info: any) => col.render!(info.row.original)
          : (info: any) => {
              const value = info.getValue();
              return value === null || value === undefined ? '' : String(value);
            },
        enableSorting: true,
      };
      return columnDef;
    });
}

/**
 * Apply highlight and headerStyle transformations to produce final
 * headerStyle and cellStyle per column — mirrors legacy convertColumns().
 */
function resolveColumnStyles<T extends object>(
  column: TableColumn<T>,
): { headerStyle: CSSProperties; cellStyleFn: (data: any, rowData: T) => CSSProperties } {
  const headerStyle: CSSProperties = { ...(column.headerStyle ?? {}) };
  let baseCellStyle = column.cellStyle;

  if (column.highlight) {
    /* Apply a visible color to the header for highlighted columns.
       Uses the CSS custom property --primary which is always defined. */
    headerStyle.color = headerStyle.color ?? 'var(--primary)';

    if (typeof baseCellStyle === 'function') {
      const origFn = baseCellStyle as (data: any, rowData: T, col?: TableColumn<T>) => CSSProperties;
      baseCellStyle = (data: any, rowData: T, col?: TableColumn<T>) => ({
        ...origFn(data, rowData, col),
        fontWeight: 700,
      });
    } else {
      baseCellStyle = { ...(baseCellStyle as CSSProperties ?? {}), fontWeight: 700 };
    }
  }

  const cellStyleFn =
    typeof baseCellStyle === 'function'
      ? (data: any, rowData: T) => (baseCellStyle as Function)(data, rowData, column)
      : (_data: any, _rowData: T) => (baseCellStyle as CSSProperties) ?? {};

  return { headerStyle, cellStyleFn };
}

/* ---------------------------------------------------------------------------
 * TableToolbar — search field + filter toggle
 * -------------------------------------------------------------------------- */

export function TableToolbar(toolbarProps: {
  toolbarRef?: React.MutableRefObject<any>;
  setSearch: (value: string) => void;
  onSearchChanged?: (value: string) => void;
  toggleFilters: () => void;
  hasFilters: boolean;
  selectedFiltersLength: number;
  searchText?: string;
  showSearch?: boolean;
  title?: string | ReactElement;
  subtitle?: string;
}) {
  const {
    hasFilters,
    selectedFiltersLength,
    toggleFilters,
    searchText,
    showSearch = true,
    title,
    subtitle,
    setSearch,
  } = toolbarProps;
  const { t } = useTranslationRef(coreComponentsTranslationRef);
  const [localSearch, setLocalSearch] = useState(searchText ?? '');

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      setSearch(value);
      toolbarProps.onSearchChanged?.(value);
    },
    [setSearch, toolbarProps],
  );

  return (
    <div className="flex items-center justify-between px-2.5 py-3 flex-wrap gap-2">
      <div className="flex items-center gap-2">
        {hasFilters && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleFilters}
              aria-label="filter list"
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ListFilter className="h-5 w-5" />
            </button>
            <span className="font-bold text-lg whitespace-nowrap">
              {t('table.filter.title')} ({selectedFiltersLength})
            </span>
          </div>
        )}
        {(title || subtitle) && (
          <div>
            {title && (
              <h2 className="text-xl font-bold leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted-foreground text-sm">{subtitle}</p>
            )}
          </div>
        )}
      </div>
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={localSearch}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder={t('table.toolbar.search')}
            className="h-9 w-60 rounded-md border border-input bg-transparent pl-8 pr-8 text-sm outline-none focus:ring-1 focus:ring-ring"
            aria-label={t('table.toolbar.search')}
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Pagination controls
 * -------------------------------------------------------------------------- */

function TablePagination<T>({
  table,
  t,
  onPageChange,
}: {
  table: ReturnType<typeof useReactTable<T>>;
  t: TranslationFunction<typeof coreComponentsTranslationRef.T>;
  onPageChange?: (page: number) => void;
}) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageSize = table.getState().pagination.pageSize;
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalRows);

  const goToPage = (page: number) => {
    table.setPageIndex(page);
    onPageChange?.(page);
  };

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-2 text-sm text-muted-foreground">
      <span>
        {totalRows > 0
          ? `${start}-${end} of ${totalRows}`
          : t('table.body.emptyDataSourceMessage')}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => goToPage(0)}
          disabled={!table.getCanPreviousPage()}
          aria-label={t('table.pagination.firstTooltip')}
          className="inline-flex items-center justify-center rounded-md p-1 disabled:opacity-50"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            table.previousPage();
            onPageChange?.(pageIndex - 1);
          }}
          disabled={!table.getCanPreviousPage()}
          aria-label={t('table.pagination.previousTooltip')}
          className="inline-flex items-center justify-center rounded-md p-1 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            table.nextPage();
            onPageChange?.(pageIndex + 1);
          }}
          disabled={!table.getCanNextPage()}
          aria-label={t('table.pagination.nextTooltip')}
          className="inline-flex items-center justify-center rounded-md p-1 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => goToPage(pageCount - 1)}
          disabled={!table.getCanNextPage()}
          aria-label={t('table.pagination.lastTooltip')}
          className="inline-flex items-center justify-center rounded-md p-1 disabled:opacity-50"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Table component — main export
 * -------------------------------------------------------------------------- */

/**
 * @public
 */
export function Table<T extends object = {}>(props: TableProps<T>) {
  const {
    data: dataProp,
    columns,
    emptyContent,
    options,
    title,
    subtitle,
    filters,
    initialState,
    onStateChange,
    components: customComponents,
    isLoading: loading,
    style,
    actions,
    onRowClick,
    className,
    page: externalPage,
    onPageChange,
    onRowsPerPageChange: _onRowsPerPageChange,
    totalCount: _totalCount,
  } = props;

  const { t } = useTranslationRef(coreComponentsTranslationRef);

  /* -- Merge initial state ------------------------------------------------ */
  const calculatedInitialState = { ...defaultInitialState, ...initialState };

  /* -- Filter panel state ------------------------------------------------- */
  const [filtersOpen, setFiltersOpen] = useState(calculatedInitialState.filtersOpen);
  const toggleFilters = useCallback(() => setFiltersOpen(v => !v), []);

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(
    calculatedInitialState.filters ?? {},
  );

  /* -- Search state ------------------------------------------------------- */
  const [search, setSearch] = useState(calculatedInitialState.search ?? '');

  /* -- Sorting state ------------------------------------------------------ */
  const [sorting, setSorting] = useState<SortingState>(() => {
    const defaultSorted = columns.find(c => c.defaultSort);
    if (defaultSorted) {
      return [
        {
          id: String(defaultSorted.field ?? ''),
          desc: defaultSorted.defaultSort === 'desc',
        },
      ];
    }
    return [];
  });

  /* -- Async data resolution ---------------------------------------------- */
  const [resolvedData, setResolvedData] = useState<T[]>([]);
  const [asyncLoading, setAsyncLoading] = useState(false);

  useEffect(() => {
    if (typeof dataProp === 'function') {
      setAsyncLoading(true);
      (dataProp as () => Promise<T[]>)()
        .then(result => {
          setResolvedData(result);
          setAsyncLoading(false);
        })
        .catch(() => setAsyncLoading(false));
    }
  }, [dataProp]);

  const arrayData = useMemo<T[]>(
    () => (typeof dataProp === 'function' ? resolvedData : dataProp),
    [dataProp, resolvedData],
  );

  /* -- Apply sidebar filter selections ------------------------------------ */
  const filteredData = useMemo(() => {
    if (!selectedFilters) return arrayData;
    const entries = Object.entries(selectedFilters).filter(
      ([, value]) => !!(value as { length?: number }).length,
    );
    if (!entries.length) return arrayData;

    return arrayData.filter(row =>
      entries.every(([key, filterValue]) => {
        const col = columns.find(c => c.title === key);
        if (!col?.field) return true;
        const fieldValue = extractValueByField(row, String(col.field));

        if (Array.isArray(fieldValue) && Array.isArray(filterValue)) {
          return fieldValue.some(v => (filterValue as string[]).includes(v));
        } else if (Array.isArray(fieldValue)) {
          return fieldValue.includes(filterValue);
        } else if (Array.isArray(filterValue)) {
          return (filterValue as string[]).includes(fieldValue);
        }
        return fieldValue === filterValue;
      }),
    );
  }, [arrayData, selectedFilters, columns]);

  /* -- Broadcast state changes -------------------------------------------- */
  useEffect(() => {
    if (onStateChange) {
      const state = removeDefaultValues(
        { search, filtersOpen, filters: selectedFilters },
        defaultInitialState,
      );
      onStateChange(state);
    }
  }, [search, filtersOpen, selectedFilters, onStateChange]);

  /* -- Convert columns to @tanstack/react-table format -------------------- */
  const tanstackColumns = useMemo(() => toTanstackColumns(columns), [columns]);

  /* -- Pre-compute per-column style resolvers ----------------------------- */
  const columnStyles = useMemo(
    () => columns.map(col => resolveColumnStyles(col)),
    [columns],
  );

  /* -- TanStack Table instance -------------------------------------------- */
  const pageSize = options?.pageSize ?? 20;
  const enablePaging = options?.paging !== false;
  const enableSorting = options?.sorting !== false;
  const enableSearch = options?.search !== false;

  /* -- External (server-side) pagination mode ----------------------------- */
  const isExternalPagination = externalPage !== undefined;
  const externalPageCount =
    _totalCount !== undefined && pageSize > 0
      ? Math.ceil(_totalCount / pageSize)
      : undefined;

  const [pagination, setPagination] = useState({
    pageIndex: externalPage ?? 0,
    pageSize,
  });

  useEffect(() => {
    if (externalPage !== undefined) {
      setPagination(prev => ({ ...prev, pageIndex: externalPage }));
    }
  }, [externalPage]);

  const table = useReactTable<T>({
    data: filteredData,
    columns: tanstackColumns,
    state: {
      sorting,
      globalFilter: search,
      ...(isExternalPagination ? { pagination } : {}),
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting ? { getSortedRowModel: getSortedRowModel() } : {}),
    ...(enableSearch ? { getFilteredRowModel: getFilteredRowModel() } : {}),
    ...((() => {
      if (isExternalPagination) {
        return {
          manualPagination: true,
          pageCount: externalPageCount ?? -1,
          onPaginationChange: setPagination,
        };
      }
      if (enablePaging) {
        return {
          getPaginationRowModel: getPaginationRowModel(),
          initialState: { pagination: { pageSize } },
        };
      }
      return {};
    })()),
  });

  /* -- Derived values ----------------------------------------------------- */
  const selectedFiltersLength = Object.values(selectedFilters).flat().length;
  const hasFilters = !!filters?.length;
  const isLoading = loading || asyncLoading;
  const hasNoRows = filteredData.length === 0;
  const columnCount = columns.filter(c => !c.hidden).length + (actions?.length ? 1 : 0);
  const isDense = options?.padding === 'dense';
  const cellPadding = isDense ? 'px-2 py-1' : 'px-2.5 py-2';

  /* -- Custom Row component ----------------------------------------------- */
  const CustomRow = customComponents?.Row;

  return (
    <div className={cn('flex items-start', className)}>
      {/* Sidebar filter panel */}
      {filtersOpen && arrayData && filters?.length && (
        <Filters
          filters={constructFilters(filters, arrayData, columns, t)}
          selectedFilters={selectedFilters}
          onChangeFilters={setSelectedFilters}
        />
      )}

      {/* Main table area */}
      <div className="flex-1 min-w-0 overflow-hidden rounded-md border border-border bg-card">
        {/* Toolbar */}
        <TableToolbar
          setSearch={setSearch}
          hasFilters={hasFilters}
          selectedFiltersLength={selectedFiltersLength}
          toggleFilters={toggleFilters}
          searchText={search}
          showSearch={enableSearch}
          title={title}
          subtitle={subtitle}
        />

        {/* Table element */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm" style={style}>
            {/* -- Header -------------------------------------------------- */}
            <thead>
              <tr>
                {table.getHeaderGroups()[0]?.headers.map((header, colIdx) => {
                  const colStyle = columnStyles[colIdx]
                    ? columnStyles[colIdx].headerStyle
                    : {};
                  const col = columns[colIdx];
                  const widthStyle = col?.width ? { width: col.width } : {};

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        'border-y border-border px-2.5 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground',
                        enableSorting && header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : '',
                      )}
                      style={{ ...widthStyle, ...colStyle }}
                      onClick={
                        enableSorting
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <span className="inline-flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' && (
                          <ArrowUp className="h-3.5 w-3.5" />
                        )}
                        {header.column.getIsSorted() === 'desc' && (
                          <ArrowUp className="h-3.5 w-3.5 rotate-180" />
                        )}
                      </span>
                    </th>
                  );
                })}
                {actions?.length ? (
                  <th className="border-y border-border px-2.5 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('table.header.actions')}
                  </th>
                ) : null}
              </tr>
            </thead>

            {/* -- Body ---------------------------------------------------- */}
            {isLoading && (
              <TableLoadingBody colSpan={columnCount} />
            )}
            {!isLoading && emptyContent && hasNoRows && (
              <tbody>
                <tr>
                  <td colSpan={columnCount}>{emptyContent}</td>
                </tr>
              </tbody>
            )}
            {!isLoading && !emptyContent && hasNoRows && (
              <tbody>
                <tr>
                  <td
                    colSpan={columnCount}
                    className="py-10 text-center text-muted-foreground"
                  >
                    {t('table.body.emptyDataSourceMessage')}
                  </td>
                </tr>
              </tbody>
            )}
            {!isLoading && !hasNoRows && (
              <tbody>
                {table.getRowModel().rows.map(row => {
                  if (CustomRow) {
                    return (
                      <CustomRow
                        key={row.id}
                        data={row.original}
                        columns={columns}
                      />
                    );
                  }

                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        'border-b border-border transition-colors hover:bg-muted/40',
                        onRowClick && 'cursor-pointer',
                      )}
                      onClick={
                        onRowClick
                          ? (e: MouseEvent<HTMLTableRowElement>) =>
                              onRowClick(e, row.original)
                          : undefined
                      }
                    >
                      {row.getVisibleCells().map((cell, colIdx) => {
                        const col = columns[colIdx];
                        const { cellStyleFn } = columnStyles[colIdx] ?? {
                          cellStyleFn: () => ({}),
                        };
                        const value = cell.getValue();
                        const computedStyle = cellStyleFn(value, row.original);
                        const widthStyle = col?.width ? { width: col.width } : {};

                        return (
                          <td
                            key={cell.id}
                            className={cn(cellPadding)}
                            style={{ ...widthStyle, ...computedStyle }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      })}
                      {actions?.length ? (
                        <td className={cn(cellPadding, 'whitespace-nowrap')}>
                          <div className="flex items-center gap-1">
                            {actions
                              .map(a =>
                                typeof a === 'function'
                                  ? a(row.original)
                                  : a,
                              )
                              .filter(a => !a.isFreeAction && !a.hidden)
                              .map((action, actionIdx) => {
                                const ActionIcon = action.icon;
                                return (
                                  <button
                                    key={actionIdx}
                                    type="button"
                                    title={action.tooltip}
                                    disabled={action.disabled}
                                    style={action.cellStyle}
                                    className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
                                    onClick={e => {
                                      e.stopPropagation();
                                      action.onClick(e, row.original);
                                    }}
                                  >
                                    <ActionIcon />
                                  </button>
                                );
                              })}
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>

        {/* Pagination */}
        {enablePaging && !isLoading && !hasNoRows && (
          <TablePagination table={table as any} t={t} onPageChange={onPageChange} />
        )}
      </div>
    </div>
  );
}

/** Static icon map — preserves the legacy `Table.icons` public API. */
Table.icons = tableIcons;

/* ---------------------------------------------------------------------------
 * Filter construction — same logic as the legacy implementation
 * -------------------------------------------------------------------------- */

function constructFilters<T extends object>(
  filterConfig: TableFilter[],
  dataValue: T[],
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

    return distinctValues;
  };

  const constructSelect = (
    filter: TableFilter,
  ): Without<SelectProps, 'onChange'> => ({
    placeholder: t('table.filter.placeholder'),
    label: filter.column,
    multiple: filter.type === 'multiple-select',
    items: [...extractDistinctValues(filter.column)].sort().map(value => ({
      label: value,
      value,
    })),
  });

  return filterConfig.map(filter => ({
    type: filter.type,
    element: constructSelect(filter),
  }));
}
