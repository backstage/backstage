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
 * This component provides a migration bridge between the deprecated AlertApi and the new ToastApi.
 * During the migration period, it subscribes to both APIs simultaneously, allowing plugins to
 * migrate incrementally without breaking existing functionality.
 *
 * **Subscriptions:**
 * - `toastApi.toast$()` - New toast notifications with full features (title, description, links, icons)
 * - `alertApi.alert$()` - Deprecated alerts for backward compatibility (message maps to title only)
 *
 * **ToastApi (recommended):**
 * - Uses toast content directly (title, description, status, icon, links)
 * - Uses the provided timeout from the toast message
 * - Supports programmatic dismiss via returned key
 *
 * **AlertApi (deprecated - please migrate to ToastApi):**
 * - `alert.message` → `toast.title`
 * - `alert.severity` → `toast.status` ('error' maps to 'danger')
 * - `alert.display` → `timeout` (transient gets default timeout, permanent stays until dismissed)
 *
 * @example
 * ```tsx
 * // In your app root element extension
 * <ToastDisplay transientTimeoutMs={5000} />
 *
 * // Using the new ToastApi (recommended):
 * import { toastApiRef, useApi } from '@backstage/frontend-plugin-api';
 * const toastApi = useApi(toastApiRef);
 * toastApi.post({
 *   title: 'Entity saved',
 *   description: 'Your changes have been saved successfully.',
 *   status: 'success',
 *   timeout: 5000,
 * });
 *
 * // Using the deprecated AlertApi (migrate to ToastApi):
 * import { alertApiRef, useApi } from '@backstage/core-plugin-api';
 * const alertApi = useApi(alertApiRef);
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

  // Subscribe to AlertApi (deprecated - provides backward compatibility during migration)
  // This subscription will be removed when AlertApi is fully deprecated
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
