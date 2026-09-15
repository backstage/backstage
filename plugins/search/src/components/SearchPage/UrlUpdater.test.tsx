/*
 * Copyright 2026 The Backstage Authors
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

import { act, fireEvent, screen } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import {
  appHistoryApiRef,
  useAppLocation,
} from '@backstage/frontend-plugin-api';
import {
  SearchContextProvider,
  searchApiRef,
  useSearch,
} from '@backstage/plugin-search-react';
import { UrlUpdater } from './SearchPage';

function SearchControls() {
  const { term, setTerm, types, filters } = useSearch();
  const { search } = useAppLocation();
  return (
    <>
      <input
        aria-label="Search term"
        value={term}
        onChange={event => setTerm(event.target.value)}
      />
      <output aria-label="Filters">{JSON.stringify({ types, filters })}</output>
      <output aria-label="Location">{search}</output>
    </>
  );
}

it('keeps search state and app history synchronized across edits and traversal', async () => {
  const history = createMockAppHistory({
    initialLocation:
      '/search?query=first&types[]=software-catalog&filters[kind]=Component',
  });
  await renderInTestApp(
    <TestApiProvider
      apis={[
        [appHistoryApiRef, history],
        [searchApiRef, { query: async () => ({ results: [] }) }],
      ]}
    >
      <SearchContextProvider>
        <UrlUpdater />
        <SearchControls />
      </SearchContextProvider>
    </TestApiProvider>,
  );
  expect(await screen.findByDisplayValue('first')).toBeInTheDocument();
  expect(screen.getByLabelText('Filters')).toHaveTextContent('Component');
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'edited' },
  });
  expect(history.location.search).toContain('query=edited');
  expect(screen.getByLabelText('Location')).toHaveTextContent('query=edited');
  act(() => history.navigate('/search?query=second'));
  expect(await screen.findByDisplayValue('second')).toBeInTheDocument();
  expect(screen.getByLabelText('Filters')).toHaveTextContent(
    '{"types":[],"filters":{}}',
  );
  act(() => history.navigate(-1));
  expect(await screen.findByDisplayValue('edited')).toBeInTheDocument();
  expect(screen.getByLabelText('Filters')).toHaveTextContent('Component');
  act(() => history.navigate(1));
  expect(await screen.findByDisplayValue('second')).toBeInTheDocument();
  act(() => history.navigate('/search'));
  expect(screen.getByRole('textbox')).toHaveValue('');
  expect(history.navigateCalls.length).toBeLessThan(15);
});
