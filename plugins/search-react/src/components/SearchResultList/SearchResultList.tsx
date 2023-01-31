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

import { List, ListProps } from '@material-ui/core';

import {
  Progress,
  EmptyState,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { AnalyticsContext } from '@backstage/core-plugin-api';
import { SearchResult } from '@backstage/plugin-search-common';

import { useSearchResultListItemExtensions } from '../../extensions';

import { DefaultResultListItem } from '../DefaultResultListItem';
import { SearchResultState, SearchResultStateProps } from '../SearchResult';

/**
 * Props for {@link SearchResultListLayout}
 * @public
 */
export type SearchResultListLayoutProps = ListProps & {
  /**
   * If defined, will render a default error panel.
   */
  error?: Error;
  /**
   * If defined, will render a default loading progress.
   */
  loading?: boolean;
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
   * Optional component to render when no results. Default to <EmptyState /> component.
   */
  noResultsComponent?: ReactNode;
  /**
   * Optional property to provide if component should not render the component when no results are found.
   */
  disableRenderingWithNoResults?: boolean;
};

/**
 * Default layout for rendering search results in a list.
 * @param props - See {@link SearchResultListLayoutProps}.
 * @public
 */
export const SearchResultListLayout = (props: SearchResultListLayoutProps) => {
  const {
    error,
    loading,
    resultItems,
    renderResultItem = resultItem => (
      <DefaultResultListItem
        key={resultItem.document.location}
        result={resultItem.document}
      />
    ),
    disableRenderingWithNoResults,
    noResultsComponent = disableRenderingWithNoResults ? null : (
      <EmptyState missing="data" title="Sorry, no results were found" />
    ),
    ...rest
  } = props;

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

  if (!resultItems?.length) {
    return <>{noResultsComponent}</>;
  }

  return <List {...rest}>{resultItems.map(renderResultItem)}</List>;
};

/**
 * Props for {@link SearchResultList}.
 * @public
 */
export type SearchResultListProps = Pick<SearchResultStateProps, 'query'> &
  Omit<SearchResultListLayoutProps, 'loading' | 'error' | 'resultItems'>;

/**
 * Given a query, search for results and render them as a list.
 * @param props - See {@link SearchResultListProps}.
 * @public
 */
export const SearchResultList = (props: SearchResultListProps) => {
  const { query, renderResultItem, children, ...rest } = props;

  const defaultRenderResultItem = useSearchResultListItemExtensions(children);

  return (
    <AnalyticsContext
      attributes={{
        pluginId: 'search',
        extension: 'SearchResultList',
      }}
    >
      <SearchResultState query={query}>
        {({ loading, error, value }) => (
          <SearchResultListLayout
            {...rest}
            error={error}
            loading={loading}
            resultItems={value?.results}
            renderResultItem={renderResultItem ?? defaultRenderResultItem}
          />
        )}
      </SearchResultState>
    </AnalyticsContext>
  );
};
