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
import { useQueryParamState } from '@backstage/core';
import { SearchContextProvider } from '../SearchContext';
import { JsonObject } from '@backstage/config';

export const SearchPageNext = () => {
  const location = useLocation();
  const [queryString] = useQueryParamState<string>('query');
  const filters = (qs.parse(location.search.substring(1), { arrayLimit: 0 })
    .filters || {}) as JsonObject;
  const initialState = {
    term: queryString || '',
    types: [],
    pageCursor: '',
    filters,
  };

  return (
    <SearchContextProvider initialState={initialState}>
      <Outlet />
    </SearchContextProvider>
  );
};
