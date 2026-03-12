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
import type { AutocompleteOwnProps } from './types';
import styles from './Autocomplete.module.css';

/**
 * Component definition for Autocomplete
 * @public
 */
export const AutocompleteDefinition = defineComponent<AutocompleteOwnProps>()({
  styles,
  classNames: {
    root: 'bui-Autocomplete',
    popover: 'bui-AutocompletePopover',
    trigger: 'bui-AutocompleteTrigger',
    input: 'bui-AutocompleteInput',
    inputWrapper: 'bui-AutocompleteInputWrapper',
    inputIcon: 'bui-AutocompleteInputIcon',
    chevron: 'bui-AutocompleteChevron',
    listbox: 'bui-AutocompleteListBox',
    item: 'bui-AutocompleteItem',
    itemLabel: 'bui-AutocompleteItemLabel',
  },
  bg: 'consumer',
  propDefs: {
    icon: {},
    size: { dataAttribute: true, default: 'small' },
    options: {},
    placeholder: {},
    allowsCustomValue: {},
    displayMode: { default: 'listbox' },
    gridConfig: {},
    tableColumns: {},
    renderOption: {},
    label: {},
    secondaryLabel: {},
    description: {},
    isRequired: {},
    className: {},
  },
});
