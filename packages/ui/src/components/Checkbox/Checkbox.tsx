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
import { Checkbox as RACheckbox } from 'react-aria-components';
import type { CheckboxProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { CheckboxDefinition } from './definition';
import clsx from 'clsx';
import styles from './Checkbox.module.css';
import { RiCheckLine, RiSubtractLine } from '@remixicon/react';

/** @public */
export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  (props, ref) => {
    const { classNames } = useStyles(CheckboxDefinition);
    const { className, children, ...rest } = props;

    return (
      <RACheckbox
        ref={ref}
        className={clsx(classNames.root, styles[classNames.root], className)}
        {...rest}
      >
        {({ isIndeterminate }) => (
          <>
            <div
              className={clsx(
                classNames.indicator,
                styles[classNames.indicator],
              )}
            >
              {isIndeterminate ? (
                <RiSubtractLine size={12} />
              ) : (
                <RiCheckLine size={12} />
              )}
            </div>
            {children}
          </>
        )}
      </RACheckbox>
    );
  },
);
