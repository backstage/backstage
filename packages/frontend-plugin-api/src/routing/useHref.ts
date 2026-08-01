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

import { useHref as useReactRouterHref } from 'react-router-dom';
import { useApiHolder } from '../apis/system';
import { appHistoryApiRef } from './AppHistoryApi';

/**
 * Whether a target is not app-relative — absolute (`https://example.com/x`),
 * protocol-relative (`//example.com/x`), or an opaque scheme such as
 * `mailto:`. Only the path portion is inspected, so
 * `/search?query=https://example.com` is an ordinary app-relative target.
 *
 * Kept in step with `isExternalTarget` in `AppHistory`, which is the source of
 * truth for the {@link AppHistoryApi.createHref} contract. React Router's
 * `useHref` has no equivalent guard — it resolves the path and joins the
 * basename regardless — so the fallback path needs its own.
 */
function isExternalTarget(to: string): boolean {
  const [path] = to.split(/[?#]/);
  return path.startsWith('//') || /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path);
}

/**
 * Resolves an app-relative path to a browser-ready href (including the app's
 * deploy basename), the react-aria-style counterpart to {@link useAppNavigate}.
 *
 * Falls back to React Router's `useHref` when no {@link appHistoryApiRef} is
 * registered (old frontend system).
 *
 * Targets that are not app-relative are returned unchanged under both
 * frontend systems — see {@link AppHistoryApi.createHref}.
 *
 * @public
 */
export function useHref(to: string): string {
  const appHistory = useApiHolder().get(appHistoryApiRef);
  const isExternal = isExternalTarget(to);
  // Called unconditionally so this hook works the same under both frontend
  // systems — mirrors the useAppNavigate fallback pattern. External targets
  // are passed through, so React Router is handed a placeholder rather than a
  // URL it would mangle.
  const reactRouterHref = useReactRouterHref(isExternal ? '/' : to);
  if (isExternal) {
    return to;
  }
  return appHistory ? appHistory.createHref(to) : reactRouterHref;
}
