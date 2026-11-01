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
import { render, fireEvent, act, screen } from '@testing-library/react';
import validator from '@rjsf/validator-ajv8';
import { Form } from './Form';

const schema = {
  type: 'object' as const,
  properties: {
    name: { type: 'string' as const, title: 'Name' },
  },
};

describe('Form with BUI theme', () => {
  it('should render titles and descriptions of nested objects', async () => {
    render(
      <Form
        validator={validator}
        EXPERIMENTAL_theme="bui"
        schema={{
          type: 'object',
          title: 'Step title',
          description: 'Step description',
          properties: {
            additionalInformation: {
              type: 'object',
              title: 'Additional Information (optional)',
              description: 'Additional contact details',
              properties: {
                contact: {
                  type: 'object',
                  title: 'Contact',
                  description: 'Contact information',
                  properties: {
                    slackChannelID: { type: 'string', title: 'Slack channel' },
                  },
                },
              },
            },
          },
        }}
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Additional Information (optional)',
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Additional contact details'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Contact' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Contact information')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Slack channel' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Step title')).not.toBeInTheDocument();
    expect(screen.queryByText('Step description')).not.toBeInTheDocument();
  });

  it('should omit array item headings while rendering nested object headings', async () => {
    render(
      <Form
        validator={validator}
        EXPERIMENTAL_theme="bui"
        schema={{
          type: 'object',
          properties: {
            contacts: {
              type: 'array',
              title: 'Contacts',
              items: {
                type: 'object',
                title: 'Contact item',
                description: 'Array item description',
                properties: {
                  details: {
                    type: 'object',
                    title: 'Contact details',
                    description: 'Details for this contact',
                    properties: {
                      name: { type: 'string', title: 'Contact name' },
                    },
                  },
                },
              },
            },
          },
        }}
        formData={{ contacts: [{ details: { name: 'Alice' } }] }}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Contacts' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Contact item' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Array item description'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Contact details' }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Details for this contact'),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Contact name' })).toHaveValue(
      'Alice',
    );
  });

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
