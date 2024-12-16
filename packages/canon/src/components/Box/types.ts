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

import { Breakpoint, SpaceProps, ColorProps } from '../../layout/types';

/** @public */
export type DisplayProps =
  | 'flex'
  | 'none'
  | 'inline'
  | 'block'
  | Partial<Record<Breakpoint, 'flex' | 'none' | 'inline' | 'block'>>;

/** @public */
export type FlexDirectionProps =
  | 'row'
  | 'column'
  | Partial<Record<Breakpoint, 'row' | 'column'>>;

/** @public */
export type FlexWrapProps =
  | 'wrap'
  | 'nowrap'
  | Partial<Record<Breakpoint, 'wrap' | 'nowrap'>>;

/** @public */
export type JustifyContentProps =
  | 'stretch'
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-around'
  | 'space-between'
  | Partial<
      Record<
        Breakpoint,
        | 'stretch'
        | 'flex-start'
        | 'center'
        | 'flex-end'
        | 'space-around'
        | 'space-between'
      >
    >;

/** @public */
export type AlignItemsProps =
  | 'stretch'
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | Partial<
      Record<Breakpoint, 'stretch' | 'flex-start' | 'center' | 'flex-end'>
    >;

/** @public */
export type BorderRadiusProps =
  | 'none'
  | 'small'
  | 'medium'
  | 'full'
  | Partial<Record<Breakpoint, 'none' | 'small' | 'medium' | 'full'>>;

/** @public */
export interface BoxProps extends SpaceProps, ColorProps {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  display?: DisplayProps;
  flexDirection?: FlexDirectionProps;
  flexWrap?: FlexWrapProps;
  justifyContent?: JustifyContentProps;
  alignItems?: AlignItemsProps;
  borderRadius?: BorderRadiusProps;
  className?: string;
  style?: React.CSSProperties;
}
