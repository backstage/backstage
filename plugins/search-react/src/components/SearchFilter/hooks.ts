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

import { useEffect, useRef } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useDebounce from 'react-use/lib/useDebounce';

import { useSearch } from '../../context';

/**
 * Utility hook for either asynchronously loading filter values from a given
 * function or synchronously providing a given list of default values.
 *
 * @public
 */
export const useAsyncFilterValues = (
  fn: ((partial: string) => Promise<string[]>) | undefined,
  inputValue: string,
  defaultValues: string[] = [],
  debounce: number = 250,
) => {
  const valuesMemo = useRef<Record<string, string[] | Promise<string[]>>>({});
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
        valuesMemo.current[inputValue] = callback(inputValue).then(values => {
          // Override the value for future immediate returns.
          valuesMemo.current[inputValue] = values;
          return values;
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

  // Immediately return a memoized value if it is set (and not a promise).
  const possibleValue = valuesMemo.current[inputValue];
  if (Array.isArray(possibleValue)) {
    return {
      loading: false,
      value: possibleValue,
    };
  }

  return state;
};

/**
 * Utility hook for applying a given default value to the search context.
 *
 * @public
 */
export const useDefaultFilterValue = (
  name: string,
  defaultValue?: string | string[] | null,
) => {
  const { setFilters } = useSearch();

  useEffect(() => {
    if (defaultValue && [defaultValue].flat().length > 0) {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: defaultValue,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
