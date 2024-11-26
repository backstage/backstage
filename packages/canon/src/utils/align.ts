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

import {
  type OptionalResponsiveValue,
  mapResponsiveValue,
} from '../components/box/sprinkles.css';

export type Align = 'left' | 'center' | 'right';
export type AlignY = 'top' | 'center' | 'bottom';

const alignToFlexAlignLookup = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
} as const;

export const alignToFlexAlign = (
  align: OptionalResponsiveValue<Align> | undefined,
) =>
  align
    ? mapResponsiveValue(align, value => alignToFlexAlignLookup[value])
    : undefined;

const alignYToFlexAlignLookup = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
} as const;

export const alignYToFlexAlign = (
  alignY: OptionalResponsiveValue<AlignY> | undefined,
) =>
  alignY
    ? mapResponsiveValue(alignY, value => alignYToFlexAlignLookup[value])
    : undefined;
