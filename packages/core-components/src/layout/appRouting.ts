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
  useCallback,
  useContext,
  type Context,
  type ContextType,
} from 'react';
// React Router v6 specifically, and only for the old frontend system. This
// package already declares the dependency for its own reasons — `Link` renders
// through React Router's `Link`, and the `Sidebar` through its `NavLink` props
// — and owns the version, which is why the fallback lives here rather than in
// `@internal/frontend`. That package is inlined into every consumer, including
// `@backstage/frontend-plugin-api`, so it now carries no React Router at all:
// only the path algebra both authorities share.
import {
  UNSAFE_LocationContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
} from 'react-router-dom';
import type { AppHistoryApi } from '@backstage/frontend-plugin-api';
import {
  APP_ROOT_PATH,
  pageBasePaths,
  resolveAppPath,
  useAppBasePath,
  useAppHistoryLocation,
  type AppPath,
  type AppTo,
} from '@internal/frontend';

/**
 * The chrome-facing half of app routing: which authority answers "where am I?"
 * and "where does this target point?".
 *
 * Two authorities can answer, and every call site in this package has to pick
 * the same way:
 *
 * - **Framework**: an `AppHistoryApi` is registered (new frontend system).
 *   Location comes from the app history, and relative targets resolve against
 *   the current page's mount base.
 * - **React Router**: no app history (old frontend system). Every value is the
 *   one React Router's own hook at that call site produced before the framework
 *   seam existed, so legacy behavior is unchanged.
 *
 * New-frontend-system chrome reads the app history directly and therefore
 * does not require an ambient React Router. A specialized app without
 * `@backstage/plugin-app` may have neither authority. React Router's
 * `useLocation` / `useResolvedPath` / `useNavigate` throw there, so this module
 * does not call them: it reads the very contexts they read, which are `null`
 * outside a router rather than throwing — that is exactly how
 * `useInRouterContext` detects a router.
 * Location, target resolution and going back therefore run the same
 * `useContext` calls on every render and branch on the resulting *value*, so
 * hook order is stable whichever authority answers, no call site needs to
 * disable `react-hooks/rules-of-hooks`, and with neither authority present the
 * answers degrade to the app root instead of blanking the app.
 *
 * The app history is passed in rather than resolved here, the same way
 * `useOptionalAppHistory` hands it to every other call site in this package.
 *
 * Consumers are the `Sidebar` (`Items`, `SidebarGroup`, `MobileSidebar`,
 * `SidebarSubmenuItem`) and `ErrorPage`. `Link` needs none of this: it hands
 * internal targets to React Router's own `Link`, and its routerless branch
 * asks the app history directly. `@backstage/ui` deliberately does not use it
 * either: BUI is a standalone design system that receives `navigate` and
 * `useHref` as props instead.
 */

/*
 * The v6 context objects React Router's own hooks read, or stand-ins for them.
 *
 * The `UNSAFE_*` names only exist from React Router v6 stable onwards. The v6
 * beta this package still supports — see the `'6.0.0-beta.0 || ^6.3.0'` range
 * the migration CLI writes, and the beta arm of `Link.test.tsx` — exports no
 * `UNSAFE_` name at all, so each import is `undefined` there, and handing that
 * to `useContext` throws before any hook below can answer.
 *
 * Resolving each context once, here at import time, keeps every `useContext`
 * call unconditional and always handed a real context object. Nothing ever
 * provides a stand-in, so under beta every read returns its default — no
 * router, no matches — which is the answer beta can actually support, and the
 * one the hooks below already degrade to.
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
 * The current app-relative location.
 *
 * Falls back to the app root when neither authority can answer, so chrome that
 * only needs a pathname still renders without a router.
 */
export function useAppLocation(appHistory: AppHistoryApi | undefined): AppPath {
  const appHistoryLocation = useAppHistoryLocation(appHistory);
  const routerLocation = useRouterContext(LocationContext)?.location;

  if (appHistory) {
    return appHistoryLocation ?? APP_ROOT_PATH;
  }
  return routerLocation ?? APP_ROOT_PATH;
}

/**
 * Resolves a link target to an app-absolute path.
 *
 * Absolute targets are returned unchanged by both authorities; relative ones
 * resolve against the page mount base path (framework) or the matched route
 * base (React Router, which falls back to the app root when nothing matched,
 * and equally when there is no router).
 */
export function useAppResolvedPath(
  appHistory: AppHistoryApi | undefined,
  to: AppTo,
): AppPath {
  const basePath = useAppBasePath();
  const routeBasePaths = useRouteBasePaths();
  // Whichever authority answers, it is the same one that answers for the
  // location, so a target with no pathname of its own — `?tab=readme`,
  // `#section` — stays on the page the caller is actually standing on.
  const { pathname } = useAppLocation(appHistory);

  return resolveAppPath(
    to,
    appHistory ? pageBasePaths(basePath) : routeBasePaths,
    pathname,
  );
}

/**
 * Returns a callback that navigates back one history entry.
 *
 * The React Router authority goes back through the navigator, which is what
 * `useNavigate`'s `navigate(-1)` does with a numeric delta — in a plain router
 * the navigator is the history itself, and in a data router `go` forwards to
 * `router.navigate(-1)`, so both routers pop the entry they always did. Taking
 * the navigator out of the context rather than calling `useNavigate` is what
 * lets this hook render outside a router at all, exactly as its siblings above
 * do.
 *
 * Both other cases go back through the browser. `AppHistoryApi` has no `go()`
 * of its own — it listens for `popstate` — so the browser is already what goes
 * back on the framework path, and with no router there is no navigator to ask
 * and the browser is the only history there is.
 *
 * As with its siblings, tolerating a missing router is a promise about this
 * hook, not about the chrome that calls it: `ErrorPage` renders its go-back
 * link through `Link`, which hands internal targets to React Router's own
 * `Link` and has always needed a router. Chrome that renders with no router at
 * all is a capability the framework does not have yet.
 */
export function useAppGoBack(
  appHistory: AppHistoryApi | undefined,
): () => void {
  const navigator = useRouterContext(NavigationContext)?.navigator;

  return useCallback(() => {
    if (!appHistory && navigator) {
      navigator.go(-1);
      return;
    }
    window.history.back();
  }, [appHistory, navigator]);
}
