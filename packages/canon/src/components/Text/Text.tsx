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

'use client';

import React, { forwardRef } from 'react';
import { useResponsiveValue } from '../../hooks/useResponsiveValue';
import clsx from 'clsx';

import type { TextProps } from './types';

/** @public */
export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  (props, ref) => {
    const {
      children,
      variant = 'body',
      weight = 'regular',
      style,
      className,
      ...restProps
    } = props;

    // Get the responsive values for the variant and weight
    const responsiveVariant = useResponsiveValue(variant);
    const responsiveWeight = useResponsiveValue(weight);

    return (
      <p
        ref={ref}
        className={clsx(
          'canon-Text',
          responsiveVariant && `canon-Text--variant-${responsiveVariant}`,
          responsiveWeight && `canon-Text--weight-${responsiveWeight}`,
          className,
        )}
        style={style}
        {...restProps}
      >
        {children}
      </p>
    );
  },
);

Text.displayName = 'Text';
