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

import { forwardRef, Ref } from 'react';
import { Button as RAButton, ProgressBar } from 'react-aria-components';
import { RiLoader4Line } from '@remixicon/react';
import type { ButtonProps } from './types';
import { ButtonDefinition } from './definition';
import styles from './Button.module.css';
import { useComponentDefinition } from '../../hooks/useComponentDefinition';

/** @public */
export const Button = forwardRef(
  (props: ButtonProps, ref: Ref<HTMLButtonElement>) => {
    const { classNames, ownProps, inheritedProps, dataAttributes } =
      useComponentDefinition(ButtonDefinition, styles, props);
    const { children, iconStart, iconEnd, loading } = ownProps;

    return (
      <RAButton
        className={classNames.root}
        ref={ref}
        isPending={loading}
        {...dataAttributes}
        {...inheritedProps}
      >
        {({ isPending }) => (
          <>
            <span className={classNames.content}>
              {iconStart}
              {children}
              {iconEnd}
            </span>

            {isPending && (
              <ProgressBar
                aria-label="Loading"
                isIndeterminate
                className={classNames.spinner}
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
