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
 * Shared path-pattern matching, generation and priority, used by `RouteTable`
 * and the routing implementation in `@backstage/frontend-app-api`.
 *
 * It lives here rather than in either consumer so both agree by construction —
 * a route pattern must mean the same thing to top-level page matching and to
 * route ref resolution. Nothing in this module is publicly exported by any
 * package.
 *
 * Semantics follow react-router v6, which is the behavior plugin authors and
 * adopters have written their route patterns against.
 *
 * @internal
 */

import { escapeRegExp } from './escapeRegExp';

/** @internal */
export interface CompiledPath {
  regexp: RegExp;
  paramNames: string[];
}

/** @internal */
export interface PathMatch {
  /**
   * The whole portion of the pathname that the pattern matched, splat tail
   * included, without a trailing slash.
   */
  matchedPathname: string;
  /**
   * The portion of the match that precedes the splat — react-router's
   * `pathnameBase`. This is the prefix that nested routes and relative links
   * resolve against, so a route mounted at `/docs/*` keeps `/docs` as its base
   * no matter how deep the current pathname goes. Equal to `matchedPathname`
   * for a pattern without a splat.
   */
  pathnameBase: string;
  params: Record<string, string>;
}

// Per-segment scores, mirroring react-router's route ranking.
const PARAM_SEGMENT = /^:[\w-]+\??$/;
const DYNAMIC_SEGMENT_SCORE = 3;
const EMPTY_SEGMENT_SCORE = 1;
const STATIC_SEGMENT_SCORE = 10;
const SPLAT_PENALTY = -2;

/**
 * Higher score = more specific = tried first.
 *
 * Static segments score above params at the same depth. Scores accumulate
 * across the pattern, splats are penalized, and empty layout paths and `/`
 * rank lowest.
 *
 * @internal
 */
export function routePriority(path: string): number {
  const segments = path.split('/');
  const initialScore =
    segments.length + (segments.some(s => s === '*') ? SPLAT_PENALTY : 0);

  return segments
    .filter(segment => segment !== '*')
    .reduce((score, segment) => {
      if (PARAM_SEGMENT.test(segment)) {
        return score + DYNAMIC_SEGMENT_SCORE;
      }
      return (
        score + (segment === '' ? EMPTY_SEGMENT_SCORE : STATIC_SEGMENT_SCORE)
      );
    }, initialScore);
}

/**
 * Expands a route into the concrete patterns represented by its optional
 * segments, in the same required-before-omitted order as react-router.
 *
 * Ranking has to operate on these concrete patterns rather than on the route
 * as written. For example, `/one/:two?/:three?` matching `/one/foo` has only
 * one dynamic segment in that match, and therefore ties `/one/:id` instead of
 * outranking it because of an optional segment that was not present.
 *
 * @internal
 */
export function expandOptionalSegments(path: string): string[] {
  const [first, ...rest] = path.split('/');
  const optional = first.endsWith('?');
  const required = first.replace(/\?$/, '');

  if (rest.length === 0) {
    return optional ? [required, ''] : [required];
  }

  const restExpanded = expandOptionalSegments(rest.join('/'));
  const expanded = restExpanded.map(subPath =>
    subPath === '' ? required : `${required}/${subPath}`,
  );

  if (optional) {
    expanded.push(...restExpanded);
  }

  return expanded.map(candidate =>
    path.startsWith('/') && candidate === '' ? '/' : candidate,
  );
}

/**
 * Converts a route path pattern into a RegExp and extracts parameter names.
 * Handles named params (`:id`), optional params (`:id?`), optional static
 * segments (`task?`), a trailing catch-all `*`, and empty layout paths.
 * Matching is case insensitive unless `caseSensitive` is set, which is the
 * react-router default.
 *
 * @internal
 */
export function compilePath(
  pattern: string,
  end: boolean,
  caseSensitive: boolean = false,
): CompiledPath {
  const paramNames: string[] = [];
  const flags = caseSensitive ? undefined : 'i';

  // Empty path matches as a layout/root route
  if (pattern === '') {
    return {
      regexp: new RegExp(end ? '^/$' : '^/', flags),
      paramNames,
    };
  }

  let regexpSource = '^';

  // Normalize: ensure leading slash, remove trailing slash
  const normalizedPattern = pattern.startsWith('/') ? pattern : `/${pattern}`;
  const segments = normalizedPattern.split('/').filter(Boolean);
  const hasSplat = segments[segments.length - 1] === '*';
  const namedSegments = hasSplat ? segments.slice(0, -1) : segments;

  for (const segment of namedSegments) {
    if (segment.startsWith(':')) {
      const optional = segment.endsWith('?');
      paramNames.push(segment.slice(1, optional ? -1 : undefined));
      regexpSource += optional ? '(?:/([^/]+))?' : '/([^/]+)';
    } else {
      const optional = segment.endsWith('?');
      const required = optional ? segment.slice(0, -1) : segment;
      regexpSource += optional
        ? `(?:/${escapeRegExp(required)})?`
        : `/${escapeRegExp(required)}`;
    }
  }

  if (hasSplat) {
    paramNames.push('*');
    // A splat matches an empty remainder, and never captures its own leading
    // slash, so `/docs/*` matches `/docs` with an empty `*` param.
    regexpSource += namedSegments.length === 0 ? '/(.*)$' : '(?:/(.+)|/*)$';
  } else if (end) {
    regexpSource += '/?$';
  } else {
    regexpSource += '(?:/|$)';
  }

  return {
    regexp: new RegExp(regexpSource, flags),
    paramNames,
  };
}

