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

import { isEqual } from 'lodash';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from 'react-use';

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

function extractState(queryString: string, stateName: string): any | undefined {
  const queryParams = parse(queryString);

  return queryParams[stateName];
}

function joinQueryString(
  queryString: string,
  stateName: string,
  state: any,
): string {
  const queryParams = {
    ...parse(queryString),
    [stateName]: state,
  };
  return stringify(queryParams);
}

type SetQueryParams<T> = (params: T) => void;

export function useQueryParamState<T>(
  stateName: string,
  debounceTime: number = 100,
): [T | undefined, SetQueryParams<T>] {
  const navigate = useNavigate();
  const location = useLocation();
  const [queryParamState, setQueryParamState] = useState<T>(
    extractState(location.search, stateName),
  );

  useEffect(() => {
    const newState = extractState(location.search, stateName);

    setQueryParamState(oldState =>
      isEqual(newState, oldState) ? oldState : newState,
    );
  }, [location, stateName]);

  useDebounce(
    () => {
      const queryString = joinQueryString(
        location.search,
        stateName,
        queryParamState,
      );

      if (location.search !== queryString) {
        navigate({ ...location, search: `?${queryString}` }, { replace: true });
      }
    },
    debounceTime,
    [queryParamState],
  );

  return [queryParamState, setQueryParamState];
}
