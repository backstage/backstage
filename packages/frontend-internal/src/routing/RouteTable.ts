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

import { matchPath, routePriority } from './routePattern';

/**
 * Result of matching a pathname against a {@link RouteTable}.
 */
export interface RouteTableMatch {
  /**
   * The registered route pattern. Use this as the page map key.
   */
  path: string;
  /**
   * Concrete matched URL prefix for the page's `PageMount`. For a
   * pattern like `/catalog/:namespace/:kind/:name` matching
   * `/catalog/default/component/foo/overview`, this is
   * `/catalog/default/component/foo`.
   */
  basePath: string;
}

type RankedRoute = {
  path: string;
  priority: number;
};

/**
 * Provides URL matching for top-level page routing.
 *
 * Routes are sorted by specificity (static segments over params over splats)
 * and then matched as path prefixes. The root path `/` acts as a catch-all.
 *
 * {@link RouteTable.match} returns both the registered pattern (for page
 * lookup) and a concrete `basePath` (the matched URL prefix) for the page's
 * `PageMount`.
 */
export class RouteTable {
  private readonly paths: RankedRoute[];

  /**
   * Creates a route table from the given registered page base paths.
   *
   * Duplicate paths warn and keep the first registration.
   */
  constructor(basePaths: string[]) {
    const seen = new Set<string>();
    for (const path of basePaths) {
      if (seen.has(path)) {
        // eslint-disable-next-line no-console
        console.warn(
          `[RouteTable] Duplicate base path "${path}" registered. ` +
            `Only one plugin should claim each base path. The first registration wins.`,
        );
      }
      seen.add(path);
    }
    // Deduplicate — first registration wins (order preserved before sort)
    this.paths = [...new Set(basePaths)]
      .map(path => ({ path, priority: routePriority(path) }))
      .sort((a, b) => b.priority - a.priority || b.path.length - a.path.length);
  }

  /**
   * Matches `pathname` against registered paths and returns the best match.
   */
  match(pathname: string): RouteTableMatch | undefined {
    let matched: RouteTableMatch | undefined;
    for (const { path } of this.paths) {
      // A prefix match of `/` matches everything, so the root is the catch-all
      // without needing to be special cased here.
      const result = matchPath(path, pathname, false);
      if (result) {
        matched = { path, basePath: result.matchedPathname };
        break;
      }
    }

    if (!matched) {
      return undefined;
    }

    if (
      process.env.NODE_ENV !== 'production' &&
      matched.path === '/' &&
      pathname !== '/' &&
      pathname.split('/').filter(Boolean).length > 1
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        `[RouteTable] Pathname "${pathname}" fell through to the root "/" catch-all. This may indicate a missing route registration. Registered paths: ${this.paths
          .map(p => p.path)
          .join(', ')}`,
      );
    }

    return matched;
  }
}
