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

import { createApiRef, ApiRef } from '../system';
import { ReactNode } from 'react';

/**
 * Link item for toast notifications.
 *
 * @public
 */
export type ToastApiMessageLink = {
  /** Display text for the link */
  label: string;
  /** URL the link points to */
  href: string;
};

/**
 * Message handled by the {@link ToastApi}.
 *
 * @public
 */
export type ToastApiMessage = {
  /** Title of the toast (required) */
  title: ReactNode;
  /** Optional description text */
  description?: ReactNode;
  /** Status variant of the toast - defaults to 'success' */
  status?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  /** Optional array of links to display */
  links?: ToastApiMessageLink[];
  /** Timeout in milliseconds before auto-dismiss. If not set, toast is permanent. */
  timeout?: number;
};

/**
 * Handle returned by {@link ToastApi.post} that allows programmatic control
 * of the posted toast.
 *
 * @public
 */
export type ToastApiPostResult = {
  /** Dismiss the toast. */
  close(): void;
};

/**
 * The toast API is used to display toast notifications to the user.
 *
 * @remarks
 * This API provides richer notification capabilities than the AlertApi,
 * including title/description, links, and per-toast timeout control.
 *
 * @example
 * ```tsx
 * const toastApi = useApi(toastApiRef);
 *
 * // Full-featured toast
 * toastApi.post({
 *   title: 'Entity saved',
 *   description: 'Your changes have been saved successfully.',
 *   status: 'success',
 *   timeout: 5000,
 *   links: [{ label: 'View entity', href: '/catalog/default/component/my-service' }],
 * });
 *
 * // Simple toast
 * toastApi.post({ title: 'Processing...', status: 'info' });
 *
 * // Programmatic dismiss
 * const { close } = toastApi.post({ title: 'Uploading...', status: 'info' });
 * // Later...
 * close();
 * ```
 *
 * @public
 */
export type ToastApi = {
  /**
   * Post a toast notification for display to the user.
   *
   * @param toast - The toast message to display
   * @returns A handle with a `close()` method to programmatically dismiss the toast
   */
  post(toast: ToastApiMessage): ToastApiPostResult;
};

/**
 * The {@link ApiRef} of {@link ToastApi}.
 *
 * @public
 */
export const toastApiRef: ApiRef<ToastApi> = createApiRef({
  id: 'core.toast',
});
