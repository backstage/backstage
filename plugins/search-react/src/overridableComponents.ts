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

import { HighlightedSearchResultTextClassKey } from './components';

/**
 * CSS custom property overrides for search-react component styling.
 * Used by theme consumers to customize component appearance via CSS custom properties.
 * @public
 */
export type CSSCustomPropertyOverrides = Record<string, string>;

/** @public */
export type CatalogReactComponentsNameToClassKey = {
  SearchReactHighlightedSearchResultText: HighlightedSearchResultTextClassKey;
};

/**
 * Backstage overrides type for search-react components.
 * Uses CSS class name-based overrides instead of MUI StyleRules.
 * Consumers can provide Tailwind class names or CSS custom property values.
 * @public
 */
export type BackstageOverrides = {
  [Name in keyof CatalogReactComponentsNameToClassKey]?: Partial<
    Record<CatalogReactComponentsNameToClassKey[Name], string>
  >;
};

declare module '@backstage/theme' {
  interface OverrideComponentNameToClassKeys
    extends CatalogReactComponentsNameToClassKey {}
}
