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

import { ReactNode } from 'react';
import type { ComboBoxProps as AriaComboBoxProps } from 'react-aria-components';
import type { Breakpoint } from '../..';
import type { FieldLabelProps } from '../FieldLabel/types';
import type { Option, OptionSection } from '../Select/types';

export type { Option, OptionSection };

/** @public */
export type ComboboxOwnProps = {
  /**
   * An icon to render before the input
   */
  icon?: ReactNode;

  /**
   * The size of the combobox field
   * @defaultValue 'small'
   */
  size?: 'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>;

  /**
   * The options of the combobox field. Pass flat options, option sections for
   * grouped display, or a mix of both in the same array.
   */
  options?: Array<Option | OptionSection>;

  /**
   * Placeholder text for the input.
   */
  placeholder?: string;

  label?: FieldLabelProps['label'];
  secondaryLabel?: FieldLabelProps['secondaryLabel'];
  description?: FieldLabelProps['description'];
  isRequired?: boolean;
  className?: string;
};

/** @public */
export interface ComboboxProps
  extends ComboboxOwnProps,
    Omit<AriaComboBoxProps<Option>, keyof ComboboxOwnProps> {}

/** @internal */
export interface ComboboxInputOwnProps {
  icon?: ComboboxOwnProps['icon'];
  placeholder?: string;
}

/** @internal */
export interface ComboboxListBoxOwnProps {
  options?: ComboboxOwnProps['options'];
}

/** @internal */
export type ComboboxListBoxItemOwnProps = {};

/** @internal */
export type ComboboxSectionOwnProps = {};
