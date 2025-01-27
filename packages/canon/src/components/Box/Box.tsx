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

import { createElement, forwardRef } from 'react';
import { BoxProps } from './types';
import { getClassNames } from '../../utils/getClassNames';
import clsx from 'clsx';

/** @public */
export const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { as = 'div', className, style, children, ...restProps } = props;

  // Generate utility class names
  const utilityClassNames = getClassNames(restProps);

  // Combine the base class name, the sprinkles class name, and any additional class names
  const classNames = clsx('canon-Box', utilityClassNames, className);

  return createElement(as, {
    ref,
    className: classNames,
    style,
    children,
  });
});
