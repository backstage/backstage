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
import { render } from '@testing-library/react';
import validator from '@rjsf/validator-ajv8';
import { Form } from '../../Form';


describe('BUI FieldTemplate', () => {
  it('should render the field label', () => {
    const { getByText } = render(
        <Form
          EXPERIMENTAL_theme="bui"
          validator={validator}
          schema={{
            type: 'object',
            properties: {
              name: { type: 'string', title: 'Full Name' },
            },
          }}
        />,
    );

    expect(getByText('Full Name')).toBeInTheDocument();
  });

  it('should show Required when field is required', () => {
    const { getByText } = render(
        <Form
          EXPERIMENTAL_theme="bui"
          validator={validator}
          schema={{
            type: 'object',
            required: ['name'],
            properties: {
              name: { type: 'string', title: 'Full Name' },
            },
          }}
        />,
    );

    expect(getByText(/Required/)).toBeInTheDocument();
  });

  it('should render the description as markdown', () => {
    const { container } = render(
        <Form
          EXPERIMENTAL_theme="bui"
          validator={validator}
          schema={{
            type: 'object',
            properties: {
              name: {
                type: 'string',
                title: 'Full Name',
                description: 'Enter your **full** name',
              },
            },
          }}
        />,
    );

    const strong = container.querySelector('strong');
    expect(strong).toBeInTheDocument();
    expect(strong?.textContent).toBe('full');
  });

  it('should hide the field when ui:widget is hidden', () => {
    const { container } = render(
        <Form
          EXPERIMENTAL_theme="bui"
          validator={validator}
          schema={{
            type: 'object',
            properties: {
              secret: { type: 'string', title: 'Secret Field' },
            },
          }}
          uiSchema={{
            secret: { 'ui:widget': 'hidden' },
          }}
        />,
    );

    // Hidden fields should not have a visible input
    const inputs = container.querySelectorAll('input[type="text"]');
    expect(inputs.length).toBe(0);
  });

  it('should render validation errors', () => {
    const { getAllByText } = render(
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

    // The error shows up both in the top-level ErrorListTemplate and inline via FieldErrorTemplate
    const errorMessages = getAllByText(
      /must NOT have fewer than 3 characters/i,
    );
    expect(errorMessages.length).toBeGreaterThanOrEqual(1);
  });
});
