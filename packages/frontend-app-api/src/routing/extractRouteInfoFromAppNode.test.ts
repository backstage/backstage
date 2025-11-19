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

import { createElement } from 'react';
import { extractRouteInfoFromAppNode } from './extractRouteInfoFromAppNode';
import {
  AnyRouteRefParams,
  AppNode,
  ExtensionDefinition,
  RouteRef,
  coreExtensionData,
  createExtension,
  createExtensionInput,
  createFrontendPlugin,
  createRouteRef,
} from '@backstage/frontend-plugin-api';
import { mockApis, TestApiRegistry } from '@backstage/test-utils';
import appPlugin from '@backstage/plugin-app';

import { readAppExtensionsConfig } from '../tree/readAppExtensionsConfig';
import { resolveAppNodeSpecs } from '../tree/resolveAppNodeSpecs';
import { resolveAppTree } from '../tree/resolveAppTree';
import { instantiateAppNodeTree } from '../tree/instantiateAppNodeTree';
import { Root } from '../extensions/Root';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveExtensionDefinition } from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';
import { createRouteAliasResolver } from './RouteAliasResolver';
import { createErrorCollector } from '../wiring/createErrorCollector';

const collector = createErrorCollector();

afterEach(() => {
  const errors = collector.collectErrors();
  if (errors) {
    throw new Error(
      `Unexpected errors: ${errors.map(e => e.message).join(', ')}`,
    );
  }
});

const ref1 = createRouteRef();
const ref2 = createRouteRef();
const ref3 = createRouteRef();
const ref4 = createRouteRef();
const ref5 = createRouteRef();
const refOrder: RouteRef<AnyRouteRefParams>[] = [ref1, ref2, ref3, ref4, ref5];

const emptyRouteRefsById = {
  routes: new Map(),
  externalRoutes: new Map(),
};

function createTestExtension(options: {
  name: string;
  parent?: string;
  path?: string;
  routeRef?: RouteRef;
}) {
  return createExtension({
    name: options.name,
    attachTo: options.parent
      ? { id: `test/${options.parent}`, input: 'children' }
      : { id: 'app/routes', input: 'routes' },
    output: [
      coreExtensionData.reactElement,
      coreExtensionData.routePath.optional(),
      coreExtensionData.routeRef.optional(),
    ],
    inputs: {
      children: createExtensionInput([coreExtensionData.reactElement]),
    },
    *factory() {
      if (options.path !== undefined) {
        yield coreExtensionData.routePath(options.path);
      }

      if (options.routeRef) {
        yield coreExtensionData.routeRef(options.routeRef);
      }

      yield coreExtensionData.reactElement(createElement('div'));
    },
  });
}

function routeInfoFromExtensions(
  extensions: ExtensionDefinition[],
  routeRefsById?: Record<string, RouteRef>,
) {
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    extensions,
  });

  const tree = resolveAppTree(
    'root',
    resolveAppNodeSpecs({
      features: [appPlugin, plugin],
      builtinExtensions: [
        resolveExtensionDefinition(Root, { namespace: 'root' }),
      ],
      parameters: readAppExtensionsConfig(mockApis.config()),
      forbidden: new Set(['root']),
      collector,
    }),
    collector,
  );

  instantiateAppNodeTree(tree.root, TestApiRegistry.from(), collector);

  return extractRouteInfoFromAppNode(
    tree.root,
    createRouteAliasResolver({
      ...emptyRouteRefsById,
      ...(routeRefsById && { routes: new Map(Object.entries(routeRefsById)) }),
    }),
  );
}

function sortedEntries<T>(map: Map<RouteRef, T>): [RouteRef, T][] {
  return Array.from(map).sort(
    ([a], [b]) => refOrder.indexOf(a) - refOrder.indexOf(b),
  );
}

function routeObj(
  path: string,
  refs: RouteRef[],
  children: any[] = [],
  type: 'mounted' | 'gathered' = 'mounted',
  appNode?: AppNode,
) {
  return {
    appNode,
    path: path,
    caseSensitive: false,
    element: type,
    routeRefs: new Set(refs),
    children: [
      {
        path: '*',
        caseSensitive: false,
        element: 'match-all',
        routeRefs: new Set(),
      },
      ...children,
    ],
  };
}

