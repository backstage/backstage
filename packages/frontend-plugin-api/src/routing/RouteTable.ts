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

import { compilePath, routePriority } from './routePattern';

/**
 * Result of matching a pathname against a {@link RouteTable}.
 *
 * @public
 */
export interface RouteTableMatch {
  /**
   * The registered route pattern. Use this as the page map key.
   */
  path: string;
  /**
   * Concrete matched URL prefix for the page's {@link PageMount}. For a
   * pattern like `/catalog/:namespace/:kind/:name` matching
   * `/catalog/default/component/foo/overview`, this is
   * `/catalog/default/component/foo`.
   */
  basePath: string;
}

type CompiledRoute = {
  path: string;
  priority: number;
  matcher?: RegExp;
};

/**
 * Provides URL matching for top-level page routing.
 *
 * Routes are sorted by specificity (static segments over params over splats).
 * The root path `/` acts as a catch-all.
 *
 * {@link RouteTable.match} returns both the registered pattern (for page
 * lookup) and a concrete `basePath` (the matched URL prefix) for the page's
 * {@link PageMount}.
 *
 * @public
 */
export class RouteTable {
  private readonly paths: CompiledRoute[];

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
      .map(path => ({
        path,
        priority: routePriority(path),
        matcher: path === '/' ? undefined : compilePath(path, false).regexp,
      }))
      .sort((a, b) => b.priority - a.priority || b.path.length - a.path.length);
  }

  /**
   * Matches `pathname` against registered paths and returns the best match.
   */
  match(pathname: string): RouteTableMatch | undefined {
    const matched = this.paths.find(({ path, matcher }) =>
      path === '/'
        ? true // root catches everything
        : matcher?.test(pathname),
    );

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

    if (matched.path === '/') {
      return { path: '/', basePath: '/' };
    }

    const matchResult = matched.matcher!.exec(pathname);
    const matchedPrefix = matchResult?.[0]?.replace(/\/$/, '') || matched.path;

    return {
      path: matched.path,
      basePath: matchedPrefix,
    };
  }
}
