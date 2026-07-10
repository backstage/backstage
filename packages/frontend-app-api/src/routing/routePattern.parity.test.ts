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
import { RouteTable } from './RouteTable';
import { matchRouteRefs } from './matchRouteRefs';
import { BackstageRouteObject } from './types';
import { routePriority } from './routePattern';

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
  return paths.map(path => {
    if (path === '/') {
      return {
        ...rest,
        path: '',
        routeRefs: new Set([createRouteRef()]),
        children: [{ ...rest, path: '*' }],
      };
    }
    return {
      ...rest,
      path,
      routeRefs: new Set([createRouteRef()]),
      children: [{ ...rest, path: '*' }],
    };
  });
}

describe('RouteTable / matchRouteRefs parity', () => {
  const cases: Array<{
    name: string;
    paths: string[];
    pathname: string;
    expectedPath: string | undefined;
    expectedBasePath: string | undefined;
  }> = [
    {
      name: 'simple prefix',
      paths: ['/catalog', '/scaffolder'],
      pathname: '/catalog/foo',
      expectedPath: '/catalog',
      expectedBasePath: '/catalog',
    },
    {
      name: 'static over param',
      paths: [
        '/catalog/:namespace/:kind/:name',
        '/catalog/entities',
        '/catalog/*',
      ],
      pathname: '/catalog/entities',
      expectedPath: '/catalog/entities',
      expectedBasePath: '/catalog/entities',
    },
    {
      name: 'static over longer param pattern',
      paths: ['/x/:a/:b/:c', '/x/y/z'],
      pathname: '/x/y/z',
      expectedPath: '/x/y/z',
      expectedBasePath: '/x/y/z',
    },
    {
      name: 'parameterized entity basePath',
      paths: ['/catalog', '/catalog/:namespace/:kind/:name'],
      pathname: '/catalog/default/component/wayback-archive/kubernetes',
      expectedPath: '/catalog/:namespace/:kind/:name',
      expectedBasePath: '/catalog/default/component/wayback-archive',
    },
    {
      name: 'index when fewer segments than param route',
      paths: ['/catalog', '/catalog/:namespace/:kind/:name'],
      pathname: '/catalog/foo',
      expectedPath: '/catalog',
      expectedBasePath: '/catalog',
    },
    {
      name: 'exact index with coexisting param route',
      paths: ['/catalog', '/catalog/:namespace/:kind/:name'],
      pathname: '/catalog',
      expectedPath: '/catalog',
      expectedBasePath: '/catalog',
    },
    {
      name: 'no partial prefix without separator',
      paths: ['/cat', '/catalog'],
      pathname: '/catalog/foo',
      expectedPath: '/catalog',
      expectedBasePath: '/catalog',
    },
    {
      name: 'unmatched without root',
      paths: ['/catalog'],
      pathname: '/unknown',
      expectedPath: undefined,
      expectedBasePath: undefined,
    },
  ];

  it.each(cases)(
    'agrees on $name',
    ({ paths, pathname, expectedPath, expectedBasePath }) => {
      const tableMatch = new RouteTable(paths).match(pathname);

      expect(tableMatch?.path).toBe(expectedPath);
      expect(tableMatch?.basePath).toBe(expectedBasePath);

      const refMatches = matchRouteRefs(toPrefixRoutes(paths), pathname);
      // First match is the registered parent pattern (before splat child)
      const parent = refMatches?.[0];
      expect(
        parent?.routeObject.path === '' ? '/' : parent?.routeObject.path,
      ).toBe(expectedPath);
      expect(parent?.pathname).toBe(expectedBasePath);
    },
  );

  it('shares the same priority ordering for overlapping patterns', () => {
    // Longer param patterns score higher than shorter static ones; matching
    // still prefers static when the param pattern does not fit the pathname
    // (see RouteTable "prefer static segments" cases).
    expect(routePriority('/catalog/:namespace/:kind/:name')).toBeGreaterThan(
      routePriority('/catalog/entities'),
    );
    expect(routePriority('/catalog/entities')).toBeGreaterThan(
      routePriority('/catalog'),
    );
    expect(routePriority('/x/y/z')).toBeGreaterThan(
      routePriority('/x/:a/:b/:c'),
    );
    expect(routePriority('/catalog')).toBeGreaterThan(
      routePriority('/catalog/*'),
    );
    expect(routePriority('/catalog/*')).toBe(routePriority('/'));
    expect(routePriority('/')).toBe(routePriority(''));
    expect(routePriority('*')).toBeLessThan(routePriority('/'));
  });
});
