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

import { BackstageRouteObject } from './types';
import { matchPath, routePriority } from './routePattern';

/** @internal */
export interface RouteRefMatch {
  routeObject: BackstageRouteObject;
  pathname: string;
  params: Record<string, string>;
}

/**
 * Matches a pathname against a tree of BackstageRouteObject route definitions.
 *
 * This is a framework-agnostic replacement for react-router's `matchRoutes`.
 * Returns an array of matches from root to most specific, or null if no match.
 *
 * Each match's `pathname` is the full accumulated path from root to that node,
 * matching react-router's `matchRoutes` behavior.
 *
 * Path compile / match / priority come from the shared {@link routePattern}
 * module also used by {@link RouteTable}.
 *
 * @internal
 */
export function matchRouteRefs(
  routes: BackstageRouteObject[],
  pathname: string,
): RouteRefMatch[] | null {
  const matches: RouteRefMatch[] = [];
  matchRouteBranch(routes, pathname, '', matches);
  return matches.length > 0 ? matches : null;
}

function joinPathSegments(base: string, segment: string): string {
  if (segment === '/') {
    return base || '/';
  }
  const joined = base + segment;
  return joined || '/';
}

function pushMatch(
  matches: RouteRefMatch[],
  route: BackstageRouteObject,
  parentPathname: string,
  matchedPathname: string,
  params: Record<string, string>,
): void {
  matches.push({
    routeObject: route,
    pathname: joinPathSegments(parentPathname, matchedPathname),
    params,
  });
}

function childRemainingPath(
  remainingPathname: string,
  matchedPathname: string,
): string {
  if (matchedPathname === '/') {
    return remainingPathname;
  }
  let childRemaining = remainingPathname.slice(matchedPathname.length);
  if (!childRemaining.startsWith('/')) {
    childRemaining = `/${childRemaining}`;
  }
  return childRemaining;
}

function matchLeafRoute(
  route: BackstageRouteObject,
  remainingPathname: string,
  parentPathname: string,
  matches: RouteRefMatch[],
): boolean {
  const result = matchPath(route.path, remainingPathname, true);
  if (!result) {
    return false;
  }
  pushMatch(
    matches,
    route,
    parentPathname,
    result.matchedPathname,
    result.params,
  );
  return true;
}

function matchParentRoute(
  route: BackstageRouteObject,
  remainingPathname: string,
  parentPathname: string,
  matches: RouteRefMatch[],
): boolean {
  const partialResult = matchPath(route.path, remainingPathname, false);
  if (!partialResult) {
    return false;
  }

  const savedLength = matches.length;
  const fullPathname = joinPathSegments(
    parentPathname,
    partialResult.matchedPathname,
  );
  matches.push({
    routeObject: route,
    pathname: fullPathname,
    params: partialResult.params,
  });

  if (
    matchRouteBranch(
      route.children!,
      childRemainingPath(remainingPathname, partialResult.matchedPathname),
      fullPathname,
      matches,
    )
  ) {
    return true;
  }

  // Children didn't match; check if this route itself is an exact match
  matches.length = savedLength;
  const exactResult = matchPath(route.path, remainingPathname, true);
  if (!exactResult) {
    return false;
  }
  pushMatch(
    matches,
    route,
    parentPathname,
    exactResult.matchedPathname,
    exactResult.params,
  );
  return true;
}

function matchRouteBranch(
  routes: BackstageRouteObject[],
  remainingPathname: string,
  parentPathname: string,
  matches: RouteRefMatch[],
): boolean {
  // Sort routes by specificity: most specific first, splat/empty last
  const sorted = [...routes].sort(
    (a, b) => routePriority(b.path) - routePriority(a.path),
  );

  for (const route of sorted) {
    const hasChildren = Boolean(route.children?.length);
    const matched = hasChildren
      ? matchParentRoute(route, remainingPathname, parentPathname, matches)
      : matchLeafRoute(route, remainingPathname, parentPathname, matches);
    if (matched) {
      return true;
    }
  }

  return false;
}
