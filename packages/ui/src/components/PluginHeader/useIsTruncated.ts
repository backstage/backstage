/*
 * Copyright 2026 The Backstage Authors
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

import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';

const DEBOUNCE_MS = 150;

function observeResize(
  el: HTMLElement,
  callback: () => void,
): (() => void) | undefined {
  if (typeof ResizeObserver === 'undefined') return undefined; // ResizeObserver isn't available in all runtimes (e.g. older browsers, SSR, Jest/jsdom)

  let timerId: ReturnType<typeof setTimeout> | undefined;
  const observer = new ResizeObserver(() => {
    clearTimeout(timerId);
    timerId = setTimeout(callback, DEBOUNCE_MS);
  });
  observer.observe(el);
  return () => {
    clearTimeout(timerId);
    observer.disconnect();
  };
}

/**
 * Tracks whether a text element is overflowing its container via CSS truncation.
 * Useful for conditionally showing a tooltip only when text is truncated.
 *
 * Checks on every render and whenever the element resizes (via ResizeObserver, debounced).
 *
 * @example
 * ```tsx
 * const { ref, truncated } = useIsTruncated();
 *
 * <TooltipTrigger isDisabled={!truncated}>
 *   <span ref={ref}>
 *     {label}
 *   </span>
 *   <Tooltip>{label}</Tooltip>
 * </TooltipTrigger>
 * ```
 *
 * @internal
 */
export function useIsTruncated<T extends HTMLElement = HTMLElement>(): {
  ref: React.RefObject<T>;
  truncated: boolean;
} {
  const ref = useRef<T>(null);
  const [truncated, setTruncated] = useState(false);

  // Re-check after each render in case the content changes without a resize event.
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setTruncated(el.scrollWidth > el.clientWidth);
  });

  // Also keep it up-to-date when the element resizes.
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const check = () => setTruncated(el.scrollWidth > el.clientWidth);

    return observeResize(el, check);
  }, []);

  return { ref, truncated };
}
