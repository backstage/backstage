/*
 * Copyright 2020 Spotify AB
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

import { debounce } from 'lodash';
import qs from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function stringify(queryParams: any): string {
  // Even though these setting don't look nice (e.g. escaped brackets), we should keep
  // them this way. The current syntax handles all cases, including variable types with
  // arrays or strings.
  return qs.stringify(queryParams, {
    strictNullHandling: true,
  });
}

function parse(queryString: string): any {
  return qs.parse(queryString, {
    ignoreQueryPrefix: true,
    strictNullHandling: true,
  });
}

type SetQueryParams<T> = (params: T) => void;

export function useQueryParams<T>(): [T, SetQueryParams<T>] {
  const navigate = useNavigate();
  const location = useLocation();
  const [queryParams, setQueryParams] = useState(parse(location.search));

  const updateQueryString = useCallback(
    (q: string) =>
      debounce(queryString => {
        if (location.search !== queryString) {
          navigate(
            { ...location, search: `?${queryString}` },
            { replace: true },
          );
        }
      }, 100)(q),
    // We don't have to add location and navigate to the deps here
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    const queryString = stringify(queryParams);

    updateQueryString(queryString);
  }, [queryParams, updateQueryString]);

  return [queryParams, setQueryParams];
}
