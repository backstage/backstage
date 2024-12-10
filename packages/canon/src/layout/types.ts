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
export type Breakpoint = keyof typeof breakpoints;

/** @public */
export type Space = keyof typeof space;

/** @public */
export type Theme = keyof typeof themes;

/** @public */
export type Gap = Space | Partial<Record<Breakpoint, Space>>;

/** @public */
export type PaddingLeft = Space | Partial<Record<Breakpoint, Space>>;

/** @public */
export type PaddingRight = Space | Partial<Record<Breakpoint, Space>>;

/** @public */
export type PaddingTop = Space | Partial<Record<Breakpoint, Space>>;

/** @public */
export type PaddingBottom = Space | Partial<Record<Breakpoint, Space>>;

/** @public */
export type Padding = Space | Partial<Record<Breakpoint, Space>>;

/** @public */
export type PaddingX = Space | Partial<Record<Breakpoint, Space>>;

/** @public */
export type PaddingY = Space | Partial<Record<Breakpoint, Space>>;

/** @public */
export type MarginLeft = Space | Partial<Record<Breakpoint, Space>>;

/** @public */
export type MarginRight = Space | Partial<Record<Breakpoint, Space>>;

/** @public */
export type MarginTop = Space | Partial<Record<Breakpoint, Space>>;

/** @public */
export type MarginBottom = Space | Partial<Record<Breakpoint, Space>>;

/** @public */
export type Margin = Space | Partial<Record<Breakpoint, Space>>;

/** @public */
export type MarginX = Space | Partial<Record<Breakpoint, Space>>;

/** @public */
export type MarginY = Space | Partial<Record<Breakpoint, Space>>;

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
