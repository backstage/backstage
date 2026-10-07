/*
 * Copyright 2024 The Backstage Authors
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

import { createApiRef } from '../system';
import {
  AnyRouteRefParams,
  RouteRef,
  SubRouteRef,
  ExternalRouteRef,
} from '../../routing';
import type { AppNode } from './AppTreeApi';

/**
 * TS magic for handling route parameters.
 *
 * @remarks
 *
 * The extra TS magic here is to require a single params argument if the RouteRef
 * had at least one param defined, but require 0 arguments if there are no params defined.
 * Without this we'd have to pass in empty object to all parameter-less RouteRefs
 * just to make TypeScript happy, or we would have to make the argument optional in
 * which case you might forget to pass it in when it is actually required.
 *
 * @public
 */
export type RouteFunc<TParams extends AnyRouteRefParams> = (
  ...[params]: TParams extends undefined
    ? readonly []
    : readonly [params: TParams]
) => string;

/**
 * A route-bearing app node matched against a pathname.
 *
 * @public
 */
export interface RouteResolutionMatch {
  /** The extension that declares this route. */
  node: AppNode;
  /** Matched app-relative URL prefix, excluding the splat tail. */
  basePath: string;
  /** Accumulated route pattern, retaining optional segments and splats. */
  routePattern: string;
  /** Decoded parameters contributed by this route and its ancestors. */
  params: Record<string, string>;
  /** Whether this route declares a non-empty path, even if optional segments are omitted. */
  contributesPath: boolean;
}

/**
 * @public
 */
export interface RouteResolutionApi {
  /**
   * Resolves an authored target against the given node's route ancestry.
   * Each leading `..` climbs one path-contributing route. Query-only and
   * hash-only targets use `pathname`. Without a node, targets use app-root scope.
   * Returns an app-absolute path, excluding the deployment basename, or an
   * external URL unchanged. Use AppHistoryApi.createHref to sanitize and
   * format the result for the browser.
   */
  resolveTarget(options: {
    to: string;
    pathname: string;
    node?: AppNode;
  }): string;

  /**
   * Matches an app-relative pathname against the app's route tree.
   *
   * Matches are ordered from outermost to innermost. When a node is supplied,
   * only matches belonging to that node or its app-tree ancestors are returned.
   * Nodes without a route inherit their ancestors' routing scope. An unmatched
   * pathname returns an empty array of matches.
   *
   * The pathname excludes the deployment basename. It can differ from the
   * current browser location, allowing adapters to resolve navigation before
   * React renders the destination.
   */
  resolvePath(options: { pathname: string; node?: AppNode }): {
    matches: readonly RouteResolutionMatch[];
  };

  resolve<TParams extends AnyRouteRefParams>(
    anyRouteRef:
      | RouteRef<TParams>
      | SubRouteRef<TParams>
      | ExternalRouteRef<TParams>,
    options?: {
      /**
       * An absolute path to use as a starting point when resolving the route.
       * If no path is provided the route will be resolved from the root of the app.
       */
      sourcePath?: string;
    },
  ): RouteFunc<TParams> | undefined;
}

/**
 * The `ApiRef` of {@link RouteResolutionApi}.
 *
 * @public
 */
export const routeResolutionApiRef = createApiRef<RouteResolutionApi>().with({
  id: 'core.route-resolution',
  pluginId: 'app',
});
