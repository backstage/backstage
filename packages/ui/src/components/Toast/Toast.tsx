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

import {
  forwardRef,
  Ref,
  isValidElement,
  ReactElement,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  UNSTABLE_Toast as RAToast,
  UNSTABLE_ToastStateContext,
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
 * import { toastQueue } from '@backstage/ui';
 *
 * toastQueue.add({ title: 'File saved successfully', status: 'success' });
 * ```
 *
 * @example
 * With description and auto-dismiss:
 * ```tsx
 * toastQueue.add(
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
    const { classes, toast, onSwipeEnd, status, icon } = ownProps;

    // Get state from context
    const state = useContext(UNSTABLE_ToastStateContext);

    // Calculate index from state
    const visibleToasts = state?.visibleToasts || [];
    const arrayIndex = visibleToasts.findIndex(t => t.key === toast.key);
    const index = arrayIndex >= 0 ? arrayIndex : 0;

    // Track starting state for enter animation
    const [isStarting, setIsStarting] = useState(true);

    // Track swipe position
    const [swipeX, setSwipeX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const startXRef = useRef(0);
    const toastRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // Remove starting state after brief delay to trigger animation
      const timer = setTimeout(() => setIsStarting(false), 50);
      return () => clearTimeout(timer);
    }, []);

    const handlePointerDown = (e: React.PointerEvent) => {
      // Check if region is hovered (expanded state)
      const region = toastRef.current?.closest(
        '[role="region"]',
      ) as HTMLElement;
      setIsExpanded(region?.matches(':hover') || false);

      setIsSwiping(true);
      startXRef.current = e.clientX;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isSwiping) return;

      const deltaX = e.clientX - startXRef.current;
      // Only allow swipe right
      if (deltaX > 0) {
        setSwipeX(deltaX);
      }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      if (!isSwiping) return;

      setIsSwiping(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);

      // Notify parent that swipe ended to lock hover
      onSwipeEnd?.();

      // If swiped more than 150px, close the toast
      if (swipeX > 150) {
        // Animate off screen before closing
        setSwipeX(400);
        setTimeout(() => {
          state?.close(toast.key);
        }, 200);
      } else {
        // Spring back
        setSwipeX(0);
      }
    };

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
        ref={node => {
          if (toastRef) {
            (
              toastRef as React.MutableRefObject<HTMLDivElement | null>
            ).current = node;
          }
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
          }
        }}
        className={classes.root}
        style={
          {
            '--toast-index': index,
            '--swipe-x': swipeX,
            transform:
              swipeX > 0
                ? isExpanded
                  ? `translateX(${swipeX}px) translateY(calc((var(--toast-index) * -100%) - (var(--toast-index) * var(--bui-space-2)))) scale(1)`
                  : `translateX(${swipeX}px) translateY(calc(var(--toast-index) * var(--toast-peek) * -1)) scale(var(--toast-scale))`
                : undefined,
          } as React.CSSProperties
        }
        data-swiping={isSwiping ? '' : undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          setIsSwiping(false);
          setSwipeX(0);
        }}
        {...dataAttributes}
        data-status={finalStatus}
        data-starting-style={isStarting ? '' : undefined}
        {...restProps}
      >
        <div className={classes.content}>
          {statusIcon && <div className={classes.icon}>{statusIcon}</div>}
          <div>
            <div className={classes.title}>{content.title}</div>
            {content.description && (
              <div className={classes.description}>{content.description}</div>
            )}
          </div>
        </div>
        <RAButton
          slot="close"
          className={classes.closeButton}
          onPress={() => {
            // Lock hover first to prevent collapse
            onSwipeEnd?.();
            // Small delay before actually closing to let lock take effect
            setTimeout(() => {
              state?.close(toast.key);
            }, 0);
          }}
        >
          <RiCloseLine aria-hidden="true" />
        </RAButton>
      </RAToast>
    );
  },
);

Toast.displayName = 'Toast';
