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
      searchable: {},
      searchPlaceholder: { default: 'Search...' },
      options: {},
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
      item: 'bui-SelectItem',
      itemIndicator: 'bui-SelectItemIndicator',
      itemLabel: 'bui-SelectItemLabel',
      noResults: 'bui-SelectNoResults',
    },
    propDefs: {
      options: {},
    },
  },
);
