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
import { ButtonProps } from './types';
import { useCanon } from '../../contexts/canon';

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
      style,
      ...rest
    } = props;

    const { getResponsiveValue } = useCanon();

    // Get the responsive value for the variant
    const responsiveSize = getResponsiveValue(size);
    const responsiveVariant = getResponsiveValue(variant);

    return (
      <button
        {...rest}
        ref={ref}
        disabled={disabled}
        className={[
          'cn-button',
          `cn-button-${responsiveSize}`,
          `cn-button-${responsiveVariant}`,
        ].join(' ')}
        style={style}
      >
        <span
          className={[
            'cn-button-content',
            iconStart && iconEnd ? 'cn-button-content-icon-both' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {iconStart && <Icon name={iconStart} />}
          {children}
        </span>
        {iconEnd && <Icon name={iconEnd} />}
      </button>
    );
  },
);

export default Button;
