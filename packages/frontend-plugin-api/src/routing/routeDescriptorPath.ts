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
 * @public
 */
export function splitRouteDescriptorPath(path: string | undefined): string[] {
  return path ? path.split('/') : [];
}

/**
 * True when a single path segment is the splat / catch-all token (`*`).
 *
 * @public
 */
export function isRouteDescriptorSplatSegment(segment: string): boolean {
  return segment === '*';
}

/**
 * True when a single path segment declares a path param (e.g. `:id`).
 *
 * @public
 */
export function isRouteDescriptorParamSegment(segment: string): boolean {
  return segment.startsWith(':');
}

/**
 * Extracts the param name from a `:param` path segment.
 *
 * @public
 */
export function getRouteDescriptorParamName(segment: string): string {
  return segment.substring(1);
}

/**
 * True when a {@link RouteDescriptor} `path` is a splat / catch-all route
 * (`*`, or a path whose last segment is `*`, e.g. `docs/*`).
 *
 * @public
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
 * @public
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
 * @public
 */
export function joinRouteDescriptorPaths(
  parentPath: string,
  subPath: string,
): string {
  const normalizedSub = subPath.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!normalizedSub) {
    return parentPath === '/' ? '/' : parentPath.replace(/\/$/, '');
  }
  if (parentPath === '/') {
    return `/${normalizedSub}`;
  }
  return `${parentPath.replace(/\/$/, '')}/${normalizedSub}`;
}
