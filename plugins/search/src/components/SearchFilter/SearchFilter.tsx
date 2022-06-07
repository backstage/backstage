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

import React, { ReactElement } from 'react';

import {
  AutocompleteFilter,
  CheckboxFilter,
  SearchAutocompleteFilterProps,
  SelectFilter,
} from '@backstage/plugin-search-react';

/**
 * @public
 * @deprecated Import from `@backstage/plugin-search-react` instead.
 */
export type SearchFilterComponentProps = {
  className?: string;
  name: string;
  label?: string;
  /**
   * Either an array of values directly, or an async function to return a list
   * of values to be used in the filter. In the autocomplete filter, the last
   * input value is provided as an input to allow values to be filtered. This
   * function is debounced and values cached.
   */
  values?: string[] | ((partial: string) => Promise<string[]>);
  defaultValue?: string[] | string | null;
  /**
   * Debounce time in milliseconds, used when values is an async callback.
   * Defaults to 250ms.
   */
  valuesDebounceMs?: number;
};

/**
 * @public
 * @deprecated Import from `@backstage/plugin-search-react` instead.
 */
export type SearchFilterWrapperProps = SearchFilterComponentProps & {
  component: (props: SearchFilterComponentProps) => ReactElement;
  debug?: boolean;
};

/**
 * @public
 * @deprecated Import from `@backstage/plugin-search-react` instead.
 */
const SearchFilter = ({
  component: Element,
  ...props
}: SearchFilterWrapperProps) => <Element {...props} />;

/**
 * @deprecated Import from `@backstage/plugin-search-react` instead.
 */
SearchFilter.Checkbox = (
  props: Omit<SearchFilterWrapperProps, 'component'> &
    SearchFilterComponentProps,
) => <SearchFilter {...props} component={CheckboxFilter} />;

/**
 * @deprecated Import from `@backstage/plugin-search-react` instead.
 */
SearchFilter.Select = (
  props: Omit<SearchFilterWrapperProps, 'component'> &
    SearchFilterComponentProps,
) => <SearchFilter {...props} component={SelectFilter} />;

/**
 * A control surface for a given filter field name, rendered as an autocomplete
 * textfield. A hard-coded list of values may be provided, or an async function
 * which returns values may be provided instead.
 *
 * @public
 * @deprecated Import from `@backstage/plugin-search-react` instead.
 */
SearchFilter.Autocomplete = (props: SearchAutocompleteFilterProps) => (
  <SearchFilter {...props} component={AutocompleteFilter} />
);

export { SearchFilter };
