/*
 * Copyright 2020 The Backstage Authors
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

import { fireEvent, render, within } from '@testing-library/react';
import React from 'react';
import { SelectComponent as Select } from './Select';

const SELECT_ITEMS = [
  {
    label: 'test 1',
    value: 'test_1',
  },
  {
    label: 'test 2',
    value: 'test_2',
  },
];

const minProps = {
  onChange: jest.fn(),
  label: 'Default',
  placeholder: 'All results',
  items: SELECT_ITEMS,
};

describe('<Select />', () => {
  it('renders without exploding', async () => {
    const { getByText, getByTestId } = render(<Select {...minProps} />);

    expect(getByText('Default')).toBeInTheDocument();
    const input = getByTestId('select');
    expect(input.textContent).toBe('All results');

    // Simulate click on input
    fireEvent.mouseDown(within(input).getByRole('button'));

    expect(getByText('test 1')).toBeInTheDocument();
    const option = getByText('test 1');

    // Simulate click on option
    fireEvent.click(option);
    expect(input.textContent).toBe('test 1');
  });

  it('display nothing when placeholder is empty string and items updated to none', () => {
    const initialValue = 'initial';
    const initialItems = [{ label: initialValue, value: initialValue }];
    const { getByTestId, rerender } = render(
      <Select
        {...minProps}
        items={initialItems}
        selected={initialValue}
        placeholder=""
      />,
    );

    expect(getByTestId('select').textContent).toBe(initialValue);

    rerender(<Select {...minProps} items={[]} selected="" placeholder="" />);

    expect(getByTestId('select').textContent).toBe('');
  });

  it('display the placeholder value when selected props updated to undefined', async () => {
    const { getByTestId, rerender } = render(
      <Select {...minProps} selected="test_1" />,
    );

    expect(getByTestId('select').textContent).toBe('test 1');

    rerender(<Select {...minProps} selected={undefined} />);

    expect(getByTestId('select').textContent).toBe('All results');
  });

  it('should function correctly when a custom data-testid is provided', async () => {
    const { getByTestId } = render(
      <Select {...minProps} data-testid="custom-select" />,
    );
    const input = getByTestId('custom-select');
    expect(input.textContent).toBe('All results');
  });

  it('should not open dropdown when deleting Chip component from Select', () => {
    const items = [
      { value: 'test_1', label: 'test 1' },
      { value: 'test_2', label: 'test 2' },
    ];

    const handleChange = jest.fn();

    const { getByTestId, queryByText } = render(
      <Select
        label="Default"
        items={items}
        multiple
        selected={['test_1']} // Creates Chip Component initially
        onChange={handleChange}
        placeholder="All results"
      />,
    );

    // Verify Chip component exist
    const chip = getByTestId('chip');
    expect(chip).toBeInTheDocument();
    expect(chip.textContent).toContain('test 1');

    // Find cancel icon
    const cancelIcon = getByTestId('cancel-icon');
    expect(cancelIcon).toBeInTheDocument();

    // Verify dropdown is initially closed
    expect(queryByText('test 2')).not.toBeInTheDocument();

    // Fire mouseDown on Chip's CancelIcon that tests if onMouseDown={event => event.stopPropagation()} is working properly
    fireEvent.mouseDown(cancelIcon);

    // Verify dropdown is closed after mouseDown on Chip's CancelIcon
    expect(queryByText('test 2')).not.toBeInTheDocument();

    // Delete the Chip
    fireEvent.click(cancelIcon);

    // Verify dropdown is still closed after the removal of Chip
    expect(queryByText('test 2')).not.toBeInTheDocument();

    // Verify Chip is removed
    expect(chip).not.toBeInTheDocument();
    expect(queryByText('test 1')).not.toBeInTheDocument();

    // Verify we can still open the dropdown with a click on the select
    const selectInput = getByTestId('select');
    expect(selectInput.textContent).toBe('All results');

    // Simulate click on select
    fireEvent.mouseDown(within(selectInput).getByRole('button'));

    // Now dropdown should be open
    expect(queryByText('test 2')).toBeInTheDocument();
  });
});
