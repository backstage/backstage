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

import type { Breakpoint } from '../../types';

/** @public */
export interface TextFieldProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
  /**
   * The class name of the text field
   */
  className?: string;

  /**
   * The size of the text field
   * @defaultValue 'medium'
   */
  size?: 'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>;

  /**
   * The label of the text field
   */
  label?: string;

  /**
   * The description of the text field
   */
  description?: string;

  /**
   * The name of the text field
   */
  name: string;

  /**
   * The error message of the text field
   */
  error?: string | null;
}
