'use client';

import {
  Table,
  CellProfile,
  CellText,
  type ColumnConfig,
  useTable,
} from '../../../../../packages/ui/src/components/Table';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { Text } from '../../../../../packages/ui/src/components/Text/Text';
import { RadioGroup } from '../../../../../packages/ui/src/components/RadioGroup/RadioGroup';
import { Radio } from '../../../../../packages/ui/src/components/RadioGroup';
import { data as data4 } from '../../../../../packages/ui/src/components/Table/stories/mocked-data4';
import { useState } from 'react';
import {
  selectionData,
  selectionColumns,
} from '../../../../../packages/ui/src/components/Table/stories/utils';
import { MemoryRouter } from 'react-router-dom';

type Data4Item = (typeof data4)[0];

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

export const TableRockBand = () => {
  const { tableProps } = useTable({
    mode: 'complete',
    getData: () => data4,
    paginationOptions: { pageSize: 5 },
  });

  return (
    <MemoryRouter>
      <Table columnConfig={columns} {...tableProps} />
    </MemoryRouter>
  );
};

export const SelectionToggleWithActions = () => {
  const [selected, setSelected] = useState<Set<string | number> | 'all'>(
    new Set(),
  );

  const { tableProps } = useTable({
    mode: 'complete',
    getData: () => selectionData,
    paginationOptions: { pageSize: 10 },
  });

  return (
    <MemoryRouter>
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
    </MemoryRouter>
  );
};

export const SelectionModePlayground = () => {
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
    <MemoryRouter>
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
    </MemoryRouter>
  );
};

export const SelectionBehaviorPlayground = () => {
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
    <MemoryRouter>
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
    </MemoryRouter>
  );
};
