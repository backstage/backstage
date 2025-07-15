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
        {...rest}
        ref={ref}
      >
        <OverlayArrow className={classNames.arrow}>
          <svg width={8} height={8} viewBox="0 0 8 8">
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
        {children}
      </AriaTooltip>
    );
  },
);

Tooltip.displayName = Tooltip.displayName;
