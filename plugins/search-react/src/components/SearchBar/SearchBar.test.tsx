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
import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import { MockAnalyticsApi, TestApiRegistry } from '@backstage/test-utils';

import { searchApiRef } from '../../api';
import { SearchContextProvider } from '../../context';
import { SearchBar } from './SearchBar';

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
  const analyticsApiSpy = new MockAnalyticsApi();
  let apiRegistry: TestApiRegistry;

  apiRegistry = TestApiRegistry.from(
    [
      configApiRef,
      new ConfigReader({
        app: { title: 'Mock title' },
      }),
    ],
    [searchApiRef, { query }],
  );

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
    const user = userEvent.setup({ delay: null });
    jest.useFakeTimers();
    const defaultDebounceTime = 200;

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

    await user.type(textbox, value);

    act(() => {
      jest.advanceTimersByTime(defaultDebounceTime);
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

    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name })).toHaveValue('');
    });

    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ term: '' }),
    );
  });

  it('Should not show clear button', async () => {
    render(
      <ApiProvider apis={apiRegistry}>
        <SearchContextProvider initialState={{ ...initialState, term }}>
          <SearchBar clearButton={false} />
        </SearchContextProvider>
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: 'Clear' }),
      ).not.toBeInTheDocument();
    });
  });

  it('Adheres to provided debounceTime', async () => {
    const user = userEvent.setup({ delay: null });
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

    await user.type(textbox, value);

    expect(query).not.toHaveBeenLastCalledWith(
      expect.objectContaining({ term: value }),
    );

    act(() => {
      jest.advanceTimersByTime(debounceTime);
    });
    expect(textbox).toHaveValue(value);

    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ term: value }),
    );
    jest.useRealTimers();
  });

  it('does not capture analytics event if not enabled in app', async () => {
    const user = userEvent.setup({ delay: null });
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

    await user.type(textbox, value);

    act(() => {
      jest.advanceTimersByTime(debounceTime);
    });

    await waitFor(() => expect(textbox).toHaveValue(value));

    expect(analyticsApiSpy.getEvents()).toHaveLength(0);
    jest.useRealTimers();
  });

  it('captures analytics events if enabled in app', async () => {
    const user = userEvent.setup({ delay: null });
    jest.useFakeTimers();

    const debounceTime = 600;

    apiRegistry = TestApiRegistry.from(
      [analyticsApiRef, analyticsApiSpy],
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
      [searchApiRef, { query }],
    );

    render(
      <ApiProvider apis={apiRegistry}>
        <SearchContextProvider
          initialState={{
            term: '',
            types: ['techdocs', 'software-catalog'],
            filters: {},
          }}
        >
          <SearchBar debounceTime={debounceTime} />
        </SearchContextProvider>
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name })).toBeInTheDocument();
    });

    const textbox = screen.getByRole('textbox', { name });

    const value = 'value';

    await user.type(textbox, value);

    expect(analyticsApiSpy.getEvents()).toHaveLength(0);

    act(() => {
      jest.advanceTimersByTime(debounceTime);
    });

    await waitFor(() => expect(textbox).toHaveValue(value));

    expect(analyticsApiSpy.getEvents()).toHaveLength(1);
    expect(analyticsApiSpy.getEvents()[0]).toEqual({
      action: 'search',
      context: {
        extension: 'SearchBar',
        pluginId: 'search',
        routeRef: 'unknown',
        searchTypes: 'software-catalog,techdocs',
      },
      subject: 'value',
    });

    await user.clear(textbox);

    // make sure new term is captured
    await user.type(textbox, 'new value');

    act(() => {
      jest.advanceTimersByTime(debounceTime);
    });

    await waitFor(() => expect(textbox).toHaveValue('new value'));

    expect(analyticsApiSpy.getEvents()).toHaveLength(2);
    expect(analyticsApiSpy.getEvents()[1]).toEqual({
      action: 'search',
      context: {
        extension: 'SearchBar',
        pluginId: 'search',
        routeRef: 'unknown',
        searchTypes: 'software-catalog,techdocs',
      },
      subject: 'new value',
    });
    jest.useRealTimers();
  });
});
