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

import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { useResponsiveValue } from '../../hooks/useResponsiveValue';

import type { HeadingProps } from './types';

/** @public */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => {
    const {
      children,
      variant = 'title1',
      as = 'h1',
      className,
      ...restProps
    } = props;

    // Get the responsive value for the variant
    const responsiveVariant = useResponsiveValue(variant);

    // Determine the component to render based on the variant
    let Component = as;
    if (variant === 'title2') Component = 'h2';
    if (variant === 'title3') Component = 'h3';
    if (variant === 'title4') Component = 'h4';
    if (variant === 'title5') Component = 'h5';
    if (as) Component = as;

    return (
      <Component
        ref={ref}
        className={clsx(
          'canon-Heading',
          responsiveVariant && `canon-Heading--variant-${responsiveVariant}`,
          className,
        )}
        {...restProps}
      >
        {children}
      </Component>
    );
  },
);

Heading.displayName = 'Heading';
