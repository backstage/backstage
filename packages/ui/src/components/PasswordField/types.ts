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

import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components';
import type { ReactNode } from 'react';
import type { Breakpoint } from '../../types';
import type { FieldLabelProps } from '../FieldLabel/types';

/** @public */
export type PasswordFieldOwnProps = {
  /**
   * The size of the password field
   * @defaultValue 'medium'
   */
  size?: 'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>;

  className?: string;

  /**
   * An icon to render before the input
   */
  icon?: ReactNode;

  /**
   * Text to display in the input when it has no value
   */
  placeholder?: string;

  description?: FieldLabelProps['description'];
  secondaryLabel?: FieldLabelProps['secondaryLabel'];
  isRequired?: boolean;
};

/** @public */
export interface PasswordFieldProps
  extends Omit<AriaTextFieldProps, 'className' | 'isRequired' | 'description'>,
    Omit<
      FieldLabelProps,
      'htmlFor' | 'id' | 'className' | 'description' | 'secondaryLabel'
    >,
    PasswordFieldOwnProps {}
