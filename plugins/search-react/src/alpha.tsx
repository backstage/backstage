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
import {
  ExtensionBoundary,
  PortableSchema,
  createExtension,
  createSchemaFromZod,
} from '@backstage/frontend-plugin-api';
import { SearchResultListItemExtension } from './extensions';
import {
  SearchResultItemExtensionComponent,
  SearchResultItemExtensionPredicate,
  searchResultListItemDataRef,
} from './blueprints/types';

export * from './blueprints';

/**
 * @alpha
 * @deprecated Use {@link SearchResultListItemBlueprint} instead
 */
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

/**
 * Creates items for the search result list.
 *
 * @alpha
 * @deprecated Use {@link SearchResultListItemBlueprint} instead
 */
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

/**
 * @alpha
 * @deprecated Use {@link SearchResultListItemBlueprint} instead
 */
export namespace createSearchResultListItemExtension {
  export const itemDataRef = searchResultListItemDataRef;
}
