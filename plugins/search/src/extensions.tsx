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
import { createReactExtension, Extension } from '@backstage/core-plugin-api';
import { IndexableDocument, SearchResult } from '@backstage/plugin-search-common';

export const RESULT_EXTENSION_WRAPPER_KEY = 'search.extensions.result_wrapper.v1';
export const RESULT_EXTENSION_KEY = 'search.extensions.result.v1';

/**
 * Represents the component exposed as an extension when a plugin provides a
 * Search Result extension via the `createSearchResultExtension` function.
 * 
 * Note that the props of this component can vary:
 * 
 * - The props may only consist of `TComponentProps` when the extension is
 *   being configured (e.g. within a `<SearchResult>` component).
 * - The props represent a full `SearchResultItemProps` when the extension is
 *   actually being rendered.
 *
 * @public
 */
 export type SearchResultExtensionComponent<TResultType extends IndexableDocument = IndexableDocument, TComponentProps = {}> = (props: (SearchResultItemProps<TResultType, TComponentProps> | TComponentProps)) => JSX.Element | null;

 /**
  * A type used to represent the props that a search result extension expects
  * to receive. This covers both any component-specific props (supplied via the
  * `TComponentProps` generic), as well as the result itself (defaulting to the
  * generic `IndexableDocument` type, but extendable via the `TResultType`
  * generic).
  * 
  * @public
  */
 export type SearchResultItemProps<TResultType extends IndexableDocument = IndexableDocument, TComponentProps = {}> = TComponentProps & {
   result: TResultType,
   rank: number;
 };

/**
 * Options for creating a Search Result extension. The `component` is what's
 * rendered for a given search result that matches the given `filterPredicate`.
 *
 * @public
 */
 export type SearchResultExtensionOptions<TResultType extends IndexableDocument = IndexableDocument, TComponentProps = {}> = {
   name: string;
   component: (
     props: SearchResultItemProps<TResultType, TComponentProps>,
   ) => JSX.Element | null;
   filterPredicate: (result: SearchResult) => boolean;
};

/**
 * Type guard that helps typescript differentiate between directly rendered
 * result list item components and those merely representing configuration.
 */
const resultIsProvided = (props: SearchResultItemProps | {}): props is SearchResultItemProps => {
  return props.hasOwnProperty('result');
}

/**
 * Creates a Search Result extension.
 *
 * @public
 */
 export function createSearchResultExtension<TResultType extends IndexableDocument = IndexableDocument, TComponentProps = {}>(
 options: SearchResultExtensionOptions<TResultType, TComponentProps>,
): Extension<SearchResultExtensionComponent<TResultType, TComponentProps>> {
  const { component: Component, filterPredicate, name } = options;
  const extension = createReactExtension<SearchResultExtensionComponent<TResultType, TComponentProps>>({
    name,
    component: {
      sync: (props) => {
        // When a result is provided via the props, the component should be
        // rendered normally. Otherwise, the component represents configuration
        // and should not be rendered normally.
        if (resultIsProvided(props)) {
          return <Component {...props} />;
        }

        return null;
      }
    },
    data: {
      [RESULT_EXTENSION_KEY]: {
        filterPredicate,
      },
    },
  });

  return extension;
}
