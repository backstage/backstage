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

import type { Breakpoint } from '../../types';
import type { LinkProps as AriaLinkProps } from 'react-aria-components';

/** @public */
export interface LinkProps extends AriaLinkProps {
  variant?:
    | 'title-large'
    | 'title-medium'
    | 'title-small'
    | 'title-x-small'
    | 'body-large'
    | 'body-medium'
    | 'body-small'
    | 'body-x-small'
    | Partial<
        Record<
          Breakpoint,
          | 'title-large'
          | 'title-medium'
          | 'title-small'
          | 'title-x-small'
          | 'body-large'
          | 'body-medium'
          | 'body-small'
          | 'body-x-small'
        >
      >;
  weight?: 'regular' | 'bold' | Partial<Record<Breakpoint, 'regular' | 'bold'>>;
  color?:
    | 'primary'
    | 'secondary'
    | Partial<Record<Breakpoint, 'primary' | 'secondary'>>;
}
