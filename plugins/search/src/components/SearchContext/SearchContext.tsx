/*
 * Copyright 2021 Spotify AB
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

import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core';
import { SearchQuery, SearchResultSet } from '@backstage/search-common';
import { searchApiRef } from '../../apis';
import { AsyncState } from 'react-use/lib/useAsync';

type SearchContextValue = {
  resultState: AsyncState<SearchResultSet>;
  queryState: SearchQuery;
  setQueryState: React.Dispatch<React.SetStateAction<SearchQuery>>;
};

const SearchContext = createContext({} as SearchContextValue);

export const SearchContextProvider = ({
  initialState = {
    term: '',
    pageCursor: '',
    types: ['*'],
  },
  children,
}: PropsWithChildren<{ initialState?: any }>) => {
  const searchApi = useApi(searchApiRef);
  const [queryState, setQueryState] = useState(initialState);

  const resultState = useAsync(
    () =>
      searchApi._alphaPerformSearch({
        term: queryState.term,
        pageCursor: queryState.pageCursor,
      }),
    [queryState.term],
  );

  const value: SearchContextValue = { resultState, queryState, setQueryState };

  return <SearchContext.Provider value={value} children={children} />;
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchContextProvider');
  }
  return context;
};
