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
} from './routePattern';

describe('routePattern', () => {
  describe('routePriority', () => {
    it('ranks static segments above params and splats', () => {
      expect(routePriority('/catalog/entities')).toBeGreaterThan(
        routePriority('/catalog/:name'),
      );
      expect(routePriority('/catalog/:name')).toBeGreaterThan(
        routePriority('/catalog'),
      );
      expect(routePriority('/catalog')).toBeGreaterThan(
        routePriority('/catalog/*'),
      );
      expect(routePriority('*')).toBe(0);
      expect(routePriority('/')).toBe(1);
      expect(routePriority('')).toBe(1);
    });
  });

  describe('compilePath / matchPath', () => {
    it('matches named params and decodes values', () => {
      const result = matchPath(
        '/entity/:kind/:name',
        '/entity/component/foo%20bar',
        true,
      );
      expect(result).toEqual({
        matchedPathname: '/entity/component/foo%20bar',
        params: { kind: 'component', name: 'foo bar' },
      });
    });

    it('supports prefix matching when end is false', () => {
      const result = matchPath('/catalog', '/catalog/entities', false);
      expect(result).toEqual({
        matchedPathname: '/catalog',
        params: {},
      });
    });

    it('captures splat segments', () => {
      const result = matchPath('/docs/*', '/docs/a/b', true);
      expect(result).toEqual({
        matchedPathname: '/docs/a/b',
        params: { '*': 'a/b' },
      });
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
  });
});
