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

import type { SliderProps as AriaSliderProps } from 'react-aria-components';
import type { FieldLabelProps } from '../FieldLabel/types';

/** @public */
export interface SliderOwnProps {
  className?: string;
  label?: FieldLabelProps['label'];
  secondaryLabel?: FieldLabelProps['secondaryLabel'];
  description?: FieldLabelProps['description'];
  isRequired?: boolean;
}

/** @public */
export interface SliderProps<T extends number | number[]>
  extends Omit<AriaSliderProps<T>, 'children' | 'className'>,
    SliderOwnProps {}
