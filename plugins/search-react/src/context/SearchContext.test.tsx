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

import { useApi } from '@backstage/core-plugin-api';
import {
  render,
  screen,
  waitFor,
  act,
  renderHook,
} from '@testing-library/react';
import React from 'react';
import {
  SearchContextProvider,
  useSearch,
  useSearchContextCheck,
} from './SearchContext';

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: jest.fn(),
}));

let asyncError: Error | null = null;

class ErrorBoundary extends React.Component<{ children?: React.ReactNode }> {
  componentDidCatch(error: Error): void {
    asyncError = error;
  }

  render() {
    return !asyncError && this.props.children;
  }
}

describe('SearchContext', () => {
  const query = jest.fn();

  const wrapper = ({ children, initialState }: any) => (
    <SearchContextProvider initialState={initialState}>
      {children}
    </SearchContextProvider>
  );
  const customWrapper =
    (initialState?: any) =>
    ({ children }: any) =>
      wrapper({ children, initialState });

  const initialState = {
    term: '',
    types: ['*'],
    filters: {},
  };

  beforeEach(() => {
    query.mockResolvedValue({});
    (useApi as jest.Mock).mockReturnValue({ query: query });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Passes children', async () => {
    const text = 'text';

    render(
      <SearchContextProvider initialState={initialState}>
        {text}
      </SearchContextProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('Throws error when no context is set', async () => {
    renderHook(() => useSearch(), {
      wrapper: ErrorBoundary,
    });

    await waitFor(() => {
      expect(asyncError).toEqual(
        Error('useSearch must be used within a SearchContextProvider'),
      );
    });
  });

  it('Checks whether context is set', async () => {
    const hook = renderHook(() => useSearchContextCheck());

    expect(hook.result.current).toEqual(false);

    const { result } = renderHook(() => useSearchContextCheck(), {
      wrapper: customWrapper(initialState),
    });

    const currentResult = hook.result.current;
    await waitFor(() => expect(currentResult).not.toBe(result.current));

    expect(result.current).toEqual(true);
  });

  it('Uses initial state values', async () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: customWrapper(initialState),
    });

    const currentResult = result.current;
    await waitFor(() => expect(currentResult).not.toBe(result.current));

    expect(result.current).toEqual(expect.objectContaining(initialState));
  });

  describe('Resets cursor', () => {
    it('When term is cleared', async () => {
      const updatedInitialState = {
        ...initialState,
        term: 'first term',
        pageCursor: 'SOMEPAGE',
      };

      const { result } = renderHook(() => useSearch(), {
        wrapper: customWrapper(updatedInitialState),
      });

      let currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(result.current.term).toEqual('first term');
      expect(result.current.pageCursor).toEqual('SOMEPAGE');

      act(() => {
        result.current.setTerm('');
      });

      currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(result.current.pageCursor).toBeUndefined();
    });

    it('When term is set (and different from previous)', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: customWrapper({
          ...initialState,
          term: 'first term',
          pageCursor: 'SOMEPAGE',
        }),
      });

      let currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(result.current.term).toEqual('first term');
      expect(result.current.pageCursor).toEqual('SOMEPAGE');

      act(() => {
        result.current.setTerm('second term');
      });

      currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(result.current.pageCursor).toBeUndefined();
    });

    it('When filters are cleared', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: customWrapper({
          ...initialState,
          term: 'first term',
          filters: { foo: 'bar' },
          pageCursor: 'SOMEPAGE',
        }),
      });

      let currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(result.current.filters).toEqual({ foo: 'bar' });
      expect(result.current.pageCursor).toEqual('SOMEPAGE');

      act(() => {
        result.current.setFilters({});
      });

      currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(result.current.pageCursor).toBeUndefined();
    });

    it('When filters are set (and different from previous)', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: customWrapper({
          ...initialState,
          term: 'first term',
          filters: { foo: 'bar' },
          pageCursor: 'SOMEPAGE',
        }),
      });

      let currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(result.current.filters).toEqual({ foo: 'bar' });
      expect(result.current.pageCursor).toEqual('SOMEPAGE');

      act(() => {
        result.current.setFilters({ foo: 'test' });
      });

      currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(result.current.pageCursor).toBeUndefined();
    });
  });

  describe('Performs search (and sets results)', () => {
    it('When term is set', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: customWrapper(initialState),
      });

      let currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      const term = 'term';

      act(() => {
        result.current.setTerm(term);
      });

      currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(query).toHaveBeenLastCalledWith({
        term,
        types: ['*'],
        filters: {},
      });
    });

    it('When types is set', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: customWrapper(initialState),
      });

      let currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));
      const types = ['type'];

      act(() => {
        result.current.setTypes(types);
      });

      currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(query).toHaveBeenLastCalledWith({
        types,
        term: '',
        filters: {},
      });
    });

    it('When filters are set', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: customWrapper(initialState),
        initialProps: {
          initialState,
        },
      });

      let currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      const filters = { filter: 'filter' };

      act(() => {
        result.current.setFilters(filters);
      });

      currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(query).toHaveBeenLastCalledWith({
        filters,
        term: '',
        types: ['*'],
      });
    });

    it('When page limit is set', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: customWrapper(initialState),
      });

      let currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      const pageLimit = 30;

      act(() => {
        result.current.setPageLimit(pageLimit);
      });

      currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(query).toHaveBeenLastCalledWith({
        pageLimit,
        term: '',
        types: ['*'],
        filters: {},
      });
    });

    it('When page cursor is set', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: customWrapper(initialState),
      });

      let currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      const pageCursor = 'SOMEPAGE';

      act(() => {
        result.current.setPageCursor(pageCursor);
      });

      currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(query).toHaveBeenLastCalledWith({
        pageCursor,
        term: '',
        types: ['*'],
        filters: {},
      });
    });

    it('provides function for fetch the next page', async () => {
      query.mockResolvedValue({
        results: [],
        nextPageCursor: 'NEXT',
      });

      const { result } = renderHook(() => useSearch(), {
        wrapper: customWrapper(initialState),
      });

      let currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(result.current.fetchNextPage).toBeDefined();
      expect(result.current.fetchPreviousPage).toBeUndefined();

      act(() => {
        result.current.fetchNextPage!();
      });

      currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(query).toHaveBeenLastCalledWith({
        term: '',
        types: ['*'],
        filters: {},
        pageCursor: 'NEXT',
      });
    });

    it('provides function for fetch the previous page', async () => {
      query.mockResolvedValue({
        results: [],
        previousPageCursor: 'PREVIOUS',
      });

      const { result } = renderHook(() => useSearch(), {
        wrapper: customWrapper(initialState),
      });

      let currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(result.current.fetchNextPage).toBeUndefined();
      expect(result.current.fetchPreviousPage).toBeDefined();

      act(() => {
        result.current.fetchPreviousPage!();
      });

      currentResult = result.current;
      await waitFor(() => expect(currentResult).not.toBe(result.current));

      expect(query).toHaveBeenLastCalledWith({
        term: '',
        types: ['*'],
        filters: {},
        pageCursor: 'PREVIOUS',
      });
    });
  });
});
