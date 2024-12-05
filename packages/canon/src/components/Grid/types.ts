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
import { Breakpoint, ColorProps } from '../../layout/types';
import { SpaceProps } from '../../layout/types';

/** @public */
export type Columns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** @public */
export interface GridProps extends SpaceProps, ColorProps {
  children?: React.ReactNode;
  columns?: Columns | Partial<Record<Breakpoint, Columns>>;
  className?: string;
  style?: React.CSSProperties;
}

/** @public */
export interface GridItemProps {
  children: React.ReactNode;
  rowSpan?: Columns | 'full';
  colSpan?: Columns | 'full';
  start?: Columns | 'auto';
  end?: Columns | 'auto';
  className?: string;
  style?: React.CSSProperties;
}
