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
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  CellProfile as CellProfileBUI,
  useTable,
} from '.';
import { MemoryRouter } from 'react-router-dom';
import { data as data1 } from './mocked-data1';
import { data as data2 } from './mocked-data2';
import { data as data3 } from './mocked-data3';
import { data as data4 } from './mocked-data4';
import { RiCactusLine } from '@remixicon/react';
import { TablePagination } from '../TablePagination';

const meta = {
  title: 'Components/Table',
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta;

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
              <Cell
                title={item.name}
                leadingIcon={<RiCactusLine />}
                description={item.description}
              />
              <CellProfileBUI
                name={item.owner.name}
                src={item.owner.profilePicture}
                href={item.owner.link}
              />
              <Cell title={item.type} />
              <Cell title={item.lifecycle} />
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
                <Cell
                  title={item.name}
                  leadingIcon={<RiCactusLine />}
                  description={item.description}
                />
                <Cell title={item.owner.name} />
                <Cell title={item.type} />
                <Cell title={item.lifecycle} />
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
                <CellProfileBUI
                  name={item.name}
                  src={item.image}
                  href={item.website}
                />
                <Cell title={item.genre} />
                <Cell title={item.yearFormed.toString()} />
                <Cell title={item.albums.toString()} />
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
                <CellProfileBUI
                  name={item.name}
                  src={item.image}
                  href={item.website}
                />
                <Cell title={item.genre} />
                <Cell title={item.yearFormed.toString()} />
                <Cell title={item.albums.toString()} />
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
                <CellProfileBUI
                  name={item.name}
                  src={item.image}
                  href={item.website}
                />
                <Cell title={item.genre} />
                <Cell title={item.yearFormed.toString()} />
                <Cell title={item.albums.toString()} />
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
                <CellProfileBUI
                  name={item.name}
                  src={item.image}
                  href={item.website}
                />
                <Cell title={item.genre} />
                <Cell title={item.yearFormed.toString()} />
                <Cell title={item.albums.toString()} />
              </Row>
            ))}
          </TableBody>
        </Table>
        <TablePagination {...paginationProps} />
      </>
    );
  },
};

export const CellText: Story = {
  render: () => {
    return (
      <Table>
        <TableHeader>
          <Column isRowHeader>Name</Column>
        </TableHeader>
        <TableBody>
          {data2.map(item => (
            <Row key={item.name}>
              <Cell
                title={item.name}
                leadingIcon={item.icon}
                description={item.description}
              />
            </Row>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const CellProfile: Story = {
  render: () => {
    return (
      <Table>
        <TableHeader>
          <Column isRowHeader>Name</Column>
        </TableHeader>
        <TableBody>
          {data3.map(item => (
            <Row key={item.name}>
              <CellProfileBUI
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
