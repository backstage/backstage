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
import { validator } from '@internal/rjsf-validator';
import { Form } from '../../Form';

describe('BUI SelectWidget', () => {
  it('should render a single-select dropdown', () => {
    const onChange = jest.fn();

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
        onChange={onChange}
      />,
    );

    expect(screen.getByText('Color')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /Color/i });
    fireEvent.click(button);
    fireEvent.click(screen.getByRole('option', { name: 'red' }));
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        formData: expect.objectContaining({ color: 'red' }),
      }),
      expect.anything(),
    );

    fireEvent.click(button);
    fireEvent.click(screen.getByRole('option', { name: 'Select an option' }));
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        formData: { color: undefined },
      }),
      expect.anything(),
    );
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
            ports: {
              title: 'Ports',
              type: 'array',
              uniqueItems: true,
              items: {
                type: 'number',
                enum: [80, 443, 8080],
              },
            },
          },
        }}
        onChange={onChange}
      />,
    );

    const envButton = screen.getByRole('button', { name: /Environments/i });
    fireEvent.click(envButton);

    // Select first option
    fireEvent.click(screen.getByRole('option', { name: 'development' }));
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        formData: expect.objectContaining({ environments: ['development'] }),
      }),
      expect.anything(),
    );

    // Select second option
    fireEvent.click(screen.getByRole('option', { name: 'staging' }));
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        formData: expect.objectContaining({
          environments: ['development', 'staging'],
        }),
      }),
      expect.anything(),
    );

    // Deselect one option
    fireEvent.click(screen.getByRole('option', { name: 'development' }));
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        formData: expect.objectContaining({ environments: ['staging'] }),
      }),
      expect.anything(),
    );

    // Clear the selection
    fireEvent.click(screen.getByRole('option', { name: 'staging' }));
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        formData: expect.objectContaining({ environments: [] }),
      }),
      expect.anything(),
    );

    // Close the environments dropdown before opening ports
    fireEvent.keyDown(screen.getByRole('listbox'), {
      key: 'Escape',
      code: 'Escape',
    });
    if (screen.queryByRole('dialog')) {
      fireEvent.pointerDown(document.body);
      fireEvent.click(document.body);
    }

    // Select numeric enum options
    const portsButton = screen.getByRole('button', { name: /Ports/i });
    fireEvent.click(portsButton);

    fireEvent.click(screen.getByRole('option', { name: '80' }));
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        formData: expect.objectContaining({ ports: [80] }),
      }),
      expect.anything(),
    );

    fireEvent.click(screen.getByRole('option', { name: '443' }));
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        formData: expect.objectContaining({ ports: [80, 443] }),
      }),
      expect.anything(),
    );
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
