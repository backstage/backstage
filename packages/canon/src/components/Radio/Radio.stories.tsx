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
import { Radio } from './Radio';
import { Inline } from '../Inline';
import { Stack } from '../Stack';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
  args: {
    size: 'medium',
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: 'radio-group',
    groupLabel: 'Radio group',
    options: ['Option 1', 'Option 2', 'Option 3'],
  },
};

export const Sizes: Story = {
  args: {
    name: 'radio-sizes',
    options: ['Option 1', 'Option 2'],
  },
  render: args => (
    <Inline alignY="center" gap="lg">
      <Radio
        groupLabel="small"
        name={args.name}
        size="small"
        options={args.options}
      />
      <Radio
        groupLabel="medium"
        name={args.name}
        size="medium"
        options={args.options}
      />
      <Radio
        groupLabel="large"
        name={args.name}
        size="large"
        options={args.options}
      />
    </Inline>
  ),
};

export const LabelPlacement: Story = {
  args: {
    name: 'radio-label-placement',
    options: ['Option 1', 'Option 2'],
  },
  render: args => (
    <Inline alignY="center" gap="xl">
      <Radio
        groupLabel="start"
        name={args.name}
        optionsLabelPlacement="start"
        options={args.options}
      />
      <Radio
        groupLabel="top"
        name={args.name}
        optionsLabelPlacement="top"
        options={args.options}
      />
      <Radio
        groupLabel="bottom"
        name={args.name}
        optionsLabelPlacement="bottom"
        options={args.options}
      />
      <Radio
        groupLabel="end"
        name={args.name}
        optionsLabelPlacement="end"
        options={args.options}
      />
    </Inline>
  ),
};

export const Responsive: Story = {
  args: {
    name: 'radio-responsive',
    options: ['Option 1', 'Option 2'],
  },
  render: args => (
    <Stack gap="xl">
      <Radio
        groupLabel="responsive"
        name={args.name}
        size={{ xs: 'small', md: 'medium', lg: 'large' }}
        options={args.options}
      />
    </Stack>
  ),
};

export const Disabled: Story = {
  args: {
    name: 'radio-disabled',
    value: 'Option 1',
    options: ['Option 1', 'Option 2'],
    disabled: true,
  },
};
