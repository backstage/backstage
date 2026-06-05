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

import { defineComponent } from '../../hooks/useDefinition';
import type {
  SelectOwnProps,
  SelectTriggerOwnProps,
  SelectContentOwnProps,
  SelectListBoxOwnProps,
  SelectListBoxItemOwnProps,
  SelectItemOwnProps,
  SelectItemProfileOwnProps,
  SelectItemTextOwnProps,
  SelectSectionOwnProps,
} from './types';
import styles from './Select.module.css';

/**
 * Component definition for Select
 * @public
 */
export const SelectDefinition = defineComponent<SelectOwnProps>()({
  styles,
  classNames: {
    root: 'bui-Select',
    popover: 'bui-SelectPopover',
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
    searchable: {},
    searchPlaceholder: {},
    label: {},
    secondaryLabel: {},
    description: {},
    isRequired: {},
    className: {},
  },
});

/**
 * Component definition for SelectTrigger
 * @internal
 */
export const SelectTriggerDefinition = defineComponent<SelectTriggerOwnProps>()(
  {
    styles,
    classNames: {
      root: 'bui-SelectTrigger',
      chevron: 'bui-SelectTriggerChevron',
      value: 'bui-SelectValue',
    },
    bg: 'consumer',
    propDefs: {
      icon: {},
    },
  },
);

/**
 * Component definition for SelectContent
 * @internal
 */
export const SelectContentDefinition = defineComponent<SelectContentOwnProps>()(
  {
    styles,
    classNames: {
      root: 'bui-SelectSearchWrapper',
      search: 'bui-SelectSearch',
      searchClear: 'bui-SelectSearchClear',
    },
    propDefs: {
      search: {},
      options: {},
      items: {},
      children: {},
      dependencies: {},
      loading: {},
      isStale: {},
      visibleIds: {},
      retainedOptions: {},
    },
  },
);

/**
 * Component definition for SelectListBox
 * @internal
 */
export const SelectListBoxDefinition = defineComponent<SelectListBoxOwnProps>()(
  {
    styles,
    classNames: {
      root: 'bui-SelectList',
      noResults: 'bui-SelectNoResults',
      loading: 'bui-SelectLoading',
      loadingRow: 'bui-SelectLoadingRow',
    },
    propDefs: {
      options: {},
      items: {},
      children: {},
      dependencies: {},
      loading: {},
      isStale: {},
      retainedOptions: {},
    },
  },
);

/**
 * Component definition for the convenience option item
 * @internal
 */
export const SelectListBoxItemDefinition =
  defineComponent<SelectListBoxItemOwnProps>()({
    styles,
    classNames: {
      label: 'bui-SelectItemLabel',
    },
    propDefs: {},
  });

/**
 * Component definition for SelectItem
 * @internal
 */
export const SelectItemDefinition = defineComponent<SelectItemOwnProps>()({
  styles,
  classNames: {
    root: 'bui-SelectItem',
    indicator: 'bui-SelectItemIndicator',
    content: 'bui-SelectItemContent',
  },
  propDefs: {
    children: {},
    showSelectionIndicator: {},
    className: {},
  },
});

/**
 * Component definition for SelectItemText
 * @internal
 */
export const SelectItemTextDefinition =
  defineComponent<SelectItemTextOwnProps>()({
    styles,
    classNames: {
      root: 'bui-SelectItemText',
      content: 'bui-SelectItemContent',
      leadingIcon: 'bui-SelectItemLeadingIcon',
      text: 'bui-SelectItemTextContent',
      title: 'bui-SelectItemTitle',
      description: 'bui-SelectItemDescription',
    },
    propDefs: {
      title: {},
      description: {},
      leadingIcon: {},
      className: {},
    },
  });

/**
 * Component definition for SelectItemProfile
 * @internal
 */
export const SelectItemProfileDefinition =
  defineComponent<SelectItemProfileOwnProps>()({
    styles,
    classNames: {
      root: 'bui-SelectItemProfile',
      content: 'bui-SelectItemContent',
      avatar: 'bui-SelectItemAvatar',
      name: 'bui-SelectItemTitle',
    },
    propDefs: {
      name: {},
      src: {},
      className: {},
    },
  });

/**
 * Component definition for SelectSection
 * @internal
 */
export const SelectSectionDefinition = defineComponent<SelectSectionOwnProps>()(
  {
    styles,
    classNames: {
      root: 'bui-SelectSection',
      header: 'bui-SelectSectionHeader',
    },
    propDefs: {},
  },
);