describe('discovery', () => {
  it('should collect routes', () => {
    const info = routeInfoFromExtensions([
      createTestExtension({
        name: 'nothing',
        path: 'nothing',
      }),
      createTestExtension({
        name: 'page1',
        path: 'foo',
        routeRef: ref1,
      }),
      createTestExtension({
        name: 'page2',
        parent: 'page1',
        path: 'bar/:id',
        routeRef: ref2,
      }),
      createTestExtension({
        name: 'page3',
        parent: 'page2',
        path: 'baz',
        routeRef: ref3,
      }),
      createTestExtension({
        name: 'page4',
        path: 'divsoup',
        routeRef: ref4,
      }),
      createTestExtension({
        name: 'page5',
        parent: 'page1',
        path: 'blop',
        routeRef: ref5,
      }),
    ]);

    expect(sortedEntries(info.routePaths)).toEqual([
      [ref1, 'foo'],
      [ref2, 'bar/:id'],
      [ref3, 'baz'],
      [ref4, 'divsoup'],
      [ref5, 'blop'],
    ]);
    expect(sortedEntries(info.routeParents)).toEqual([
      [ref1, undefined],
      [ref2, ref1],
      [ref3, ref2],
      [ref4, undefined],
      [ref5, ref1],
    ]);
    expect(info.routeObjects).toEqual([
      routeObj('nothing', [], undefined, undefined, expect.any(Object)),
      routeObj(
        'foo',
        [ref1],
        [
          routeObj(
            'bar/:id',
            [ref2],
            [routeObj('baz', [ref3], undefined, undefined, expect.any(Object))],
            undefined,
            expect.any(Object),
          ),
          routeObj('blop', [ref5], undefined, undefined, expect.any(Object)),
        ],
        undefined,
        expect.any(Object),
      ),
      routeObj('divsoup', [ref4], undefined, undefined, expect.any(Object)),
    ]);
  });

  it('should handle all react router Route patterns', () => {
    const info = routeInfoFromExtensions([
      createTestExtension({
        name: 'page1',
        path: 'foo',
        routeRef: ref1,
      }),
      createTestExtension({
        name: 'page2',
        parent: 'page1',
        path: 'bar/:id',
        routeRef: ref2,
      }),
      createTestExtension({
        name: 'page3',
        path: 'baz',
        routeRef: ref3,
      }),
      createTestExtension({
        name: 'page4',
        parent: 'page3',
        path: 'divsoup',
        routeRef: ref4,
      }),
      createTestExtension({
        name: 'page5',
        parent: 'page3',
        path: 'blop',
        routeRef: ref5,
      }),
    ]);

    expect(sortedEntries(info.routePaths)).toEqual([
      [ref1, 'foo'],
      [ref2, 'bar/:id'],
      [ref3, 'baz'],
      [ref4, 'divsoup'],
      [ref5, 'blop'],
    ]);
    expect(sortedEntries(info.routeParents)).toEqual([
      [ref1, undefined],
      [ref2, ref1],
      [ref3, undefined],
      [ref4, ref3],
      [ref5, ref3],
    ]);
  });

  it('should strip leading slashes in route paths', () => {
    const info = routeInfoFromExtensions([
      createTestExtension({
        name: 'page1',
        path: '/foo',
        routeRef: ref1,
      }),
      createTestExtension({
        name: 'page2',
        parent: 'page1',
        path: '/bar/:id',
        routeRef: ref2,
      }),
      createTestExtension({
        name: 'page3',
        path: '/baz',
        routeRef: ref3,
      }),
      createTestExtension({
        name: 'page4',
        parent: 'page3',
        path: '/divsoup',
        routeRef: ref4,
      }),
      createTestExtension({
        name: 'page5',
        parent: 'page3',
        path: '/blop',
        routeRef: ref5,
      }),
    ]);

    expect(sortedEntries(info.routePaths)).toEqual([
      [ref1, 'foo'],
      [ref2, 'bar/:id'],
      [ref3, 'baz'],
      [ref4, 'divsoup'],
      [ref5, 'blop'],
    ]);
    expect(sortedEntries(info.routeParents)).toEqual([
      [ref1, undefined],
      [ref2, ref1],
      [ref3, undefined],
      [ref4, ref3],
      [ref5, ref3],
    ]);
  });

  it('should use the route aggregator key to bind child routes to the same path', () => {
    const info = routeInfoFromExtensions([
      createTestExtension({
        name: 'foo',
        path: 'foo',
      }),
      createTestExtension({
        name: 'page1',
        parent: 'foo',
        routeRef: ref1,
      }),
      createTestExtension({
        name: 'fooChild',
        parent: 'foo',
      }),
      createTestExtension({
        name: 'page2',
        parent: 'fooChild',
        routeRef: ref2,
      }),
      createTestExtension({
        name: 'fooEmpty',
        parent: 'foo',
      }),
      createTestExtension({
        name: 'page3',
        path: 'bar',
        routeRef: ref3,
      }),
      createTestExtension({
        name: 'page3Child',
        parent: 'page3',
        path: '',
      }),
      createTestExtension({
        name: 'page4',
        parent: 'page3Child',
        routeRef: ref4,
      }),
      createTestExtension({
        name: 'page5',
        parent: 'page4',
        routeRef: ref5,
      }),
    ]);

    expect(sortedEntries(info.routePaths)).toEqual([
      [ref1, 'foo'],
      [ref2, 'foo'],
      [ref3, 'bar'],
      [ref4, ''],
      [ref5, ''],
    ]);
    expect(sortedEntries(info.routeParents)).toEqual([
      [ref1, undefined],
      [ref2, undefined],
      [ref3, undefined],
      [ref4, ref3],
      [ref5, ref3],
    ]);
    expect(info.routeObjects).toEqual([
      routeObj('foo', [ref1, ref2], [], 'mounted', expect.any(Object)),
      routeObj(
        'bar',
        [ref3],
        [routeObj('', [ref4, ref5], [], 'mounted', expect.any(Object))],
        'mounted',
        expect.any(Object),
      ),
    ]);
  });

  it('should use the route aggregator but stop when encountering explicit path', () => {
    const info = routeInfoFromExtensions([
      createTestExtension({
        name: 'page1',
        path: 'foo',
        routeRef: ref1,
      }),
      createTestExtension({
        name: 'page1Child',
        parent: 'page1',
        path: 'bar',
      }),
      createTestExtension({
        name: 'page2',
        parent: 'page1Child',
        routeRef: ref2,
      }),
      createTestExtension({
        name: 'page3',
        parent: 'page2',
        path: 'baz',
        routeRef: ref3,
      }),
      createTestExtension({
        name: 'page4',
        parent: 'page3',
        path: '/blop',
        routeRef: ref4,
      }),
      createTestExtension({
        name: 'page5',
        parent: 'page2',
        routeRef: ref5,
      }),
    ]);

    expect(sortedEntries(info.routePaths)).toEqual([
      [ref1, 'foo'],
      [ref2, 'bar'],
      [ref3, 'baz'],
      [ref4, 'blop'],
      [ref5, 'bar'],
    ]);
    expect(sortedEntries(info.routeParents)).toEqual([
      [ref1, undefined],
      [ref2, ref1],
      [ref3, ref2],
      [ref4, ref3],
      [ref5, ref1],
    ]);
    expect(info.routeObjects).toEqual([
      routeObj(
        'foo',
        [ref1],
        [
          routeObj(
            'bar',
            [ref2, ref5],
            [
              routeObj(
                'baz',
                [ref3],
                [
                  routeObj(
                    'blop',
                    [ref4],
                    undefined,
                    undefined,
                    expect.any(Object),
                  ),
                ],
                undefined,
                expect.any(Object),
              ),
            ],
            'mounted',
            expect.any(Object),
          ),
        ],
        undefined,
        expect.any(Object),
      ),
    ]);
  });

  it('should account for loose route paths', () => {
    const info = routeInfoFromExtensions([
      createTestExtension({
        name: 'r',
        path: 'r',
      }),
      createTestExtension({
        name: 'page1',
        parent: 'r',
        path: 'x',
        routeRef: ref1,
      }),
      createTestExtension({
        name: 'y',
        path: 'y',
        parent: 'r',
      }),
      createTestExtension({
        name: 'page2',
        parent: 'y',
        path: '1',
        routeRef: ref2,
      }),
      createTestExtension({
        name: 'page3',
        parent: 'page2',
        path: 'a',
        routeRef: ref3,
      }),
      createTestExtension({
        name: 'page4',
        parent: 'page2',
        path: 'b',
        routeRef: ref4,
      }),
    ]);

    expect(sortedEntries(info.routePaths)).toEqual([
      [ref1, 'r/x'],
      [ref2, 'r/y/1'],
      [ref3, 'a'],
      [ref4, 'b'],
    ]);
    expect(sortedEntries(info.routeParents)).toEqual([
      [ref1, undefined],
      [ref2, undefined],
      [ref3, ref2],
      [ref4, ref2],
    ]);
    expect(info.routeObjects).toEqual([
      routeObj(
        'r',
        [],
        [
          routeObj('x', [ref1], [], 'mounted', expect.any(Object)),
          routeObj(
            'y',
            [],
            [
              routeObj(
                '1',
                [ref2],
                [
                  routeObj(
                    'a',
                    [ref3],
                    undefined,
                    'mounted',
                    expect.any(Object),
                  ),
                  routeObj(
                    'b',
                    [ref4],
                    undefined,
                    'mounted',
                    expect.any(Object),
                  ),
                ],
                'mounted',
                expect.any(Object),
              ),
            ],
            'mounted',
            expect.any(Object),
          ),
        ],
        undefined,
        expect.any(Object),
      ),
    ]);
  });

  describe('route aliases', () => {
    it('should resolve route aliases', () => {
      const r1 = createRouteRef();
      const r2 = createRouteRef({ aliasFor: 'test.r3' });
      const r3 = createRouteRef();

      const info = routeInfoFromExtensions(
        [
          createTestExtension({
            name: 'page1',
            path: 'foo',
            routeRef: createRouteRef({ aliasFor: 'test.r1' }),
          }),
          createTestExtension({
            name: 'page3',
            path: 'bar',
            routeRef: createRouteRef({ aliasFor: 'test.r2' }),
          }),
        ],
        {
          'test.r1': r1,
          'test.r2': r2,
          'test.r3': r3,
        },
      );

      expect(sortedEntries(info.routePaths)).toEqual([
        [r1, 'foo'],
        [r3, 'bar'],
      ]);
      expect(sortedEntries(info.routeParents)).toEqual([
        [r1, undefined],
        [r3, undefined],
      ]);
      expect(info.routeObjects).toEqual([
        routeObj('foo', [r1], undefined, undefined, expect.any(Object)),
        routeObj('bar', [r3], undefined, undefined, expect.any(Object)),
      ]);
    });

    it('should refuse to resolve aliases pointing to other plugins', () => {
      expect(() =>
        routeInfoFromExtensions(
          [
            // Source for this is the 'test' plugin
            createTestExtension({
              name: 'page1',
              path: 'page1',
              routeRef: createRouteRef({ aliasFor: 'other.root' }),
            }),
          ],

          {
            'other.root': createRouteRef(),
          },
        ),
      ).toThrow(
        /Refused to resolve alias 'other.root' for routeRef{id=undefined,at='.*extractRouteInfoFromAppNode\.test\.ts:\d+:\d+'} as it points to a different plugin, the expected plugin is 'test' but the alias points to 'other'/,
      );
    });

    it('should bail on infinite route alias loops', () => {
      const loop1 = createRouteRef({ aliasFor: 'test.loop2' });
      const loop2 = createRouteRef({ aliasFor: 'test.loop3' });
      const loop3 = createRouteRef({ aliasFor: 'test.loop1' });

      expect(() =>
        routeInfoFromExtensions(
          [
            createTestExtension({
              name: 'page1',
              path: 'page1',
              routeRef: createRouteRef({ aliasFor: 'test.loop1' }),
            }),
          ],

          {
            'test.loop1': loop1,
            'test.loop2': loop2,
            'test.loop3': loop3,
          },
        ),
      ).toThrow(
        /Alias loop detected for routeRef{id=undefined,at='.*extractRouteInfoFromAppNode\.test\.ts:\d+:\d+'}/,
      );
    });
  });
});
