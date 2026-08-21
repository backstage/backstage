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
 * AppRouting — the path algebra every link target is resolved with, and
 * nothing else.
 *
 * `@internal/frontend` is an inline package: its source is compiled into every
 * consumer, `@backstage/frontend-plugin-api` included, so whatever lives here
 * lands in a package that should be a lightweight client of the app history.
 * This module therefore carries no React Router import and no routing
 * authority of its own — only pure functions and the one hook that reads the
 * framework's own {@link PageMount} context.
 *
 * The two authorities that used to be reconciled here now each own their side:
 *
 * - **Framework** (new frontend system): `AppHistoryApi.createHref` resolves a
 *   target against the page it was written in and applies the app's deploy
 *   basename. `@backstage/frontend-app-api` implements it on top of the
 *   functions below, and every consumer already holds an `AppHistoryApi`
 *   through `appHistoryApiRef`, so no consumer has to reimplement the rule.
 * - **React Router** (old frontend system): each consumer delegates to React
 *   Router itself, in the package that already declares the dependency and
 *   owns the version — `@backstage/core-components` for the `Sidebar` and
 *   `ErrorPage`, `@backstage/frontend-plugin-api` for `useHref` and
 *   `RouteLink`. That path is permanent and is never migrated, so keeping the
 *   delegation next to the code that needs it is what keeps it honest.
 *
 * The functions below reproduce React Router's own path algebra so both sides
 * agree on what a target means. They are written out rather than imported for
 * two reasons: this module must not depend on React Router at all, and the
 * React Router v6 beta this repo still supports — `AppManager.compat.test.tsx`
 * runs the old frontend system against both, and the migration CLI writes
 * `'6.0.0-beta.0 || ^6.3.0'` — exports neither `createPath` nor `parsePath`.
 * `AppRouting.test.tsx` pins every one of them against the real implementation
 * so a divergence fails rather than drifting.
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
 * framework side it is {@link pageBasePaths} of the current page's mount,
 * which derives the same boundaries from the pattern the page is mounted at.
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
 * How many leading segments of a mount its innermost route match spans.
 *
 * A pattern binds a parameter to whatever the location put in that segment, so
 * the prefix up to and including the last parameter cannot be split: there is
 * no route between `/catalog` and `/catalog/:namespace/:kind/:name`, and a
 * `..` that stopped inside it would land on `/catalog/default/component`,
 * which nothing claims. Everything the pattern spells out literally after that
 * is an ordinary path level — that is how React Router's own trees nest, and
 * how a sub-page, whose pattern is its page's with its own path appended, sits
 * one match below its page.
 *
 * Zero for a pattern with no parameters at all, so a mount the pattern spells
 * out in full is read the way a browser reads a path.
 */
function matchSpan(routePattern: string, segmentCount: number): number {
  let span = 0;
  routePattern
    .split('/')
    .filter(Boolean)
    .forEach((segment, index) => {
      if (segment.startsWith(':')) {
        span = index + 1;
      }
    });
  return Math.min(span, segmentCount);
}

/**
 * The stack a target written inside a page resolves against, outermost first:
 * the app root, the page's innermost match, and every ordinary path level
 * below it.
 *
 * React Router derives its stack from the route matches, so a leading `..`
 * climbs one *match* — and a match can span several path segments, as
 * `/catalog/:namespace/:kind/:name` does. The framework has no routing library
 * to ask, but it does not need one: a page publishes the pattern it is mounted
 * at alongside the concrete base that pattern matched, and the pattern is what
 * says where the match boundary falls. See {@link matchSpan}.
 *
 * A mount with no pattern of its own is read literally, as a mount whose
 * pattern is its base path — which is what {@link PageMount} says a static
 * mount's pattern is, and the answer a caller holding only a base path can
 * support.
 *
 * Spelling it as a stack rather than calling {@link resolvePath} directly is
 * what lets {@link resolveAppPath} answer for both authorities: one function
 * resolves a target, and only the stack handed to it differs.
 */
export function pageBasePaths(
  basePath: string | undefined,
  routePattern?: string,
): string[] {
  const normalized = normalizeBasePath(basePath);
  // The first segment of an app-absolute base path is empty, and stands for
  // the app root; a base that is empty or relative starts the stack there too.
  // Empty segments elsewhere contribute nothing rather than a level that
  // repeats its parent, so a doubled separator cannot make `..` climb twice.
  const segments = normalized.split('/').filter(Boolean);
  const span = matchSpan(routePattern ?? normalized, segments.length);
  const stack = ['/'];
  let prefix = '';
  segments.forEach((segment, index) => {
    prefix += `/${segment}`;
    if (index + 1 >= span) {
      stack.push(prefix);
    }
  });
  return stack;
}

/**
 * Splits a target's leading `..` off the rest of it, and names the base that
 * climb lands on.
 *
 * The stack a target climbs is the one thing about resolution that only the
 * React tree knows — a page publishes its mount there and nowhere else — while
 * every other rule belongs to whoever owns the location and the deploy
 * basename. Handing back a target with no `..` left in it, next to the base it
 * is now relative to, is what lets a caller do the climb without taking over
 * the rest: {@link resolveAppPath} answers the same for the pair as it would
 * have for the original target and the whole stack.
 *
 * A target with no pathname of its own (`?tab=readme`, `#section`) climbs
 * nothing and is handed back untouched, so it still resolves against the
 * current location rather than against a base.
 */
export function climbPageBase(
  to: string,
  basePaths: string[],
): { to: string; basePath: string } {
  const deepest = basePaths[basePaths.length - 1] ?? '/';
  const target = parsePath(to);
  if (!target.pathname?.startsWith('..')) {
    return { to, basePath: deepest };
  }

  const segments = target.pathname.split('/');
  let index = basePaths.length - 1;
  while (segments[0] === '..') {
    segments.shift();
    index -= 1;
  }
  // Climbing past the outermost base lands on the app root rather than running
  // off the end of the stack, exactly as React Router does at its own.
  const basePath = index >= 0 ? basePaths[index] : '/';

  // Nothing but `..` was written, so the answer is the base itself — spelled
  // out rather than left empty, so that a `..?tab=x` lands on the base rather
  // than falling through to the current location. A trailing slash the target
  // asked for is kept, since it is the base that is being addressed.
  const rest = segments.join('/');
  const climbed =
    rest ||
    (segments.length ? `${basePath === '/' ? '' : basePath}/` : basePath);
  return { to: createPath({ ...target, pathname: climbed }), basePath };
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
