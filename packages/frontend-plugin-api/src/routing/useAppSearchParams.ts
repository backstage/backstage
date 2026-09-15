/*
 * Copyright 2026 The Backstage Authors
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

import { useCallback, useMemo, useRef } from 'react';
import type { AppNavigateOptions } from './AppLocation';
import { useAppLocation } from './useAppLocation';
import { useAppNavigate } from './useAppNavigate';

/** Initial query parameters accepted by {@link useAppSearchParams}. @public */
export type AppSearchParamsInit =
  | string
  | URLSearchParams
  | [string, string][]
  | Record<string, string | string[]>;

/** Updates the current page's query parameters. @public */
export type SetAppSearchParams = (
  next?:
    | AppSearchParamsInit
    | ((previous: URLSearchParams) => AppSearchParamsInit),
  options?: AppNavigateOptions,
) => void;

function createSearchParams(init: AppSearchParamsInit = ''): URLSearchParams {
  if (
    typeof init === 'string' ||
    Array.isArray(init) ||
    init instanceof URLSearchParams
  ) {
    return new URLSearchParams(init);
  }
  return new URLSearchParams(
    Object.entries(init).flatMap(([key, value]) =>
      (Array.isArray(value) ? value : [value]).map(item => [key, item]),
    ),
  );
}

/**
 * Reads and updates query parameters using Backstage navigation, without a
 * page router. Falls back to React Router navigation in the old frontend system.
 *
 * Defaults supply missing values until the first update and do not change the
 * URL. Updates replace the query on the current pathname, clear the fragment,
 * and push a history entry unless replacement is requested. Functional updates receive
 * a copy of the parameters from the current render. Like React Router's query
 * setter, multiple calls in one render do not queue state updates.
 *
 * @public
 */
export function useAppSearchParams(
  defaultInit?: AppSearchParamsInit,
): [URLSearchParams, SetAppSearchParams] {
  const location = useAppLocation();
  const navigate = useAppNavigate();
  const defaults = useRef(createSearchParams(defaultInit));
  const hasSet = useRef(false);
  const searchParams = useMemo(() => {
    const params = new URLSearchParams(location.search);
    if (!hasSet.current) {
      defaults.current.forEach((_, key) => {
        if (!params.has(key)) {
          defaults.current
            .getAll(key)
            .forEach(value => params.append(key, value));
        }
      });
    }
    return params;
  }, [location.search]);
  const setSearchParams = useCallback<SetAppSearchParams>(
    (next, options) => {
      const params = createSearchParams(
        typeof next === 'function'
          ? next(new URLSearchParams(searchParams))
          : next,
      );
      hasSet.current = true;
      navigate(`${location.pathname}?${params}`, options);
    },
    [navigate, location.pathname, searchParams],
  );
  return [searchParams, setSearchParams];
}
