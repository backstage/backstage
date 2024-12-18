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
import {
  listResponsiveValues,
  argTypesSpacing,
  argTypesColor,
} from '../../../docs/utils/argTypes';
import { boxProperties } from './sprinkles.css';
import { Stack } from '../Stack';
import { Inline } from '../Inline';

const argTypesBox = Object.keys(boxProperties.styles).reduce<
  Record<string, any>
>((acc, n) => {
  acc[n] = {
    control: 'select',
    options: listResponsiveValues(n as keyof typeof boxProperties.styles),
  };
  return acc;
}, {});

const meta = {
  title: 'Components/Box',
  component: Box,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    ...argTypesSpacing,
    ...argTypesColor,
    ...argTypesBox,
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

export const Basic: Story = {
  args: {
    style: {
      background: '#1f47ff',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
    },
    children: 'Basic Box',
  },
};

export const Display: Story = {
  args: {
    style: {
      ...Basic.args?.style,
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
      ...Basic.args?.style,
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
      ...Basic.args?.style,
      width: '200px',
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
      ...Basic.args?.style,
      width: '200px',
      height: '100px',
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

export const Nested: Story = {
  render: () => (
    <Box padding="lg" background="background">
      <Box padding="md" background="background">
        Header
      </Box>
      <Box
        display="flex"
        padding="md"
        background="background"
        justifyContent="space-between"
      >
        <Box padding="xs" background="background">
          Sidebar
        </Box>
        <Box padding="xs" background="background">
          Main Content
        </Box>
      </Box>
      <Box padding="md" background="background">
        Footer
      </Box>
    </Box>
  ),
};

export const Alignment: Story = {
  render: () => (
    <Box
      display="flex"
      padding="lg"
      background="background"
      justifyContent="center"
      alignItems="center"
      style={{ height: '200px' }}
    >
      <Box padding="md" background="background">
        Centered Content
      </Box>
    </Box>
  ),
};

// Example showing different spacing combinations
export const Spacing: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="md">
      <Box padding="xs" background="background">
        Small Padding
      </Box>
      <Box padding="md" background="background">
        Medium Padding
      </Box>
      <Box padding="lg" background="background">
        Large Padding
      </Box>
      <Box paddingX="lg" paddingY="xs" background="background">
        Mixed Padding
      </Box>
    </Box>
  ),
};

// Example showing different display values
export const DisplayVariants: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="md">
      <Box padding="md" background="background" display="block">
        Display Block
      </Box>
      <Box padding="md" background="background" display="flex">
        Display Flex
      </Box>
      <Box padding="md" background="background" display="inline">
        Display Inline
      </Box>
    </Box>
  ),
};
