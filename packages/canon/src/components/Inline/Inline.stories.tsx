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
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

const fakeBlockList = [
  { width: 45, height: 60 },
  { width: 150, height: 75 },
  { width: 80, height: 50 },
  { width: 120, height: 70 },
  { width: 95, height: 65 },
  { width: 110, height: 55 },
  { width: 130, height: 60 },
  { width: 100, height: 80 },
  { width: 140, height: 45 },
  { width: 85, height: 70 },
  { width: 125, height: 50 },
  { width: 105, height: 75 },
  { width: 115, height: 65 },
  { width: 135, height: 55 },
  { width: 90, height: 60 },
  { width: 145, height: 80 },
  { width: 75, height: 45 },
  { width: 155, height: 70 },
  { width: 60, height: 50 },
  { width: 160, height: 75 },
  { width: 70, height: 65 },
  { width: 150, height: 55 },
  { width: 95, height: 60 },
  { width: 120, height: 80 },
  { width: 85, height: 45 },
  { width: 130, height: 70 },
  { width: 100, height: 50 },
  { width: 140, height: 75 },
  { width: 110, height: 65 },
  { width: 125, height: 55 },
  { width: 105, height: 60 },
  { width: 145, height: 80 },
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
    style={{ background: '#1f47ff', color: 'white', width, height }}
  />
);

export const Default: Story = {
  args: {
    children: (
      <>
        {fakeBlockList.map((block, index) => (
          <FakeBox key={index} width={block.width} height={block.height} />
        ))}
      </>
    ),
  },
};

export const AlignLeft: Story = {
  args: {
    ...Default.args,
    align: 'left',
  },
};

export const AlignCenter: Story = {
  args: {
    ...Default.args,
    align: 'center',
  },
};

export const AlignRight: Story = {
  args: {
    ...Default.args,
    align: 'right',
  },
};

export const VerticalAlignTop: Story = {
  args: {
    ...Default.args,
    alignY: 'top',
  },
};

export const VerticalAlignCenter: Story = {
  args: {
    ...Default.args,
    alignY: 'center',
  },
};

export const VerticalAlignBottom: Story = {
  args: {
    ...Default.args,
    alignY: 'bottom',
  },
};

export const LargeGap: Story = {
  args: {
    ...Default.args,
    gap: 'xl',
  },
};
