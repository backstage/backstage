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

import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { QueryState } from './types';
import { useStableCallback } from './useStableCallback';

/** @internal */
export interface DebouncedReloadResult {
  /**
   * If a debounced reload is currently scheduled, cancels the timer and runs
   * the reload immediately. Returns `true` when a reload was flushed.
   */
  flush: () => boolean;
}

/**
 * Triggers a debounced reload when query or pageSize changes.
 * Debouncing reduces backend load during rapid changes (e.g., typing in search).
 *
 * The scheduled reload survives unrelated re-renders (for example a page
 * navigation resolving) and can be flushed early via the returned `flush`.
 */
/** @internal */
export function useDebouncedReload<TFilter>(
  query: QueryState<TFilter>,
  pageSize: number,
  reload: () => void,
  delay: number = 200,
): DebouncedReloadResult {
  const stableReload = useStableCallback(reload);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prevDepsRef = useRef({ query, pageSize });

  const clear = useCallback(() => {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    const prev = prevDepsRef.current;
    if (prev.query === query && prev.pageSize === pageSize) {
      return undefined;
    }
    prevDepsRef.current = { query, pageSize };
    clear();
    timerRef.current = setTimeout(() => {
      timerRef.current = undefined;
      stableReload();
    }, delay);
    return undefined;
  }, [query, pageSize, delay, stableReload, clear]);

  // Cancel any scheduled reload on unmount.
  useEffect(() => clear, [clear]);

  const flush = useCallback(() => {
    if (timerRef.current === undefined) {
      return false;
    }
    clear();
    stableReload();
    return true;
  }, [clear, stableReload]);

  return useMemo(() => ({ flush }), [flush]);
}
