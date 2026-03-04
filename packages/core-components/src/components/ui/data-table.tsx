/*
 * Copyright 2025 The Backstage Authors
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

import { useState, useMemo, type KeyboardEvent } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type Row,
  type Column,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Settings2,
  Search,
} from 'lucide-react';

import { cn } from '../../lib/utils';
import {
  ShadcnTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './table';
import { Button } from './button';
import { Input } from './input';
import { Skeleton } from './skeleton';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from './dropdown-menu';

// ---------------------------------------------------------------------------
// Re-export key @tanstack/react-table types for consumer convenience.
// Consumers can import these directly from this module rather than
// depending on @tanstack/react-table themselves.
// ---------------------------------------------------------------------------
export type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  Row,
};

// ---------------------------------------------------------------------------
// DataTableProps — Public interface for the DataTable component
// ---------------------------------------------------------------------------

/**
 * Properties for the {@link DataTable} component.
 *
 * @typeParam TData - The row data type that determines the shape of each row
 * @typeParam TValue - The value type for column definitions (defaults to `unknown`)
 *
 * @remarks
 * This interface replaces the `MaterialTableProps` / `TableProps` interface
 * previously used with `@material-table/core`. All features — sorting,
 * filtering, pagination, row selection, and column visibility — are driven
 * by `@tanstack/react-table` v8 headless state.
 *
 * @public
 */
export interface DataTableProps<TData, TValue = unknown> {
  /** TanStack column definitions describing headers, accessors, and cell renderers. */
  columns: ColumnDef<TData, TValue>[];

  /** Array of row data objects to display in the table. */
  data: TData[];

  /**
   * When `true`, skeleton placeholder rows replace data rows to indicate
   * a loading state. Defaults to `false`.
   */
  isLoading?: boolean;

  /**
   * Message displayed when the table contains no rows and is not loading.
   * Defaults to `"No results."`.
   */
  emptyStateMessage?: string;

  /**
   * Placeholder text for the global search input field.
   * Defaults to `"Search..."`.
   */
  searchPlaceholder?: string;

  /** Show a global search input in the toolbar. Defaults to `false`. */
  enableSearch?: boolean;

  /** Show pagination controls below the table. Defaults to `true`. */
  enablePagination?: boolean;

  /** Allow columns to be sorted by clicking headers. Defaults to `true`. */
  enableSorting?: boolean;

  /**
   * Show a column-visibility toggle button in the toolbar, allowing users
   * to show/hide individual columns. Defaults to `false`.
   */
  enableColumnVisibility?: boolean;

  /** Allow rows to be selected via checkboxes. Defaults to `false`. */
  enableRowSelection?: boolean;

  /**
   * Number of rows displayed per page. Applies only when `enablePagination`
   * is `true`. Defaults to `20`.
   */
  pageSize?: number;

  /** Additional CSS class names applied to the root wrapper element. */
  className?: string;

  /**
   * Callback invoked when a data row is clicked. Receives the
   * `@tanstack/react-table` `Row` instance for the clicked row.
   */
  onRowClick?: (row: Row<TData>) => void;
}

// ---------------------------------------------------------------------------
// DataTable — Main component
// ---------------------------------------------------------------------------

/**
 * A full-featured, accessible data table built on `@tanstack/react-table` v8
 * and styled with shadcn/ui Tailwind primitives. Replaces `@material-table/core`
 * throughout the Backstage developer portal for catalog tables, entity lists,
 * scaffolder task grids, and TechDocs document tables.
 *
 * @remarks
 * Features:
 * - **Sorting** — click column headers to toggle ascending / descending / none
 * - **Global search** — free-text filter across all columns via the toolbar input
 * - **Pagination** — first / prev / next / last page controls with row count
 * - **Row selection** — opt-in row checkboxes with selected-row count display
 * - **Column visibility** — opt-in toggle dropdown to show / hide columns
 * - **Loading state** — skeleton placeholder rows while data is being fetched
 * - **Empty state** — configurable message when no rows match filters
 * - **Row click** — optional callback for row navigation
 *
 * The component is generic over `TData` and `TValue`, preserving full
 * type-safety for column definitions and row accessors.
 *
 * @typeParam TData - The row data type
 * @typeParam TValue - The column value type
 *
 * @example
 * ```tsx
 * import { DataTable, type ColumnDef } from './ui/data-table';
 *
 * interface Entity { name: string; kind: string; owner: string }
 *
 * const columns: ColumnDef<Entity>[] = [
 *   { accessorKey: 'name', header: 'Name' },
 *   { accessorKey: 'kind', header: 'Kind' },
 *   { accessorKey: 'owner', header: 'Owner' },
 * ];
 *
 * <DataTable columns={columns} data={entities} enableSearch enablePagination />
 * ```
 *
 * @public
 */
