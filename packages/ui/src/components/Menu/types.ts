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

/**
 * Common own props shared by all Menu popover variants.
 *
 * @public
 */
export type MenuPopoverOwnProps = {
  placement?: RAPopoverProps['placement'];
  virtualized?: boolean;
  maxWidth?: string;
  maxHeight?: string;
  style?: React.CSSProperties;
  className?: string;
};

/** @public */
export type MenuOwnProps = MenuPopoverOwnProps;

/** @public */
export interface MenuProps<T>
  extends MenuOwnProps,
    Omit<RAMenuProps<T>, keyof MenuOwnProps> {}

/** @public */
export type MenuListBoxOwnProps = MenuPopoverOwnProps & {
  selectionMode?: RAListBoxProps<object>['selectionMode'];
};

/** @public */
export interface MenuListBoxProps<T>
  extends MenuListBoxOwnProps,
    Omit<RAListBoxProps<T>, keyof MenuListBoxOwnProps> {}

/** @public */
export type MenuAutocompleteOwnProps = MenuPopoverOwnProps & {
  placeholder?: string;
};

/** @public */
export interface MenuAutocompleteProps<T>
  extends MenuAutocompleteOwnProps,
    Omit<RAMenuProps<T>, keyof MenuAutocompleteOwnProps> {}

/** @public */
export type MenuAutocompleteListBoxOwnProps = MenuPopoverOwnProps & {
  placeholder?: string;
  selectionMode?: RAListBoxProps<object>['selectionMode'];
};

/** @public */
export interface MenuAutocompleteListBoxProps<T>
  extends MenuAutocompleteListBoxOwnProps,
    Omit<RAListBoxProps<T>, keyof MenuAutocompleteListBoxOwnProps> {}

/** @public */
export type MenuItemOwnProps = {
  iconStart?: React.ReactNode;
  children: React.ReactNode;
  color?: 'primary' | 'danger';
  href?: RAMenuItemProps['href'];
  className?: string;
};

/** @public */
export interface MenuItemProps
  extends MenuItemOwnProps,
    Omit<RAMenuItemProps, keyof MenuItemOwnProps> {}

/** @public */
export type MenuListBoxItemOwnProps = {
  children: React.ReactNode;
  className?: string;
};

/** @public */
export interface MenuListBoxItemProps
  extends MenuListBoxItemOwnProps,
    Omit<RAListBoxItemProps, keyof MenuListBoxItemOwnProps> {}

/** @public */
export type MenuSectionOwnProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

/** @public */
export interface MenuSectionProps<T>
  extends MenuSectionOwnProps,
    Omit<RAMenuSectionProps<T>, keyof MenuSectionOwnProps> {}

/** @public */
export type MenuSeparatorOwnProps = {
  className?: string;
};

/** @public */
export interface MenuSeparatorProps
  extends MenuSeparatorOwnProps,
    Omit<RAMenuSeparatorProps, keyof MenuSeparatorOwnProps> {}
