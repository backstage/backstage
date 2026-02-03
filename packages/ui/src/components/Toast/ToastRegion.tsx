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

import { forwardRef, Ref, useState, useRef } from 'react';
import { UNSTABLE_ToastRegion as RAToastRegion } from 'react-aria-components';
import type { ToastRegionProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { useInvertedThemeMode } from '../../hooks/useInvertedThemeMode';
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
  (props: ToastRegionProps, ref: Ref<HTMLDivElement>) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      ToastRegionDefinition,
      props,
    );
    const { classes, queue, className } = ownProps;

    // Lock hover state after close to prevent stack collapse during DOM updates
    const [isHoverLocked, setIsHoverLocked] = useState(false);
    const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Get inverted theme mode for toasts (light when app is dark, dark when app is light)
    const invertedThemeMode = useInvertedThemeMode();

    const handleClose = () => {
      // Lock the expanded state while toast is being removed
      setIsHoverLocked(true);

      // Clear any pending unlock
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
      }

      // Unlock after a short delay to allow DOM to settle
      unlockTimerRef.current = setTimeout(() => {
        setIsHoverLocked(false);
      }, 300);
    };

    return (
      <RAToastRegion
        ref={ref}
        queue={queue}
        className={className || classes.region}
        aria-label="Notifications"
        data-theme-mode={invertedThemeMode}
        data-hover-locked={isHoverLocked ? '' : undefined}
        {...dataAttributes}
        {...restProps}
      >
        {({ toast }) => <Toast toast={toast} onClose={handleClose} />}
      </RAToastRegion>
    );
  },
);

ToastRegion.displayName = 'ToastRegion';
