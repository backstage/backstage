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

/** @public */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** @public */
export type Space = 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** @public */
export type Display = 'none' | 'flex' | 'block' | 'inline';

/** @public */
export type FlexDirection = 'row' | 'column';

/** @public */
export type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse';

/** @public */
export type JustifyContent =
  | 'stretch'
  | 'start'
  | 'center'
  | 'end'
  | 'around'
  | 'between';

/** @public */
export type AlignItems = 'stretch' | 'start' | 'center' | 'end';

/** @public */
export type BorderRadius =
  | 'none'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl';

/** @public */
export type Border = 'none' | 'base' | 'error' | 'warning' | 'selected';

/** @public */
export interface UtilityProps {
  alignItems?: AlignItems | Partial<Record<Breakpoint, AlignItems>>;
  border?: Border | Partial<Record<Breakpoint, Border>>;
  borderRadius?: BorderRadius | Partial<Record<Breakpoint, BorderRadius>>;
  display?: Display | Partial<Record<Breakpoint, Display>>;
  flexDirection?: FlexDirection | Partial<Record<Breakpoint, FlexDirection>>;
  flexWrap?: FlexWrap | Partial<Record<Breakpoint, FlexWrap>>;
  gap?: Space | Partial<Record<Breakpoint, Space>>;
  justifyContent?: JustifyContent | Partial<Record<Breakpoint, JustifyContent>>;
  margin?: Space | Partial<Record<Breakpoint, Space>>;
  marginBottom?: Space | Partial<Record<Breakpoint, Space>>;
  marginLeft?: Space | Partial<Record<Breakpoint, Space>>;
  marginRight?: Space | Partial<Record<Breakpoint, Space>>;
  marginTop?: Space | Partial<Record<Breakpoint, Space>>;
  marginX?: Space | Partial<Record<Breakpoint, Space>>;
  marginY?: Space | Partial<Record<Breakpoint, Space>>;
  padding?: Space | Partial<Record<Breakpoint, Space>>;
  paddingBottom?: Space | Partial<Record<Breakpoint, Space>>;
  paddingLeft?: Space | Partial<Record<Breakpoint, Space>>;
  paddingRight?: Space | Partial<Record<Breakpoint, Space>>;
  paddingTop?: Space | Partial<Record<Breakpoint, Space>>;
  paddingX?: Space | Partial<Record<Breakpoint, Space>>;
  paddingY?: Space | Partial<Record<Breakpoint, Space>>;
}
