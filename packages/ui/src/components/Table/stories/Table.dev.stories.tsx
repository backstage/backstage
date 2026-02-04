/* eslint-disable no-restricted-syntax */
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

import { useState, Fragment } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableRoot,
  TableHeader,
  TableBody,
  Column,
  Row,
  CellText,
  CellProfile,
  useTable,
  type ColumnConfig,
} from '..';
import { Button } from '../../Button';
import { Select } from '../../Select';
import { Flex } from '../../Flex';
import { data as data1 } from './mocked-data1';
import { data as data4 } from './mocked-data4';
import { selectionData, selectionColumns, tableStoriesMeta } from './utils';
import { SearchField } from '../../SearchField';

const meta = {
  title: 'Backstage UI/Table/dev',
  ...tableStoriesMeta,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;
type Data1Item = (typeof data1)[0];
type Data4Item = (typeof data4)[0];

export const BasicLocalData: Story = {
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [
      {
        id: 'name',
        label: 'Name',
        isRowHeader: true,
        defaultWidth: '4fr',
        cell: item => (
          <CellText title={item.name} description={item.description} />
        ),
      },
      {
        id: 'owner',
        label: 'Owner',
        defaultWidth: '1fr',
        cell: item => <CellText title={item.owner.name} />,
      },
      {
        id: 'type',
        label: 'Type',
        defaultWidth: '1fr',
        cell: item => <CellText title={item.type} />,
      },
      {
        id: 'lifecycle',
        label: 'Lifecycle',
        defaultWidth: '1fr',
        cell: item => <CellText title={item.lifecycle} />,
      },
    ];

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: { pageSize: 5 },
    });

    return <Table columnConfig={columns} {...tableProps} />;
  },
};

export const Sorting: Story = {
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [
      {
        id: 'name',
        label: 'Name',
        isRowHeader: true,
        cell: item => <CellText title={item.name} />,
        isSortable: true,
      },
      {
        id: 'owner',
        label: 'Owner',
        cell: item => <CellText title={item.owner.name} />,
        isSortable: true,
      },
      {
        id: 'type',
        label: 'Type',
        cell: item => <CellText title={item.type} />,
        isSortable: true,
      },
      {
        id: 'lifecycle',
        label: 'Lifecycle',
        cell: item => <CellText title={item.lifecycle} />,
        isSortable: true,
      },
    ];

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: { pageSize: 5 },
      initialSort: { column: 'name', direction: 'ascending' },
      sortFn: (items, { column, direction }) => {
        return [...items].sort((a, b) => {
          let aVal: string;
          let bVal: string;
          if (column === 'name') {
            aVal = a.name;
            bVal = b.name;
          } else if (column === 'owner') {
            aVal = a.owner.name;
            bVal = b.owner.name;
          } else if (column === 'type') {
            aVal = a.type;
            bVal = b.type;
          } else {
            aVal = a.lifecycle;
            bVal = b.lifecycle;
          }
          const cmp = aVal.localeCompare(bVal);
          return direction === 'descending' ? -cmp : cmp;
        });
      },
    });

    return <Table columnConfig={columns} {...tableProps} />;
  },
};

export const Search: Story = {
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [
      {
        id: 'name',
        label: 'Name',
        isRowHeader: true,
        cell: item => <CellText title={item.name} />,
        isSortable: true,
      },
      {
        id: 'owner',
        label: 'Owner',
        cell: item => <CellText title={item.owner.name} />,
      },
      {
        id: 'type',
        label: 'Type',
        cell: item => <CellText title={item.type} />,
      },
    ];

    const { tableProps, search } = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: { pageSize: 5 },
      searchFn: (items, query) => {
        const lowerQuery = query.toLowerCase();
        return items.filter(
          item =>
            item.name.toLowerCase().includes(lowerQuery) ||
            item.owner.name.toLowerCase().includes(lowerQuery) ||
            item.type.toLowerCase().includes(lowerQuery),
        );
      },
    });

    return (
      <div>
        <SearchField
          aria-label="Search"
          placeholder="Search..."
          style={{ marginBottom: '16px' }}
          {...search}
        />
        <Table
          columnConfig={columns}
          emptyState={
            search.value ? (
              <div>No results found</div>
            ) : (
              <div>No data available</div>
            )
          }
          {...tableProps}
        />
      </div>
    );
  },
};

