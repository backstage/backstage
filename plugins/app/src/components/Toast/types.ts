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

import type { ReactElement, ReactNode } from 'react';
import type { ToastQueue, ToastState, QueuedToast } from 'react-stately';

/**
 * Link item for toast notifications
 * @public
 */
export interface ToastLink {
  /** Display text for the link */
  label: string;
  /** URL the link points to */
  href: string;
}

/**
 * Content for a toast notification
 * @public
 */
export interface ToastContent {
  /** Title of the toast (required) */
  title: ReactNode;
  /** Optional description text */
  description?: ReactNode;
  /** Status variant of the toast */
  status?: 'info' | 'success' | 'warning' | 'danger';
  /** Whether to show an icon */
  icon?: boolean | ReactElement;
  /** Optional array of links to display */
  links?: ToastLink[];
}

/**
 * Props for the Toast component
 * @internal
 */
export interface ToastProps {
  /** Toast object from the queue */
  toast: QueuedToast<ToastContent>;
  /** Toast state from useToastQueue */
  state: ToastState<ToastContent>;
  /** Index of the toast in the visible toasts array */
  index?: number;
  /** Whether the toast stack is expanded (hovered/focused) */
  isExpanded?: boolean;
  /** Callback when toast is closed */
  onClose?: () => void;
  /** Override status from content */
  status?: 'info' | 'success' | 'warning' | 'danger';
  /** Override icon from content */
  icon?: boolean | ReactElement;
  /** Pre-calculated Y position when expanded (based on heights of toasts below) */
  expandedY?: number;
  /** Height to use when collapsed (front toast's height, for uniform stacking) */
  collapsedHeight?: number;
  /** This toast's natural height (for smooth animation) */
  naturalHeight?: number;
  /** Callback to report this toast's natural height */
  onHeightChange?: (key: string, height: number) => void;
}

/**
 * Props for the ToastContainer component
 * @public
 */
export interface ToastContainerProps {
  /** Toast queue instance */
  queue: ToastQueue<ToastContent>;
  /** Custom class name */
  className?: string;
}

/**
 * Props for the ToastDisplay component (AlertApi bridge)
 * @public
 */
export interface ToastDisplayProps {
  /**
   * Number of milliseconds a transient alert will stay open for.
   * Defaults to 5000ms.
   */
  transientTimeoutMs?: number;
  /**
   * Position of the toast on screen.
   * @deprecated Toast uses fixed bottom-center positioning. This prop is ignored.
   */
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}
