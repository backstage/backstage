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
  args: {
    as: 'div',
    background: 'elevation1',
    borderRadius: 'small',
    children: 'Basic Box',
    display: 'block',
    padding: 'sm',
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};

export const Responsive: Story = {
  render: () => (
    <Box
      display={{ xs: 'block', sm: 'flex' }}
      padding={{ xs: 'xs', sm: 'md', lg: 'lg' }}
      background="background"
    >
      Responsive Box
    </Box>
  ),
};

export const FlexContainer: Story = {
  render: () => (
    <Box
      display="flex"
      flexDirection="column"
      padding="lg"
      background="background"
    >
      <Box padding="md" background="background" color="primary">
        Item 1
      </Box>
      <Box padding="md" background="background" color="primary">
        Item 2
      </Box>
      <Box padding="md" background="background" color="primary">
        Item 3
      </Box>
    </Box>
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
