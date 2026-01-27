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

import { forwardRef, Ref, isValidElement, ReactElement } from 'react';
import {
  UNSTABLE_Toast as RAToast,
  UNSTABLE_ToastContent as RAToastContent,
  Text,
  Button as RAButton,
} from 'react-aria-components';
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
  (props: ToastProps, ref: Ref<HTMLDivElement>) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      ToastDefinition,
      props,
    );
    const { classes, toast, index = 0, status, icon } = ownProps;

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
      <RAToast
        toast={toast}
        className={classes.root}
        ref={ref}
        style={
          {
            '--toast-index': index,
          } as React.CSSProperties
        }
        {...dataAttributes}
        data-status={finalStatus}
        {...restProps}
      >
        <RAToastContent className={classes.content}>
          {statusIcon && <div className={classes.icon}>{statusIcon}</div>}
          <div>
            <Text slot="title" className={classes.title}>
              {content.title}
            </Text>
            {content.description && (
              <Text slot="description" className={classes.description}>
                {content.description}
              </Text>
            )}
          </div>
        </RAToastContent>
        <RAButton slot="close" className={classes.closeButton}>
          <RiCloseLine aria-hidden="true" />
        </RAButton>
      </RAToast>
    );
  },
);

Toast.displayName = 'Toast';
