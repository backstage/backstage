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

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';
import { Form } from '@base-ui-components/react/form';
import { Button } from '../Button';
import { userEvent, waitFor, within, expect } from '@storybook/test';
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
    <Flex direction="row" gap="4">
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

async function submitForm(value: string) {
  // Mimic a server response
  await new Promise(resolve => {
    setTimeout(resolve, 200);
  });

  try {
    const url = new URL(value);

    if (url.hostname.endsWith('example.com')) {
      return { error: 'The example domain is not allowed' };
    }
  } catch {
    return { error: 'This is not a valid URL' };
  }

  return { success: true };
}

export const ShowErrorOnSubmit: Story = {
  args: {
    ...WithLabel.args,
    pattern: 'https?://.*',
    type: 'url',
    required: true,
    label: 'Homepage',
  },
  decorators: [
    Story => {
      const [errors, setErrors] = useState({});
      const [loading, setLoading] = useState(false);

      return (
        <Form
          errors={errors}
          onClearErrors={setErrors}
          onSubmit={async event => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const value = formData.get('url') as string;

            setLoading(true);
            const response = await submitForm(value);
            const serverErrors = {
              url: response.error,
            };

            setErrors(serverErrors);
            setLoading(false);
          }}
        >
          <Story />
          <Button
            type="submit"
            disabled={loading}
            size="small"
            style={{ marginTop: '0.75rem' }}
          >
            Submit
          </Button>
        </Form>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText('Homepage', {
      selector: 'input',
    });

    await userEvent.type(input, 'https://example.com', {
      delay: 20,
    });

    const submitButton = canvas.getByRole('button');

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        canvas.getByText('The example domain is not allowed'),
      ).toBeInTheDocument();
    });
  },
};
