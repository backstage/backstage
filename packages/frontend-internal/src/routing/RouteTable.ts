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

import { matchPath, routePriority, trimTrailingSlash } from './routePattern';

/**
 * A page to register in a {@link RouteTable}, together with the sub-pages it
 * declares.
 */
export interface RouteTableEntry {
  /** The page's registered route pattern. */
  path: string;
  /**
   * Sub-page paths exactly as their authors wrote them (e.g. `overview`), in
   * registration order.
   *
   * Each becomes an ordinary route one level below the page and is ranked
   * alongside every other route, so nothing above a sub-page has to know that
   * sub-pages exist. A path that names something other than a descendant of
   * the page, or one whose route another page already claims, is warned about
   * and left unrouted.
   */
  subPaths?: readonly string[];
}

/**
 * The sub-page half of a {@link RouteTableMatch}.
 */
export interface RouteTableSubPageMatch {
  /** The sub-page path exactly as registered, e.g. `overview`. */
  path: string;
  /**
   * The sub-page's own route pattern, i.e. the page's pattern with the
   * sub-page path appended (e.g. `/catalog/:namespace/:kind/:name/overview`).
   */
  routePattern: string;
  /**
   * Concrete matched URL prefix for the sub-page's own `PageMount` (e.g.
   * `/catalog/default/component/foo/overview`).
   *
   * Having it fall out of the match is what makes a relative target inside a
   * sub-page resolve against the sub-page: an adapter scoped to this base
   * resolves `../detail` to the page above it, with no extra mechanism.
   */
  basePath: string;
}

/**
 * Result of matching a pathname against a {@link RouteTable}.
 *
 * A match is a chain: the page, and then the sub-page of that page the
 * location selects, if any.
 */
export interface RouteTableMatch {
  /**
   * The registered route pattern of the page. Use this as the page map key.
   */
  path: string;
  /**
   * Concrete matched URL prefix for the page's `PageMount`. For a
   * pattern like `/catalog/:namespace/:kind/:name` matching
   * `/catalog/default/component/foo/overview`, this is
   * `/catalog/default/component/foo`.
   *
   * A splat pattern mounts at the prefix before the splat, so `/docs/*`
   * matching `/docs/a/b` gives `/docs` — the tail belongs to the page, not to
   * its base.
   */
  basePath: string;
  /**
   * The sub-page this location selects, absent when the page declares none or
   * when the location selects none of them.
   */
  subPage?: RouteTableSubPageMatch;
  /**
   * Where a location that landed on the root of a page with sub-pages should
   * go instead: the concrete path of that page's first sub-page.
   *
   * Only ever set for a page that declares sub-pages and only at that page's
   * own root, so a page without sub-pages is never redirected.
   */
  indexRedirect?: string;
}

type RankedRoute = {
  /** The pattern matched against the pathname. */
  path: string;
  priority: number;
  /** The page this route belongs to, which is `path` itself for a page route. */
  pagePath: string;
  /** The sub-page path exactly as registered, for a sub-page route. */
  subPath?: string;
  /**
   * The path below the page of its first routed sub-page, for a page route
   * that has any — what the page root redirects to.
   */
  indexSubPath?: string;
};

/**
 * Appends a path below another, dropping a trailing splat: the splat is how a
 * page says "the rest of the path is mine", and a sub-page registered below it
 * claims a piece of exactly that rest.
 */
function joinRoutePath(parent: string, child: string): string {
  const base = parent.replace(/\/\*$/, '').replace(/\/+$/, '');
  return `${base}/${child.replace(/^\/+/, '')}`;
}

/** Appends a concrete path segment to a concrete base path. */
function joinBasePath(base: string, child: string): string {
  return base === '/' ? `/${child}` : `${base}/${child}`;
}

function warn(message: string): void {
  // eslint-disable-next-line no-console
  console.warn(`[RouteTable] ${message}`);
}

/**
 * The form of a sub-page path that routes are built from: the segments below
 * the page, with leading, trailing and repeated separators dropped.
 *
 * Empty when the path names the page itself rather than anything below it
 * (`''`, `'/'`), and `undefined` when it does not describe a descendant at all
 * — a `.` or `..` segment builds a literal route no location ever matches,
 * since a browser resolves those away before the app sees them.
 */
function normalizeSubPath(subPath: string): string | undefined {
  const segments = subPath.split('/').filter(Boolean);
  if (segments.some(segment => segment === '.' || segment === '..')) {
    return undefined;
  }
  return segments.join('/');
}

/**
 * Provides URL matching for page routing.
 *
 * Routes are sorted by specificity (static segments over params over splats)
 * and then matched as path prefixes. Equally specific patterns are tried in
 * registration order. The root path `/` acts as a catch-all.
 *
 * A page's sub-pages are registered as ordinary routes one level below it and
 * ranked with everything else, so a sub-page is not a special kind of route —
 * it is simply a route whose match also names the page it belongs to.
 *
 * {@link RouteTable.match} returns the registered page pattern (for page
 * lookup), a concrete `basePath` (the matched URL prefix) for the page's
 * `PageMount`, and the sub-page of that page the location selects.
 */
