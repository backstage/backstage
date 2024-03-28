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
  createRouteRef,
  createSubRouteRef,
  createExternalRouteRef,
  ExternalRouteRef,
  RouteRef,
  SubRouteRef,
} from '@backstage/frontend-plugin-api';
import { BackstagePlugin } from '@backstage/core-plugin-api';
import { RouteResolver } from './RouteResolver';
import { MATCH_ALL_ROUTE } from './extractRouteInfoFromAppNode';

const rest = {
  element: null,
  caseSensitive: false,
  children: [MATCH_ALL_ROUTE],
  plugins: new Set<BackstagePlugin>(),
};

const ref1 = createRouteRef();
const ref2 = createRouteRef({ params: ['x'] });
const ref3 = createRouteRef({ params: ['y'] });
const subRef1 = createSubRouteRef({ parent: ref1, path: '/foo' });
const subRef2 = createSubRouteRef({ parent: ref1, path: '/foo/:a' });
const subRef3 = createSubRouteRef({ parent: ref2, path: '/bar' });
const subRef4 = createSubRouteRef({ parent: ref2, path: '/bar/:a' });
const externalRef1 = createExternalRouteRef();
const externalRef2 = createExternalRouteRef({ optional: true });
const externalRef3 = createExternalRouteRef({ params: ['x'] });
const externalRef4 = createExternalRouteRef({ optional: true, params: ['x'] });

function src(sourcePath: string) {
  return { sourcePath };
}

