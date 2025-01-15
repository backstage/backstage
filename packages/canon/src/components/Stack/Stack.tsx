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
import { StackProps } from './types';
import { getClassNames } from '../../utils/getClassNames';
import type { AlignItems, Breakpoint } from '../../types';

// Function to map align values
const mapAlignValue = (value?: StackProps['align']) => {
  if (typeof value === 'string') {
    let returnedValue: AlignItems = 'stretch';
    if (value === 'left') returnedValue = 'stretch';
    if (value === 'center') returnedValue = 'center';
    if (value === 'right') returnedValue = 'end';
    return returnedValue;
  } else if (typeof value === 'object') {
    const returnedValue: Partial<Record<Breakpoint, AlignItems>> = {};
    for (const [key, val] of Object.entries(value)) {
      returnedValue[key as Breakpoint] = mapAlignValue(val) as AlignItems;
    }
    return returnedValue;
  }
  return 'stretch';
};

/** @public */
export const Stack = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  const {
    as = 'div',
    children,
    align = 'left',
    gap = 'xs',
    className,
    style,
    ...restProps
  } = props;

  // Generate utility class names
  const utilityClassNames = getClassNames({
    gap,
    alignItems: mapAlignValue(align),
    ...restProps,
  });

  // Combine the base class name, the sprinkles class name, and any additional class names
  const classNames = ['canon-stack', utilityClassNames, className]
    .filter(Boolean)
    .join(' ');

  return createElement(as, {
    ref,
    className: classNames,
    style,
    children,
  });
});
