'use client';

import { useState } from 'react';
import {
  Table,
  TableRoot,
  TableHeader,
  TableBody,
  Column,
  Row,
  CellProfile,
  CellText,
  useTable,
  type ColumnConfig,
} from '../../../../../packages/ui/src/components/Table';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { Text } from '../../../../../packages/ui/src/components/Text/Text';
import { SearchField } from '../../../../../packages/ui/src/components/SearchField/SearchField';
import {
  RadioGroup,
  Radio,
} from '../../../../../packages/ui/src/components/RadioGroup';
import { data as rockBandData } from '../../../../../packages/ui/src/components/Table/stories/mocked-data4';
import { data as catalogData } from '../../../../../packages/ui/src/components/Table/stories/mocked-data1';
import { MemoryRouter } from 'react-router-dom';

// =============================================================================
// Types
// =============================================================================

type RockBandItem = (typeof rockBandData)[0];
type CatalogItem = (typeof catalogData)[0];

// =============================================================================
// Hero Example
// =============================================================================

const heroColumns: ColumnConfig<RockBandItem>[] = [
  {
    id: 'name',
    label: 'Band name',
    isRowHeader: true,
    defaultWidth: '3fr',
    cell: item => (
      <CellProfile name={item.name} src={item.image} href={item.website} />
    ),
  },
  {
    id: 'genre',
    label: 'Genre',
    defaultWidth: '3fr',
    cell: item => <CellText title={item.genre} />,
  },
  {
    id: 'yearFormed',
    label: 'Year formed',
    defaultWidth: '1fr',
    cell: item => <CellText title={item.yearFormed.toString()} />,
  },
  {
    id: 'albums',
    label: 'Albums',
    defaultWidth: '1fr',
    cell: item => <CellText title={item.albums.toString()} />,
  },
];

export function HeroExample() {
  const { tableProps } = useTable({
    mode: 'complete',
    getData: () => rockBandData,
    paginationOptions: { pageSize: 5 },
  });

  return (
    <MemoryRouter>
      <Table columnConfig={heroColumns} {...tableProps} />
    </MemoryRouter>
  );
}

// =============================================================================
// Sorting Example
// =============================================================================

const sortingColumns: ColumnConfig<CatalogItem>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    isSortable: true,
    cell: item => <CellText title={item.name} />,
  },
  {
    id: 'owner',
    label: 'Owner',
    isSortable: true,
    cell: item => <CellText title={item.owner.name} />,
  },
  {
    id: 'type',
    label: 'Type',
    isSortable: true,
    cell: item => <CellText title={item.type} />,
  },
  {
    id: 'lifecycle',
    label: 'Lifecycle',
    isSortable: true,
    cell: item => <CellText title={item.lifecycle} />,
  },
];

export function SortingExample() {
  const { tableProps } = useTable({
    mode: 'complete',
    getData: () => catalogData,
    paginationOptions: { pageSize: 5 },
    initialSort: { column: 'name', direction: 'ascending' },
    sortFn: (items, { column, direction }) => {
      return [...items].sort((a, b) => {
        let aVal: string;
        let bVal: string;
        if (column === 'owner') {
          aVal = a.owner.name;
          bVal = b.owner.name;
        } else {
          aVal = String(a[column as keyof CatalogItem]);
          bVal = String(b[column as keyof CatalogItem]);
        }
        const cmp = aVal.localeCompare(bVal);
        return direction === 'descending' ? -cmp : cmp;
      });
    },
  });

  return (
    <MemoryRouter>
      <Table columnConfig={sortingColumns} {...tableProps} />
    </MemoryRouter>
  );
}

// =============================================================================
// Search Example
// =============================================================================

const searchColumns: ColumnConfig<CatalogItem>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    cell: item => <CellText title={item.name} description={item.description} />,
  },
  {
    id: 'owner',
    label: 'Owner',
    cell: item => <CellText title={item.owner.name} />,
  },
  { id: 'type', label: 'Type', cell: item => <CellText title={item.type} /> },
];

