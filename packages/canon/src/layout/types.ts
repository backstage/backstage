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

import { breakpoints, space, themes } from './properties';

/** @public */
export type BreakpointLocal = keyof typeof breakpoints;

/** @public */
export type SpaceLocal = keyof typeof space;

/** @public */
export type Theme = keyof typeof themes;

/** @public */
export type Gap = SpaceLocal | Partial<Record<BreakpointLocal, SpaceLocal>>;

/** @public */
export type PaddingLeft =
  | SpaceLocal
  | Partial<Record<BreakpointLocal, SpaceLocal>>;

/** @public */
export type PaddingRight =
  | SpaceLocal
  | Partial<Record<BreakpointLocal, SpaceLocal>>;

/** @public */
export type PaddingTop =
  | SpaceLocal
  | Partial<Record<BreakpointLocal, SpaceLocal>>;

/** @public */
export type PaddingBottom =
  | SpaceLocal
  | Partial<Record<BreakpointLocal, SpaceLocal>>;

/** @public */
export type Padding = SpaceLocal | Partial<Record<BreakpointLocal, SpaceLocal>>;

/** @public */
export type PaddingX =
  | SpaceLocal
  | Partial<Record<BreakpointLocal, SpaceLocal>>;

/** @public */
export type PaddingY =
  | SpaceLocal
  | Partial<Record<BreakpointLocal, SpaceLocal>>;

/** @public */
export type MarginLeft =
  | SpaceLocal
  | Partial<Record<BreakpointLocal, SpaceLocal>>;

/** @public */
export type MarginRight =
  | SpaceLocal
  | Partial<Record<BreakpointLocal, SpaceLocal>>;

/** @public */
export type MarginTop =
  | SpaceLocal
  | Partial<Record<BreakpointLocal, SpaceLocal>>;

/** @public */
export type MarginBottom =
  | SpaceLocal
  | Partial<Record<BreakpointLocal, SpaceLocal>>;

/** @public */
export type Margin = SpaceLocal | Partial<Record<BreakpointLocal, SpaceLocal>>;

/** @public */
export type MarginX = SpaceLocal | Partial<Record<BreakpointLocal, SpaceLocal>>;

/** @public */
export type MarginY = SpaceLocal | Partial<Record<BreakpointLocal, SpaceLocal>>;

/** @public */
export interface SpaceProps {
  gap?: Gap;
  padding?: Padding;
  paddingLeft?: PaddingLeft;
  paddingRight?: PaddingRight;
  paddingTop?: PaddingTop;
  paddingBottom?: PaddingBottom;
  paddingX?: PaddingX;
  paddingY?: PaddingY;
  margin?: Margin;
  marginLeft?: MarginLeft;
  marginRight?: MarginRight;
  marginTop?: MarginTop;
  marginBottom?: MarginBottom;
  marginX?: MarginX;
  marginY?: MarginY;
}

/** @public */
export type Background =
  | 'background'
  | 'elevation1'
  | 'elevation2'
  | 'transparent'
  | Partial<
      Record<Theme, 'background' | 'elevation1' | 'elevation2' | 'transparent'>
    >;

/** @public */
export type Color =
  | 'primary'
  | 'secondary'
  | 'error'
  | Partial<Record<Theme, 'primary' | 'secondary' | 'error'>>;

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
export interface ColorProps {
  color?: Color;
  background?: Background;
}
