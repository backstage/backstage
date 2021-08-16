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

import { JsonObject } from '@backstage/config';
import { useApi } from '@backstage/core-plugin-api';
import { SearchResultSet } from '@backstage/search-common';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAsync, usePrevious } from 'react-use';
import { AsyncState } from 'react-use/lib/useAsync';
import { searchApiRef } from '../../apis';

type Page = { limit?: number; offset?: number };

type SearchContextValue = {
  result: AsyncState<SearchResultSet>;
  term: string;
  setTerm: React.Dispatch<React.SetStateAction<string>>;
  types: string[];
  setTypes: React.Dispatch<React.SetStateAction<string[]>>;
  filters: JsonObject;
  setFilters: React.Dispatch<React.SetStateAction<JsonObject>>;
  page: Page;
  setPage: React.Dispatch<React.SetStateAction<Page>>;
};

type SettableSearchContext = Omit<
  SearchContextValue,
  'result' | 'setTerm' | 'setTypes' | 'setFilters' | 'setPage'
>;

export const SearchContext = createContext<SearchContextValue | undefined>(
  undefined,
);

export const SearchContextProvider = ({
  initialState = {
    term: '',
    page: {},
    filters: {},
    types: [],
  },
  children,
}: PropsWithChildren<{ initialState?: SettableSearchContext }>) => {
  const searchApi = useApi(searchApiRef);
  const [page, setPage] = useState<Page>(initialState.page);
  const [filters, setFilters] = useState<JsonObject>(initialState.filters);
  const [term, setTerm] = useState<string>(initialState.term);
  const [types, setTypes] = useState<string[]>(initialState.types);
  const prevTerm = usePrevious(term);

  const result = useAsync(
    () =>
      searchApi.query({
        term,
        filters,
        offset: page?.offset,
        limit: page?.limit,
        types,
      }),
    [term, filters, types, page],
  );

  useEffect(() => {
    // Any time a term is reset, we want to start from page 0.
    if (term && prevTerm && term !== prevTerm) {
      setPage(initialState.page);
    }
  }, [term, prevTerm, initialState.page]);

  const value: SearchContextValue = {
    result,
    filters,
    setFilters,
    term,
    setTerm,
    types,
    setTypes,
    page,
    setPage,
  };

  return <SearchContext.Provider value={value} children={children} />;
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchContextProvider');
  }
  return context;
};
