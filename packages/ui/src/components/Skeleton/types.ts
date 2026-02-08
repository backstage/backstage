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

import { ComponentProps, ReactNode } from 'react';
import { Responsive, Surface } from '../../types';

/** @public */
export interface SkeletonProps extends ComponentProps<'div'> {
  /**
   * Width of the skeleton. If not provided, defaults to 100% for text
   * skeletons or fits content when children are present.
   */
  width?: number | string;
  /**
   * Height of the skeleton. If not provided, automatically inherits from
   * the parent typography context or fits children's height.
   */
  height?: number | string;
  /**
   * Whether to use fully rounded corners (circular).
   */
  rounded?: boolean;
  /**
   * Children elements. When provided, the skeleton will infer its dimensions
   * from the children, respecting their natural size and preventing layout shift.
   */
  children?: ReactNode;
  /**
   * Surface the skeleton is placed on. Defaults to context surface if available.
   */
  onSurface?: Responsive<Surface>;
}
