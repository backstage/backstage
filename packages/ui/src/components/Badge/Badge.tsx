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

import type { BadgeProps } from './types';
import { forwardRef } from 'react';
import { ProgressBar } from 'react-aria-components';
import {
  RiLoader4Line,
  RiInformationLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiAlertLine,
} from '@remixicon/react';
import { useDefinition } from '../../hooks/useDefinition';
import { BadgeDefinition } from './definition';

/**
 * A non-interactive badge for labeling or categorizing content.
 *
 * @remarks
 * The Badge component supports an optional status (info, success, warning,
 * danger) that changes its colors and shows the matching status icon when no
 * `icon` is provided, and a pending state that shows a spinning loading
 * indicator after the text.
 *
 * @example
 * Basic usage:
 * ```tsx
 * <Badge>Banana</Badge>
 * ```
 *
 * @example
 * With a status and its default icon:
 * ```tsx
 * <Badge status="success">Deployed</Badge>
 * ```
 *
 * @example
 * With a status and no icon:
 * ```tsx
 * <Badge status="success" icon={false}>
 *   Deployed
 * </Badge>
 * ```
 *
 * @example
 * With a pending state:
 * ```tsx
 * <Badge status="info" isPending={isDeploying}>
 *   Deploying
 * </Badge>
 * ```
 *
 * @public
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>((props, ref) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    BadgeDefinition,
    props,
  );
  const { classes, children, icon, isPending, status } = ownProps;

  const getStatusIcon = () => {
    switch (status) {
      case 'info':
        return <RiInformationLine aria-hidden="true" />;
      case 'success':
        return <RiCheckLine aria-hidden="true" />;
      case 'warning':
        return <RiErrorWarningLine aria-hidden="true" />;
      case 'danger':
        return <RiAlertLine aria-hidden="true" />;
      default:
        return null;
    }
  };

  // Fall back to the status icon when no icon is provided. Passing `false`
  // (or `null`) hides the icon entirely.
  const resolvedIcon =
    icon === undefined || icon === true ? getStatusIcon() : icon;

  return (
    <span ref={ref} className={classes.root} {...dataAttributes} {...restProps}>
      {resolvedIcon && <span className={classes.icon}>{resolvedIcon}</span>}
      {children}
      {isPending && (
        <span className={classes.icon}>
          <ProgressBar
            aria-label="Loading"
            isIndeterminate
            className={classes.spinner}
          >
            <RiLoader4Line aria-hidden="true" />
          </ProgressBar>
        </span>
      )}
    </span>
  );
});
