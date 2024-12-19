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
export type Theme = 'light' | 'dark';

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
