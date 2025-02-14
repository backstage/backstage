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
import { mockApis, MockErrorApi, TestApiProvider } from '@backstage/test-utils';
import { translationApiRef } from '@backstage/core-plugin-api/alpha';
import { errorApiRef } from '@backstage/core-plugin-api';

describe('<MaxDepthFilter/>', () => {
  test('should display current value', () => {
    render(
      <TestApiProvider
        apis={[
          [translationApiRef, mockApis.translation()],
          [errorApiRef, new MockErrorApi()],
        ]}
      >
        <MaxDepthFilter value={5} onChange={() => {}} />
      </TestApiProvider>,
    );

    expect(screen.getByLabelText('maxp')).toBeInTheDocument();
    expect(screen.getByLabelText('maxp')).toHaveValue(5);
  });

  test('should display infinite if non finite', () => {
    render(
      <TestApiProvider
        apis={[
          [translationApiRef, mockApis.translation()],
          [errorApiRef, new MockErrorApi()],
        ]}
      >
        <MaxDepthFilter value={Number.POSITIVE_INFINITY} onChange={() => {}} />
      </TestApiProvider>,
    );

    expect(screen.getByPlaceholderText(/Infinite/)).toBeInTheDocument();
    expect(screen.getByLabelText('maxp')).toHaveValue(null);
  });

  test('should clear max depth', async () => {
    const onChange = jest.fn();
    render(
      <TestApiProvider
        apis={[
          [translationApiRef, mockApis.translation()],
          [errorApiRef, new MockErrorApi()],
        ]}
      >
        <MaxDepthFilter value={10} onChange={onChange} />
      </TestApiProvider>,
    );

    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText('clear max depth'));
    expect(onChange).toHaveBeenCalledWith(Number.POSITIVE_INFINITY);
  });

  test('should set max depth to undefined if below one', async () => {
    const onChange = jest.fn();
    render(
      <TestApiProvider
        apis={[
          [translationApiRef, mockApis.translation()],
          [errorApiRef, new MockErrorApi()],
        ]}
      >
        <MaxDepthFilter value={1} onChange={onChange} />
      </TestApiProvider>,
    );

    await user.clear(screen.getByLabelText('maxp'));
    await user.type(screen.getByLabelText('maxp'), '0');

    expect(onChange).toHaveBeenCalledWith(Number.POSITIVE_INFINITY);
  });

  test('should select direction', async () => {
    let value = 5;
    render(
      <TestApiProvider
        apis={[
          [translationApiRef, mockApis.translation()],
          [errorApiRef, new MockErrorApi()],
        ]}
      >
        <MaxDepthFilter
          value={value}
          onChange={v => {
            value = v;
          }}
        />
      </TestApiProvider>,
    );

    expect(screen.getByLabelText('maxp')).toHaveValue(5);
    expect(value).toBe(5);

    await user.clear(screen.getByLabelText('maxp'));
    expect(value).toBe(Number.POSITIVE_INFINITY);
    await user.type(screen.getByLabelText('maxp'), '10');
    expect(value).toBe(10);
  });
});