export const Selection: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(
      new Set(),
    );

    const columns: ColumnConfig<Data1Item>[] = [
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
        id: 'type',
        label: 'Type',
        cell: item => <CellText title={item.type} />,
      },
    ];

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: { pageSize: 5 },
    });

    return (
      <Table
        {...tableProps}
        columnConfig={columns}
        selection={{
          mode: 'multiple',
          selected,
          onSelectionChange: setSelected,
        }}
      />
    );
  },
};

export const RowLinks: Story = {
  render: () => {
    const columns: ColumnConfig<Data4Item>[] = [
      {
        id: 'name',
        label: 'Band name',
        isRowHeader: true,
        cell: item => <CellProfile name={item.name} src={item.image} />,
      },
      {
        id: 'genre',
        label: 'Genre',
        cell: item => <CellText title={item.genre} />,
      },
      {
        id: 'yearFormed',
        label: 'Year formed',
        cell: item => <CellText title={item.yearFormed.toString()} />,
      },
    ];

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => data4,
      paginationOptions: { pageSize: 5 },
    });

    return (
      <Table
        {...tableProps}
        columnConfig={columns}
        rowConfig={{ getHref: item => `/bands/${item.id}` }}
      />
    );
  },
};

export const Reload: Story = {
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [
      {
        id: 'name',
        label: 'Name',
        isRowHeader: true,
        cell: item => <CellText title={item.name} />,
      },
      {
        id: 'type',
        label: 'Type',
        cell: item => <CellText title={item.type} />,
      },
    ];

    const { tableProps, reload } = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: { pageSize: 5 },
    });

    return (
      <div>
        <Button onPress={() => reload()}>Refresh Data</Button>
        <Table columnConfig={columns} {...tableProps} />
      </div>
    );
  },
};

export const ServerSidePaginationOffset: Story = {
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [
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
        id: 'type',
        label: 'Type',
        cell: item => <CellText title={item.type} />,
      },
    ];

    const { tableProps } = useTable({
      mode: 'offset',
      getData: async ({ offset, pageSize }) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          data: data1.slice(offset, offset + pageSize),
          totalCount: data1.length,
        };
      },
      paginationOptions: { pageSize: 5 },
    });

    return <Table columnConfig={columns} {...tableProps} />;
  },
};

export const ServerSidePaginationCursor: Story = {
  render: () => {
    const columns: ColumnConfig<Data4Item>[] = [
      {
        id: 'name',
        label: 'Band name',
        isRowHeader: true,
        cell: item => <CellProfile name={item.name} src={item.image} />,
      },
      {
        id: 'genre',
        label: 'Genre',
        cell: item => <CellText title={item.genre} />,
      },
    ];

    const { tableProps } = useTable({
      mode: 'cursor',
      getData: async ({ cursor, pageSize }) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const startIndex = cursor ? parseInt(cursor, 10) : 0;
        const nextIndex = startIndex + pageSize;
        return {
          data: data4.slice(startIndex, nextIndex),
          totalCount: data4.length,
          nextCursor: nextIndex < data4.length ? String(nextIndex) : undefined,
          prevCursor:
            startIndex > 0
              ? String(Math.max(0, startIndex - pageSize))
              : undefined,
        };
      },
      paginationOptions: { pageSize: 5 },
    });

    return <Table columnConfig={columns} {...tableProps} />;
  },
};

export const CustomRowRender: Story = {
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [
      {
        id: 'name',
        label: 'Name',
        isRowHeader: true,
        cell: item => <CellText title={item.name} />,
      },
      {
        id: 'type',
        label: 'Type',
        cell: item => <CellText title={item.type} />,
      },
      {
        id: 'lifecycle',
        label: 'Lifecycle',
        cell: item => <CellText title={item.lifecycle} />,
      },
    ];

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: { pageSize: 5 },
    });

    return (
      <Table
        {...tableProps}
        columnConfig={columns}
        rowConfig={({ item }) => (
          <Row
            id={String(item.id)}
            columns={columns}
            style={{
              background:
                item.lifecycle === 'experimental'
                  ? 'var(--bui-bg-warning)'
                  : undefined,
              borderLeft:
                item.lifecycle === 'experimental'
                  ? '3px solid var(--bui-fg-warning)'
                  : '3px solid transparent',
            }}
          >
            {column => (
              <Fragment key={column.id}>
                {column.id === 'name' ? (
                  <CellText title={item.name} description={item.description} />
                ) : (
                  column.cell(item)
                )}
              </Fragment>
            )}
          </Row>
        )}
      />
    );
  },
};

