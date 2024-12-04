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
import { button } from './button.css';
import { Icon } from '../Icon/Icon';
import type { IconNames } from '../Icon/types';

/**
 * Properties for {@link Button}
 *
 * @public
 */
export interface ButtonProps {
  size?: 'small' | 'medium';
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  disabled?: boolean;
  iconStart?: IconNames;
  iconEnd?: IconNames;
}

/** @public */
export const Button = ({
  size = 'medium',
  variant = 'primary',
  children,
  disabled,
  iconStart,
  iconEnd,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={button({ size, variant, disabled })}
    >
      {iconStart && <Icon name={iconStart} />}
      {children}
      {iconEnd && <Icon name={iconEnd} />}
    </button>
  );
};

export default Button;
