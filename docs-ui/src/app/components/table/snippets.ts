// =============================================================================
// Usage
// =============================================================================

export const tableUsageSnippet = `import { Table, useTable, CellText, type ColumnConfig } from '@backstage/ui';

const columns: ColumnConfig<DataType>[] = [
  { id: 'name', label: 'Name', isRowHeader: true, cell: item => <CellText title={item.name} /> },
  { id: 'owner', label: 'Owner', cell: item => <CellText title={item.owner} /> },
];

function MyTable() {
  const { tableProps } = useTable({
    mode: 'complete',
    data,
  });

  return <Table columnConfig={columns} {...tableProps} />;
}`;

// =============================================================================
// Hero / Quick Start
// =============================================================================

export const tableHeroSnippet = `import { Table, CellText, useTable, type ColumnConfig } from '@backstage/ui';

const data = [
  { id: 1, name: 'Service A', owner: 'Team Alpha', type: 'service' },
  { id: 2, name: 'Service B', owner: 'Team Beta', type: 'website' },
  { id: 3, name: 'Library C', owner: 'Team Gamma', type: 'library' },
];

const columns: ColumnConfig<typeof data[0]>[] = [
  { id: 'name', label: 'Name', isRowHeader: true, cell: item => <CellText title={item.name} /> },
  { id: 'owner', label: 'Owner', cell: item => <CellText title={item.owner} /> },
  { id: 'type', label: 'Type', cell: item => <CellText title={item.type} /> },
];

function MyTable() {
  const { tableProps } = useTable({
    mode: 'complete',
    data,
  });

  return <Table columnConfig={columns} {...tableProps} />;
}`;

// =============================================================================
// Core Concepts
// =============================================================================

export const tableConceptsSnippet = `// What useTable returns
const {
  tableProps,  // Spread onto <Table />
  reload,      // Trigger data refetch
  search,      // { value, onChange } for search input
  filter,      // { value, onChange } for filters
} = useTable({ ... });`;

// =============================================================================
// Common Patterns
// =============================================================================

export const tableSortingSnippet = `const columns: ColumnConfig<Item>[] = [
  { id: 'name', label: 'Name', isSortable: true, cell: item => <CellText title={item.name} /> },
  { id: 'owner', label: 'Owner', isSortable: true, cell: item => <CellText title={item.owner} /> },
  { id: 'type', label: 'Type', cell: item => <CellText title={item.type} /> },
];

const { tableProps } = useTable({
  mode: 'complete',
  data,
  initialSort: { column: 'name', direction: 'ascending' },
  sortFn: (items, { column, direction }) => {
    return [...items].sort((a, b) => {
      const aVal = String(a[column]);
      const bVal = String(b[column]);
      const cmp = aVal.localeCompare(bVal);
      return direction === 'descending' ? -cmp : cmp;
    });
  },
});

return <Table columnConfig={columns} {...tableProps} />;`;

export const tablePaginationSnippet = `const { tableProps } = useTable({
  mode: 'complete',
  data,
  paginationOptions: {
    pageSize: 10,
    pageSizeOptions: [10, 25, 50],
  },
});`;

export const tableSearchSnippet = `const { tableProps, search } = useTable({
  mode: 'complete',
  data,
  searchFn: (items, query) => {
    const lowerQuery = query.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.owner.toLowerCase().includes(lowerQuery)
    );
  },
});

return (
  <>
    <SearchField
      aria-label="Search"
      placeholder="Search..."
      {...search}
    />
    <Table columnConfig={columns} {...tableProps} />
  </>
);`;

export const tableSelectionSnippet = `const [selected, setSelected] = useState<Set<string | number> | 'all'>(new Set());

const { tableProps } = useTable({
  mode: 'complete',
  data,
});

return (
  <Table
    columnConfig={columns}
    selection={{
      mode: 'multiple',
      behavior: 'toggle',
      selected,
      onSelectionChange: setSelected,
    }}
    {...tableProps}
  />
);`;

export const tableRowActionsHrefSnippet = `<Table
  columnConfig={columns}
  rowConfig={{
    getHref: item => \`/catalog/\${item.namespace}/\${item.name}\`
  }}
  {...tableProps}
/>`;

export const tableRowActionsClickSnippet = `<Table
  columnConfig={columns}
  rowConfig={{
    onClick: item => openDetailPanel(item)
  }}
  {...tableProps}
/>`;

export const tableRowActionsDisabledSnippet = `<Table
  columnConfig={columns}
  rowConfig={{
    onClick: item => openDetailPanel(item),
    getIsDisabled: item => item.status === 'archived',
  }}
  {...tableProps}
/>`;

export const tableEmptyStateSnippet = `const { tableProps, search } = useTable({
  mode: 'complete',
  data,
  searchFn: (items, query) => { /* ... */ },
});

return (
  <Table
    columnConfig={columns}
    emptyState={
      search.value
        ? <Text>No results match "{search.value}"</Text>
        : <Text>No items yet. Create one to get started.</Text>
    }
    {...tableProps}
  />
);`;

