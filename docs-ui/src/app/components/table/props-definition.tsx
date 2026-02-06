import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

// =============================================================================
// PropsTable Column Configuration (Table docs use description instead of responsive)
// =============================================================================

// For return values (no default column)
export const tableReturnColumns = [
  { key: 'prop' as const, width: '15%' },
  { key: 'type' as const, width: '25%' },
  { key: 'description' as const, width: '60%' },
];

// =============================================================================
// useTable Hook
// =============================================================================

export const useTableOptionsPropDefs: Record<string, PropDef> = {
  mode: {
    type: 'enum',
    values: ['complete', 'offset', 'cursor'],
    description: (
      <>
        Data fetching strategy (required). Use <Chip>complete</Chip> for
        client-side data, <Chip>offset</Chip> for offset/limit APIs,{' '}
        <Chip>cursor</Chip> for cursor-based pagination.
      </>
    ),
  },
  getData: {
    type: 'enum',
    values: ['function'],
    description:
      'Function that returns or fetches data (required for "offset" and "cursor" modes). For the "complete" mode, either this or `data` must be provided. Signature varies by mode.',
  },
  data: {
    type: 'enum',
    values: ['T[]'],
    description:
      'The data for the table. Only applicable for "complete" mode, and either this or `getData` must be provided.',
  },
  paginationOptions: {
    type: 'enum',
    values: ['object'],
    description: (
      <>
        Pagination configuration including <Chip>pageSize</Chip>,{' '}
        <Chip>pageSizeOptions</Chip>, and <Chip>initialOffset</Chip>.
      </>
    ),
  },
  // Uncontrolled state
  initialSort: {
    type: 'enum',
    values: ['SortDescriptor'],
    description: 'Default sort configuration on first render (uncontrolled).',
  },
  initialSearch: {
    type: 'string',
    description: 'Default search value on first render (uncontrolled).',
  },
  initialFilter: {
    type: 'enum',
    values: ['TFilter'],
    description: 'Default filter value on first render (uncontrolled).',
  },
  // Controlled state
  sort: {
    type: 'enum',
    values: ['SortDescriptor'],
    description: 'Current sort state (controlled).',
  },
  onSortChange: {
    type: 'enum',
    values: ['(sort: SortDescriptor) => void'],
    description: 'Sort change handler (controlled).',
  },
  search: {
    type: 'string',
    description: 'Current search value (controlled).',
  },
  onSearchChange: {
    type: 'enum',
    values: ['(search: string) => void'],
    description: 'Search change handler (controlled).',
  },
  filter: {
    type: 'enum',
    values: ['TFilter'],
    description: 'Current filter value (controlled).',
  },
  onFilterChange: {
    type: 'enum',
    values: ['(filter: TFilter) => void'],
    description: 'Filter change handler (controlled).',
  },
  // Client-side functions
  sortFn: {
    type: 'enum',
    values: ['(data, sort) => data'],
    description: (
      <>
        Client-side sort function. Only used with <Chip>complete</Chip> mode.
      </>
    ),
  },
  searchFn: {
    type: 'enum',
    values: ['(data, query) => data'],
    description: (
      <>
        Client-side search function. Only used with <Chip>complete</Chip> mode.
      </>
    ),
  },
  filterFn: {
    type: 'enum',
    values: ['(data, filter) => data'],
    description: (
      <>
        Client-side filter function. Only used with <Chip>complete</Chip> mode.
      </>
    ),
  },
};

export const useTableReturnPropDefs: Record<string, PropDef> = {
  tableProps: {
    type: 'enum',
    values: ['object'],
    description: (
      <>
        Props to spread onto the <Chip>Table</Chip> component. Includes data,
        loading, error, pagination, and sort state.
      </>
    ),
  },
  reload: {
    type: 'enum',
    values: ['() => void'],
    description: 'Function to trigger a data refetch.',
  },
  search: {
    type: 'enum',
    values: ['{ value, onChange }'],
    description: (
      <>
        Search state object for binding to a <Chip>SearchField</Chip> component.
      </>
    ),
  },
  filter: {
    type: 'enum',
    values: ['{ value, onChange }'],
    description: 'Filter state object for binding to filter controls.',
  },
};

// =============================================================================
// Table Component
// =============================================================================

