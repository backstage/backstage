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
  useRef,
  useEffect,
} from 'react';
import { useToast } from '@react-aria/toast';
import { useButton } from 'react-aria';
import { motion } from 'motion/react';
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

// Track which toasts are being manually closed (vs auto-timeout)
// This allows different exit animations for each case
const manuallyClosingToasts = new Set<string>();

/**
 * A Toast displays a brief, temporary notification of actions, errors, or other events in an application.
 *
 * @remarks
 * The Toast component is typically used within a ToastRegion and managed by a ToastQueue.
 * It supports multiple status variants (info, success, warning, danger) and can display
 * a title, description, and optional icon. Toasts can be dismissed manually or automatically.
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
    const {
      classes,
      toast,
      state,
      index = 0,
      isExpanded = false,
      onClose,
      status,
      icon,
      expandedY: expandedYProp = 0,
      collapsedHeight,
      onHeightChange,
    } = ownProps;

    // Use internal ref if none provided
    const internalRef = useRef<HTMLDivElement>(null);
    const toastRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;

    // Get ARIA props from useToast hook
    const { toastProps, titleProps, closeButtonProps } = useToast(
      { toast },
      state,
      toastRef,
    );

    // Extract only ARIA and accessibility props from toastProps to avoid
    // conflicts with motion.div's event handler types (motion has its own drag API)
    const ariaProps = {
      role: toastProps.role,
      tabIndex: toastProps.tabIndex,
      'aria-label': toastProps['aria-label'],
      'aria-labelledby': toastProps['aria-labelledby'],
      'aria-describedby': toastProps['aria-describedby'],
      'aria-posinset': toastProps['aria-posinset'],
      'aria-setsize': toastProps['aria-setsize'],
    };

    // Measure and report this toast's natural height
    useEffect(() => {
      if (!onHeightChange) return;

      const element = toastRef.current;
      if (!element) return;

      // Report initial height
      onHeightChange(toast.key, element.offsetHeight);

      // Watch for size changes (content could change)
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const height =
            entry.borderBoxSize?.[0]?.blockSize ??
            entry.target.getBoundingClientRect().height;
          onHeightChange(toast.key, height);
        }
      });

      resizeObserver.observe(element);
      return () => resizeObserver.disconnect();
    }, [toast.key, onHeightChange]);

    // Close button ref and props
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const { buttonProps } = useButton(
      {
        ...closeButtonProps,
        onPress: () => {
          // Mark this toast as manually closed for exit animation
          manuallyClosingToasts.add(toast.key);
          onClose?.();
          state.close(toast.key);
        },
      },
      closeButtonRef,
    );

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

    // Calculate stacking values based on index
    // Collapsed: each toast behind scales down 5% and peeks up 12px
    const collapsedScale = Math.max(0.85, 1 - index * 0.05);
    const collapsedY = -index * 12;

    // Use expanded or collapsed values based on hover state
    // expandedYProp is pre-calculated based on actual toast heights
    const animateY = isExpanded ? expandedYProp : collapsedY;
    const animateScale = isExpanded ? 1 : collapsedScale;
    const stackZIndex = 1000 - index;

    // Check if this toast is being manually closed
    const isManualClose = manuallyClosingToasts.has(toast.key);

    // Different exit animations for manual close vs auto-timeout
    // Manual close: slide down from front, stay on top
    // Auto-timeout: fade out in place, stay in stack position
    const exitAnimation = isManualClose
      ? { opacity: 0, y: 100, scale: 1, zIndex: 2000 }
      : {
          opacity: 0,
          y: animateY + 50,
          scale: animateScale,
          zIndex: stackZIndex,
        };

    // Back toasts (index > 0) use front toast's height when collapsed
    // When expanded, all toasts use their natural height (auto)
    const shouldConstrainHeight = !isExpanded && index > 0 && collapsedHeight;
    const animatedHeight = shouldConstrainHeight ? collapsedHeight : 'auto';

    return (
      <motion.div
        {...ariaProps}
        ref={toastRef}
        className={classes.root}
        style={
          {
            '--toast-index': index,
            overflow: shouldConstrainHeight ? 'hidden' : undefined,
          } as React.CSSProperties
        }
        layout
        initial={{ opacity: 0, y: 100, scale: 1, height: 'auto' }}
        animate={{
          opacity: 1,
          y: animateY,
          scale: animateScale,
          zIndex: stackZIndex,
          height: animatedHeight,
        }}
        exit={exitAnimation}
        onAnimationComplete={definition => {
          // Clean up the manual close tracking after exit animation
          if (definition === 'exit') {
            manuallyClosingToasts.delete(toast.key);
          }
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        {...dataAttributes}
        data-status={finalStatus}
        {...restProps}
      >
        <div className={classes.content}>
          {statusIcon && <div className={classes.icon}>{statusIcon}</div>}
          <div>
            <div {...titleProps} className={classes.title}>
              {content.title}
            </div>
            {content.description && (
              <div className={classes.description}>{content.description}</div>
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
