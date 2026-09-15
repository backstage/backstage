/*
 * Copyright 2020 The Backstage Authors
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

import { useMemo } from 'react';
import { APP_ROOT_PATH, useAppHistoryLocation } from '@internal/frontend';
import { AnyRouteRefParams } from './types';
import { RouteRef } from './RouteRef';
import { SubRouteRef } from './SubRouteRef';
import { ExternalRouteRef } from './ExternalRouteRef';
import { RouteFunc, routeResolutionApiRef, useApi } from '../apis';
import { useApiHolder } from '../apis/system';
import { appHistoryApiRef } from './AppHistoryApi';
import { LocationContext, useRouterContext } from './reactRouterContext';

/**
 * The pathname a route ref is resolved relative to.
 *
 * The app history is the framework's sole location authority, and a framework
 * page is routerless — React Router's own `useLocation` throws there, so it
 * cannot be what this hook reads. Its `LocationContext` is read directly
 * instead of through its hooks, which is what keeps the old frontend system
 * answering while a routerless page degrades to the app root rather than
 * crashing.
 */
function useSourcePath(): string {
  const appHistory = useApiHolder().get(appHistoryApiRef);
  // Subscribes to the app history, so a route resolved against the current
  // page is recomputed when the app navigates.
  const appLocation = useAppHistoryLocation(appHistory);
  const routerLocation = useRouterContext(LocationContext)?.location;

  return (
    appLocation?.pathname ?? routerLocation?.pathname ?? APP_ROOT_PATH.pathname
  );
}

/**
 * React hook for constructing URLs to routes.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}
 *
 * @param routeRef - The ref to route that should be converted to URL.
 * @returns A function that will in turn return the concrete URL of the `routeRef`, or `undefined` if the route is not available.
 * @public
 */
export function useRouteRef<TParams extends AnyRouteRefParams>(
  routeRef:
    | RouteRef<TParams>
    | SubRouteRef<TParams>
    | ExternalRouteRef<TParams>,
): RouteFunc<TParams> | undefined {
  const sourcePath = useSourcePath();
  const routeResolutionApi = useApi(routeResolutionApiRef);

  const routeFunc = useMemo(
    () => routeResolutionApi.resolve(routeRef, { sourcePath }),
    [routeResolutionApi, routeRef, sourcePath],
  );

  return routeFunc;
}
