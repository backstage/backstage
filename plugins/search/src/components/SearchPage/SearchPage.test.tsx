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

import { vi , type Mock} from 'vitest';

import { renderInTestApp } from '@backstage/test-utils';
import { useLocation } from 'react-router-dom';
import { useSearch } from '@backstage/plugin-search-react';
import { SearchPage } from './SearchPage';

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useLocation: vi.fn().mockReturnValue({
    search: '',
  }),
  useOutlet: vi.fn().mockReturnValue('Route Children'),
}));

const setTermMock = vi.fn();
const setTypesMock = vi.fn();
const setFiltersMock = vi.fn();
const setPageCursorMock = vi.fn();

vi.mock('@backstage/plugin-search-react', () => ({
  ...vi.importActual('@backstage/plugin-search-react'),
  SearchContextProvider: jest
    .fn()
    .mockImplementation(({ children }) => children),
  useSearch: vi.fn().mockReturnValue({
    term: '',
    setTerm: (term: any) => setTermMock(term),
    types: [],
    setTypes: (types: any) => setTypesMock(types),
    filters: {},
    setFilters: (filters: any) => setFiltersMock(filters),
    pageCursor: '',
    setPageCursor: (pageCursor: any) => setPageCursorMock(pageCursor),
  }),
}));

describe('SearchPage', () => {
  const origReplaceState = window.history.replaceState;

  beforeEach(() => {
    window.history.replaceState = vi.fn();
  });

  afterEach(() => {
    window.history.replaceState = origReplaceState;
  });

  it('sets term state from location', async () => {
    // Given this initial location.search value...
    const expectedFilterField = 'anyKey';
    const expectedFilterValue = 'anyValue';
    const expectedTerm = 'justin bieber';
    const expectedTypes = ['software-catalog'];
    const expectedFilters = { [expectedFilterField]: expectedFilterValue };
    const expectedPageCursor = 'SOMEPAGE';

    // e.g. ?query=petstore&pageCursor=SOMEPAGE&filters[lifecycle][]=experimental&filters[kind]=Component
    (useLocation as Mock).mockReturnValue({
      search: `?query=${expectedTerm}&types[]=${expectedTypes[0]}&filters[${expectedFilterField}]=${expectedFilterValue}&pageCursor=${expectedPageCursor}`,
    });

    // When we render the page...
    await renderInTestApp(<SearchPage />);

    // Then search context should be set with these values...
    expect(setTermMock).toHaveBeenCalledWith(expectedTerm);
    expect(setTypesMock).toHaveBeenCalledWith(expectedTypes);
    expect(setPageCursorMock).toHaveBeenCalledWith(expectedPageCursor);
    expect(setFiltersMock).toHaveBeenCalledWith(expectedFilters);
  });

  it('renders provided router element', async () => {
    const { getByText } = await renderInTestApp(<SearchPage />);

    expect(getByText('Route Children')).toBeInTheDocument();
  });

  it('replaces window history with expected query parameters', async () => {
    (useSearch as Mock).mockReturnValueOnce({
      term: 'bieber',
      types: ['software-catalog'],
      pageCursor: 'SOMEPAGE',
      filters: { anyKey: 'anyValue' },
      setTerm: setTermMock,
      setTypes: setTypesMock,
      setFilters: setFiltersMock,
      setPageCursor: setPageCursorMock,
    });
    const expectedLocation = encodeURI(
      '?query=bieber&types[]=software-catalog&pageCursor=SOMEPAGE&filters[anyKey]=anyValue',
    );

    await renderInTestApp(<SearchPage />);

    const calls = (window.history.replaceState as Mock).mock.calls[0];
    expect(calls[2]).toContain(expectedLocation);
  });
});
