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
import clsx from 'clsx';
import { extractProps } from '../../utils/extractProps';
import { spacingPropDefs } from '../../props/spacing.props';
import { boxPropDefs } from './Box.props';
import { widthPropDefs } from '../../props/width.props';
import { heightPropDefs } from '../../props/height.props';
import { positionPropDefs } from '../../props/position.props';
import { displayPropDefs } from '../../props/display.props';

/** @public */
export const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { as = 'div', children } = props;

  const propDefs = {
    ...spacingPropDefs,
    ...widthPropDefs,
    ...heightPropDefs,
    ...positionPropDefs,
    ...displayPropDefs,
    ...boxPropDefs,
  };
  const { className, style } = extractProps(props, propDefs);

  return createElement(as, {
    ref,
    className: clsx('canon-Box', className),
    style,
    children,
  });
});

Box.displayName = 'Box';
