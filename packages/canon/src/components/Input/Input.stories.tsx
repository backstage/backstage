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
import { Input } from './Input';
import { Inline } from '../Inline';

const meta = {
  title: 'Components/Input',
  component: Input,
  decorators: [
    Story => (
      <div style={{ maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Enter your name',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Name',
  },
};

export const WithDescription: Story = {
  args: {
    description: 'Visible on your profile',
  },
};

export const WithLabelAndDescription: Story = {
  args: {
    label: 'Name',
    description: 'Visible on your profile',
  },
};

export const Sizes: Story = {
  args: {
    label: 'Name',
    description: 'Visible on your profile',
  },
  render: args => (
    <Inline>
      <Input size="sm" {...args} />
      <Input size="md" {...args} />
    </Inline>
  ),
};

export const WithError: Story = {
  args: {
    invalid: true,
    validate: value => (value ? null : 'Please enter your name'),
    required: true,
    label: 'Name',
    description: 'Visible on your profile',
    error: 'Please enter your name',
  },
};
