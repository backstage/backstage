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

import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';
import { Flex } from '../Flex';

const meta = {
  title: 'Components/TextField',
  component: TextField,
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'url',
    placeholder: 'Enter a URL',
    style: {
      maxWidth: '300px',
    },
  },
};

export const Filled: Story = {
  args: {
    ...Default.args,
    defaultValue: 'https://example.com',
  },
};

export const WithLabel: Story = {
  args: {
    ...Default.args,
    label: 'Label',
  },
};

export const WithDescription: Story = {
  args: {
    ...WithLabel.args,
    description: 'Description',
  },
};

export const Required: Story = {
  args: {
    ...WithLabel.args,
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    ...WithLabel.args,
    disabled: true,
  },
};

export const Sizes: Story = {
  args: {
    ...Default.args,
    label: 'Label',
    description: 'Description',
  },
  render: args => (
    <Flex direction="row" gap="4" style={{ width: '100%', maxWidth: '600px' }}>
      <TextField {...args} size="small" />
      <TextField {...args} size="medium" />
    </Flex>
  ),
};

export const Responsive: Story = {
  args: {
    ...WithLabel.args,
    size: {
      initial: 'small',
      sm: 'medium',
    },
  },
};

export const WithError: Story = {
  args: {
    ...WithLabel.args,
    error: 'Invalid URL',
  },
};

export const WithErrorAndDescription: Story = {
  args: {
    ...WithLabel.args,
    error: 'Invalid URL',
    description: 'Description',
  },
};
