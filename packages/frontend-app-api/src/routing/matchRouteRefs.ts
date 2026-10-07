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
  routes: Array<{
    route: BackstageRouteObject;
    path: string;
    pattern: string;
    routePattern: string;
  }>;
  priority: number;
};

function compileBranches(routes: BackstageRouteObject[]): Branch[] {
  const branches: Branch[] = [];
  function visit(children: BackstageRouteObject[], parents: Branch['routes']) {
    for (const route of children) {
      for (const path of expandOptionalSegments(route.path)) {
        const pattern = joinRoutePath(parents.at(-1)?.pattern ?? '', path);
        const routePattern = joinRoutePath(
          parents.at(-1)?.routePattern ?? '',
          route.path,
        );
        const chain = [...parents, { route, path, pattern, routePattern }];
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
  return branches;
}

const matchers = new WeakMap<
  BackstageRouteObject[],
  (pathname: string) => RouteRefMatch[] | null
>();

/** Compiles a route tree once and shares its latest pathname match across consumers. */
export function createRouteMatcher(
  routes: BackstageRouteObject[],
): (pathname: string) => RouteRefMatch[] | null {
  let matcher = matchers.get(routes);
  if (!matcher) {
    const branches = compileBranches(routes);
    let lastPathname: string | undefined;
    let lastMatches: RouteRefMatch[] | null = null;
    matcher = pathname => {
      if (pathname !== lastPathname) {
        lastMatches = matchBranches(branches, pathname);
        lastPathname = pathname;
      }
      return lastMatches;
    };
    matchers.set(routes, matcher);
  }
  return matcher;
}

/** Matches the selected branch for rendering, route refs, and route tracking. */
export function matchRouteRefs(
  routes: BackstageRouteObject[],
  pathname: string,
): RouteRefMatch[] | null {
  return createRouteMatcher(routes)(pathname);
}

/**
 * Matches complete branches of the existing extension route tree. Rendering,
 * route refs and route tracking all use this ordering and node identity.
 * @internal
 */
function matchBranches(
  branches: Branch[],
  pathname: string,
): RouteRefMatch[] | null {
  for (const branch of branches) {
    const matches: RouteRefMatch[] = [];
    let base = '/';
    const params: Record<string, string> = {};
    for (const [
      index,
      { route, path, routePattern },
    ] of branch.routes.entries()) {
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
        routePattern,
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
