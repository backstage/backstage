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

import type {
  NavigationControllerApi,
  RoutingContract,
} from '@backstage/frontend-plugin-api';

/**
 * AbsoluteLinkNavigate — decide when `Link` should use the app-wide
 * {@link NavigationControllerApi} for an absolute `to` instead of ambient
 * React Router.
 *
 * A page mounted under a scoped {@link RoutingContract} (e.g. `/create`) gets
 * its own React Router context whose `navigate` is bound to that contract.
 * `RoutingContract.navigate` refuses to leave its `basePath` (see
 * `ScopedRouting.ts`), so an absolute cross-plugin `Link to="/catalog/..."`
 * rendered inside that page would otherwise be silently blocked. Routing those
 * targets through the navigation controller keeps them working.
 *
 * This module hides dual-authority (scoped contract vs app controller) from
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
  navigationController: NavigationControllerApi | undefined;
  routingContract: RoutingContract | undefined;
};

/**
 * True when new-frontend-system navigation signals are present (controller
 * and/or routing contract in context).
 *
 * @internal
 */
export function hasFrameworkNavigationSignals(
  navigationController: NavigationControllerApi | undefined,
  routingContract: RoutingContract | undefined,
): boolean {
  return Boolean(navigationController || routingContract);
}

/**
 * True when `to` should navigate via the framework navigation controller
 * instead of the ambient React Router context.
 *
 * @internal
 */
export function shouldNavigateViaFramework(
  options: AbsoluteLinkNavigateOptions,
): boolean {
  const { to, navigationController, routingContract } = options;
  if (!hasFrameworkNavigationSignals(navigationController, routingContract)) {
    return false;
  }
  if (!navigationController) {
    return false;
  }
  if (!to.startsWith('/') || to.startsWith('//')) {
    return false;
  }

  if (!routingContract || routingContract.basePath === '/') {
    return true;
  }

  const pathname = to.split(/[?#]/, 1)[0] ?? to;
  const { basePath } = routingContract;
  const inScope = pathname === basePath || pathname.startsWith(`${basePath}/`);
  return !inScope;
}
