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

import { forwardRef, Ref, useEffect, useState, useRef } from 'react';
import { useToastRegion } from '@react-aria/toast';
import { AnimatePresence } from 'motion/react';
import type { QueuedToast, ToastState } from 'react-stately';
import type { ToastRegionProps, ToastContent } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { ToastRegionDefinition } from './definition';
import { Toast } from './Toast';

/**
 * A ToastRegion displays one or more toast notifications in the bottom-right corner.
 *
 * @remarks
 * The ToastRegion component should typically be placed once at the root of your application.
 * It manages the display and stacking of all toast notifications added to its queue.
 * Toasts appear in the bottom-right corner with deep stacking when multiple are visible.
 * Toast regions are ARIA landmark regions that can be navigated using F6 (forward) and
 * Shift+F6 (backward) for keyboard accessibility.
 *
 * This component uses React Aria's unstable Toast API which is currently in alpha.
 *
 * @example
 * Basic setup in app root:
 * ```tsx
 * import { ToastRegion, toastQueue } from '@backstage/ui';
 *
 * function App() {
 *   return (
 *     <>
 *       <ToastRegion queue={toastQueue} />
 *       <YourAppContent />
 *     </>
 *   );
 * }
 * ```
 *
 * @public
 */
export const ToastRegion = forwardRef(
  (props: ToastRegionProps, _ref: Ref<HTMLDivElement>) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      ToastRegionDefinition,
      props,
    );
    const { classes, queue, className } = ownProps;

    const [, forceUpdate] = useState({});
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // Subscribe to queue changes to trigger re-renders
      const unsubscribe = queue.subscribe(() => forceUpdate({}));
      return unsubscribe;
    }, [queue]);

    const state: ToastState<ToastContent> = {
      visibleToasts: queue.visibleToasts,
      add: (content: ToastContent, options?: any) =>
        queue.add(content, options),
      close: (key: string) => queue.close(key),
      pauseAll: () => queue.pauseAll(),
      resumeAll: () => queue.resumeAll(),
    };

    const { regionProps } = useToastRegion({}, state, ref);

    return (
      <div
        {...regionProps}
        ref={ref}
        className={className || classes.region}
        {...dataAttributes}
        {...restProps}
      >
        <ol style={{ margin: 0, padding: 0, listStyleType: 'none' }}>
          <AnimatePresence mode="popLayout">
            {queue.visibleToasts.map(
              (toast: QueuedToast<ToastContent>, arrayIndex: number) => {
                // Reverse index so newest toast (at end of array) gets index 0
                const index = queue.visibleToasts.length - 1 - arrayIndex;
                return (
                  <li key={toast.key} style={{ display: 'contents' }}>
                    <Toast toast={toast} index={index} state={state} />
                  </li>
                );
              },
            )}
          </AnimatePresence>
        </ol>
      </div>
    );
  },
);

ToastRegion.displayName = 'ToastRegion';
