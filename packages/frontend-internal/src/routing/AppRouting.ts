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

import { usePageMount } from './PageMountContext';

/**
 * Shared path resolution for AppHistory and legacy React Router consumers.
 * Route ancestry is supplied by the matched extension chain; these functions
 * resolve paths without owning another routing tree.
 */

/**
 * The part of a location that path matching cares about.
 *
 * Structurally compatible with React Router's `Location` and `Path` as well as
 * with `AppLocation`, so any of them can be passed or returned without
 * copying.
 */
export interface AppPath {
  pathname: string;
  search: string;
  hash: string;
}

/**
 * A link target: a path written as a string, or already split into parts.
 *
 * The string form is what every call site in the repo uses; the object form
 * exists because {@link resolvePath} is React Router's function and takes it.
 */
export type AppTo = string | Partial<AppPath>;

/** The location every answer degrades to when nothing else can answer. */
export const APP_ROOT_PATH: AppPath = {
  pathname: '/',
  search: '',
  hash: '',
};

/**
 * React Router's `parsePath`, vendored.
 *
 * The semantics are React Router's exactly, because {@link resolveAppPath}
 * branches on them: a target with no pathname of its own (`?tab=readme`,
 * `#section`) comes back with the `pathname` key absent rather than empty,
 * which is what makes it resolve against the current location, and a bare `?`
 * or `#` parses as a search or hash that {@link createPath} drops again. The
 * hash is taken before the search, so a `?` inside a fragment stays in the
 * fragment.
 */
export function parsePath(path: string): Partial<AppPath> {
  const parsedPath: Partial<AppPath> = {};
  let rest = path;

  if (rest) {
    const hashIndex = rest.indexOf('#');
    if (hashIndex >= 0) {
      parsedPath.hash = rest.substring(hashIndex);
      rest = rest.substring(0, hashIndex);
    }

    const searchIndex = rest.indexOf('?');
    if (searchIndex >= 0) {
      parsedPath.search = rest.substring(searchIndex);
      rest = rest.substring(0, searchIndex);
    }

    if (rest) {
      parsedPath.pathname = rest;
    }
  }

  return parsedPath;
}

/**
 * React Router's `createPath`, vendored alongside {@link parsePath}.
 *
 * Again the semantics are React Router's exactly: a missing pathname defaults
 * to the app root but an explicitly empty one does not, a search or hash that
 * already carries its prefix keeps the one it was written with, and a bare `?`
 * or `#` contributes nothing.
 */
export function createPath({
  pathname = '/',
  search = '',
  hash = '',
}: Partial<AppPath>): string {
  let path = pathname;
  if (search && search !== '?') {
    path += search.charAt(0) === '?' ? search : `?${search}`;
  }
  if (hash && hash !== '#') {
    path += hash.charAt(0) === '#' ? hash : `#${hash}`;
  }
  return path;
}

/**
 * Normalizes a mount base path into a prefix that is safe to concatenate with
 * a `/`-prefixed suffix: no trailing slash, and an empty string at the app
 * root. Unlike a matched pathname, a base path keeps nothing back — `/` and
 * `///` both normalize to the empty prefix.
 *
 * Scanned rather than matched with a `/\/+$/` pattern: the base path is derived
 * from the pathname, which is whatever a crafted link put in the address bar,
 * and a backtracking matcher retries such a pattern from every position in a
 * long run of slashes, which is quadratic in the length of the run. It is the
 * pattern being unanchored that makes it quadratic; anchoring a pattern is not
 * on its own a defense against backtracking, and is not why this scans.
 *
 * The scan answers the same as the pattern it replaced for every input — the
 * pattern had no `.` in it, so it carries none of the line-terminator
 * divergence that `trimTrailingSlash` documents.
 */
export function normalizeBasePath(basePath: string | undefined): string {
  if (!basePath) {
    return '';
  }
  let end = basePath.length;
  while (end > 0 && basePath[end - 1] === '/') {
    end -= 1;
  }
  return basePath.slice(0, end);
}

/**
 * React Router's `resolvePathname`, vendored: each `..` in the target drops
 * one segment of the base, each `.` drops nothing, and everything else is
 * appended.
 *
 * The base has its trailing slashes taken off through
 * {@link normalizeBasePath} rather than React Router's own `/\/+$/`, which
 * answers the same for every input and does not backtrack over a long run.
 */
