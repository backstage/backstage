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

import { useCallback, useContext, type Context } from 'react';
import {
  parsePath,
  resolvePath,
  UNSAFE_LocationContext as LocationContext,
  UNSAFE_NavigationContext as NavigationContext,
  UNSAFE_RouteContext as RouteContext,
  type Path,
  type To,
} from 'react-router-dom';
import type { AppHistoryApi } from '@backstage/frontend-plugin-api';
import { isExternalTarget } from './isExternalTarget';
import { usePageMount } from './PageMountContext';
import { useAppHistoryLocation } from './useAppHistoryLocation';

/**
 * AppRouting — the single answer to "which authority resolves this path?".
 *
 * Two authorities can answer, and every call site has to pick the same way:
 *
 * - **Framework**: an `AppHistoryApi` is registered (new frontend system).
 *   Location comes from the app history, hrefs come from `createHref` (which
 *   applies the app's deploy basename), and relative targets resolve against
 *   the current {@link PageMount} `basePath` — the framework's analogue of
 *   React Router's `pathnameBase`.
 * - **React Router**: no app history (old frontend system). Every value is the
 *   one React Router's own hook at that call site produced before the framework
 *   seam existed, so legacy behavior is unchanged.
 *
 * Rendering app chrome does not require either authority. Chrome legitimately
 * renders with no ambient React Router: `RouterBlueprint` is supported and its
 * own docs invite swapping the root router for a passthrough,
 * `convertLegacyAppOptions` routes a migrating app's `components.Router` into
 * that same slot, and `createSpecializedApp` without `@backstage/plugin-app`
 * has no router at all. React Router's `useLocation` / `useResolvedPath` /
 * `useHref` / `useNavigate` throw there, so this module does not call them: it
 * reads the very contexts they read, which are `null` outside a router rather
 * than throwing — that is exactly how `useInRouterContext` detects a router.
 * Location, target resolution, href and going back therefore run the same
 * `useContext` calls on every render and branch on the resulting *value*, so
 * hook order is stable whichever authority answers, no call site needs to
 * disable `react-hooks/rules-of-hooks`, and with neither authority present the
 * answers degrade to the app root instead of blanking the app.
 *
 * The app history is passed in rather than resolved here. `@internal/frontend`
 * is inlined into `@backstage/frontend-plugin-api`, so importing
 * `appHistoryApiRef` (or `useApiHolder`) at runtime would close an import
 * cycle. Callers already hold the app history: chrome resolves it from the API
 * holder, and the app and plugin API read it with `useApi(appHistoryApiRef)`.
 *
 * Consumers live in `@backstage/core-components` (`Sidebar`, `ErrorPage`,
 * `Link`), `@backstage/frontend-plugin-api` (`RouteLink`) and `plugins/app`
 * (`AppRoot`, `PageLayout`). `@backstage/ui` deliberately does not use this
 * module: BUI is a standalone design system that receives `navigate` and
 * `useHref` as props instead.
 */

/**
 * The part of a location that path matching cares about.
 *
 * Structurally compatible with both React Router's `Location` and
 * `FrameworkLocation`, so either can be returned without copying.
 */
export interface AppLocation {
  pathname: string;
  search: string;
  hash: string;
}

const ROOT_LOCATION: AppLocation = { pathname: '/', search: '', hash: '' };

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
 * React Router's own target resolution, without the throw.
 *
 * `useResolvedPath` is `resolvePath` against the base of the deepest matched
 * route, plus the two rules `resolvePath` does not carry on its own: a target
 * with no pathname of its own (`?tab=readme`, `#section`) resolves against the
 * current location, and each leading `..` climbs one route match rather than
 * one path segment. Reproduced here rather than called so that the hooks around
 * it stay unconditional; `AppRouting.test.tsx` pins the two against each other
 * by rendering React Router's hook and this one in the same tree.
 */
