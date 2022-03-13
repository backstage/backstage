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
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useElementFilter } from '@backstage/core-plugin-api';
import { SearchResult } from '@backstage/plugin-search-common';
import { List } from '@material-ui/core';
import React from 'react';
import { RESULT_EXTENSION_KEY } from '../../extensions';
import { useSearch } from '../SearchContext';

type Props = {
  children: ((results: { results: SearchResult[] }) => JSX.Element) | JSX.Element | JSX.Element[];
};

export const SearchResultComponent = ({ children }: Props) => {
  const {
    result: { loading, error, value },
    pageNumber,
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

  if (typeof children === 'function') {
    return <>{children({ results: value.results })}</>;
  }

  return <ComposedSearchResults configuration={children} results={value.results} page={pageNumber} />;
};

const ComposedSearchResults = ({ configuration, results, page }: { configuration: JSX.Element | JSX.Element[]; results: SearchResult[]; page: number }) => {
  const resultExtensions = useElementFilter(configuration, elements =>
    elements
      .findComponentData<{ filterPredicate: Function }>({
        key: RESULT_EXTENSION_KEY,
      })
  );
  const resultExtensionElements = useElementFilter(configuration, elements =>
    elements
      .selectByComponentData({
        key: RESULT_EXTENSION_KEY,
      })
      .getElements()
  );

  return <List>
    {results.map((result, resultIndex) => {
      const rank = (page * results.length) + resultIndex + 1;
      const CandidateComponent = resultExtensions.map((extension, extIndex) => {
        const { filterPredicate } = extension;
        const element = resultExtensionElements[extIndex];

        if (filterPredicate(result) && React.isValidElement(element)) {
          return React.cloneElement(element, {
            result: result.document,
            rank: rank,
            key: result.document.location,
          });
        }

        return null;
      }).filter(c => c !== null);
      return CandidateComponent[0];
    })}
  </List>;
}

export { SearchResultComponent as SearchResult };
