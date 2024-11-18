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
import { Box } from './box';

const meta = {
  title: 'Components/Box',
  component: Box,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Box padding="medium" background="background">
      Basic Box
    </Box>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Box
      display={{ xs: 'block', sm: 'flex' }}
      padding={{ xs: 'small', sm: 'medium', lg: 'large' }}
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
      padding="large"
      background="background"
    >
      <Box padding="medium" background="background">
        Item 1
      </Box>
      <Box padding="medium" background="background">
        Item 2
      </Box>
      <Box padding="medium" background="background">
        Item 3
      </Box>
    </Box>
  ),
};

export const Nested: Story = {
  render: () => (
    <Box padding="large" background="background">
      <Box padding="medium" background="background">
        Header
      </Box>
      <Box
        display="flex"
        padding="medium"
        background="background"
        justifyContent="space-between"
      >
        <Box padding="small" background="background">
          Sidebar
        </Box>
        <Box padding="small" background="background">
          Main Content
        </Box>
      </Box>
      <Box padding="medium" background="background">
        Footer
      </Box>
    </Box>
  ),
};

export const Alignment: Story = {
  render: () => (
    <Box
      display="flex"
      padding="large"
      background="background"
      justifyContent="center"
      alignItems="center"
      style={{ height: '200px' }}
    >
      <Box padding="medium" background="background">
        Centered Content
      </Box>
    </Box>
  ),
};

// Example showing different spacing combinations
export const Spacing: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="medium">
      <Box padding="small" background="background">
        Small Padding
      </Box>
      <Box padding="medium" background="background">
        Medium Padding
      </Box>
      <Box padding="large" background="background">
        Large Padding
      </Box>
      <Box paddingX="large" paddingY="small" background="background">
        Mixed Padding
      </Box>
    </Box>
  ),
};

// Example showing different display values
export const DisplayVariants: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="medium">
      <Box padding="medium" background="background" display="block">
        Display Block
      </Box>
      <Box padding="medium" background="background" display="flex">
        Display Flex
      </Box>
      <Box padding="medium" background="background" display="inline">
        Display Inline
      </Box>
    </Box>
  ),
};
