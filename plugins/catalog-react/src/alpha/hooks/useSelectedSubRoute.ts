/*
 * Copyright 2025 The Backstage Authors
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

import { JSX, useMemo } from 'react';
import { SubRoute } from '../types';
import { matchRoutes, useParams, useRoutes } from 'react-router-dom';

// Normalize a route path so it can be matched correctly:
//   - strip leading slashes
//   - if the path already ends with a `*`, keep it as-is so explicit wildcards
//     like `/*` or `/foo/*` aren't double-suffixed into `*/*` / `foo/*/*`
//   - otherwise strip trailing slashes and append `/*` for nested matching;
//     a bare `/` collapses to the empty string so it acts as an index route
//     rather than a wildcard that would swallow every sub-path
function normalizeRoutePath(path: string): string {
  const withoutLeading = path.replace(/^\/+/, '');
  if (withoutLeading.endsWith('*')) {
    return withoutLeading;
  }
  const trimmed = withoutLeading.replace(/\/+$/, '');
  return trimmed ? `${trimmed}/*` : '';
}

/** @alpha */
export function useSelectedSubRoute(subRoutes: SubRoute[]): {
  index: number;
  route?: SubRoute;
  element?: JSX.Element;
} {
  const params = useParams();

  const routes = useMemo(
    () =>
      subRoutes.map(({ path, children }) => ({
        caseSensitive: false,
        path: normalizeRoutePath(path),
        element: children,
      })),
    [subRoutes],
  );

  const element = useRoutes(routes) ?? undefined;

  let currentRoute = params['*'] ?? '';
  if (!currentRoute.startsWith('/')) {
    currentRoute = `/${currentRoute}`;
  }

  const [matchedRoute] = matchRoutes(routes, currentRoute) ?? [];
  const foundIndex = matchedRoute
    ? routes.findIndex(r => r.path === matchedRoute.route.path)
    : -1;

  return {
    index: foundIndex,
    element,
    route: subRoutes[foundIndex],
  };
}
