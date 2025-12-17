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
import {
  BackstagePlugin,
  createRouteRef as createLegacyRouteRef,
  createSubRouteRef as createLegacySubRouteRef,
  createExternalRouteRef as createLegacyExternalRouteRef,
} from '@backstage/core-plugin-api';
import { MockRouterApi } from '@backstage/frontend-test-utils';
import { RouteResolver } from './RouteResolver';
import { MATCH_ALL_ROUTE } from './extractRouteInfoFromAppNode';
import {
  createExactRouteAliasResolver,
  createRouteAliasResolver,
} from './RouteAliasResolver';

const mockRouter = new MockRouterApi();
const matchRoutes = mockRouter.matchRoutes.bind(mockRouter);
const generatePath = mockRouter.generatePath.bind(mockRouter);

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
const externalRef2 = createExternalRouteRef({ params: ['x'] });

function src(sourcePath: string) {
  return { sourcePath };
}

const emptyResolver = createExactRouteAliasResolver(new Map());

describe('RouteResolver', () => {
  it('should not resolve anything with an empty resolver', () => {
    const r = new RouteResolver(
      new Map(),
      new Map(),
      [],
      new Map(),
      '',
      emptyResolver,
      new Map(),
      matchRoutes,
      generatePath,
    );

    expect(r.resolve(ref1, src('/'))?.()).toBe(undefined);
    expect(r.resolve(ref2, src('/'))?.({ x: '1x' })).toBe(undefined);
    expect(r.resolve(subRef1, src('/'))?.()).toBe(undefined);
    expect(r.resolve(subRef2, src('/'))?.({ a: '2a' })).toBe(undefined);
    expect(r.resolve(subRef3, src('/'))?.({ x: '3x' })).toBe(undefined);
    expect(r.resolve(subRef4, src('/'))?.({ x: '4x', a: '4a' })).toBe(
      undefined,
    );
    expect(r.resolve(externalRef1, src('/'))?.()).toBe(undefined);
    expect(r.resolve(externalRef2, src('/'))?.({ x: '5x' })).toBe(undefined);
  });

  it('should resolve an absolute route', () => {
    const r = new RouteResolver(
      new Map([[ref1, 'my-route']]),
      new Map(),
      [{ routeRefs: new Set([ref1]), path: 'my-route', ...rest }],
      new Map(),
      '',
      emptyResolver,
      new Map(),
      matchRoutes,
      generatePath,
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
    expect(r.resolve(externalRef2, src('/'))?.({ x: '5x' })).toBe(undefined);
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
        [externalRef2, subRef3],
      ]),
      '',
      emptyResolver,
      new Map(),
      matchRoutes,
      generatePath,
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
    expect(r.resolve(externalRef2, src('/'))?.({ x: '6x' })).toBe(
      '/my-route/my-parent/6x/bar',
    );
  });

  it('should resolve a route with an alias', () => {
    const r = new RouteResolver(
      new Map<RouteRef, string>([[ref1, 'my-route']]),
      new Map(),
      [
        {
          routeRefs: new Set([ref1]),
          path: 'my-route',
          ...rest,
          children: [],
        },
      ],
      new Map<ExternalRouteRef, RouteRef | SubRouteRef>(),
      '',
      createRouteAliasResolver({
        routes: new Map([['test.ref1', ref1]]),
        externalRoutes: new Map(),
      }),
      new Map(),
      matchRoutes,
      generatePath,
    );

    expect(r.resolve(ref1, src('/'))?.()).toBe('/my-route');
    expect(
      r.resolve(createRouteRef({ aliasFor: 'test.ref1' }), src('/'))?.(),
    ).toBe('/my-route');
  });

  it('should resolve default route ref targets lazily', () => {
    // Same of the common test ones, but not bound and with default targets
    const externalRefDefault1 = createExternalRouteRef({
      defaultTarget: 'test.root',
    });
    const externalRefDefault2 = createExternalRouteRef({
      params: ['x'],
      defaultTarget: 'test.param',
    });

    const r = new RouteResolver(
      new Map<RouteRef, string>([
        [ref1, 'my-route'],
        [ref2, 'my-parent/:x'],
      ]),
      new Map(),
      [
        {
          routeRefs: new Set([ref1]),
          path: 'my-route',
          ...rest,
          children: [],
        },
        {
          routeRefs: new Set([ref2]),
          path: 'my-parent',
          ...rest,
          children: [],
        },
      ],
      new Map<ExternalRouteRef, RouteRef | SubRouteRef>([
        [externalRef1, ref1],
        [externalRef2, subRef3],
      ]),
      '',
      createRouteAliasResolver({
        routes: new Map([['test.param', ref2]]),
        externalRoutes: new Map(),
      }),
      new Map<string, RouteRef | SubRouteRef>([
        ['test.root', subRef1],
        ['test.param', ref2],
      ]),
      matchRoutes,
      generatePath,
    );

    expect(r.resolve(externalRef1, src('/'))?.()).toBe('/my-route');
    expect(r.resolve(externalRefDefault1, src('/'))?.()).toBe('/my-route/foo');
    expect(r.resolve(externalRef2, src('/'))?.({ x: '1x' })).toBe(
      '/my-parent/1x/bar',
    );
    expect(r.resolve(externalRefDefault2, src('/'))?.({ x: '1x' })).toBe(
      '/my-parent/1x',
    );
    expect(
      r.resolve(
        createRouteRef({ aliasFor: 'test.param', params: ['x'] }),
        src('/'),
      )?.({ x: '1x' }),
    ).toBe('/my-parent/1x');
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
      emptyResolver,
      new Map(),
      matchRoutes,
      generatePath,
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
        [externalRef2, subRef3],
      ]),
      '',
      emptyResolver,
      new Map(),
      matchRoutes,
      generatePath,
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
    expect(r.resolve(externalRef2, src(l))?.({ x: '5x' })).toBe(
      '/my-grandparent/my-y/my-parent/5x/bar',
    );
    expect(() => r.resolve(externalRef2, src('/'))?.({ x: '5x' })).toThrow(
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
      '',
      emptyResolver,
      new Map(),
      matchRoutes,
      generatePath,
    );

    expect(r.resolve(ref2, src('/'))?.({ x: 'a/#&?b' })).toBe(
      '/my-parent/a%2F%23%26%3Fb',
    );
  });

  describe('with legacy route refs', () => {
    const legacyRef1 = createLegacyRouteRef({ id: 'ref1' });
    const legacyRef2 = createLegacyRouteRef({ id: 'ref2', params: ['x'] });
    const legacyRef3 = createLegacyRouteRef({ id: 'ref3', params: ['y'] });
    const legacySubRef1 = createLegacySubRouteRef({
      id: 'sub1',
      parent: legacyRef1,
      path: '/foo',
    });
    const legacySubRef2 = createLegacySubRouteRef({
      id: 'sub2',
      parent: legacyRef1,
      path: '/foo/:a',
    });
    const legacySubRef3 = createLegacySubRouteRef({
      id: 'sub3',
      parent: legacyRef2,
      path: '/bar',
    });
    const legacySubRef4 = createLegacySubRouteRef({
      id: 'sub4',
      parent: legacyRef2,
      path: '/bar/:a',
    });
    const legacyExternalRef1 = createLegacyExternalRouteRef({
      id: 'external1',
    });
    const legacyExternalRef2 = createLegacyExternalRouteRef({
      id: 'external2',
      params: ['x'],
    });

    it('should not resolve anything with an empty resolver', () => {
      const r = new RouteResolver(
        new Map(),
        new Map(),
        [],
        new Map(),
        '',
        emptyResolver,
        new Map(),
        matchRoutes,
        generatePath,
      );

      expect(r.resolve(legacyRef1, src('/'))?.()).toBe(undefined);
      expect(r.resolve(legacyRef2, src('/'))?.({ x: '1x' })).toBe(undefined);
      expect(r.resolve(legacySubRef1, src('/'))?.()).toBe(undefined);
      expect(r.resolve(legacySubRef2, src('/'))?.({ a: '2a' })).toBe(undefined);
      expect(r.resolve(legacySubRef3, src('/'))?.({ x: '3x' })).toBe(undefined);
      expect(r.resolve(legacySubRef4, src('/'))?.({ x: '4x', a: '4a' })).toBe(
        undefined,
      );
      expect(r.resolve(legacyExternalRef1, src('/'))?.()).toBe(undefined);
      expect(r.resolve(legacyExternalRef2, src('/'))?.({ x: '5x' })).toBe(
        undefined,
      );
    });

    it('should resolve an absolute route', () => {
      const r = new RouteResolver(
        new Map([[legacyRef1, 'my-route']]),
        new Map(),
        [{ routeRefs: new Set([legacyRef1]), path: 'my-route', ...rest }],
        new Map(),
        '',
        emptyResolver,
        new Map(),
        matchRoutes,
        generatePath,
      );

      expect(r.resolve(legacyRef1, src('/'))?.()).toBe('/my-route');
      expect(r.resolve(legacyRef2, src('/'))?.({ x: '1x' })).toBe(undefined);
      expect(r.resolve(legacySubRef1, src('/'))?.()).toBe('/my-route/foo');
      expect(r.resolve(legacySubRef2, src('/'))?.({ a: '2a' })).toBe(
        '/my-route/foo/2a',
      );
      expect(r.resolve(legacySubRef3, src('/'))?.({ x: '3x' })).toBe(undefined);
      expect(r.resolve(legacySubRef4, src('/'))?.({ x: '4x', a: '4a' })).toBe(
        undefined,
      );
      expect(r.resolve(legacyExternalRef1, src('/'))?.()).toBe(undefined);
      expect(r.resolve(legacyExternalRef2, src('/'))?.({ x: '5x' })).toBe(
        undefined,
      );
    });

    it('should resolve an absolute route with a param and with a parent', () => {
      const r = new RouteResolver(
        new Map<RouteRef, string>([
          [legacyRef1, 'my-route'],
          [legacyRef2, 'my-parent/:x'],
        ]),
        new Map([[legacyRef2, legacyRef1]]),
        [
          {
            routeRefs: new Set([legacyRef2]),
            path: 'my-parent/:x',
            ...rest,
            children: [
              MATCH_ALL_ROUTE,
              { routeRefs: new Set([legacyRef1]), path: 'my-route', ...rest },
            ],
          },
        ],
        new Map<ExternalRouteRef, RouteRef | SubRouteRef>([
          [legacyExternalRef1, legacyRef1],
          [legacyExternalRef2, legacySubRef3],
        ]),
        '',
        emptyResolver,
        new Map(),
        matchRoutes,
        generatePath,
      );

      expect(r.resolve(legacyRef1, src('/'))?.()).toBe('/my-route');
      expect(r.resolve(legacyRef2, src('/'))?.({ x: '1x' })).toBe(
        '/my-route/my-parent/1x',
      );
      expect(r.resolve(legacySubRef1, src('/'))?.()).toBe('/my-route/foo');
      expect(r.resolve(legacySubRef2, src('/'))?.({ a: '2a' })).toBe(
        '/my-route/foo/2a',
      );
      expect(r.resolve(legacySubRef3, src('/'))?.({ x: '3x' })).toBe(
        '/my-route/my-parent/3x/bar',
      );
      expect(r.resolve(legacySubRef4, src('/'))?.({ x: '4x', a: '4a' })).toBe(
        '/my-route/my-parent/4x/bar/4a',
      );
      expect(r.resolve(legacyExternalRef1, src('/'))?.()).toBe('/my-route');
      expect(r.resolve(legacyExternalRef2, src('/'))?.({ x: '6x' })).toBe(
        '/my-route/my-parent/6x/bar',
      );
    });

    it('should resolve the most specific match', () => {
      const r = new RouteResolver(
        new Map<RouteRef, string>([
          [legacyRef1, 'deep'],
          [legacyRef2, 'root/:x'],
          [legacyRef3, 'sub/:y'],
        ]),
        new Map<RouteRef, RouteRef>([
          [legacyRef3, legacyRef2],
          [legacyRef1, legacyRef3],
        ]),
        [
          {
            routeRefs: new Set([legacyRef2]),
            path: 'root/:x',
            ...rest,
            children: [
              MATCH_ALL_ROUTE,
              {
                routeRefs: new Set([legacyRef3]),
                path: 'sub/:y',
                ...rest,
                children: [
                  MATCH_ALL_ROUTE,
                  {
                    routeRefs: new Set([legacyRef1]),
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
        emptyResolver,
        new Map(),
        matchRoutes,
        generatePath,
      );

      expect(r.resolve(legacyRef2, src('/'))?.({ x: 'x' })).toBe('/root/x');
      expect(r.resolve(legacyRef3, src('/root/x'))?.({ y: 'y' })).toBe(
        '/root/x/sub/y',
      );

      expect(() => r.resolve(legacyRef1, src('/'))?.()).toThrow(
        /^Cannot route.*with parent.*as it has parameters$/,
      );
      expect(() => r.resolve(legacyRef1, src('/root/x'))?.()).toThrow(
        /^Cannot route.*with parent.*as it has parameters$/,
      );
      expect(r.resolve(legacyRef1, src('/root/x/sub/y'))?.()).toBe(
        '/root/x/sub/y/deep',
      );
      // Without the MATCH_ALL_ROUTE, we wouldn't properly match the route here
      expect(
        r.resolve(legacyRef1, src('/root/x/sub/y/any/nested/path/here'))?.(),
      ).toBe('/root/x/sub/y/deep');
    });
  });
});
