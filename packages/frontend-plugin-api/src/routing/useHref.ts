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
  createContext,
  useContext,
  type Context,
  type ContextType,
} from 'react';
// React Router v6 specifically, and only for the old frontend system: this
// package already declares the dependency (`useAppNavigate` calls
// `useNavigate`) and owns the version, which is why the fallback below lives
// here rather than in `@internal/frontend`. That package is inlined into this
// one, so anything it carries lands here too — it is now free of React Router
// and holds only the path algebra both authorities share.
import {
  UNSAFE_LocationContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
} from 'react-router-dom';
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

/*
 * The v6 context objects React Router's own hooks read, or stand-ins for them.
 *
 * The `UNSAFE_*` names only exist from React Router v6 stable onwards. The v6
 * beta this repo still supports — `AppManager.compat.test.tsx` runs the old
 * frontend system against both, and the migration CLI writes
 * `'6.0.0-beta.0 || ^6.3.0'` — exports no `UNSAFE_` name at all, so each import
 * is `undefined` there, and handing that to `useContext` throws before this
 * hook can answer.
 *
 * Resolving each context once, here at import time, keeps every `useContext`
 * call unconditional and always handed a real context object. Nothing ever
 * provides a stand-in, so under beta every read returns its default — no
 * router, no matches — which is the answer beta can actually support, and the
 * one this hook already degrades to.
 *
 * Reading the contexts rather than calling `useHref` / `useResolvedPath` /
 * `useLocation` is what lets this hook render with no router at all, which a
 * framework app is allowed to be: `RouterBlueprint` may be swapped for a
 * passthrough, and `createSpecializedApp` without `@backstage/plugin-app`
 * mounts none. Those hooks throw there; the contexts are `null` instead, which
 * is exactly how `useInRouterContext` detects a router.
 *
 * The value types are hoisted into named aliases because the `??` narrows each
 * `UNSAFE_*` identifier to `never` on its own right-hand side.
 */
type LocationContextValue = ContextType<typeof UNSAFE_LocationContext>;
type NavigationContextValue = ContextType<typeof UNSAFE_NavigationContext>;
type RouteContextValue = ContextType<typeof UNSAFE_RouteContext>;

// `null` is React Router's own default for these two, and is what
// `useRouterContext` below reads as "no router". The types say otherwise
// because the hooks that read them assert a router before touching them.
const LocationContext =
  UNSAFE_LocationContext ?? createContext<LocationContextValue>(null!);
const NavigationContext =
  UNSAFE_NavigationContext ?? createContext<NavigationContextValue>(null!);
const RouteContext =
  UNSAFE_RouteContext ??
  createContext<RouteContextValue>({
    outlet: null,
    matches: [],
    isDataRoute: false,
  });

/**
 * Reads one of React Router's own contexts.
 *
 * React Router types these as always present because its hooks assert a router
 * before touching them, but their runtime default is `null`. The read is
 * widened to admit that, which is what lets the router be optional.
 */
function useRouterContext<T>(context: Context<T>): T | undefined {
  return useContext(context) ?? undefined;
}

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
 * wherever there is no router — which a framework app is allowed to be, since
 * `RouterBlueprint` can be swapped for a passthrough and `createSpecializedApp`
 * without `@backstage/plugin-app` mounts none at all. With neither authority
 * present the target is handed back as written.
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
