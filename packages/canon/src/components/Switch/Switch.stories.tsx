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
import { Inline } from '../Inline';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Toggle me',
  },
};

export const Sizes: Story = {
  args: {},
  render: () => (
    <Inline alignY="center">
      <Switch size="extra-small" />
      <Switch size="small" />
      <Switch size="medium" />
      <Switch size="large" />
    </Inline>
  ),
};

export const LabelPlacement: Story = {
  args: {},
  render: () => (
    <Inline gap="xl" alignY="center">
      <Switch labelPlacement="top" label="Label Placement" />
      <Switch labelPlacement="bottom" label="Label Placement" />
      <Switch labelPlacement="left" label="Label Placement" />
      <Switch labelPlacement="right" label="Label Placement" />
    </Inline>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked',
    checked: true,
  },
};

export const Icons: Story = {
  args: {
    iconStart: 'check',
    iconEnd: 'close',
  },
};

export const Responsive: Story = {
  args: {
    size: {
      xs: 'small',
      sm: 'medium',
      md: 'large',
    },
  },
};
