/*
 * Copyright 2020 The Backstage Authors
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

import { matchRouteRefs } from './matchRouteRefs';
import { BackstageRouteObject } from './types';
import { createRouteRef, RouteRef } from '@backstage/frontend-plugin-api';

const rest = {
  element: null,
  caseSensitive: false,
  routeRefs: new Set<RouteRef>(),
};

describe('matchRouteRefs', () => {
  it('should match a simple path', () => {
    const routes: BackstageRouteObject[] = [{ ...rest, path: 'catalog' }];

    const result = matchRouteRefs(routes, '/catalog');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result![0].pathname).toBe('/catalog');
  });

  it('should match parameterized routes', () => {
    const routes: BackstageRouteObject[] = [
      { ...rest, path: 'entity/:kind/:name' },
    ];

    const result = matchRouteRefs(routes, '/entity/component/foo');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result![0].pathname).toBe('/entity/component/foo');
    expect(result![0].params).toEqual({ kind: 'component', name: 'foo' });
  });

  it('should match nested routes', () => {
    const ref1 = createRouteRef();
    const ref2 = createRouteRef();

    const routes: BackstageRouteObject[] = [
      {
        ...rest,
        path: 'root',
        routeRefs: new Set([ref1]),
        children: [{ ...rest, path: 'child', routeRefs: new Set([ref2]) }],
      },
    ];

    const result = matchRouteRefs(routes, '/root/child');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(2);
    expect(result![0].pathname).toBe('/root');
    expect(result![0].routeObject.routeRefs).toBe(routes[0].routeRefs);
    expect(result![1].pathname).toBe('/root/child');
    expect(result![1].routeObject.routeRefs).toBe(
      routes[0].children![0].routeRefs,
    );
  });

  it('should match splat routes', () => {
    const routes: BackstageRouteObject[] = [{ ...rest, path: '*' }];

    const result = matchRouteRefs(routes, '/any/nested/path');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result![0].pathname).toBe('/any/nested/path');
  });

  it('should return the full ancestor chain', () => {
    const ref1 = createRouteRef();
    const ref2 = createRouteRef({ params: ['x'] });
    const ref3 = createRouteRef();

    const routes: BackstageRouteObject[] = [
      {
        ...rest,
        path: 'grandparent/:x',
        routeRefs: new Set([ref2]),
        children: [
          {
            ...rest,
            path: 'parent',
            routeRefs: new Set([ref1]),
            children: [
              {
                ...rest,
                path: 'child',
                routeRefs: new Set([ref3]),
              },
            ],
          },
        ],
      },
    ];

    const result = matchRouteRefs(routes, '/grandparent/my-x/parent/child');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(3);
    expect(result![0].pathname).toBe('/grandparent/my-x');
    expect(result![1].pathname).toBe('/grandparent/my-x/parent');
    expect(result![2].pathname).toBe('/grandparent/my-x/parent/child');
  });

  it('should return null for unmatched paths', () => {
    const routes: BackstageRouteObject[] = [{ ...rest, path: 'catalog' }];

    const result = matchRouteRefs(routes, '/unknown');
    expect(result).toBeNull();
  });

  it('should prefer specific routes over splat routes', () => {
    const ref1 = createRouteRef();
    const ref2 = createRouteRef();

    const routes: BackstageRouteObject[] = [
      {
        ...rest,
        path: 'root',
        routeRefs: new Set([ref1]),
        children: [
          { ...rest, path: '*' },
          {
            ...rest,
            path: 'specific',
            routeRefs: new Set([ref2]),
          },
        ],
      },
    ];

    const result = matchRouteRefs(routes, '/root/specific');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(2);
    expect(result![1].routeObject.routeRefs).toBe(
      routes[0].children![1].routeRefs,
    );
  });

  it('should fall back to splat when no specific match', () => {
    const ref1 = createRouteRef();

    const routes: BackstageRouteObject[] = [
      {
        ...rest,
        path: 'root',
        routeRefs: new Set([ref1]),
        children: [
          { ...rest, path: '*' },
          { ...rest, path: 'specific' },
        ],
      },
    ];

    const result = matchRouteRefs(routes, '/root/anything/else');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(2);
    expect(result![1].routeObject.path).toBe('*');
  });

  it('should handle string location input', () => {
    const routes: BackstageRouteObject[] = [{ ...rest, path: 'catalog' }];

    const result = matchRouteRefs(routes, '/catalog');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
  });

  it('should match parameterized route with catch-all child over empty root route', () => {
    const ref0 = createRouteRef();
    const ref1 = createRouteRef();

    const routes: BackstageRouteObject[] = [
      {
        ...rest,
        path: '',
        routeRefs: new Set([ref0]),
        children: [{ ...rest, path: '*' }],
      },
      {
        ...rest,
        path: '/path/:p1/:p2',
        routeRefs: new Set([ref1]),
        children: [{ ...rest, path: '*' }],
      },
    ];

    const result = matchRouteRefs(routes, '/path/foo/bar');
    expect(result).not.toBeNull();
    // Should match the /path/:p1/:p2 route, not the root
    const paramRoute = result!.find(
      m => m.routeObject.path === '/path/:p1/:p2',
    );
    expect(paramRoute).toBeDefined();
    expect(paramRoute!.params).toEqual({ p1: 'foo', p2: 'bar' });
  });

  it('should match sub-route through parameterized parent with catch-all', () => {
    const ref1 = createRouteRef();

    const routes: BackstageRouteObject[] = [
      {
        ...rest,
        path: '/path2/:param',
        routeRefs: new Set([ref1]),
        children: [{ ...rest, path: '*' }],
      },
    ];

    const result = matchRouteRefs(routes, '/path2/param-value/sub-route');
    expect(result).not.toBeNull();
    const parentMatch = result!.find(
      m => m.routeObject.path === '/path2/:param',
    );
    expect(parentMatch).toBeDefined();
    expect(parentMatch!.params).toEqual({ param: 'param-value' });
  });
});
