/*
 * Copyright 2025 The Backstage Authors
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
import { ToggleButton as AriaToggleButton } from 'react-aria-components';
import type { ToggleButtonProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { ToggleButtonDefinition } from './definition';
import styles from './ToggleButton.module.css';
import { useSurface } from '../../hooks/useSurface';

/** @public */
export const ToggleButton = forwardRef(
  (props: ToggleButtonProps, ref: Ref<HTMLButtonElement>) => {
    const { classNames, dataAttributes, cleanedProps } = useStyles(
      ToggleButtonDefinition,
      {
        size: 'small',
        ...props,
      },
    );

    const { children, className, iconStart, iconEnd, onSurface, ...rest } =
      cleanedProps;

    const { surface } = useSurface({ onSurface });

    return (
      <AriaToggleButton
        className={clsx(classNames.root, styles[classNames.root], className)}
        ref={ref}
        {...dataAttributes}
        {...(typeof surface === 'string' ? { 'data-on-surface': surface } : {})}
        {...rest}
      >
        {renderProps => {
          // If children is a function, call it with render props; otherwise use children as-is
          const renderedChildren =
            typeof children === 'function' ? children(renderProps) : children;

          return (
            <span
              className={clsx(classNames.content, styles[classNames.content])}
              data-slot="content"
            >
              {iconStart}
              {renderedChildren}
              {iconEnd}
            </span>
          );
        }}
      </AriaToggleButton>
    );
  },
);

ToggleButton.displayName = 'ToggleButton';
