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

import { useCallback } from 'react';
import {
  resolvePath,
  useHref as useReactRouterHref,
  useLocation as useReactRouterLocation,
  useNavigate as useReactRouterNavigate,
  useResolvedPath as useReactRouterResolvedPath,
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
 * - **React Router**: no app history (old frontend system). Every value comes
 *   from the exact React Router hook the call site used before the framework
 *   seam existed, with no reimplementation, so legacy behavior is unchanged.
 *
 * Both authorities are consulted on every render and the result is picked
 * afterwards, so hook order is stable and no call site needs to disable
 * `react-hooks/rules-of-hooks`. The React Router hooks require an ambient
 * router context, which app chrome already has under both frontend systems:
 * the old one mounts a `BrowserRouter` at the app root, and the new one
 * projects the app history into a root React Router context.
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
 */
export function useAppLocation(
  appHistory: AppHistoryApi | undefined,
): AppLocation {
  const frameworkLocation = useAppHistoryLocation(appHistory);
  const routerLocation = useReactRouterLocation();

  if (appHistory) {
    return frameworkLocation ?? ROOT_LOCATION;
  }
  return routerLocation;
}

/**
 * Resolves a link target to an app-absolute {@link Path}.
 *
 * Absolute targets are returned unchanged by both authorities; relative ones
 * resolve against the page mount base path (framework) or the matched route
 * base (React Router, which falls back to the app root when nothing matched).
 */
export function useAppResolvedPath(
  appHistory: AppHistoryApi | undefined,
  to: To,
): Path {
  const basePath = useAppBasePath();
  const routerResolvedPath = useReactRouterResolvedPath(to);

  if (appHistory) {
    return resolvePath(to, basePath || '/');
  }
  return routerResolvedPath;
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
 */
export function useAppHref(
  appHistory: AppHistoryApi | undefined,
  to: string,
): string {
  const routerHref = useReactRouterHref(to);

  if (appHistory) {
    return appHistory.createHref(to);
  }
  return isExternalTarget(to) ? to : routerHref;
}

/**
 * Returns a callback that navigates back one history entry.
 *
 * `AppHistoryApi` has no `go()` of its own — it listens for `popstate`, so the
 * browser is what goes back on the framework path.
 */
export function useAppGoBack(
  appHistory: AppHistoryApi | undefined,
): () => void {
  const routerNavigate = useReactRouterNavigate();

  return useCallback(() => {
    if (appHistory) {
      window.history.back();
      return;
    }
    routerNavigate(-1);
  }, [appHistory, routerNavigate]);
}
