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

import { useCallback } from 'react';
import { useInRouterContext, useNavigate } from 'react-router-dom';
import { useOptionalAppHistory } from './useOptionalAppHistory';

/**
 * Returns a go-back callback for app chrome / error pages.
 *
 * Prefers browser history when the app history is present (new frontend
 * system) and only calls React Router's `useNavigate` when there is no app
 * history (old frontend system). `AppHistoryApi` has no `go()` of its own — it listens for
 * `popstate`, so going back through the browser (rather than the app
 * history) is the supported way to navigate back (see `RootHistoryRouter`'s
 * `navigator.go()`).
 *
 * @internal
 */
export function useChromeGoBack(): () => void {
  const appHistory = useOptionalAppHistory();
  const inRouter = useInRouterContext();

  // Router context / API presence are stable for a component's lifetime
  // (same pattern as BUI's useResolvedHref / Link's useResolvedPath), so
  // gating useNavigate keeps the hook call count stable and avoids
  // requiring a root RR projection.
  let rrNavigate: ReturnType<typeof useNavigate> | undefined;
  if (!appHistory && inRouter) {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- stable router/API presence
    rrNavigate = useNavigate();
  }

  return useCallback(() => {
    if (appHistory) {
      window.history.back();
      return;
    }
    rrNavigate?.(-1);
  }, [appHistory, rrNavigate]);
}
