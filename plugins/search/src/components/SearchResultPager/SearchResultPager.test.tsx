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
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useSearch } from '../SearchContext';
import { SearchResultPager } from './SearchResultPager';

jest.mock('../SearchContext', () => ({
  ...jest.requireActual('../SearchContext'),
  useSearch: jest.fn().mockReturnValue({
    result: {},
  }),
}));

describe('SearchResultPager', () => {
  it('renders pager buttons', async () => {
    const fetchNextPage = jest.fn();
    const fetchPreviousPage = jest.fn();
    (useSearch as jest.Mock).mockReturnValueOnce({
      result: { loading: false, value: [] },
      fetchNextPage,
      fetchPreviousPage,
    });

    const { getByLabelText } = await renderInTestApp(<SearchResultPager />);

    await waitFor(() => {
      expect(getByLabelText('previous page')).toBeInTheDocument();

      userEvent.click(getByLabelText('previous page'));
    });

    expect(fetchPreviousPage).toBeCalled();

    await waitFor(() => {
      expect(getByLabelText('next page')).toBeInTheDocument();

      userEvent.click(getByLabelText('next page'));
    });

    expect(fetchNextPage).toBeCalled();
  });
});