export function SearchExample() {
  const { tableProps, search } = useTable({
    mode: 'complete',
    getData: () => catalogData,
    paginationOptions: { pageSize: 5 },
    searchFn: (items, query) => {
      const lowerQuery = query.toLocaleLowerCase('en-US');
      return items.filter(
        item =>
          item.name.toLocaleLowerCase('en-US').includes(lowerQuery) ||
          item.owner.name.toLocaleLowerCase('en-US').includes(lowerQuery) ||
          item.type.toLocaleLowerCase('en-US').includes(lowerQuery),
      );
    },
  });

  return (
    <MemoryRouter>
      <Flex direction="column" gap="4">
        <SearchField
          aria-label="Search"
          placeholder="Search..."
          value={search.value}
          onChange={search.onChange}
          style={{ maxWidth: 300 }}
        />
        <Table
          columnConfig={searchColumns}
          emptyState={
            search.value ? (
              <Text>No results found for &quot;{search.value}&quot;</Text>
            ) : (
              <Text>No data available</Text>
            )
          }
          {...tableProps}
        />
      </Flex>
    </MemoryRouter>
  );
}

// =============================================================================
// Selection Example
// =============================================================================

const selectionColumns: ColumnConfig<CatalogItem>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    cell: item => <CellText title={item.name} />,
  },
  {
    id: 'owner',
    label: 'Owner',
    cell: item => <CellText title={item.owner.name} />,
  },
  { id: 'type', label: 'Type', cell: item => <CellText title={item.type} /> },
];

export function SelectionExample() {
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>(
    'multiple',
  );
  const [selectionBehavior, setSelectionBehavior] = useState<
    'toggle' | 'replace'
  >('toggle');
  const [selected, setSelected] = useState<Set<string | number> | 'all'>(
    new Set(),
  );

  const { tableProps } = useTable({
    mode: 'complete',
    getData: () => catalogData.slice(0, 5),
  });

  return (
    <MemoryRouter>
      <Flex direction="column" gap="4">
        <Table
          columnConfig={selectionColumns}
          selection={{
            mode: selectionMode,
            behavior: selectionBehavior,
            selected,
            onSelectionChange: setSelected,
          }}
          {...tableProps}
        />
        <Flex gap="8">
          <div>
            <Text as="p" style={{ marginBottom: 'var(--bui-space-2)' }}>
              Selection mode:
            </Text>
            <RadioGroup
              aria-label="Selection mode"
              orientation="horizontal"
              value={selectionMode}
              onChange={value => {
                setSelectionMode(value as 'single' | 'multiple');
                setSelected(new Set());
              }}
            >
              <Radio value="single">single</Radio>
              <Radio value="multiple">multiple</Radio>
            </RadioGroup>
          </div>
          <div>
            <Text as="p" style={{ marginBottom: 'var(--bui-space-2)' }}>
              Selection behavior:
            </Text>
            <RadioGroup
              aria-label="Selection behavior"
              orientation="horizontal"
              value={selectionBehavior}
              onChange={value => {
                setSelectionBehavior(value as 'toggle' | 'replace');
                setSelected(new Set());
              }}
            >
              <Radio value="toggle">toggle</Radio>
              <Radio value="replace">replace</Radio>
            </RadioGroup>
          </div>
        </Flex>
      </Flex>
    </MemoryRouter>
  );
}

// =============================================================================
// Row Actions Example
// =============================================================================

export function RowActionsExample() {
  const [selected, setSelected] = useState<Set<string | number> | 'all'>(
    new Set(),
  );

  const { tableProps } = useTable({
    mode: 'complete',
    getData: () => catalogData.slice(0, 5),
  });

  return (
    <MemoryRouter>
      <Table
        columnConfig={selectionColumns}
        rowConfig={{
          onClick: item => alert(`Clicked: ${item.name}`),
        }}
        selection={{
          mode: 'multiple',
          behavior: 'toggle',
          selected,
          onSelectionChange: setSelected,
        }}
        {...tableProps}
      />
    </MemoryRouter>
  );
}

// =============================================================================
// Empty State Example
// =============================================================================

const emptyStateColumns: ColumnConfig<CatalogItem>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    cell: item => <CellText title={item.name} />,
  },
  {
    id: 'owner',
    label: 'Owner',
    cell: item => <CellText title={item.owner.name} />,
  },
  { id: 'type', label: 'Type', cell: item => <CellText title={item.type} /> },
];

export function EmptyStateExample() {
  const emptyData: CatalogItem[] = [];

  const { tableProps } = useTable({
    mode: 'complete',
    getData: () => emptyData,
  });

  return (
    <MemoryRouter>
      <Table
        columnConfig={emptyStateColumns}
        emptyState={<Text>No items yet. Create one to get started.</Text>}
        {...tableProps}
      />
    </MemoryRouter>
  );
}

