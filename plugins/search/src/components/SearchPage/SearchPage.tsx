/*
 * Copyright 2020 The Backstage Authors
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

import {
  appHistoryApiRef,
  useApiHolder,
  useAppLocation,
} from '@backstage/frontend-plugin-api';

import { useEffect, useRef } from 'react';
import usePrevious from 'react-use/esm/usePrevious';
import qs from 'qs';
import { useOutlet } from 'react-router-dom';
import {
  SearchContextProvider,
  useSearch,
} from '@backstage/plugin-search-react';
import { JsonObject } from '@backstage/types';

export const UrlUpdater = () => {
  const location = useAppLocation();
  const appHistory = useApiHolder().get(appHistoryApiRef);
  const observedSearch = useRef<string>();
  const {
    term,
    setTerm,
    types,
    setTypes,
    pageCursor,
    setPageCursor,
    filters,
    setFilters,
  } = useSearch();

  const prevQueryParams = usePrevious(location.search);
  useEffect(() => {
    // Only respond to changes to url query params
    if (appHistory || location.search === prevQueryParams) {
      return;
    }

    const query =
      qs.parse(location.search.substring(1), { arrayLimit: 10000 }) || {};

    if (query.filters) {
      setFilters(query.filters as JsonObject);
    }

    if (query.query) {
      setTerm(query.query as string);
    }

    if (query.pageCursor) {
      setPageCursor(query.pageCursor as string);
    }

    setTypes(query.types ? (query.types as string[]) : []);
  }, [
    appHistory,
    prevQueryParams,
    location,
    setTerm,
    setTypes,
    setPageCursor,
    setFilters,
  ]);

  useEffect(() => {
    // An external navigation restores every search field, including removed
    // parameters. Apply it before writing local state back to app history.
    if (appHistory && observedSearch.current !== location.search) {
      observedSearch.current = location.search;
      const query = qs.parse(location.search.substring(1), {
        arrayLimit: 10000,
      });
      setTerm(typeof query.query === 'string' ? query.query : '');
      setTypes(Array.isArray(query.types) ? (query.types as string[]) : []);
      setFilters(query.filters ? (query.filters as JsonObject) : {});
      setPageCursor(
        typeof query.pageCursor === 'string' ? query.pageCursor : undefined,
      );
      return;
    }

    const newParams = qs.stringify(
      { query: term, types, pageCursor, filters },
      { arrayFormat: 'brackets' },
    );
    const search = newParams ? `?${newParams}` : '';
    if (appHistory) {
      if (appHistory.location.search !== search) {
        // Mark this write before notifying subscribers, so it is not treated
        // as an external navigation on the next render.
        observedSearch.current = search;
        appHistory.navigate(appHistory.location.pathname + search, {
          replace: true,
          state: appHistory.location.state,
        });
      }
    } else {
      window.history.replaceState(
        window.history.state,
        document.title,
        window.location.pathname + search,
      );
    }
  }, [
    term,
    types,
    pageCursor,
    filters,
    appHistory,
    location.search,
    setTerm,
    setTypes,
    setPageCursor,
    setFilters,
  ]);

  return null;
};

/**
 * @public
 */
export const SearchPage = () => {
  const outlet = useOutlet();

  return (
    <SearchContextProvider>
      <UrlUpdater />
      {outlet}
    </SearchContextProvider>
  );
};
