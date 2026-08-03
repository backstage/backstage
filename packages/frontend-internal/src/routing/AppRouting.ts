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
// React Router v6 specifically, which is why `@internal/frontend` keeps its
// `react-router-dom` peer dependency at `^6.30.2` while the rest of the new
// frontend system is router-agnostic. The `UNSAFE_*` context objects below are
// v6 internals, and reading them is a legacy-compatibility dependency rather
// than a new-frontend-system one. Two things need it: the old frontend system,
// where React Router v6 is the router, is permanent, and is never migrated; and
// the ambient route-match base under the residual root projection that
// `AppRoot` still renders for chrome that resolves relative links through React
// Router. Any package that inlines this module therefore has to declare
// react-router itself.
import {
  resolvePath,
  UNSAFE_LocationContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
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
 *   Location comes from the app history, and relative targets resolve against
 *   the current {@link PageMount} `basePath` — the framework's analogue of
 *   React Router's `pathnameBase` — or against the matches a page adapter
 *   projects, where there are any. Hrefs are that resolved, app-absolute path
 *   handed to `createHref`, which applies the app's deploy basename.
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

/*
 * The v6 context objects React Router's own hooks read, or stand-ins for them.
 *
 * The `UNSAFE_*` names only exist from React Router v6 stable onwards. The v6
 * beta this repo still supports — `AppManager.compat.test.tsx` runs the old
 * frontend system against both, and the migration CLI writes
 * `'6.0.0-beta.0 || ^6.3.0'` — exports no `UNSAFE_` name at all, so each import
 * is `undefined` there, and handing that to `useContext` throws before any hook
 * below can answer.
 *
 * Resolving each context once, here at import time, keeps every `useContext`
 * call unconditional and always handed a real context object. Nothing ever
 * provides a stand-in, so under beta every read returns its default — no
 * router, no matches — which is the answer beta can actually support, and the
 * one the hooks below already degrade to. That is what the new frontend system
 * needs from it: chrome rendered with no React Router at all resolves through
 * the framework authority, which does not read these contexts.
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
 * React Router's `parsePath`, vendored.
 *
 * Absent from the v6 beta for the same reason the `UNSAFE_*` contexts are, but
 * with no React involvement there is nothing to stand in for — it is simply
 * written out. `resolvePath` *is* exported by the beta, and stays imported.
 *
 * The semantics are React Router's exactly, because {@link resolveAgainstRoutes}
 * branches on them: a target with no pathname of its own (`?tab=readme`,
 * `#section`) comes back with the `pathname` key absent rather than empty,
 * which is what makes it resolve against the current location, and a bare `?`
 * or `#` parses as a search or hash that {@link createPath} drops again. The
 * hash is taken before the search, so a `?` inside a fragment stays in the
 * fragment. `AppRouting.test.tsx` pins this against the real implementation.
 */
export function parsePath(path: string): Partial<Path> {
  const parsedPath: Partial<Path> = {};
  let rest = path;

  if (rest) {
    const hashIndex = rest.indexOf('#');
    if (hashIndex >= 0) {
      parsedPath.hash = rest.substring(hashIndex);
      rest = rest.substring(0, hashIndex);
    }

    const searchIndex = rest.indexOf('?');
    if (searchIndex >= 0) {
      parsedPath.search = rest.substring(searchIndex);
      rest = rest.substring(0, searchIndex);
    }

    if (rest) {
      parsedPath.pathname = rest;
    }
  }

  return parsedPath;
}

/**
 * React Router's `createPath`, vendored alongside {@link parsePath} and absent
 * from the v6 beta for the same reason.
 *
 * Again the semantics are React Router's exactly: a missing pathname defaults
 * to the app root but an explicitly empty one does not, a search or hash that
 * already carries its prefix keeps the one it was written with, and a bare `?`
 * or `#` contributes nothing.
 */
export function createPath({
  pathname = '/',
  search = '',
  hash = '',
}: Partial<Path>): string {
  let path = pathname;
  if (search && search !== '?') {
    path += search.charAt(0) === '?' ? search : `?${search}`;
  }
  if (hash && hash !== '#') {
    path += hash.charAt(0) === '#' ? hash : `#${hash}`;
  }
  return path;
}

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
 * Normalizes a mount base path into a prefix that is safe to concatenate with
 * a `/`-prefixed suffix: no trailing slash, and an empty string at the app
 * root. Unlike a matched pathname, a base path keeps nothing back — `/` and
 * `///` both normalize to the empty prefix.
 *
 * Scanned rather than matched with a `/\/+$/` pattern: the base path is derived
 * from the pathname, which is whatever a crafted link put in the address bar,
 * and a backtracking matcher retries such a pattern from every position in a
 * long run of slashes, which is quadratic in the length of the run. It is the
 * pattern being unanchored that makes it quadratic; anchoring a pattern is not
 * on its own a defense against backtracking, and is not why this scans.
 *
 * The scan answers the same as the pattern it replaced for every input — the
 * pattern had no `.` in it, so it carries none of the line-terminator
 * divergence that `trimTrailingSlash` documents.
 */
export function normalizeBasePath(basePath: string | undefined): string {
  if (!basePath) {
    return '';
  }
  let end = basePath.length;
  while (end > 0 && basePath[end - 1] === '/') {
    end -= 1;
  }
  return basePath.slice(0, end);
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
 * The route bases a relative target resolves against on the framework path,
 * in the same shape {@link useRouteBasePaths} produces for React Router.
 *
 * A page adapter projects the page's own match on top of the matches it is
 * mounted inside, so wherever one is in context the stack it publishes is
 * already the one React Router would have produced — ancestors included, which
 * is what a leading `..` climbs. That is what makes a sub-page's
 * `../sibling-tab` point at the sibling tab rather than at the app root.
 *
 * Chrome rendered above an adapter sees no matches at all — a page's header,
 * tabs and breadcrumbs resolve their links from the mount rather than from a
 * routing library, and an app whose `RouterBlueprint` is a passthrough has no
 * React Router anywhere. There the page mount is the only base there is:
 * relative targets resolve against it, and `..` climbs off the page, which is
 * the answer React Router gives at its outermost match too.
 */
function useFrameworkBasePaths(): string[] {
  const basePath = useAppBasePath();
  const routeBasePaths = useRouteBasePaths();

  return routeBasePaths.length > 0 ? routeBasePaths : [basePath || '/'];
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
 * Resolves a link target to a browser-ready href, including the app's deploy
 * basename.
 *
 * The target is resolved against the page it is written in before the basename
 * is applied, exactly as React Router's `useHref` resolves against the route it
 * is called from: `#section` and `?tab=readme` keep the current location,
 * `widgets` resolves against the page's base, and each leading `..` climbs one
 * route match. The framework has to do that resolution here, because
 * `AppHistory.createHref` resolves its input against the app *root* — the
 * right contract for it, and the one `navigate` shares, but on its own it turns
 * a fragment link written inside a page into a link to the app root.
 *
 * Targets that are not app-relative — absolute (`https://example.com/x`),
 * protocol-relative (`//example.com/x`), and opaque schemes such as `mailto:`
 * and `tel:` — are returned unchanged. `AppHistory.createHref` already does
 * this on the framework path; React Router's `useHref` does not, and would
 * resolve them against the current route and prefix the basename, so both
 * paths go through the same guard to agree.
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
  const frameworkBasePaths = useFrameworkBasePaths();
  const appLocation = useAppLocation(appHistory);
  // Always the React Router authority: the framework path resolves through the
  // bases above instead, and renders the result through `createHref`.
  const routerResolvedPath = useAppResolvedPath(undefined, to);

  if (isExternalTarget(to)) {
    return to;
  }
  if (appHistory) {
    // App-absolute by the time `createHref` sees it, so all that is left for it
    // to do is prefix the deploy basename.
    return appHistory.createHref(
      createPath(
        resolveAgainstRoutes(to, frameworkBasePaths, appLocation.pathname),
      ),
    );
  }
  if (!navigation) {
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
