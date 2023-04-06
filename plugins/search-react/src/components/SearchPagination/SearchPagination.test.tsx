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
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithEffects, TestApiProvider } from '@backstage/test-utils';

import { searchApiRef } from '../../api';
import { SearchContextProvider } from '../../context';

import { SearchPagination } from './SearchPagination';

const query = jest.fn().mockResolvedValue({
  results: [],
  nextPageCursor: 'Mg==',
  previousPageCursor: 'MA==',
});

describe('SearchPagination', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders without exploding', async () => {
    await renderWithEffects(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider>
          <SearchPagination />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    expect(screen.getByText('Results per page:')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('1-25')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeEnabled();
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('Define default page limit options', async () => {
    await renderWithEffects(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider>
          <SearchPagination />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    await userEvent.click(screen.getByText('25'));

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('10');
    expect(options[1]).toHaveTextContent('25');
    expect(options[2]).toHaveTextContent('50');
    expect(options[3]).toHaveTextContent('100');
  });

  it('Accept custom page limit label', async () => {
    const label = 'Page limit:';
    await renderWithEffects(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider>
          <SearchPagination limitLabel={label} />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('Show the total in text', async () => {
    await renderWithEffects(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider>
          <SearchPagination total={100} />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    expect(screen.getByText('of 100')).toBeInTheDocument();
  });

  it('Accept custom page limit text', async () => {
    await renderWithEffects(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider>
          <SearchPagination
            limitText={({ from, to }) => `${from}-${to} of more than ${to}`}
          />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    expect(screen.getByText('1-25 of more than 25')).toBeInTheDocument();
  });

  it('Accept custom page limit options', async () => {
    await renderWithEffects(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider>
          <SearchPagination limitOptions={[5, 10, 20, 25]} />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    await userEvent.click(screen.getByText('25'));

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('5');
    expect(options[1]).toHaveTextContent('10');
    expect(options[2]).toHaveTextContent('20');
    expect(options[3]).toHaveTextContent('25');
  });

  it('Set page limit in the context', async () => {
    await renderWithEffects(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider>
          <SearchPagination />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    await userEvent.click(screen.getByText('25'));

    await userEvent.click(screen.getByText('10'));

    expect(query).toHaveBeenCalledWith(
      expect.objectContaining({
        pageLimit: 10,
      }),
    );
  });

  it('Set page cursor in the context', async () => {
    const initialState = {
      term: '',
      types: [],
      filters: {},
      pageCursor: 'MQ==', // page: 1
    };

    await renderWithEffects(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider initialState={initialState}>
          <SearchPagination />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    await userEvent.click(screen.getByLabelText('Next page'));

    expect(screen.getByText('51-75')).toBeInTheDocument();

    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({
        pageCursor: 'Mg==', // page: 2
      }),
    );

    await userEvent.click(screen.getByLabelText('Previous page'));

    expect(screen.getByText('26-50')).toBeInTheDocument();

    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({
        pageCursor: 'MQ==', // page: 1
      }),
    );
  });
});
