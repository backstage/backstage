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
  ToastApi,
  ToastApiMessage,
  createApiRef,
} from '@backstage/frontend-plugin-api';
import { Observable } from '@backstage/types';

/**
 * Internal enriched toast message emitted by the forwarder's observable.
 *
 * @internal
 */
export type ToastApiForwarderMessage = ToastApiMessage & {
  /** Unique key for tracking this toast */
  key: string;
  /** Dismiss this toast programmatically */
  close(): void;
  /**
   * Register a callback that fires when this toast is closed.
   * Used by the toast display to sync with the rendering queue.
   */
  onClose(callback: () => void): void;
};

/**
 * Internal extension of the public ToastApi that adds an observable
 * for the toast display to subscribe to. This interface is only used
 * within the app plugin and can be freely evolved.
 *
 * @internal
 */
export type ToastApiForwarderApi = ToastApi & {
  /** Observe toasts posted by other parts of the application. */
  toast$(): Observable<ToastApiForwarderMessage>;
};

/**
 * Internal API ref for the toast forwarder. The public `toastApiRef`
 * delegates to this, and the toast display subscribes to it directly.
 *
 * @internal
 */
export const toastApiForwarderRef = createApiRef<ToastApiForwarderApi>({
  id: 'app.toast.internal-forwarder',
});
