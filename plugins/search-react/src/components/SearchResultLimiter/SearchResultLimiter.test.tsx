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

import { SearchResultLimiter } from './SearchResultLimiter';

const query = jest.fn().mockResolvedValue({ results: [] });

describe('SearchResultLimiter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders without exploding', async () => {
    await renderWithEffects(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider>
          <SearchResultLimiter />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    expect(screen.getByText('Results per page:')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('Define default options', async () => {
    await renderWithEffects(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider>
          <SearchResultLimiter />
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

  it('Set page limit in the context', async () => {
    await renderWithEffects(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider>
          <SearchResultLimiter />
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

  it('Accept custom label', async () => {
    const label = 'Custom label';
    await renderWithEffects(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider>
          <SearchResultLimiter label={label} />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('Accept custom options', async () => {
    await renderWithEffects(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider>
          <SearchResultLimiter options={[5, 10, 20, 25]} />
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
});
