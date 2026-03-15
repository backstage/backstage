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
  ListBoxProps as ReactAriaListBoxProps,
  ListBoxItemProps as ReactAriaListBoxItemProps,
} from 'react-aria-components';

/**
 * Own props for the ListBox component.
 *
 * @public
 */
export type ListBoxOwnProps<T = object> = {
  items?: ReactAriaListBoxProps<T>['items'];
  children?: ReactAriaListBoxProps<T>['children'];
  renderEmptyState?: ReactAriaListBoxProps<T>['renderEmptyState'];
  className?: string;
};

/**
 * Props for the ListBox component.
 *
 * @public
 */
export interface ListBoxProps<T>
  extends ListBoxOwnProps<T>,
    Omit<ReactAriaListBoxProps<T>, keyof ListBoxOwnProps<T>> {}

/**
 * Own props for the ListBoxItem component.
 *
 * @public
 */
export type ListBoxItemOwnProps = {
  /**
   * The main label content of the item.
   */
  children?: React.ReactNode;
  /**
   * Optional secondary description text.
   */
  description?: string;
  /**
   * Optional icon displayed before the label, rendered in a 32×32px box.
   */
  icon?: React.ReactNode;
  /**
   * Optional menu items rendered inside an automatically managed dropdown menu.
   * Pass `MenuItem` nodes here and the component will render the trigger button
   * and menu wrapper for you.
   */
  menuItems?: React.ReactNode;
  /**
   * Optional actions rendered in a flex row on the right side of the item,
   * e.g. a set of tags. For a dropdown menu, prefer `menuItems`.
   */
  customActions?: React.ReactNode;
  className?: string;
};

/**
 * Props for the ListBoxItem component.
 *
 * @public
 */
export interface ListBoxItemProps
  extends ListBoxItemOwnProps,
    Omit<ReactAriaListBoxItemProps, keyof ListBoxItemOwnProps> {}
