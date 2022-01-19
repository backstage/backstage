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

import { useApi } from '@backstage/core-plugin-api';
import { render, screen, waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import React from 'react';
import {
  SearchContextProvider,
  useCachedSearchQuery,
  useSearch,
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
    filters: {},
    types: ['*'],
  };

  beforeEach(() => {
    query.mockReset();
    (useApi as jest.Mock).mockReset();
    (useApi as jest.Mock).mockReturnValue({ query });
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

  it('Resets cursor when term is set (and different from previous)', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
      wrapper,
      initialProps: {
        initialState: {
          ...initialState,
          pageCursor: 'SOMEPAGE',
        },
      },
    });

    await waitForNextUpdate();

    expect(result.current.pageCursor).toEqual('SOMEPAGE');

    act(() => {
      result.current.setTerm('first term');
    });

    act(() => {
      result.current.setPageCursor('OTHERPAGE');
    });

    await waitForNextUpdate();

    expect(result.current.pageCursor).toEqual('OTHERPAGE');

    act(() => {
      result.current.setTerm('second term');
    });

    await waitForNextUpdate();

    expect(result.current.pageCursor).toEqual(undefined);
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
        filters: {},
        types: ['*'],
        term,
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
        types: ['*'],
        term: '',
      });
    });

    it('When page is set', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState,
        },
      });

      await waitForNextUpdate();

      act(() => {
        result.current.setPageCursor('SOMEPAGE');
      });

      await waitForNextUpdate();

      expect(query).toHaveBeenLastCalledWith({
        filters: {},
        types: ['*'],
        pageCursor: 'SOMEPAGE',
        term: '',
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
        filters: {},
        term: '',
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
    });

    it('When fetchNextPage is invoked, concatenate results', async () => {
      query
        .mockResolvedValueOnce({
          results: [1, 2, 3],
          nextPageCursor: 'NEXT',
        })
        .mockResolvedValueOnce({
          results: [4, 5, 6],
          prevPageCursor: 'PREV',
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

      expect(query).toHaveBeenCalledTimes(1);
      expect(query).toHaveBeenNthCalledWith(1, {
        types: ['*'],
        filters: {},
        term: '',
      });
      expect(result.current.result.value).toEqual({
        results: [1, 2, 3],
        nextPageCursor: 'NEXT',
      });

      act(() => {
        result.current.fetchNextPage!();
      });

      await waitForNextUpdate();
      expect(query).toHaveBeenCalledTimes(2);
      expect(query).toHaveBeenNthCalledWith(2, {
        types: ['*'],
        filters: {},
        term: '',
        pageCursor: 'NEXT',
      });

      expect(result.current.result.value).toEqual({
        results: [1, 2, 3, 4, 5, 6],
        prevPageCursor: 'PREV',
      });
    });

    it('provides function for fetch the previous page', async () => {
      query.mockResolvedValue({
        results: [],
        previousPageCursor: 'PREV',
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
        types: ['*'],
        filters: {},
        term: '',
        pageCursor: 'PREV',
      });
    });
  });
});

describe('useCachedSearchQuery', () => {
  const query = jest.fn();
  beforeEach(() => {
    query.mockReset();
    (useApi as jest.Mock).mockReset();
    (useApi as jest.Mock).mockReturnValue({ query });
  });

  it('should invoke searchApi.query', async () => {
    query
      .mockResolvedValueOnce({
        results: [1, 2, 3],
        nextPageCursor: 'NEXT',
      })
      .mockResolvedValueOnce({
        results: [4, 5, 6],
        prevPageCursor: 'PREV',
      });

    const { result } = renderHook(() => useCachedSearchQuery());

    await expect(
      result.current({ pageCursor: 'cursor', term: '' }),
    ).resolves.toEqual({ results: [1, 2, 3], nextPageCursor: 'NEXT' });
  });

  it('should concatenate the results once invoked multiple times', async () => {
    query
      .mockResolvedValueOnce({
        results: [1, 2, 3],
        nextPageCursor: 'NEXT',
      })
      .mockResolvedValueOnce({
        results: [4, 5, 6],
        nextPageCursor: 'NEXTNEXT',
        prevPageCursor: 'PREV',
      })
      .mockResolvedValueOnce({
        results: [7, 8, 9],
        prevPageCursor: 'PREVPREV',
      });

    const { result } = renderHook(() => useCachedSearchQuery());

    await expect(
      result.current({ pageCursor: 'cursor', term: '' }),
    ).resolves.toEqual({ results: [1, 2, 3], nextPageCursor: 'NEXT' });
    await expect(
      result.current({ pageCursor: 'cursor', term: '' }),
    ).resolves.toEqual({
      results: [1, 2, 3, 4, 5, 6],
      nextPageCursor: 'NEXTNEXT',
      prevPageCursor: 'PREV',
    });
    await expect(
      result.current({ pageCursor: 'cursor', term: '' }),
    ).resolves.toEqual({
      results: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      prevPageCursor: 'PREVPREV',
    });
  });

  it('should reset the cached values once term, filters or types change', async () => {
    query
      .mockResolvedValueOnce({
        results: [1, 2, 3],
      })
      .mockResolvedValueOnce({
        results: [4, 5, 6],
      })
      .mockResolvedValueOnce({
        results: ['a', 'b', 'c'],
      })
      .mockResolvedValueOnce({
        results: [true, false, true],
        nextPageCursor: 'NEXT',
      })
      .mockResolvedValueOnce({
        results: [true, false, true],
      });

    const { result } = renderHook(() => useCachedSearchQuery());

    await expect(
      result.current({ pageCursor: 'cursor', term: '' }),
    ).resolves.toEqual({ results: [1, 2, 3] });
    await expect(
      result.current({ pageCursor: 'cursor', term: 'just a term' }),
    ).resolves.toEqual({
      results: [4, 5, 6],
    });

    await expect(
      result.current({
        pageCursor: 'cursor',
        term: 'just a term',
        filters: { something: 'something' },
      }),
    ).resolves.toEqual({
      results: ['a', 'b', 'c'],
    });

    await expect(
      result.current({
        pageCursor: 'cursor',
        term: 'just a term',
        filters: { something: 'something' },
        types: ['cat'],
      }),
    ).resolves.toEqual({
      results: [true, false, true],
      nextPageCursor: 'NEXT',
    });

    await expect(
      result.current({
        pageCursor: 'cursor',
        term: 'just a term',
        filters: { something: 'something' },
        types: ['cat'],
      }),
    ).resolves.toEqual({
      results: [true, false, true, true, false, true],
    });
  });

  it('should reset the cached if a previous cursor is passed', async () => {
    const firstResult = {
      results: [1, 2, 3],
      nextPageCursor: 'NEXT',
    };
    const secondResult = {
      results: [4, 5, 6],
      prevPageCursor: 'PREV',
    };
    query
      .mockResolvedValueOnce(firstResult)
      .mockResolvedValueOnce(secondResult)
      .mockResolvedValueOnce(firstResult);

    const { result } = renderHook(() => useCachedSearchQuery());

    await expect(result.current({ term: '' })).resolves.toEqual({
      results: [1, 2, 3],
      nextPageCursor: 'NEXT',
    });
    await expect(
      result.current({ pageCursor: 'NEXT', term: '' }),
    ).resolves.toEqual({
      results: [1, 2, 3, 4, 5, 6],
      prevPageCursor: 'PREV',
    });
    await expect(
      result.current({ pageCursor: 'PREV', isPrevious: true, term: '' }),
    ).resolves.toEqual({
      results: [1, 2, 3],
      nextPageCursor: 'NEXT',
    });
  });
});
