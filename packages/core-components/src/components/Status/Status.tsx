/*
 * Copyright 2020 The Backstage Authors
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

import { cn } from '../../lib/utils';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  X,
  Play,
} from 'lucide-react';
import { PropsWithChildren } from 'react';

/**
 * CSS class keys for status indicator styling.
 *
 * @remarks
 * Preserved for backward compatibility with the overridable components system.
 * Consumers may reference these keys for custom CSS overrides via CSS custom properties.
 *
 * @public
 */
export type StatusClassKey =
  | 'status'
  | 'ok'
  | 'warning'
  | 'error'
  | 'pending'
  | 'running'
  | 'aborted';

/** Common Tailwind classes for the status wrapper span */
const statusBaseClasses = 'inline-flex items-baseline font-medium';

/**
 * Common Tailwind classes for status icons.
 * Applies flex-shrink-0, relative positioning with a small top offset
 * for baseline alignment, right margin, and consistent icon sizing.
 */
const statusIconClasses =
  'shrink-0 relative top-[0.125em] mr-2 w-[0.8em] h-[0.8em]';

/**
 * Displays a green check-circle icon indicating a successful or healthy status.
 *
 * @remarks
 * Uses the CheckCircle (circle with checkmark) shape as a color-blind-friendly
 * indicator that visually distinguishes OK from other states regardless of color
 * perception. Color is applied via the `--success-foreground` CSS custom property.
 *
 * @public
 */
export function StatusOK(props: PropsWithChildren<{}>) {
  const { children, ...otherProps } = props;
  return (
    <span
      className={cn(statusBaseClasses)}
      aria-label="Status ok"
      aria-hidden="true"
      {...otherProps}
    >
      <CheckCircle
        data-testid="status-ok"
        className={cn(
          statusIconClasses,
          'text-[var(--success-foreground,#3E8635)]',
        )}
      />
      {children}
    </span>
  );
}

/**
 * Displays an amber triangle icon indicating a warning status.
 *
 * @remarks
 * Uses the AlertTriangle (triangle) shape as a color-blind-friendly indicator
 * that visually distinguishes warnings from OK (circle) and Error (X-circle)
 * states. Color is applied via the `--warning-foreground` CSS custom property.
 *
 * @public
 */
export function StatusWarning(props: PropsWithChildren<{}>) {
  const { children, ...otherProps } = props;
  return (
    <span
      className={cn(statusBaseClasses)}
      aria-label="Status warning"
      aria-hidden="true"
      {...otherProps}
    >
      <AlertTriangle
        data-testid="status-warning"
        className={cn(
          statusIconClasses,
          'text-[var(--warning-foreground,#F0AB00)]',
        )}
      />
      {children}
    </span>
  );
}

/**
 * Displays a red X-circle icon indicating an error or failure status.
 *
 * @remarks
 * Uses the XCircle (circle with X) shape as a color-blind-friendly indicator
 * that visually distinguishes errors from OK (checkmark circle) and Warning
 * (triangle) states. Color is applied via the `--destructive` CSS custom property.
 *
 * @public
 */
export function StatusError(props: PropsWithChildren<{}>) {
  const { children, ...otherProps } = props;
  return (
    <span
      className={cn(statusBaseClasses)}
      aria-label="Status error"
      aria-hidden="true"
      {...otherProps}
    >
      <XCircle
        data-testid="status-error"
        className={cn(statusIconClasses, 'text-[var(--destructive,#C9190B)]')}
      />
      {children}
    </span>
  );
}

/**
 * Displays a gray clock icon indicating a pending or queued status.
 *
 * @remarks
 * Uses the Clock (clock face) shape as a color-blind-friendly indicator
 * that visually distinguishes pending from aborted (plain X) and other
 * states. Color is applied via the `--muted-foreground` CSS custom property.
 *
 * @public
 */
export function StatusPending(props: PropsWithChildren<{}>) {
  const { children, ...otherProps } = props;
  return (
    <span
      className={cn(statusBaseClasses)}
      aria-label="Status pending"
      aria-hidden="true"
      {...otherProps}
    >
      <Clock
        data-testid="status-pending"
        className={cn(
          statusIconClasses,
          'text-[var(--muted-foreground,#6A6E73)]',
        )}
      />
      {children}
    </span>
  );
}

/**
 * Displays a play-triangle icon indicating an active/running status.
 *
 * @remarks
 * Uses the Play (filled triangle) shape to provide a color-blind-friendly
 * distinction from StatusOK (which uses CheckCircle). This ensures status
 * indicators rely on shape differentiation alongside color, meeting AAP
 * accessibility requirements. Color is applied via the `--status-running`
 * CSS custom property.
 *
 * @public
 */
export function StatusRunning(props: PropsWithChildren<{}>) {
  const { children, ...otherProps } = props;
  return (
    <span
      className={cn(statusBaseClasses)}
      aria-label="Status running"
      aria-hidden="true"
      {...otherProps}
    >
      <Play
        data-testid="status-running"
        className={cn(
          statusIconClasses,
          'text-[var(--status-running,#1F5493)]',
        )}
      />
      {children}
    </span>
  );
}

/**
 * Displays a gray X (cross) icon indicating an aborted or cancelled status.
 *
 * @remarks
 * Uses the X (plain cross) shape as a color-blind-friendly indicator
 * that visually distinguishes aborted from pending (clock) and error
 * (X-circle) states. Color is applied via the `--muted-foreground` CSS custom property.
 *
 * @public
 */
export function StatusAborted(props: PropsWithChildren<{}>) {
  const { children, ...otherProps } = props;
  return (
    <span
      className={cn(statusBaseClasses)}
      aria-label="Status aborted"
      aria-hidden="true"
      {...otherProps}
    >
      <X
        data-testid="status-aborted"
        className={cn(
          statusIconClasses,
          'text-[var(--muted-foreground,#6A6E73)]',
        )}
      />
      {children}
    </span>
  );
}
