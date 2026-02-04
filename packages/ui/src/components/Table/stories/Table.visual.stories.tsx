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

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, CellText, CellProfile, useTable, type ColumnConfig } from '..';
import { data as data1 } from './mocked-data1';
import { data as data4 } from './mocked-data4';
import { selectionData, selectionColumns, tableStoriesMeta } from './utils';

const meta = {
  title: 'Backstage UI/Table/visual',
  ...tableStoriesMeta,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Data1Item = (typeof data1)[0];
type Data4Item = (typeof data4)[0];
type CellTextVariantsItem = (typeof cellTextVariantsData)[0];

export const ProfileCells: Story = {
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

    return <Table columnConfig={columns} {...tableProps} />;
  },
};

export const EmptyState: Story = {
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

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => [],
      paginationOptions: { pageSize: 5 },
    });

    return (
      <Table
        columnConfig={columns}
        {...tableProps}
        emptyState={<div>No data available</div>}
      />
    );
  },
};

export const NoPagination: Story = {
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

    return (
      <Table
        columnConfig={columns}
        data={data1.slice(0, 10)}
        pagination={{ type: 'none' }}
      />
    );
  },
};

export const SelectionWithDisabledRows: Story = {
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
        rowConfig={{
          getIsDisabled: item => item.id === 2,
        }}
      />
    );
  },
};

// Data for CellTextVariants story showcasing multiple features
const cellTextVariantsData = [
  {
    id: 1,
    name: 'Authentication Service',
    description: 'Handles user login and session management',
    type: 'service',
    owner: 'Platform Team',
  },
  {
    id: 2,
    name: 'A very long component name that should be truncated when it exceeds the available column width',
    description:
      'This is also a very long description that demonstrates text truncation behavior in the table cells',
    type: 'library',
    owner: 'Frontend Team',
  },
  {
    id: 3,
    name: 'API Gateway',
    description: 'Routes and validates API requests',
    type: 'service',
    owner: 'Backend Team',
  },
];

export const CellTextVariants: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(
      new Set(['1', '3']),
    );
    const [sortDescriptor, setSortDescriptor] = useState<{
      column: string;
      direction: 'ascending' | 'descending';
    }>({ column: 'name', direction: 'ascending' });

    const columns: ColumnConfig<CellTextVariantsItem>[] = [
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
        id: 'type',
        label: 'Type',
        isSortable: true,
        cell: item => (
          <CellText
            title={item.type}
            leadingIcon={<span style={{ fontSize: '16px' }}>📦</span>}
          />
        ),
      },
      {
        id: 'owner',
        label: 'Owner',
        cell: item => <CellText title={item.owner} href="#" />,
      },
    ];

    return (
      <Table
        columnConfig={columns}
        data={cellTextVariantsData}
        pagination={{ type: 'none' }}
        selection={{
          mode: 'multiple',
          behavior: 'toggle',
          selected,
          onSelectionChange: setSelected,
        }}
        sort={{
          descriptor: sortDescriptor,
          onSortChange: descriptor =>
            setSortDescriptor({
              column: String(descriptor.column),
              direction: descriptor.direction,
            }),
        }}
      />
    );
  },
};

export const LoadingState: Story = {
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

    return (
      <Table
        columnConfig={columns}
        data={undefined}
        loading={true}
        pagination={{ type: 'none' }}
      />
    );
  },
};

export const ErrorState: Story = {
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

    return (
      <Table
        columnConfig={columns}
        data={undefined}
        error={new Error('Failed to fetch data from the server')}
        pagination={{ type: 'none' }}
      />
    );
  },
};

export const StaleState: Story = {
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

    return (
      <Table
        columnConfig={columns}
        data={data1.slice(0, 5)}
        isStale={true}
        pagination={{ type: 'none' }}
      />
    );
  },
};

export const CustomPageSizeOptions: Story = {
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
      mode: 'complete',
      getData: () => data1,
      paginationOptions: {
        pageSize: 3,
        pageSizeOptions: [
          { label: '2 per page', value: 2 },
          { label: '3 per page', value: 3 },
          { label: '5 per page', value: 5 },
          { label: '7 per page', value: 7 },
        ],
        onPageSizeChange: size => {
          console.log('Page size changed to:', size);
        },
        onNextPage: () => {
          console.log('Navigated to next page');
        },
        onPreviousPage: () => {
          console.log('Navigated to previous page');
        },
      },
    });

    return <Table columnConfig={columns} {...tableProps} />;
  },
};
