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

import React, { lazy } from 'react';
import {
  createExtensionBlueprint,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import {
  SearchResultItemExtensionComponent,
  SearchResultItemExtensionPredicate,
  searchResultListItemDataRef,
} from './types';
import {
  SearchResultListItemExtension,
  SearchResultListItemExtensionProps,
} from '../../extensions';

/** @alpha */
export interface SearchResultListItemBlueprintParams {
  /**
   * The extension component.
   */
  component: (options: {
    config: { noTrack?: boolean };
  }) => Promise<SearchResultItemExtensionComponent>;
  /**
   * When an extension defines a predicate, it returns true if the result should be rendered by that extension.
   * Defaults to a predicate that returns true, which means it renders all sorts of results.
   */
  predicate?: SearchResultItemExtensionPredicate;
}

/**
 * @alpha
 * Creates SearchResultListItem extensions
 */
export const SearchResultListItemBlueprint = createExtensionBlueprint({
  kind: 'search-result-list-item',
  attachTo: {
    id: 'page:search',
    input: 'items',
  },
  config: {
    schema: {
      noTrack: z => z.boolean().default(false),
    },
  },
  output: [searchResultListItemDataRef],
  dataRefs: {
    item: searchResultListItemDataRef,
  },
  *factory(params: SearchResultListItemBlueprintParams, { config, node }) {
    const ExtensionComponent = lazy(() =>
      params.component({ config }).then(component => ({ default: component })),
    );

    yield searchResultListItemDataRef({
      predicate: params.predicate,
      component: (props: SearchResultListItemExtensionProps) => (
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
    });
  },
});