export const AtomicComponents: Story = {
  render: () => {
    const displayData = data1.slice(0, 5);

    return (
      <TableRoot>
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Owner</Column>
          <Column>Type</Column>
        </TableHeader>
        <TableBody>
          {displayData.map(item => (
            <Row key={item.id} id={String(item.id)}>
              <CellText title={item.name} />
              <CellText title={item.owner.name} />
              <CellText title={item.type} />
            </Row>
          ))}
        </TableBody>
      </TableRoot>
    );
  },
};

export const RowClick: Story = {
  render: () => {
    const columns: ColumnConfig<Data4Item>[] = [
      {
        id: 'name',
        label: 'Band name',
        isRowHeader: true,
        cell: item => (
          <CellProfile name={item.name} src={item.image} href={item.website} />
        ),
      },
      {
        id: 'genre',
        label: 'Genre',
        cell: item => <CellText title={item.genre} />,
      },
      {
        id: 'yearFormed',
        label: 'Year formed',
        cell: item => <CellText title={item.yearFormed.toString()} />,
      },
      {
        id: 'albums',
        label: 'Albums',
        cell: item => <CellText title={item.albums.toString()} />,
      },
    ];

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => data4,
      paginationOptions: { pageSize: 5 },
    });

    return (
      <Table
        {...tableProps}
        columnConfig={columns}
        rowConfig={{ onClick: item => alert(`Clicked: ${item.name}`) }}
      />
    );
  },
};

export const SelectionSingleToggle: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(
      new Set(),
    );

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => selectionData,
      paginationOptions: { pageSize: 10 },
    });

    return (
      <Table
        {...tableProps}
        columnConfig={selectionColumns}
        selection={{
          mode: 'single',
          behavior: 'toggle',
          selected,
          onSelectionChange: setSelected,
        }}
      />
    );
  },
};

export const SelectionMultiToggle: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(
      new Set(),
    );

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => selectionData,
      paginationOptions: { pageSize: 10 },
    });

    return (
      <Table
        {...tableProps}
        columnConfig={selectionColumns}
        selection={{
          mode: 'multiple',
          behavior: 'toggle',
          selected,
          onSelectionChange: setSelected,
        }}
      />
    );
  },
};

export const SelectionWithRowClick: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(
      new Set(),
    );

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => selectionData,
      paginationOptions: { pageSize: 10 },
    });

    return (
      <Table
        {...tableProps}
        columnConfig={selectionColumns}
        selection={{
          mode: 'multiple',
          behavior: 'toggle',
          selected,
          onSelectionChange: setSelected,
        }}
        rowConfig={{ onClick: item => alert(`Clicked: ${item.name}`) }}
      />
    );
  },
};

export const SelectionWithRowLinks: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(
      new Set(),
    );

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => selectionData,
      paginationOptions: { pageSize: 10 },
    });

    return (
      <Table
        {...tableProps}
        columnConfig={selectionColumns}
        selection={{
          mode: 'multiple',
          behavior: 'toggle',
          selected,
          onSelectionChange: setSelected,
        }}
        rowConfig={{ getHref: item => `/items/${item.id}` }}
      />
    );
  },
};

export const SelectionWithPagination: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(
      new Set(),
    );

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: { pageSize: 5 },
    });

    const columns: ColumnConfig<Data1Item>[] = [
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
        id: 'type',
        label: 'Type',
        cell: item => <CellText title={item.type} />,
      },
    ];

    return (
      <Table
        {...tableProps}
        columnConfig={columns}
        selection={{
          mode: 'multiple',
          behavior: 'toggle',
          selected,
          onSelectionChange: setSelected,
        }}
      />
    );
  },
};

export const SelectionSingleReplace: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(
      new Set(),
    );

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => selectionData,
      paginationOptions: { pageSize: 10 },
    });

    return (
      <Table
        {...tableProps}
        columnConfig={selectionColumns}
        selection={{
          mode: 'single',
          behavior: 'replace',
          selected,
          onSelectionChange: setSelected,
        }}
      />
    );
  },
};

export const SelectionMultiReplace: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(
      new Set(),
    );

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => selectionData,
      paginationOptions: { pageSize: 10 },
    });

    return (
      <Table
        {...tableProps}
        columnConfig={selectionColumns}
        selection={{
          mode: 'multiple',
          behavior: 'replace',
          selected,
          onSelectionChange: setSelected,
        }}
      />
    );
  },
};

