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
import { boxSprinkles } from './sprinkles.css';
import { base } from './box.css';
import { BoxProps } from './types';

/** @public */
export const Box = (props: BoxProps) => {
  const { as = 'div', className, style, children, ...restProps } = props;

  // Generate the list of class names
  const sprinklesClassName = boxSprinkles(restProps);

  // Combine the base class name, the sprinkles class name, and any additional class names
  const classNames = [base, sprinklesClassName, className]
    .filter(Boolean)
    .join(' ');

  return createElement(as, {
    className: classNames,
    style,
    children,
  });
};
