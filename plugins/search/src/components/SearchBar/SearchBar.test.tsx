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
import { screen, render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchContextProvider } from '../SearchContext';

import { SearchBar } from './SearchBar';
import { configApiRef } from '@backstage/core-plugin-api';
import {
  ApiProvider,
  ApiRegistry,
  ConfigReader,
} from '@backstage/core-app-api';
import { searchApiRef } from '../../apis';

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
}));

describe('SearchBar', () => {
  const initialState = {
    term: '',
    filters: {},
    types: ['*'],
    pageCursor: '',
  };

  const query = jest.fn().mockResolvedValue({});

  const apiRegistry = ApiRegistry.from([
    [configApiRef, new ConfigReader({ app: { title: 'Mock title' } })],
    [searchApiRef, { query }],
  ]);

  const name = 'Search';
  const term = 'term';

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Renders without exploding', async () => {
    render(
      <ApiProvider apis={apiRegistry}>
        <SearchContextProvider initialState={initialState}>
          <SearchBar />
        </SearchContextProvider>
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name })).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search in Mock title'),
      ).toBeInTheDocument();
    });
  });

  it('Renders with custom placeholder', async () => {
    render(
      <ApiProvider apis={apiRegistry}>
        <SearchContextProvider initialState={{ ...initialState }}>
          <SearchBar placeholder="This is a custom placeholder" />
        </SearchContextProvider>
        ,
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('This is a custom placeholder'),
      ).toBeInTheDocument();
    });
  });

  it('Renders based on initial search', async () => {
    render(
      <ApiProvider apis={apiRegistry}>
        <SearchContextProvider initialState={{ ...initialState, term }}>
          <SearchBar />
        </SearchContextProvider>
        ,
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name })).toHaveValue(term);
    });
  });

  it('Updates term state when text is entered', async () => {
    render(
      <ApiProvider apis={apiRegistry}>
        <SearchContextProvider initialState={initialState}>
          <SearchBar />
        </SearchContextProvider>
        ,
      </ApiProvider>,
    );

    const textbox = screen.getByRole('textbox', { name });

    const value = 'value';

    userEvent.type(textbox, value);

    await waitFor(() => {
      expect(textbox).toHaveValue(value);
    });

    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ term: value }),
    );
  });

  it('Clear button clears term state', async () => {
    render(
      <ApiProvider apis={apiRegistry}>
        <SearchContextProvider initialState={{ ...initialState, term }}>
          <SearchBar />
        </SearchContextProvider>
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name })).toHaveValue(term);
    });

    userEvent.click(screen.getByRole('button', { name: 'Clear' }));

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name })).toHaveValue('');
    });

    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ term: '' }),
    );
  });

  it('Adheres to provided debounceTime', async () => {
    jest.useFakeTimers();

    const debounceTime = 600;

    render(
      <ApiProvider apis={apiRegistry}>
        <SearchContextProvider initialState={initialState}>
          <SearchBar debounceTime={debounceTime} />
        </SearchContextProvider>
        ,
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name })).toBeInTheDocument();
    });

    const textbox = screen.getByRole('textbox', { name });

    const value = 'value';

    userEvent.type(textbox, value);

    expect(query).not.toHaveBeenLastCalledWith(
      expect.objectContaining({ term: value }),
    );

    act(() => {
      jest.advanceTimersByTime(debounceTime);
    });

    await waitFor(() => {
      expect(textbox).toHaveValue(value);
    });

    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ term: value }),
    );
  });
});
