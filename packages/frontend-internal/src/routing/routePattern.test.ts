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
  expandOptionalSegments,
  generatePath,
  matchPath,
  routePriority,
  trimTrailingSlash,
} from './routePattern';

describe('routePattern', () => {
  describe('routePriority', () => {
    it('scores per segment so a static prefix outranks a longer param pattern', () => {
      expect(routePriority('/catalog/entities')).toBeGreaterThan(
        routePriority('/catalog/:name'),
      );
      expect(routePriority('/catalog/entities')).toBeGreaterThan(
        routePriority('/catalog/:name?'),
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

    it('expands optional segments with required variants first', () => {
      expect(expandOptionalSegments('/one/:two?/:three?')).toEqual([
        '/one/:two/:three',
        '/one/:two',
        '/one/:three',
        '/one',
      ]);
      expect(expandOptionalSegments('/project/task?/:taskId')).toEqual([
        '/project/task/:taskId',
        '/project/:taskId',
      ]);
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

    it('trims a run that follows a line terminator, where react-router keeps it', () => {
      // react-router trims with `(.)\/+$`, and that `.` does not match a line
      // terminator, so it leaves the run alone where one precedes it. Scanning
      // trims either way. Swept over the whole Unicode range these four code
      // points are the entire difference between the two, which is why they are
      // pinned here rather than left to be rediscovered.
      const reactRouterTrim = (path: string) => path.replace(/(.)\/+$/, '$1');

      for (const terminator of ['\n', '\r', '\u2028', '\u2029']) {
        expect(trimTrailingSlash(`${terminator}/`)).toBe(terminator);
        expect(trimTrailingSlash(`/x/foo${terminator}///`)).toBe(
          `/x/foo${terminator}`,
        );
        expect(reactRouterTrim(`${terminator}/`)).toBe(`${terminator}/`);
      }

      // Everything else agrees, the code points either side of the four
      // included: being a control character or a separator is not what counts.
      for (const other of ['\t', '\u000b', '\u0085', '\u2027', '\u202a']) {
        expect(trimTrailingSlash(`/x/foo${other}///`)).toBe(
          reactRouterTrim(`/x/foo${other}///`),
        );
      }

      // Reachable rather than theoretical: `generatePath` only encodes
      // `[&?#;/]` in a param value, and a `[^/]` param segment matches straight
      // through a terminator, so one lands inside the raw match.
      expect(matchPath('/x/:a', '/x/foo\n/', false)).toEqual({
        matchedPathname: '/x/foo\n',
        pathnameBase: '/x/foo\n',
        params: { a: 'foo\n' },
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

    it('matches optional params whether they are present or omitted', () => {
      expect(matchPath('/catalog/:kind?/:name?', '/catalog', true)).toEqual({
        matchedPathname: '/catalog',
        pathnameBase: '/catalog',
        params: {},
      });
      expect(
        matchPath('/catalog/:kind?/:name?', '/catalog/component/widget', true),
      ).toEqual({
        matchedPathname: '/catalog/component/widget',
        pathnameBase: '/catalog/component/widget',
        params: { kind: 'component', name: 'widget' },
      });
      expect(matchPath('/:lang?/about', '/about', true)).toEqual({
        matchedPathname: '/about',
        pathnameBase: '/about',
        params: {},
      });
      expect(matchPath('/:lang?/about', '/en/about', true)).toEqual({
        matchedPathname: '/en/about',
        pathnameBase: '/en/about',
        params: { lang: 'en' },
      });
    });

    it('matches optional static segments whether they are present or omitted', () => {
      expect(
        matchPath('/project/task?/:taskId', '/project/task/123', true),
      ).toEqual({
        matchedPathname: '/project/task/123',
        pathnameBase: '/project/task/123',
        params: { taskId: '123' },
      });
      expect(matchPath('/project/task?/:taskId', '/project/123', true)).toEqual(
        {
          matchedPathname: '/project/123',
          pathnameBase: '/project/123',
          params: { taskId: '123' },
        },
      );
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

  describe('generatePath', () => {
    it('substitutes named params without corrupting longer names', () => {
      expect(generatePath('/target/:ab/:a', { ab: 'bar', a: 'foo' })).toBe(
        '/target/bar/foo',
      );
    });

    it('substitutes splat params', () => {
      expect(generatePath('/docs/*', { '*': 'a/b' })).toBe('/docs/a/b');
    });

    it('removes omitted optional segments wherever they appear', () => {
      expect(generatePath('/:lang?/about', {})).toBe('/about');
      expect(generatePath('/:lang?/about', { lang: 'en' })).toBe('/en/about');
      expect(generatePath('/project/task?/:taskId', { taskId: '123' })).toBe(
        '/project/task/123',
      );
    });

    it('treats `$` in a value as a literal, not a replacement pattern', () => {
      expect(generatePath('/target/:a', { a: 'x$&y' })).toBe('/target/x$%26y');
      expect(generatePath('/target/:a/:b', { a: "$'", b: '$`' })).toBe(
        "/target/$'/$`",
      );
      expect(generatePath('/docs/*', { '*': 'a$&b' })).toBe('/docs/a$%26b');
    });
  });
});