// =============================================================================
// Server-Side Data
// =============================================================================

export const tableOffsetPaginationSnippet = `const { tableProps } = useTable({
  mode: 'offset',
  getData: async ({ offset, pageSize, sort, search, filter, signal }) => {
    const response = await fetch(
      \`/api/items?offset=\${offset}&limit=\${pageSize}&q=\${search}\`,
      { signal }
    );
    const { items, totalCount } = await response.json();

    return {
      data: items,
      totalCount,
    };
  },
  paginationOptions: {
    pageSize: 20,
    pageSizeOptions: [20, 50, 100],
  },
});`;

export const tableCursorPaginationSnippet = `const { tableProps } = useTable({
  mode: 'cursor',
  getData: async ({ cursor, pageSize, sort, search, signal }) => {
    const response = await fetch(
      \`/api/items?cursor=\${cursor ?? ''}&limit=\${pageSize}&q=\${search}\`,
      { signal }
    );
    const { items, nextCursor, prevCursor, totalCount } = await response.json();

    return {
      data: items,
      nextCursor,
      prevCursor,
      totalCount, // optional - enables "X of Y" display
    };
  },
  paginationOptions: {
    pageSize: 20,
    pageSizeOptions: [20, 50, 100],
  },
});`;

// =============================================================================
// Combining Features
// =============================================================================

export const tableCombinedSnippet = `interface TypeFilter {
  type: string | null;
}

const columns: ColumnConfig<Item>[] = [
  { id: 'name', label: 'Name', isRowHeader: true, isSortable: true,
    cell: item => <CellText title={item.name} description={item.description} /> },
  { id: 'owner', label: 'Owner', isSortable: true,
    cell: item => <CellText title={item.owner} /> },
  { id: 'type', label: 'Type', isSortable: true,
    cell: item => <CellText title={item.type} /> },
];

function ItemsTable() {
  const [selected, setSelected] = useState<Set<string | number> | 'all'>(new Set());

  const { tableProps, search, filter } = useTable<Item, TypeFilter>({
    mode: 'offset',
    initialSort: { column: 'name', direction: 'ascending' },
    getData: async ({ offset, pageSize, sort, search, filter, signal }) => {
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(pageSize),
        q: search,
        ...(sort && { sortBy: sort.column, sortDir: sort.direction }),
        ...(filter?.type && { type: filter.type }),
      });

      const response = await fetch(\`/api/items?\${params}\`, { signal });
      const { items, totalCount } = await response.json();

      return { data: items, totalCount };
    },
  });

  return (
    <Flex direction="column" gap="4">
      <Flex gap="4" align="end">
        <SearchField
          aria-label="Search"
          label="Search"
          placeholder="Search by name or description..."
          value={search.value}
          onChange={search.onChange}
        />
        <Select
          label="Type"
          options={typeOptions}
          value={filter.value?.type ?? ''}
          onChange={value => filter.onChange({ type: value || null })}
        />
      </Flex>
      <Table
        columnConfig={columns}
        rowConfig={{
          onClick: item => openDetailPanel(item),
        }}
        selection={{
          mode: 'multiple',
          behavior: 'toggle',
          selected,
          onSelectionChange: setSelected,
        }}
        emptyState={
          search.value || filter.value?.type
            ? <Text>No results match your filters</Text>
            : <Text>No items available</Text>
        }
        {...tableProps}
      />
    </Flex>
  );
}`;

// =============================================================================
// Custom Tables
// =============================================================================

export const tableCustomRowSnippet = `import { Fragment } from 'react';

const columns: ColumnConfig<Item>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    header: () => <Text weight="bold">Name (required)</Text>,
    cell: item => <CellText title={item.name} />,
  },
  { id: 'owner', label: 'Owner', cell: item => <CellText title={item.owner} /> },
  { id: 'lifecycle', label: 'Lifecycle', cell: item => <CellText title={item.lifecycle} /> },
];

const { tableProps } = useTable({
  mode: 'complete',
  getData: () => data,
});

<Table
  columnConfig={columns}
  rowConfig={({ item }) => (
    <Row
      id={String(item.id)}
      columns={columns}
      className={item.lifecycle === 'experimental' ? styles.experimentalRow : undefined}
    >
      {column => (
        <Fragment key={column.id}>{column.cell(item)}</Fragment>
      )}
    </Row>
  )}
  {...tableProps}
/>`;

export const tablePrimitivesSnippet = `<TableRoot>
  <TableHeader>
    <Column isRowHeader>Name</Column>
    <Column>Owner</Column>
    <Column>Type</Column>
  </TableHeader>
  <TableBody>
    {items.map(item => (
      <Row key={item.id} id={String(item.id)}>
        <CellText title={item.name} />
        <CellText title={item.owner} />
        <CellText title={item.type} />
      </Row>
    ))}
  </TableBody>
</TableRoot>`;
