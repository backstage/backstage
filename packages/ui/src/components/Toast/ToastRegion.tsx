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

import { forwardRef, Ref, useEffect, useState } from 'react';
import { UNSTABLE_ToastRegion as RAToastRegion } from 'react-aria-components';
import type { ToastRegionProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { ToastRegionDefinition } from './definition';
import { Toast } from './Toast';

/**
 * A ToastRegion displays one or more toast notifications.
 *
 * @remarks
 * The ToastRegion component should typically be placed once at the root of your application.
 * It manages the display and positioning of all toast notifications added to its queue.
 * Toast regions are ARIA landmark regions that can be navigated using F6 (forward) and
 * Shift+F6 (backward) for keyboard accessibility.
 *
 * This component uses React Aria's unstable Toast API which is currently in alpha.
 *
 * @example
 * Basic setup in app root:
 * ```tsx
 * import { ToastRegion, queue } from '@backstage/ui';
 *
 * function App() {
 *   return (
 *     <>
 *       <ToastRegion queue={queue} />
 *       <YourAppContent />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * Custom positioning:
 * ```tsx
 * <ToastRegion
 *   queue={queue}
 *   position="top"
 *   placement="center"
 * />
 * ```
 *
 * @public
 */
export const ToastRegion = forwardRef(
  (props: ToastRegionProps, ref: Ref<HTMLDivElement>) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      ToastRegionDefinition,
      props,
    );
    const { classes, queue, className } = ownProps;

    // Track visible toast keys to determine index
    const [visibleToasts, setVisibleToasts] = useState<string[]>([]);

    useEffect(() => {
      const updateToasts = () => {
        setVisibleToasts(queue.visibleToasts.map(t => t.key));
      };

      // Subscribe to queue changes
      const unsubscribe = queue.subscribe(updateToasts);
      updateToasts(); // Initial update

      return unsubscribe;
    }, [queue]);

    return (
      <RAToastRegion
        ref={ref}
        queue={queue}
        className={className || classes.region}
        {...dataAttributes}
        {...restProps}
      >
        {({ toast }) => {
          const index = visibleToasts.indexOf(toast.key);
          return <Toast toast={toast} index={index >= 0 ? index : 0} />;
        }}
      </RAToastRegion>
    );
  },
);

ToastRegion.displayName = 'ToastRegion';
