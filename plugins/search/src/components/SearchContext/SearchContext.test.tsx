/*
 * Copyright 2021 Spotify AB
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
import { renderInTestApp } from '@backstage/test-utils';
import * as SearchContext from './SearchContext';

const mockContextState = ({ term }: { term: string }) => {
  return {
    term,
    pageCursor: '',
    filters: {},
    types: ['*'],
    result: { results: [], loading: false, error: undefined },
    setTerm: jest.fn(),
    setFilters: jest.fn(),
    setTypes: jest.fn(),
    setPageCursor: jest.fn(),
  };
};

const MockSearchContextConsumer = () => {
  const { term } = SearchContext.useSearch();

  return <h6>{term}</h6>;
};

describe('useSearch', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('context should use initial term', async () => {
    jest.spyOn(SearchContext, 'useSearch');
    const { getByRole } = await renderInTestApp(<MockSearchContextConsumer />);
    expect(getByRole('heading')).toBeInTheDocument();
  });

  it('context should use mocked term', async () => {
    jest
      .spyOn(SearchContext, 'useSearch')
      .mockImplementation(() => mockContextState({ term: 'new-term' }));

    const { getByRole } = await renderInTestApp(<MockSearchContextConsumer />);

    expect(getByRole('heading', { name: 'new-term' })).toBeInTheDocument();
  });
});