export class RouteTable {
  private readonly paths: RankedRoute[];

  /**
   * Creates a route table from the given registered pages.
   *
   * A page may be given as a plain path, or as an entry naming the sub-pages
   * it declares. Duplicate page paths warn and keep the first registration.
   *
   * A sub-page route that would land on a path a page already claims, or that
   * another page's sub-page already claims, warns and is dropped rather than
   * shadowing it — see the constructor body for why the page wins.
   */
  constructor(pages: ReadonlyArray<string | RouteTableEntry>) {
    const entries: RouteTableEntry[] = [];
    const seen = new Set<string>();
    for (const page of pages) {
      const entry = typeof page === 'string' ? { path: page } : page;
      if (seen.has(entry.path)) {
        warn(
          `Duplicate base path "${entry.path}" registered. ` +
            `Only one plugin should claim each base path. The first registration wins.`,
        );
        // Deduplicate — first registration wins (order preserved before sort)
        continue;
      }
      seen.add(entry.path);
      entries.push(entry);
    }

    // Every page path is known before the first sub-page route is built, so
    // that a page always keeps a path a sub-page route would otherwise have
    // taken — whichever order the two were registered in. A page is a claim its
    // author made on a URL, while a sub-page route is generated one level below
    // somebody else's page, and letting load order decide between them would
    // make a page reachable or unreachable depending on which plugin loaded
    // first.
    const pagePaths = new Set(entries.map(entry => entry.path));
    const claimedSubPageRoutes = new Set<string>();

    const ranked: RankedRoute[] = [];
    for (const entry of entries) {
      const subRoutes: { path: string; subPath: string; indexPath: string }[] =
        [];
      const seenSubPaths = new Set<string>();
      for (const subPath of entry.subPaths ?? []) {
        const normalized = normalizeSubPath(subPath);
        if (normalized === undefined) {
          warn(
            `Sub-page path "${subPath}" of page "${entry.path}" does not ` +
              `name a path below that page, and was ignored.`,
          );
          continue;
        }
        // An empty sub-page path would register the page's own pattern a second
        // time and make the index redirect point back at itself.
        if (normalized === '' || seenSubPaths.has(normalized)) {
          continue;
        }
        seenSubPaths.add(normalized);
        const path = joinRoutePath(entry.path, normalized);
        if (pagePaths.has(path)) {
          warn(
            `Sub-page "${subPath}" of page "${entry.path}" would be routed at ` +
              `"${path}", which is already registered as a page. The page ` +
              `keeps the path and the sub-page is not routed.`,
          );
          continue;
        }
        if (claimedSubPageRoutes.has(path)) {
          warn(
            `Sub-page "${subPath}" of page "${entry.path}" would be routed at ` +
              `"${path}", which another page's sub-page already claims. The ` +
              `first registration wins.`,
          );
          continue;
        }
        claimedSubPageRoutes.add(path);
        subRoutes.push({ path, subPath, indexPath: normalized });
      }

      ranked.push({
        path: entry.path,
        priority: routePriority(entry.path),
        pagePath: entry.path,
        // The first sub-page that actually has a route: sending the page root
        // to one that was dropped above would land the page inside whatever
        // took the path instead.
        indexSubPath: subRoutes[0]?.indexPath,
      });
      for (const { path, subPath } of subRoutes) {
        ranked.push({
          path,
          priority: routePriority(path),
          pagePath: entry.path,
          subPath,
        });
      }
    }

    // Sorting is stable, so equally specific patterns stay in registration
    // order and the first one registered wins — the same tie-break
    // react-router applies to sibling routes.
    this.paths = ranked.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Matches `pathname` against registered paths and returns the best match.
   */
  match(pathname: string): RouteTableMatch | undefined {
    let matched: RouteTableMatch | undefined;
    for (const route of this.paths) {
      // A prefix match of `/` matches everything, so the root is the catch-all
      // without needing to be special cased here.
      const result = matchPath(route.path, pathname, false);
      if (!result) {
        continue;
      }
      // The mount base is the match up to the splat, never the whole
      // pathname — a page mounted at its own current URL would resolve every
      // relative link inside it against itself.
      if (route.subPath === undefined) {
        matched = { path: route.pagePath, basePath: result.pathnameBase };
        // Nothing is left of the pathname below the page, so a page composed
        // from sub-pages has not been told which one to show yet.
        if (
          route.indexSubPath !== undefined &&
          trimTrailingSlash(pathname) === result.pathnameBase
        ) {
          matched.indexRedirect = joinBasePath(
            result.pathnameBase,
            route.indexSubPath,
          );
        }
        break;
      }
      // The page's own base, rather than the sub-page's, so the page chrome
      // above the sub-page keeps resolving against the page. The page pattern
      // is a prefix of the sub-page pattern that just matched, so this only
      // fails if the two were built from different pages.
      const pageResult = matchPath(route.pagePath, pathname, false);
      if (!pageResult) {
        continue;
      }
      matched = {
        path: route.pagePath,
        basePath: pageResult.pathnameBase,
        subPage: {
          path: route.subPath,
          routePattern: route.path,
          basePath: result.pathnameBase,
        },
      };
      break;
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
