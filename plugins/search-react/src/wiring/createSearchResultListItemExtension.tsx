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

import React, { lazy, Suspense } from 'react';

import { ListItemProps } from '@material-ui/core';

import {
  ExtensionBoundary,
  PortableSchema,
  createExtension,
  createExtensionDataRef,
  createSchemaFromZod,
} from '@backstage/frontend-plugin-api';
import { Progress } from '@backstage/core-components';
import { SearchDocument, SearchResult } from '@backstage/plugin-search-common';

import { SearchResultListItemExtension } from '../extensions';

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
export const searchResultItemExtensionData = createExtensionDataRef<{
  predicate?: SearchResultItemExtensionPredicate;
  component: SearchResultItemExtensionComponent;
}>('plugin.search.result.item.data');

/** @alpha */
export type SearchResultItemExtensionOptions<
  TConfig extends { noTrack?: boolean },
> = {
  /**
   * The extension id.
   */
  id: string;
  /**
   * The extension attachment point (e.g., search modal or page).
   */
  at: string;
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
export type BaseSearchResultListItemProps<T = {}> = T & {
  rank?: number;
  result?: SearchDocument;
} & Omit<ListItemProps, 'button'>;

/** @alpha */
export function createSearchResultListItemExtension<
  TConfig extends { noTrack?: boolean },
>(options: SearchResultItemExtensionOptions<TConfig>) {
  const configSchema =
    'configSchema' in options
      ? options.configSchema
      : (createSchemaFromZod(z =>
          z.object({
            noTrack: z.boolean().default(true),
          }),
        ) as PortableSchema<TConfig>);
  return createExtension({
    id: `plugin.search.result.item.${options.id}`,
    at: options.at,
    configSchema,
    output: {
      item: searchResultItemExtensionData,
    },
    factory({ bind, config, source }) {
      const LazyComponent = lazy(() =>
        options
          .component({ config })
          .then(component => ({ default: component })),
      ) as unknown as SearchResultItemExtensionComponent;

      bind({
        item: {
          predicate: options.predicate,
          component: props => (
            <ExtensionBoundary source={source}>
              <Suspense fallback={<Progress />}>
                <SearchResultListItemExtension
                  rank={props.rank}
                  result={props.result}
                  noTrack={config.noTrack}
                >
                  <LazyComponent {...props} />
                </SearchResultListItemExtension>
              </Suspense>
            </ExtensionBoundary>
          ),
        },
      });
    },
  });
}
