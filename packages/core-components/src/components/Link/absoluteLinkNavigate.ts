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
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type { PageMount } from '../../../../frontend-plugin-api/src/routing/PageMountContext';

/**
 * AbsoluteLinkNavigate — decide when `Link` should use the app-wide
 * {@link AppHistoryApi} for an absolute `to` instead of ambient React Router.
 *
 * A page mounted under a scoped `PageMount` (e.g. `/create`) gets its
 * own React Router context whose `navigate` is bound to that page. An
 * absolute cross-plugin `Link to="/catalog/..."` rendered inside that page
 * would otherwise resolve relative to the page's own router. Routing those
 * targets through the app history keeps them working.
 *
 * This module hides dual-authority (scoped page router vs app history) from
 * `Link`. It remains required as long as pages get their own scoped React
 * Router context (i.e. as long as a root React Router projection is in use for
 * chrome/legacy consumers) — see `RootReactRouterV6` /
 * ChromeRouterProjection. Relative and in-scope absolute targets are left
 * untouched so scoped adapters keep working.
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
