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

import { ReactNode, useEffect, useMemo, useRef } from 'react';
import {
  navigationControllerApiRef,
  useApi,
  type RoutingContract,
} from '@backstage/frontend-plugin-api';
import {
  createScopedRouter,
  type ScopedRouterResult,
} from '@backstage/plugin-react-router-v6-adapter';
import { configApiRef } from '@backstage/core-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { getBasePath } from '../../../../packages/frontend-app-api/src/routing/getBasePath';

/**
 * Root-level React Router v6 projection of the navigation controller.
 *
 * Residual: supplies RR context for chrome that still needs react-router APIs
 * (`useResolvedPath`, relative `Link` targets, OFS-compatible trees). History
 * authority remains the NavigationController — this never owns
 * `window.history` via push/replace.
 *
 * Prefer framework location/nav for new chrome (`useFrameworkLocation`,
 * `useChromePathname`, `RouteLink`, `useNavigateRouteRef`). Absolute /
 * cross-plugin `Link` targets escalate via the disposable NFS Link shim when
 * navigation-controller signals are present. Remove this projection once
 * remaining chrome no longer requires a root RR context.
 */
export function RootReactRouterV6(props: { children: ReactNode }) {
  const { children } = props;
  const configApi = useApi(configApiRef);
  const navigationController = useApi(navigationControllerApiRef);
  const appBasename = getBasePath(configApi);
  const scopedRouterRef = useRef<ScopedRouterResult | null>(null);

  const rootContract = useMemo<RoutingContract>(
    () => ({
      basePath: '/',
      location$: navigationController.location$,
      navigate: (to, opts) => navigationController.navigate(to, opts),
      go: delta => navigationController.go(delta),
      canGoBack: () => navigationController.canGoBack(),
      canGoForward: () => navigationController.canGoForward(),
      get historyLength() {
        return navigationController.historyLength;
      },
      getAdapterState: adapterId =>
        navigationController.getAdapterState(adapterId),
      block: blocker => navigationController.block(blocker),
    }),
    [navigationController],
  );

  const scopedRouter = useMemo(() => {
    scopedRouterRef.current?.dispose();
    const created = createScopedRouter(rootContract, {
      routePattern: '/',
      appBasename: appBasename || undefined,
    });
    scopedRouterRef.current = created;
    return created;
  }, [rootContract, appBasename]);

  useEffect(() => {
    return () => {
      scopedRouterRef.current?.dispose();
      scopedRouterRef.current = null;
    };
  }, [scopedRouter]);

  return <scopedRouter.Router>{children}</scopedRouter.Router>;
}
