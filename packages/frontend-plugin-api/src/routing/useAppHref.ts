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
  resolveAppPath,
  sanitizeHref,
  useAppHistoryLocation,
} from '@internal/frontend';
import { useAppNode } from '../components/AppNodeProvider';
import { routeResolutionApiRef } from '../apis/definitions/RouteResolutionApi';
import { useApiHolder } from '../apis/system';
import { appHistoryApiRef } from './AppHistoryApi';
import {
  LocationContext,
  NavigationContext,
  useRouteBasePaths,
  useRouterContext,
} from './reactRouterContext';

/**
 * Resolves an app-relative path to a browser-ready href (including the app's
 * deploy basename), the react-aria-style counterpart to {@link useAppNavigate}.
 *
 * Falls back to React Router when no {@link appHistoryApiRef} is registered
 * (old frontend system).
 *
 * Both answers come from the same shared resolver that {@link RouteLink} uses,
 * and both give the href React Router gives for the same target on the same
 * page: a relative target resolves against the page, and each leading `..`
 * climbs one route match, so on a page mounted at
 * `/catalog/:namespace/:kind/:name` a single `..` climbs off the page rather
 * than into a path no route claims. A target therefore cannot be turned into
 * one href here and a different one in the `Link` beside it.
 *
 * Calling React Router's own `useHref` instead would also make this hook throw
 * in routerless new frontend system chrome or a specialized app that mounts no
 * React Router provider. With neither authority present the target is handed
 * back as written.
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
  const node = useAppNode();
  const routes = apis.get(routeResolutionApiRef);
  const location = useAppHistoryLocation(appHistory);
  const navigation = useRouterContext(NavigationContext);
  const routeBasePaths = useRouteBasePaths();
  const routerLocation = useRouterContext(LocationContext)?.location;

  if (appHistory && location) {
    const target = routes
      ? routes.resolveTarget({ to, pathname: location.pathname, node })
      : to;
    return appHistory.createHref(target);
  }
  const safeTo = sanitizeHref(to);
  if (isExternalTarget(safeTo)) {
    return safeTo;
  }
  if (!navigation) {
    return safeTo;
  }

  // React Router's `useHref`: the resolved path, prefixed with the router
  // basename, handed to the navigator to render.
  const { basename, navigator } = navigation;
  const { pathname, search, hash } = resolveAppPath(
    safeTo,
    routeBasePaths,
    routerLocation?.pathname ?? APP_ROOT_PATH.pathname,
  );
  let joinedPathname = pathname;
  if (basename !== '/') {
    joinedPathname =
      pathname === '/'
        ? basename
        : `${basename}/${pathname}`.replace(/\/\/+/g, '/');
  }
  return navigator.createHref({ pathname: joinedPathname, search, hash });
}
