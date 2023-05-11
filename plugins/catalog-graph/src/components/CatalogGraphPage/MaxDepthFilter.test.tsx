/*
 * Copyright 2021 The Backstage Authors
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

import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import React from 'react';
import { MaxDepthFilter } from './MaxDepthFilter';

describe('<MaxDepthFilter/>', () => {
  test('should display current value', () => {
    render(<MaxDepthFilter value={5} onChange={() => {}} />);

    expect(screen.getByLabelText('maxp')).toBeInTheDocument();
    expect(screen.getByLabelText('maxp')).toHaveValue(5);
  });

  test('should display infinite if non finite', () => {
    render(
      <MaxDepthFilter value={Number.POSITIVE_INFINITY} onChange={() => {}} />,
    );

    expect(screen.getByPlaceholderText(/Infinite/)).toBeInTheDocument();
    expect(screen.getByLabelText('maxp')).toHaveValue(null);
  });

  test('should clear max depth', async () => {
    const onChange = jest.fn();
    render(<MaxDepthFilter value={10} onChange={onChange} />);

    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText('clear max depth'));
    expect(onChange).toHaveBeenCalledWith(Number.POSITIVE_INFINITY);
  });

  test('should set max depth to undefined if below one', async () => {
    const onChange = jest.fn();
    render(<MaxDepthFilter value={1} onChange={onChange} />);

    await user.clear(screen.getByLabelText('maxp'));
    await user.type(screen.getByLabelText('maxp'), '0');

    expect(onChange).toHaveBeenCalledWith(Number.POSITIVE_INFINITY);
  });

  test('should select direction', async () => {
    let value = 5;
    render(
      <MaxDepthFilter
        value={value}
        onChange={v => {
          value = v;
        }}
      />,
    );

    expect(screen.getByLabelText('maxp')).toHaveValue(5);
    expect(value).toBe(5);

    await user.clear(screen.getByLabelText('maxp'));
    expect(value).toBe(Number.POSITIVE_INFINITY);
    await user.type(screen.getByLabelText('maxp'), '10');
    expect(value).toBe(10);
  });
});
