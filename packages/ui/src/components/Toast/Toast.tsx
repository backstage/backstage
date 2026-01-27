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

import { forwardRef, Ref, isValidElement, ReactElement, useRef } from 'react';
import { motion } from 'motion/react';
import { useToast } from '@react-aria/toast';
import { useButton } from 'react-aria';
import {
  RiInformationLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiAlertLine,
  RiCloseLine,
} from '@remixicon/react';
import type { ToastProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { ToastDefinition } from './definition';
import type { ToastState } from 'react-stately';
import type { ToastContent } from './types';

/**
 * A Toast displays a brief, temporary notification of actions, errors, or other events in an application.
 *
 * @remarks
 * The Toast component is typically used within a ToastRegion and managed by a ToastQueue.
 * It supports multiple status variants (info, success, warning, danger) and can display
 * a title, description, and optional icon. Toasts can be dismissed manually or automatically.
 *
 * This component uses React Aria's unstable Toast API which is currently in alpha.
 *
 * @example
 * Basic usage with queue:
 * ```tsx
 * import { queue } from '@backstage/ui';
 *
 * queue.add({ title: 'File saved successfully', status: 'success' });
 * ```
 *
 * @example
 * With description and auto-dismiss:
 * ```tsx
 * queue.add(
 *   {
 *     title: 'Update available',
 *     description: 'A new version is ready to install.',
 *     status: 'info'
 *   },
 *   { timeout: 5000 }
 * );
 * ```
 *
 * @public
 */
export const Toast = forwardRef(
  (props: ToastProps, _forwardedRef: Ref<HTMLDivElement>) => {
    const { ownProps, dataAttributes } = useDefinition(ToastDefinition, props);
    const { classes, toast, state, index = 0, status, icon } = ownProps;

    const ref = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const { toastProps, titleProps, descriptionProps, closeButtonProps } =
      useToast({ toast }, state, ref);

    const { buttonProps } = useButton(closeButtonProps, closeButtonRef);

    // Get content from toast
    const content = toast.content;
    const finalStatus = status || content.status || 'info';
    const finalIcon = icon !== undefined ? icon : content.icon;

    // Determine which icon to render
    const getStatusIcon = (): ReactElement | null => {
      // If icon is explicitly false, don't render any icon
      if (finalIcon === false) {
        return null;
      }

      // If icon is a custom React element, use it
      if (isValidElement(finalIcon)) {
        return finalIcon;
      }

      // If icon is true or undefined (default to true for toasts), auto-select based on status
      if (finalIcon === true || finalIcon === undefined) {
        switch (finalStatus) {
          case 'success':
            return <RiCheckLine aria-hidden="true" />;
          case 'warning':
            return <RiErrorWarningLine aria-hidden="true" />;
          case 'danger':
            return <RiAlertLine aria-hidden="true" />;
          case 'info':
          default:
            return <RiInformationLine aria-hidden="true" />;
        }
      }

      // Default: no icon
      return null;
    };

    const statusIcon = getStatusIcon();

    return (
      <motion.div
        ref={ref}
        className={classes.root}
        style={
          {
            '--toast-index': index,
          } as React.CSSProperties
        }
        {...toastProps}
        {...dataAttributes}
        data-status={finalStatus}
        initial={{ y: '150%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '150%', opacity: 0 }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className={classes.content}>
          {statusIcon && <div className={classes.icon}>{statusIcon}</div>}
          <div>
            <div {...titleProps} className={classes.title}>
              {content.title}
            </div>
            {content.description && (
              <div {...descriptionProps} className={classes.description}>
                {content.description}
              </div>
            )}
          </div>
        </div>
        <button
          {...buttonProps}
          ref={closeButtonRef}
          className={classes.closeButton}
        >
          <RiCloseLine aria-hidden="true" />
        </button>
      </motion.div>
    );
  },
);

Toast.displayName = 'Toast';
