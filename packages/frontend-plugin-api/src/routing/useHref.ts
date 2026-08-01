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

import { sanitizeHref, useAppHref } from '@internal/frontend';
import { useApiHolder } from '../apis/system';
import { appHistoryApiRef } from './AppHistoryApi';

/**
 * Resolves an app-relative path to a browser-ready href (including the app's
 * deploy basename), the react-aria-style counterpart to {@link useAppNavigate}.
 *
 * Falls back to React Router when no {@link appHistoryApiRef} is registered
 * (old frontend system).
 *
 * Both answers come from the same shared resolver that {@link RouteLink} and
 * `@backstage/core-components`' `Link` use, so a target cannot be turned into
 * one href here and a different one there. Calling React Router's own `useHref`
 * instead would also make this hook throw wherever there is no router — which
 * a framework app is allowed to be, since `RouterBlueprint` can be swapped for
 * a passthrough and `createSpecializedApp` without `@backstage/plugin-app`
 * mounts none at all. With neither authority present the target is handed back
 * as written.
 *
 * Targets that are not app-relative are returned unchanged under both
 * frontend systems — see {@link AppHistoryApi.createHref}. React Router has no
 * equivalent guard — it resolves the path and joins the basename regardless —
 * so the fallback path applies its own.
 *
 * A target whose scheme a browser executes rather than navigates to —
 * `javascript:`, `data:` or `vbscript:`, however it is spelled — is replaced
 * with `about:blank` and a warning, so an href built from a catalog annotation
 * or any other value the app does not control cannot run script when it is
 * clicked. Every other scheme, `mailto:` and `tel:` included, is left alone.
 *
 * @public
 */
export function useHref(to: string): string {
  const appHistory = useApiHolder().get(appHistoryApiRef);
  // Made inert before anything else looks at it: the result of this hook is
  // rendered as an href, and both authorities hand back a target they cannot
  // route exactly as given.
  return useAppHref(appHistory, sanitizeHref(to));
}
