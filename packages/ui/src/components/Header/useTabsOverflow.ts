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

import { RefObject, useEffect, useState } from 'react';

/**
 * Tracks whether a horizontally scrolling element has more content to its
 * right. The wrapper scrolls rather than the nav, so the nav's indicator
 * coordinates stay relative to the tabs themselves.
 *
 * @internal
 */
export function useTabsOverflow(
  ref: RefObject<HTMLElement>,
  enabled: boolean,
): boolean {
  const [hasMoreRight, setHasMoreRight] = useState(false);

  useEffect(() => {
    const wrapper = ref.current;
    if (!enabled || !wrapper) {
      setHasMoreRight(false);
      return undefined;
    }

    const update = () => {
      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
      const isRtl = window.getComputedStyle(wrapper).direction === 'rtl';
      const remainingRight = isRtl
        ? -wrapper.scrollLeft
        : maxScroll - wrapper.scrollLeft;
      setHasMoreRight(remainingRight > 1);
    };

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(update);
    resizeObserver?.observe(wrapper);
    if (wrapper.firstElementChild) {
      resizeObserver?.observe(wrapper.firstElementChild);
    }
    wrapper.addEventListener('scroll', update, { passive: true });
    update();

    return () => {
      resizeObserver?.disconnect();
      wrapper.removeEventListener('scroll', update);
    };
  }, [ref, enabled]);

  return hasMoreRight;
}
