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

import { Breakpoint } from '../..';
import { ReactNode } from 'react';
import type { ComboBoxProps as AriaComboBoxProps } from 'react-aria-components';
import type { FieldLabelProps } from '../FieldLabel/types';

/** @public */
export type AutocompleteOption = {
  value: string;
  label: string;
  disabled?: boolean;
  [key: string]: any;
};

/** @public */
export type AutocompleteDisplayMode =
  | 'listbox'
  | 'menu'
  | 'grid'
  | 'tags'
  | 'table';

/** @public */
export type AutocompleteGridConfig = {
  columns?: number | 'auto';
  gap?: string;
};

/** @public */
export type AutocompleteTableColumn = {
  key: string;
  label: string;
  width?: string;
  render?: (item: AutocompleteOption) => ReactNode;
};

/** @public */
export type AutocompleteOwnProps = {
  /**
   * An icon to render before the input
   */
  icon?: ReactNode;

  /**
   * The size of the autocomplete field
   * @defaultValue 'small'
   */
  size?: 'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>;

  /**
   * The options for the autocomplete dropdown
   */
  options?: Array<AutocompleteOption>;

  /**
   * Placeholder text for the input
   */
  placeholder?: string;

  /**
   * Allow custom values that aren't in the options list
   * @defaultValue false
   */
  allowsCustomValue?: boolean;

  /**
   * Display mode for the dropdown options
   * @defaultValue 'listbox'
   */
  displayMode?: AutocompleteDisplayMode;

  /**
   * Grid configuration when displayMode is 'grid'
   */
  gridConfig?: AutocompleteGridConfig;

  /**
   * Table columns when displayMode is 'table'
   */
  tableColumns?: AutocompleteTableColumn[];

  /**
   * Custom render function for options
   * Useful for complex item rendering
   */
  renderOption?: (item: AutocompleteOption) => ReactNode;

  label?: FieldLabelProps['label'];
  secondaryLabel?: FieldLabelProps['secondaryLabel'];
  description?: FieldLabelProps['description'];
  isRequired?: boolean;
  className?: string;
};

/** @public */
export interface AutocompleteProps
  extends AutocompleteOwnProps,
    Omit<
      AriaComboBoxProps<AutocompleteOption>,
      keyof AutocompleteOwnProps | 'children'
    > {}
