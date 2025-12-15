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
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { type Selection } from 'react-aria-components';
import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  CellText,
  CellProfile,
  useTable,
} from '.';
import { RadioGroup, Radio } from '../RadioGroup';
import { Flex } from '../Flex';
import { MemoryRouter } from 'react-router-dom';
import { data as data1Raw } from './mocked-data1';
import { data as data2 } from './mocked-data2';
import { data as data3 } from './mocked-data3';
import { data as data4 } from './mocked-data4';
import { RiCactusLine } from '@remixicon/react';
import { TablePagination } from '../TablePagination';
import { Text } from '../Text';

const meta = {
  title: 'Backstage UI/Table',
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta;

// Added this fix to fix Chromatic timeout error. This bug is due to rerendering the table with too many rows.
// Work in progress to fix it here - https://github.com/backstage/backstage/pull/30687
const data1 = data1Raw.slice(0, 10);

export default meta;
type Story = StoryObj<typeof meta>;

export const TableOnly: Story = {
  render: () => {
    return (
      <Table>
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Owner</Column>
          <Column>Type</Column>
          <Column>Lifecycle</Column>
        </TableHeader>
        <TableBody>
          {data1.map(item => (
            <Row key={item.name}>
              <CellText
                title={item.name}
                leadingIcon={<RiCactusLine />}
                description={item.description}
              />
              <CellProfile
                name={item.owner.name}
                src={item.owner.profilePicture}
                href={item.owner.link}
              />
              <CellText title={item.type} />
              <CellText title={item.lifecycle} />
            </Row>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const WithPaginationUncontrolled: Story = {
  render: () => {
    const { data, paginationProps } = useTable({ data: data1 });

    return (
      <>
        <Table>
          <TableHeader>
            <Column isRowHeader>Name</Column>
            <Column>Owner</Column>
            <Column>Type</Column>
            <Column>Lifecycle</Column>
          </TableHeader>
          <TableBody>
            {data?.map(item => (
              <Row key={item.name}>
                <CellText
                  title={item.name}
                  leadingIcon={<RiCactusLine />}
                  description={item.description}
                />
                <CellText title={item.owner.name} />
                <CellText title={item.type} />
                <CellText title={item.lifecycle} />
              </Row>
            ))}
          </TableBody>
        </Table>
        <TablePagination {...paginationProps} />
      </>
    );
  },
};

export const WithPaginationControlled: Story = {
  render: () => {
    const [offset, setOffset] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const { data, paginationProps } = useTable({
      data: data4,
      pagination: {
        offset,
        pageSize,
        onOffsetChange: setOffset,
        onPageSizeChange: setPageSize,
        onNextPage: () => console.log('Next page analytics'),
        onPreviousPage: () => console.log('Previous page analytics'),
      },
    });

    return (
      <>
        <Table>
          <TableHeader>
            <Column isRowHeader>Band name</Column>
            <Column>Genre</Column>
            <Column>Year formed</Column>
            <Column>Albums</Column>
          </TableHeader>
          <TableBody>
            {data?.map(item => (
              <Row key={item.name}>
                <CellProfile
                  name={item.name}
                  src={item.image}
                  href={item.website}
                />
                <CellText title={item.genre} />
                <CellText title={item.yearFormed.toString()} />
                <CellText title={item.albums.toString()} />
              </Row>
            ))}
          </TableBody>
        </Table>
        <TablePagination {...paginationProps} />
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
          Current state: offset={offset}, pageSize={pageSize}
        </div>
      </>
    );
  },
};

export const Sorting: Story = {
  render: () => {
    return (
      <Table>
        <TableHeader>
          <Column isRowHeader allowsSorting>
            Name
          </Column>
          <Column allowsSorting>Owner</Column>
          <Column allowsSorting>Type</Column>
          <Column allowsSorting>Lifecycle</Column>
        </TableHeader>
        <TableBody>
          {data1.map(item => (
            <Row key={item.name}>
              <CellText
                title={item.name}
                leadingIcon={<RiCactusLine />}
                description={item.description}
              />
              <CellProfile
                name={item.owner.name}
                src={item.owner.profilePicture}
                href={item.owner.link}
              />
              <CellText title={item.type} />
              <CellText title={item.lifecycle} />
            </Row>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const TableRockBand: Story = {
  render: () => {
    const { data, paginationProps } = useTable({
      data: data4,
      pagination: {
        defaultPageSize: 5,
      },
    });

    return (
      <>
        <Table>
          <TableHeader>
            <Column isRowHeader>Band name</Column>
            <Column>Genre</Column>
            <Column>Year formed</Column>
            <Column>Albums</Column>
          </TableHeader>
          <TableBody>
            {data?.map(item => (
              <Row key={item.name}>
                <CellProfile
                  name={item.name}
                  src={item.image}
                  href={item.website}
                />
                <CellText title={item.genre} />
                <CellText title={item.yearFormed.toString()} />
                <CellText title={item.albums.toString()} />
              </Row>
            ))}
          </TableBody>
        </Table>
        <TablePagination {...paginationProps} />
      </>
    );
  },
};

export const RowClick: Story = {
  render: () => {
    const { data, paginationProps } = useTable({
      data: data4,
      pagination: {
        defaultPageSize: 5,
      },
    });

    return (
      <>
        <Table>
          <TableHeader>
            <Column isRowHeader>Band name</Column>
            <Column>Genre</Column>
            <Column>Year formed</Column>
            <Column>Albums</Column>
          </TableHeader>
          <TableBody>
            {data?.map(item => (
              <Row key={item.name} onAction={() => alert('Row clicked')}>
                <CellProfile
                  name={item.name}
                  src={item.image}
                  href={item.website}
                />
                <CellText title={item.genre} />
                <CellText title={item.yearFormed.toString()} />
                <CellText title={item.albums.toString()} />
              </Row>
            ))}
          </TableBody>
        </Table>
        <TablePagination {...paginationProps} />
      </>
    );
  },
};

export const RowLink: Story = {
  render: () => {
    const { data, paginationProps } = useTable({
      data: data4,
      pagination: {
        defaultPageSize: 5,
      },
    });

    return (
      <>
        <Table>
          <TableHeader>
            <Column isRowHeader>Band name</Column>
            <Column>Genre</Column>
            <Column>Year formed</Column>
            <Column>Albums</Column>
          </TableHeader>
          <TableBody>
            {data?.map(item => (
              <Row key={item.name} href="/band">
                <CellProfile
                  name={item.name}
                  src={item.image}
                  href={item.website}
                />
                <CellText title={item.genre} />
                <CellText title={item.yearFormed.toString()} />
                <CellText title={item.albums.toString()} />
              </Row>
            ))}
          </TableBody>
        </Table>
        <TablePagination {...paginationProps} />
      </>
    );
  },
};

export const CellComponent: Story = {
  name: 'Cell',
  render: () => {
    return (
      <Table>
        <TableHeader>
          <Column isRowHeader>Name</Column>
        </TableHeader>
        <TableBody>
          <Row>
            <Cell>Hello world</Cell>
          </Row>
          <Row>
            <Cell>
              This is a very long text that demonstrates how the Cell component
              handles lengthy content. It should wrap appropriately and maintain
              proper styling even when the text extends beyond the normal cell
              width. This helps ensure that the table remains readable and
              visually consistent regardless of the content length.
            </Cell>
          </Row>
          <Row>
            <Cell>Hello world</Cell>
          </Row>
        </TableBody>
      </Table>
    );
  },
};

export const CellTextComponent: Story = {
  name: 'CellText',
  render: () => {
    return (
      <Table>
        <TableHeader>
          <Column isRowHeader>Name</Column>
        </TableHeader>
        <TableBody>
          {data2.map(item => (
            <Row key={item.name}>
              <CellText
                title={item.name}
                leadingIcon={item.icon}
                description={item.description}
                href={item.href}
              />
            </Row>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const CellProfileComponent: Story = {
  name: 'CellProfile',
  render: () => {
    return (
      <Table>
        <TableHeader>
          <Column isRowHeader>Name</Column>
        </TableHeader>
        <TableBody>
          {data3.map(item => (
            <Row key={item.name}>
              <CellProfile
                name={item.name}
                src={item.profilePicture}
                href={item.link}
                description={item.description}
              />
            </Row>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const SelectionSingleToggle: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    return (
      <Table
        selectionMode="single"
        selectionBehavior="toggle"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Owner</Column>
          <Column>Type</Column>
        </TableHeader>
        <TableBody>
          <Row id="1">
            <CellText title="Component Library" />
            <CellText title="Design System" />
            <CellText title="library" />
          </Row>
          <Row id="2">
            <CellText title="API Gateway" />
            <CellText title="Platform" />
            <CellText title="service" />
          </Row>
          <Row id="3">
            <CellText title="Documentation Site" />
            <CellText title="DevEx" />
            <CellText title="website" />
          </Row>
        </TableBody>
      </Table>
    );
  },
};

export const SelectionMultiToggle: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    return (
      <Table
        selectionMode="multiple"
        selectionBehavior="toggle"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Owner</Column>
          <Column>Type</Column>
        </TableHeader>
        <TableBody>
          <Row id="1">
            <CellText title="Component Library" />
            <CellText title="Design System" />
            <CellText title="library" />
          </Row>
          <Row id="2">
            <CellText title="API Gateway" />
            <CellText title="Platform" />
            <CellText title="service" />
          </Row>
          <Row id="3">
            <CellText title="Documentation Site" />
            <CellText title="DevEx" />
            <CellText title="website" />
          </Row>
        </TableBody>
      </Table>
    );
  },
};

export const SelectionSingleReplace: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    return (
      <Table
        selectionMode="single"
        selectionBehavior="replace"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Owner</Column>
          <Column>Type</Column>
        </TableHeader>
        <TableBody>
          <Row id="1">
            <CellText title="Component Library" />
            <CellText title="Design System" />
            <CellText title="library" />
          </Row>
          <Row id="2">
            <CellText title="API Gateway" />
            <CellText title="Platform" />
            <CellText title="service" />
          </Row>
          <Row id="3">
            <CellText title="Documentation Site" />
            <CellText title="DevEx" />
            <CellText title="website" />
          </Row>
        </TableBody>
      </Table>
    );
  },
};

export const SelectionMultiReplace: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    return (
      <Table
        selectionMode="multiple"
        selectionBehavior="replace"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Owner</Column>
          <Column>Type</Column>
        </TableHeader>
        <TableBody>
          <Row id="1">
            <CellText title="Component Library" />
            <CellText title="Design System" />
            <CellText title="library" />
          </Row>
          <Row id="2">
            <CellText title="API Gateway" />
            <CellText title="Platform" />
            <CellText title="service" />
          </Row>
          <Row id="3">
            <CellText title="Documentation Site" />
            <CellText title="DevEx" />
            <CellText title="website" />
          </Row>
        </TableBody>
      </Table>
    );
  },
};

export const SelectionToggleWithActions: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    return (
      <Table
        selectionMode="multiple"
        selectionBehavior="toggle"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        onRowAction={key => alert(`Opening ${key}`)}
      >
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Owner</Column>
          <Column>Type</Column>
        </TableHeader>
        <TableBody>
          <Row id="1">
            <CellText title="Component Library" />
            <CellText title="Design System" />
            <CellText title="library" />
          </Row>
          <Row id="2">
            <CellText title="API Gateway" />
            <CellText title="Platform" />
            <CellText title="service" />
          </Row>
          <Row id="3">
            <CellText title="Documentation Site" />
            <CellText title="DevEx" />
            <CellText title="website" />
          </Row>
        </TableBody>
      </Table>
    );
  },
};

export const SelectionReplaceWithActions: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    return (
      <Table
        selectionMode="multiple"
        selectionBehavior="replace"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        onRowAction={key => alert(`Opening ${key}`)}
      >
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Owner</Column>
          <Column>Type</Column>
        </TableHeader>
        <TableBody>
          <Row id="1">
            <CellText title="Component Library" />
            <CellText title="Design System" />
            <CellText title="library" />
          </Row>
          <Row id="2">
            <CellText title="API Gateway" />
            <CellText title="Platform" />
            <CellText title="service" />
          </Row>
          <Row id="3">
            <CellText title="Documentation Site" />
            <CellText title="DevEx" />
            <CellText title="website" />
          </Row>
        </TableBody>
      </Table>
    );
  },
};

export const SelectionToggleWithLinks: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    return (
      <Table
        selectionMode="multiple"
        selectionBehavior="toggle"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Owner</Column>
          <Column>Type</Column>
        </TableHeader>
        <TableBody>
          <Row id="1" href="https://example.com/library">
            <CellText title="Component Library" />
            <CellText title="Design System" />
            <CellText title="library" />
          </Row>
          <Row id="2" href="https://example.com/gateway">
            <CellText title="API Gateway" />
            <CellText title="Platform" />
            <CellText title="service" />
          </Row>
          <Row id="3" href="https://example.com/docs">
            <CellText title="Documentation Site" />
            <CellText title="DevEx" />
            <CellText title="website" />
          </Row>
        </TableBody>
      </Table>
    );
  },
};

export const SelectionReplaceWithLinks: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    return (
      <Table
        selectionMode="multiple"
        selectionBehavior="replace"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Owner</Column>
          <Column>Type</Column>
        </TableHeader>
        <TableBody>
          <Row id="1" href="https://example.com/library">
            <CellText title="Component Library" />
            <CellText title="Design System" />
            <CellText title="library" />
          </Row>
          <Row id="2" href="https://example.com/gateway">
            <CellText title="API Gateway" />
            <CellText title="Platform" />
            <CellText title="service" />
          </Row>
          <Row id="3" href="https://example.com/docs">
            <CellText title="Documentation Site" />
            <CellText title="DevEx" />
            <CellText title="website" />
          </Row>
        </TableBody>
      </Table>
    );
  },
};

export const SelectionWithDisabledRows: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    return (
      <Table
        selectionMode="multiple"
        selectionBehavior="toggle"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        disabledKeys={['2']}
      >
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Owner</Column>
          <Column>Type</Column>
        </TableHeader>
        <TableBody>
          <Row id="1">
            <CellText title="Component Library" />
            <CellText title="Design System" />
            <CellText title="library" />
          </Row>
          <Row id="2">
            <CellText title="API Gateway (Disabled)" />
            <CellText title="Platform" />
            <CellText title="service" />
          </Row>
          <Row id="3">
            <CellText title="Documentation Site" />
            <CellText title="DevEx" />
            <CellText title="website" />
          </Row>
        </TableBody>
      </Table>
    );
  },
};

export const SelectionWithPagination: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    const { data, paginationProps } = useTable({
      data: data1,
      pagination: {
        defaultPageSize: 5,
      },
    });

    return (
      <>
        <Table
          selectionMode="multiple"
          selectionBehavior="toggle"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <TableHeader>
            <Column isRowHeader>Name</Column>
            <Column>Owner</Column>
            <Column>Type</Column>
          </TableHeader>
          <TableBody>
            {data?.map(item => (
              <Row key={item.name} id={item.name}>
                <CellText title={item.name} />
                <CellText title={item.owner.name} />
                <CellText title={item.type} />
              </Row>
            ))}
          </TableBody>
        </Table>
        <TablePagination {...paginationProps} />
      </>
    );
  },
};

export const SelectionModePlayground: Story = {
  render: () => {
    const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>(
      'multiple',
    );
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    return (
      <Flex direction="column" gap="8">
        <Table
          selectionMode={selectionMode}
          selectionBehavior="toggle"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <TableHeader>
            <Column isRowHeader>Name</Column>
            <Column>Owner</Column>
            <Column>Type</Column>
          </TableHeader>
          <TableBody>
            <Row id="1">
              <CellText title="Component Library" />
              <CellText title="Design System" />
              <CellText title="library" />
            </Row>
            <Row id="2">
              <CellText title="API Gateway" />
              <CellText title="Platform" />
              <CellText title="service" />
            </Row>
            <Row id="3">
              <CellText title="Documentation Site" />
              <CellText title="DevEx" />
              <CellText title="website" />
            </Row>
          </TableBody>
        </Table>
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
              setSelectedKeys(new Set([]));
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
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    return (
      <Flex direction="column" gap="8">
        <Table
          selectionMode="multiple"
          selectionBehavior={selectionBehavior}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <TableHeader>
            <Column isRowHeader>Name</Column>
            <Column>Owner</Column>
            <Column>Type</Column>
          </TableHeader>
          <TableBody>
            <Row id="1">
              <CellText title="Component Library" />
              <CellText title="Design System" />
              <CellText title="library" />
            </Row>
            <Row id="2">
              <CellText title="API Gateway" />
              <CellText title="Platform" />
              <CellText title="service" />
            </Row>
            <Row id="3">
              <CellText title="Documentation Site" />
              <CellText title="DevEx" />
              <CellText title="website" />
            </Row>
          </TableBody>
        </Table>
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
              setSelectedKeys(new Set([]));
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
