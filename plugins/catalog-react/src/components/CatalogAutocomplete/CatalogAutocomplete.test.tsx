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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CatalogAutocomplete } from './CatalogAutocomplete';

describe('CatalogAutocomplete', () => {
  const user = userEvent.setup();
  const mockOptions = ['Option 1', 'Option 2', 'Option 3'];

  it('renders without exploding', () => {
    render(
      <CatalogAutocomplete
        name="test-autocomplete"
        options={mockOptions}
        label="Test Label"
      />,
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders the expand icon', () => {
    render(
      <CatalogAutocomplete
        name="test-autocomplete"
        options={mockOptions}
        label="Test Label"
      />,
    );
    const expandIcon = screen.getByTestId('test-autocomplete-expand');
    expect(expandIcon).toBeInTheDocument();
  });

  it('displays options when clicked', async () => {
    render(
      <CatalogAutocomplete
        name="test-autocomplete"
        options={mockOptions}
        label="Test Label"
      />,
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    mockOptions.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('supports required input', () => {
    render(
      <CatalogAutocomplete
        name="test-autocomplete"
        options={mockOptions}
        label="Test Label"
        TextFieldProps={{ required: true }}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('displays helper text when provided', () => {
    render(
      <CatalogAutocomplete
        name="test-autocomplete"
        options={mockOptions}
        label="Test Label"
        TextFieldProps={{ helperText: 'Helper text' }}
      />,
    );

    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(
      <CatalogAutocomplete name="test-autocomplete" options={mockOptions} />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('displays correct option on selection', async () => {
    render(
      <CatalogAutocomplete
        name="test-autocomplete"
        options={mockOptions}
        label="Test Label"
      />,
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    const optionToSelect = screen.getByText('Option 1');
    await user.click(optionToSelect);

    expect(input).toHaveValue('Option 1');
  });
});
