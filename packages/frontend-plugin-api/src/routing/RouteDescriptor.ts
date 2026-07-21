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

import { ComponentType, createElement, JSX } from 'react';
import { IconElement } from '../icons/types';
import {
  collectRouteDescriptorParams,
  isSplatRouteDescriptorPath,
} from './routeDescriptorPath';

// Should match the pattern in SubRouteRef / react-router
const PARAM_PATTERN = /^\w+$/;

/**
 * Lazy element factory for a {@link RouteDescriptor}, matching the
 * PageBlueprint `loader` shape.
 *
 * @public
 */
export type RouteDescriptorLoader = () => Promise<JSX.Element>;

/**
 * Library-agnostic description of an in-page route.
 *
 * @remarks
 *
 * Route descriptors declare path segments, params, index/splat routes, nested
 * children, and lazy elements without depending on react-router or TanStack
 * types. Page and router adapters compile these into their native route trees.
 *
 * Paths are relative to the parent page (or parent descriptor) and must not
 * start with `/`. Use `index: true` for an index route, `:param` segments for
 * path params, and a trailing `*` (or `*` alone) for a splat/catch-all.
 *
 * Provide either a `loader` or a `component` for the route element.
 *
 * This is a fluid multi-adapter compile seam and may change without a major
 * version bump while marked `@public`.
 *
 * @public
 */
export interface RouteDescriptor {
  readonly $$type: '@backstage/RouteDescriptor';

  /**
   * Optional stable id for debugging and adapter keys.
   */
  readonly id?: string;

  /**
   * Relative path segment. Omit (or leave undefined) when `index` is true.
   *
   * @example 'overview', 'entities/:id', 'docs/*', '*'
   */
  readonly path?: string;

  /**
   * When true, matches the parent path exactly (index route).
   */
  readonly index: boolean;

  /**
   * True when the path is a splat / catch-all (`*` or ends with `/*`).
   */
  readonly splat: boolean;

  /**
   * Param names inferred from `:param` segments in `path`.
   */
  readonly params: readonly string[];

  /**
   * Optional title for framework tab composition.
   */
  readonly title?: string;

  /**
   * Optional icon for framework tab composition.
   */
  readonly icon?: IconElement;

  /**
   * Lazy element loader for this route.
   */
  readonly loader?: RouteDescriptorLoader;

  /**
   * React component type for this route (alternative to `loader`).
   */
  readonly component?: ComponentType<{}>;

  /**
   * Nested child routes.
   */
  readonly children: readonly RouteDescriptor[];
}

/**
 * Options for {@link createRouteDescriptor}.
 *
 * @public
 */
export interface CreateRouteDescriptorOptions {
  /**
   * Optional stable id for debugging and adapter keys.
   */
  id?: string;

  /**
   * Relative path segment. Must not start with `/`. Omit when `index` is true.
   */
  path?: string;

  /**
   * When true, matches the parent path exactly (index route).
   */
  index?: boolean;

  /**
   * Optional title for framework tab composition.
   */
  title?: string;

  /**
   * Optional icon for framework tab composition.
   */
  icon?: IconElement;

  /**
   * Lazy element loader for this route.
   */
  loader?: RouteDescriptorLoader;

  /**
   * React component type for this route (alternative to `loader`).
   */
  component?: ComponentType<{}>;

  /**
   * Nested child routes.
   */
  children?: readonly RouteDescriptor[];
}

function validatePath(path: string): void {
  if (path.startsWith('/')) {
    throw new Error(
      `RouteDescriptor path must not start with '/', got '${path}'`,
    );
  }
  if (path.endsWith('/')) {
    throw new Error(
      `RouteDescriptor path must not end with '/', got '${path}'`,
    );
  }
  for (const param of collectRouteDescriptorParams(path)) {
    if (!PARAM_PATTERN.test(param)) {
      throw new Error(`RouteDescriptor path has invalid param, got '${param}'`);
    }
  }
}

/**
 * Create a library-agnostic {@link RouteDescriptor} for in-page routing.
 *
 * @param options - Description of the route to create.
 * @public
 *
 * @example
 * ```tsx
 * const catalogRoutes = createRouteDescriptor({
 *   path: 'entities/:id',
 *   loader: () => import('./EntityPage').then(m => <m.EntityPage />),
 *   children: [
 *     createRouteDescriptor({
 *       index: true,
 *       loader: () => Promise.resolve(<Overview />),
 *     }),
 *     createRouteDescriptor({
 *       path: 'docs/*',
 *       loader: () => Promise.resolve(<Docs />),
 *     }),
 *   ],
 * });
 * ```
 */
export function createRouteDescriptor(
  options: CreateRouteDescriptorOptions = {},
): RouteDescriptor {
  const {
    id,
    path,
    index = false,
    title,
    icon,
    loader,
    component,
    children = [],
  } = options;

  if (index && path !== undefined && path !== '') {
    throw new Error('RouteDescriptor index route must not set a path');
  }

  if (path !== undefined && path !== '') {
    validatePath(path);
  }

  const resolvedPath = index || path === '' ? undefined : path;

  return {
    $$type: '@backstage/RouteDescriptor',
    id,
    path: resolvedPath,
    index,
    splat: isSplatRouteDescriptorPath(resolvedPath),
    params: collectRouteDescriptorParams(resolvedPath),
    title,
    icon,
    loader,
    component,
    children,
  };
}

/**
 * Resolves a descriptor's element to a lazy loader (from `loader` or `component`).
 *
 * Used by page router adapters when compiling {@link RouteDescriptor} trees.
 *
 * @internal
 */
export function resolveRouteDescriptorLoader(
  descriptor: RouteDescriptor,
): RouteDescriptorLoader | undefined {
  if (descriptor.loader) {
    return descriptor.loader;
  }
  if (descriptor.component) {
    const Component = descriptor.component;
    return async () => createElement(Component);
  }
  return undefined;
}
