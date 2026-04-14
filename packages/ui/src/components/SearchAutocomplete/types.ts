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

import type {
  ListBoxItemProps as AriaListBoxItemProps,
  PopoverProps as AriaPopoverProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import type { Breakpoint } from '../../types';

/** @public */
export type SearchAutocompleteOwnProps = {
  /**
   * The current value of the search input (controlled).
   */
  inputValue?: string;

  /**
   * Handler called when the search input value changes.
   */
  onInputChange?: (value: string) => void;

  /**
   * The size of the search input.
   * @defaultValue 'small'
   */
  size?: 'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>;

  /**
   * Accessible label for the search input.
   */
  'aria-label'?: string;

  /**
   * ID of the element that labels the search input.
   */
  'aria-labelledby'?: string;

  /**
   * The placeholder text for the search input.
   */
  placeholder?: string;

  /**
   * Width of the results popover. Accepts any CSS width value.
   * When not set, the popover matches the input width.
   */
  popoverWidth?: string;

  /**
   * Placement of the results popover relative to the input.
   * @defaultValue 'bottom start'
   */
  popoverPlacement?: AriaPopoverProps['placement'];

  /**
   * The result items to render inside the autocomplete.
   */
  children?: ReactNode;

  /**
   * Whether results are currently loading.
   * When true, displays a loading indicator and announces the loading state to screen readers.
   */
  isLoading?: boolean;

  /**
   * Whether the results popover is open by default.
   */
  defaultOpen?: boolean;

  className?: string;
  style?: React.CSSProperties;
};

/** @public */
export interface SearchAutocompleteProps extends SearchAutocompleteOwnProps {}

/** @public */
export type SearchAutocompleteItemOwnProps = {
  children: ReactNode;
  className?: string;
};

/** @public */
export interface SearchAutocompleteItemProps
  extends SearchAutocompleteItemOwnProps,
    Omit<AriaListBoxItemProps, keyof SearchAutocompleteItemOwnProps> {}
