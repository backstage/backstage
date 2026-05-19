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
  GridListProps as ReactAriaGridListProps,
  GridListItemProps as ReactAriaGridListItemProps,
} from 'react-aria-components';

/**
 * Own props for the List component.
 *
 * @public
 */
export type ListOwnProps<T = object> = {
  items?: ReactAriaGridListProps<T>['items'];
  children?: ReactAriaGridListProps<T>['children'];
  renderEmptyState?: ReactAriaGridListProps<T>['renderEmptyState'];
  className?: string;
};

/**
 * Props for the List component.
 *
 * @public
 */
export interface ListProps<T>
  extends ListOwnProps<T>,
    Omit<ReactAriaGridListProps<T>, keyof ListOwnProps<T>> {}

/**
 * Own props for the ListRow component.
 *
 * @public
 */
export type ListRowOwnProps = {
  /**
   * The main label content of the row.
   */
  children?: React.ReactNode;
  /**
   * Optional secondary description text.
   */
  description?: string;
  /**
   * Optional icon displayed before the label, rendered in a 32×32px box.
   */
  icon?: React.ReactElement;
  /**
   * Optional menu items rendered inside an automatically managed dropdown menu.
   * Pass `MenuItem` nodes here and the component will render the trigger button
   * and menu wrapper for you.
   */
  menuItems?: React.ReactNode;
  /**
   * Optional actions rendered in a flex row on the right side of the row,
   * e.g. a set of tags. For a dropdown menu, prefer `menuItems`.
   */
  customActions?: React.ReactNode;
  className?: string;
};

/**
 * Props for the ListRow component.
 *
 * @public
 */
export interface ListRowProps
  extends ListRowOwnProps,
    Omit<ReactAriaGridListItemProps, keyof ListRowOwnProps> {}
