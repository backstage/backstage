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

    expect(String(internal)).toMatch(
      /^ExternalRouteRef\{created at '.*ExternalRouteRef\.test\.ts.*'\}$/,
    );
    internal.setId('some-id');
    expect(String(internal)).toBe('ExternalRouteRef{some-id}');
  });

  it('should be created with params', () => {
    const routeRef: ExternalRouteRef<{
      x: string;
      y: string;
    }> = createExternalRouteRef({ params: ['x', 'y'] });
    const internal = toInternalExternalRouteRef(routeRef);
    expect(internal.getParams()).toEqual(['x', 'y']);
  });

  it('should properly infer and validate parameter types and assignments', () => {
    function checkRouteRef<T extends AnyRouteRefParams>(
      _ref: ExternalRouteRef<T>,
      _params: T extends undefined ? undefined : T,
    ) {}

    const _1 = createExternalRouteRef();
    checkRouteRef(_1, undefined);
    // @ts-expect-error
    checkRouteRef(_1, { x: '' });

    const _2 = createExternalRouteRef({ params: ['x'] });
    checkRouteRef(_2, { x: '' });
    // @ts-expect-error
    checkRouteRef(_2, { notX: '' });
    // @ts-expect-error
    checkRouteRef(_2, undefined);

    const _3 = createExternalRouteRef({ params: ['x', 'y'] });
    checkRouteRef(_3, { x: '', y: '' });
    // @ts-expect-error
    checkRouteRef(_3, { x: '' });
    // @ts-expect-error
    checkRouteRef(_3, { x: '', y: '', z: '' });

    const _4 = createExternalRouteRef({ params: [] });
    checkRouteRef(_4, undefined);
    // @ts-expect-error
    checkRouteRef(_4, { x: '' });

    // To avoid complains about missing expectations and unused vars
    expect([_1, _2, _3, _4].join('')).toEqual(expect.any(String));
  });
});
