/*
 * Copyright 2024 The Backstage Authors
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

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './Grid';
import type { GridItemProps } from './types';
import { Box } from '../Box/Box';
import { Flex } from '../Flex';

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  argTypes: {
    children: {
      control: false,
    },
    className: {
      control: 'text',
    },
  },
  args: {
    gap: '4',
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const FakeBox = () => (
  <Box
    style={{
      background: '#eaf2fd',
      borderRadius: '4px',
      boxShadow: '0 0 0 1px #2563eb',
      height: '64px',
      backgroundImage:
        'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")',
    }}
  />
);

export const Default: Story = {
  args: {},
  render: args => (
    <Grid {...args}>
      <FakeBox />
      <FakeBox />
      <FakeBox />
    </Grid>
  ),
};

export const LargeGap: Story = {
  args: {
    gap: '64px',
  },
  render: args => (
    <Grid {...args}>
      <FakeBox />
      <FakeBox />
      <FakeBox />
    </Grid>
  ),
};

export const ColumnSizes: Story = {
  args: {
    columns: '12',
  },
  render: args => (
    <Flex gap="4">
      {Array.from({ length: 11 }, (_, i) => (
        <Grid {...args} key={i}>
          <Grid.Item colSpan={String(i + 1) as GridItemProps['colSpan']}>
            <FakeBox />
          </Grid.Item>
          <Grid.Item colSpan={String(11 - i) as GridItemProps['colSpan']}>
            <FakeBox />
          </Grid.Item>
        </Grid>
      ))}
    </Flex>
  ),
};

export const RowAndColumns: Story = {
  args: {
    columns: '12',
  },
  render: args => (
    <Flex gap="4">
      <Grid {...args} columns="3">
        <Grid.Item colSpan="1" rowSpan="2">
          <Box
            style={{
              height: '100%',
              background: '#eaf2fd',
              borderRadius: '4px',
              boxShadow: '0 0 0 1px #2563eb',
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
        </Grid.Item>
        <Grid.Item colSpan="2">
          <FakeBox />
        </Grid.Item>
        <Grid.Item colSpan="2">
          <FakeBox />
        </Grid.Item>
      </Grid>
    </Flex>
  ),
};
