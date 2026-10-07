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

import {
  APP_ROOT_PATH,
  isExternalTarget,
  resolveAppTarget,
  parsePath,
  useAppHistoryLocation,
} from '@internal/frontend';
import { useApiHolder } from '../apis/system';
import { appHistoryApiRef } from './AppHistoryApi';
import {
  LocationContext,
  NavigationContext,
  useRouterContext,
} from './reactRouterContext';

/**
 * Resolves an app-absolute path to a browser-ready href (including the app's
 * deploy basename), the react-aria-style counterpart to {@link useAppNavigate}.
 *
 * Falls back to React Router when no {@link appHistoryApiRef} is registered
 * (old frontend system).
 *
 * Paths must start with `/` and are relative to the app root, excluding the
 * deployment basename. Query-only and hash-only targets use the current path.
 * Relative paths belong to routing adapters and are rejected by this hook.
 * External URLs are returned unchanged.
 *
 * A target whose scheme a browser executes rather than navigates to —
 * `javascript:`, `data:` or `vbscript:`, however it is spelled — is replaced
 * with `about:blank` and a warning, so an href built from a catalog annotation
 * or any other value the app does not control cannot run script when it is
 * clicked. Every other scheme, `mailto:` and `tel:` included, is left alone.
 *
 * @public
 */
export function useAppHref(to: string): string {
  /*
   * Reading React Router's contexts rather than calling `useHref` /
   * `useResolvedPath` /
   * `useLocation` is what lets this hook render with no router at all. New
   * frontend system chrome is deliberately routerless, and a specialized app
   * does not need to mount a React Router provider. Those hooks throw there; the
   * contexts are `null` instead, which is exactly how `useInRouterContext`
   * detects a router.
   *
   * This package owns the React Router v6 dependency for the old frontend
   * fallback. The internal frontend package stays free of it and carries only the path
   * algebra both authorities share.
   */

  const apis = useApiHolder();
  const appHistory = apis.get(appHistoryApiRef);
  const location = useAppHistoryLocation(appHistory);
  const navigation = useRouterContext(NavigationContext);
  const routerLocation = useRouterContext(LocationContext)?.location;

  if (appHistory && location) {
    return appHistory.createHref(to);
  }
  const safeTo = resolveAppTarget(
    to,
    routerLocation?.pathname ?? APP_ROOT_PATH.pathname,
  );
  if (isExternalTarget(safeTo)) {
    return safeTo;
  }
  if (!navigation) {
    return safeTo;
  }

  // React Router's `useHref`: the resolved path, prefixed with the router
  // basename, handed to the navigator to render.
  const { basename, navigator } = navigation;
  const { pathname = '/', search, hash } = parsePath(safeTo);
  let joinedPathname = pathname;
  if (basename !== '/') {
    joinedPathname =
      pathname === '/'
        ? basename
        : `${basename}/${pathname}`.replace(/\/\/+/g, '/');
  }
  return navigator.createHref({ pathname: joinedPathname, search, hash });
}
