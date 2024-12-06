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
import type { IconNames } from '../Icon/types';

/**
 * Properties for {@link Button}
 *
 * @public
 */
export interface ButtonProps {
  size?: 'small' | 'medium';
  variant?: 'primary' | 'secondary' | 'tertiary';
  children: React.ReactNode;
  disabled?: boolean;
  iconStart?: IconNames;
  iconEnd?: IconNames;
}

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
    } = props;

    return (
      <button
        {...props}
        ref={ref}
        disabled={disabled}
        className={`button ${variant} ${size}`}
      >
        <span
          className={['button-content', iconStart && iconEnd ? 'icon-both' : '']
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