function resolveAgainstRoutes(
  to: To,
  routeBasePaths: string[],
  locationPathname: string,
): Path {
  const target = typeof to === 'string' ? parsePath(to) : { ...to };
  const isEmptyPath = to === '' || target.pathname === '';
  const toPathname = isEmptyPath ? '/' : target.pathname;

  let from: string;
  if (toPathname === undefined) {
    from = locationPathname;
  } else {
    let baseIndex = routeBasePaths.length - 1;
    if (toPathname.startsWith('..')) {
      const segments = toPathname.split('/');
      while (segments[0] === '..') {
        segments.shift();
        baseIndex -= 1;
      }
      target.pathname = segments.join('/');
    }
    from = baseIndex >= 0 ? routeBasePaths[baseIndex] : '/';
  }

  const resolved = resolvePath(target, from);

  const hasExplicitTrailingSlash =
    !!toPathname && toPathname !== '/' && toPathname.endsWith('/');
  const hasCurrentTrailingSlash =
    (isEmptyPath || toPathname === '.') && locationPathname.endsWith('/');
  if (
    !resolved.pathname.endsWith('/') &&
    (hasExplicitTrailingSlash || hasCurrentTrailingSlash)
  ) {
    resolved.pathname += '/';
  }
  return resolved;
}

/**
 * Normalises a mount base path into a prefix that is safe to concatenate with
 * a `/`-prefixed suffix: no trailing slash, and an empty string at the app
 * root.
 */
export function normalizeBasePath(basePath: string | undefined): string {
  return basePath?.replace(/\/+$/, '') ?? '';
}

/**
 * The base path that relative targets resolve against, as a prefix without a
 * trailing slash (empty string at the app root).
 *
 * Only meaningful on the framework path; React Router derives its own base
 * from the matched routes.
 */
export function useAppBasePath(): string {
  return normalizeBasePath(usePageMount()?.basePath);
}

/**
 * The current app-relative location.
 *
 * Falls back to the app root when neither authority can answer, so chrome that
 * only needs a pathname still renders without a router.
 */
export function useAppLocation(
  appHistory: AppHistoryApi | undefined,
): AppLocation {
  const frameworkLocation = useAppHistoryLocation(appHistory);
  const routerLocation = useRouterContext(LocationContext)?.location;

  if (appHistory) {
    return frameworkLocation ?? ROOT_LOCATION;
  }
  return routerLocation ?? ROOT_LOCATION;
}

/**
 * Resolves a link target to an app-absolute {@link Path}.
 *
 * Absolute targets are returned unchanged by both authorities; relative ones
 * resolve against the page mount base path (framework) or the matched route
 * base (React Router, which falls back to the app root when nothing matched,
 * and equally when there is no router).
 */
export function useAppResolvedPath(
  appHistory: AppHistoryApi | undefined,
  to: To,
): Path {
  const basePath = useAppBasePath();
  const routeBasePaths = useRouteBasePaths();
  const routerLocation = useRouterContext(LocationContext)?.location;

  if (appHistory) {
    return resolvePath(to, basePath || '/');
  }
  return resolveAgainstRoutes(
    to,
    routeBasePaths,
    routerLocation?.pathname ?? ROOT_LOCATION.pathname,
  );
}

/**
 * Resolves an app-relative path to a browser-ready href, including the app's
 * deploy basename.
 *
 * Targets that are not app-relative — absolute (`https://example.com/x`),
 * protocol-relative (`//example.com/x`), and opaque schemes such as `mailto:`
 * and `tel:` — are returned unchanged. `AppHistory.createHref` already does
 * this on the framework path; React Router's `useHref` does not, and would
 * resolve them against the current route and prefix the basename, so the
 * legacy path needs the same guard to agree.
 *
 * With no router there is no basename and no navigator to render the href, so
 * the target is handed back as written — the same answer `@backstage/ui`'s
 * `useResolvedHref` gives outside a router.
 */
export function useAppHref(
  appHistory: AppHistoryApi | undefined,
  to: string,
): string {
  const navigation = useRouterContext(NavigationContext);
  // Always the React Router authority: the framework path renders its own href
  // through `createHref` and never needs a resolved path.
  const routerResolvedPath = useAppResolvedPath(undefined, to);

  if (appHistory) {
    return appHistory.createHref(to);
  }
  if (!navigation || isExternalTarget(to)) {
    return to;
  }

  // React Router's `useHref`: the resolved path, prefixed with the router
  // basename, handed to the navigator to render.
  const { basename, navigator } = navigation;
  const { pathname, search, hash } = routerResolvedPath;
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
 * link through `@backstage/core-components`' `Link`, which hands internal
 * targets to React Router's own `Link` and has always needed a router. Chrome
 * that renders with no router at all is a capability the framework does not
 * have yet.
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