describe('RouteResolver', () => {
  it('should not resolve anything with an empty resolver', () => {
    const r = new RouteResolver(new Map(), new Map(), [], new Map(), '');

    expect(r.resolve(ref1, src('/'))?.()).toBe(undefined);
    expect(r.resolve(ref2, src('/'))?.({ x: '1x' })).toBe(undefined);
    expect(r.resolve(subRef1, src('/'))?.()).toBe(undefined);
    expect(r.resolve(subRef2, src('/'))?.({ a: '2a' })).toBe(undefined);
    expect(r.resolve(subRef3, src('/'))?.({ x: '3x' })).toBe(undefined);
    expect(r.resolve(subRef4, src('/'))?.({ x: '4x', a: '4a' })).toBe(
      undefined,
    );
    expect(r.resolve(externalRef1, src('/'))?.()).toBe(undefined);
    expect(r.resolve(externalRef2, src('/'))?.()).toBe(undefined);
    expect(r.resolve(externalRef3, src('/'))?.({ x: '5x' })).toBe(undefined);
    expect(r.resolve(externalRef4, src('/'))?.({ x: '6x' })).toBe(undefined);
  });

  it('should resolve an absolute route', () => {
    const r = new RouteResolver(
      new Map([[ref1, 'my-route']]),
      new Map(),
      [{ routeRefs: new Set([ref1]), path: 'my-route', ...rest }],
      new Map(),
      '',
    );

    expect(r.resolve(ref1, src('/'))?.()).toBe('/my-route');
    expect(r.resolve(ref2, src('/'))?.({ x: '1x' })).toBe(undefined);
    expect(r.resolve(subRef1, src('/'))?.()).toBe('/my-route/foo');
    expect(r.resolve(subRef2, src('/'))?.({ a: '2a' })).toBe(
      '/my-route/foo/2a',
    );
    expect(r.resolve(subRef3, src('/'))?.({ x: '3x' })).toBe(undefined);
    expect(r.resolve(subRef4, src('/'))?.({ x: '4x', a: '4a' })).toBe(
      undefined,
    );
    expect(r.resolve(externalRef1, src('/'))?.()).toBe(undefined);
    expect(r.resolve(externalRef2, src('/'))?.()).toBe(undefined);
    expect(r.resolve(externalRef3, src('/'))?.({ x: '5x' })).toBe(undefined);
    expect(r.resolve(externalRef4, src('/'))?.({ x: '6x' })).toBe(undefined);
  });

  it('should resolve an absolute route and sub route with an app base path', () => {
    const r = new RouteResolver(
      new Map<RouteRef, string>([
        [ref2, 'my-parent/:x'],
        [ref1, 'my-route'],
      ]),
      new Map<RouteRef, RouteRef>([[ref1, ref2]]),
      [
        {
          routeRefs: new Set([ref2]),
          path: 'my-parent/:x',
          ...rest,
          children: [
            MATCH_ALL_ROUTE,
            { routeRefs: new Set([ref1]), path: 'my-route', ...rest },
          ],
        },
      ],
      new Map(),
      '/base',
    );

    expect(r.resolve(ref1, src('/my-parent/1x'))?.()).toBe(
      '/base/my-parent/1x/my-route',
    );
    expect(r.resolve(ref1, src('/base/my-parent/1x'))?.()).toBe(
      '/base/my-parent/1x/my-route',
    );
    expect(r.resolve(ref2, src('/'))?.({ x: '1x' })).toBe('/base/my-parent/1x');
    expect(r.resolve(ref2, src('/base'))?.({ x: '1x' })).toBe(
      '/base/my-parent/1x',
    );
    expect(r.resolve(ref3, src('/'))?.({ y: '1y' })).toBe(undefined);
    expect(r.resolve(subRef1, src('/my-parent/2x'))?.()).toBe(
      '/base/my-parent/2x/my-route/foo',
    );
    expect(r.resolve(subRef1, src('/base/my-parent/2x'))?.()).toBe(
      '/base/my-parent/2x/my-route/foo',
    );
    expect(r.resolve(subRef2, src('/my-parent/3x'))?.({ a: '2a' })).toBe(
      '/base/my-parent/3x/my-route/foo/2a',
    );
    expect(r.resolve(subRef2, src('/base/my-parent/3x'))?.({ a: '2a' })).toBe(
      '/base/my-parent/3x/my-route/foo/2a',
    );
    expect(r.resolve(subRef3, src('/'))?.({ x: '5x' })).toBe(
      '/base/my-parent/5x/bar',
    );
    expect(r.resolve(subRef4, src('/'))?.({ x: '6x', a: '4a' })).toBe(
      '/base/my-parent/6x/bar/4a',
    );
    expect(r.resolve(externalRef1, src('/'))?.()).toBe(undefined);
    expect(r.resolve(externalRef2, src('/'))?.()).toBe(undefined);
    expect(r.resolve(externalRef3, src('/'))?.({ x: '5x' })).toBe(undefined);
    expect(r.resolve(externalRef4, src('/'))?.({ x: '6x' })).toBe(undefined);
  });

  it('should resolve an absolute route with a param and with a parent', () => {
    const r = new RouteResolver(
      new Map<RouteRef, string>([
        [ref1, 'my-route'],
        [ref2, 'my-parent/:x'],
      ]),
      new Map([[ref2, ref1]]),
      [
        {
          routeRefs: new Set([ref2]),
          path: 'my-parent/:x',
          ...rest,
          children: [
            MATCH_ALL_ROUTE,
            { routeRefs: new Set([ref1]), path: 'my-route', ...rest },
          ],
        },
      ],
      new Map<ExternalRouteRef, RouteRef | SubRouteRef>([
        [externalRef1, ref1],
        [externalRef3, ref2],
        [externalRef4, subRef3],
      ]),
      '',
    );

    expect(r.resolve(ref1, src('/'))?.()).toBe('/my-route');
    expect(r.resolve(ref2, src('/'))?.({ x: '1x' })).toBe(
      '/my-route/my-parent/1x',
    );
    expect(r.resolve(subRef1, src('/'))?.()).toBe('/my-route/foo');
    expect(r.resolve(subRef2, src('/'))?.({ a: '2a' })).toBe(
      '/my-route/foo/2a',
    );
    expect(r.resolve(subRef3, src('/'))?.({ x: '3x' })).toBe(
      '/my-route/my-parent/3x/bar',
    );
    expect(r.resolve(subRef4, src('/'))?.({ x: '4x', a: '4a' })).toBe(
      '/my-route/my-parent/4x/bar/4a',
    );
    expect(r.resolve(externalRef1, src('/'))?.()).toBe('/my-route');
    expect(r.resolve(externalRef2, src('/'))?.()).toBe(undefined);
    expect(r.resolve(externalRef3, src('/'))?.({ x: '5x' })).toBe(
      '/my-route/my-parent/5x',
    );
    expect(r.resolve(externalRef4, src('/'))?.({ x: '6x' })).toBe(
      '/my-route/my-parent/6x/bar',
    );
  });

  it('should resolve the most specific match', () => {
    const r = new RouteResolver(
      new Map<RouteRef, string>([
        [ref1, 'deep'],
        [ref2, 'root/:x'],
        [ref3, 'sub/:y'],
      ]),
      new Map<RouteRef, RouteRef>([
        [ref3, ref2],
        [ref1, ref3],
      ]),
      [
        {
          routeRefs: new Set([ref2]),
          path: 'root/:x',
          ...rest,
          children: [
            MATCH_ALL_ROUTE,
            {
              routeRefs: new Set([ref3]),
              path: 'sub/:y',
              ...rest,
              children: [
                MATCH_ALL_ROUTE,
                {
                  routeRefs: new Set([ref1]),
                  path: 'deep',
                  ...rest,
                },
              ],
            },
          ],
        },
      ],
      new Map<ExternalRouteRef, RouteRef | SubRouteRef>(),
      '',
    );

    expect(r.resolve(ref2, src('/'))?.({ x: 'x' })).toBe('/root/x');
    expect(r.resolve(ref3, src('/root/x'))?.({ y: 'y' })).toBe('/root/x/sub/y');

    expect(() => r.resolve(ref1, src('/'))?.()).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(() => r.resolve(ref1, src('/root/x'))?.()).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(r.resolve(ref1, src('/root/x/sub/y'))?.()).toBe(
      '/root/x/sub/y/deep',
    );
    // Without the MATCH_ALL_ROUTE, we wouldn't properly match the route here
    expect(r.resolve(ref1, src('/root/x/sub/y/any/nested/path/here'))?.()).toBe(
      '/root/x/sub/y/deep',
    );
  });

  it('should resolve an absolute route with multiple parents', () => {
    const r = new RouteResolver(
      new Map<RouteRef, string>([
        [ref1, 'my-route'],
        [ref2, 'my-parent/:x'],
        [ref3, 'my-grandparent/:y'],
      ]),
      new Map<RouteRef, RouteRef>([
        [ref1, ref2],
        [ref2, ref3],
      ]),
      [
        {
          routeRefs: new Set([ref3]),
          path: 'my-grandparent/:y',
          ...rest,
          children: [
            MATCH_ALL_ROUTE,
            {
              routeRefs: new Set([ref2]),
              path: 'my-parent/:x',
              ...rest,
              children: [
                MATCH_ALL_ROUTE,
                { routeRefs: new Set([ref1]), path: 'my-route', ...rest },
              ],
            },
          ],
        },
      ],
      new Map<ExternalRouteRef, RouteRef | SubRouteRef>([
        [externalRef1, ref1],
        [externalRef3, ref2],
        [externalRef4, subRef3],
      ]),
      '',
    );

    const l = '/my-grandparent/my-y/my-parent/my-x';
    expect(r.resolve(ref1, src(l))?.()).toBe(
      '/my-grandparent/my-y/my-parent/my-x/my-route',
    );
    expect(() => r.resolve(ref1, src('/'))?.()).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(r.resolve(ref2, src(l))?.({ x: '1x' })).toBe(
      '/my-grandparent/my-y/my-parent/1x',
    );
    expect(r.resolve(ref2, src('/my-grandparent/my-y'))?.({ x: '1x' })).toBe(
      '/my-grandparent/my-y/my-parent/1x',
    );
    expect(() => r.resolve(ref2, src('/'))?.({ x: '1x' })).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(r.resolve(subRef1, src(l))?.()).toBe(
      '/my-grandparent/my-y/my-parent/my-x/my-route/foo',
    );
    expect(() => r.resolve(subRef1, src('/'))?.()).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(r.resolve(subRef2, src(l))?.({ a: '2a' })).toBe(
      '/my-grandparent/my-y/my-parent/my-x/my-route/foo/2a',
    );
    expect(() => r.resolve(subRef2, src('/'))?.({ a: '2a' })).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(r.resolve(subRef3, src(l))?.({ x: '3x' })).toBe(
      '/my-grandparent/my-y/my-parent/3x/bar',
    );
    expect(r.resolve(subRef3, src('/my-grandparent/my-y'))?.({ x: '3x' })).toBe(
      '/my-grandparent/my-y/my-parent/3x/bar',
    );
    expect(r.resolve(subRef4, src(l))?.({ x: '4x', a: '4a' })).toBe(
      '/my-grandparent/my-y/my-parent/4x/bar/4a',
    );
    expect(
      r.resolve(subRef4, src('/my-grandparent/my-y'))?.({ x: '4x', a: '4a' }),
    ).toBe('/my-grandparent/my-y/my-parent/4x/bar/4a');
    expect(r.resolve(externalRef1, src(l))?.()).toBe(
      '/my-grandparent/my-y/my-parent/my-x/my-route',
    );
    expect(() => r.resolve(externalRef1, src('/'))?.()).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(r.resolve(externalRef2, src(l))?.()).toBe(undefined);
    expect(r.resolve(externalRef3, src(l))?.({ x: '5x' })).toBe(
      '/my-grandparent/my-y/my-parent/5x',
    );
    expect(() => r.resolve(externalRef3, src('/'))?.({ x: '5x' })).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(r.resolve(externalRef4, src(l))?.({ x: '6x' })).toBe(
      '/my-grandparent/my-y/my-parent/6x/bar',
    );
    expect(() => r.resolve(externalRef4, src('/'))?.({ x: '6x' })).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
  });

  it('should encode some characters in params', () => {
    const r = new RouteResolver(
      new Map<RouteRef, string>([
        [ref2, 'my-parent/:x'],
        [ref1, 'my-route'],
      ]),
      new Map<RouteRef, RouteRef>([[ref1, ref2]]),
      [
        {
          routeRefs: new Set([ref2]),
          path: 'my-parent/:x',
          ...rest,
          children: [
            MATCH_ALL_ROUTE,
            { routeRefs: new Set([ref1]), path: 'my-route', ...rest },
          ],
        },
      ],
      new Map(),
      '/base',
    );

    expect(r.resolve(ref2, src('/'))?.({ x: 'a/#&?b' })).toBe(
      '/base/my-parent/a%2F%23%26%3Fb',
    );
  });
});
