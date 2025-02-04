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
import { Box } from './Box';
import { Flex } from '../Flex';

const meta = {
  title: 'Components/Box',
  component: Box,
  argTypes: {
    as: {
      control: { type: 'select' },
      options: ['div', 'span', 'article', 'section'],
    },
    children: {
      control: false,
    },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

const Card = () => {
  return (
    <div
      style={{
        width: '64px',
        height: '64px',
        background: '#eaf2fd',
        borderRadius: '4px',
        border: '1px solid #2563eb',
        color: '#2563eb',
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")',
      }}
    />
  );
};

export const Default: Story = {
  args: {
    children: <Card />,
    display: 'inline',
  },
};

const CardDisplay = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div
      style={{
        padding: '8px',
        background: '#eaf2fd',
        borderRadius: '4px',
        border: '1px solid #2563eb',
        color: '#2563eb',
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")',
      }}
    >
      {children}
    </div>
  );
};

export const Display: Story = {
  render: args => (
    <Flex direction="column" align="center">
      <Flex>
        <Box display="block" {...args}>
          <CardDisplay>Block</CardDisplay>
        </Box>
        <Box display="inline" {...args}>
          <CardDisplay>Inline</CardDisplay>
        </Box>
        <Box display="none" {...args}>
          <CardDisplay>None</CardDisplay>
        </Box>
      </Flex>
      <Box display={{ initial: 'block', md: 'inline' }} {...args}>
        <CardDisplay>Responsive</CardDisplay>
      </Box>
    </Flex>
  ),
};

const styleInsideBox = {
  background: 'rgb(196, 202, 251)',
  color: 'white',
  borderRadius: '4px',
};

export const Padding: Story = {
  args: {
    style: {
      background: '#1f47ff',
      color: 'white',
      borderRadius: '4px',
      padding: '12px 12px',
    },
  },
  render: args => (
    <Flex direction="column" align="center" gap="4">
      <Flex gap="4" align="center">
        <Box p="3" style={styleInsideBox}>
          <Box {...args}>Padding</Box>
        </Box>
        <Box px="3" style={styleInsideBox}>
          <Box {...args}>Padding X</Box>
        </Box>
        <Box py="3" style={styleInsideBox}>
          <Box {...args}>Padding Y</Box>
        </Box>
      </Flex>
      <Flex gap="4" align="center">
        <Box pt="3" style={styleInsideBox}>
          <Box {...args}>Padding Top</Box>
        </Box>
        <Box pr="3" style={styleInsideBox}>
          <Box {...args}>Padding Right</Box>
        </Box>
        <Box pb="3" style={styleInsideBox}>
          <Box {...args}>Padding Bottom</Box>
        </Box>
        <Box pl="3" style={styleInsideBox}>
          <Box {...args}>Padding Left</Box>
        </Box>
      </Flex>
    </Flex>
  ),
};

export const Margin: Story = {
  args: {
    style: {
      background: '#1f47ff',
      color: 'white',
      borderRadius: '4px',
      padding: '12px 12px',
    },
  },
  render: args => (
    <Flex direction="column" align="center" gap="4">
      <Flex align="center" gap="4">
        <Box style={styleInsideBox}>
          <Box m="3" {...args}>
            Margin
          </Box>
        </Box>
        <Box style={styleInsideBox}>
          <Box mx="3" {...args}>
            Margin X
          </Box>
        </Box>
        <Box style={styleInsideBox}>
          <Box my="3" {...args}>
            Margin Y
          </Box>
        </Box>
      </Flex>
      <Flex align="center" gap="4">
        <Box style={styleInsideBox}>
          <Box mt="3" {...args}>
            Margin Top
          </Box>
        </Box>
        <Box style={styleInsideBox}>
          <Box mr="3" {...args}>
            Margin Right
          </Box>
        </Box>
        <Box style={styleInsideBox}>
          <Box mb="3" {...args}>
            Margin Bottom
          </Box>
        </Box>
        <Box style={styleInsideBox}>
          <Box ml="3" {...args}>
            Margin Left
          </Box>
        </Box>
      </Flex>
    </Flex>
  ),
};
