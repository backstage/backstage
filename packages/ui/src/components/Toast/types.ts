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
import type { Responsive, ContainerSurfaceProps } from '../../types';

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
}

/**
 * Own props for the Toast component
 * @public
 */
export type ToastOwnProps = ContainerSurfaceProps & {
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
  status?: Responsive<'info' | 'success' | 'warning' | 'danger'>;
  /** Override icon from content */
  icon?: boolean | ReactElement;
  /** Pre-calculated Y position when expanded (based on heights of toasts below) */
  expandedY?: number;
  /** Height to use when collapsed (front toast's height, for uniform stacking) */
  collapsedHeight?: number;
  /** Callback to report this toast's natural height */
  onHeightChange?: (key: string, height: number) => void;
};

/**
 * Properties for {@link Toast}
 * @public
 */
export interface ToastProps extends ToastOwnProps {}

/**
 * Own props for the ToastRegion component
 * @public
 */
export type ToastRegionOwnProps = {
  /** Toast queue instance */
  queue: ToastQueue<ToastContent>;
  /** Custom class name */
  className?: string;
};

/**
 * Properties for {@link ToastRegion}
 * @public
 */
export interface ToastRegionProps extends ToastRegionOwnProps {}
