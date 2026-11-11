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

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { useSearch, searchApiRef } from '@backstage/plugin-search-react';
import { SearchPage } from './SearchPage';

const searchApi = { query: jest.fn(async () => ({ results: [] })) };

function SearchControls() {
  const {
    term,
    types,
    filters,
    pageCursor,
    setTerm,
    setTypes,
    setFilters,
    setPageCursor,
  } = useSearch();
  return (
    <>
      <span>Route Children</span>
      <output aria-label="Search state">
        {JSON.stringify({ term, types, filters, pageCursor })}
      </output>
      <button
        onClick={() => {
          setTerm('bieber');
          setTypes(['software-catalog']);
          setFilters({ anyKey: 'anyValue' });
        }}
      >
        Update search
      </button>
      <button onClick={() => setPageCursor('SOMEPAGE')}>Next page</button>
    </>
  );
}

function renderSearchPage(route = '/search') {
  return renderInTestApp(
    <TestApiProvider apis={[[searchApiRef, searchApi]]}>
      <Routes>
        <Route path="/search" element={<SearchPage />}>
          <Route index element={<SearchControls />} />
        </Route>
      </Routes>
    </TestApiProvider>,
    { routeEntries: [route] },
  );
}

describe('SearchPage', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => window.history.replaceState({}, '', '/'));

  it('sets search state from location', async () => {
    await renderSearchPage(
      '/search?query=justin%20bieber&types[]=software-catalog&filters[anyKey]=anyValue&pageCursor=SOMEPAGE',
    );
    expect(
      JSON.parse(screen.getByLabelText('Search state').textContent!),
    ).toMatchObject({
      term: 'justin bieber',
      types: ['software-catalog'],
      filters: { anyKey: 'anyValue' },
    });
    expect(searchApi.query).toHaveBeenCalledWith(
      expect.objectContaining({
        term: 'justin bieber',
        pageCursor: 'SOMEPAGE',
      }),
      expect.anything(),
    );
  });

  it('renders the router outlet', async () => {
    await renderSearchPage();
    expect(screen.getByText('Route Children')).toBeInTheDocument();
  });

  it('replaces browser history when search state changes in the old frontend', async () => {
    const historyLength = window.history.length;
    await renderSearchPage();
    fireEvent.click(screen.getByRole('button', { name: 'Update search' }));
    // Changing the search resets pagination; selecting a page then publishes its cursor.
    expect(new URLSearchParams(window.location.search).has('pageCursor')).toBe(
      false,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(window.location.search).toBe(
      encodeURI(
        '?query=bieber&types[]=software-catalog&pageCursor=SOMEPAGE&filters[anyKey]=anyValue',
      ),
    );
    expect(window.history.length).toBe(historyLength);
  });
});
