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
import { render, screen, waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
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

describe('SearchContext', () => {
  const query = jest.fn();

  const wrapper = ({ children, initialState }: any) => (
    <SearchContextProvider initialState={initialState}>
      {children}
    </SearchContextProvider>
  );

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

  it('Throws error when no context is set', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.error).toEqual(
      Error('useSearch must be used within a SearchContextProvider'),
    );
  });

  it('Checks whether context is set', async () => {
    const hook = renderHook(() => useSearchContextCheck());

    expect(hook.result.current).toEqual(false);

    const { result, waitForNextUpdate } = renderHook(
      () => useSearchContextCheck(),
      {
        wrapper,
        initialProps: {
          initialState,
        },
      },
    );

    await waitForNextUpdate();

    expect(result.current).toEqual(true);
  });

  it('Uses initial state values', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
      wrapper,
      initialProps: {
        initialState,
      },
    });

    await waitForNextUpdate();

    expect(result.current).toEqual(expect.objectContaining(initialState));
  });

  describe('Resets cursor', () => {
    it('When term is cleared', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState: {
            ...initialState,
            term: 'first term',
            pageCursor: 'SOMEPAGE',
          },
        },
      });

      await waitForNextUpdate();

      expect(result.current.term).toEqual('first term');
      expect(result.current.pageCursor).toEqual('SOMEPAGE');

      act(() => {
        result.current.setTerm('');
      });

      await waitForNextUpdate();

      expect(result.current.pageCursor).toBeUndefined();
    });

    it('When term is set (and different from previous)', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState: {
            ...initialState,
            term: 'first term',
            pageCursor: 'SOMEPAGE',
          },
        },
      });

      await waitForNextUpdate();

      expect(result.current.term).toEqual('first term');
      expect(result.current.pageCursor).toEqual('SOMEPAGE');

      act(() => {
        result.current.setTerm('second term');
      });

      await waitForNextUpdate();

      expect(result.current.pageCursor).toBeUndefined();
    });

    it('When filters are cleared', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState: {
            ...initialState,
            term: 'first term',
            filters: { foo: 'bar' },
            pageCursor: 'SOMEPAGE',
          },
        },
      });

      await waitForNextUpdate();

      expect(result.current.filters).toEqual({ foo: 'bar' });
      expect(result.current.pageCursor).toEqual('SOMEPAGE');

      act(() => {
        result.current.setFilters({});
      });

      await waitForNextUpdate();

      expect(result.current.pageCursor).toBeUndefined();
    });

    it('When filters are set (and different from previous)', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState: {
            ...initialState,
            term: 'first term',
            filters: { foo: 'bar' },
            pageCursor: 'SOMEPAGE',
          },
        },
      });

      await waitForNextUpdate();

      expect(result.current.filters).toEqual({ foo: 'bar' });
      expect(result.current.pageCursor).toEqual('SOMEPAGE');

      act(() => {
        result.current.setFilters({ foo: 'test' });
      });

      await waitForNextUpdate();

      expect(result.current.pageCursor).toBeUndefined();
    });
  });

  describe('Performs search (and sets results)', () => {
    it('When term is set', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState,
        },
      });

      await waitForNextUpdate();

      const term = 'term';

      act(() => {
        result.current.setTerm(term);
      });

      await waitForNextUpdate();

      expect(query).toHaveBeenLastCalledWith({
        term,
        types: ['*'],
        filters: {},
      });
    });

    it('When types is set', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState,
        },
      });

      await waitForNextUpdate();

      const types = ['type'];

      act(() => {
        result.current.setTypes(types);
      });

      await waitForNextUpdate();

      expect(query).toHaveBeenLastCalledWith({
        types,
        term: '',
        filters: {},
      });
    });

    it('When filters are set', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState,
        },
      });

      await waitForNextUpdate();

      const filters = { filter: 'filter' };

      act(() => {
        result.current.setFilters(filters);
      });

      await waitForNextUpdate();

      expect(query).toHaveBeenLastCalledWith({
        filters,
        term: '',
        types: ['*'],
      });
    });

    it('When page limit is set', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState,
        },
      });

      await waitForNextUpdate();

      const pageLimit = 30;

      act(() => {
        result.current.setPageLimit(pageLimit);
      });

      await waitForNextUpdate();

      expect(query).toHaveBeenLastCalledWith({
        pageLimit,
        term: '',
        types: ['*'],
        filters: {},
      });
    });

    it('When page cursor is set', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState,
        },
      });

      await waitForNextUpdate();

      const pageCursor = 'SOMEPAGE';

      act(() => {
        result.current.setPageCursor(pageCursor);
      });

      await waitForNextUpdate();

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

      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState,
        },
      });

      await waitForNextUpdate();

      expect(result.current.fetchNextPage).toBeDefined();
      expect(result.current.fetchPreviousPage).toBeUndefined();

      act(() => {
        result.current.fetchNextPage!();
      });

      await waitForNextUpdate();

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

      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState,
        },
      });

      await waitForNextUpdate();

      expect(result.current.fetchNextPage).toBeUndefined();
      expect(result.current.fetchPreviousPage).toBeDefined();

      act(() => {
        result.current.fetchPreviousPage!();
      });

      await waitForNextUpdate();

      expect(query).toHaveBeenLastCalledWith({
        term: '',
        types: ['*'],
        filters: {},
        pageCursor: 'PREVIOUS',
      });
    });
  });
});
