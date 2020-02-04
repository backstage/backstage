import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import { wrapInThemedTestApp } from 'testUtils';
import { JsonForm } from './index';

const testSchema = [
  {
    id: 'text_min_max',
    title: 'Min Max Text',
    type: 'text',
    description: 'min max for strings',
    validators: [
      { type: 'required' },
      {
        type: 'string-range',
        min: 7,
        max: 19,
      },
    ],
    defaultValue: '',
  },
  {
    id: 'regexp-input',
    title: 'Enter email',
    type: 'text',
    description: 'your valid spotify email',
    validators: [
      { type: 'required' },
      {
        type: 'regex',
        match: '^\\S+@spotify\\.com$',
        message: 'Must be a valid spotify email address',
      },
    ],
    defaultValue: '',
  },
  {
    id: 'a-number',
    title: 'A number',
    type: 'number',
    description: 'Description of the number',
    validators: [
      {
        type: 'number-range',
        min: 5,
        max: 99,
        message: 'Min max number error',
      },
    ],
    defaultValue: '',
  },
  {
    id: 'a-select',
    title: 'A select',
    type: 'select',
    description: 'Description of the select',
    values: [
      { label: 'Select option 1', value: 'select 1' },
      { label: 'Select option 2', value: 'select 2' },
      { label: 'Select option 3', value: 'select 3' },
    ],
    defaultValue: 'option 2',
  },
  {
    id: 'a-checkbox',
    title: 'A Checkbox',
    type: 'checkbox',
    description: 'Description of the checkbox',
    checked: true,
  },
  {
    id: 'a-radiogroup',
    title: 'A radiogroup',
    type: 'radiogroup',
    description: 'Description of the radiogroup',
    values: [
      { label: 'Radio option 1', value: 'radio 1' },
      { label: 'Radio option 2', value: 'radio 2' },
      { label: 'Radio option 3', value: 'radio 3' },
    ],
    defaultValue: 'radio 3',
  },
];

describe('<JsonForm/>', () => {
  it('Renders a form from json correctly', async () => {
    const mockCallback = jest.fn();
    const rendered = render(wrapInThemedTestApp(<JsonForm schema={testSchema} onSubmit={mockCallback} />));

    testSchema.forEach(schema => {
      expect(rendered.getByLabelText(schema.title, { exact: false })).toBeInTheDocument();
    });
  });

  it('Validates with given validator', async () => {
    const mockCallback = jest.fn();
    const rendered = render(wrapInThemedTestApp(<JsonForm schema={[testSchema[0]]} onSubmit={mockCallback} />));

    const input = rendered.getByLabelText('Min Max Text', { exact: false });
    fireEvent.change(input, { target: { value: 'my' } });

    await waitForElement(() => rendered.getByText('Input must be at least 7 characters'));

    fireEvent.change(input, { target: { value: 'my perfect input' } });

    // Only one of the fields that have validators is filled. The form submit button should be disabled.
    const btn = rendered.getByText('Submit').parentElement;
    expect(btn.disabled).toBeTruthy();
  });
});
