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

import { useCallback, useMemo } from 'react';
import { useAppLocation, useAppNavigate } from '@backstage/frontend-plugin-api';

/**
 * Reads and writes query string parameters on the current page, using the
 * framework's own location and navigation rather than a router library.
 *
 * Updates replace the current history entry, so typing in a search field
 * doesn't fill the browser history with one entry per keystroke.
 */
export function useQueryParams(): [
  URLSearchParams,
  (changes: Record<string, string | undefined>) => void,
] {
  const { search } = useAppLocation();
  const navigate = useAppNavigate();

  const params = useMemo(() => new URLSearchParams(search), [search]);

  const update = useCallback(
    (changes: Record<string, string | undefined>) => {
      const next = new URLSearchParams(search);
      for (const [key, value] of Object.entries(changes)) {
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
      }
      const query = next.toString();
      navigate(query ? `?${query}` : '?', { replace: true });
    },
    [search, navigate],
  );

  return [params, update];
}
