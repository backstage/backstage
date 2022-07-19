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

import React from 'react';
import { TestApiProvider } from '@backstage/test-utils';
import { act, render } from '@testing-library/react';
import user from '@testing-library/user-event';
import {
  SearchContextProvider,
  searchApiRef,
} from '@backstage/plugin-search-react';
import { SearchType } from './SearchType';

const setTypesMock = jest.fn();
const setPageCursorMock = jest.fn();

jest.mock('@backstage/plugin-search-react', () => ({
  ...jest.requireActual('@backstage/plugin-search-react'),
  useSearch: jest.fn().mockReturnValue({
    types: [],
    setTypes: (types: any) => setTypesMock(types),
    pageCursor: '',
    setPageCursor: (pageCursor: any) => setPageCursorMock(pageCursor),
  }),
}));

describe('SearchType.Tabs', () => {
  const query = jest.fn().mockResolvedValue({});

  const expectedType = {
    value: 'expected-type',
    name: 'Expected Type',
  };

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider>{children}</SearchContextProvider>
      </TestApiProvider>
    );
  };

  it('should render as expected', async () => {
    const { getByText } = render(
      <Wrapper>
        <SearchType.Tabs types={[expectedType]} />
      </Wrapper>,
    );

    // The default "all" type should be rendered.
    expect(getByText('All')).toBeInTheDocument();

    // The given type is also visible
    expect(getByText(expectedType.name)).toBeInTheDocument();

    await act(() => Promise.resolve());
  });

  it('should set entire types array when a type is selected', async () => {
    const { getByText } = render(
      <Wrapper>
        <SearchType.Tabs types={[expectedType]} />
      </Wrapper>,
    );

    await user.click(getByText(expectedType.name));

    expect(setTypesMock).toHaveBeenCalledWith([expectedType.value]);
  });

  it('should reset types array when all is selected', async () => {
    const { getByText } = render(
      <Wrapper>
        <SearchType.Tabs
          defaultValue={expectedType.value}
          types={[expectedType]}
        />
      </Wrapper>,
    );

    await user.click(getByText('All'));

    expect(setTypesMock).toHaveBeenCalledWith([]);
  });

  it('should reset page cursor when a new type is selected', async () => {
    const { getByText } = render(
      <Wrapper>
        <SearchType.Tabs types={[expectedType]} />
      </Wrapper>,
    );

    await user.click(getByText(expectedType.name));

    expect(setPageCursorMock).toHaveBeenCalledWith(undefined);
  });
});
