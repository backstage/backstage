/*
 * Copyright 2022 The Backstage Authors
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
import { screen, waitFor } from '@testing-library/react';

import {
  TestApiProvider,
  renderWithEffects,
  wrapInTestApp,
} from '@backstage/test-utils';

import { searchApiRef } from '../../api';
import { SearchResultList } from './SearchResultList';

const query = jest.fn().mockResolvedValue({ results: [] });
const searchApiMock = { query };

describe('SearchResultList', () => {
  const results = [
    {
      type: 'techdocs',
      document: {
        location: 'search/search-result1',
        title: 'Search Result 1',
        text: 'Some text from the search result 1',
      },
    },
    {
      type: 'techdocs',
      document: {
        location: 'search/search-result2',
        title: 'Search Result 2',
        text: 'Some text from the search result 2',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders without exploding', async () => {
    await renderWithEffects(
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <SearchResultList
            query={{
              types: ['techdocs'],
            }}
          />
        </TestApiProvider>,
      ),
    );

    expect(query).toHaveBeenCalledWith({
      filters: {},
      pageCursor: undefined,
      term: '',
      types: ['techdocs'],
    });
  });

  it('Defines a default render result item', async () => {
    query.mockResolvedValueOnce({
      results,
    });

    await renderWithEffects(
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <SearchResultList
            query={{
              types: ['techdocs'],
            }}
          />
        </TestApiProvider>,
      ),
    );

    expect(screen.getByText('Search Result 1')).toBeInTheDocument();
    expect(
      screen.getByText('Some text from the search result 1'),
    ).toBeInTheDocument();

    expect(screen.getByText('Search Result 2')).toBeInTheDocument();
    expect(
      screen.getByText('Some text from the search result 2'),
    ).toBeInTheDocument();
  });

  it('Shows a progress bar when loading results', async () => {
    query.mockReturnValueOnce(new Promise(() => {}));
    await renderWithEffects(
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <SearchResultList
            query={{
              types: ['techdocs'],
            }}
          />
        </TestApiProvider>,
      ),
    );

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('Does not render result group if no results returned and disableRenderingWithNoResults prop is provided', async () => {
    query.mockResolvedValueOnce({ results: [] });
    await renderWithEffects(
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <SearchResultList
            query={{ types: ['techdocs'] }}
            disableRenderingWithNoResults
          />
        </TestApiProvider>,
      ),
    );

    await waitFor(() => {
      expect(screen.queryByText('Documentation')).not.toBeInTheDocument();
    });
  });

  it('Should render custom component when no results returned', async () => {
    query.mockResolvedValueOnce({ results: [] });
    await renderWithEffects(
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <SearchResultList
            query={{ types: ['techdocs'] }}
            noResultsComponent="No results were found"
          />
        </TestApiProvider>,
      ),
    );

    await waitFor(() => {
      expect(screen.getByText('No results were found')).toBeInTheDocument();
    });
  });

  it('Shows an error panel when results rendering fails', async () => {
    query.mockRejectedValueOnce(new Error());
    await renderWithEffects(
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <SearchResultList
            query={{
              types: ['techdocs'],
            }}
          />
        </TestApiProvider>,
      ),
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'Error: Error encountered while fetching search results',
        ),
      ).toBeInTheDocument();
    });
  });
});
