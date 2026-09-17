/*
 * Copyright 2022 The Backstage Authors
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
import { render, fireEvent, act } from '@testing-library/react';
import validator from '@rjsf/validator-ajv8';
import { Form } from '../../Form';

describe('BUI BaseInputTemplate', () => {
  it('should render a text input', () => {
    const { container } = render(
      <Form
        EXPERIMENTAL_theme="bui"
        validator={validator}
        schema={{
          type: 'object',
          properties: {
            name: { type: 'string', title: 'Name' },
          },
        }}
      />,
    );

    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('should handle onChange', async () => {
    const onChange = jest.fn();

    const { container } = render(
      <Form
        EXPERIMENTAL_theme="bui"
        validator={validator}
        schema={{
          type: 'object',
          properties: {
            name: { type: 'string', title: 'Name' },
          },
        }}
        onChange={onChange}
      />,
    );

    const input = container.querySelector('input')!;

    await act(async () => {
      fireEvent.change(input, { target: { value: 'hello' } });
    });

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.formData).toEqual({ name: 'hello' });
  });

  it('should show invalid state when there are validation errors', async () => {
    const { container } = render(
      <Form
        EXPERIMENTAL_theme="bui"
        validator={validator}
        schema={{
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 3 },
          },
        }}
        formData={{ name: 'a' }}
        liveValidate
      />,
    );

    const input = container.querySelector('input')!;
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should render label via FieldTemplate, not the widget itself', () => {
    const { queryByText } = render(
      <Form
        EXPERIMENTAL_theme="bui"
        validator={validator}
        schema={{
          type: 'object',
          properties: {
            name: {
              type: 'string',
              title: 'My Field Title',
              description: 'A helpful description',
            },
          },
        }}
      />,
    );

    expect(queryByText('My Field Title')).toBeInTheDocument();
  });
});
