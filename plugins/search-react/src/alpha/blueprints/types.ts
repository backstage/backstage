/*
 * Copyright 2024 The Backstage Authors
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

import { ListItemProps } from '@material-ui/core/ListItem';
import { SearchDocument, SearchResult } from '@backstage/plugin-search-common';
import { createExtensionDataRef } from '@backstage/frontend-plugin-api';

/** @alpha */
export type BaseSearchResultListItemProps<T = {}> = T & {
  rank?: number;
  result?: SearchDocument;
} & Omit<ListItemProps, 'button'>;

/** @alpha */
export type SearchResultItemExtensionComponent = <
  P extends BaseSearchResultListItemProps,
>(
  props: P,
) => JSX.Element | null;

/** @alpha */
export type SearchResultItemExtensionPredicate = (
  result: SearchResult,
) => boolean;

/** @alpha */
export const searchResultListItemDataRef = createExtensionDataRef<{
  predicate?: SearchResultItemExtensionPredicate;
  component: SearchResultItemExtensionComponent;
}>().with({ id: 'search.search-result-list-item.item' });

/** @alpha */
export const searchResultTypeDataRef = createExtensionDataRef<{
  value: string;
  name: string;
  icon: JSX.Element;
}>().with({ id: 'search.filters.result-types.type' });

/** @alpha */
export type SearchFilterExtensionComponentProps = {
  className: string;
};

/** @alpha */
export type SearchFilterExtensionComponent = (
  props: SearchFilterExtensionComponentProps,
) => JSX.Element;

/** @alpha */
export const searchFilterDataRef = createExtensionDataRef<{
  component: SearchFilterExtensionComponent;
}>().with({ id: 'search.filters.filter' });
