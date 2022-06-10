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

import React from 'react';

import {
  EmptyState,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { AnalyticsContext } from '@backstage/core-plugin-api';
import { SearchResult } from '@backstage/plugin-search-common';

import { useSearch } from '../../context';

/**
 * Props for {@link SearchResultComponent}
 *
 * @public
 */
export type SearchResultProps = {
  children: (results: { results: SearchResult[] }) => JSX.Element;
};

/**
 * A component returning the search result.
 *
 * @public
 */
export const SearchResultComponent = ({ children }: SearchResultProps) => {
  const {
    result: { loading, error, value },
  } = useSearch();

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return (
      <ResponseErrorPanel
        title="Error encountered while fetching search results"
        error={error}
      />
    );
  }

  if (!value?.results.length) {
    return <EmptyState missing="data" title="Sorry, no results were found" />;
  }

  return <>{children({ results: value.results })}</>;
};

/**
 * @public
 */
const HigherOrderSearchResult = (props: SearchResultProps) => {
  return (
    <AnalyticsContext
      attributes={{
        pluginId: 'search',
        extension: 'SearchResult',
      }}
    >
      <SearchResultComponent {...props} />
    </AnalyticsContext>
  );
};

export { HigherOrderSearchResult as SearchResult };
