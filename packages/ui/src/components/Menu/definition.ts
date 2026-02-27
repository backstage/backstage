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
  MenuOwnProps,
  MenuListBoxOwnProps,
  MenuAutocompleteOwnProps,
  MenuAutocompleteListBoxOwnProps,
  MenuItemOwnProps,
  MenuListBoxItemOwnProps,
  MenuSectionOwnProps,
  MenuSeparatorOwnProps,
} from './types';
import styles from './Menu.module.css';

// Shared classNames for all popover-based menu variants
const menuPopoverClassNames = {
  root: 'bui-MenuPopover',
  inner: 'bui-MenuInner',
  content: 'bui-MenuContent',
} as const;

// Shared classNames for autocomplete menu variants
const menuAutocompleteClassNames = {
  ...menuPopoverClassNames,
  searchField: 'bui-MenuSearchField',
  searchFieldInput: 'bui-MenuSearchFieldInput',
  searchFieldClear: 'bui-MenuSearchFieldClear',
} as const;

// Shared propDefs for all popover-based menu variants
const menuPopoverPropDefs = {
  placement: { default: 'bottom start' },
  virtualized: { default: false },
  maxWidth: {},
  maxHeight: {},
  style: {},
  className: {},
} as const;

/**
 * Component definition for Menu
 * @public
 */
export const MenuDefinition = defineComponent<MenuOwnProps>()({
  styles,
  classNames: menuPopoverClassNames,
  propDefs: menuPopoverPropDefs,
});

/** @internal */
export const MenuListBoxDefinition = defineComponent<MenuListBoxOwnProps>()({
  styles,
  classNames: menuPopoverClassNames,
  propDefs: {
    ...menuPopoverPropDefs,
    selectionMode: { default: 'single' },
  },
});

/** @internal */
export const MenuAutocompleteDefinition =
  defineComponent<MenuAutocompleteOwnProps>()({
    styles,
    classNames: menuAutocompleteClassNames,
    propDefs: {
      ...menuPopoverPropDefs,
      placeholder: {},
    },
  });

/** @internal */
export const MenuAutocompleteListboxDefinition =
  defineComponent<MenuAutocompleteListBoxOwnProps>()({
    styles,
    classNames: menuAutocompleteClassNames,
    propDefs: {
      ...menuPopoverPropDefs,
      placeholder: {},
      selectionMode: { default: 'single' },
    },
  });

/** @internal */
export const MenuItemDefinition = defineComponent<MenuItemOwnProps>()({
  styles,
  classNames: {
    root: 'bui-MenuItem',
    itemWrapper: 'bui-MenuItemWrapper',
    itemContent: 'bui-MenuItemContent',
    itemArrow: 'bui-MenuItemArrow',
  },
  propDefs: {
    iconStart: {},
    children: {},
    color: { dataAttribute: true, default: 'primary' },
    href: {},
    className: {},
  },
});

/** @internal */
export const MenuListBoxItemDefinition =
  defineComponent<MenuListBoxItemOwnProps>()({
    styles,
    classNames: {
      root: 'bui-MenuItemListBox',
      itemWrapper: 'bui-MenuItemWrapper',
      itemContent: 'bui-MenuItemContent',
      check: 'bui-MenuItemListBoxCheck',
    },
    propDefs: {
      children: {},
      className: {},
    },
  });

/** @internal */
export const MenuSectionDefinition = defineComponent<MenuSectionOwnProps>()({
  styles,
  classNames: {
    root: 'bui-MenuSection',
    header: 'bui-MenuSectionHeader',
  },
  propDefs: {
    title: {},
    children: {},
    className: {},
  },
});

/** @internal */
export const MenuSeparatorDefinition = defineComponent<MenuSeparatorOwnProps>()(
  {
    styles,
    classNames: {
      root: 'bui-MenuSeparator',
    },
    propDefs: {
      className: {},
    },
  },
);

/** @internal */
export const MenuEmptyStateDefinition = defineComponent<{}>()({
  styles,
  classNames: {
    root: 'bui-MenuEmptyState',
  },
  propDefs: {},
});
