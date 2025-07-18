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

const tooltipArrowPathDefinition =
  'M30 0h-1a6.314 6.314 0 0 0-4.895 2.326l-7.555 9.271a2 2 0 0 1-3.1 0L5.895 2.326A6.314 6.314 0 0 0 1 0H0';

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
        offset={14}
        {...rest}
        ref={ref}
      >
        <OverlayArrow className={classNames.arrow}>
          <svg width={30} height={30} viewBox="0 0 30 30">
            <path
              className={classNames.arrowFill}
              d={tooltipArrowPathDefinition}
            />
            <path
              className={classNames.arrowStroke}
              d={tooltipArrowPathDefinition}
            />
          </svg>
        </OverlayArrow>
        {children}
      </AriaTooltip>
    );
  },
);

Tooltip.displayName = 'Tooltip';
