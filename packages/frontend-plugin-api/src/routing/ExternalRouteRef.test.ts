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

import {
  ExternalRouteRef,
  createExternalRouteRef,
  toInternalExternalRouteRef,
} from './ExternalRouteRef';
import { AnyRouteRefParams } from './types';

describe('ExternalRouteRef', () => {
  it('should be created', () => {
    const routeRef: ExternalRouteRef<undefined> = createExternalRouteRef();
    const internal = toInternalExternalRouteRef(routeRef);
    expect(internal.getParams()).toEqual([]);
    expect(internal.optional).toBe(false);

    expect(String(internal)).toMatch(
      /^ExternalRouteRef\{created at '.*ExternalRouteRef\.test\.ts.*'\}$/,
    );
    internal.setId('some-id');
    expect(String(internal)).toBe('ExternalRouteRef{some-id}');
  });

  it('should be created as optional', () => {
    const routeRef: ExternalRouteRef<undefined, true> = createExternalRouteRef({
      params: [],
      optional: true,
    });
    const internal = toInternalExternalRouteRef(routeRef);
    expect(internal.getParams()).toEqual([]);
    expect(internal.optional).toEqual(true);
  });

  it('should be created with params', () => {
    const routeRef: ExternalRouteRef<{
      x: string;
      y: string;
    }> = createExternalRouteRef({ params: ['x', 'y'] });
    const internal = toInternalExternalRouteRef(routeRef);
    expect(internal.getParams()).toEqual(['x', 'y']);
    expect(internal.optional).toEqual(false);
  });

  it('should be created as optional with params', () => {
    const routeRef: ExternalRouteRef<{
      x: string;
      y: string;
    }> = createExternalRouteRef({ params: ['x', 'y'], optional: true });
    const internal = toInternalExternalRouteRef(routeRef);
    expect(internal.getParams()).toEqual(['x', 'y']);
    expect(internal.optional).toEqual(true);
  });

  it('should properly infer and validate parameter types and assignments', () => {
    function checkRouteRef<
      T extends AnyRouteRefParams,
      TOptional extends boolean,
      TCheck extends TOptional,
    >(
      _ref: ExternalRouteRef<T, TOptional>,
      _params: T extends undefined ? undefined : T,
      _optional: TCheck,
    ) {}

    const _1 = createExternalRouteRef({ params: ['notX'] });
    checkRouteRef(_1, { notX: '' }, false);
    // @ts-expect-error
    checkRouteRef(_1, { x: '' }, false);

    const _2 = createExternalRouteRef({ params: ['x'], optional: true });
    checkRouteRef(_2, { x: '' }, true);
    // @ts-expect-error
    checkRouteRef(_2, undefined, false);

    const _3 = createExternalRouteRef({ params: ['x', 'y'] });
    checkRouteRef(_3, { x: '', y: '' }, false);
    // @ts-expect-error
    checkRouteRef(_3, { x: '' }, false);
    // @ts-expect-error
    checkRouteRef(_3, { x: '', y: '', z: '' }, false);

    const _4 = createExternalRouteRef({ params: [] });
    checkRouteRef(_4, undefined, false);
    // @ts-expect-error
    checkRouteRef<any>(_4, { x: '' });

    const _5 = createExternalRouteRef();
    checkRouteRef(_5, undefined, false);
    // @ts-expect-error
    checkRouteRef<any>(_5, { x: '' });

    const _6 = createExternalRouteRef({ optional: true });
    checkRouteRef(_6, undefined, true);
    // @ts-expect-error
    checkRouteRef(_6, undefined, false);

    // To avoid complains about missing expectations and unused vars
    expect([_1, _2, _3, _4, _5, _6].join('')).toEqual(expect.any(String));
  });
});
