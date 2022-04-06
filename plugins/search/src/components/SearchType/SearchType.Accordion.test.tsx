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
import { ApiProvider } from '@backstage/core-app-api';
import { TestApiRegistry } from '@backstage/test-utils';
import { act, render } from '@testing-library/react';
import user from '@testing-library/user-event';

import { searchApiRef } from '../../apis';
import { SearchContext, SearchContextProvider } from '../SearchContext';
import { SearchType } from './SearchType';

describe('SearchType.Accordion', () => {
  const query = jest.fn();
  const mockApis = TestApiRegistry.from([searchApiRef, { query }]);

  const contextSpy = {
    result: { loading: false, value: { results: [] } },
    term: '',
    types: [],
    filters: {},
    setTerm: jest.fn(),
    setTypes: jest.fn(),
    setFilters: jest.fn(),
    setPageCursor: jest.fn(),
  };

  const expectedLabel = 'Expected Label';
  const expectedType = {
    value: 'expected-type',
    name: 'Expected Type',
    icon: <></>,
  };

  beforeEach(() => {
    query.mockResolvedValue({ results: [] });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render as expected', async () => {
    const { getByText } = render(
      <ApiProvider apis={mockApis}>
        <SearchContextProvider>
          <SearchType.Accordion name={expectedLabel} types={[expectedType]} />
        </SearchContextProvider>
      </ApiProvider>,
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
      <SearchContext.Provider value={contextSpy}>
        <SearchType.Accordion name={expectedLabel} types={[expectedType]} />
      </SearchContext.Provider>,
    );

    await user.click(getByText(expectedType.name));

    expect(contextSpy.setTypes).toHaveBeenCalledWith([expectedType.value]);
  });

  it('should reset types array when all is selected', async () => {
    const { getByText } = render(
      <SearchContext.Provider value={contextSpy}>
        <SearchType.Accordion
          name={expectedLabel}
          defaultValue={expectedType.value}
          types={[expectedType]}
        />
      </SearchContext.Provider>,
    );

    await user.click(getByText('All'));

    expect(contextSpy.setTypes).toHaveBeenCalledWith([]);
  });

  it('should reset page cursor when a new type is selected', async () => {
    const { getByText } = render(
      <SearchContext.Provider value={contextSpy}>
        <SearchType.Accordion name={expectedLabel} types={[expectedType]} />
      </SearchContext.Provider>,
    );

    await user.click(getByText(expectedType.name));

    expect(contextSpy.setPageCursor).toHaveBeenCalledWith(undefined);
  });

  it('should collapse when a new type is selected', async () => {
    const { getByText, queryByText } = render(
      <SearchContext.Provider value={contextSpy}>
        <SearchType.Accordion name={expectedLabel} types={[expectedType]} />
      </SearchContext.Provider>,
    );

    await user.click(getByText(expectedType.name));

    expect(queryByText('Collapse')).not.toBeInTheDocument();
  });
});
