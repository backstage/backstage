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
import { GridItemProps, GridProps } from './types';
import { getClassNames } from '../../utils/getClassNames';

const GridBase = forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  const {
    children,
    gap = 'xs',
    columns = 'auto',
    className,
    style,
    ...restProps
  } = props;

  const utilityClassNames = getClassNames({ gap, columns, ...restProps });

  const classNames = ['canon-grid', utilityClassNames, className]
    .filter(Boolean)
    .join(' ');

  return createElement('div', {
    ref,
    className: classNames,
    style,
    children,
  });
});

const GridItem = forwardRef<HTMLDivElement, GridItemProps>((props, ref) => {
  const { children, className, style, ...restProps } = props;

  const utilityClassNames = getClassNames(restProps);

  const classNames = ['grid-item', utilityClassNames, className]
    .filter(Boolean)
    .join(' ');

  return createElement('div', {
    ref,
    className: classNames,
    style,
    children,
  });
});

/** @public */
export const Grid = Object.assign(GridBase, { Item: GridItem });
