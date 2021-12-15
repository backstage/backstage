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
import { configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/config';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { SearchResultFooter } from './SearchResultFooter';

jest.mock('../SearchContext', () => ({
  ...jest.requireActual('../SearchContext'),
  useSearch: jest.fn().mockReturnValue({
    result: { loading: false, value: [] },
    fetchNextPage: jest.fn(),
    fetchPreviousPage: jest.fn(),
  }),
}));

describe('SearchResultFooter', () => {
  it('includes a prompt to refine search results when permissions are enabled', async () => {
    const { getByText, queryByLabelText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, new ConfigReader({ permission: { enabled: true } })],
        ]}
      >
        <SearchResultFooter />
      </TestApiProvider>,
    );

    expect(getByText(/try refining your search query/i)).toBeInTheDocument();

    expect(queryByLabelText('previous page')).not.toBeInTheDocument();
    expect(queryByLabelText('next page')).not.toBeInTheDocument();
  });

  it('includes pagination controls when permissions are disabled', async () => {
    const { getByLabelText, queryByText } = await renderInTestApp(
      <SearchResultFooter />,
    );

    expect(getByLabelText('previous page')).toBeInTheDocument();
    expect(getByLabelText('next page')).toBeInTheDocument();

    expect(
      queryByText(/try refining your search query/i),
    ).not.toBeInTheDocument();
  });
});