/**
 * Match a single path pattern against a pathname.
 *
 * @internal
 */
export function matchPath(
  pattern: string,
  pathname: string,
  end: boolean,
  caseSensitive: boolean = false,
): PathMatch | null {
  const { regexp, paramNames } = compilePath(pattern, end, caseSensitive);
  const match = pathname.match(regexp);

  if (!match) {
    return null;
  }

  const rawMatchedPathname = match[0];
  const matchedPathname = trimTrailingSlash(rawMatchedPathname);
  const params: Record<string, string> = {};
  let pathnameBase = matchedPathname;

  for (let i = 0; i < paramNames.length; i++) {
    const name = paramNames[i];
    const value = match[i + 1];
    if (name === '*') {
      // The base is everything the pattern matched up to the splat. It has to
      // be sliced off the raw match rather than the decoded param, whose length
      // no longer lines up with the pathname it came from.
      // A trailing splat can capture nothing, and is then reported as an empty
      // string rather than being left out of the params.
      const rawSplat = value ?? '';
      pathnameBase = trimTrailingSlash(
        rawMatchedPathname.slice(
          0,
          rawMatchedPathname.length - rawSplat.length,
        ),
      );
    } else if (value === undefined) {
      continue;
    }
    params[name] = safelyDecodeURIComponent(value ?? '');
  }

  return { matchedPathname, pathnameBase, params };
}

/**
 * Drops trailing slashes while keeping the leading one, so `/catalog/` becomes
 * `/catalog` and the root `/` is left as it is.
 *
 * Scanned rather than matched with a `/\/+$/`-shaped pattern: a pathname is
 * whatever a crafted link put in the address bar, and a backtracking matcher
 * retries such a pattern from every position in a long run of slashes, which
 * is quadratic in the length of the run. The pattern being unanchored is what
 * makes it quadratic — anchoring one is not on its own a defense against
 * backtracking, and is not the reason this scans.
 *
 * Scanning diverges from react-router's own `(.)\/+$` replace in exactly one
 * place, because that `.` does not match a line terminator: with one directly
 * before the run react-router keeps the run and this drops it, so `'\n/'` trims
 * to `'\n'`. Swept over the whole Unicode range the difference is those four
 * code points and nothing else — U+000A, U+000D, U+2028 and U+2029 — and it is
 * reachable rather than theoretical. `location.pathname` percent-encodes them,
 * but React Router's own memory history reports the pathname it was handed
 * verbatim, which is what a `MemoryRouter` in a test renders through, and
 * `generatePath` only encodes `[&?#;/]` in a param value, so a value carrying a
 * terminator arrives intact and a `[^/]` param segment matches straight through
 * it.
 * Dropping the run is the answer to prefer in any case: a trailing slash means
 * the same thing wherever it sits, and `useAppBasePath` normalizes one away
 * again a moment later. `normalizeBasePath` has no such divergence for any
 * input, having replaced a pattern with no `.` in it.
 *
 * @internal
 */
export function trimTrailingSlash(pathname: string): string {
  let end = pathname.length;
  while (end > 1 && pathname[end - 1] === '/') {
    end -= 1;
  }
  return pathname.slice(0, end);
}

/**
 * Pathnames are not guaranteed to be valid percent encoding — a bare `%` in
 * any segment makes `decodeURIComponent` throw a `URIError`. Route matching
 * runs above the page error boundary, so an escaping error would blank the
 * whole app. Keep the raw value instead, the same way react-router does.
 */
function safelyDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Generates a concrete path from a Backstage route pattern.
 *
 * This follows React Router v6's segment semantics: named params are required
 * unless suffixed with `?`, omitted optional segments (including their slash)
 * disappear, and only a final `*` is a splat. Backstage additionally encodes
 * characters that could otherwise change the generated URL's path, query or
 * fragment.
 *
 * @internal
 */
export function generatePath(
  pattern: string,
  params: Record<string, string | undefined> = {},
): string {
  const prefix = pattern.startsWith('/') ? '/' : '';
  const segments = pattern
    .split(/\/+/)
    .map((segment, index, allSegments) => {
      if (segment === '*' && index === allSegments.length - 1) {
        return encodeSplatParam(params['*'] ?? '');
      }

      const param = segment.match(/^:([\w-]+)(\??)$/);
      if (param) {
        const [, name, optional] = param;
        const value = params[name];
        if (value === undefined) {
          if (optional !== '?') {
            throw new Error(
              `Missing required param "${name}" in path "${pattern}"`,
            );
          }
          return '';
        }
        return encodePathParam(value);
      }

      // React Router treats a trailing `?` on a static segment as an optional
      // marker during generation, even though it has no value to omit.
      return segment.replace(/\?$/g, '');
    })
    .filter(Boolean);

  return prefix + segments.join('/');
}

/** Encode a single path segment (no `/`). */
function encodePathParam(value: string): string {
  return value.replaceAll(/[&?#;/]/g, character =>
    encodeURIComponent(character),
  );
}

/** Keep `/` separators in splat values while protecting the URL around them. */
function encodeSplatParam(value: string): string {
  return value
    .split('/')
    .map(segment =>
      segment.replaceAll(/[&?#;]/g, character => encodeURIComponent(character)),
    )
    .join('/');
}
