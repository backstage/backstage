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
import { NumberField } from './NumberField';
import { Form, I18nProvider } from 'react-aria-components';
import { Icon } from '../Icon';
import { Flex } from '../Flex';
import { FieldLabel } from '../FieldLabel';

const meta = {
  title: 'Backstage UI/NumberField',
  component: NumberField,
  argTypes: {
    isRequired: {
      control: 'boolean',
    },
    icon: {
      control: 'object',
    },
  },
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'amount',
    placeholder: 'Enter a value',
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
      <NumberField {...args} size="small" icon={<Icon name="sparkling" />} />
      <NumberField {...args} size="medium" icon={<Icon name="sparkling" />} />
    </Flex>
  ),
};

export const DefaultValue: Story = {
  args: {
    ...Default.args,
    defaultValue: 100,
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

export const WithCustomLocale: Story = {
  args: {
    ...Default.args,
    label: 'Number rendered with locale "de-DE"',
    value: 1234.56,
  },
  render: args => (
    <I18nProvider locale="de-DE">
      <NumberField {...args} />
    </I18nProvider>
  ),
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
    <NumberField
      {...args}
      placeholder="Enter a number"
      size="small"
      icon={<Icon name="eye" />}
    />
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
    <Form validationErrors={{ amount: 'Invalid value' }}>
      <NumberField {...args} />
    </Form>
  ),
};

export const Restrictions: Story = {
  args: {
    ...WithLabel.args,
    placeholder: 'Enter an integer value between 0 and 100',
    minValue: 0,
    maxValue: 100,
    step: 1,
  },
};

export const Validation: Story = {
  args: {
    ...WithLabel.args,
    placeholder: `You'd better not enter 42`,
    validate: value =>
      value === 42 ? `I can't believe you've done this` : null,
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
      <NumberField
        id="custom-field"
        aria-labelledby="custom-field-label"
        name="custom-field"
        defaultValue={50}
      />
    </>
  ),
};
