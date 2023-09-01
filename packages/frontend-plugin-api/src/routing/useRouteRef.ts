/*
 * Copyright 2023 The Backstage Authors
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

import { RouteRef } from '@backstage/core-plugin-api';
// eslint-disable-next-line @backstage/no-forbidden-package-imports
import { RoutingContext } from '@backstage/frontend-app-api/src/routing/RoutingContext';
import { useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function useRouteRef(routeRef: RouteRef<any>): () => string {
  const { pathname } = useLocation();
  const resolver = useContext(RoutingContext);

  const routeFunc = useMemo(
    () => resolver && resolver.resolve(routeRef, { pathname }),
    [resolver, routeRef, pathname],
  );

  if (!routeFunc) {
    throw new Error(`Failed to resolve routeRef ${routeRef}`);
  }

  return routeFunc;
}
