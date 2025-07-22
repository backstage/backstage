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

import clsx from 'clsx';
import { forwardRef, Ref } from 'react';
import { Button as RAButton } from 'react-aria-components';
import type { ButtonProps } from './types';
import { useStyles } from '../../hooks/useStyles';

/** @public */
export const Button = forwardRef(
  (props: ButtonProps, ref: Ref<HTMLButtonElement>) => {
    const {
      size = 'small',
      variant = 'primary',
      iconStart,
      iconEnd,
      children,
      className,
      ...rest
    } = props;

    const { classNames, dataAttributes } = useStyles('Button', {
      size,
      variant,
    });

    return (
      <RAButton
        className={clsx(classNames.root, className)}
        ref={ref}
        {...dataAttributes}
        {...rest}
      >
        {iconStart}
        {children}
        {iconEnd}
      </RAButton>
    );
  },
);

Button.displayName = 'Button';
