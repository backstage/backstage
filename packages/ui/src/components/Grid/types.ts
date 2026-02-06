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

import type { Space, SpaceProps, Responsive, Columns, Bg } from '../../types';

/** @public */
export interface GridProps extends SpaceProps {
  children?: React.ReactNode;
  className?: string;
  columns?: Responsive<Columns>;
  gap?: Responsive<Space>;
  style?: React.CSSProperties;
  bg?: Responsive<Bg>;
}

/** @public */
export interface GridItemProps {
  children?: React.ReactNode;
  className?: string;
  colSpan?: Responsive<Columns>;
  colEnd?: Responsive<Columns>;
  colStart?: Responsive<Columns>;
  rowSpan?: Responsive<Columns>;
  style?: React.CSSProperties;
  bg?: Responsive<Bg>;
}
