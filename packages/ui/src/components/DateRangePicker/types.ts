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

import type { DateRangePickerProps as AriaDateRangePickerProps } from 'react-aria-components';
import type { DateValue } from '@internationalized/date';
import type { Breakpoint } from '../../types';
import type { FieldLabelProps } from '../FieldLabel/types';

/** @public */
export type DateRangePickerOwnProps = {
  /**
   * The size of the date range picker
   * @defaultValue 'small'
   */
  size?: 'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>;

  className?: string;

  label?: FieldLabelProps['label'];
  description?: FieldLabelProps['description'];
  secondaryLabel?: FieldLabelProps['secondaryLabel'];
};

/** @public */
export interface DateRangePickerProps
  extends Omit<AriaDateRangePickerProps<DateValue>, 'className' | 'children'>,
    DateRangePickerOwnProps {}
