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

import { ApiProvider } from '@backstage/core-app-api';
import { mockApis, TestApiRegistry } from '@backstage/test-utils';
import { act, renderHook, waitFor } from '@testing-library/react';

import { searchApiRef } from '../../api';
import { SearchContextProvider, useSearch } from '../../context';
import { useDefaultFilterValue, useAsyncFilterValues } from './hooks';
import { configApiRef } from '@backstage/core-plugin-api';

jest.useFakeTimers();

describe('SearchFilter.hooks', () => {
  describe('useDefaultFilterValue', () => {
    const configApiMock = mockApis.config({
      data: {
        search: {
          query: {
            pageLimit: 100,
          },
        },
      },
    });
    const searchApiMock = {
      query: jest.fn().mockResolvedValue({ results: [] }),
    };
    const apis = TestApiRegistry.from(
      [searchApiRef, searchApiMock],
      [configApiRef, configApiMock],
    );
    const wrapper = ({
      children,
      overrides = {},
    }: {
      children?: any;
      overrides?: any;
    }) => {
      const emptySearchContext = {
        term: '',
        types: [],
        filters: {},
      };
      return (
        <ApiProvider apis={apis}>
          <SearchContextProvider
            initialState={{ ...emptySearchContext, ...overrides }}
          >
            {children}
          </SearchContextProvider>
        </ApiProvider>
      );
    };

    it('should set non-empty string value', async () => {
      const expectedFilter = 'someField';
      const expectedValue = 'someValue';
      const { result } = renderHook(
        () => {
          useDefaultFilterValue(expectedFilter, expectedValue);
          return useSearch();
        },
        {
          wrapper,
        },
      );

      await waitFor(() => {
        expect(result.current.filters[expectedFilter]).toEqual(expectedValue);
      });
    });

    it('should set non-empty array value', async () => {
      const expectedFilter = 'someField';
      const expectedValue = ['someValue', 'anotherValue'];
      const { result } = renderHook(
        () => {
          useDefaultFilterValue(expectedFilter, expectedValue);
          return useSearch();
        },
        {
          wrapper,
        },
      );

      await waitFor(() => {
        expect(result.current.filters[expectedFilter]).toEqual(expectedValue);
      });
    });

    it('should not set undefined value', async () => {
      const expectedFilter = 'someField';
      const expectedValue = 'notEmpty';
      const { result } = renderHook(
        () => {
          useDefaultFilterValue(expectedFilter, undefined);
          return useSearch();
        },
        {
          wrapper: ({ children }) =>
            wrapper({
              children,
              overrides: {
                filters: {
                  [expectedFilter]: expectedValue,
                },
              },
            }),
        },
      );

      await waitFor(() => {
        expect(result.current.filters[expectedFilter]).toEqual(expectedValue);
      });
    });

    it('should not set null value', async () => {
      const expectedFilter = 'someField';
      const expectedValue = 'notEmpty';
      const { result } = renderHook(
        () => {
          useDefaultFilterValue(expectedFilter, null);
          return useSearch();
        },
        {
          wrapper: ({ children }) =>
            wrapper({
              children,
              overrides: {
                filters: {
                  [expectedFilter]: expectedValue,
                },
              },
            }),
        },
      );

      await waitFor(() => {
        expect(result.current.filters[expectedFilter]).toEqual(expectedValue);
      });
    });

    it('should not set empty string value', async () => {
      const expectedFilter = 'someField';
      const expectedValue = 'notEmpty';
      const { result } = renderHook(
        () => {
          useDefaultFilterValue(expectedFilter, '');
          return useSearch();
        },
        {
          wrapper: ({ children }) =>
            wrapper({
              children,
              overrides: {
                filters: {
                  [expectedFilter]: expectedValue,
                },
              },
            }),
        },
      );

      await waitFor(() => {
        expect(result.current.filters[expectedFilter]).toEqual(expectedValue);
      });
    });

    it('should not set empty array value', async () => {
      const expectedFilter = 'someField';
      const expectedValue = ['not', 'empty'];
      const { result } = renderHook(
        () => {
          useDefaultFilterValue(expectedFilter, []);
          return useSearch();
        },
        {
          wrapper: ({ children }) =>
            wrapper({
              children,
              overrides: {
                filters: {
                  [expectedFilter]: expectedValue,
                },
              },
            }),
        },
      );

      await waitFor(() => {
        expect(result.current.filters[expectedFilter]).toEqual(expectedValue);
      });
    });

    it('should not affect unrelated filters', async () => {
      const expectedFilter = 'someField';
      const expectedValue = 'someValue';
      const { result } = renderHook(
        () => {
          useDefaultFilterValue(expectedFilter, expectedValue);
          return useSearch();
        },
        {
          wrapper: ({ children }) =>
            wrapper({
              children,
              overrides: {
                filters: {
                  unrelatedField: 'unrelatedValue',
                },
              },
            }),
        },
      );

      await waitFor(() => {
        expect(result.current.filters.unrelatedField).toEqual('unrelatedValue');
      });
    });
  });

  describe('useAsyncFilterValues', () => {
    it('should immediately return given values when provided', () => {
      const givenValues = ['value1', 'value2'];
      const { result } = renderHook(() =>
        useAsyncFilterValues(undefined, '', givenValues),
      );

      expect(result.current.loading).toEqual(false);
      expect(result.current.value).toEqual(givenValues);
    });

    it('should return resolved values of provided async function', async () => {
      const expectedValues = ['value1', 'value2'];
      const asyncFn = () => Promise.resolve(expectedValues);
      const { result } = renderHook(() =>
        useAsyncFilterValues(asyncFn, '', undefined, 1000),
      );

      expect(result.current.loading).toEqual(true);

      await act(async () => {
        jest.runAllTimers();
      });

      expect(result.current.loading).toEqual(false);
      expect(result.current.value).toEqual(expectedValues);
    });

    it('should debounce method invocation', async () => {
      const expectedValues = ['value1', 'value2'];
      const asyncFn = jest.fn().mockResolvedValue(expectedValues);
      renderHook(() => useAsyncFilterValues(asyncFn, '', undefined, 1000));

      expect(asyncFn).not.toHaveBeenCalled();

      // Advance timers by 600ms
      await act(async () => {
        jest.advanceTimersByTime(600);
      });
      expect(asyncFn).not.toHaveBeenCalled();

      // Another 600ms to exceed the 1000ms debounce
      await act(async () => {
        jest.advanceTimersByTime(600);
      });
      expect(asyncFn).toHaveBeenCalled();
    });

    it('should call provided method once per provided input', async () => {
      const asyncFn = jest
        .fn()
        .mockImplementation((x: string) => Promise.resolve([x]));
      const { rerender } = renderHook(
        (props: { inputValue: string } = { inputValue: '' }) =>
          useAsyncFilterValues(asyncFn, props.inputValue, undefined, 1000),
      );

      expect(asyncFn).not.toHaveBeenCalled();
      await act(async () => {
        jest.runAllTimers();
      });
      expect(asyncFn).toHaveBeenCalledTimes(1);
      expect(asyncFn).toHaveBeenCalledWith('');

      // Re-render with different input value.
      rerender({ inputValue: 'somethingElse' });
      await act(async () => {
        jest.runAllTimers();
      });
      expect(asyncFn).toHaveBeenCalledTimes(2);
      expect(asyncFn).toHaveBeenLastCalledWith('somethingElse');
    });

    it('should not call provided method more than once when re-rendered with same input', async () => {
      const expectedValues = ['value1', 'value2'];
      const asyncFn = jest.fn().mockResolvedValue(expectedValues);
      const { rerender } = renderHook(
        (props: { inputValue: string } = { inputValue: '' }) =>
          useAsyncFilterValues(asyncFn, props.inputValue, undefined, 1000),
      );

      expect(asyncFn).not.toHaveBeenCalled();

      await act(async () => {
        jest.runAllTimers();
      });
      expect(asyncFn).toHaveBeenCalledTimes(1);

      // Re-render multiple times with the same input.
      rerender();
      expect(asyncFn).toHaveBeenCalledTimes(1);
      rerender();
      expect(asyncFn).toHaveBeenCalledTimes(1);
    });
  });
});
