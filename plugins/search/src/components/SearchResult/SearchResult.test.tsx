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

import { renderInTestApp } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { useSearch } from '../SearchContext';
import { SearchResult } from './SearchResult';

jest.mock('../SearchContext', () => ({
  ...jest.requireActual('../SearchContext'),
  useSearch: jest.fn().mockReturnValue({
    result: {},
    page: {},
  }),
}));

describe('SearchResult', () => {
  it('Progress rendered on Loading state', async () => {
    (useSearch as jest.Mock).mockReturnValueOnce({
      result: { loading: true },
    });

    const { getByRole } = await renderInTestApp(
      <SearchResult>{() => <></>}</SearchResult>,
    );

    await waitFor(() => {
      expect(getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('Alert rendered on Error state', async () => {
    const error = new Error('some error');
    (useSearch as jest.Mock).mockReturnValueOnce({
      result: { loading: false, error },
    });

    const { getByRole } = await renderInTestApp(
      <SearchResult>{() => <></>}</SearchResult>,
    );

    await waitFor(() => {
      expect(getByRole('alert')).toHaveTextContent(
        new RegExp(`Error encountered while fetching search results.*${error}`),
      );
    });
  });

  it('On no result value state', async () => {
    (useSearch as jest.Mock).mockReturnValueOnce({
      result: { loading: false, error: '', value: undefined },
    });

    const { getByRole } = await renderInTestApp(
      <SearchResult>{() => <></>}</SearchResult>,
    );

    await waitFor(() => {
      expect(
        getByRole('heading', { name: 'Sorry, no results were found' }),
      ).toBeInTheDocument();
    });
  });

  it('On empty result value state', async () => {
    (useSearch as jest.Mock).mockReturnValueOnce({
      result: { loading: false, error: '', value: { results: [] } },
    });

    const { getByRole } = await renderInTestApp(
      <SearchResult>{() => <></>}</SearchResult>,
    );

    await waitFor(() => {
      expect(
        getByRole('heading', { name: 'Sorry, no results were found' }),
      ).toBeInTheDocument();
    });
  });

  it('Calls children with results set to result.value', async () => {
    (useSearch as jest.Mock).mockReturnValueOnce({
      result: {
        loading: false,
        error: '',
        value: {
          totalCount: 1,
          results: [
            {
              type: 'some-type',
              document: {
                title: 'some-title',
                text: 'some-text',
                location: 'some-location',
              },
            },
          ],
        },
      },
      page: {},
    });

    const { getByText } = await renderInTestApp(
      <SearchResult>
        {({ results }) => {
          return <>Results {results.length}</>;
        }}
      </SearchResult>,
    );

    expect(getByText('Results 1')).toBeInTheDocument();
  });

  it('Starts on initial page if no offset is set', async () => {
    (useSearch as jest.Mock).mockReturnValueOnce({
      page: {},
      result: {
        loading: false,
        error: '',
        value: { results: [{}], totalCount: 100 },
      },
    });

    const { getByLabelText } = await renderInTestApp(
      <SearchResult>{({}) => <></>}</SearchResult>,
    );

    expect(getByLabelText('page 1')).toHaveAttribute('aria-current', 'true');
    expect(getByLabelText('Go to page 2')).toBeInTheDocument();
    expect(getByLabelText('Go to page 3')).toBeInTheDocument();
    expect(getByLabelText('Go to page 4')).toBeInTheDocument();
  });

  it('Shows the right page', async () => {
    (useSearch as jest.Mock).mockReturnValueOnce({
      page: { offset: 25 },
      result: {
        loading: false,
        error: '',
        value: { results: [{}], totalCount: 63 },
      },
    });

    const { getByLabelText } = await renderInTestApp(
      <SearchResult>{({}) => <></>}</SearchResult>,
    );

    expect(getByLabelText('Go to page 1')).toBeInTheDocument();
    expect(getByLabelText('page 2')).toHaveAttribute('aria-current', 'true');
    expect(getByLabelText('Go to page 3')).toBeInTheDocument();
  });
});
