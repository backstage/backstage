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

import React from 'react';
import qs from 'qs';
import { Outlet, useLocation } from 'react-router';
import { SearchContextProvider, useSearch } from '../SearchContext';
import { JsonObject } from '@backstage/config';

export const UrlUpdater = () => {
  const { term, types, pageCursor, filters } = useSearch();

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

  return null;
};

export const SearchPageNext = () => {
  const location = useLocation();
  const query = qs.parse(location.search.substring(1), { arrayLimit: 0 }) || {};
  const filters = (query.filters as JsonObject) || {};
  const queryString = (query.query as string) || '';
  const pageCursor = (query.pageCursor as string) || '';

  const initialState = {
    term: queryString || '',
    types: [],
    pageCursor,
    filters,
  };

  return (
    <SearchContextProvider initialState={initialState}>
      <UrlUpdater />
      <Outlet />
    </SearchContextProvider>
  );
};
