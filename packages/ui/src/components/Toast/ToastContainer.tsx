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

import { forwardRef, Ref, useState, useRef, useCallback, useMemo } from 'react';
import { useToastRegion } from '@react-aria/toast';
import { useToastQueue } from 'react-stately';
import { AnimatePresence } from 'motion/react';
import type { ToastContainerProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { useInvertedThemeMode } from '../../hooks/useInvertedThemeMode';
import { ToastContainerDefinition } from './definition';
import { Toast } from './Toast';

/**
 * A ToastContainer displays one or more toast notifications in the bottom-right corner.
 *
 * @remarks
 * The ToastContainer component should typically be placed once at the root of your application.
 * It manages the display and stacking of all toast notifications added to its queue.
 * Toasts appear in the bottom-right corner with deep stacking when multiple are visible.
 * Toast containers are ARIA landmark regions that can be navigated using F6 (forward) and
 * Shift+F6 (backward) for keyboard accessibility.
 *
 * @example
 * Basic setup in app root:
 * ```tsx
 * import { ToastContainer, toastQueue } from '@backstage/ui';
 *
 * function App() {
 *   return (
 *     <>
 *       <ToastContainer queue={toastQueue} />
 *       <YourAppContent />
 *     </>
 *   );
 * }
 * ```
 *
 * @public
 */
export const ToastContainer = forwardRef(
  (props: ToastContainerProps, ref: Ref<HTMLDivElement>) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      ToastContainerDefinition,
      props,
    );
    const { classes, queue, className } = ownProps;

    // Subscribe to the toast queue state
    const state = useToastQueue(queue);

    // Use internal ref if none provided
    const internalRef = useRef<HTMLDivElement>(null);
    const containerRef =
      (ref as React.RefObject<HTMLDivElement>) || internalRef;

    // Get ARIA props for the toast region
    const { regionProps } = useToastRegion({}, state, containerRef);

    // Track hover state for expanding/collapsing the stack
    const [isHovered, setIsHovered] = useState(false);

    // Lock expanded state after close to prevent stack collapse during exit animation
    const [isHoverLocked, setIsHoverLocked] = useState(false);
    const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Toasts are expanded when hovered, focused, or locked
    const isExpanded = isHovered || isHoverLocked;

    // Track heights of all toasts by their key
    const [toastHeights, setToastHeights] = useState<Record<string, number>>(
      {},
    );

    // Callback for toasts to report their height
    const handleHeightChange = useCallback((key: string, height: number) => {
      setToastHeights(prev => {
        if (prev[key] === height) return prev;
        return { ...prev, [key]: height };
      });
    }, []);

    // Calculate expanded Y positions and get front toast height
    const { expandedYPositions, frontToastHeight } = useMemo(() => {
      const gap = 8;
      const positions: Record<string, number> = {};
      let frontHeight = 60; // Default fallback

      // visibleToasts[0] is the front toast (newest)
      const toasts = state.visibleToasts;

      if (toasts.length > 0 && toastHeights[toasts[0].key]) {
        frontHeight = toastHeights[toasts[0].key];
      }

      // Calculate cumulative Y position for each toast when expanded
      // Position is negative Y (moving up from bottom)
      let cumulativeY = 0;
      for (let i = 0; i < toasts.length; i++) {
        positions[toasts[i].key] = -cumulativeY;
        const height = toastHeights[toasts[i].key] || 60;
        cumulativeY += height + gap;
      }

      return { expandedYPositions: positions, frontToastHeight: frontHeight };
    }, [state.visibleToasts, toastHeights]);

    // Get inverted theme mode for toasts (light when app is dark, dark when app is light)
    const invertedThemeMode = useInvertedThemeMode();

    const handleClose = () => {
      // Lock the expanded state while toast is being removed
      setIsHoverLocked(true);

      // Clear any pending unlock
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
      }

      // Unlock after a short delay to allow exit animation to complete
      unlockTimerRef.current = setTimeout(() => {
        setIsHoverLocked(false);
      }, 500);
    };

    return (
      <div
        {...regionProps}
        ref={containerRef}
        className={className || classes.container}
        data-theme-mode={invertedThemeMode}
        data-hover-locked={isHoverLocked ? '' : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        {...dataAttributes}
        {...restProps}
      >
        <AnimatePresence>
          {state.visibleToasts.map((toast, index) => (
            <Toast
              key={toast.key}
              toast={toast}
              state={state}
              index={index}
              isExpanded={isExpanded}
              onClose={handleClose}
              expandedY={expandedYPositions[toast.key] ?? 0}
              collapsedHeight={index > 0 ? frontToastHeight : undefined}
              naturalHeight={toastHeights[toast.key]}
              onHeightChange={handleHeightChange}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

ToastContainer.displayName = 'ToastContainer';
