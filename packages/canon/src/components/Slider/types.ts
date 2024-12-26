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
import type { Breakpoint } from '../../types';

/** @public */
export interface SliderProps {
  label?: string;
  name?: string;
  min?: number;
  max?: number;
  step?: number;
  size?: 'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>;
  value?: number | ReadonlyArray<number>;
  format?: Intl.NumberFormatOptions;
  disabled?: boolean;
  className?: string;
  largeStep?: number;
  orientation?: 'horizontal' | 'vertical';
  defaultValue?: number | ReadonlyArray<number>;
  labelPlacement?: 'left' | 'right' | 'bottom';
  valueLabelDisplay?: 'on' | 'off' | 'auto';
  minStepsBetweenValues?: number;
  onValueChange?: (
    value: number | number[],
    event: Event,
    activeThumbIndex: number,
  ) => void;
  onValueCommitted?: (value: number | number[], event: Event) => void;
}
