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

import { AnyParams, RouteRef, ParamKeys } from './types';
import { createRouteRef } from './RouteRef';
import { RouteResolutionApi, RouteFunc } from '@backstage/frontend-plugin-api';

describe('RouteRef', () => {
  it('should be created', () => {
    const routeRef: RouteRef<undefined> = createRouteRef({
      id: 'my-route-ref',
    });
    expect(routeRef.params).toEqual([]);
    expect(String(routeRef)).toMatch(
      /^routeRef\{type=absolute,id=my-route-ref\}$/,
    );
  });

  it('should be created with params', () => {
    const routeRef: RouteRef<{
      x: string;
      y: string;
    }> = createRouteRef({
      id: 'my-other-route-ref',
      params: ['x', 'y'],
    });
    expect(routeRef.params).toEqual(['x', 'y']);
  });

  it('should properly infer and validate parameter types and assignments', () => {
    function validateType<T extends AnyParams>(_ref: RouteRef<T>) {}

    const _1 = createRouteRef({ id: '1', params: ['x'] });
    // @ts-expect-error
    validateType<{ y: string }>(_1);
    // @ts-expect-error
    validateType<undefined>(_1);
    validateType<{ x: string }>(_1);

    const _2 = createRouteRef({ id: '2', params: ['x', 'y'] });
    // @ts-expect-error
    validateType<{ x: string }>(_2);
    // @ts-expect-error
    validateType<undefined>(_2);
    // @ts-expect-error
    validateType<{ x: string; z: string }>(_2);
    // @ts-expect-error
    validateType<{ x: string; y: string; z: string }>(_2);
    validateType<{ x: string; y: string }>(_2);

    const _3 = createRouteRef({ id: '3', params: [] });
    // @ts-expect-error
    validateType<{ x: string }>(_3);
    validateType<undefined>(_3);

    const _4 = createRouteRef({ id: '4' });
    // @ts-expect-error
    validateType<{ x: string }>(_4);
    validateType<undefined>(_4);

    // To avoid complains about missing expectations and unused vars
    expect([_1, _2, _3, _4].join('')).toEqual(expect.any(String));
  });

  it('should properly infer param keys', () => {
    function validateType<T>(_test: T) {}

    validateType<ParamKeys<{ x: string; y: string }>>(['x', 'y']);

    // @ts-expect-error
    validateType<ParamKeys<{}>>(['foo']);
    validateType<ParamKeys<{}>>([]);

    // @ts-expect-error
    validateType<ParamKeys<{ [key in string]: string }>>([1]);
    validateType<ParamKeys<{ [key in string]: string }>>(['foo']);

    // @ts-expect-error
    validateType<ParamKeys<{ [key in string]: string } | undefined>>([1]);
    validateType<ParamKeys<{ [key in string]: string } | undefined>>(['foo']);

    // @ts-expect-error
    validateType<ParamKeys<undefined>>(['foo']);
    validateType<ParamKeys<undefined>>([]);

    expect(true).toBeDefined();
  });

  describe('with new frontend system', () => {
    const routeResolutionApi = { resolve: jest.fn() } as RouteResolutionApi;

    function expectType<T>(): <U>(
      v: U,
    ) => [T, U] extends [U, T] ? { ok(): void } : { invalid: U } {
      return () => ({ ok() {} } as any);
    }

    it('should resolve routes correctly', () => {
      expectType<RouteFunc<undefined> | undefined>()(
        routeResolutionApi.resolve(createRouteRef({ id: '1' })),
      ).ok();
      expectType<RouteFunc<undefined> | undefined>()(
        routeResolutionApi.resolve(createRouteRef({ id: '1' })),
      ).ok();
      expectType<RouteFunc<undefined> | undefined>()(
        routeResolutionApi.resolve(createRouteRef({ id: '1', params: [] })),
      ).ok();

      expectType<RouteFunc<{ x: string }> | undefined>()(
        routeResolutionApi.resolve(createRouteRef({ id: '1', params: ['x'] })),
      ).ok();
      expectType<RouteFunc<{ x: string; y: string }> | undefined>()(
        routeResolutionApi.resolve(
          createRouteRef({ id: '1', params: ['x', 'y'] }),
        ),
      ).ok();

      expect(1).toBe(1);
    });
  });
});
