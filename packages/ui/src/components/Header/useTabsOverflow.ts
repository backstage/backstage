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

import { RefObject, useCallback, useEffect, useState } from 'react';

/** @internal */
export interface TabsOverflow {
  /** More tabs remain before the visible part of the row. */
  hasMoreStart: boolean;
  /** More tabs remain after the visible part of the row. */
  hasMoreEnd: boolean;
  /** Scrolls the row by most of its visible width towards one side. */
  scrollTowards: (side: 'start' | 'end') => void;
}

// Leaves room for the edge fade and scroll button next to a revealed tab.
const REVEAL_MARGIN = 32;

function isRtl(element: HTMLElement) {
  return window.getComputedStyle(element).direction === 'rtl';
}

function prefersReducedMotion() {
  return Boolean(
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches,
  );
}

/**
 * Scrolls only the wrapper, never the page, so that the active tab is fully
 * visible. Does nothing when the tab is already in view.
 */
function revealActiveTab(wrapper: HTMLElement, smooth: boolean) {
  const active = wrapper.querySelector<HTMLElement>('[aria-current="page"]');
  if (!active) {
    return;
  }
  const wrapperRect = wrapper.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  let delta = 0;
  if (activeRect.left < wrapperRect.left) {
    delta = activeRect.left - wrapperRect.left - REVEAL_MARGIN;
  } else if (activeRect.right > wrapperRect.right) {
    delta = activeRect.right - wrapperRect.right + REVEAL_MARGIN;
  }
  if (delta !== 0) {
    wrapper.scrollBy({
      left: delta,
      behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto',
    });
  }
}

/**
 * Tracks whether a horizontally scrolling element has more content before or
 * after its visible part. The wrapper scrolls rather than the nav, so the
 * nav's indicator coordinates stay relative to the tabs themselves.
 *
 * @internal
 */
export function useTabsOverflow(
  ref: RefObject<HTMLElement>,
  enabled: boolean,
): TabsOverflow {
  const [hasMoreStart, setHasMoreStart] = useState(false);
  const [hasMoreEnd, setHasMoreEnd] = useState(false);

  useEffect(() => {
    const wrapper = ref.current;
    if (!enabled || !wrapper) {
      setHasMoreStart(false);
      setHasMoreEnd(false);
      return undefined;
    }

    const update = () => {
      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
      // In RTL, scrollLeft starts at 0 and goes negative towards the end.
      const scrolled = Math.abs(wrapper.scrollLeft);
      setHasMoreStart(scrolled > 1);
      setHasMoreEnd(maxScroll - scrolled > 1);
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

  // Keep the active tab visible on load and whenever it changes, for example
  // after a link in the page content switches the route.
  useEffect(() => {
    const wrapper = ref.current;
    if (!enabled || !wrapper) {
      return undefined;
    }

    revealActiveTab(wrapper, false);

    if (typeof MutationObserver === 'undefined') {
      return undefined;
    }
    const mutationObserver = new MutationObserver(() =>
      revealActiveTab(wrapper, true),
    );
    mutationObserver.observe(wrapper, {
      subtree: true,
      attributeFilter: ['aria-current'],
    });
    return () => mutationObserver.disconnect();
  }, [ref, enabled]);

  const scrollTowards = useCallback(
    (side: 'start' | 'end') => {
      const wrapper = ref.current;
      if (!wrapper) {
        return;
      }
      const distance = wrapper.clientWidth * 0.8;
      const direction = (side === 'end' ? 1 : -1) * (isRtl(wrapper) ? -1 : 1);
      // Smooth scrolling is a spatial animation, so respect reduced motion.
      wrapper.scrollBy({
        left: direction * distance,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    },
    [ref],
  );

  return { hasMoreStart, hasMoreEnd, scrollTowards };
}
