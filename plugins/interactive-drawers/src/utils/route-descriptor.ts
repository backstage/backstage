/*
 * Copyright 2022 The Backstage Authors
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

import { RouteDescriptor, RoutePart } from '@backstage/core-plugin-api';

/**
 * @public
 */
export interface RoutePartWithParams<Complete extends boolean = boolean>
  extends RoutePart<Complete> {
  params: Record<string, string>;
}

function trimSlashes(path: string): string {
  return path.replace(/^\/+/, '').replace(/\/+$/, '');
}

function routeDescriptorMatch(
  url: string,
  routeDescriptor: RouteDescriptor<boolean>,
): RegExpMatchArray | null {
  if (routeDescriptor.matchUrl === undefined) return null;

  try {
    const { pathname } = new URL(url, window.origin);

    return trimSlashes(pathname).match(`${routeDescriptor.matchUrl}$`);
  } catch (_e) {
    return null;
  }
}

/**
 * Check if a route descriptor matches a url
 *
 * @param url String to test against
 * @param routeDescriptor Route descriptor object
 * @returns boolean
 * @public
 */
export function matchRouteDescriptor(
  url: string,
  routeDescriptor: RouteDescriptor,
) {
  return !!routeDescriptorMatch(url, routeDescriptor);
}

/**
 * Parse a url and a route descriptor parameters, if they match
 *
 * @param url String to test against
 * @param routeDescriptor Route descriptor object
 * @returns A {@link RoutePartWithParams} array
 * @public
 */
export function matchAndParseRouteDescriptor<Complete extends boolean>(
  url: string,
  routeDescriptor: RouteDescriptor<Complete>,
): undefined | RoutePartWithParams<Complete>[] {
  const m = routeDescriptorMatch(url, routeDescriptor);
  if (!m) return undefined;
  m.shift();

  const numParams = routeDescriptor.parts.reduce(
    (prev, cur) => prev + cur.routeRef.params.length,
    0,
  );

  if (m.length !== numParams) return undefined;

  const partsWithParams: RoutePartWithParams[] = routeDescriptor.parts.map(
    part => ({
      ...part,
      params: Object.fromEntries(
        part.routeRef.params.map(paramKey => [paramKey, m.shift()!]),
      ),
    }),
  );
  return partsWithParams;
}

/**
 * Create a url from a route descriptor and the route descriptor parts with its
 * parameters provided.
 *
 * @internal
 * @returns string url
 */
export function constructUrl(parts: RoutePartWithParams<true>[]): string {
  return parts
    .map(part => constructUrlPart(part))
    .join('/')
    .replace(/\/+/g, '/');
}

function constructUrlPart(part: RoutePartWithParams<true>) {
  return (
    Object.entries(part.params)
      // Sort by longest parameter name first (replace those before the shorter
      // to replace e.g. ':foobar' before ':foo')
      .sort(([a], [b]) => b.length - a.length)
      .reduce(
        (prev, [name, value]) => prev.replaceAll(`:${name}`, value),
        part.segment,
      )
  );
}
