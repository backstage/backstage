/*
 * Copyright 2025 The Backstage Authors
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

import { useMemo, useState, useCallback } from 'react';
import type { QueryOptions, QueryState } from './types';

function useControlledStateHelper<T, TControlled = T, TInitial = TControlled>(
  initialValue: TInitial,
  controlledValue: TControlled | undefined,
  onChange: ((value: T) => void) | undefined,
) {
  const [internalValue, setInternalValue] = useState<TInitial>(initialValue);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const setValue = useCallback(
    (newValue: T) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue as unknown as TInitial);
      }
      if (onChange) {
        onChange(newValue);
      }
    },
    [controlledValue, onChange],
  );

  return [value, setValue] as const;
}

/** @internal */
export function useQueryState<TFilter>(
  options: QueryOptions<TFilter>,
): QueryState<TFilter> {
  const [sort, setSort] = useControlledStateHelper(
    options.initialSort ?? null,
    options.sort,
    options.onSortChange,
  );
  const [filter, setFilter] = useControlledStateHelper(
    options.initialFilter,
    options.filter,
    options.onFilterChange,
  );
  const [search, setSearch] = useControlledStateHelper(
    options.initialSearch ?? '',
    options.search,
    options.onSearchChange,
  );

  return useMemo(
    () => ({ sort, setSort, filter, setFilter, search, setSearch }),
    [sort, setSort, filter, setFilter, search, setSearch],
  );
}
