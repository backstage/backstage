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

import { AnyRouteRefParams } from './types';
import { RouteRef, createRouteRef } from './RouteRef';
import { OpaqueRouteRef } from '@internal/frontend';

describe('RouteRef', () => {
  it('should be created and have a mutable ID', () => {
    const routeRef: RouteRef<undefined> = createRouteRef();
    const internal = OpaqueRouteRef.toInternal(routeRef);
    expect(internal.T).toBe(undefined);
    expect(internal.getParams()).toEqual([]);
    expect(internal.getDescription()).toMatch(/RouteRef\.test\.ts/);

    expect(String(internal)).toMatch(
      /^routeRef\{id=undefined,at='.*RouteRef\.test\.ts.*'\}$/,
    );

    expect(() => internal.setId('')).toThrow(
      'RouteRef id must be a non-empty string',
    );

    internal.setId('some-id');
    expect(String(internal)).toMatch(
      /^routeRef\{id=some-id,at='.*RouteRef\.test\.ts.*'\}$/,
    );
    internal.setId('some-id'); // Should allow same ID

    expect(() => internal.setId('some-other-id')).toThrow(
      "RouteRef was referenced twice as both 'some-id' and 'some-other-id'",
    );
  });

  it('should be created with params', () => {
    const routeRef: RouteRef<{
      x: string;
      y: string;
    }> = createRouteRef({
      params: ['x', 'y'],
    });
    const internal = OpaqueRouteRef.toInternal(routeRef);
    expect(internal.getParams()).toEqual(['x', 'y']);
    expect(internal.getDescription()).toMatch(/RouteRef\.test\.ts/);
  });

  it('should properly infer and validate parameter types and assignments', () => {
    function checkRouteRef<T extends AnyRouteRefParams>(
      _ref: RouteRef<T>,
      _params: T extends undefined ? undefined : T,
    ) {}

    const _1 = createRouteRef({ params: ['x'] });
    checkRouteRef(_1, { x: '' });
    // @ts-expect-error
    checkRouteRef(_1, { y: '' });
    // @ts-expect-error
    checkRouteRef(_1, undefined);

    const _2 = createRouteRef({ params: ['x', 'y'] });
    checkRouteRef(_2, { x: '', y: '' });
    // @ts-expect-error
    checkRouteRef(_2, { x: '' });
    // @ts-expect-error
    checkRouteRef(_2, undefined);
    // @ts-expect-error
    checkRouteRef(_2, { x: '', z: '' });
    // @ts-expect-error
    checkRouteRef(_2, { x: '', y: '', z: '' });

    const _3 = createRouteRef({ params: [] });
    checkRouteRef(_3, undefined);
    // @ts-expect-error
    checkRouteRef(_3, { x: '' });

    const _4 = createRouteRef();
    checkRouteRef(_4, undefined);
    // @ts-expect-error
    checkRouteRef(_4, { x: '' });

    // To avoid complains about missing expectations and unused vars
    expect([_1, _2, _3, _4].join('')).toEqual(expect.any(String));
  });
});
