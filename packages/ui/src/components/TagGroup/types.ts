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
 * Props for the TagGroup component.
 *
 * @public
 */
export interface TagGroupProps<T>
  extends Omit<ReactAriaTagGroupProps, 'children'>,
    Pick<ReactAriaTagListProps<T>, 'items' | 'children' | 'renderEmptyState'> {}

/**
 * Props for the Tag component.
 *
 * @public
 */
export interface TagProps extends ReactAriaTagProps {
  /**
   * The icon to display in the chip.
   */
  icon?: React.ReactNode;

  /**
   * The size of the chip.
   */
  size?: 'small' | 'medium';
}