export const tablePropDefs: Record<string, PropDef> = {
  columnConfig: {
    type: 'enum',
    values: ['ColumnConfig[]'],
    description:
      'Array of column configurations defining how each column renders.',
  },
  data: {
    type: 'enum',
    values: ['T[]'],
    description: 'Array of data items to display in the table.',
  },
  loading: {
    type: 'boolean',
    default: 'false',
    description: 'Whether the table is in a loading state.',
  },
  isStale: {
    type: 'boolean',
    default: 'false',
    description:
      'Whether the displayed data is stale while new data is loading.',
  },
  error: {
    type: 'enum',
    values: ['Error'],
    description: 'Error object if data fetching failed.',
  },
  pagination: {
    type: 'enum',
    values: ['TablePaginationType'],
    description: (
      <>
        Pagination configuration (required). Use{' '}
        <Chip>{'{ type: "none" }'}</Chip> to disable or{' '}
        <Chip>{'{ type: "page", ...props }'}</Chip> for pagination.
      </>
    ),
  },
  sort: {
    type: 'enum',
    values: ['SortState'],
    description: 'Sort state including current descriptor and change handler.',
  },
  rowConfig: {
    type: 'enum',
    values: ['RowConfig | RowRenderFn'],
    description: (
      <>
        Row configuration object with <Chip>getHref</Chip>, <Chip>onClick</Chip>
        , <Chip>getIsDisabled</Chip>, or a render function for custom rows.
      </>
    ),
  },
  selection: {
    type: 'enum',
    values: ['TableSelection'],
    description:
      'Selection configuration including mode, behavior, selected keys, and change handler.',
  },
  emptyState: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Content to display when the table has no data.',
  },
  columnSizing: {
    type: 'enum',
    values: ['content', 'manual'],
    default: 'content',
    description:
      'Set to "manual" (or define any of the width properties on a column) to manually control column widths.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

// =============================================================================
// ColumnConfig
// =============================================================================

export const columnConfigPropDefs: Record<string, PropDef> = {
  id: {
    type: 'string',
    description: 'Unique identifier for the column.',
  },
  label: {
    type: 'string',
    description: 'Display label for the column header.',
  },
  cell: {
    type: 'enum',
    values: ['(item) => ReactNode'],
    description: 'Render function for cell content.',
  },
  header: {
    type: 'enum',
    values: ['() => ReactNode'],
    description: 'Optional custom render function for the header cell.',
  },
  isSortable: {
    type: 'boolean',
    default: 'false',
    description: 'Whether the column supports sorting.',
  },
  isHidden: {
    type: 'boolean',
    default: 'false',
    description: 'Whether the column is hidden.',
  },
  isRowHeader: {
    type: 'boolean',
    default: 'false',
    description: 'Whether this column is the row header for accessibility.',
  },
  width: {
    type: 'enum',
    values: ['ColumnSize'],
    description: 'Current width of the column.',
  },
  defaultWidth: {
    type: 'enum',
    values: ['ColumnSize'],
    description: (
      <>
        Default width of the column (e.g., <Chip>1fr</Chip>, <Chip>200px</Chip>
        ).
      </>
    ),
  },
  minWidth: {
    type: 'enum',
    values: ['ColumnStaticSize'],
    description: 'Minimum width of the column.',
  },
  maxWidth: {
    type: 'enum',
    values: ['ColumnStaticSize'],
    description: 'Maximum width of the column.',
  },
};

// =============================================================================
// CellText
// Note: Extends React Aria Cell props
// =============================================================================

export const cellTextPropDefs: Record<string, PropDef> = {
  title: {
    type: 'string',
    description: 'Primary text content of the cell.',
  },
  description: {
    type: 'string',
    description: 'Secondary description text displayed below the title.',
  },
  color: {
    type: 'enum',
    values: ['TextColors'],
    description: 'Text color variant.',
  },
  leadingIcon: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Icon displayed before the text content.',
  },
  href: {
    type: 'string',
    description: 'URL to navigate to when the cell is clicked.',
  },
};

// =============================================================================
// CellProfile
// Note: Extends React Aria Cell props
// =============================================================================

export const cellProfilePropDefs: Record<string, PropDef> = {
  name: {
    type: 'string',
    description: 'Name to display.',
  },
  src: {
    type: 'string',
    description: 'URL of the avatar image.',
  },
  description: {
    type: 'string',
    description: 'Secondary text displayed below the name.',
  },
  href: {
    type: 'string',
    description: 'URL to navigate to when clicked.',
  },
  color: {
    type: 'enum',
    values: ['TextColors'],
    description: 'Text color variant.',
  },
};

// =============================================================================
// TablePagination
// =============================================================================

export const tablePaginationPropDefs: Record<string, PropDef> = {
  pageSize: {
    type: 'number',
    description: 'Number of items per page.',
  },
  pageSizeOptions: {
    type: 'enum',
    values: ['number[]'],
    description: 'Available page size options for the dropdown.',
  },
  offset: {
    type: 'number',
    description: 'Current offset (starting index) in the data.',
  },
  totalCount: {
    type: 'number',
    description: 'Total number of items across all pages.',
  },
  hasNextPage: {
    type: 'boolean',
    description: 'Whether there is a next page available.',
  },
  hasPreviousPage: {
    type: 'boolean',
    description: 'Whether there is a previous page available.',
  },
  onNextPage: {
    type: 'enum',
    values: ['() => void'],
    description: 'Handler called when navigating to the next page.',
  },
  onPreviousPage: {
    type: 'enum',
    values: ['() => void'],
    description: 'Handler called when navigating to the previous page.',
  },
  onPageSizeChange: {
    type: 'enum',
    values: ['(size: number) => void'],
    description: 'Handler called when the page size changes.',
  },
  showPageSizeOptions: {
    type: 'boolean',
    default: 'true',
    description: 'Whether to show the page size dropdown.',
  },
  getLabel: {
    type: 'enum',
    values: ['(props) => string'],
    description: 'Custom function to generate the pagination label text.',
  },
};

// =============================================================================
// Primitives
// =============================================================================

export const tableRootPropDefs: Record<string, PropDef> = {
  stale: {
    type: 'boolean',
    default: 'false',
    description: (
      <>
        Whether the table data is stale (e.g., while fetching new data). Adds{' '}
        <Chip>aria-busy</Chip> attribute.
      </>
    ),
  },
};

export const columnPropDefs: Record<string, PropDef> = {
  isRowHeader: {
    type: 'boolean',
    description: 'Whether this column is a row header for accessibility.',
  },
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Column header content.',
  },
};

export const rowPropDefs: Record<string, PropDef> = {
  id: {
    type: 'enum',
    values: ['string | number'],
    description: 'Unique identifier for the row.',
  },
  children: {
    type: 'enum',
    values: ['ReactNode | ((column) => ReactNode)'],
    description:
      'Row content. Can be a render function receiving column config.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
