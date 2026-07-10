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
 * Shared path-pattern compile / match / priority used by {@link RouteTable}
 * and {@link matchRouteRefs}.
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
  matchedPathname: string;
  params: Record<string, string>;
}

/**
 * Higher score = more specific = tried first.
 * Static segments beat params; bare `*`, empty layout, and `/` are lowest.
 *
 * @internal
 */
export function routePriority(path: string): number {
  if (path === '*') {
    return 0;
  }
  if (path === '/' || path === '') {
    return 1;
  }
  const segments = path.replace(/^\//, '').split('/').filter(Boolean);
  let score = 2;
  for (const seg of segments) {
    if (seg === '*') {
      return 1;
    }
    score += seg.startsWith(':') ? 1 : 2;
  }
  return score;
}

/**
 * Converts a route path pattern into a RegExp and extracts parameter names.
 * Handles named params (`:id`), catch-all `*` segments, and empty layout paths.
 *
 * @internal
 */
export function compilePath(pattern: string, end: boolean): CompiledPath {
  const paramNames: string[] = [];

  // Empty path matches as a layout/root route
  if (pattern === '') {
    return {
      regexp: new RegExp(end ? '^/$' : '^/'),
      paramNames,
    };
  }

  let regexpSource = '^';

  // Normalize: ensure leading slash, remove trailing slash
  const normalizedPattern = pattern.startsWith('/') ? pattern : `/${pattern}`;
  const segments = normalizedPattern.split('/').filter(Boolean);

  for (const segment of segments) {
    if (segment === '*') {
      paramNames.push('*');
      regexpSource += '/(.+)';
    } else if (segment.startsWith(':')) {
      paramNames.push(segment.slice(1));
      regexpSource += '/([^/]+)';
    } else {
      regexpSource += `/${escapeRegExp(segment)}`;
    }
  }

  if (end) {
    regexpSource += '/?$';
  } else {
    regexpSource += '(?:/|$)';
  }

  return {
    regexp: new RegExp(regexpSource),
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
): PathMatch | null {
  const { regexp, paramNames } = compilePath(pattern, end);
  const match = pathname.match(regexp);

  if (!match) {
    return null;
  }

  const matchedPathname = match[0].replace(/\/$/, '') || '/';
  const params: Record<string, string> = {};

  for (let i = 0; i < paramNames.length; i++) {
    const value = match[i + 1];
    if (value !== undefined) {
      params[paramNames[i]] = decodeURIComponent(value);
    }
  }

  return { matchedPathname, params };
}

/**
 * Substitute named and splat params into a path template.
 * Uses word boundaries for named params so `:a` does not match inside `:ab`.
 *
 * @internal
 */
export function substitutePathParams(
  template: string,
  params: Record<string, string>,
): string {
  let target = template;
  for (const [name, value] of Object.entries(params)) {
    target = target.replace(
      name === '*' ? /\*/g : new RegExp(`:${name}\\b`, 'g'),
      value ?? '',
    );
  }
  return target;
}
