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

import {
  compilePath,
  matchPath,
  routePriority,
  substitutePathParams,
  trimTrailingSlash,
} from './routePattern';

describe('routePattern', () => {
  describe('routePriority', () => {
    it('scores per segment so a static prefix outranks a longer param pattern', () => {
      expect(routePriority('/catalog/entities')).toBeGreaterThan(
        routePriority('/catalog/:name'),
      );
      expect(routePriority('/catalog/:name')).toBeGreaterThan(
        routePriority('/catalog'),
      );
      expect(routePriority('/catalog')).toBeGreaterThan(
        routePriority('/catalog/*'),
      );
      // The score is not a sum over the pattern length: three static segments
      // beat five parameterized ones, the same way react-router ranks them.
      expect(routePriority('/x/y/z')).toBeGreaterThan(
        routePriority('/x/:a/:b/:c/:d'),
      );
      // Splats are penalized but still rank above the root and empty layouts
      expect(routePriority('/catalog/*')).toBeGreaterThan(routePriority('/'));
      expect(routePriority('/')).toBeGreaterThan(routePriority(''));
      expect(routePriority('')).toBeGreaterThan(routePriority('*'));
    });
  });

  describe('trimTrailingSlash', () => {
    it('drops every trailing slash but never the last character', () => {
      expect(trimTrailingSlash('')).toBe('');
      expect(trimTrailingSlash('/')).toBe('/');
      expect(trimTrailingSlash('//')).toBe('/');
      expect(trimTrailingSlash('///')).toBe('/');
      expect(trimTrailingSlash('/a')).toBe('/a');
      expect(trimTrailingSlash('/a/')).toBe('/a');
      expect(trimTrailingSlash('/a//')).toBe('/a');
      expect(trimTrailingSlash('/a/b///')).toBe('/a/b');
      expect(trimTrailingSlash('a')).toBe('a');
      expect(trimTrailingSlash('a/')).toBe('a');
      // Only the trailing run goes; separators inside the path are untouched
      expect(trimTrailingSlash('//a')).toBe('//a');
      expect(trimTrailingSlash('/a//b//')).toBe('/a//b');
    });

    it('handles a long run of slashes without backtracking over it', () => {
      // A pathname reaches this from a link anyone can craft, so the cost of
      // trimming one has to follow its length and nothing else. The expensive
      // shape is a long run of slashes that is *not* at the end, which a
      // backtracking matcher retries from every position in the run.
      const slashes = '/'.repeat(5000);
      expect(trimTrailingSlash(`/catalog${slashes}`)).toBe('/catalog');
      expect(trimTrailingSlash(slashes)).toBe('/');
      expect(trimTrailingSlash(`/a${slashes}b`)).toBe(`/a${slashes}b`);
      expect(matchPath('/docs/*', `/docs${slashes}`, false)).toEqual({
        matchedPathname: '/docs',
        pathnameBase: '/docs',
        params: { '*': slashes.slice(1) },
      });
    });
  });

  describe('compilePath / matchPath', () => {
    it('matches named params and decodes values, keeping malformed encodings raw', () => {
      expect(
        matchPath('/entity/:kind/:name', '/entity/component/foo%20bar', true),
      ).toEqual({
        matchedPathname: '/entity/component/foo%20bar',
        pathnameBase: '/entity/component/foo%20bar',
        params: { kind: 'component', name: 'foo bar' },
      });
      // A bare `%` is not valid percent encoding. react-router reports the raw
      // segment rather than letting the URIError escape.
      expect(matchPath('/catalog/:name', '/catalog/100%', true)).toEqual({
        matchedPathname: '/catalog/100%',
        pathnameBase: '/catalog/100%',
        params: { name: '100%' },
      });
    });

    it('matches case-insensitively unless caseSensitive is set', () => {
      expect(matchPath('/Catalog', '/catalog', true)).toEqual({
        matchedPathname: '/catalog',
        pathnameBase: '/catalog',
        params: {},
      });
      expect(matchPath('/catalog', '/CATALOG/foo', false)).toEqual({
        matchedPathname: '/CATALOG',
        pathnameBase: '/CATALOG',
        params: {},
      });
      expect(matchPath('/Catalog', '/catalog', true, true)).toBeNull();
      expect(matchPath('/Catalog', '/Catalog', true, true)).toEqual({
        matchedPathname: '/Catalog',
        pathnameBase: '/Catalog',
        params: {},
      });
    });

    it('supports prefix matching when end is false', () => {
      const result = matchPath('/catalog', '/catalog/entities', false);
      expect(result).toEqual({
        matchedPathname: '/catalog',
        pathnameBase: '/catalog',
        params: {},
      });
    });

    it('captures splat segments, including an empty remainder', () => {
      expect(matchPath('/docs/*', '/docs/a/b', true)).toEqual({
        matchedPathname: '/docs/a/b',
        pathnameBase: '/docs',
        params: { '*': 'a/b' },
      });
      expect(matchPath('/docs/*', '/docs', true)).toEqual({
        matchedPathname: '/docs',
        pathnameBase: '/docs',
        params: { '*': '' },
      });
      expect(matchPath('*', '/any/nested/path', true)).toEqual({
        matchedPathname: '/any/nested/path',
        pathnameBase: '/',
        params: { '*': 'any/nested/path' },
      });
      expect(matchPath('*', '/', true)).toEqual({
        matchedPathname: '/',
        pathnameBase: '/',
        params: { '*': '' },
      });
    });

    it('bases a splat match on the prefix before the splat', () => {
      // Everything from the splat onwards belongs to whatever is mounted at the
      // base, so the base has to stay put as the pathname grows.
      expect(matchPath('/docs/*', '/docs/a/b/c', false)?.pathnameBase).toBe(
        '/docs',
      );
      expect(matchPath('/:x/*', '/a/b/c', false)).toEqual({
        matchedPathname: '/a/b/c',
        pathnameBase: '/a',
        params: { x: 'a', '*': 'b/c' },
      });
      // The base is sliced off the raw match, so a splat whose decoded value is
      // shorter than the pathname it came from does not shift it.
      expect(matchPath('/docs/*', '/docs/a%20b/c', false)?.pathnameBase).toBe(
        '/docs',
      );
      // A trailing slash never survives into the base
      expect(matchPath('/docs/*', '/docs/', false)?.pathnameBase).toBe('/docs');
    });

    it('compiles empty layout paths', () => {
      expect(compilePath('', false).regexp.test('/anything')).toBe(true);
      expect(compilePath('', true).regexp.test('/')).toBe(true);
      expect(compilePath('', true).regexp.test('/x')).toBe(false);
    });
  });

  describe('substitutePathParams', () => {
    it('substitutes named params without corrupting longer names', () => {
      expect(
        substitutePathParams('/target/:ab/:a', { ab: 'bar', a: 'foo' }),
      ).toBe('/target/bar/foo');
    });

    it('substitutes splat params', () => {
      expect(substitutePathParams('/docs/*', { '*': 'a/b' })).toBe('/docs/a/b');
    });

    it('treats `$` in a value as a literal, not a replacement pattern', () => {
      expect(substitutePathParams('/target/:a', { a: 'x$&y' })).toBe(
        '/target/x$&y',
      );
      expect(substitutePathParams('/target/:a/:b', { a: "$'", b: '$`' })).toBe(
        "/target/$'/$`",
      );
      expect(substitutePathParams('/docs/*', { '*': 'a$&b' })).toBe(
        '/docs/a$&b',
      );
    });
  });
});
