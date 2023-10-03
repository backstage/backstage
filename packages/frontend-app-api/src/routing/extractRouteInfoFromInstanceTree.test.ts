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

import React from 'react';
import {
  BackstagePlugin,
  RouteRef,
  createRouteRef,
} from '@backstage/core-plugin-api';
import { extractRouteInfoFromInstanceTree } from './extractRouteInfoFromInstanceTree';
import {
  Extension,
  coreExtensionData,
  createExtension,
  createExtensionInput,
  createPlugin,
} from '@backstage/frontend-plugin-api';
import { createInstances } from '../wiring/createApp';
import { MockConfigApi } from '@backstage/test-utils';

const ref1 = createRouteRef({ id: 'page1' });
const ref2 = createRouteRef({ id: 'page2' });
const ref3 = createRouteRef({ id: 'page3' });
const ref4 = createRouteRef({ id: 'page4' });
const ref5 = createRouteRef({ id: 'page5' });
const refOrder = [ref1, ref2, ref3, ref4, ref5];

function createTestExtension(options: {
  id: string;
  at?: string;
  path?: string;
  routeRef?: RouteRef;
}) {
  return createExtension({
    id: options.id,
    at: options.at ?? 'core.routes/children',
    output: {
      element: coreExtensionData.reactElement,
      path: coreExtensionData.routePath.optional(),
      routeRef: coreExtensionData.routeRef.optional(),
    },
    inputs: {
      children: createExtensionInput({
        element: coreExtensionData.reactElement,
      }),
    },
    factory({ bind }) {
      bind({
        path: options.path,
        routeRef: options.routeRef,
        element: React.createElement('div'),
      });
    },
  });
}

function routeInfoFromExtensions(extensions: Extension<unknown>[]) {
  const plugin = createPlugin({
    id: 'test',
    extensions,
  });
  const { rootInstances } = createInstances({
    config: new MockConfigApi({}),
    plugins: [plugin],
  });

  return extractRouteInfoFromInstanceTree(rootInstances);
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
  backstagePlugin?: BackstagePlugin,
) {
  return {
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
        plugins: new Set(),
      },
      ...children,
    ],
    plugins: backstagePlugin ? new Set([backstagePlugin]) : new Set(),
  };
}

