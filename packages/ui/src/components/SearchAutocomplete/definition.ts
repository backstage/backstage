/*
 * Copyright 2026 The Backstage Authors
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

import { defineComponent } from '../../hooks/useDefinition';
import type {
  SearchAutocompleteOwnProps,
  SearchAutocompleteItemOwnProps,
} from './types';
import styles from './SearchAutocomplete.module.css';

/**
 * Component definition for SearchAutocomplete.
 * @public
 */
export const SearchAutocompleteDefinition =
  defineComponent<SearchAutocompleteOwnProps>()({
    styles,
    bg: 'consumer',
    classNames: {
      root: 'bui-SearchAutocomplete',
      searchField: 'bui-SearchAutocompleteSearchField',
      searchFieldInput: 'bui-SearchAutocompleteInput',
      searchFieldClear: 'bui-SearchAutocompleteClear',
      popover: 'bui-SearchAutocompletePopover',
      inner: 'bui-SearchAutocompleteInner',
      listBox: 'bui-SearchAutocompleteListBox',
      loadingState: 'bui-SearchAutocompleteLoadingState',
      emptyState: 'bui-SearchAutocompleteEmptyState',
    },
    propDefs: {
      'aria-label': {},
      'aria-labelledby': {},
      size: { dataAttribute: true, default: 'small' },
      placeholder: { default: 'Search' },
      inputValue: {},
      onInputChange: {},
      popoverWidth: {},
      popoverPlacement: {},
      children: {},
      isLoading: {},
      defaultOpen: {},
      className: {},
      style: {},
    },
  });

/** @internal */
export const SearchAutocompleteItemDefinition =
  defineComponent<SearchAutocompleteItemOwnProps>()({
    styles,
    resolveHref: true,
    classNames: {
      root: 'bui-SearchAutocompleteItem',
      itemContent: 'bui-SearchAutocompleteItemContent',
    },
    propDefs: {
      children: {},
      className: {},
    },
  });
