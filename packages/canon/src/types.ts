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
export type AsProps =
  | 'div'
  | 'span'
  | 'p'
  | 'article'
  | 'section'
  | 'main'
  | 'nav'
  | 'aside'
  | 'ul'
  | 'ol'
  | 'li'
  | 'details'
  | 'summary'
  | 'dd'
  | 'dl'
  | 'dt';

/** @public */
export type Breakpoint = 'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** @public */
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

/** @public */
export type Space =
  | '0.5'
  | '1'
  | '1.5'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | string;

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
export type Columns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto';

/** @public */
export interface SpaceProps {
  m?: Responsive<Space>;
  mb?: Responsive<Space>;
  ml?: Responsive<Space>;
  mr?: Responsive<Space>;
  mt?: Responsive<Space>;
  mx?: Responsive<Space>;
  my?: Responsive<Space>;
  p?: Responsive<Space>;
  pb?: Responsive<Space>;
  pl?: Responsive<Space>;
  pr?: Responsive<Space>;
  pt?: Responsive<Space>;
  px?: Responsive<Space>;
  py?: Responsive<Space>;
}

/** @public */
export interface UtilityProps extends SpaceProps {
  alignItems?: Responsive<AlignItems>;
  border?: Responsive<Border>;
  borderRadius?: Responsive<BorderRadius>;
  colEnd?: Responsive<Columns | 'auto'>;
  colSpan?: Responsive<Columns | 'full'>;
  colStart?: Responsive<Columns | 'auto'>;
  columns?: Responsive<Columns>;
  display?: Responsive<Display>;
  flexDirection?: Responsive<FlexDirection>;
  flexWrap?: Responsive<FlexWrap>;
  gap?: Responsive<Space>;
  justifyContent?: Responsive<JustifyContent>;
  rowSpan?: Responsive<Columns | 'full'>;
}
