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

import type {
  Breakpoint,
  TextColors,
  TextColorStatus,
  TextVariants,
  TextWeights,
} from '../../types';
import type { LinkProps as AriaLinkProps } from 'react-aria-components';
import type { ReactNode } from 'react';

/** @public */
export interface LinkProps extends AriaLinkProps {
  variant?: TextVariants | Partial<Record<Breakpoint, TextVariants>>;
  weight?: TextWeights | Partial<Record<Breakpoint, TextWeights>>;
  color?:
    | TextColors
    | TextColorStatus
    | Partial<Record<Breakpoint, TextColors | TextColorStatus>>;
  truncate?: boolean;

  // This is used to set the title attribute on the link
  title?: string;

  // This is used to set the children of the link
  children?: ReactNode;
}
