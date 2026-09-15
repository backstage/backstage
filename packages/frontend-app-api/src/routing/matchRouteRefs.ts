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
  expandOptionalSegments,
  joinRoutePath,
  matchPath,
  routePriority,
} from '@internal/frontend';
import { BackstageRouteObject } from './types';

/** @internal */
export interface RouteRefMatch {
  routeObject: BackstageRouteObject;
  pathname: string;
  pathnameBase: string;
  routePattern: string;
  params: Record<string, string>;
}

type Branch = {
  routes: Array<{ route: BackstageRouteObject; path: string; pattern: string }>;
  priority: number;
};

const compiledTrees = new WeakMap<BackstageRouteObject[], Branch[]>();

function compileBranches(routes: BackstageRouteObject[]): Branch[] {
  const cached = compiledTrees.get(routes);
  if (cached) {
    return cached;
  }
  const branches: Branch[] = [];
  function visit(children: BackstageRouteObject[], parents: Branch['routes']) {
    for (const route of children) {
      for (const path of expandOptionalSegments(route.path)) {
        const pattern = joinRoutePath(parents.at(-1)?.pattern ?? '', path);
        const chain = [...parents, { route, path, pattern }];
        // Children precede their parent when scores tie, including empty paths.
        if (route.children) {
          visit(route.children, chain);
        }
        branches.push({ routes: chain, priority: routePriority(pattern) });
      }
    }
  }
  visit(routes, []);
  branches.sort((a, b) => b.priority - a.priority);
  compiledTrees.set(routes, branches);
  return branches;
}

/**
 * Matches complete branches of the existing extension route tree. Rendering,
 * route refs and route tracking all use this ordering and node identity.
 * @internal
 */
export function matchRouteRefs(
  routes: BackstageRouteObject[],
  pathname: string,
): RouteRefMatch[] | null {
  for (const branch of compileBranches(routes)) {
    const matches: RouteRefMatch[] = [];
    let base = '/';
    const params: Record<string, string> = {};
    for (const [index, { route, path }] of branch.routes.entries()) {
      const remaining =
        base === '/' ? pathname : pathname.slice(base.length) || '/';
      const match = matchPath(
        path,
        remaining,
        index === branch.routes.length - 1,
        route.caseSensitive,
      );
      if (!match) {
        break;
      }
      Object.assign(params, match.params);
      const pathnameBase =
        joinRoutePath(base, match.pathnameBase).replace(/\/$/, '') || '/';
      matches.push({
        routeObject: route,
        pathname:
          joinRoutePath(base, match.matchedPathname).replace(/\/$/, '') || '/',
        pathnameBase,
        routePattern: joinRoutePath(
          matches.at(-1)?.routePattern ?? '',
          route.path,
        ),
        params: { ...params },
      });
      base = pathnameBase;
    }
    if (matches.length === branch.routes.length) {
      return matches;
    }
  }
  return null;
}