describe('discovery', () => {
  it('should collect routes', () => {
    const info = routeInfoFromExtensions([
      createTestExtension({
        id: 'nothing',
        path: 'nothing',
      }),
      createTestExtension({
        id: 'page1',
        path: 'foo',
        routeRef: ref1,
      }),
      createTestExtension({
        id: 'page2',
        at: 'page1/children',
        path: 'bar/:id',
        routeRef: ref2,
      }),
      createTestExtension({
        id: 'page3',
        at: 'page2/children',
        path: 'baz',
        routeRef: ref3,
      }),
      createTestExtension({
        id: 'page4',
        path: 'divsoup',
        routeRef: ref4,
      }),
      createTestExtension({
        id: 'page5',
        at: 'page1/children',
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
      routeObj('nothing', []),
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
        id: 'page1',
        path: 'foo',
        routeRef: ref1,
      }),
      createTestExtension({
        id: 'page2',
        at: 'page1/children',
        path: 'bar/:id',
        routeRef: ref2,
      }),
      createTestExtension({
        id: 'page3',
        path: 'baz',
        routeRef: ref3,
      }),
      createTestExtension({
        id: 'page4',
        at: 'page3/children',
        path: 'divsoup',
        routeRef: ref4,
      }),
      createTestExtension({
        id: 'page5',
        at: 'page3/children',
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

  // it('should handle absolute route paths', () => {
  //   const info = routeInfoFromExtensions([
  //     createTestExtension({
  //       id: 'page1',
  //       path: '/foo',
  //       routeRef: ref1,
  //     }),
  //     createTestExtension({
  //       id: 'page2',
  //       at: 'page1/children',
  //       path: '/bar/:id',
  //       routeRef: ref2,
  //     }),
  //     createTestExtension({
  //       id: 'page3',
  //       path: '/baz',
  //       routeRef: ref3,
  //     }),
  //     createTestExtension({
  //       id: 'page4',
  //       at: 'page3/children',
  //       path: '/divsoup',
  //       routeRef: ref4,
  //     }),
  //     createTestExtension({
  //       id: 'page5',
  //       at: 'page3/children',
  //       path: '/blop',
  //       routeRef: ref5,
  //     }),
  //   ]);

  //   expect(sortedEntries(info.routePaths)).toEqual([
  //     [ref1, 'foo'],
  //     [ref2, 'bar/:id'],
  //     [ref3, 'baz'],
  //     [ref4, 'divsoup'],
  //     [ref5, 'blop'],
  //   ]);
  //   expect(sortedEntries(info.routeParents)).toEqual([
  //     [ref1, undefined],
  //     [ref2, ref1],
  //     [ref3, undefined],
  //     [ref4, ref3],
  //     [ref5, ref3],
  //   ]);
  // });

  it('should use the route aggregator key to bind child routes to the same path', () => {
    const info = routeInfoFromExtensions([
      createTestExtension({
        id: 'foo',
        path: 'foo',
      }),
      createTestExtension({
        id: 'page1',
        at: 'foo/children',
        routeRef: ref1,
      }),
      createTestExtension({
        id: 'fooChild',
        at: 'foo/children',
      }),
      createTestExtension({
        id: 'page2',
        at: 'fooChild/children',
        routeRef: ref2,
      }),
      createTestExtension({
        id: 'fooEmpty',
      }),
      createTestExtension({
        id: 'page3',
        path: 'bar',
        routeRef: ref3,
      }),
      createTestExtension({
        id: 'page3Child',
        at: 'page3/children',
        path: '',
      }),
      createTestExtension({
        id: 'page4',
        at: 'page3Child/children',
        routeRef: ref4,
      }),
      createTestExtension({
        id: 'page5',
        at: 'page4/children',
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
      [ref5, ref4],
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

  // it('should use the route aggregator but stop when encountering explicit path', () => {
  //   const root = (
  //     <MemoryRouter>
  //       <Routes>
  //         <Route path="foo" element={<Extension1 />}>
  //           <AggregationComponent path="/bar">
  //             <Extension2>
  //               <Routes>
  //                 <Route path="baz" element={<Extension3 />}>
  //                   <Route path="/blop" element={<Extension4 />} />
  //                 </Route>
  //               </Routes>
  //               <Extension5 />
  //             </Extension2>
  //           </AggregationComponent>
  //         </Route>
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   const { routing } = traverseElementTree({
  //     root,
  //     discoverers: [childDiscoverer, routeElementDiscoverer],
  //     collectors: {
  //       routing: routingV2Collector,
  //     },
  //   });
  //   expect(sortedEntries(routing.paths)).toEqual([
  //     [ref1, 'foo'],
  //     [ref2, 'bar'],
  //     [ref3, 'baz'],
  //     [ref4, 'blop'],
  //     [ref5, 'bar'],
  //   ]);
  //   expect(sortedEntries(routing.parents)).toEqual([
  //     [ref1, undefined],
  //     [ref2, ref1],
  //     [ref3, ref2],
  //     [ref4, ref3],
  //     [ref5, ref1],
  //   ]);
  //   expect(routing.objects).toEqual([
  //     routeObj(
  //       'foo',
  //       [ref1],
  //       [
  //         routeObj(
  //           'bar',
  //           [ref2, ref5],
  //           [
  //             routeObj(
  //               'baz',
  //               [ref3],
  //               [routeObj('blop', [ref4], undefined, undefined, plugin)],
  //               undefined,
  //               plugin,
  //             ),
  //           ],
  //           'gathered',
  //           plugin,
  //         ),
  //       ],
  //       undefined,
  //       plugin,
  //     ),
  //   ]);
  // });

  // it('should throw when you provide path property on an extension', () => {
  //   expect(() => {
  //     traverseElementTree({
  //       root: <Extension1 path="/foo" />,
  //       discoverers: [childDiscoverer, routeElementDiscoverer],
  //       collectors: {
  //         routing: routingV2Collector,
  //       },
  //     });
  //   }).toThrow(
  //     'Path property may not be set directly on a routable extension "Extension(Extension1)"',
  //   );
  // });

  // it('should throw when element prop is not a string', () => {
  //   const Div = 'div' as unknown as ComponentType<{ path: boolean }>;
  //   expect(() => {
  //     traverseElementTree({
  //       root: <Div path />,
  //       discoverers: [childDiscoverer, routeElementDiscoverer],
  //       collectors: {
  //         routing: routingV2Collector,
  //       },
  //     });
  //   }).toThrow('Element path must be a string at "div"');
  // });

  // it('should throw when the mount point gatherers have an element prop', () => {
  //   const AnyAggregationComponent = AggregationComponent as any;
  //   expect(() => {
  //     traverseElementTree({
  //       root: <AnyAggregationComponent path="test" element={<Extension3 />} />,
  //       discoverers: [childDiscoverer, routeElementDiscoverer],
  //       collectors: {
  //         routing: routingV2Collector,
  //       },
  //     });
  //   }).toThrow(
  //     'Mount point gatherers may not have an element prop "AggregationComponent"',
  //   );
  // });

  // it('should ignore path props within route elements', () => {
  //   const { routing } = traverseElementTree({
  //     root: <Route path="foo" element={<Extension1 path="bar" />} />,
  //     discoverers: [childDiscoverer, routeElementDiscoverer],
  //     collectors: {
  //       routing: routingV2Collector,
  //     },
  //   });
  //   expect(sortedEntries(routing.paths)).toEqual([[ref1, 'foo']]);
  //   expect(sortedEntries(routing.parents)).toEqual([[ref1, undefined]]);
  //   expect(routing.objects).toEqual([
  //     routeObj('foo', [ref1], [], undefined, plugin),
  //   ]);
  // });

  // it('should throw when a routable extension does not have a path set', () => {
  //   expect(() => {
  //     traverseElementTree({
  //       root: <Extension3 />,
  //       discoverers: [childDiscoverer, routeElementDiscoverer],
  //       collectors: {
  //         routing: routingV2Collector,
  //       },
  //     });
  //   }).toThrow(
  //     'Routable extension "Extension(Extension3)" with mount point "routeRef{type=absolute,id=ref3}" must be assigned a path',
  //   );
  // });

  // it('should throw when Route elements contain multiple routable extensions', () => {
  //   expect(() => {
  //     traverseElementTree({
  //       root: (
  //         <Route
  //           path="foo"
  //           element={
  //             <>
  //               <Extension1 />
  //               <Extension2 />
  //             </>
  //           }
  //         />
  //       ),
  //       discoverers: [childDiscoverer, routeElementDiscoverer],
  //       collectors: {
  //         routing: routingV2Collector,
  //       },
  //     });
  //   }).toThrow(
  //     'Route element with path "foo" may not contain multiple routable extensions',
  //   );
  // });
});
