/*
 * Copyright 2023 The Backstage Authors
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

import { useEffect } from 'react';
import usePrevious from 'react-use/esm/usePrevious';
import qs from 'qs';
import { useLocation } from 'react-router-dom';
import { useSearch } from '@backstage/plugin-search-react';
import { JsonObject } from '@backstage/types';

export const UrlUpdater = () => {
  const location = useLocation();
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
    if (location.search === prevQueryParams) {
      return;
    }

    const query =
      qs.parse(location.search.substring(1), { arrayLimit: 0 }) || {};

    if (query.filters) {
      setFilters(query.filters as JsonObject);
    }

    if (query.query) {
      setTerm(query.query as string);
    }

    if (query.pageCursor) {
      setPageCursor(query.pageCursor as string);
    }

    if (query.types) {
      setTypes(query.types as string[]);
    }
  }, [prevQueryParams, location, setTerm, setTypes, setPageCursor, setFilters]);

  useEffect(() => {
    const newParams = qs.stringify(
      {
        query: term,
        types,
        pageCursor,
        filters,
      },
      { arrayFormat: 'brackets' },
    );
    const newUrl = `${window.location.pathname}?${newParams}`;

    // We directly manipulate window history here in order to not re-render
    // infinitely (state => location => state => etc). The intention of this
    // code is just to ensure the right query/filters are loaded when a user
    // clicks the "back" button after clicking a result.
    window.history.replaceState(null, document.title, newUrl);
  }, [term, types, pageCursor, filters]);

  return null;
};
