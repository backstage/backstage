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
import { alertApiRef, AlertMessage, useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { coreComponentsTranslationRef } from '../../translation';
import { Toaster } from '../ui/toast';

/**
 * Properties for {@link AlertDisplay}
 *
 * @public
 */
export type AlertDisplayProps = {
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  transientTimeoutMs?: number;
};

/**
 * Displays alerts from {@link @backstage/core-plugin-api#AlertApi}
 *
 * @public
 * @remarks
 *
 * Shown as SnackBar at the center top of the page by default. Configurable with props.
 *
 * @param anchorOrigin - The `vertical` property will set the vertical orientation of where the AlertDisplay will be located
 * and the `horizontal` property will set the horizontal orientation of where the AlertDisplay will be located
 * @param transientTimeoutMs - Number of milliseconds a transient alert will stay open for. Default value is 5000
 *
 * @example
 * Here's some examples:
 * ```
 * // This example shows the default usage, the SnackBar will show up at the top in the center and any transient messages will stay open for 5000ms
 * <AlertDisplay />
 *
 * // With this example the SnackBar will show up in the bottom right hand corner and any transient messages will stay open for 2500ms
 * <AlertDisplay transientTimeoutMs={2500} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}/>
 *
 * // If you want to just set the time a transientTimeoutMs, you can do that like this:
 * <AlertDisplay transientTimeoutMs={10000} />
 * ```
 */
export function AlertDisplay(props: AlertDisplayProps) {
  const [messages, setMessages] = useState<Array<AlertMessage>>([]);
  const alertApi = useApi(alertApiRef);
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  const {
    anchorOrigin = { vertical: 'top', horizontal: 'center' },
    transientTimeoutMs,
  } = props;
  const timeoutMs = transientTimeoutMs ?? 5000;

  useEffect(() => {
    const subscription = alertApi
      .alert$()
      .subscribe(message => setMessages(msgs => msgs.concat(message)));

    return () => {
      subscription.unsubscribe();
    };
  }, [alertApi]);

  const [firstMessage] = messages;

  useEffect(() => {
    if (firstMessage && firstMessage.display === 'transient') {
      const timeout = setTimeout(() => {
        setMessages(msgs => {
          const newMsgs = msgs.filter(msg => msg !== firstMessage);
          return newMsgs.length === msgs.length ? msgs : newMsgs;
        });
      }, timeoutMs);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [firstMessage, timeoutMs]);

  if (messages.length === 0) {
    return null;
  }

  const handleClose = () => {
    setMessages(msgs => msgs.filter(msg => msg !== firstMessage));
  };

  // Map AlertMessage severity to Tailwind CSS token classes for border, background, and text color
  const severityClasses: Record<string, string> = {
    error: 'border-destructive bg-destructive text-destructive-foreground',
    warning: 'border-warning bg-warning text-warning-foreground',
    info: 'border-info bg-info text-info-foreground',
    success: 'border-success bg-success text-success-foreground',
  };

  const severity = firstMessage.severity ?? 'info';
  const severityClass = severityClasses[severity] ?? severityClasses.info;

  // Map anchorOrigin to Tailwind positioning classes
  const verticalClass = anchorOrigin.vertical === 'top' ? 'top-4' : 'bottom-4';

  const horizontalPositionMap: Record<string, string> = {
    left: 'left-4',
    right: 'right-4',
    center: 'left-1/2 -translate-x-1/2',
  };
  const horizontalClass =
    horizontalPositionMap[anchorOrigin.horizontal] ??
    horizontalPositionMap.center;

  return (
    <>
      <Toaster />
      <div
        className={cn('fixed z-50', verticalClass, horizontalClass)}
        role="alert"
      >
        <div
          className={cn(
            'flex items-center gap-2 rounded-lg border px-4 py-3 shadow-lg',
            severityClass,
          )}
        >
          <span className="text-sm">
            {String(firstMessage.message)}
            {messages.length > 1 && (
              <em>
                {' '}
                {t('alertDisplay.message', {
                  count: messages.length - 1,
                })}
              </em>
            )}
          </span>
          <button
            type="button"
            className={cn(
              'ml-auto inline-flex shrink-0 items-center justify-center rounded-sm p-0.5',
              'opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring',
            )}
            onClick={handleClose}
            data-testid="error-button-close"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>
    </>
  );
}