// =============================================================================
// Combined Example
// =============================================================================

const combinedColumns: ColumnConfig<CatalogItem>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    isSortable: true,
    cell: item => <CellText title={item.name} description={item.description} />,
  },
  {
    id: 'owner',
    label: 'Owner',
    isSortable: true,
    cell: item => <CellText title={item.owner.name} />,
  },
  {
    id: 'type',
    label: 'Type',
    isSortable: true,
    cell: item => <CellText title={item.type} />,
  },
];

export function CombinedExample() {
  const [selected, setSelected] = useState<Set<string | number> | 'all'>(
    new Set(),
  );

  const { tableProps, search } = useTable({
    mode: 'offset',
    getData: async ({ offset, pageSize, search: query, sort }) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Filter data
      let filtered = catalogData;
      if (query) {
        const lowerQuery = query.toLocaleLowerCase('en-US');
        filtered = filtered.filter(
          item =>
            item.name.toLocaleLowerCase('en-US').includes(lowerQuery) ||
            item.owner.name.toLocaleLowerCase('en-US').includes(lowerQuery) ||
            item.type.toLocaleLowerCase('en-US').includes(lowerQuery),
        );
      }

      // Sort data
      if (sort?.column) {
        filtered = [...filtered].sort((a, b) => {
          let aVal: string;
          let bVal: string;
          if (sort.column === 'owner') {
            aVal = a.owner.name;
            bVal = b.owner.name;
          } else {
            aVal = String(a[sort.column as keyof CatalogItem]);
            bVal = String(b[sort.column as keyof CatalogItem]);
          }
          const cmp = aVal.localeCompare(bVal);
          return sort.direction === 'descending' ? -cmp : cmp;
        });
      }

      // Paginate
      const data = filtered.slice(offset, offset + pageSize);

      return { data, totalCount: filtered.length };
    },
    paginationOptions: { pageSize: 5, pageSizeOptions: [5, 10, 20] },
    initialSort: { column: 'name', direction: 'ascending' },
  });

  return (
    <MemoryRouter>
      <Flex direction="column" gap="4">
        <SearchField
          aria-label="Search"
          placeholder="Search..."
          value={search.value}
          onChange={search.onChange}
          style={{ maxWidth: 300 }}
        />
        <Table
          columnConfig={combinedColumns}
          rowConfig={{
            onClick: item => alert(`Clicked: ${item.name}`),
          }}
          selection={{
            mode: 'multiple',
            behavior: 'toggle',
            selected,
            onSelectionChange: setSelected,
          }}
          emptyState={
            search.value ? (
              <Text>No results match your search</Text>
            ) : (
              <Text>No items available</Text>
            )
          }
          {...tableProps}
        />
      </Flex>
    </MemoryRouter>
  );
}

// =============================================================================
// Custom Row Example
// =============================================================================

const customRowColumns: ColumnConfig<CatalogItem>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    cell: item => <CellText title={item.name} />,
  },
  {
    id: 'owner',
    label: 'Owner',
    cell: item => <CellText title={item.owner.name} />,
  },
  {
    id: 'lifecycle',
    label: 'Lifecycle',
    cell: item => <CellText title={item.lifecycle} />,
  },
];

export function CustomRowExample() {
  const { tableProps } = useTable({
    mode: 'complete',
    getData: () => catalogData.slice(0, 5),
  });

  return (
    <MemoryRouter>
      <Table
        columnConfig={customRowColumns}
        rowConfig={({ item }) => (
          <Row
            id={String(item.id)}
            columns={customRowColumns}
            style={
              item.lifecycle === 'experimental'
                ? { backgroundColor: 'var(--bui-bg-warning)' }
                : undefined
            }
          >
            {column => column.cell(item)}
          </Row>
        )}
        {...tableProps}
      />
    </MemoryRouter>
  );
}

// =============================================================================
// Primitives Example
// =============================================================================

export function PrimitivesExample() {
  const items = catalogData.slice(0, 5);

  return (
    <MemoryRouter>
      <TableRoot>
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Owner</Column>
          <Column>Type</Column>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <Row key={item.id} id={String(item.id)}>
              <CellText title={item.name} />
              <CellText title={item.owner.name} />
              <CellText title={item.type} />
            </Row>
          ))}
        </TableBody>
      </TableRoot>
    </MemoryRouter>
  );
}
