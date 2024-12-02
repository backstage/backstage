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

import { createElement } from 'react';
import { inlineSprinkles } from './sprinkles.css';
import type { InlineProps } from './types';

const alignYToFlexAlign = (alignY: InlineProps['alignY']) => {
  if (alignY === 'top') return 'flex-start';
  if (alignY === 'center') return 'center';
  if (alignY === 'bottom') return 'flex-end';
  return undefined;
};

const alignToFlexAlignY = (align: InlineProps['align']) => {
  if (align === 'left') return 'flex-start';
  if (align === 'center') return 'center';
  if (align === 'right') return 'flex-end';
  return undefined;
};

export const Inline = ({
  as = 'div',
  children,
  align = 'left',
  alignY = 'top',
  gap = 'xs',
  className,
  style,
  ...restProps
}: InlineProps) => {
  // Generate the list of class names
  const sprinklesClassName = inlineSprinkles({
    ...restProps,
    gap,
    alignItems: alignYToFlexAlign(alignY),
    justifyContent: alignToFlexAlignY(align),
  });

  // Combine the base class name, the sprinkles class name, and any additional class names
  const classNames = ['inline', sprinklesClassName, className]
    .filter(Boolean)
    .join(' ');

  return createElement(as, {
    className: classNames,
    style,
    children,
  });
};
