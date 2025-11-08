/*
 * Copyright 2025 The Backstage Authors
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

import type {
  MenuTriggerProps as RAMenuTriggerProps,
  MenuItemProps as RAMenuItemProps,
  MenuProps as RAMenuProps,
  MenuSectionProps as RAMenuSectionProps,
  SeparatorProps as RAMenuSeparatorProps,
  SubmenuTriggerProps as RAMenuSubmenuTriggerProps,
  ListBoxProps as RAListBoxProps,
  ListBoxItemProps as RAListBoxItemProps,
  PopoverProps as RAPopoverProps,
} from 'react-aria-components';

/** @public */
export interface MenuTriggerProps extends RAMenuTriggerProps {}

/** @public */
export interface SubmenuTriggerProps extends RAMenuSubmenuTriggerProps {}

/** @public */
export interface MenuProps<T>
  extends RAMenuProps<T>,
    Omit<RAMenuProps<T>, 'children'> {
  placement?: RAPopoverProps['placement'];
  virtualized?: boolean;
  maxWidth?: string;
  maxHeight?: string;
}

/** @public */
export interface MenuListBoxProps<T>
  extends RAListBoxProps<T>,
    Omit<RAListBoxProps<T>, 'children'> {
  placement?: RAPopoverProps['placement'];
  virtualized?: boolean;
  maxWidth?: string;
  maxHeight?: string;
}

/** @public */
export interface MenuAutocompleteProps<T>
  extends RAMenuProps<T>,
    Omit<RAMenuProps<T>, 'children'> {
  placeholder?: string;
  placement?: RAPopoverProps['placement'];
  virtualized?: boolean;
  maxWidth?: string;
  maxHeight?: string;
}

/** @public */
export interface MenuAutocompleteListBoxProps<T>
  extends RAListBoxProps<T>,
    Omit<RAListBoxProps<T>, 'children'> {
  placeholder?: string;
  placement?: RAPopoverProps['placement'];
  virtualized?: boolean;
  maxWidth?: string;
  maxHeight?: string;
}

/** @public */
export interface MenuItemProps
  extends RAMenuItemProps,
    Omit<RAMenuItemProps, 'children'> {
  iconStart?: React.ReactNode;
  children: React.ReactNode;
  color?: 'primary' | 'danger';
}

/** @public */
export interface MenuListBoxItemProps
  extends RAListBoxItemProps,
    Omit<RAListBoxItemProps, 'children'> {
  children: React.ReactNode;
}

/** @public */
export interface MenuSectionProps<T>
  extends RAMenuSectionProps<T>,
    Omit<RAMenuSectionProps<T>, 'children'> {
  title: string;
  children: React.ReactNode;
}

/** @public */
export interface MenuSeparatorProps extends RAMenuSeparatorProps {}
