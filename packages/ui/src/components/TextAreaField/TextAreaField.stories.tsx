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
import { TextAreaField } from './TextAreaField';
import { Form } from 'react-aria-components';
import { Flex } from '../Flex';

const meta = preview.meta({
  title: 'Backstage UI/TextAreaField',
  component: TextAreaField,
  argTypes: {
    isRequired: {
      control: 'boolean',
    },
  },
});

export const Default = meta.story({
  args: {
    name: 'message',
    placeholder: 'Enter a message',
    style: {
      maxWidth: '300px',
    },
  },
});

export const WithLabel = meta.story({
  args: {
    ...Default.input.args,
    label: 'Message',
  },
});

export const WithDescription = meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Share as much detail as you like.',
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

export const Sizes = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex direction="column" gap="4" style={{ maxWidth: '300px' }}>
      <TextAreaField {...args} size="small" label="Small" />
      <TextAreaField {...args} size="medium" label="Medium" />
    </Flex>
  ),
});

export const Scrolling = meta.story({
  args: {
    ...WithLabel.input.args,
    rows: 3,
    defaultValue: Array.from(
      { length: 12 },
      (_, i) => `Line ${i + 1}: this content scrolls within a fixed height.`,
    ).join('\n'),
  },
});

export const ShowError = meta.story({
  args: {
    ...WithLabel.input.args,
  },
  render: args => (
    <Form validationErrors={{ message: 'Message is required' }}>
      <TextAreaField {...args} />
    </Form>
  ),
});
