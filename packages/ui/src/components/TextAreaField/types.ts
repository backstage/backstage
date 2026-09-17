/*
 * Copyright 2024 The Backstage Authors
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

import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components';
import type { Breakpoint } from '../../types';
import type { FieldLabelProps } from '../FieldLabel/types';

/** @public */
export type TextAreaFieldOwnProps = {
  /**
   * The size of the text area field
   * @defaultValue 'small'
   */
  size?: 'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>;

  className?: string;

  /**
   * Text to display in the text area when it has no value
   */
  placeholder?: string;

  /**
   * The number of visible text lines, controlling the initial and minimum height
   * @defaultValue 3
   */
  rows?: number;

  label?: FieldLabelProps['label'];
  description?: FieldLabelProps['description'];
  secondaryLabel?: FieldLabelProps['secondaryLabel'];
};

/** @public */
export interface TextAreaFieldProps
  extends Omit<AriaTextFieldProps, 'className' | 'description'>,
    TextAreaFieldOwnProps {}
