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

import { forwardRef } from 'react';
import clsx from 'clsx';
import { useResponsiveValue } from '../../hooks/useResponsiveValue';

import type { ButtonProps } from './types';

/** @public */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props: ButtonProps, ref) => {
    const {
      size = 'medium',
      variant = 'primary',
      disabled,
      iconStart,
      iconEnd,
      children,
      className,
      style,
      ...rest
    } = props;

    // Get the responsive value for the variant
    const responsiveSize = useResponsiveValue(size);
    const responsiveVariant = useResponsiveValue(variant);

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={clsx('canon-Button', className)}
        data-size={responsiveSize}
        data-variant={responsiveVariant}
        style={style}
        {...rest}
      >
        {iconStart && (
          <span
            className="canon-ButtonIcon"
            aria-hidden="true"
            data-size={responsiveSize}
          >
            {iconStart}
          </span>
        )}
        {children}
        {iconEnd && (
          <span
            className="canon-ButtonIcon"
            aria-hidden="true"
            data-size={responsiveSize}
          >
            {iconEnd}
          </span>
        )}
      </button>
    );
  },
);

export default Button;
