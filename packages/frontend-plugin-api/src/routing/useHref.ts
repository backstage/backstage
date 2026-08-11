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

import { useContext } from 'react';
import {
  APP_ROOT_PATH,
  climbPageBase,
  isExternalTarget,
  pageBasePaths,
  resolveAppPath,
  sanitizeHref,
  useAppHistoryLocation,
  usePageMount,
} from '@internal/frontend';
import { useApiHolder } from '../apis/system';
import { appHistoryApiRef, type AppHistoryApi } from './AppHistoryApi';
import {
  LocationContext,
  NavigationContext,
  RouteContext,
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
 * The route bases a relative target resolves against, derived exactly the way
 * React Router's `useResolvedPath` derives them: the `pathnameBase` of every
 * match that contributes a path segment, or the leaf's full `pathname` when the
 * `v7_relativeSplatPath` future flag is on.
 *
 * Empty when there is no router, and equally inside one where nothing matched —
 * both mean relative targets resolve against the app root.
 */
function useRouteBasePaths(): string[] {
  const matches = useContext(RouteContext).matches;
  const relativeSplatPath =
    useRouterContext(NavigationContext)?.future?.v7_relativeSplatPath ?? false;

  const contributing = matches.filter(
    (match, index) => index === 0 || !!match.route.path,
  );
  return contributing.map((match, index) =>
    relativeSplatPath && index === contributing.length - 1
      ? match.pathname
      : match.pathnameBase,
  );
}

/**
 * Resolves a link target to a browser-ready href under whichever authority can
 * answer.
 *
 * - **Framework** (an app history is registered): the target is resolved
 *   against the page it is written in, and the app history renders it with the
 *   app's deploy basename. A leading `..` climbs one route *match*, not one
 *   path segment: a page publishes the pattern it is mounted at alongside the
 *   concrete base, and the pattern is what says where its match ends. Only
 *   that climb is decided here, because only this tree knows the page; every
 *   other rule is `AppHistoryApi.createHref`'s. Both halves answer the same on
 *   a page whichever routing library renders it, and the same as React Router
 *   does for the same target — so a target cannot render as one href here and
 *   a different one in the chrome or the `Link` beside it.
 * - **React Router** (no app history — the old frontend system): every value is
 *   the one React Router's `useHref` produces at this call site, reproduced
 *   from the very contexts its own hooks read so that rendering outside a
 *   router degrades instead of throwing.
 * - **Neither**: there is no basename and no navigator to render the href, so
 *   the target is handed back as written.
 *
 * Targets that are not app-relative — absolute (`https://example.com/x`),
 * protocol-relative (`//example.com/x`), and opaque schemes such as `mailto:`
 * and `tel:` — are returned unchanged. `AppHistoryApi.createHref` already does
 * this on the framework path; React Router's `useHref` does not, and would
 * resolve them against the current route and prefix the basename, so both
 * paths go through the same guard to agree.
 *
 * @internal
 */
export function useAppHref(
  appHistory: AppHistoryApi | undefined,
  to: string,
): string {
  const pageMount = usePageMount();
  // Subscribes to the app history. A target with no pathname of its own —
  // `?tab=readme`, `#section` — is resolved against the current location, so
  // the href has to be recomputed when the app navigates. The value itself is
  // read back inside `createHref`, which owns the location.
  useAppHistoryLocation(appHistory);
  const navigation = useRouterContext(NavigationContext);
  const routeBasePaths = useRouteBasePaths();
  const routerLocation = useRouterContext(LocationContext)?.location;

  if (isExternalTarget(to)) {
    return to;
  }
  if (appHistory) {
    // Which base a leading `..` climbs to is the one part of the answer that
    // only this tree can give — the page publishes its mount and its pattern
    // here and nowhere else. Resolving the climb and handing the app history
    // the base it landed on leaves every other rule where it belongs.
    const climbed = climbPageBase(
      to,
      pageBasePaths(pageMount?.basePath, pageMount?.routePattern),
    );
    return appHistory.createHref(climbed.to, { basePath: climbed.basePath });
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
