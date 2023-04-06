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

import React, { ComponentType, PropsWithChildren } from 'react';
import { routingV2Collector } from './collectors';

import {
  traverseElementTree,
  childDiscoverer,
  routeElementDiscoverer,
} from '../extensions/traversal';
import {
  createRoutableExtension,
  createRouteRef,
  createPlugin,
  RouteRef,
  attachComponentData,
  BackstagePlugin,
} from '@backstage/core-plugin-api';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

jest.mock('react-router', () => jest.requireActual('react-router-stable'));
jest.mock('react-router-dom', () =>
  jest.requireActual('react-router-dom-stable'),
);

const MockComponent = ({ children }: PropsWithChildren<{ path?: string }>) => (
  <>{children}</>
);

const plugin = createPlugin({ id: 'my-plugin' });

const ref1 = createRouteRef({ id: 'ref1' });
const ref2 = createRouteRef({ id: 'ref2' });
const ref3 = createRouteRef({ id: 'ref3' });
const ref4 = createRouteRef({ id: 'ref4' });
const ref5 = createRouteRef({ id: 'ref5' });
const refOrder = [ref1, ref2, ref3, ref4, ref5];

const Extension1 = plugin.provide(
  createRoutableExtension({
    name: 'Extension1',
    component: () => Promise.resolve(MockComponent),
    mountPoint: ref1,
  }),
);
const Extension2 = plugin.provide(
  createRoutableExtension({
    name: 'Extension2',
    component: () => Promise.resolve(MockComponent),
    mountPoint: ref2,
  }),
);
const Extension3 = plugin.provide(
  createRoutableExtension({
    name: 'Extension3',
    component: () => Promise.resolve(MockComponent),
    mountPoint: ref3,
  }),
);
const Extension4 = plugin.provide(
  createRoutableExtension({
    name: 'Extension4',
    component: () => Promise.resolve(MockComponent),
    mountPoint: ref4,
  }),
);
const Extension5 = plugin.provide(
  createRoutableExtension({
    name: 'Extension5',
    component: () => Promise.resolve(MockComponent),
    mountPoint: ref5,
  }),
);

const AggregationComponent = ({
  children,
}: PropsWithChildren<{
  path: string;
}>) => <>{children}</>;

attachComponentData(AggregationComponent, 'core.gatherMountPoints', true);

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
      },
      ...children,
    ],
    plugin: backstagePlugin,
  };
}

