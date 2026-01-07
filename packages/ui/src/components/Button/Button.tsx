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
import { Button as RAButton, ProgressBar } from 'react-aria-components';
import { RiLoader4Line } from '@remixicon/react';
import type { ButtonProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { ButtonDefinition } from './definition';
import styles from './Button.module.css';
import { useSurface } from '../../hooks/useSurface';

/** @public */
export const Button = forwardRef(
  (props: ButtonProps, ref: Ref<HTMLButtonElement>) => {
    const { classNames, dataAttributes, cleanedProps } = useStyles(
      ButtonDefinition,
      {
        size: 'small',
        variant: 'primary',
        ...props,
      },
    );

    const {
      children,
      className,
      iconStart,
      iconEnd,
      loading,
      onSurface,
      ...rest
    } = cleanedProps;

    const { surface } = useSurface({ onSurface });

    return (
      <RAButton
        className={clsx(classNames.root, styles[classNames.root], className)}
        ref={ref}
        isPending={loading}
        {...dataAttributes}
        {...(typeof surface === 'string' ? { 'data-on-surface': surface } : {})}
        {...rest}
      >
        {({ isPending }) => (
          <>
            <span
              className={clsx(classNames.content, styles[classNames.content])}
            >
              {iconStart}
              {children}
              {iconEnd}
            </span>

            {isPending && (
              <ProgressBar
                aria-label="Loading"
                isIndeterminate
                className={clsx(classNames.spinner, styles[classNames.spinner])}
              >
                <RiLoader4Line aria-hidden="true" />
              </ProgressBar>
            )}
          </>
        )}
      </RAButton>
    );
  },
);

Button.displayName = 'Button';
