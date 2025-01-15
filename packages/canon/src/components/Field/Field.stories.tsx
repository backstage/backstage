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
import { Field } from './Field';
import { Input } from '../Input/Input';

const meta = {
  title: 'Components/Field',
  component: Field.Root,
} satisfies Meta<typeof Field.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Label</Field.Label>
      <Input />
      <Field.Error>Error</Field.Error>
    </Field.Root>
  ),
};

export const WithLabelAndDescription: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Label</Field.Label>
      <Input />
      <Field.Description>Description</Field.Description>
    </Field.Root>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field.Root
      validate={value =>
        value !== 'Backstage' ? 'Please enter a different name' : null
      }
      validationMode="onChange"
    >
      <Field.Label>Name</Field.Label>
      <Input />
      <Field.Description>
        An error will show if the value is not Backstage
      </Field.Description>
      <Field.Error match="customError">Error</Field.Error>
    </Field.Root>
  ),
};

export const WithValidity: Story = {
  render: () => (
    <Field.Root
      validate={value =>
        value !== 'Backstage' ? 'Please enter a different name' : null
      }
    >
      <Field.Label>Name</Field.Label>
      <Input />
      <Field.Description>
        An error will show if the value is not Backstage
      </Field.Description>
      <Field.Validity>
        {validityState => (
          <div>{validityState.value ? 'Not Backstage' : 'Backstage'}</div>
        )}
      </Field.Validity>
    </Field.Root>
  ),
};
