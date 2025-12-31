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
import { ToggleButton as RAToggleButton } from 'react-aria-components';
import type { ToggleButtonProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import styles from './ToggleButton.module.css';

/** @public */
export const ToggleButton = forwardRef(
  (props: ToggleButtonProps, ref: Ref<HTMLButtonElement>) => {
    const { classNames, dataAttributes, cleanedProps } = useStyles(
      'ToggleButton',
      {
        size: 'small',
        ...props,
      },
    );

    const { children, className, iconStart, iconEnd, ...rest } = cleanedProps;

    return (
      <RAToggleButton
        className={clsx(classNames.root, styles[classNames.root], className)}
        ref={ref}
        {...dataAttributes}
        {...rest}
      >
        {iconStart}
        {children}
        {iconEnd}
      </RAToggleButton>
    );
  },
);

ToggleButton.displayName = 'ToggleButton';
