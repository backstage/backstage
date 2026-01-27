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
import type { UNSTABLE_ToastQueue as RAToastQueue } from 'react-aria-components';
import type { ToastState, QueuedToast } from 'react-stately';
import type { Responsive } from '../../types';

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
 * @internal
 */
export type ToastOwnProps = {
  /** Toast object from the queue */
  toast: QueuedToast<ToastContent>;
  /** Callback when swipe ends */
  onSwipeEnd?: () => void;
  /** Override status from content */
  status?: Responsive<'info' | 'success' | 'warning' | 'danger'>;
  /** Override icon from content */
  icon?: boolean | ReactElement;
};

/**
 * Properties for {@link Toast}
 * @internal
 */
export interface ToastProps extends ToastOwnProps {}

/**
 * Own props for the ToastRegion component
 * @public
 */
export type ToastRegionOwnProps = {
  /** Toast queue instance */
  queue: RAToastQueue<ToastContent>;
  /** Custom class name */
  className?: string;
};

/**
 * Properties for {@link ToastRegion}
 * @public
 */
export interface ToastRegionProps extends ToastRegionOwnProps {}
