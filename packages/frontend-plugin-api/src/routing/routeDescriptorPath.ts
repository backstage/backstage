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

/**
 * Library-agnostic path segment and normalization helpers for
 * {@link RouteDescriptor} paths.
 *
 * @remarks
 *
 * Page router adapters (React Router, TanStack Router, etc.) each project
 * `RouteDescriptor` paths into their own native route trees. These helpers
 * centralize how path segments are split, classified (param vs splat vs
 * literal), and joined, so every adapter derives the same splat/param
 * semantics from the same descriptor.
 *
 * @packageDocumentation
 */

/**
 * Splits a {@link RouteDescriptor} `path` into its `/`-delimited segments.
 * Returns an empty array for an undefined or empty path (e.g. index routes).
 *
 * @internal
 */
export function splitRouteDescriptorPath(path: string | undefined): string[] {
  return path ? path.split('/') : [];
}

/**
 * True when a single path segment is the splat / catch-all token (`*`).
 *
 * @internal
 */
export function isRouteDescriptorSplatSegment(segment: string): boolean {
  return segment === '*';
}

/**
 * True when a single path segment declares a path param (e.g. `:id`).
 *
 * @internal
 */
export function isRouteDescriptorParamSegment(segment: string): boolean {
  return segment.startsWith(':');
}

/**
 * Extracts the param name from a `:param` path segment.
 *
 * @internal
 */
export function getRouteDescriptorParamName(segment: string): string {
  return segment.substring(1);
}

/**
 * True when a {@link RouteDescriptor} `path` is a splat / catch-all route
 * (`*`, or a path whose last segment is `*`, e.g. `docs/*`).
 *
 * @internal
 */
export function isSplatRouteDescriptorPath(path: string | undefined): boolean {
  const segments = splitRouteDescriptorPath(path);
  const lastSegment = segments[segments.length - 1];
  return (
    lastSegment !== undefined && isRouteDescriptorSplatSegment(lastSegment)
  );
}

/**
 * Collects the param names declared by `:param` segments in a
 * {@link RouteDescriptor} `path`, in path order.
 *
 * @internal
 */
export function collectRouteDescriptorParams(
  path: string | undefined,
): string[] {
  return splitRouteDescriptorPath(path)
    .filter(isRouteDescriptorParamSegment)
    .map(getRouteDescriptorParamName);
}

/**
 * Joins a parent path (e.g. a `RoutingContract` `basePath` or
 * `routePattern`) with a relative sub-path (e.g. a {@link RouteDescriptor}
 * `path`), normalizing slashes so every caller derives the same nested path
 * regardless of the underlying router library.
 *
 * @internal
 */
function stripLeadingSlashes(path: string): string {
  let start = 0;
  while (start < path.length && path.charCodeAt(start) === 47 /* / */) {
    start += 1;
  }
  return start === 0 ? path : path.slice(start);
}

function stripTrailingSlashes(path: string): string {
  if (path === '/' || path.length === 0) {
    return path;
  }
  let end = path.length;
  while (end > 0 && path.charCodeAt(end - 1) === 47 /* / */) {
    end -= 1;
  }
  return end === path.length ? path : path.slice(0, end);
}

export function joinRouteDescriptorPaths(
  parentPath: string,
  subPath: string,
): string {
  const normalizedSub = stripTrailingSlashes(stripLeadingSlashes(subPath));
  if (!normalizedSub) {
    return parentPath === '/' ? '/' : stripTrailingSlashes(parentPath);
  }
  if (parentPath === '/') {
    return `/${normalizedSub}`;
  }
  return `${stripTrailingSlashes(parentPath)}/${normalizedSub}`;
}
