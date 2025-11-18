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
import type { ButtonIconProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { ButtonDefinition } from '../Button/definition';
import { ButtonIconDefinition } from './definition';
import stylesButtonIcon from './ButtonIcon.module.css';
import stylesButton from '../Button/Button.module.css';

/** @public */
export const ButtonIcon = forwardRef(
  (props: ButtonIconProps, ref: Ref<HTMLButtonElement>) => {
    const { classNames, dataAttributes, cleanedProps } = useStyles(
      ButtonDefinition,
      {
        size: 'small',
        variant: 'primary',
        ...props,
      },
    );

    const { classNames: classNamesButtonIcon } =
      useStyles(ButtonIconDefinition);

    const { className, icon, loading, ...rest } = cleanedProps;

    return (
      <RAButton
        className={clsx(
          classNames.root,
          classNamesButtonIcon.root,
          stylesButton[classNames.root],
          stylesButtonIcon[classNamesButtonIcon.root],
          className,
        )}
        ref={ref}
        isPending={loading}
        {...dataAttributes}
        {...rest}
      >
        {({ isPending }) => (
          <>
            <span
              className={clsx(
                classNames.content,
                classNamesButtonIcon.content,
                stylesButton[classNames.content],
                stylesButtonIcon[classNamesButtonIcon.content],
                className,
              )}
            >
              {icon}
            </span>

            {isPending && (
              <ProgressBar
                aria-label="Loading"
                isIndeterminate
                className={clsx(
                  classNames.spinner,
                  classNamesButtonIcon.spinner,
                  stylesButton[classNames.spinner],
                  stylesButtonIcon[classNamesButtonIcon.spinner],
                  className,
                )}
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

ButtonIcon.displayName = 'ButtonIcon';