export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  isLoading = false,
  emptyStateMessage = 'No results.',
  searchPlaceholder = 'Search...',
  enableSearch = false,
  enablePagination = true,
  enableSorting = true,
  enableColumnVisibility = false,
  enableRowSelection = false,
  pageSize = 20,
  className,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  // ----- Internal state managed by @tanstack/react-table -----
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  // Memoize skeleton rows to avoid re-creating the array on every render
  const skeletonRows = useMemo(
    () => Array.from({ length: pageSize > 0 ? Math.min(pageSize, 10) : 5 }),
    [pageSize],
  );

  // ----- Table instance -----
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection,
    enableSorting,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    initialState: {
      pagination: {
        pageSize,
        pageIndex: 0,
      },
    },
  });

  // ----- Helper: sort direction icon -----
  function renderSortIcon(sorted: false | 'asc' | 'desc') {
    if (sorted === 'desc') {
      return <ArrowDown className="h-4 w-4" aria-hidden="true" />;
    }
    if (sorted === 'asc') {
      return <ArrowUp className="h-4 w-4" aria-hidden="true" />;
    }
    return (
      <ArrowUpDown
        className="h-4 w-4 text-muted-foreground"
        aria-hidden="true"
      />
    );
  }

  // ----- Helper: table body content (loading / rows / empty) -----
  function renderTableBody() {
    if (isLoading) {
      return skeletonRows.map((_unused, rowIdx) => (
        <TableRow key={`skeleton-${rowIdx}`}>
          {columns.map((_col, colIdx) => (
            <TableCell key={`skeleton-${rowIdx}-${colIdx}`}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    const rows = table.getRowModel().rows;

    if (!rows?.length) {
      return (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            className="h-24 text-center text-muted-foreground"
          >
            {emptyStateMessage}
          </TableCell>
        </TableRow>
      );
    }

    return rows.map(row => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() ? 'selected' : undefined}
        className={cn(onRowClick && 'cursor-pointer')}
        onClick={() => onRowClick?.(row)}
        onKeyDown={
          onRowClick
            ? (e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onRowClick(row);
                }
              }
            : undefined
        }
        tabIndex={onRowClick ? 0 : undefined}
      >
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  }

  // ---------- Render ----------

  return (
    <div data-slot="data-table-root" className={cn('w-full', className)}>
      {/* ----- Toolbar: search + column visibility ----- */}
      {(enableSearch || enableColumnVisibility) && (
        <div
          className="flex items-center gap-2 py-4"
          data-slot="data-table-toolbar"
        >
          {enableSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={e => setGlobalFilter(e.target.value)}
                className="pl-8"
                aria-label={searchPlaceholder}
              />
            </div>
          )}

          {/* Spacer pushes column-visibility to the right when search is off */}
          {!enableSearch && <div className="flex-1" />}

          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto gap-1">
                  <Settings2 className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Columns
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[10rem]">
                {table
                  .getAllColumns()
                  .filter(col => col.getCanHide())
                  .map(col => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      checked={col.getIsVisible()}
                      onCheckedChange={value => col.toggleVisibility(!!value)}
                      className="capitalize"
                    >
                      {col.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {/* ----- Table ----- */}
      <div className="rounded-md border border-border" data-slot="data-table">
        <ShadcnTable>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          header.column.getCanSort() &&
                            'cursor-pointer select-none flex items-center gap-1',
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        role={header.column.getCanSort() ? 'button' : undefined}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                        onKeyDown={
                          header.column.getCanSort()
                            ? (e: KeyboardEvent) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  header.column.toggleSorting();
                                }
                              }
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {/* Inline sort indicator */}
                        {header.column.getCanSort() &&
                          renderSortIcon(header.column.getIsSorted())}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>{renderTableBody()}</TableBody>
        </ShadcnTable>
      </div>

      {/* ----- Pagination footer ----- */}
      {enablePagination && (
        <div
          className="flex items-center justify-between gap-2 py-4"
          data-slot="data-table-pagination"
        >
          <div className="text-sm text-muted-foreground">
            {enableRowSelection &&
              `${table.getFilteredSelectedRowModel().rows.length} of `}
            {table.getFilteredRowModel().rows.length} row(s)
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to first page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm tabular-nums">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Go to next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="Go to last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SortIndicator — Shared icon renderer for sort direction
// ---------------------------------------------------------------------------

/** Renders the appropriate sort direction icon. @internal */
function SortIndicator({ direction }: { direction: false | 'asc' | 'desc' }) {
  if (direction === 'desc') {
    return <ArrowDown className="h-4 w-4" aria-hidden="true" />;
  }
  if (direction === 'asc') {
    return <ArrowUp className="h-4 w-4" aria-hidden="true" />;
  }
  return (
    <ArrowUpDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
  );
}

// ---------------------------------------------------------------------------
// DataTableColumnHeader — Reusable sortable column header helper
// ---------------------------------------------------------------------------

/**
 * A reusable column header component that renders sort indicator icons
 * based on the current sort state of the column.
 *
 * @remarks
 * Designed to be used within `@tanstack/react-table` column definitions
 * as the `header` property. Shows:
 * - `ArrowUp` when sorted ascending
 * - `ArrowDown` when sorted descending
 * - `ArrowUpDown` when unsorted (indicating the column is sortable)
 *
 * Clicking the header toggles the sort direction. If the column is not
 * sortable, only the title text is rendered.
 *
 * @typeParam TData - The row data type
 * @typeParam TValue - The column value type
 *
 * @remarks
 * This component already renders sort indicator icons (ArrowUp / ArrowDown /
 * ArrowUpDown) based on the column's current sort state. Consumers should
 * **not** add their own inline sort icons in the column definition when using
 * this header, as doing so would produce duplicate sort indicators.
 *
 * @example
 * ```tsx
 * const columns: ColumnDef<Entity>[] = [
 *   {
 *     accessorKey: 'name',
 *     header: ({ column }) => (
 *       <DataTableColumnHeader column={column} title="Name" />
 *     ),
 *   },
 * ];
 * ```
 *
 * @public
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1 cursor-pointer select-none',
        className,
      )}
      onClick={column.getToggleSortingHandler()}
      role="button"
      tabIndex={0}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          column.toggleSorting();
        }
      }}
    >
      <span>{title}</span>
      <SortIndicator direction={column.getIsSorted()} />
    </div>
  );
}
