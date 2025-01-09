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
import { Stack } from './Stack';

const meta = {
  title: 'Components/Stack',
  component: Stack,
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
    },
    children: {
      control: false,
    },
    as: {
      control: false,
    },
    className: {
      control: 'text',
    },
  },
  args: {
    align: 'left',
    gap: 'xs',
    children: 'hello world',
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const DecorativeBox = () => {
  return (
    <div
      style={{
        background: '#eaf2fd',
        borderRadius: '4px',
        boxShadow: '0 0 0 1px #2563eb',
        height: '32px',
        minWidth: '100px',
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")',
      }}
    />
  );
};

export const Default: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <Stack>
        <DecorativeBox />
        <DecorativeBox />
        <DecorativeBox />
      </Stack>
    </div>
  ),
};

export const AlignLeft: Story = {
  render: () => (
    <Stack align="left">
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Stack>
  ),
};

export const AlignCenter: Story = {
  render: () => (
    <Stack align="center">
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Stack>
  ),
};

export const AlignRight: Story = {
  render: () => (
    <Stack align="right">
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Stack>
  ),
};

export const ResponsiveAlign: Story = {
  render: () => (
    <Stack align={{ xs: 'left', md: 'center', lg: 'right' }}>
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Stack>
  ),
};

export const ResponsiveGap: Story = {
  render: () => (
    <Stack gap={{ xs: 'xs', md: 'md', lg: '2xl' }}>
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Stack>
  ),
};

export const LargeGap: Story = {
  render: () => (
    <Stack gap="xl">
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Stack>
  ),
};
