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
import { ToggleButtonGroup as AriaToggleButtonGroup } from 'react-aria-components';
import type { ToggleButtonGroupProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { ToggleButtonGroupDefinition } from './definition';
import styles from './ToggleButtonGroup.module.css';

/** @public */
export const ToggleButtonGroup = forwardRef(
  (props: ToggleButtonGroupProps, ref: Ref<HTMLDivElement>) => {
    const { classNames, dataAttributes, cleanedProps } = useStyles(
      ToggleButtonGroupDefinition,
      {
        ...props,
      },
    );

    const { className, children, ...rest } = cleanedProps;

    return (
      <AriaToggleButtonGroup
        className={clsx(classNames.root, styles[classNames.root], className)}
        ref={ref}
        {...dataAttributes}
        {...rest}
      >
        {children}
      </AriaToggleButtonGroup>
    );
  },
);

ToggleButtonGroup.displayName = 'ToggleButtonGroup';
