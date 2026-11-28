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

import { screen } from '@testing-library/react';
import { useState } from 'react';
import user from '@testing-library/user-event';
import { MaxDepthFilter } from './MaxDepthFilter';
import { renderInTestApp } from '@backstage/test-utils';

describe('<MaxDepthFilter/>', () => {
  test('should display the current value', async () => {
    await renderInTestApp(<MaxDepthFilter value={5} onChange={() => {}} />);

    expect(screen.getByRole('textbox', { name: 'Max depth' })).toHaveValue('5');
  });

  test('should display infinite if non finite', async () => {
    await renderInTestApp(
      <MaxDepthFilter value={Number.POSITIVE_INFINITY} onChange={() => {}} />,
    );

    expect(screen.getByPlaceholderText(/Infinite/)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Max depth' })).toHaveValue('');
  });

  test('should report the entered depth, and infinite when cleared', async () => {
    const onChange = jest.fn();
    const Controlled = () => {
      const [value, setValue] = useState(5);
      return (
        <MaxDepthFilter
          value={value}
          onChange={v => {
            setValue(v);
            onChange(v);
          }}
        />
      );
    };
    await renderInTestApp(<Controlled />);

    const input = screen.getByRole('textbox', { name: 'Max depth' });
    expect(onChange).not.toHaveBeenCalled();

    await user.clear(input);
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(Number.POSITIVE_INFINITY);

    await user.type(input, '10');
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(10);
    expect(input).toHaveValue('10');
  });

  test('should treat a committed zero as unlimited depth', async () => {
    const onChange = jest.fn();
    await renderInTestApp(<MaxDepthFilter value={3} onChange={onChange} />);

    const input = screen.getByRole('textbox', { name: 'Max depth' });
    await user.clear(input);
    await user.type(input, '0');
    await user.tab();

    expect(onChange).toHaveBeenLastCalledWith(Number.POSITIVE_INFINITY);
  });
});
