/*
 * Copyright 2025 The Backstage Authors
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

import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';
import { Flex } from '../Flex';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  argTypes: {
    rounded: {
      control: 'boolean',
    },
    width: {
      control: 'number',
    },
    height: {
      control: 'number',
    },
  },
  args: {
    width: 80,
    height: 24,
    rounded: false,
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Rounded: Story = {
  args: {
    rounded: true,
    width: 48,
    height: 48,
  },
};

export const Demo1: Story = {
  render: () => (
    <Flex gap="4">
      <Skeleton rounded width={48} height={48} />
      <Flex direction="column" gap="4">
        <Skeleton width={200} height={8} />
        <Skeleton width={200} height={8} />
        <Skeleton width={200} height={8} />
        <Flex gap="4">
          <Skeleton width="100%" height={8} />
          <Skeleton width="100%" height={8} />
        </Flex>
      </Flex>
    </Flex>
  ),
};

export const Demo2: Story = {
  render: () => (
    <Flex direction="column" gap="4">
      <Skeleton width={400} height={160} />
      <Skeleton width={400} height={12} />
      <Skeleton width={240} height={12} />
    </Flex>
  ),
};
