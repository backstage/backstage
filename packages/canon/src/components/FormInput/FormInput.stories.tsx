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
import { FormInput } from './FormInput';
import { Icon } from '../Icon';
import { Flex } from '../Flex';

const meta = {
  title: 'Forms/FormInput',
  component: FormInput,
  argTypes: {
    required: {
      control: 'boolean',
    },
    icon: {
      control: 'object',
    },
  },
} satisfies Meta<typeof FormInput>;

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

export const Sizes: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <Flex direction="row" gap="4" style={{ width: '100%', maxWidth: '600px' }}>
      <FormInput {...args} size="small" icon={<Icon name="sparkling" />} />
      <FormInput {...args} size="medium" icon={<Icon name="sparkling" />} />
    </Flex>
  ),
};

export const Filled: Story = {
  args: {
    ...Default.args,
    defaultValue: 'https://example.com',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    ...Default.args,
    placeholder: 'Search...',
    icon: <Icon name="search" />,
  },
};

export const DisabledWithIcon: Story = {
  args: {
    ...WithIcon.args,
    disabled: true,
  },
};
