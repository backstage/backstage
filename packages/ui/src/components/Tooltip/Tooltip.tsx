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
import {
  OverlayArrow,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  TooltipTriggerComponentProps,
} from 'react-aria-components';
import clsx from 'clsx';
import { TooltipProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { TooltipDefinition } from './definition';
import styles from './Tooltip.module.css';

/** @public */
export const TooltipTrigger = (props: TooltipTriggerComponentProps) => {
  const { delay = 600 } = props;

  return <AriaTooltipTrigger delay={delay} {...props} />;
};

/** @public */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (props, ref) => {
    const { classNames, cleanedProps } = useStyles(TooltipDefinition, props);
    const { className, children, ...rest } = cleanedProps;

    return (
      <AriaTooltip
        className={clsx(
          classNames.tooltip,
          styles[classNames.tooltip],
          className,
        )}
        {...rest}
        ref={ref}
      >
        <OverlayArrow
          className={clsx(classNames.arrow, styles[classNames.arrow])}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V7.94781e-07L1.74846e-07 -9.53674e-07L0 2L1.4651 2C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z" />
            <path d="M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z" />
          </svg>
        </OverlayArrow>
        {children}
      </AriaTooltip>
    );
  },
);

Tooltip.displayName = 'Tooltip';
