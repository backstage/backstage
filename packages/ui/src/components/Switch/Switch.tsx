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

import { forwardRef } from 'react';
import { Switch as AriaSwitch } from 'react-aria-components';
import type { SwitchProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { SwitchDefinition } from './definition';
import styles from './Switch.module.css';
import clsx from 'clsx';

/** @public */
export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  (props, ref) => {
    const { classNames, cleanedProps } = useStyles(SwitchDefinition, props);
    const { className, label, ...rest } = cleanedProps;

    return (
      <AriaSwitch
        className={clsx(classNames.root, styles[classNames.root], className)}
        ref={ref}
        {...rest}
      >
        <div
          className={clsx(classNames.indicator, styles[classNames.indicator])}
        />
        {label}
      </AriaSwitch>
    );
  },
);

Switch.displayName = 'Switch';
