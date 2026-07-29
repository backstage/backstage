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
  ComboboxItemOwnProps,
  ComboboxItemProfileOwnProps,
  ComboboxItemTextOwnProps,
  ComboboxListBoxOwnProps,
  ComboboxListBoxItemOwnProps,
  ComboboxSectionOwnProps,
} from './types';
import styles from './Combobox.module.css';

/** @public */
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
    items: {},
    children: {},
    dependencies: {},
    search: {},
    loading: {},
    placeholder: {},
    label: {},
    secondaryLabel: {},
    description: {},
    isRequired: {},
    className: {},
  },
});

/** @public */
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

/** @public */
export const ComboboxListBoxDefinition = defineComponent<
  ComboboxListBoxOwnProps<any>
>()({
  styles,
  classNames: {
    root: 'bui-ComboboxList',
    noResults: 'bui-ComboboxNoResults',
    loading: 'bui-ComboboxLoading',
    loadingRow: 'bui-ComboboxLoadingRow',
  },
  propDefs: {
    options: {},
    items: {},
    children: {},
    dependencies: {},
    search: {},
    loading: {},
    isStale: {},
    getItemTextValue: {},
  },
});

/** @public */
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

/** @public */
export const ComboboxItemDefinition = defineComponent<ComboboxItemOwnProps>()({
  styles,
  classNames: {
    root: 'bui-ComboboxItem',
    indicator: 'bui-ComboboxItemIndicator',
    content: 'bui-ComboboxItemContent',
  },
  propDefs: {
    children: {},
    textValue: {},
    showSelectionIndicator: {},
    className: {},
  },
});

/** @public */
export const ComboboxItemTextDefinition =
  defineComponent<ComboboxItemTextOwnProps>()({
    styles,
    classNames: {
      root: 'bui-ComboboxItemText',
      leadingIcon: 'bui-ComboboxItemTextLeadingIcon',
      text: 'bui-ComboboxItemTextContent',
      title: 'bui-ComboboxItemTitle',
      description: 'bui-ComboboxItemDescription',
    },
    propDefs: {
      title: {},
      description: {},
      leadingIcon: {},
      textValue: {},
      className: {},
    },
  });

/** @public */
export const ComboboxItemProfileDefinition =
  defineComponent<ComboboxItemProfileOwnProps>()({
    styles,
    classNames: {
      root: 'bui-ComboboxItemProfile',
      avatar: 'bui-ComboboxItemAvatar',
      name: 'bui-ComboboxItemTitle',
    },
    propDefs: {
      name: {},
      src: {},
      textValue: {},
      className: {},
    },
  });

/** @public */
export const ComboboxSectionDefinition =
  defineComponent<ComboboxSectionOwnProps>()({
    styles,
    classNames: {
      root: 'bui-ComboboxSection',
      header: 'bui-ComboboxSectionHeader',
    },
    propDefs: {},
  });
