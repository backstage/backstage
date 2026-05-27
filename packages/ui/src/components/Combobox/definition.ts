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
  ComboboxOwnProps,
  ComboboxInputOwnProps,
  ComboboxListBoxOwnProps,
  ComboboxListBoxItemOwnProps,
  ComboboxSectionOwnProps,
} from './types';
import styles from './Combobox.module.css';

/**
 * Component definition for Combobox
 * @public
 */
export const ComboboxDefinition = defineComponent<ComboboxOwnProps>()({
  styles,
  classNames: {
    root: 'bui-Combobox',
    popover: 'bui-ComboboxPopover',
  },
  propDefs: {
    icon: {},
    size: { dataAttribute: true, default: 'small' },
    options: {},
    placeholder: {},
    label: {},
    secondaryLabel: {},
    description: {},
    isRequired: {},
    className: {},
  },
});

/**
 * Component definition for ComboboxInput
 * @public
 */
export const ComboboxInputDefinition = defineComponent<ComboboxInputOwnProps>()(
  {
    styles,
    classNames: {
      root: 'bui-ComboboxInput',
      icon: 'bui-ComboboxInputIcon',
      input: 'bui-ComboboxInputField',
      chevron: 'bui-ComboboxInputChevron',
    },
    bg: 'consumer',
    propDefs: {
      icon: {},
      placeholder: {},
    },
  },
);

/**
 * Component definition for ComboboxListBox
 * @public
 */
export const ComboboxListBoxDefinition =
  defineComponent<ComboboxListBoxOwnProps>()({
    styles,
    classNames: {
      root: 'bui-ComboboxList',
      noResults: 'bui-ComboboxNoResults',
    },
    propDefs: {
      options: {},
    },
  });

/**
 * Component definition for ComboboxListBoxItem
 * @public
 */
export const ComboboxListBoxItemDefinition =
  defineComponent<ComboboxListBoxItemOwnProps>()({
    styles,
    classNames: {
      root: 'bui-ComboboxItem',
      indicator: 'bui-ComboboxItemIndicator',
      label: 'bui-ComboboxItemLabel',
    },
    propDefs: {},
  });

/**
 * Component definition for ComboboxSection
 * @public
 */
export const ComboboxSectionDefinition =
  defineComponent<ComboboxSectionOwnProps>()({
    styles,
    classNames: {
      root: 'bui-ComboboxSection',
      header: 'bui-ComboboxSectionHeader',
    },
    propDefs: {},
  });
