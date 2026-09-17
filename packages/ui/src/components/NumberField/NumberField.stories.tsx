/*
 * Copyright 2026 The Backstage Authors
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
import { NumberField } from './NumberField';
import { Form } from 'react-aria-components';
import { Flex } from '../Flex';
import { Box } from '../Box';
import { Text } from '../Text';
import { FieldLabel } from '../FieldLabel';
import { RiTimeLine, RiSparklingLine } from '@remixicon/react';

const meta = preview.meta({
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
});

export const Default = meta.story({
  args: {
    name: 'quantity',
    placeholder: 'Enter a number',
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
      <NumberField {...args} size="small" icon={<RiSparklingLine />} />
      <NumberField {...args} size="medium" icon={<RiSparklingLine />} />
    </Flex>
  ),
});

export const DefaultValue = meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 42,
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
  render: args => <NumberField {...args} size="small" icon={<RiTimeLine />} />,
});

export const DisabledWithIcon = WithIcon.extend({
  args: {
    isDisabled: true,
  },
});

export const ShowError = meta.story({
  args: {
    ...WithLabel.input.args,
  },
  render: args => (
    <Form validationErrors={{ quantity: 'Value is out of range' }}>
      <NumberField {...args} />
    </Form>
  ),
});

export const Validation = meta.story({
  args: {
    ...WithLabel.input.args,
    validate: (value: number) => (value < 0 ? 'Must be positive' : null),
  },
});

export const MinMaxStep = meta.story({
  args: {
    ...Default.input.args,
    label: 'Minutes',
    minValue: 0,
    maxValue: 59,
    step: 1,
  },
  render: args => (
    <NumberField
      {...args}
      icon={<RiTimeLine />}
      style={{ maxWidth: '200px' }}
    />
  ),
});

export const CustomField = meta.story({
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
        defaultValue={10}
      />
    </>
  ),
});

export const StepIncrement = meta.story({
  args: {
    ...WithLabel.input.args,
    label: 'Quantity',
    defaultValue: 5,
    minValue: 0,
    maxValue: 20,
    step: 5,
  },
  render: args => <NumberField {...args} style={{ maxWidth: '200px' }} />,
});

export const AutoBg = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <div style={{ maxWidth: '600px' }}>
        NumberField automatically detects its parent bg context and increments
        the neutral level by 1. No prop is needed — it's fully automatic.
      </div>
      <Box bg="neutral" p="4">
        <Text>Neutral 1 container</Text>
        <Flex mt="2" style={{ maxWidth: '300px' }}>
          <NumberField
            aria-label="Number"
            placeholder="Enter number"
            size="small"
          />
        </Flex>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral" p="4">
          <Text>Neutral 2 container</Text>
          <Flex mt="2" style={{ maxWidth: '300px' }}>
            <NumberField
              aria-label="Number"
              placeholder="Enter number"
              size="small"
            />
          </Flex>
        </Box>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral">
          <Box bg="neutral" p="4">
            <Text>Neutral 3 container</Text>
            <Flex mt="2" style={{ maxWidth: '300px' }}>
              <NumberField
                aria-label="Number"
                placeholder="Enter number"
                size="small"
              />
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
  ),
});
