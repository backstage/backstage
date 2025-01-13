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
import { Checkbox } from './Checkbox';
import { Inline } from '../Inline';
import { Stack } from '../Stack';
import { Text } from '../Text';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Inline alignY="center">
      <Checkbox />
      <Checkbox checked />
      <Checkbox label="Checkbox" />
      <Checkbox label="Checkbox" checked />
    </Inline>
  ),
};

export const Playground: Story = {
  render: () => (
    <Stack>
      <Text>All variants</Text>
      <Inline alignY="center">
        <Checkbox />
        <Checkbox checked />
        <Checkbox label="Checkbox" />
        <Checkbox label="Checkbox" checked />
      </Inline>
    </Stack>
  ),
};
