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

import React, { PropsWithChildren } from 'react';
import { routingV1Collector } from './collectors';

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

jest.mock('react-router', () => jest.requireActual('react-router-beta'));
jest.mock('react-router-dom', () =>
  jest.requireActual('react-router-dom-beta'),
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
    plugins: backstagePlugin ? new Set([backstagePlugin]) : new Set(),
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
  };
}

describe('discovery', () => {
  it('should collect routes', () => {
    const list = [
      <div key={0} />,
      <div key={1} />,
      <div key={3}>
        <Extension5 path="/blop" />
      </div>,
    ];

    const root = (
      <MemoryRouter>
        <Routes>
          <Extension1 path="/foo">
            <div>
              <Extension2 path="/bar/:id">
                <div>
                  <div />
                  Some text here shouldn't be a problem
                  <div />
                  {null}
                  <div />
                  <Extension3 path="/baz" />
                </div>
              </Extension2>
              {false}
              {list}
              {true}
              {0}
            </div>
          </Extension1>
          <div>
            <Route path="/divsoup" element={<Extension4 />} />
          </div>
        </Routes>
      </MemoryRouter>
    );

    const { routing } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routing: routingV1Collector,
      },
    });
    expect(sortedEntries(routing.paths)).toEqual([
      [ref1, '/foo'],
      [ref2, '/bar/:id'],
      [ref3, '/baz'],
      [ref4, '/divsoup'],
      [ref5, '/blop'],
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
        '/foo',
        [ref1],
        [
          routeObj('/bar/:id', [ref2], [routeObj('/baz', [ref3])]),
          routeObj('/blop', [ref5]),
        ],
      ),
      routeObj('/divsoup', [ref4], undefined, undefined, plugin),
    ]);
  });

  it('should handle all react router Route patterns', () => {
    const root = (
      <MemoryRouter>
        <Routes>
          <Route
            path="/foo"
            element={
              <Extension1>
                <Routes>
                  <Extension2 path="/bar/:id" />
                </Routes>
              </Extension1>
            }
          />
          <Route path="/baz" element={<Extension3 path="/not-used" />}>
            <Route path="/divsoup" element={<Extension4 />} />
            <Extension5 path="/blop" />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const { routing } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routing: routingV1Collector,
      },
    });
    expect(sortedEntries(routing.paths)).toEqual([
      [ref1, '/foo'],
      [ref2, '/bar/:id'],
      [ref3, '/baz'],
      [ref4, '/divsoup'],
      [ref5, '/blop'],
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
          <AggregationComponent path="/foo">
            <Extension1 />
            <div>
              <Extension2 />
            </div>
            HELLO
          </AggregationComponent>
          <Extension3 path="/bar">
            <AggregationComponent path="/baz">
              <Extension4>
                <Extension5 />
              </Extension4>
            </AggregationComponent>
          </Extension3>
        </Routes>
      </MemoryRouter>
    );

    const { routing } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routing: routingV1Collector,
      },
    });
    expect(sortedEntries(routing.paths)).toEqual([
      [ref1, '/foo'],
      [ref2, '/foo'],
      [ref3, '/bar'],
      [ref4, '/baz'],
      [ref5, '/baz'],
    ]);
    expect(sortedEntries(routing.parents)).toEqual([
      [ref1, undefined],
      [ref2, undefined],
      [ref3, undefined],
      [ref4, ref3],
      [ref5, ref3],
    ]);
    expect(routing.objects).toEqual([
      routeObj('/foo', [ref1, ref2], [], 'gathered'),
      routeObj(
        '/bar',
        [ref3],
        [routeObj('/baz', [ref4, ref5], [], 'gathered')],
      ),
    ]);
  });

  it('should use the route aggregator but stop when encountering explicit path', () => {
    const root = (
      <MemoryRouter>
        <Routes>
          <Extension1 path="/foo">
            <AggregationComponent path="/bar">
              <Extension2>
                <Extension3 path="/baz">
                  <Extension4 path="/blop" />
                </Extension3>
                <Extension5 />
              </Extension2>
            </AggregationComponent>
          </Extension1>
        </Routes>
      </MemoryRouter>
    );

    const { routing } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routing: routingV1Collector,
      },
    });
    expect(sortedEntries(routing.paths)).toEqual([
      [ref1, '/foo'],
      [ref2, '/bar'],
      [ref3, '/baz'],
      [ref4, '/blop'],
      [ref5, '/bar'],
    ]);
    expect(sortedEntries(routing.parents)).toEqual([
      [ref1, undefined],
      [ref2, ref1],
      [ref3, ref1],
      [ref4, ref3],
      [ref5, ref1],
    ]);
    expect(routing.objects).toEqual([
      routeObj(
        '/foo',
        [ref1],
        [
          routeObj(
            '/bar',
            [ref2, ref5],
            [routeObj('/baz', [ref3], [routeObj('/blop', [ref4])])],
            'gathered',
          ),
        ],
      ),
    ]);
  });

  it('should stop gathering mount points after encountering explicit path', () => {
    const root = (
      <MemoryRouter>
        <Routes>
          <Extension1 path="/foo">
            <AggregationComponent path="/bar">
              <Extension2 path="/baz">
                <Extension3 />
              </Extension2>
            </AggregationComponent>
          </Extension1>
        </Routes>
      </MemoryRouter>
    );

    expect(() => {
      traverseElementTree({
        root,
        discoverers: [childDiscoverer, routeElementDiscoverer],
        collectors: {
          routing: routingV1Collector,
        },
      });
    }).toThrow('Mounted routable extension must have a path');
  });
});
