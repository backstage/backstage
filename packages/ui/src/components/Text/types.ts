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

import type { ElementType, ComponentPropsWithRef } from 'react';
import type {
  Breakpoint,
  TextVariants,
  TextWeights,
  TextColors,
  TextColorStatus,
} from '../../types';

/** @public */
export type TextOwnProps = {
  as?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p'
    | 'span'
    | 'label'
    | 'div'
    | 'strong'
    | 'em'
    | 'small'
    | 'legend';
  variant?: TextVariants | Partial<Record<Breakpoint, TextVariants>>;
  weight?: TextWeights | Partial<Record<Breakpoint, TextWeights>>;
  color?:
    | TextColors
    | TextColorStatus
    | Partial<Record<Breakpoint, TextColors | TextColorStatus>>;
  truncate?: boolean;
};

/** @public */
export type TextProps<T extends ElementType = 'span'> = TextOwnProps &
  Omit<ComponentPropsWithRef<T>, keyof TextOwnProps>;
