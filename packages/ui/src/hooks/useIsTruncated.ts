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

import { useCallback, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * Tracks whether a text element is overflowing its container via CSS truncation.
 * Useful for cases such as:
 *   - only applying a tooltip if a text has been truncated
 *
 * Checks on mount and on each `checkTruncation` call (wire to hover/focus).
 * No ResizeObserver — `truncated` may be stale between interactions, but is
 * always fresh at the moment a tooltip would show.
 *
 * @example
 * ```tsx
 * const { ref, truncated, checkTruncation } = useIsTruncated();
 *
 * <TooltipTrigger isDisabled={!truncated}>
 *   <span ref={ref} onMouseEnter={checkTruncation}>
 *     {label}
 *   </span>
 *   <Tooltip>{label}</Tooltip>
 * </TooltipTrigger>
 * ```
 */
export function useIsTruncated() {
  const ref = useRef<HTMLElement>(null);
  const [truncated, setTruncated] = useState(false);

  const checkTruncation = useCallback(() => {
    const el = ref.current;
    if (el) {
      setTruncated(el.scrollWidth > el.clientWidth);
    }
  }, []);

  // Check on mount before paint so the tooltip state is correct immediately
  useIsomorphicLayoutEffect(() => {
    checkTruncation();
  }, [checkTruncation]);

  return { ref, truncated, checkTruncation };
}
