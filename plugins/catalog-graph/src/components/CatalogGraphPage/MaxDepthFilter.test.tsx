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
import user from '@testing-library/user-event';
import { MaxDepthFilter } from './MaxDepthFilter';
import {
  mockApis,
  renderInTestApp,
  TestApiRegistry,
} from '@backstage/test-utils';
import { catalogGraphApiRef, DefaultCatalogGraphApi } from '../../api';
import { ApiProvider } from '@backstage/core-app-api';

describe('<MaxDepthFilter/>', () => {
  const config = mockApis.config();
  const apis: TestApiRegistry = TestApiRegistry.from([
    catalogGraphApiRef,
    new DefaultCatalogGraphApi({ config }),
  ]);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <ApiProvider apis={apis}>{children}</ApiProvider>;
  }

  test('should display current value', async () => {
    await renderInTestApp(
      <Wrapper>
        <MaxDepthFilter value={5} onChange={() => {}} />
      </Wrapper>,
    );

    expect(screen.getByLabelText('maxp')).toBeInTheDocument();
    expect(screen.getByLabelText('maxp')).toHaveValue(5);
  });

  test('should display infinite if non finite', async () => {
    await renderInTestApp(
      <Wrapper>
        <MaxDepthFilter value={Number.POSITIVE_INFINITY} onChange={() => {}} />
      </Wrapper>,
    );

    expect(screen.getByPlaceholderText(/Infinite/)).toBeInTheDocument();
    expect(screen.getByLabelText('maxp')).toHaveValue(null);
  });

  test('should clear max depth', async () => {
    const onChange = jest.fn();
    await renderInTestApp(
      <Wrapper>
        <MaxDepthFilter value={10} onChange={onChange} />
      </Wrapper>,
    );

    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText('clear max depth'));
    expect(onChange).toHaveBeenCalledWith(Number.POSITIVE_INFINITY);
  });

  test('should set max depth to undefined if below one', async () => {
    const onChange = jest.fn();
    await renderInTestApp(
      <Wrapper>
        <MaxDepthFilter value={1} onChange={onChange} />
      </Wrapper>,
    );

    await user.clear(screen.getByLabelText('maxp'));
    await user.type(screen.getByLabelText('maxp'), '0');

    expect(onChange).toHaveBeenCalledWith(Number.POSITIVE_INFINITY);
  });

  test('should select direction', async () => {
    let value = 5;
    await renderInTestApp(
      <Wrapper>
        <MaxDepthFilter
          value={value}
          onChange={v => {
            value = v;
          }}
        />
      </Wrapper>,
    );

    expect(screen.getByLabelText('maxp')).toHaveValue(5);
    expect(value).toBe(5);

    await user.clear(screen.getByLabelText('maxp'));
    expect(value).toBe(Number.POSITIVE_INFINITY);
    await user.type(screen.getByLabelText('maxp'), '10');
    expect(value).toBe(10);
  });
});
