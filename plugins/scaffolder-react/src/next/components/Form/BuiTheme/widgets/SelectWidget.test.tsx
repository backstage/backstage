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
import { render, screen, fireEvent, act } from '@testing-library/react';
import validator from '@rjsf/validator-ajv8';
import { Form } from '../../Form';

describe('BUI SelectWidget', () => {
  it('should render a single-select dropdown', () => {
    render(
      <Form
        EXPERIMENTAL_theme="bui"
        validator={validator}
        schema={{
          type: 'object',
          properties: {
            color: {
              type: 'string',
              title: 'Color',
              enum: ['red', 'green', 'blue'],
            },
          },
        }}
      />,
    );

    expect(screen.getByText('Color')).toBeInTheDocument();
  });

  it('should render a multi-select dropdown when schema uses array with uniqueItems', () => {
    render(
      <Form
        EXPERIMENTAL_theme="bui"
        validator={validator}
        schema={{
          type: 'object',
          properties: {
            environments: {
              title: 'Target Environments',
              type: 'array',
              uniqueItems: true,
              items: {
                type: 'string',
                enum: ['development', 'staging', 'production'],
              },
            },
          },
        }}
      />,
    );

    expect(screen.getByText('Target Environments')).toBeInTheDocument();
  });

  it('should select options and update form state for multi-select', () => {
    const onChange = jest.fn();

    render(
      <Form
        EXPERIMENTAL_theme="bui"
        validator={validator}
        schema={{
          type: 'object',
          properties: {
            environments: {
              title: 'Environments',
              type: 'array',
              uniqueItems: true,
              items: {
                type: 'string',
                enum: ['development', 'staging', 'production'],
              },
            },
          },
        }}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Environments/i }));

    // Select first option
    fireEvent.click(screen.getByRole('option', { name: 'development' }));
    expect(onChange).toHaveBeenCalled();
    expect(
      onChange.mock.calls[onChange.mock.calls.length - 1][0].formData
        .environments,
    ).toEqual(['development']);

    // Select second option
    fireEvent.click(screen.getByRole('option', { name: 'staging' }));
    expect(
      onChange.mock.calls[onChange.mock.calls.length - 1][0].formData
        .environments,
    ).toEqual(['development', 'staging']);

    // Deselect one option
    fireEvent.click(screen.getByRole('option', { name: 'development' }));
    expect(
      onChange.mock.calls[onChange.mock.calls.length - 1][0].formData
        .environments,
    ).toEqual(['staging']);

    // Clear the selection
    fireEvent.click(screen.getByRole('option', { name: 'staging' }));
    expect(
      onChange.mock.calls[onChange.mock.calls.length - 1][0].formData
        .environments,
    ).toEqual([]);
  });

  it('should pass actual enum values to blur and focus callbacks for single-select', async () => {
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    render(
      <Form
        EXPERIMENTAL_theme="bui"
        validator={validator}
        schema={{
          type: 'object',
          properties: {
            color: {
              type: 'string',
              title: 'Color',
              enum: ['red', 'green', 'blue'],
            },
          },
        }}
        formData={{ color: 'green' }}
        onBlur={onBlur}
        onFocus={onFocus}
      />,
    );

    const button = screen.getByRole('button', { name: /Color/i });

    await act(async () => {
      button.focus();
    });
    expect(onFocus).toHaveBeenCalledWith('root_color', 'green');

    await act(async () => {
      fireEvent.blur(button);
    });
    expect(onBlur).toHaveBeenCalledWith('root_color', 'green');
  });

  it('should pass actual enum values to blur and focus callbacks for multi-select', async () => {
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    render(
      <Form
        EXPERIMENTAL_theme="bui"
        validator={validator}
        schema={{
          type: 'object',
          properties: {
            environments: {
              title: 'Environments',
              type: 'array',
              uniqueItems: true,
              items: {
                type: 'string',
                enum: ['development', 'staging', 'production'],
              },
            },
          },
        }}
        formData={{ environments: ['development', 'staging'] }}
        onBlur={onBlur}
        onFocus={onFocus}
      />,
    );

    const button = screen.getByRole('button', { name: /Environments/i });

    await act(async () => {
      button.focus();
    });
    expect(onFocus).toHaveBeenCalledWith('root_environments', [
      'development',
      'staging',
    ]);

    await act(async () => {
      fireEvent.blur(button);
    });
    expect(onBlur).toHaveBeenCalledWith('root_environments', [
      'development',
      'staging',
    ]);
  });
});
