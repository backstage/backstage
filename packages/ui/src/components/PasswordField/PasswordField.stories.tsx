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

import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordField } from './PasswordField';
import { Form } from 'react-aria-components';
import { Flex } from '../Flex';
import { FieldLabel } from '../FieldLabel';
import { RiSparklingLine } from '@remixicon/react';

const meta = {
  title: 'Backstage UI/PasswordField',
  component: PasswordField,
  argTypes: {
    isRequired: {
      control: 'boolean',
    },
    icon: {
      control: 'object',
    },
  },
} satisfies Meta<typeof PasswordField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'secret',
    placeholder: 'Enter a secret',
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
      <PasswordField {...args} size="small" icon={<RiSparklingLine />} />
      <PasswordField {...args} size="medium" icon={<RiSparklingLine />} />
    </Flex>
  ),
};

export const DefaultValue: Story = {
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
    isRequired: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    isDisabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <PasswordField {...args} size="small" icon={<RiSparklingLine />} />
  ),
};

export const DisabledWithIcon: Story = {
  args: {
    ...WithIcon.args,
    isDisabled: true,
  },
  render: WithIcon.render,
};

export const ShowError: Story = {
  args: {
    ...WithLabel.args,
  },
  render: args => (
    <Form validationErrors={{ secret: 'Invalid secret' }}>
      <PasswordField {...args} />
    </Form>
  ),
};

export const Validation: Story = {
  args: {
    ...WithLabel.args,
    validate: value => (value === 'admin' ? 'Nice try!' : null),
  },
};

export const CustomField: Story = {
  render: () => (
    <>
      <FieldLabel
        htmlFor="custom-field"
        id="custom-field-label"
        label="Custom Field"
      />
      <PasswordField
        id="custom-field"
        aria-labelledby="custom-field-label"
        name="custom-field"
        defaultValue="Custom Field"
      />
    </>
  ),
};
