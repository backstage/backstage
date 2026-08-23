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

import { useEffect, useRef } from 'react';
import type { QueryState } from './types';

/**
 * Triggers a debounced reload when query or pageSize changes.
 * Debouncing reduces backend load during rapid changes (e.g., typing in search).
 */
/** @internal */
export function useDebouncedReload<TFilter>(
  query: QueryState<TFilter>,
  pageSize: number,
  reload: () => void,
  delay: number = 200,
): void {
  // Compare the query values rather than object identities, so that inline
  // callback props with fresh identities on every render don't trigger
  // spurious reloads.
  const { sort, filter, search } = query;
  const prevDepsRef = useRef({ sort, filter, search, pageSize });

  useEffect(() => {
    const prev = prevDepsRef.current;
    if (
      prev.sort !== sort ||
      prev.filter !== filter ||
      prev.search !== search ||
      prev.pageSize !== pageSize
    ) {
      prevDepsRef.current = { sort, filter, search, pageSize };
      const timer = setTimeout(reload, delay);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [sort, filter, search, pageSize, reload, delay]);
}
