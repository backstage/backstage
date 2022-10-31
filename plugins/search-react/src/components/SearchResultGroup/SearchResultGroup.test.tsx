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
import userEvent from '@testing-library/user-event';

import { MenuItem } from '@material-ui/core';
import DocsIcon from '@material-ui/icons/InsertDriveFile';

import {
  TestApiProvider,
  renderWithEffects,
  wrapInTestApp,
} from '@backstage/test-utils';

import { searchApiRef } from '../../api';
import {
  SearchResultGroup,
  SearchResultGroupSelectFilterField,
  SearchResultGroupTextFilterField,
} from './SearchResultGroup';

const query = jest.fn().mockResolvedValue({ results: [] });
const searchApiMock = { query };

describe('SearchResultGroup', () => {
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
          <SearchResultGroup
            query={{ types: ['techdocs'] }}
            icon={<DocsIcon titleAccess="Docs icon" />}
            title="Documentation"
          />
        </TestApiProvider>,
      ),
    );

    expect(screen.getByTitle('Docs icon')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(query).toHaveBeenCalledWith({
      filters: {},
      pageCursor: undefined,
      term: '',
      types: ['techdocs'],
    });
  });

  it('Defines a default link', async () => {
    await renderWithEffects(
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <SearchResultGroup
            query={{ types: ['techdocs'] }}
            icon={<DocsIcon titleAccess="Docs icon" />}
            title="Documentation"
          />
        </TestApiProvider>,
      ),
    );

    const link = screen.getByText('See all', { exact: false });
    expect(link).toHaveAttribute('href', encodeURI('/search?types[]=techdocs'));
  });

  it('Defines a default render result item', async () => {
    query.mockResolvedValueOnce({
      results,
    });

    await renderWithEffects(
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <SearchResultGroup
            query={{ types: ['techdocs'] }}
            icon={<DocsIcon titleAccess="Docs icon" />}
            title="Documentation"
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

  it('Could be customized with no results text', async () => {
    await renderWithEffects(
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <SearchResultGroup
            query={{ types: ['techdocs'] }}
            icon={<DocsIcon titleAccess="Docs icon" />}
            title="Documentation"
          />
        </TestApiProvider>,
      ),
    );

    expect(
      screen.getByText('Sorry, no results were found'),
    ).toBeInTheDocument();
  });

  it('Could be customized with filters', async () => {
    query.mockResolvedValueOnce({
      results,
    });

    await renderWithEffects(
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <SearchResultGroup
            query={{ types: ['techdocs'] }}
            icon={<DocsIcon titleAccess="Docs icon" />}
            title="Documentation"
            filterOptions={['lifecycle', 'owner']}
          />
        </TestApiProvider>,
      ),
    );

    await userEvent.click(screen.getByText('Add filter', { exact: false }));

    await waitFor(() => {
      expect(screen.getByText('lifecycle')).toBeInTheDocument();
    });

    expect(screen.getByText('owner')).toBeInTheDocument();
  });

  it('Could have a text search filter field', async () => {
    query.mockResolvedValueOnce({
      results,
    });

    const handleFilterChange = jest.fn();
    const handleFilterDelete = jest.fn();

    await renderWithEffects(
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <SearchResultGroup
            query={{
              types: ['techdocs'],
              filters: { owner: null },
            }}
            icon={<DocsIcon titleAccess="Docs icon" />}
            title="Documentation"
            filterOptions={['owner']}
            renderFilterField={(key: string) =>
              key === 'owner' ? (
                <SearchResultGroupTextFilterField
                  key={key}
                  label="Owner"
                  onChange={handleFilterChange}
                  onDelete={handleFilterDelete}
                />
              ) : null
            }
          />
        </TestApiProvider>,
      ),
    );

    await userEvent.click(screen.getByText('Add filter', { exact: false }));

    await userEvent.click(screen.getByText('owner'));

    await userEvent.type(
      screen.getByRole('textbox'),
      '{backspace}{backspace}{backspace}{backspace}techdocs-core',
    );

    await waitFor(() => {
      expect(screen.getByText('techdocs-core')).toBeInTheDocument();
    });
  });

  it('Could have a select search filter field', async () => {
    query.mockResolvedValueOnce({
      results,
    });

    const handleFilterChange = jest.fn();
    const handleFilterDelete = jest.fn();

    await renderWithEffects(
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <SearchResultGroup
            query={{
              types: ['techdocs'],
              filters: { lifecycle: null },
            }}
            icon={<DocsIcon titleAccess="Docs icon" />}
            title="Documentation"
            filterOptions={['lifecycle']}
            renderFilterField={(key: string) =>
              key === 'lifecycle' ? (
                <SearchResultGroupSelectFilterField
                  key={key}
                  label="Lifecycle"
                  onChange={handleFilterChange}
                  onDelete={handleFilterDelete}
                >
                  <MenuItem value="production">Production</MenuItem>
                  <MenuItem value="experimental">Experimental</MenuItem>
                </SearchResultGroupSelectFilterField>
              ) : null
            }
          />
        </TestApiProvider>,
      ),
    );

    await userEvent.click(screen.getByText('Add filter', { exact: false }));

    await userEvent.click(screen.getByText('lifecycle'));

    await userEvent.click(screen.getByText('None'));

    await userEvent.click(screen.getByText('Experimental'));

    await waitFor(() => {
      expect(handleFilterChange).toHaveBeenCalledWith('experimental');
    });
  });

  it('Shows a progress bar when loading results', async () => {
    query.mockReturnValueOnce(new Promise(() => {}));
    await renderWithEffects(
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <SearchResultGroup
            query={{ types: ['techdocs'] }}
            icon={<DocsIcon titleAccess="Docs icon" />}
            title="Documentation"
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
          <SearchResultGroup
            query={{ types: ['techdocs'] }}
            icon={<DocsIcon titleAccess="Docs icon" />}
            title="Documentation"
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
          <SearchResultGroup
            query={{ types: ['techdocs'] }}
            icon={<DocsIcon titleAccess="Docs icon" />}
            title="Documentation"
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
          <SearchResultGroup
            query={{ types: ['techdocs'] }}
            icon={<DocsIcon titleAccess="Docs icon" />}
            title="Documentation"
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
