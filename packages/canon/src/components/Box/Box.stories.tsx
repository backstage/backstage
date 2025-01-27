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
import { Stack } from '../Stack';
import { Inline } from '../Inline';

const meta = {
  title: 'Components/Box',
  component: Box,
  parameters: {
    layout: 'centered',
  },
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

export const Default: Story = {
  args: {
    style: {
      width: '64px',
      height: '64px',
      background: '#eaf2fd',
      borderRadius: '4px',
      border: '1px solid #2563eb',
      color: '#2563eb',
      backgroundImage:
        'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")',
    },
  },
};

export const Display: Story = {
  args: {
    style: {
      ...Default.args?.style,
      width: 'auto',
      height: 'auto',
      padding: '8px',
    },
  },
  render: args => (
    <Stack align="center">
      <Inline>
        <Box display="block" {...args}>
          Block
        </Box>
        <Box display="flex" {...args}>
          Flex
        </Box>
        <Box display="inline" {...args}>
          Inline
        </Box>
        <Box display="none" {...args}>
          None
        </Box>
      </Inline>
      <Box display={{ xs: 'block', sm: 'flex', md: 'inline' }} {...args}>
        Responsive
      </Box>
    </Stack>
  ),
};

export const FlexDirection: Story = {
  args: {
    style: {
      ...Default.args?.style,
      width: 'auto',
      height: 'auto',
      padding: '8px',
    },
    display: 'flex',
    gap: 'xs',
  },
  render: args => (
    <Stack align="center">
      <Box flexDirection="row" {...args}>
        <span>Row</span>
        <span>Row</span>
      </Box>
      <Box flexDirection="column" {...args}>
        <span>Column</span>
        <span>Column</span>
      </Box>
      <Box flexDirection={{ xs: 'column', sm: 'row' }} {...args}>
        <span>Responsive</span>
        <span>Flex Direction</span>
      </Box>
    </Stack>
  ),
};

export const JustifyContent: Story = {
  args: {
    style: {
      ...Default.args?.style,
      width: '200px',
      height: 'auto',
      padding: '8px',
    },
    display: 'flex',
    gap: 'xs',
  },
  render: args => (
    <Stack>
      <Box justifyContent="start" {...args}>
        <span>Flex Start</span>
      </Box>
      <Box justifyContent="center" {...args}>
        <span>Center</span>
      </Box>
      <Box justifyContent="end" {...args}>
        <span>Flex End</span>
      </Box>
      <Box justifyContent="around" {...args}>
        <span>Space</span>
        <span>Around</span>
      </Box>
      <Box justifyContent="between" {...args}>
        <span>Space</span>
        <span>Between</span>
      </Box>
      <Box
        justifyContent={{
          xs: 'between',
          sm: 'around',
          md: 'start',
        }}
        {...args}
      >
        <span>Responsive</span>
        <span>Spacing</span>
      </Box>
    </Stack>
  ),
};

export const AlignItems: Story = {
  args: {
    style: {
      ...Default.args?.style,
      width: '200px',
      height: '100px',
      padding: '8px',
    },
    display: 'flex',
    gap: 'xs',
  },
  render: args => (
    <Stack>
      <Box alignItems="start" {...args}>
        <span>Flex Start</span>
      </Box>
      <Box alignItems="center" {...args}>
        <span>Center</span>
      </Box>
      <Box alignItems="end" {...args}>
        <span>Flex End</span>
      </Box>
      <Box
        alignItems={{
          xs: 'start',
          sm: 'center',
          md: 'end',
        }}
        {...args}
      >
        <span>Responsive</span>
        <span>Spacing</span>
      </Box>
    </Stack>
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
    <Stack align="center" gap="md">
      <Inline alignY="center" gap="md">
        <Box padding="md" style={styleInsideBox}>
          <Box {...args}>Padding</Box>
        </Box>
        <Box paddingX="md" style={styleInsideBox}>
          <Box {...args}>Padding X</Box>
        </Box>
        <Box paddingY="md" style={styleInsideBox}>
          <Box {...args}>Padding Y</Box>
        </Box>
      </Inline>
      <Inline alignY="center" gap="md">
        <Box paddingTop="md" style={styleInsideBox}>
          <Box {...args}>Padding Top</Box>
        </Box>
        <Box paddingRight="md" style={styleInsideBox}>
          <Box {...args}>Padding Right</Box>
        </Box>
        <Box paddingBottom="md" style={styleInsideBox}>
          <Box {...args}>Padding Bottom</Box>
        </Box>
        <Box paddingLeft="md" style={styleInsideBox}>
          <Box {...args}>Padding Left</Box>
        </Box>
      </Inline>
    </Stack>
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
    <Stack align="center" gap="md">
      <Inline alignY="center" gap="md">
        <Box style={styleInsideBox}>
          <Box margin="md" {...args}>
            Margin
          </Box>
        </Box>
        <Box style={styleInsideBox}>
          <Box marginX="md" {...args}>
            Margin X
          </Box>
        </Box>
        <Box style={styleInsideBox}>
          <Box marginY="md" {...args}>
            Margin Y
          </Box>
        </Box>
      </Inline>
      <Inline alignY="center" gap="md">
        <Box style={styleInsideBox}>
          <Box marginTop="md" {...args}>
            Margin Top
          </Box>
        </Box>
        <Box style={styleInsideBox}>
          <Box marginRight="md" {...args}>
            Margin Right
          </Box>
        </Box>
        <Box style={styleInsideBox}>
          <Box marginBottom="md" {...args}>
            Margin Bottom
          </Box>
        </Box>
        <Box style={styleInsideBox}>
          <Box marginLeft="md" {...args}>
            Margin Left
          </Box>
        </Box>
      </Inline>
    </Stack>
  ),
};

export const FlexWrap: Story = {
  args: {
    style: {
      ...Default.args?.style,
      width: '200px',
      height: 'auto',
      padding: '8px',
    },
    display: 'flex',
    gap: 'xs',
  },
  render: args => (
    <Stack align="center">
      <Box flexWrap="wrap" {...args}>
        <span>One</span>
        <span>Two</span>
        <span>Three</span>
        <span>Four</span>
        <span>Five</span>
        <span>Six</span>
      </Box>
      <Box flexWrap="nowrap" {...args}>
        <span>One</span>
        <span>Two</span>
        <span>Three</span>
        <span>Four</span>
        <span>Five</span>
        <span>Six</span>
      </Box>
      <Box flexWrap="wrap-reverse" {...args}>
        <span>One</span>
        <span>Two</span>
        <span>Three</span>
        <span>Four</span>
        <span>Five</span>
        <span>Six</span>
      </Box>
    </Stack>
  ),
};

export const BorderRadius: Story = {
  args: {
    style: {
      width: '64px',
      height: '64px',
      background: '#eaf2fd',
      border: '1px solid #2563eb',
      color: '#2563eb',
      backgroundImage:
        'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")',
      padding: '4px 8px',
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  render: args => (
    <Inline align="center">
      <Box borderRadius="2xs" {...args}>
        <span>2xs</span>
      </Box>
      <Box borderRadius="xs" {...args}>
        <span>xs</span>
      </Box>
      <Box borderRadius="sm" {...args}>
        <span>sm</span>
      </Box>
      <Box borderRadius="md" {...args}>
        <span>md</span>
      </Box>
      <Box borderRadius="xl" {...args}>
        <span>xl</span>
      </Box>
      <Box borderRadius="2xl" {...args}>
        <span>2xl</span>
      </Box>
    </Inline>
  ),
};

export const Border: Story = {
  args: {
    style: {
      background: 'var(--canon-bg-elevated)',
      color: 'var(--canon-fg-text-primary)',
      padding: '4px 8px',
      width: '80px',
      height: '32px',
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'xs',
  },
  render: args => (
    <Inline align="center">
      <Box border="base" {...args}>
        Base
      </Box>
      <Box border="error" {...args}>
        Error
      </Box>
      <Box border="warning" {...args}>
        Warning
      </Box>
      <Box border="selected" {...args}>
        Selected
      </Box>
      <Box border="none" {...args}>
        None
      </Box>
    </Inline>
  ),
};
