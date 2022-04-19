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

import { JsonObject } from '@backstage/types';
import { useApi, AnalyticsContext } from '@backstage/core-plugin-api';
import { SearchResultSet } from '@backstage/plugin-search-common';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import useAsync, { AsyncState } from 'react-use/lib/useAsync';
import usePrevious from 'react-use/lib/usePrevious';
import { searchApiRef } from '../api';

/**
 *
 * @public
 */
export type SearchContextValue = {
  result: AsyncState<SearchResultSet>;
  setTerm: React.Dispatch<React.SetStateAction<string>>;
  setTypes: React.Dispatch<React.SetStateAction<string[]>>;
  setFilters: React.Dispatch<React.SetStateAction<JsonObject>>;
  setPageCursor: React.Dispatch<React.SetStateAction<string | undefined>>;
  fetchNextPage?: React.DispatchWithoutAction;
  fetchPreviousPage?: React.DispatchWithoutAction;
} & SearchContextState;

/**
 *
 * @public
 */
export type SearchContextState = {
  term: string;
  types: string[];
  filters: JsonObject;
  pageCursor?: string;
};

const SearchContext = createVersionedContext<{
  1: SearchContextValue;
}>('search-context');

/**
 * @public
 *
 * React hook which provides the search context
 */
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchContextProvider');
  }

  const value = context.atVersion(1);
  if (!value) {
    throw new Error('No SearchContext v1 found');
  }
  return value;
};

/**
 * The initial state of `SearchContextProvider`.
 *
 */
const searchInitialState: SearchContextState = {
  term: '',
  pageCursor: undefined,
  filters: {},
  types: [],
};

/**
 * Props for {@link SearchContextProvider}
 *
 * @public
 */
export type SearchContextProviderProps = PropsWithChildren<{
  initialState?: SearchContextState;
}>;

/**
 * @public
 *
 * Search context provider which gives you access to shared state between search components
 */
export const SearchContextProvider = (props: SearchContextProviderProps) => {
  const { initialState = searchInitialState, children } = props;
  const searchApi = useApi(searchApiRef);
  const [pageCursor, setPageCursor] = useState<string | undefined>(
    initialState.pageCursor,
  );
  const [filters, setFilters] = useState<JsonObject>(initialState.filters);
  const [term, setTerm] = useState<string>(initialState.term);
  const [types, setTypes] = useState<string[]>(initialState.types);

  const prevTerm = usePrevious(term);

  const result = useAsync(
    () =>
      searchApi.query({
        term,
        filters,
        pageCursor,
        types,
      }),
    [term, filters, types, pageCursor],
  );

  const hasNextPage =
    !result.loading && !result.error && result.value?.nextPageCursor;
  const hasPreviousPage =
    !result.loading && !result.error && result.value?.previousPageCursor;
  const fetchNextPage = useCallback(() => {
    setPageCursor(result.value?.nextPageCursor);
  }, [result.value?.nextPageCursor]);
  const fetchPreviousPage = useCallback(() => {
    setPageCursor(result.value?.previousPageCursor);
  }, [result.value?.previousPageCursor]);

  useEffect(() => {
    // Any time a term is reset, we want to start from page 0.
    if (term && prevTerm && term !== prevTerm) {
      setPageCursor(undefined);
    }
  }, [term, prevTerm, initialState.pageCursor]);

  const value: SearchContextValue = {
    result,
    filters,
    setFilters,
    term,
    setTerm,
    types,
    setTypes,
    pageCursor,
    setPageCursor,
    fetchNextPage: hasNextPage ? fetchNextPage : undefined,
    fetchPreviousPage: hasPreviousPage ? fetchPreviousPage : undefined,
  };

  const versionedValue = createVersionedValueMap({ 1: value });

  return (
    <AnalyticsContext attributes={{ searchTypes: types.sort().join(',') }}>
      <SearchContext.Provider value={versionedValue} children={children} />
    </AnalyticsContext>
  );
};
