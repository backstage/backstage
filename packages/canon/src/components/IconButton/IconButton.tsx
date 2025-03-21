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
import { Icon } from '../Icon';
import clsx from 'clsx';
import { useResponsiveValue } from '../../hooks/useResponsiveValue';

import type { IconButtonProps } from './types';

/** @public */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (props: IconButtonProps, ref) => {
    const {
      size = 'medium',
      variant = 'primary',
      icon,
      className,
      style,
      ...rest
    } = props;

    const responsiveSize = useResponsiveValue(size);
    const responsiveVariant = useResponsiveValue(variant);

    return (
      <button
        ref={ref}
        className={clsx(
          'canon-IconButton',
          `canon-IconButton--size-${responsiveSize}`,
          `canon-IconButton--variant-${responsiveVariant}`,
          className,
        )}
        style={style}
        {...rest}
      >
        <Icon name={icon} className="canon-IconButton--icon" />
      </button>
    );
  },
);

export default IconButton;
