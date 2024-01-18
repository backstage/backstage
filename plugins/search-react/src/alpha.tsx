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

import React, { lazy } from 'react';

import { ListItemProps } from '@material-ui/core';

import {
  ExtensionBoundary,
  PortableSchema,
  createExtension,
  createExtensionDataRef,
  createSchemaFromZod,
} from '@backstage/frontend-plugin-api';
import { SearchDocument, SearchResult } from '@backstage/plugin-search-common';

import { SearchResultListItemExtension } from './extensions';

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
export type SearchResultItemExtensionOptions<
  TConfig extends { noTrack?: boolean },
> = {
  /**
   * The extension namespace.
   */
  namespace?: string;
  /**
   * The extension name.
   */
  name?: string;
  /**
   * The extension attachment point (e.g., search modal or page).
   */
  attachTo?: { id: string; input: string };
  /**
   * Optional extension config schema.
   */
  configSchema?: PortableSchema<TConfig>;
  /**
   * The extension component.
   */
  component: (options: {
    config: TConfig;
  }) => Promise<SearchResultItemExtensionComponent>;
  /**
   * When an extension defines a predicate, it returns true if the result should be rendered by that extension.
   * Defaults to a predicate that returns true, which means it renders all sorts of results.
   */
  predicate?: SearchResultItemExtensionPredicate;
};

/** @alpha */
export function createSearchResultListItemExtension<
  TConfig extends { noTrack?: boolean },
>(options: SearchResultItemExtensionOptions<TConfig>) {
  const configSchema =
    'configSchema' in options
      ? options.configSchema
      : (createSchemaFromZod(z =>
          z.object({
            noTrack: z.boolean().default(false),
          }),
        ) as PortableSchema<TConfig>);

  return createExtension({
    kind: 'search-result-list-item',
    namespace: options.namespace,
    name: options.name,
    attachTo: options.attachTo ?? {
      id: 'page:search',
      input: 'items',
    },
    configSchema,
    output: {
      item: createSearchResultListItemExtension.itemDataRef,
    },
    factory({ config, node }) {
      const ExtensionComponent = lazy(() =>
        options
          .component({ config })
          .then(component => ({ default: component })),
      ) as unknown as SearchResultItemExtensionComponent;

      return {
        item: {
          predicate: options.predicate,
          component: props => (
            <ExtensionBoundary node={node}>
              <SearchResultListItemExtension
                rank={props.rank}
                result={props.result}
                noTrack={config.noTrack}
              >
                <ExtensionComponent {...props} />
              </SearchResultListItemExtension>
            </ExtensionBoundary>
          ),
        },
      };
    },
  });
}

/** @alpha */
export namespace createSearchResultListItemExtension {
  export const itemDataRef = createExtensionDataRef<{
    predicate?: SearchResultItemExtensionPredicate;
    component: SearchResultItemExtensionComponent;
  }>('search.search-result-list-item.item');
}
