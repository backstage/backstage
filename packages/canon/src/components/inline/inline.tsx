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
import { Box, BoxProps } from '../box/box';
import { alignToFlexAlign } from '../../utils/align';

export const validInlineComponents = [
  'div',
  'span',
  'p',
  'nav',
  'ul',
  'ol',
  'li',
] as const;

export interface InlineProps extends Omit<BoxProps, 'alignItems'> {
  as?: (typeof validInlineComponents)[number];
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  gap?: BoxProps['gap'];
}

export const Inline = ({
  align,
  as = 'div',
  children,
  gap = 'xs',
  ...restProps
}: InlineProps) => {
  return (
    <Box
      as={as}
      display="flex"
      alignItems={align !== 'left' ? alignToFlexAlign(align) : undefined}
      justifyContent="flex-start"
      flexWrap="wrap"
      gap={gap}
      {...restProps}
    >
      {children}
    </Box>
  );
};
