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
import { Flex } from '../../Flex';
import { Text } from '../../Text';
import { RadioGroup, Radio } from '../../RadioGroup';
import { data as data4 } from './mocked-data4';
import { selectionData, selectionColumns, tableStoriesMeta } from './utils';

const meta = {
  title: 'Backstage UI/Table/docs',
  ...tableStoriesMeta,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;
type Data4Item = (typeof data4)[0];

export const TableRockBand: Story = {
  render: () => {
    const columns: ColumnConfig<Data4Item>[] = [
      {
        id: 'name',
        label: 'Band name',
        isRowHeader: true,
        defaultWidth: '4fr',
        cell: item => (
          <CellProfile name={item.name} src={item.image} href={item.website} />
        ),
      },
      {
        id: 'genre',
        label: 'Genre',
        defaultWidth: '4fr',
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

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => data4,
      paginationOptions: { pageSize: 5 },
    });

    return <Table columnConfig={columns} {...tableProps} />;
  },
};

export const SelectionToggleWithActions: Story = {
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

export const SelectionModePlayground: Story = {
  render: () => {
    const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>(
      'multiple',
    );
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(
      new Set(),
    );

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => selectionData,
      paginationOptions: { pageSize: 10 },
    });

    return (
      <Flex direction="column" gap="8">
        <Table
          {...tableProps}
          columnConfig={selectionColumns}
          selection={{
            mode: selectionMode,
            behavior: 'toggle',
            selected,
            onSelectionChange: setSelected,
          }}
        />
        <div>
          <Text as="h4" style={{ marginBottom: 'var(--bui-space-2)' }}>
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
      </Flex>
    );
  },
};

export const SelectionBehaviorPlayground: Story = {
  render: () => {
    const [selectionBehavior, setSelectionBehavior] = useState<
      'toggle' | 'replace'
    >('toggle');
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(
      new Set(),
    );

    const { tableProps } = useTable({
      mode: 'complete',
      getData: () => selectionData,
      paginationOptions: { pageSize: 10 },
    });

    return (
      <Flex direction="column" gap="8">
        <Table
          {...tableProps}
          columnConfig={selectionColumns}
          selection={{
            mode: 'multiple',
            behavior: selectionBehavior,
            selected,
            onSelectionChange: setSelected,
          }}
        />
        <div>
          <Text as="h4" style={{ marginBottom: 'var(--bui-space-2)' }}>
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
    );
  },
};
