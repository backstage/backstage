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
import { Form } from './Form';

const schema = {
  type: 'object' as const,
  properties: {
    name: { type: 'string' as const, title: 'Name' },
  },
};

describe('Form with BUI theme', () => {
  it('should render without crashing when theme is bui', () => {
    const { container } = render(
      <Form validator={validator} schema={schema} EXPERIMENTAL_theme="bui" />,
    );

    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('should not render MUI-specific elements when theme is bui', () => {
    const { container } = render(
      <Form validator={validator} schema={schema} EXPERIMENTAL_theme="bui" />,
    );

    const muiElements = container.querySelectorAll('[class*="MuiTextField"]');
    expect(muiElements.length).toBe(0);
  });

  it('should accept user input in BUI form fields', async () => {
    const onChange = jest.fn();

    const { container } = render(
      <Form
        validator={validator}
        schema={schema}
        EXPERIMENTAL_theme="bui"
        onChange={onChange}
      />,
    );

    const input = container.querySelector('input')!;
    expect(input).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(input, { target: { value: 'test value' } });
    });

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.formData).toEqual({ name: 'test value' });
  });

  it('should render MUI elements when theme is mui', () => {
    const { container } = render(
      <Form validator={validator} schema={schema} EXPERIMENTAL_theme="mui" />,
    );

    const muiElements = container.querySelectorAll('[class*="MuiTextField"]');
    expect(muiElements.length).toBeGreaterThan(0);
  });
});
