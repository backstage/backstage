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
  matchPath,
  routePriority,
} from '@internal/frontend';
import { BackstageRouteObject } from './types';

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
 * Path compile / match / priority come from the shared `routePattern` module
 * in `@internal/frontend`, which {@link RouteTable} also uses.
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
  // The base may already end in a slash and the segment may already start with
  // one; normalize both so joining never produces a `//`.
  const trimmedBase = base.replace(/\/$/, '');
  const prefixedSegment = segment.startsWith('/') ? segment : `/${segment}`;
  return `${trimmedBase}${prefixedSegment}`;
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
  pathnameBase: string,
): string {
  if (pathnameBase === '/') {
    return remainingPathname;
  }
  let childRemaining = remainingPathname.slice(pathnameBase.length);
  if (!childRemaining.startsWith('/')) {
    childRemaining = `/${childRemaining}`;
  }
  return childRemaining;
}

function matchLeafRoute(
  route: BackstageRouteObject,
  concretePath: string,
  remainingPathname: string,
  parentPathname: string,
  matches: RouteRefMatch[],
): boolean {
  const result = matchPath(
    concretePath,
    remainingPathname,
    true,
    route.caseSensitive,
  );
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
  concretePath: string,
  remainingPathname: string,
  parentPathname: string,
  matches: RouteRefMatch[],
): boolean {
  const partialResult = matchPath(
    concretePath,
    remainingPathname,
    false,
    route.caseSensitive,
  );
  if (!partialResult) {
    return false;
  }

  const savedLength = matches.length;
  matches.push({
    routeObject: route,
    pathname: joinPathSegments(parentPathname, partialResult.matchedPathname),
    params: partialResult.params,
  });

  // Children continue from the base rather than from the whole match, so a
  // splat parent hands its tail down to them instead of consuming it.
  const childParentPathname = joinPathSegments(
    parentPathname,
    partialResult.pathnameBase,
  );

  if (
    matchRouteBranch(
      route.children!,
      childRemainingPath(remainingPathname, partialResult.pathnameBase),
      childParentPathname,
      matches,
    )
  ) {
    return true;
  }

  // Children didn't match; check if this route itself is an exact match
  matches.length = savedLength;
  const exactResult = matchPath(
    concretePath,
    remainingPathname,
    true,
    route.caseSensitive,
  );
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
  // Optional segments describe several concrete route branches. Rank the
  // branch that actually matches rather than crediting an omitted segment to
  // the route as written; stable sorting keeps registration order as the tie
  // breaker, matching react-router's sibling-route behavior.
  const sorted = routes
    .flatMap(route =>
      expandOptionalSegments(route.path).map(concretePath => ({
        route,
        concretePath,
      })),
    )
    .sort(
      (a, b) => routePriority(b.concretePath) - routePriority(a.concretePath),
    );

  for (const { route, concretePath } of sorted) {
    const hasChildren = Boolean(route.children?.length);
    const matched = hasChildren
      ? matchParentRoute(
          route,
          concretePath,
          remainingPathname,
          parentPathname,
          matches,
        )
      : matchLeafRoute(
          route,
          concretePath,
          remainingPathname,
          parentPathname,
          matches,
        );
    if (matched) {
      return true;
    }
  }

  return false;
}
