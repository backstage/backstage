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
import { mockApis, TestApiProvider } from '@backstage/test-utils';
import { act, render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import {
  searchApiRef,
  SearchContextProvider,
} from '@backstage/plugin-search-react';
import { SearchType } from './SearchType';
import { configApiRef } from '@backstage/core-plugin-api';

const setTypesMock = jest.fn();
const setPageCursorMock = jest.fn();

jest.mock('@backstage/plugin-search-react', () => ({
  ...jest.requireActual('@backstage/plugin-search-react'),
  useSearch: jest.fn().mockReturnValue({
    types: [],
    setTypes: (types: any) => setTypesMock(types),
    pageCursor: '',
    setPageCursor: (pageCursor: any) => setPageCursorMock(pageCursor),
    term: 'abc',
    filters: { foo: 'bar' },
  }),
}));

describe('SearchType.Accordion', () => {
  const configApiMock = mockApis.config({
    data: {
      search: {
        query: {
          pagelimit: 10,
        },
      },
    },
  });

  const searchApiMock = { query: jest.fn() };

  const expectedLabel = 'Expected Label';
  const expectedType = {
    value: 'expected-type',
    name: 'Expected Type',
    icon: <></>,
  };

  beforeEach(() => {
    searchApiMock.query.mockResolvedValue({
      results: [],
      numberOfResults: 1234,
    });
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <TestApiProvider
        apis={[
          [searchApiRef, searchApiMock],
          [configApiRef, configApiMock],
        ]}
      >
        <SearchContextProvider>{children}</SearchContextProvider>
      </TestApiProvider>
    );
  };

  it('should render as expected', async () => {
    const { getByText } = render(
      <Wrapper>
        <SearchType.Accordion name={expectedLabel} types={[expectedType]} />
      </Wrapper>,
    );

    // The given label should be rendered.
    expect(getByText(expectedLabel)).toBeInTheDocument();

    // "Collapse" is visible by default (element is not collapsed)
    expect(getByText('Collapse')).toBeInTheDocument();

    // The default "all" type should be rendered.
    expect(getByText('All')).toBeInTheDocument();

    // The given type is also visible
    expect(getByText(expectedType.name)).toBeInTheDocument();

    await act(() => Promise.resolve());
  });

  it('should set entire types array when a type is selected', async () => {
    const { getByText } = render(
      <Wrapper>
        <SearchType.Accordion name={expectedLabel} types={[expectedType]} />
      </Wrapper>,
    );

    await user.click(getByText(expectedType.name));

    expect(setTypesMock).toHaveBeenCalledWith([expectedType.value]);
  });

  it('should reset types array when all is selected', async () => {
    const { getByText } = render(
      <Wrapper>
        <SearchType.Accordion
          name={expectedLabel}
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
        <SearchType.Accordion name={expectedLabel} types={[expectedType]} />
      </Wrapper>,
    );

    await user.click(getByText(expectedType.name));

    expect(setPageCursorMock).toHaveBeenCalledWith(undefined);
  });

  it('should show result counts if enabled', async () => {
    const { getAllByText } = render(
      <Wrapper>
        <SearchType.Accordion
          name={expectedLabel}
          showCounts
          types={[expectedType]}
        />
      </Wrapper>,
    );

    expect(searchApiMock.query).toHaveBeenCalledWith({
      term: 'abc',
      types: [],
      filters: { foo: 'bar' },
      pageLimit: 0,
    });
    expect(searchApiMock.query).toHaveBeenCalledWith({
      term: 'abc',
      types: [expectedType.value],
      filters: {},
      pageLimit: 0,
    });
    await waitFor(() => {
      const countLabels = getAllByText('1234 results');
      expect(countLabels.length).toEqual(2);
      expect(countLabels[0]).toBeInTheDocument();
    });
  });
});
