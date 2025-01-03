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
import { Button } from './Button';
import { Inline } from '../Inline';
import { Stack } from '../Stack';
import { Text } from '../Text';
const meta = {
  title: 'Button',
  component: Button,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
  },
  args: {
    size: 'medium',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary button',
  },
};

export const Variants: Story = {
  args: {
    children: 'Button',
  },
  parameters: {
    argTypes: {
      variant: {
        control: false,
      },
    },
  },
  render: () => (
    <Inline alignY="center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
    </Inline>
  ),
};

export const Sizes: Story = {
  args: {
    children: 'Button',
  },
  render: () => (
    <Inline alignY="center">
      <Button size="medium">Medium</Button>
      <Button size="small">Small</Button>
    </Inline>
  ),
};

export const WithIcons: Story = {
  args: {
    children: 'Button',
  },
  render: args => (
    <Inline alignY="center">
      <Button {...args} iconStart="cloud" />
      <Button {...args} iconEnd="chevronRight" />
      <Button {...args} iconStart="cloud" iconEnd="chevronRight" />
    </Inline>
  ),
};

export const FullWidth: Story = {
  args: {
    children: 'Button',
  },
  render: args => (
    <Stack style={{ width: '300px' }}>
      <Button {...args} iconStart="cloud" />
      <Button {...args} iconEnd="chevronRight" />
      <Button {...args} iconStart="cloud" iconEnd="chevronRight" />
    </Stack>
  ),
};

export const Disabled: Story = {
  args: {
    children: 'Button',
    disabled: true,
  },
};

export const Responsive: Story = {
  args: {
    children: 'Button',
    variant: {
      xs: 'primary',
      sm: 'secondary',
      md: 'tertiary',
    },
    size: {
      xs: 'small',
      sm: 'medium',
    },
  },
};

export const Playground: Story = {
  args: {
    children: 'Button',
  },
  render: args => (
    <Stack>
      <Stack>
        <Text>Primary</Text>
        <Inline alignY="center">
          <Button {...args} iconStart="cloud" />
          <Button {...args} iconEnd="chevronRight" />
          <Button {...args} iconStart="cloud" iconEnd="chevronRight" />
        </Inline>
      </Stack>
    </Stack>
  ),
};
