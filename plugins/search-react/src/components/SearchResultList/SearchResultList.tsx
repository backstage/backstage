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

import React, { ReactNode } from 'react';

import { List, ListItem, ListProps } from '@material-ui/core';

import {
  EmptyState,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { AnalyticsContext } from '@backstage/core-plugin-api';
import { SearchQuery, SearchResult } from '@backstage/plugin-search-common';

import { DefaultResultListItem } from '../DefaultResultListItem';
import { SearchResultState } from '../SearchResult';

/**
 * Props for {@link SearchResultListLayout}
 * @public
 */
export type SearchResultListLayoutProps = ListProps & {
  /**
   * Search results to be rendered as a list.
   */
  resultItems?: SearchResult[];
  /**
   * Function to customize how result items are rendered.
   */
  renderResultItem?: (
    value: SearchResult,
    index: number,
    array: SearchResult[],
  ) => JSX.Element | null;
  /**
   * If defined, will render a default error panel.
   */
  error?: Error;
  /**
   * If defined, will render a default loading progress.
   */
  loading?: boolean;
  /**
   * Optional component to render when no results. Default to <EmptyState /> component.
   */
  noResultsComponent?: ReactNode;
};

/**
 * Default layout for rendering search results in a list.
 * @param props - See {@link SearchResultListLayoutProps}.
 * @public
 */
export const SearchResultListLayout = (props: SearchResultListLayoutProps) => {
  const {
    loading,
    error,
    resultItems,
    renderResultItem = resultItem => (
      <DefaultResultListItem
        key={resultItem.document.location}
        result={resultItem.document}
      />
    ),
    noResultsComponent = (
      <EmptyState missing="data" title="Sorry, no results were found" />
    ),
    ...rest
  } = props;

  return (
    <List {...rest}>
      {loading ? <Progress /> : null}
      {!loading && error ? (
        <ResponseErrorPanel
          title="Error encountered while fetching search results"
          error={error}
        />
      ) : null}
      {!loading && !error && resultItems?.length
        ? resultItems.map(renderResultItem)
        : null}
      {!loading && !error && !resultItems?.length ? (
        <ListItem>{noResultsComponent}</ListItem>
      ) : null}
    </List>
  );
};

/**
 * Props for {@link SearchResultList}.
 * @public
 */
export type SearchResultListProps = Omit<
  SearchResultListLayoutProps,
  'loading' | 'error' | 'resultItems'
> & {
  /**
   * A search query used for requesting the results to be listed.
   */
  query: Partial<SearchQuery>;
  /**
   * Optional property to provide if component should not render the component when no results are found.
   */
  disableRenderingWithNoResults?: boolean;
};

/**
 * Given a query, search for results and render them as a list.
 * @param props - See {@link SearchResultListProps}.
 * @public
 */
export const SearchResultList = (props: SearchResultListProps) => {
  const { query, disableRenderingWithNoResults, ...rest } = props;

  return (
    <AnalyticsContext
      attributes={{
        pluginId: 'search',
        extension: 'SearchResultList',
      }}
    >
      <SearchResultState query={query}>
        {({ loading, error, value }) => {
          if (!value?.results?.length && disableRenderingWithNoResults) {
            return null;
          }

          return (
            <SearchResultListLayout
              {...rest}
              loading={loading}
              error={error}
              resultItems={value?.results}
            />
          );
        }}
      </SearchResultState>
    </AnalyticsContext>
  );
};
