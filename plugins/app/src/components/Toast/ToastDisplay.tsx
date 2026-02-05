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

import { useEffect, useRef } from 'react';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { toastApiRef } from '@backstage/frontend-plugin-api';
import { ToastContainer } from './ToastContainer';
import { toastQueue } from './ToastQueue';
import type { ToastDisplayProps, ToastContent } from './types';
import './Toast.css';

/**
 * Maps AlertApi severity to Toast status.
 * AlertApi uses 'error' while Toast uses 'danger' for the same semantic meaning.
 */
function mapSeverity(
  severity: 'success' | 'info' | 'warning' | 'error' | undefined,
): ToastContent['status'] {
  if (severity === 'error') {
    return 'danger';
  }
  return severity ?? 'success';
}

/**
 * ToastDisplay bridges both the ToastApi and AlertApi with the Toast notification system.
 *
 * @remarks
 * This component subscribes to:
 * - `toastApi.toast$()` - New toast notifications with full features (title, description, links, icons)
 * - `alertApi.alert$()` - Legacy alerts for backward compatibility (message maps to title only)
 *
 * For ToastApi:
 * - Uses toast content directly (title, description, status, icon, links)
 * - Uses the provided timeout from the toast message
 *
 * For AlertApi (legacy):
 * - `alert.message` → `toast.title`
 * - `alert.severity` → `toast.status` ('error' maps to 'danger')
 * - `alert.display` → `timeout` (transient gets default timeout, permanent stays until dismissed)
 *
 * @example
 * ```tsx
 * // In your app root element extension
 * <ToastDisplay transientTimeoutMs={5000} />
 *
 * // Using the new ToastApi:
 * toastApi.post({
 *   title: 'Entity saved',
 *   description: 'Your changes have been saved successfully.',
 *   status: 'success',
 *   timeout: 5000,
 * });
 *
 * // Using the legacy AlertApi:
 * alertApi.post({ message: 'Saved!', severity: 'success', display: 'transient' });
 * ```
 *
 * @public
 */
export function ToastDisplay(props: ToastDisplayProps) {
  const alertApi = useApi(alertApiRef);
  const toastApi = useApi(toastApiRef);
  const { transientTimeoutMs = 5000 } = props;

  // Track toast keys for programmatic close
  const toastKeyMap = useRef<Map<string, string>>(new Map());

  // Subscribe to ToastApi
  useEffect(() => {
    const subscription = toastApi.toast$().subscribe(toast => {
      const content: ToastContent = {
        title: toast.title,
        description: toast.description,
        status: toast.status ?? 'success',
        icon: toast.icon,
        links: toast.links,
      };

      // Use the timeout from the toast message if provided
      const options = toast.timeout ? { timeout: toast.timeout } : {};

      const queueKey = toastQueue.add(content, options);

      // Track the mapping from API key to queue key for programmatic close
      toastKeyMap.current.set(toast.key, queueKey);
    });

    return () => subscription.unsubscribe();
  }, [toastApi]);

  // Subscribe to ToastApi close events for programmatic dismissal
  useEffect(() => {
    const subscription = toastApi.close$().subscribe(apiKey => {
      const queueKey = toastKeyMap.current.get(apiKey);
      if (queueKey) {
        toastQueue.close(queueKey);
        toastKeyMap.current.delete(apiKey);
      }
    });

    return () => subscription.unsubscribe();
  }, [toastApi]);

  // Subscribe to AlertApi (legacy support)
  useEffect(() => {
    const subscription = alertApi.alert$().subscribe(alert => {
      const content: ToastContent = {
        title: alert.message,
        status: mapSeverity(alert.severity),
      };

      // Transient alerts auto-dismiss after timeout, permanent alerts stay until dismissed
      const options =
        alert.display === 'transient' ? { timeout: transientTimeoutMs } : {};

      toastQueue.add(content, options);
    });

    return () => subscription.unsubscribe();
  }, [alertApi, transientTimeoutMs]);

  return <ToastContainer queue={toastQueue} />;
}
