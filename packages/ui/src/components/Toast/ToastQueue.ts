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

import { UNSTABLE_ToastQueue as RAToastQueue } from 'react-aria-components';
import { flushSync } from 'react-dom';
import type { ToastContent } from './types';

/**
 * Global toast queue for displaying toast notifications throughout the application.
 *
 * @remarks
 * This uses React Aria's unstable Toast API which is currently in alpha.
 * The API may change in future versions.
 *
 * Uses the View Transitions API for smooth enter/exit animations when supported.
 *
 * @example
 * ```tsx
 * import { toastQueue } from '@backstage/ui';
 *
 * // Show a toast
 * toastQueue.add({ title: 'Success!', status: 'success' });
 *
 * // Show with auto-dismiss
 * toastQueue.add({ title: 'Saved' }, { timeout: 5000 });
 *
 * // Programmatic dismiss
 * const key = toastQueue.add({ title: 'Processing...' });
 * // Later...
 * toastQueue.close(key);
 * ```
 *
 * @public
 */
// Track if we should use view transition (only for removals)
let useViewTransition = false;

export const toastQueue = new RAToastQueue<ToastContent>({
  maxVisibleToasts: 5,
  // Wrap state updates in a CSS view transition for smooth animations
  wrapUpdate(fn) {
    if (useViewTransition && 'startViewTransition' in document) {
      useViewTransition = false; // Reset flag
      (
        document as Document & {
          startViewTransition: (cb: () => void) => void;
        }
      ).startViewTransition(() => {
        flushSync(fn);
      });
    } else {
      fn();
    }
  },
});

// Override close to enable view transition
const originalClose = toastQueue.close.bind(toastQueue);
toastQueue.close = (key: string) => {
  useViewTransition = true;
  originalClose(key);
};
