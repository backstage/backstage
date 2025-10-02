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

import { Breakpoint } from '../..';
import { ReactNode } from 'react';
import type { SelectProps as AriaSelectProps } from 'react-aria-components';
import type { FieldLabelProps } from '../FieldLabel/types';

/** @public */
export interface SelectProps
  extends AriaSelectProps<{
      name: string;
      value: string;
    }>,
    Omit<FieldLabelProps, 'htmlFor' | 'id'> {
  /**
   * An icon to render before the input
   */
  icon?: ReactNode;

  /**
   * The size of the select field
   * @defaultValue 'medium'
   */
  size?: 'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>;

  /**
   * The options of the select field
   */
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
}
