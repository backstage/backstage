/*
 * Copyright 2023 The Backstage Authors
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
  Fragment,
  ReactNode,
  PropsWithChildren,
  isValidElement,
  createElement,
  cloneElement,
  useCallback,
} from 'react';

import {
  getComponentData,
  useElementFilter,
  Extension,
  createReactExtension,
  useAnalytics,
} from '@backstage/core-plugin-api';
import { SearchDocument, SearchResult } from '@backstage/plugin-search-common';

import { ListItem, List, ListProps, ListItemProps } from '@material-ui/core';

import { DefaultResultListItem } from './components/DefaultResultListItem';

/**
 * @internal
 * Key for result extensions.
 */
const SEARCH_RESULT_LIST_ITEM_EXTENSION =
  'search.results.list.items.extensions.v1';

/**
 * @internal
 * Returns the first extension element found for a given result, and null otherwise.
 * @param elements - All extension elements.
 * @param result - The search result.
 */
const findSearchResultListItemExtensionElement = (
  elements: ReactNode[],
  result: SearchResult,
) => {
  for (const element of elements) {
    if (!isValidElement(element)) continue;
    const predicate = getComponentData<(result: SearchResult) => boolean>(
      element,
      SEARCH_RESULT_LIST_ITEM_EXTENSION,
    );
    if (!predicate?.(result)) continue;
    return cloneElement(element, {
      rank: result.rank,
      highlight: result.highlight,
      result: result.document,
      // Use props in situations where a consumer is manually rendering the extension
      ...element.props,
    });
  }
  return null;
};

/**
 * @public
 * Extends props for any search result list item extension
 */
export type SearchResultListItemExtensionProps<Props extends {} = {}> = Props &
  PropsWithChildren<
    {
      rank?: number;
      result?: SearchDocument;
      noTrack?: boolean;
    } & Omit<ListItemProps, 'button'>
  >;

/**
 * @internal
 * Extends children with extension capabilities.
 * @param props - see {@link SearchResultListItemExtensionProps}.
 */
export const SearchResultListItemExtension = (
  props: SearchResultListItemExtensionProps,
) => {
  const {
    rank,
    result,
    noTrack,
    children,
    alignItems = 'flex-start',
    ...rest
  } = props;
  const analytics = useAnalytics();

  const handleClickCapture = useCallback(() => {
    if (noTrack) return;
    if (!result) return;
    analytics.captureEvent('discover', result.title, {
      attributes: { to: result.location },
      value: rank,
    });
  }, [rank, result, noTrack, analytics]);

  return (
    <ListItem
      divider
      alignItems={alignItems}
      onClickCapture={handleClickCapture}
      {...rest}
    >
      {children}
    </ListItem>
  );
};

/**
 * @public
 * Options for {@link createSearchResultListItemExtension}.
 */
export type SearchResultListItemExtensionOptions<
  Component extends (props: any) => JSX.Element | null,
> = {
  /**
   * The extension name.
   */
  name: string;
  /**
   * The extension component.
   */
  component: () => Promise<Component>;
  /**
   * When an extension defines a predicate, it returns true if the result should be rendered by that extension.
   * Defaults to a predicate that returns true, which means it renders all sorts of results.
   */
  predicate?: (result: SearchResult) => boolean;
};

/**
 * @public
 * Creates a search result item extension.
 * @param options - The extension options, see {@link SearchResultListItemExtensionOptions} for more details.
 */
export const createSearchResultListItemExtension = <
  Component extends (props: any) => JSX.Element | null,
>(
  options: SearchResultListItemExtensionOptions<Component>,
): Extension<Component> => {
  const { name, component, predicate = () => true } = options;

  return createReactExtension<Component>({
    name,
    component: {
      lazy: () =>
        component().then(
          type =>
            (props => (
              <SearchResultListItemExtension
                rank={props.rank}
                result={props.result}
                noTrack={props.noTrack}
              >
                {createElement(type, props)}
              </SearchResultListItemExtension>
            )) as Component,
        ),
    },
    data: {
      [SEARCH_RESULT_LIST_ITEM_EXTENSION]: predicate,
    },
  });
};

/**
 * @public
 * Returns a function that renders a result using extensions.
 */
export const useSearchResultListItemExtensions = (children: ReactNode) => {
  const elements = useElementFilter(
    children,
    collection => {
      return collection
        .selectByComponentData({
          key: SEARCH_RESULT_LIST_ITEM_EXTENSION,
        })
        .getElements();
    },
    [children],
  );

  return useCallback(
    (result: SearchResult, key?: number) => {
      const element = findSearchResultListItemExtensionElement(
        elements,
        result,
      );

      return (
        <Fragment key={key}>
          {element ?? (
            <SearchResultListItemExtension
              rank={result.rank}
              result={result.document}
            >
              <DefaultResultListItem
                rank={result.rank}
                highlight={result.highlight}
                result={result.document}
              />
            </SearchResultListItemExtension>
          )}
        </Fragment>
      );
    },
    [elements],
  );
};

/**
 * @public
 * Props for {@link SearchResultListItemExtensions}
 */
export type SearchResultListItemExtensionsProps = Omit<ListProps, 'results'> & {
  /**
   * Search result list.
   */
  results: SearchResult[];
};

/**
 * @public
 * Render results using search extensions.
 * @param props - see {@link SearchResultListItemExtensionsProps}
 */
export const SearchResultListItemExtensions = (
  props: SearchResultListItemExtensionsProps,
) => {
  const { results, children, ...rest } = props;
  const render = useSearchResultListItemExtensions(children);
  return <List {...rest}>{results.map(render)}</List>;
};
