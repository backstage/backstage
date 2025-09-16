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
import preview from '../../../../../.storybook/preview';
import { SearchField } from './SearchField';
import { Form } from 'react-aria-components';
import { Icon } from '../Icon';
import { Flex } from '../Flex';
import { FieldLabel } from '../FieldLabel';
import { ButtonIcon } from '../ButtonIcon';
import { RiCactusLine } from '@remixicon/react';
import { Button } from '../Button';

const meta = preview.meta({
  title: 'Backstage UI/SearchField',
  component: SearchField,
  argTypes: {
    isRequired: {
      control: 'boolean',
    },
    icon: {
      control: 'object',
    },
    placeholder: {
      control: 'text',
    },
  },
});

export const Default = meta.story({
  args: {
    name: 'url',
    style: {
      maxWidth: '300px',
    },
  },
});

export const Sizes = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex direction="row" gap="4" style={{ width: '100%', maxWidth: '600px' }}>
      <SearchField {...args} size="small" />
      <SearchField {...args} size="medium" />
    </Flex>
  ),
});

export const DefaultValue = meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'https://example.com',
  },
});

export const WithLabel = meta.story({
  args: {
    ...Default.input.args,
    label: 'Label',
  },
});

export const WithDescription = meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Description',
  },
});

export const Required = meta.story({
  args: {
    ...WithLabel.input.args,
    isRequired: true,
  },
});

export const Disabled = meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true,
  },
});

export const WithIcon = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <SearchField
      {...args}
      placeholder="Enter a URL"
      size="small"
      icon={<Icon name="eye" />}
    />
  ),
});

export const DisabledWithIcon = meta.story({
  args: {
    ...WithIcon.input.args,
    isDisabled: true,
  },
});

export const ShowError = meta.story({
  args: {
    ...WithLabel.input.args,
  },
  render: args => (
    <Form validationErrors={{ url: 'Invalid URL' }}>
      <SearchField {...args} />
    </Form>
  ),
});

export const Validation = meta.story({
  args: {
    ...WithLabel.input.args,
    validate: value => (value === 'admin' ? 'Nice try!' : null),
  },
});

export const CustomField = meta.story({
  render: () => (
    <>
      <FieldLabel
        htmlFor="custom-field"
        id="custom-field-label"
        label="Custom Field"
      />
      <SearchField
        id="custom-field"
        aria-labelledby="custom-field-label"
        name="custom-field"
        defaultValue="Custom Field"
      />
    </>
  ),
});

export const StartCollapsed = meta.story({
  args: {
    ...Default.input.args,
    startCollapsed: true,
  },

  render: args => (
    <Flex direction="row" gap="4">
      <SearchField {...args} size="small" />
      <SearchField {...args} size="medium" />
    </Flex>
  ),
});

export const StartCollapsedWithButtons = meta.story({
  args: {
    ...StartCollapsed.input.args,
  },
  render: args => (
    <Flex direction="row" gap="2" style={{ width: '100%', maxWidth: '600px' }}>
      <SearchField {...args} size="small" />
      <ButtonIcon icon={<RiCactusLine />} size="small" variant="secondary" />
      <Button size="small" variant="secondary">
        Hello world
      </Button>
      <SearchField {...args} size="medium" />
      <ButtonIcon icon={<RiCactusLine />} size="medium" variant="secondary" />
      <Button size="medium" variant="secondary">
        Hello world
      </Button>
    </Flex>
  ),
});
