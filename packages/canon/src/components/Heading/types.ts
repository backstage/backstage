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

import { Breakpoint } from '../../types';
import type { useRender } from '@base-ui-components/react/use-render';

/** @public */
export interface HeadingProps
  extends Omit<useRender.ComponentProps<'h1'>, 'color'> {
  variant?:
    | 'display'
    | 'title1'
    | 'title2'
    | 'title3'
    | 'title4'
    | 'title5'
    | Partial<
        Record<
          Breakpoint,
          'display' | 'title1' | 'title2' | 'title3' | 'title4' | 'title5'
        >
      >;
  color?:
    | 'primary'
    | 'secondary'
    | Partial<Record<Breakpoint, 'primary' | 'secondary'>>;
  truncate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
