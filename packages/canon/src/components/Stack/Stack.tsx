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

import React from 'react';
import { Box } from '../Box/Box';
import { alignToFlexAlign } from '../../utils/align';
import type { BoxProps } from '../Box/types';
const validStackComponents = [
  'div',
  'span',
  'p',
  'article',
  'section',
  'main',
  'nav',
  'aside',
  'ul',
  'ol',
  'li',
  'details',
  'summary',
  'dd',
  'dl',
  'dt',
] as const;

export interface StackProps extends Omit<BoxProps, 'alignItems'> {
  children: React.ReactNode;
  as?: (typeof validStackComponents)[number];
  align?: 'left' | 'center' | 'right';
  gap?: BoxProps['gap'];
}

export const Stack = ({
  as = 'div',
  children,
  align: alignProp,
  gap = 'xs',
  ...restProps
}: StackProps) => {
  /**
   * Creating a seam between the provided prop and the default value
   * to enable only setting the text alignment when the `align` prop
   * is provided — not when it's defaulted.
   */
  const align = alignProp || 'left';

  return (
    <Box
      as={as}
      display="flex"
      flexDirection="column"
      alignItems={align !== 'left' ? alignToFlexAlign(align) : undefined}
      gap={gap}
      // textAlign={alignProp}
      {...restProps}
    >
      {children}
    </Box>
  );
};