describe('discovery', () => {
  it('should collect routes', () => {
    const list = [
      <div key={0} />,
      <div key={1} />,
      <div key={3}>
        <Route path="blop" element={<Extension5 />} />
      </div>,
    ];

    const root = (
      <MemoryRouter>
        <Routes>
          <Route path="nothing" element={<div />} />
          <Route path="foo" element={<Extension1 />}>
            <div>
              <Route
                path="bar/:id"
                element={<>{[<Extension2 key={1} />, 'a string']}</>}
              >
                <div>
                  <div />
                  Some text here shouldn't be a problem
                  <div />
                  {null}
                  <div />
                  <Route path="baz" element={<Extension3 />} />
                </div>
              </Route>
              {false}
              {list}
              {true}
              {0}
            </div>
          </Route>
          <div>
            <Route path="divsoup" element={<Extension4 />} />
          </div>
        </Routes>
      </MemoryRouter>
    );

    const { routing } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routing: routingV2Collector,
      },
    });
    expect(sortedEntries(routing.paths)).toEqual([
      [ref1, 'foo'],
      [ref2, 'bar/:id'],
      [ref3, 'baz'],
      [ref4, 'divsoup'],
      [ref5, 'blop'],
    ]);
    expect(sortedEntries(routing.parents)).toEqual([
      [ref1, undefined],
      [ref2, ref1],
      [ref3, ref2],
      [ref4, undefined],
      [ref5, ref1],
    ]);
    expect(routing.objects).toEqual([
      routeObj(
        'foo',
        [ref1],
        [
          routeObj(
            'bar/:id',
            [ref2],
            [routeObj('baz', [ref3], undefined, undefined, plugin)],
            undefined,
            plugin,
          ),
          routeObj('blop', [ref5], undefined, undefined, plugin),
        ],
        undefined,
        plugin,
      ),
      routeObj('divsoup', [ref4], undefined, undefined, plugin),
    ]);
  });

  it('should handle all react router Route patterns', () => {
    const root = (
      <MemoryRouter>
        <Routes>
          <Route path="foo" element={<Extension1 />}>
            <Routes>
              <Route path="bar/:id" element={<Extension2 />} />
            </Routes>
          </Route>
          <Route path="baz" element={<Extension3 />}>
            <Route path="divsoup" element={<Extension4 />} />
            <Route path="blop" element={<Extension5 />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const { routing } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routing: routingV2Collector,
      },
    });
    expect(sortedEntries(routing.paths)).toEqual([
      [ref1, 'foo'],
      [ref2, 'bar/:id'],
      [ref3, 'baz'],
      [ref4, 'divsoup'],
      [ref5, 'blop'],
    ]);
    expect(sortedEntries(routing.parents)).toEqual([
      [ref1, undefined],
      [ref2, ref1],
      [ref3, undefined],
      [ref4, ref3],
      [ref5, ref3],
    ]);
  });

  it('should handle absolute route paths', () => {
    const root = (
      <MemoryRouter>
        <Routes>
          <Route path="/foo" element={<Extension1 />}>
            <Routes>
              <Route path="/bar/:id" element={<Extension2 />} />
            </Routes>
          </Route>
          <Route path="/baz" element={<Extension3 />}>
            <Route path="/divsoup" element={<Extension4 />} />
            <Route path="/blop" element={<Extension5 />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const { routing } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routing: routingV2Collector,
      },
    });
    expect(sortedEntries(routing.paths)).toEqual([
      [ref1, 'foo'],
      [ref2, 'bar/:id'],
      [ref3, 'baz'],
      [ref4, 'divsoup'],
      [ref5, 'blop'],
    ]);
    expect(sortedEntries(routing.parents)).toEqual([
      [ref1, undefined],
      [ref2, ref1],
      [ref3, undefined],
      [ref4, ref3],
      [ref5, ref3],
    ]);
  });

  it('should use the route aggregator key to bind child routes to the same path', () => {
    const root = (
      <MemoryRouter>
        <Routes>
          <AggregationComponent path="foo">
            <Extension1 />
            <div>
              <Extension2 />
            </div>
            HELLO
          </AggregationComponent>
          <Route path="bar" element={<Extension3 />}>
            <AggregationComponent path="">
              <Extension4>
                <Extension5 />
              </Extension4>
            </AggregationComponent>
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const { routing } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routing: routingV2Collector,
      },
    });
    expect(sortedEntries(routing.paths)).toEqual([
      [ref1, 'foo'],
      [ref2, 'foo'],
      [ref3, 'bar'],
      [ref4, ''],
      [ref5, ''],
    ]);
    expect(sortedEntries(routing.parents)).toEqual([
      [ref1, undefined],
      [ref2, undefined],
      [ref3, undefined],
      [ref4, ref3],
      [ref5, ref3],
    ]);
    expect(routing.objects).toEqual([
      routeObj('foo', [ref1, ref2], [], 'gathered'),
      routeObj(
        'bar',
        [ref3],
        [routeObj('', [ref4, ref5], [], 'gathered')],
        undefined,
        plugin,
      ),
    ]);
  });

  it('should use the route aggregator but stop when encountering explicit path', () => {
    const root = (
      <MemoryRouter>
        <Routes>
          <Route path="foo" element={<Extension1 />}>
            <AggregationComponent path="/bar">
              <Extension2>
                <Routes>
                  <Route path="baz" element={<Extension3 />}>
                    <Route path="/blop" element={<Extension4 />} />
                  </Route>
                </Routes>
                <Extension5 />
              </Extension2>
            </AggregationComponent>
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const { routing } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routing: routingV2Collector,
      },
    });
    expect(sortedEntries(routing.paths)).toEqual([
      [ref1, 'foo'],
      [ref2, 'bar'],
      [ref3, 'baz'],
      [ref4, 'blop'],
      [ref5, 'bar'],
    ]);
    expect(sortedEntries(routing.parents)).toEqual([
      [ref1, undefined],
      [ref2, ref1],
      [ref3, ref2],
      [ref4, ref3],
      [ref5, ref1],
    ]);
    expect(routing.objects).toEqual([
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
                [routeObj('blop', [ref4], undefined, undefined, plugin)],
                undefined,
                plugin,
              ),
            ],
            'gathered',
          ),
        ],
        undefined,
        plugin,
      ),
    ]);
  });

  it('should throw when you provide path property on an extension', () => {
    expect(() => {
      traverseElementTree({
        root: <Extension1 path="/foo" />,
        discoverers: [childDiscoverer, routeElementDiscoverer],
        collectors: {
          routing: routingV2Collector,
        },
      });
    }).toThrow(
      'Path property may not be set directly on a routable extension "Extension(Extension1)"',
    );
  });

  it('should throw when element prop is not a string', () => {
    const Div = 'div' as unknown as ComponentType<{ path: boolean }>;
    expect(() => {
      traverseElementTree({
        root: <Div path />,
        discoverers: [childDiscoverer, routeElementDiscoverer],
        collectors: {
          routing: routingV2Collector,
        },
      });
    }).toThrow('Element path must be a string at "div"');
  });

  it('should throw when the mount point gatherers have an element prop', () => {
    const AnyAggregationComponent = AggregationComponent as any;
    expect(() => {
      traverseElementTree({
        root: <AnyAggregationComponent path="test" element={<Extension3 />} />,
        discoverers: [childDiscoverer, routeElementDiscoverer],
        collectors: {
          routing: routingV2Collector,
        },
      });
    }).toThrow(
      'Mount point gatherers may not have an element prop "AggregationComponent"',
    );
  });

  it('should ignore path props within route elements', () => {
    const { routing } = traverseElementTree({
      root: <Route path="foo" element={<Extension1 path="bar" />} />,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routing: routingV2Collector,
      },
    });
    expect(sortedEntries(routing.paths)).toEqual([[ref1, 'foo']]);
    expect(sortedEntries(routing.parents)).toEqual([[ref1, undefined]]);
    expect(routing.objects).toEqual([
      routeObj('foo', [ref1], [], undefined, plugin),
    ]);
  });

  it('should throw when a routable extension does not have a path set', () => {
    expect(() => {
      traverseElementTree({
        root: <Extension3 />,
        discoverers: [childDiscoverer, routeElementDiscoverer],
        collectors: {
          routing: routingV2Collector,
        },
      });
    }).toThrow(
      'Routable extension "Extension(Extension3)" with mount point "routeRef{type=absolute,id=ref3}" must be assigned a path',
    );
  });

  it('should throw when Route elements contain multiple routable extensions', () => {
    expect(() => {
      traverseElementTree({
        root: (
          <Route
            path="foo"
            element={
              <>
                <Extension1 />
                <Extension2 />
              </>
            }
          />
        ),
        discoverers: [childDiscoverer, routeElementDiscoverer],
        collectors: {
          routing: routingV2Collector,
        },
      });
    }).toThrow(
      'Route element with path "foo" may not contain multiple routable extensions',
    );
  });
});
