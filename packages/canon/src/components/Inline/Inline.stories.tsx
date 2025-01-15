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
import { Inline } from './Inline';
import { Box } from '../Box/Box';

const meta = {
  title: 'Components/Inline',
  component: Inline,
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
    },
    alignY: {
      control: 'inline-radio',
      options: ['top', 'center', 'bottom'],
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
    children: 'hello world',
  },
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

const fakeBlockList = [
  { width: 45, height: 60 },
  { width: 150, height: 75 },
  { width: 80, height: 50 },
  { width: 120, height: 70 },
  { width: 95, height: 65 },
  { width: 80, height: 32 },
  { width: 130, height: 60 },
  { width: 100, height: 80 },
  { width: 140, height: 45 },
  { width: 85, height: 70 },
  { width: 125, height: 50 },
];

const FakeBox = ({
  width = 120,
  height = 80,
}: {
  width?: number;
  height?: number;
}) => (
  <Box
    borderRadius="xs"
    style={{
      background: '#eaf2fd',
      borderRadius: '4px',
      boxShadow: '0 0 0 1px #2563eb',
      width,
      height,
      backgroundImage:
        'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")',
    }}
  />
);

export const Default: Story = {
  render: () => (
    <Inline>
      {fakeBlockList.map((block, index) => (
        <FakeBox key={index} width={block.width} height={block.height} />
      ))}
    </Inline>
  ),
};

export const AlignLeft: Story = {
  args: {
    align: 'left',
  },
};

export const AlignCenter: Story = {
  args: {
    align: 'center',
  },
};

export const AlignRight: Story = {
  args: {
    align: 'right',
  },
};

export const VerticalAlignTop: Story = {
  args: {
    alignY: 'top',
  },
};

export const VerticalAlignCenter: Story = {
  args: {
    alignY: 'center',
  },
};

export const VerticalAlignBottom: Story = {
  args: {
    alignY: 'bottom',
  },
};

export const LargeGap: Story = {
  args: {
    gap: 'xl',
  },
};
