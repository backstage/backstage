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

import {
  EmptyState,
  ResponseErrorPanel,
  useAsyncState,
} from '@backstage/core-components';
import { SearchResult } from '@backstage/search-common';
import React from 'react';
import { useSearch } from '../SearchContext';

type Props = {
  children: (results: { results: SearchResult[] }) => JSX.Element;
};

export const SearchResultComponent = ({ children }: Props) => {
  const { result } = useSearch();

  const asyncState = useAsyncState(result, {
    error: ({ error }) => (
      <ResponseErrorPanel
        title="Error encountered while fetching search results"
        error={error}
      />
    ),
  });

  if (asyncState.fallback) {
    return asyncState.fallback;
  }
  const { value } = asyncState;

  if (!value.results.length) {
    return <EmptyState missing="data" title="Sorry, no results were found" />;
  }

  return <>{children({ results: value.results })}</>;
};

export { SearchResultComponent as SearchResult };
