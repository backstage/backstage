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
import { ProgressBar } from 'react-aria-components';
import {
  RiLoader4Line,
  RiInformationLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiAlertLine,
} from '@remixicon/react';
import type { AlertProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { AlertDefinition } from './definition';

/**
 * A component for displaying alert messages with different status levels.
 *
 * @remarks
 * The Alert component supports multiple status variants (info, success, warning, danger)
 * and can display icons, loading states, and custom actions. It automatically handles
 * icon selection based on status when the icon prop is set to true.
 *
 * @example
 * Basic usage with title only:
 * ```tsx
 * <Alert status="info" title="This is an informational message" />
 * ```
 *
 * @example
 * With title and description:
 * ```tsx
 * <Alert
 *   status="warning"
 *   icon={true}
 *   title="Pending Review"
 *   description="Please review the following items before proceeding."
 * />
 * ```
 *
 * @example
 * With custom actions and loading state:
 * ```tsx
 * <Alert
 *   status="success"
 *   icon={true}
 *   title="Operation completed"
 *   description="Your changes have been saved successfully."
 *   loading={isProcessing}
 *   customActions={
 *     <>
 *       <Button size="small" variant="tertiary">Dismiss</Button>
 *       <Button size="small" variant="primary">View</Button>
 *     </>
 *   }
 * />
 * ```
 *
 * @public
 */
export const Alert = forwardRef(
  (props: AlertProps, ref: Ref<HTMLDivElement>) => {
    const { ownProps, restProps, dataAttributes, utilityStyle } = useDefinition(
      AlertDefinition,
      props,
    );
    const {
      classes,
      status,
      icon,
      loading,
      customActions,
      title,
      description,
      style,
    } = ownProps;

    // Determine which icon to render
    const getStatusIcon = (): ReactElement | null => {
      // If icon is explicitly false, don't render any icon
      if (icon === false) {
        return null;
      }

      // If icon is a custom React element, use it
      if (isValidElement(icon)) {
        return icon;
      }

      // If icon is true, auto-select based on status
      if (icon === true) {
        switch (status) {
          case 'success':
            return <RiCheckLine />;
          case 'warning':
            return <RiErrorWarningLine />;
          case 'danger':
            return <RiAlertLine />;
          case 'info':
          default:
            return <RiInformationLine />;
        }
      }

      // Default: no icon
      return null;
    };

    const statusIcon = getStatusIcon();

    return (
      <div
        className={classes.root}
        ref={ref}
        style={{ ...style, ...utilityStyle }}
        data-has-description={description ? 'true' : 'false'}
        {...dataAttributes}
        {...restProps}
      >
        {loading ? (
          <div className={classes.icon}>
            <ProgressBar
              aria-label="Loading"
              isIndeterminate
              className={classes.spinner}
            >
              <RiLoader4Line aria-hidden="true" />
            </ProgressBar>
          </div>
        ) : (
          statusIcon && <div className={classes.icon}>{statusIcon}</div>
        )}

        <div className={classes.content}>
          {title && <div className={classes.title}>{title}</div>}
          {description && (
            <div className={classes.description}>{description}</div>
          )}
        </div>

        {customActions && (
          <div className={classes.actions}>{customActions}</div>
        )}
      </div>
    );
  },
);

Alert.displayName = 'Alert';
