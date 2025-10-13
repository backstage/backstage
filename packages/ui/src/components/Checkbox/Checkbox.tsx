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
import { Checkbox as CheckboxPrimitive } from '@base-ui-components/react/checkbox';
import type { CheckboxProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import clsx from 'clsx';
import styles from './Checkbox.module.css';
import { RiCheckLine } from '@remixicon/react';

/** @public */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (props, ref) => {
    const { classNames, cleanedProps } = useStyles('Checkbox', props);
    const { label, onChange, className, ...rest } = cleanedProps;

    const checkboxElement = (
      <CheckboxPrimitive.Root
        ref={ref}
        className={clsx(classNames.root, styles[classNames.root], className)}
        onCheckedChange={onChange}
        {...rest}
      >
        <CheckboxPrimitive.Indicator
          className={clsx(classNames.indicator, styles[classNames.indicator])}
        >
          <RiCheckLine size={12} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );

    return label ? (
      <label className={clsx(classNames.label, styles[classNames.label])}>
        {checkboxElement}
        {label}
      </label>
    ) : (
      checkboxElement
    );
  },
);
