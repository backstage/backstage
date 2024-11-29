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
});
