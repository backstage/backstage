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

import { createRouteRef, RouteRef } from '@backstage/frontend-plugin-api';
import { RouteTable } from '@internal/frontend';
import {
  generatePath as reactRouterGeneratePathTyped,
  matchRoutes as reactRouterMatchRoutes,
  type RouteObject,
} from 'react-router-dom';
import { generatePath } from './generatePath';
import { matchRouteRefs } from './matchRouteRefs';
import { BackstageRouteObject } from './types';

// react-router types generatePath with template literal path params, which
// makes it awkward to call with patterns held in variables.
const reactRouterGeneratePath = reactRouterGeneratePathTyped as (
  pattern: string,
  params?: Record<string, string>,
) => string;

const rest = {
  element: null,
  caseSensitive: false,
  routeRefs: new Set<RouteRef>(),
};

/**
 * Build a flat matchRouteRefs tree that mirrors RouteTable prefix matching:
 * each registered path is a parent with a splat child so remaining segments
 * are consumed the same way RouteTable's end:false matchers do.
 */
function toPrefixRoutes(paths: string[]): BackstageRouteObject[] {
  return paths.map(path => ({
    ...rest,
    // matchRouteRefs models the app root as an empty layout path
    path: path === '/' ? '' : path,
    routeRefs: new Set([createRouteRef()]),
    children: [{ ...rest, path: '*' }],
  }));
}

/** The same route set, expressed for react-router's own matchRoutes. */
function toReactRouterRoutes(paths: string[]): RouteObject[] {
  return paths.map(path => ({
    path,
    element: null,
    children: [{ path: '*', element: null }],
  }));
}

/** What react-router itself resolves the registered pattern and mount base to. */
function reactRouterExpectation(paths: string[], pathname: string) {
  const matches = reactRouterMatchRoutes(toReactRouterRoutes(paths), pathname);
  return {
    path: matches?.[0].route.path,
    basePath: matches?.[0].pathnameBase,
  };
}

describe('react-router parity', () => {
  const cases: Array<{ name: string; paths: string[]; pathname: string }> = [
    {
      name: 'simple prefix',
      paths: ['/catalog', '/scaffolder'],
      pathname: '/catalog/foo',
    },
    {
      name: 'static over param',
      paths: [
        '/catalog/:namespace/:kind/:name',
        '/catalog/entities',
        '/catalog/*',
      ],
      pathname: '/catalog/entities',
    },
    {
      name: 'param wins when the static route cannot cover the extra segments',
      paths: [
        '/catalog/:namespace/:kind/:name',
        '/catalog/entities',
        '/catalog/*',
      ],
      pathname: '/catalog/entities/component/foo',
    },
    {
      name: 'static over longer param pattern',
      paths: ['/x/:a/:b/:c', '/x/y/z'],
      pathname: '/x/y/z',
    },
    {
      name: 'static prefix over a param pattern that swallows the whole path',
      paths: ['/x/y/z', '/x/:a/:b/:c/:d'],
      pathname: '/x/y/z/q/r',
    },
    {
      name: 'parameterized entity basePath',
      paths: ['/catalog', '/catalog/:namespace/:kind/:name'],
      pathname: '/catalog/default/component/wayback-archive/kubernetes',
    },
    {
      name: 'index when fewer segments than param route',
      paths: ['/catalog', '/catalog/:namespace/:kind/:name'],
      pathname: '/catalog/foo',
    },
    {
      name: 'exact index with coexisting param route',
      paths: ['/catalog', '/catalog/:namespace/:kind/:name'],
      pathname: '/catalog',
    },
    { name: 'trailing slash', paths: ['/catalog'], pathname: '/catalog/' },
    {
      name: 'no partial prefix without separator',
      paths: ['/cat', '/catalog'],
      pathname: '/catalog/foo',
    },
    {
      name: 'unmatched without root',
      paths: ['/catalog'],
      pathname: '/unknown',
    },
    {
      name: 'root catch-all',
      paths: ['/', '/catalog'],
      pathname: '/unknown/deep/path',
    },
    { name: 'root exact', paths: ['/', '/catalog'], pathname: '/' },
    {
      name: 'case-insensitive pathname',
      paths: ['/catalog'],
      pathname: '/CATALOG/foo',
    },
    {
      name: 'malformed percent encoding',
      paths: ['/catalog/:name'],
      pathname: '/catalog/100%',
    },
    {
      name: 'splat with an empty remainder',
      paths: ['/docs/*'],
      pathname: '/docs',
    },
  ];

  beforeEach(() => {
    // react-router warns via console.warn when it cannot decode a pathname
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(cases)(
    'RouteTable agrees with matchRoutes on $name',
    ({ paths, pathname }) => {
      const expected = reactRouterExpectation(paths, pathname);

      const tableMatch = new RouteTable(paths).match(pathname);

      expect(tableMatch?.path).toBe(expected.path);
      expect(tableMatch?.basePath).toBe(expected.basePath);
    },
  );

  it.each(cases)(
    'matchRouteRefs agrees with matchRoutes on $name',
    ({ paths, pathname }) => {
      const expected = reactRouterExpectation(paths, pathname);

      const refMatches = matchRouteRefs(toPrefixRoutes(paths), pathname);
      // First match is the registered parent pattern (before the splat child)
      const parent = refMatches?.[0];

      expect(
        parent?.routeObject.path === '' ? '/' : parent?.routeObject.path,
      ).toBe(expected.path);
      expect(parent?.pathname).toBe(expected.basePath);
    },
  );

  it('generates the same paths as react-router for values we do not encode', () => {
    expect(
      generatePath('/entity/:kind/:name', { kind: 'component', name: 'foo' }),
    ).toBe(
      reactRouterGeneratePath('/entity/:kind/:name', {
        kind: 'component',
        name: 'foo',
      }),
    );
    // A trailing `*` belongs to the param value, it is not a splat marker
    expect(generatePath('/search/:term', { term: 'C*' })).toBe(
      reactRouterGeneratePath('/search/:term', { term: 'C*' }),
    );
    // Param names may contain hyphens
    expect(generatePath('/entity/:my-param', { 'my-param': 'x' })).toBe(
      reactRouterGeneratePath('/entity/:my-param', { 'my-param': 'x' }),
    );
    expect(generatePath('/files/*', { '*': 'path/to/file' })).toBe(
      reactRouterGeneratePath('/files/*', { '*': 'path/to/file' }),
    );
    expect(generatePath('/a/:b?/c', {})).toBe(
      reactRouterGeneratePath('/a/:b?/c', {}),
    );
    expect(generatePath('/simple/path')).toBe(
      reactRouterGeneratePath('/simple/path'),
    );
  });

  it('diverges from react-router only where Backstage does so deliberately', () => {
    // We percent-encode characters that would otherwise change the shape of
    // the generated URL; react-router interpolates them verbatim.
    expect(generatePath('/entity/:name', { name: 'a/b?c' })).toBe(
      '/entity/a%2Fb%3Fc',
    );
    expect(reactRouterGeneratePath('/entity/:name', { name: 'a/b?c' })).toBe(
      '/entity/a/b?c',
    );

    // An omitted optional param leaves an empty trailing segment rather than
    // dropping the separator, so resolved route funcs keep a trailing slash.
    expect(generatePath('/entity/:id?', {})).toBe('/entity/');
    expect(reactRouterGeneratePath('/entity/:id?', {})).toBe('/entity');
  });
});
