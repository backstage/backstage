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
import { argTypesSpacing, argTypesColor } from '../../../docs/utils/argTypes';

const meta = {
  title: 'Components/Inline',
  component: Inline,
  argTypes: {
    ...argTypesSpacing,
    ...argTypesColor,
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

const FakeBox = ({
  width = 120,
  height = 80,
}: {
  width?: number;
  height?: number;
}) => (
  <Box
    borderRadius="small"
    style={{ background: '#1f47ff', color: 'white', width, height }}
  />
);

export const Default: Story = {
  args: {
    children: (
      <>
        {Array.from({ length: 32 }).map((_, index) => (
          <FakeBox
            key={index}
            width={Math.floor(Math.random() * (160 - 40 + 1)) + 40}
            height={Math.floor(Math.random() * (80 - 40 + 1)) + 40}
          />
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
