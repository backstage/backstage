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
  useAppRouting,
} from '@internal/frontend';
import { useApiHolder } from '../apis/system';
import { appHistoryApiRef, type AppHistoryApi } from './AppHistoryApi';
import {
  LocationContext,
  NavigationContext,
  useRouteBasePaths,
  useRouterContext,
} from './reactRouterContext';

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
 * fallback. `@internal/frontend` stays free of it and carries only the path
 * algebra both authorities share.
 */
/**
 * Resolves framework targets against the actual matched extension ancestry.
 * Each leading `..` climbs one route, and AppHistory applies the deployment
 * basename. Without AppHistory, reads the old frontend's React Router
 * contexts; without either authority, returns the target unchanged.
 * @internal
 */
export function useAppHref(
  appHistory: AppHistoryApi | undefined,
  to: string,
): string {
  const appRouting = useAppRouting(appHistory);
  const navigation = useRouterContext(NavigationContext);
  const routeBasePaths = useRouteBasePaths();
  const routerLocation = useRouterContext(LocationContext)?.location;

  if (isExternalTarget(to)) {
    return to;
  }
  if (appRouting) {
    return appRouting.createHref(to);
  }
  if (!navigation) {
    return to;
  }

  // React Router's `useHref`: the resolved path, prefixed with the router
  // basename, handed to the navigator to render.
  const { basename, navigator } = navigation;
  const { pathname, search, hash } = resolveAppPath(
    to,
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
export function useHref(to: string): string {
  const appHistory = useApiHolder().get(appHistoryApiRef);
  // Made inert before anything else looks at it: the result of this hook is
  // rendered as an href, and both authorities hand back a target they cannot
  // route exactly as given.
  return useAppHref(appHistory, sanitizeHref(to));
}
