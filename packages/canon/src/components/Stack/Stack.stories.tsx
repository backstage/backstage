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
import { Box } from '../Box/Box';
import { argTypesSpacing, argTypesColor } from '../../../docs/utils/argTypes';

const meta = {
  title: 'Components/Stack',
  component: Stack,
  argTypes: {
    ...argTypesSpacing,
    ...argTypesColor,
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
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const FakeBox = () => (
  <Box
    paddingX="xl"
    paddingY="md"
    borderRadius="small"
    style={{ background: '#1f47ff', color: 'white' }}
  >
    Fake Box
  </Box>
);

export const Default: Story = {
  args: {
    children: (
      <>
        <FakeBox />
        <FakeBox />
        <FakeBox />
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

export const ResponsiveAlign: Story = {
  args: {
    ...Default.args,
    align: {
      xs: 'left',
      md: 'center',
      lg: 'right',
    },
  },
};

export const ResponsiveGap: Story = {
  args: {
    ...Default.args,
    gap: {
      xs: 'xs',
      md: 'md',
      lg: 'xxl',
    },
  },
};

export const LargeGap: Story = {
  args: {
    ...Default.args,
    gap: 'xl',
  },
};
