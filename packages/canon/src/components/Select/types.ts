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

import { Breakpoint } from '@backstage/canon';
import { ChangeEvent, FocusEvent } from 'react';

/** @public */
export interface SelectProps {
  /**
   * The class name of the select field
   */
  className?: string;

  /**
   * The size of the select field
   * @defaultValue 'medium'
   */
  size?: 'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>;

  /**
   * The label of the select field
   */
  label?: string;

  /**
   * The description of the select field
   */
  description?: string;

  /**
   * The name of the select field
   */
  name: string;

  /**
   * Whether the select field should ignore user input
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Whether the select field is required
   * @defaultValue false
   */
  required?: boolean;

  /**
   * The options of the select field
   */
  options?: Array<{ value: string; label: string; disabled?: boolean }>;

  /**
   * The current value of the select field
   */
  value?: string;

  /**
   * The default value of the select field, if nothing has been selected yet
   */
  defaultValue?: string;

  /**
   * A placeholder text to show if nothing has been selected and there's no default value
   * @defaultValue 'Select an option'
   */
  placeholder?: string;

  /**
   * Callback that is called when the value of the select field changes
   */
  onValueChange?: (value: string) => void;

  /**
   * Callback that is called when the select field is opened or closed
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * The style of the select field
   */
  style?: React.CSSProperties;

  /**
   * The error message of the select field
   */
  error?: string;

  /**
   * onChange handler for form integration
   */
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;

  /**
   * onBlur handler for form integration
   */
  onBlur?: (event: FocusEvent<HTMLSelectElement>) => void;
}
