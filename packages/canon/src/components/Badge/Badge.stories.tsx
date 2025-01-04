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
import { Badge } from './Badge';
import { Inline } from '../Inline';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sx', 'sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'tertiary',
        'neutral',
        'error',
        'warning',
        'success',
        'info',
      ],
    },
  },
  args: {
    size: 'md',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary badge',
  },
};

export const Outline: Story = {
  args: {},
  render: () => (
    <Inline>
      <Badge outline color="default">
        Default
      </Badge>
      <Badge outline color="primary">
        Primary
      </Badge>
      <Badge outline color="secondary">
        Secondary
      </Badge>
      <Badge outline color="tertiary">
        Tertiary
      </Badge>
      <Badge outline color="neutral">
        Neutral
      </Badge>
    </Inline>
  ),
};

export const Colors: Story = {
  args: {},
  render: () => (
    <Inline>
      <Badge color="default">Default</Badge>
      <Badge color="primary">Primary</Badge>
      <Badge color="secondary">Secondary</Badge>
      <Badge color="tertiary">Tertiary</Badge>
      <Badge color="neutral">Neutral</Badge>
      <Badge color="error">Error</Badge>
      <Badge color="warning">Warning</Badge>
      <Badge color="success">Success</Badge>
      <Badge color="info">Info</Badge>
    </Inline>
  ),
};

export const Sizes: Story = {
  args: {},
  render: () => (
    <Inline alignY="center">
      <Badge size="lg">Large</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="xs">Extra small</Badge>
    </Inline>
  ),
};

export const Empty: Story = {
  args: {
    color: 'primary',
  },
  render: args => (
    <Inline alignY="center">
      <Badge size="lg" color={args.color} />
      <Badge size="md" color={args.color} />
      <Badge size="sm" color={args.color} />
      <Badge size="xs" color={args.color} />
    </Inline>
  ),
};