export const SelectionReplaceWithRowClick: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(
      new Set(),
    );

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => selectionData,
      paginationOptions: { pageSize: 10 },
    });

    return (
      <Table
        {...tableProps}
        columnConfig={selectionColumns}
        selection={{
          mode: 'multiple',
          behavior: 'replace',
          selected,
          onSelectionChange: setSelected,
        }}
        rowConfig={{ onClick: item => alert(`Opening ${item.name}`) }}
      />
    );
  },
};

export const SelectionReplaceWithRowLinks: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(
      new Set(),
    );

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => selectionData,
      paginationOptions: { pageSize: 10 },
    });

    return (
      <Table
        {...tableProps}
        columnConfig={selectionColumns}
        selection={{
          mode: 'multiple',
          behavior: 'replace',
          selected,
          onSelectionChange: setSelected,
        }}
        rowConfig={{ getHref: item => `/items/${item.id}` }}
      />
    );
  },
};

// Type filter interface for ComprehensiveServerSide story
interface TypeFilter {
  type: string | null;
}

/**
 * Comprehensive example showcasing a common complex use case:
 * - Server-side offset pagination
 * - Search/filtering
 * - Sorting
 * - Multi-selection
 * - Type filter dropdown
 */
export const ComprehensiveServerSide: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(
      new Set(),
    );

    const typeOptions = [
      { value: '', label: 'All types' },
      { value: 'service', label: 'Service' },
      { value: 'website', label: 'Website' },
      { value: 'library', label: 'Library' },
      { value: 'documentation', label: 'Documentation' },
      { value: 'other', label: 'Other' },
    ];

    const columns: ColumnConfig<Data1Item>[] = [
      {
        id: 'name',
        label: 'Name',
        isRowHeader: true,
        isSortable: true,
        cell: item => (
          <CellText title={item.name} description={item.description} />
        ),
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

    const { tableProps, search, filter } = useTable<Data1Item, TypeFilter>({
      mode: 'offset',
      initialSort: { column: 'name', direction: 'ascending' },
      getData: async ({
        offset,
        pageSize,
        sort,
        filter: typeFilter,
        search: searchQuery,
      }) => {
        // Simulate server-side filtering, sorting, and pagination
        // with slower and slower responses
        const page = Math.floor(offset / pageSize) + 1;
        await new Promise(resolve => setTimeout(resolve, 300 * page));

        let filtered = [...data1];

        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            item =>
              item.name.toLowerCase().includes(query) ||
              item.owner.name.toLowerCase().includes(query) ||
              item.description?.toLowerCase().includes(query),
          );
        }

        // Apply type filter
        if (typeFilter?.type) {
          filtered = filtered.filter(item => item.type === typeFilter.type);
        }

        // Apply sorting
        if (sort) {
          filtered.sort((a, b) => {
            let aVal: string;
            let bVal: string;
            switch (sort.column) {
              case 'owner':
                aVal = a.owner.name;
                bVal = b.owner.name;
                break;
              case 'type':
                aVal = a.type;
                bVal = b.type;
                break;
              case 'lifecycle':
                aVal = a.lifecycle;
                bVal = b.lifecycle;
                break;
              default:
                aVal = a.name;
                bVal = b.name;
            }
            const cmp = aVal.localeCompare(bVal);
            return sort.direction === 'descending' ? -cmp : cmp;
          });
        }

        return {
          data: filtered.slice(offset, offset + pageSize),
          totalCount: filtered.length,
        };
      },
      paginationOptions: { pageSize: 10 },
    });

    return (
      <Flex direction="column" gap="4">
        <Flex gap="4" align="end">
          <SearchField
            aria-label="Search"
            label="Search"
            placeholder="Search by name, owner, or description..."
            style={{ width: 300 }}
            {...search}
          />
          <Select
            label="Type"
            options={typeOptions}
            value={filter.value?.type ?? ''}
            onChange={key =>
              filter.onChange({ type: key === '' ? null : String(key) })
            }
            style={{ width: 180 }}
          />
        </Flex>
        <Table
          {...tableProps}
          columnConfig={columns}
          selection={{
            mode: 'multiple',
            behavior: 'toggle',
            selected,
            onSelectionChange: setSelected,
          }}
          emptyState={
            search.value || filter.value?.type ? (
              <div>No results match your filters</div>
            ) : (
              <div>No data available</div>
            )
          }
        />
      </Flex>
    );
  },
};
