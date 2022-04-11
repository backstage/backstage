/*
 * Copyright 2021 The Backstage Authors
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
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import useAsync, { AsyncState } from 'react-use/lib/useAsync';
import usePrevious from 'react-use/lib/usePrevious';
import { searchApiRef } from '../../apis';

type SearchContextValue = {
  result: AsyncState<SearchResultSet>;
  setTerm: React.Dispatch<React.SetStateAction<string>>;
  setTypes: React.Dispatch<React.SetStateAction<string[]>>;
  setFilters: React.Dispatch<React.SetStateAction<JsonObject>>;
  setPageCursor: React.Dispatch<React.SetStateAction<string | undefined>>;
  fetchNextPage?: React.DispatchWithoutAction;
  fetchPreviousPage?: React.DispatchWithoutAction;
} & SearchContextState;

/**
 * The initial state of `SearchContextProvider`.
 *
 * @public
 */
export type SearchContextState = {
  term: string;
  types: string[];
  filters: JsonObject;
  pageCursor?: string;
};

/**
 * @deprecated import from `@backstage/plugin-search-react` instead
 */
export const SearchContext = createContext<SearchContextValue | undefined>(
  undefined,
);

const searchInitialState: SearchContextState = {
  term: '',
  pageCursor: undefined,
  filters: {},
  types: [],
};

/**
 * @deprecated import from `@backstage/plugin-search-react` instead
 */
export const SearchContextProvider = ({
  initialState = searchInitialState,
  children,
}: PropsWithChildren<{ initialState?: SearchContextState }>) => {
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

  return (
    <AnalyticsContext attributes={{ searchTypes: types.sort().join(',') }}>
      <SearchContext.Provider value={value} children={children} />
    </AnalyticsContext>
  );
};

/**
 * @deprecated import from "@backstage/plugin-search-react" instead
 */
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchContextProvider');
  }
  return context;
};
