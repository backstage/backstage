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
import {
  SubRouteRef,
  createSubRouteRef,
  toInternalSubRouteRef,
} from './SubRouteRef';
import { createRouteRef, toInternalRouteRef } from './RouteRef';

const parent = createRouteRef();
const parentX = createRouteRef({ params: ['x'] });

describe('SubRouteRef', () => {
  it('should be created', () => {
    const internalParent = toInternalRouteRef(createRouteRef());
    const routeRef: SubRouteRef = createSubRouteRef({
      parent: internalParent,
      path: '/foo',
    });
    const internal = toInternalSubRouteRef(routeRef);
    expect(internal.path).toBe('/foo');
    expect(internal.T).toBe(undefined);
    expect(internal.getParent()).toBe(internalParent);
    expect(internal.getParams()).toEqual([]);
    expect(String(internal)).toMatch(
      /SubRouteRef\{at \/foo with parent created at '.*SubRouteRef\.test\.ts.*'\}/,
    );
    internalParent.setId('some-id');
    expect(String(internal)).toBe('SubRouteRef{at /foo with parent some-id}');
  });

  it('should be created with params', () => {
    const routeRef: SubRouteRef<{ bar: string }> = createSubRouteRef({
      parent,
      path: '/foo/:bar',
    });
    const internal = toInternalSubRouteRef(routeRef);
    expect(internal.path).toBe('/foo/:bar');
    expect(internal.getParent()).toBe(parent);
    expect(internal.getParams()).toEqual(['bar']);
  });

  it('should be created with merged params', () => {
    const routeRef: SubRouteRef<{
      x: string;
      y: string;
      z: string;
    }> = createSubRouteRef({
      parent: parentX,
      path: '/foo/:y/:z',
    });
    const internal = toInternalSubRouteRef(routeRef);
    expect(internal.path).toBe('/foo/:y/:z');
    expect(internal.getParent()).toBe(parentX);
    expect(internal.getParams()).toEqual(['x', 'y', 'z']);
  });

  it('should be created with params from parent', () => {
    const routeRef: SubRouteRef<{ x: string }> = createSubRouteRef({
      parent: parentX,
      path: '/foo/bar',
    });
    const internal = toInternalSubRouteRef(routeRef);
    expect(internal.path).toBe('/foo/bar');
    expect(internal.getParent()).toBe(parentX);
    expect(internal.getParams()).toEqual(['x']);
  });

  it.each([
    ['foo', "SubRouteRef path must start with '/', got 'foo'"],
    [':foo', "SubRouteRef path must start with '/', got ':foo'"],
    ['', "SubRouteRef path must start with '/', got ''"],
    ['/', "SubRouteRef path must not end with '/', got '/'"],
    ['/foo/', "SubRouteRef path must not end with '/', got '/foo/'"],
    ['/foo/:x', 'SubRouteRef may not have params that overlap with its parent'],
    ['/:/foo', "SubRouteRef path has invalid param, got ''"],
    ['/:inva:lid/foo', "SubRouteRef path has invalid param, got 'inva:lid'"],
    ['/:inva=lid/foo', "SubRouteRef path has invalid param, got 'inva=lid'"],
  ])('should throw if path is invalid, %s', (path, message) => {
    expect(() => createSubRouteRef({ path, parent: parentX })).toThrow(message);
  });

  it('should properly infer and parse path parameters', () => {
    function checkSubRouteRef<T extends AnyRouteRefParams>(
      _ref: SubRouteRef<T>,
      _params: T extends undefined ? undefined : T,
    ) {}

    const _1 = createSubRouteRef({ parent, path: '/foo/bar' });
    // @ts-expect-error
    checkSubRouteRef(_1, { x: '' });
    checkSubRouteRef(_1, undefined);

    const _2 = createSubRouteRef({ parent, path: '/foo/:x/:y' });
    // @ts-expect-error
    checkSubRouteRef(_2, undefined);
    // @ts-expect-error
    checkSubRouteRef(_2, { x: '', z: '' });
    // @ts-expect-error
    checkSubRouteRef(_2, { y: '' });
    // @ts-expect-error
    checkSubRouteRef(_2, { x: '', y: '', z: '' });
    checkSubRouteRef(_2, { x: '', y: '' });

    const _3 = createSubRouteRef({ parent: parentX, path: '/foo' });
    // @ts-expect-error
    checkSubRouteRef(_3, undefined);
    // @ts-expect-error
    checkSubRouteRef(_3, { y: '' });
    checkSubRouteRef(_3, { x: '' });

    const _4 = createSubRouteRef({ parent: parentX, path: '/foo/:y' });
    // @ts-expect-error
    checkSubRouteRef(_4, undefined);
    // @ts-expect-error
    checkSubRouteRef(_4, { x: '', z: '' });
    // @ts-expect-error
    checkSubRouteRef(_4, { y: '' });
    checkSubRouteRef(_4, { x: '', y: '' });

    // To avoid complains about missing expectations and unused vars
    expect([_1, _2, _3, _4].join('')).toEqual(expect.any(String));
  });
});
