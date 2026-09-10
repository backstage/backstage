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

import { useEffect, useRef } from 'react';

/** Observes the end of the scrolling list without becoming a collection item. */
export function LoadingSentinel(props: {
  hasMore: boolean;
  loading: boolean;
  error: boolean;
  onLoadMore: () => void;
}) {
  const { hasMore, loading, error, onLoadMore } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target || !hasMore || loading || error) return undefined;

    let active = true;
    let requested = false;
    const observer = new IntersectionObserver(
      entries => {
        if (
          active &&
          !requested &&
          entries.some(entry => entry.target === target && entry.isIntersecting)
        ) {
          requested = true;
          onLoadMore();
        }
      },
      { root: target.parentElement, rootMargin: '0px 0px 80px 0px' },
    );
    observer.observe(target);
    return () => {
      active = false;
      observer.disconnect();
    };
    // Re-observe after each completed request: the next page may still leave the
    // sentinel visible, without crossing a threshold on the existing observer.
  }, [hasMore, loading, error, onLoadMore]);

  return <div ref={ref} style={{ minHeight: 1 }} aria-hidden="true" />;
}