function resolvePathname(relativePath: string, fromPathname: string): string {
  const segments = normalizeBasePath(fromPathname).split('/');

  for (const segment of relativePath.split('/')) {
    if (segment === '..') {
      // Keep the leading empty segment, so the result still starts at `/`.
      if (segments.length > 1) {
        segments.pop();
      }
    } else if (segment !== '.') {
      segments.push(segment);
    }
  }

  return segments.length > 1 ? segments.join('/') : '/';
}

const normalizeSearch = (search: string): string => {
  if (!search || search === '?') {
    return '';
  }
  return search.startsWith('?') ? search : `?${search}`;
};

const normalizeHash = (hash: string): string => {
  if (!hash || hash === '#') {
    return '';
  }
  return hash.startsWith('#') ? hash : `#${hash}`;
};

/**
 * React Router's `resolvePath`, vendored.
 *
 * An absolute target is taken as written, a relative one is resolved against
 * `fromPathname`, and a target with no pathname of its own keeps
 * `fromPathname` — which is what makes `?tab=readme` and `#section` stay where
 * they were written once the caller has picked the right base.
 *
 * The v6 beta does export this one, but importing it would put React Router
 * back into this package, so it is written out alongside its two siblings.
 */
export function resolvePath(to: AppTo, fromPathname: string = '/'): AppPath {
  const {
    pathname: toPathname,
    search = '',
    hash = '',
  } = typeof to === 'string' ? parsePath(to) : to;

  let pathname: string;
  if (!toPathname) {
    // No pathname of its own, so the base is the answer.
    pathname = fromPathname;
  } else if (toPathname.startsWith('/')) {
    pathname = toPathname;
  } else {
    pathname = resolvePathname(toPathname, fromPathname);
  }

  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash),
  };
}

/**
 * React Router's `useResolvedPath`, as a function of the bases it would have
 * read out of the router.
 *
 * `useResolvedPath` is {@link resolvePath} against the base of the deepest
 * matched route, plus the two rules `resolvePath` does not carry on its own: a
 * target with no pathname of its own (`?tab=readme`, `#section`) resolves
 * against the current location, and each leading `..` climbs one entry of
 * `basePaths` rather than one path segment.
 *
 * `basePaths` is the stack a target resolves against, outermost first. On the
 * React Router side it is the `pathnameBase` of every match that contributes a
 * path segment, which is what a consumer reads out of the router. On the
 * framework side it is the concrete bases from the matched extension ancestry.
 * Empty means the app root, which is also what React Router answers where
 * nothing matched.
 */
export function resolveAppPath(
  to: AppTo,
  basePaths: string[],
  locationPathname: string,
): AppPath {
  const target = typeof to === 'string' ? parsePath(to) : { ...to };
  const isEmptyPath = to === '' || target.pathname === '';
  const toPathname = isEmptyPath ? '/' : target.pathname;

  let from: string;
  if (toPathname === undefined) {
    from = locationPathname;
  } else {
    let baseIndex = basePaths.length - 1;
    if (toPathname.startsWith('..')) {
      const segments = toPathname.split('/');
      while (segments[0] === '..') {
        segments.shift();
        baseIndex -= 1;
      }
      target.pathname = segments.join('/');
    }
    from = baseIndex >= 0 ? basePaths[baseIndex] : '/';
  }

  const resolved = resolvePath(target, from);

  const hasExplicitTrailingSlash =
    !!toPathname && toPathname !== '/' && toPathname.endsWith('/');
  const hasCurrentTrailingSlash =
    (isEmptyPath || toPathname === '.') && locationPathname.endsWith('/');
  if (
    !resolved.pathname.endsWith('/') &&
    (hasExplicitTrailingSlash || hasCurrentTrailingSlash)
  ) {
    resolved.pathname += '/';
  }
  return resolved;
}

/**
 * The base path that relative targets resolve against on the framework path,
 * as a prefix without a trailing slash (empty string at the app root).
 *
 * This is the framework's analogue of React Router's `pathnameBase`: a page —
 * or a sub-page, whose mount is provided inside its page's — publishes where
 * it is mounted, and every link written inside it resolves against that,
 * whether it is written in the page's own chrome, in its content, or in app
 * chrome rendered under it. Chrome rendered above any page sees no mount at
 * all and resolves against the app root.
 *
 * Only meaningful on the framework path; a consumer's React Router fallback
 * derives its own bases from the matched routes.
 */
export function useAppBasePath(): string {
  return normalizeBasePath(usePageMount()?.basePath);
}
