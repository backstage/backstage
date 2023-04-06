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
import { screen, render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configApiRef, analyticsApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/core-app-api';
import {
  MockAnalyticsApi,
  TestApiProvider,
  renderWithEffects,
} from '@backstage/test-utils';
import { searchApiRef } from '../../api';
import { SearchContextProvider } from '../../context';
import { SearchBar } from './SearchBar';

const createInitialState = ({
  term = '',
  filters = {},
  types = ['*'],
  pageCursor = '',
} = {}) => ({
  term,
  filters,
  types,
  pageCursor,
});

describe('SearchBar', () => {
  const query = jest.fn().mockResolvedValue({ results: [] });

  const analyticsApiMock = new MockAnalyticsApi();

  const configApiMock = new ConfigReader({
    app: { title: 'Mock title' },
  });

  const searchApiMock = { query };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders without exploding', async () => {
    await renderWithEffects(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchContextProvider>
          <SearchBar />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Search in Mock title'),
      ).toBeInTheDocument();
    });
  });

  it('Renders with custom placeholder', async () => {
    const placeholder = 'placeholder';

    await renderWithEffects(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchContextProvider>
          <SearchBar placeholder={placeholder} />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
    });
  });

  it('Renders based on initial search', async () => {
    const term = 'term';

    render(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchContextProvider initialState={createInitialState({ term })}>
          <SearchBar />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue(term);
    });
  });

  it('Updates term state when text is entered', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });

    await renderWithEffects(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchContextProvider>
          <SearchBar />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    const textbox = screen.getByRole('textbox', { name: 'Search' });

    const value = 'value';

    await user.type(textbox, value);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(textbox).toHaveValue(value);
    });

    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ term: value }),
    );

    jest.useRealTimers();
  });

  it('Clear button clears term state', async () => {
    const term = 'term';

    await renderWithEffects(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchContextProvider initialState={createInitialState({ term })}>
          <SearchBar />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    const textbox = screen.getByRole('textbox', { name: 'Search' });

    await waitFor(() => {
      expect(textbox).toHaveValue(term);
    });

    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));

    await waitFor(() => {
      expect(textbox).toHaveValue('');
    });

    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ term: '' }),
    );
  });

  it('Should not show clear button', async () => {
    const term = 'term';

    await renderWithEffects(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchContextProvider initialState={createInitialState({ term })}>
          <SearchBar clearButton={false} />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: 'Clear' }),
      ).not.toBeInTheDocument();
    });
  });

  it('Adheres to provided debounceTime', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    const debounceTime = 600;

    await renderWithEffects(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchContextProvider>
          <SearchBar debounceTime={debounceTime} />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    const textbox = await screen.findByRole('textbox', { name: 'Search' });

    const value = 'value';

    await user.type(textbox, value);

    await waitFor(() => {
      expect(query).not.toHaveBeenLastCalledWith(
        expect.objectContaining({ term: value }),
      );
    });

    act(() => {
      jest.advanceTimersByTime(debounceTime);
    });

    await waitFor(() => {
      expect(textbox).toHaveValue(value);
    });

    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ term: value }),
    );

    jest.useRealTimers();
  });

  it('does not capture analytics event if not enabled in app', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });

    await renderWithEffects(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchContextProvider>
          <SearchBar />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    const textbox = await screen.findByRole('textbox', { name: 'Search' });

    const value = 'value';

    await user.type(textbox, value);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(textbox).toHaveValue(value);
    });

    expect(analyticsApiMock.getEvents()).toHaveLength(0);

    jest.useRealTimers();
  });

  it('captures analytics events if enabled in app', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    const types = ['techdocs', 'software-catalog'];

    await renderWithEffects(
      <TestApiProvider
        apis={[
          [searchApiRef, searchApiMock],
          [analyticsApiRef, analyticsApiMock],
          [
            configApiRef,
            new ConfigReader({
              app: {
                title: 'Mock title',
                analytics: {
                  ga: {
                    trackingId: 'xyz123',
                  },
                },
              },
            }),
          ],
        ]}
      >
        <SearchContextProvider initialState={createInitialState({ types })}>
          <SearchBar />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    const textbox = await screen.findByRole('textbox', { name: 'Search' });

    let value = 'value';

    await user.type(textbox, value);

    expect(analyticsApiMock.getEvents()).toHaveLength(0);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => expect(textbox).toHaveValue(value));

    expect(analyticsApiMock.getEvents()).toHaveLength(1);
    expect(analyticsApiMock.getEvents()[0]).toEqual({
      action: 'search',
      context: {
        extension: 'SearchBar',
        pluginId: 'search',
        routeRef: 'unknown',
        searchTypes: types.toString(),
      },
      subject: value,
    });

    await user.clear(textbox);

    value = 'new value';

    // make sure new term is captured
    await user.type(textbox, value);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => expect(textbox).toHaveValue(value));

    expect(analyticsApiMock.getEvents()).toHaveLength(2);
    expect(analyticsApiMock.getEvents()[1]).toEqual({
      action: 'search',
      context: {
        extension: 'SearchBar',
        pluginId: 'search',
        routeRef: 'unknown',
        searchTypes: types.toString(),
      },
      subject: value,
    });

    jest.useRealTimers();
  });
});
