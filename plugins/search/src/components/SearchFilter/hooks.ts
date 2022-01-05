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

import { useEffect, useRef } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useDebounce from 'react-use/lib/useDebounce';
import { useSearch } from '../SearchContext';

/**
 * Utility hook for either asynchronously loading filter values from a given
 * function or synchronously providing a given list of default values.
 */
export const useAsyncFilterValues = (
  fn: ((partial: string) => Promise<string[]>) | undefined,
  inputValue: string,
  defaultValues: string[] = [],
  debounce: number = 250,
) => {
  const valuesMemo = useRef<Record<string, string[]>>({});
  const definiteFn = fn || (() => Promise.resolve([]));

  const [state, callback] = useAsyncFn(definiteFn, [inputValue], {
    loading: true,
  });

  // Do not invoke the given function more than necessary.
  useDebounce(
    () => {
      // Performance optimization: only invoke the callback once per inputValue
      // for the lifetime of the hook/component.
      if (valuesMemo.current[inputValue] === undefined) {
        callback(inputValue).then(values => {
          valuesMemo.current[inputValue] = values;
        });
      }
    },
    debounce,
    [callback, inputValue],
  );

  // Immediately return the default values if they are provided.
  if (defaultValues.length) {
    return {
      loading: false,
      value: defaultValues,
    };
  }

  // Immediately return a memoized value if it is set.
  if (valuesMemo.current[inputValue] !== undefined) {
    return {
      loading: false,
      value: valuesMemo.current[inputValue],
    };
  }

  return state;
};

/**
 * Utility hook for applying a given default value to the search context.
 */
export const useDefaultFilterValue = (
  name: string,
  defaultValue?: string | string[] | null,
) => {
  const { setFilters } = useSearch();

  useEffect(() => {
    const defaultIsEmpty = !defaultValue;
    const defaultIsEmptyArray =
      Array.isArray(defaultValue) && defaultValue.length === 0;

    if (!defaultIsEmpty && !defaultIsEmptyArray) {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: defaultValue,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
