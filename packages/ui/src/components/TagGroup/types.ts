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
  TagGroupProps as ReactAriaTagGroupProps,
  TagListProps as ReactAriaTagListProps,
  TagProps as ReactAriaTagProps,
} from 'react-aria-components';

/**
 * Own props for the TagGroup component.
 *
 * @public
 */
export type TagGroupOwnProps<T = object> = {
  items?: ReactAriaTagListProps<T>['items'];
  children?: ReactAriaTagListProps<T>['children'];
  renderEmptyState?: ReactAriaTagListProps<T>['renderEmptyState'];
  className?: string;
};

/**
 * Props for the TagGroup component.
 *
 * @public
 */
export interface TagGroupProps<T>
  extends TagGroupOwnProps<T>,
    Omit<ReactAriaTagGroupProps, 'children' | keyof TagGroupOwnProps> {}

/**
 * Own props for the Tag component.
 *
 * @public
 */
export type TagOwnProps = {
  /**
   * The icon to display in the chip.
   */
  icon?: React.ReactNode;
  /**
   * The size of the chip.
   */
  size?: 'small' | 'medium';
  href?: ReactAriaTagProps['href'];
  children?: ReactAriaTagProps['children'];
  className?: string;
};

/**
 * Props for the Tag component.
 *
 * @public
 */
export interface TagProps
  extends TagOwnProps,
    Omit<ReactAriaTagProps, keyof TagOwnProps> {}
