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

import type { AppHistoryApi } from '@backstage/frontend-plugin-api';
import type { PageMount } from '@internal/frontend';

/**
 * AbsoluteLinkNavigate — decide when `Link` should go through the app-wide
 * {@link AppHistoryApi} instead of the ambient React Router context.
 *
 * A page mounted under a scoped `PageMount` (e.g. `/create`) gets its
 * own React Router context whose `navigate` is bound to that page. An
 * absolute cross-plugin `Link to="/catalog/..."` rendered inside that page
 * would otherwise resolve relative to the page's own router. Routing those
 * targets through the app history keeps them working.
 *
 * The mirror image is a page whose routing library is not React Router v6 at
 * all: there the ambient v6 context is the app-root projection, which has no
 * match to resolve a *relative* target against. Those resolve against the page
 * mount instead — see {@link shouldResolveViaPageMount}.
 *
 * This module hides dual-authority (scoped page router vs app history) from
 * `Link`. It remains required as long as pages get their own scoped React
 * Router context (i.e. as long as a root React Router projection is in use for
 * chrome/legacy consumers) — see `RootReactRouterV6` /
 * ChromeRouterProjection. In-scope absolute targets, and relative targets that
 * a page-scoped React Router context can resolve, are left untouched so scoped
 * adapters keep working.
 *
 * @internal
 */

/** Inputs for AbsoluteLinkNavigate decisions. */
export type AbsoluteLinkNavigateOptions = {
  to: string;
  appHistory: AppHistoryApi | undefined;
  pageMount: PageMount | undefined;
};

/**
 * True when new-frontend-system navigation signals are present (app history
 * and/or page mount in context).
 *
 * @internal
 */
export function hasFrameworkNavigationSignals(
  appHistory: AppHistoryApi | undefined,
  pageMount: PageMount | undefined,
): boolean {
  return Boolean(appHistory || pageMount);
}

/**
 * True when `to` should navigate via the framework app history instead of
 * the ambient React Router context.
 *
 * @internal
 */
export function shouldNavigateViaFramework(
  options: AbsoluteLinkNavigateOptions,
): boolean {
  const { to, appHistory, pageMount } = options;
  if (!hasFrameworkNavigationSignals(appHistory, pageMount)) {
    return false;
  }
  if (!appHistory) {
    return false;
  }
  if (!to.startsWith('/') || to.startsWith('//')) {
    return false;
  }

  if (!pageMount || pageMount.basePath === '/') {
    return true;
  }

  const pathname = to.split(/[?#]/, 1)[0] ?? to;
  const { basePath } = pageMount;
  const inScope = pathname === basePath || pathname.startsWith(`${basePath}/`);
  return !inScope;
}

/** Inputs for the relative-target decision. */
export type PageMountResolveOptions = {
  to: string;
  appHistory: AppHistoryApi | undefined;
  pageMount: PageMount | undefined;
  /**
   * Whether the ambient React Router context has any matched routes, i.e.
   * whether React Router has a base of its own to resolve a relative target
   * against.
   *
   * A match in context is always *rooted*: it is either the page adapter's own
   * projected match — which is appended to the route context the page is
   * mounted inside, so a subpage's stack starts at its parent page rather than
   * at the subpage itself — or a route matched below one. So "is there a
   * match" and "does the stack start at or above the page base" are the same
   * question, and only the former needs asking here.
   */
  hasAmbientRouteMatch: boolean;
};

/**
 * True when a relative `to` has to be resolved against `PageMount.basePath`
 * because no ambient React Router context can resolve it correctly.
 *
 * React Router resolves a relative target against the routes matched in
 * context. A page or subpage hosted by the React Router v6 adapter publishes
 * its own match on top of the ones it is mounted inside, so React Router
 * already has the right base and keeps it. A page hosted by TanStack or React
 * Router v7 publishes no v6 match at all, so React Router would silently
 * resolve against the app root and the link would leave the page entirely.
 * `PageMount.basePath` is the framework's analogue of React Router's
 * `pathnameBase`, and is the only base available there.
 *
 * `..` means "up one route match", and the framework knows where a match ends
 * without a route tree to walk: `PageMount.routePattern` says which segments
 * of the base a single pattern claims. The caller below climbs that stack
 * rather than the base path's segments — see `climbInPage` in `Link.tsx`, and
 * `pageBasePaths` in `@internal/frontend` — so a page mounted at
 * `/catalog/:namespace/:kind/:name` and hosted by another routing library
 * resolves `..` off the page, the same way `useHref` does, rather than into
 * `/catalog/default/component`, which no route claims.
 *
 * Only relative *path* targets qualify. App-absolute (`/x`) targets need no
 * base at all, while search-only (`?tab=x`) and fragment-only (`#section`)
 * targets are relative to the current location rather than to any base, which
 * React Router gets right with or without a match. As for
 * {@link shouldNavigateViaFramework}, the caller has already established that
 * `to` points inside the app.
 *
 * Outside a page there is nothing to resolve against that React Router does
 * not already agree with — both fall back to the app root — so app chrome
 * keeps taking the same path it takes today.
 *
 * @internal
 */
export function shouldResolveViaPageMount(
  options: PageMountResolveOptions,
): boolean {
  const { to, appHistory, pageMount, hasAmbientRouteMatch } = options;
  if (!appHistory || !pageMount || hasAmbientRouteMatch) {
    return false;
  }
  return !/^[/?#]/.test(to);
}
