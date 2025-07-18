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

/** @public */
export const TooltipTrigger = (props: TooltipTriggerComponentProps) => {
  const { delay = 600 } = props;

  return <AriaTooltipTrigger delay={delay} {...props} />;
};

/** @public */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, children, ...rest }, ref) => {
    const { classNames } = useStyles('Tooltip');

    return (
      <AriaTooltip
        className={clsx(classNames.tooltip, className)}
        offset={16}
        {...rest}
        ref={ref}
      >
        <OverlayArrow className={classNames.arrow}>
          <svg width={32} height={32} viewBox="0 0 32 32">
            {/* Identical to the path below, but closed instead of open to fill the background. */}
            <path
              className={classNames.arrowFill}
              d="M32 .5c-2.6 0-3.6.5-4.6 1.7l-9.9 12a2 2 0 0 1-3 0l-9.9-12C3.6 1 2.6.5 0 .5H0h32Z"
            />
            <path
              className={classNames.arrowStroke}
              d="M32 .5c-2.6 0-3.6.5-4.6 1.7l-9.9 12a2 2 0 0 1-3 0l-9.9-12C3.6 1 2.6.5 0 .5"
            />
          </svg>
        </OverlayArrow>
        {children}
      </AriaTooltip>
    );
  },
);

Tooltip.displayName = 'Tooltip';
