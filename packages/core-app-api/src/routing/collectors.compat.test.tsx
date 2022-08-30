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
import type { PropsWithChildren } from 'react';
import {
  RouteRef,
  createPlugin,
  createRouteRef,
  createRoutableExtension,
  attachComponentData,
} from '@backstage/core-plugin-api';
import { Collector, Discoverer } from '../extensions/traversal';

describe.each(['beta', 'stable'])('react-router %s', rrVersion => {
  beforeAll(() => {
    jest.doMock('react-router', () =>
      rrVersion === 'beta'
        ? jest.requireActual('react-router-beta')
        : jest.requireActual('react-router-stable'),
    );
    jest.doMock('react-router-dom', () =>
      rrVersion === 'beta'
        ? jest.requireActual('react-router-dom-beta')
        : jest.requireActual('react-router-dom-stable'),
    );
  });

  function requireDeps() {
    return {
      ...(require('./collectors') as typeof import('./collectors')),
      ...(require('../extensions/traversal') as typeof import('../extensions/traversal')),
      ...(require('@backstage/core-plugin-api') as typeof import('@backstage/core-plugin-api')),
      ...(require('react-router-dom') as typeof import('react-router-dom')),
    };
  }

  afterAll(() => {
    jest.resetModules();
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const MockComponent = ({
    children,
  }: PropsWithChildren<{ path?: string }>) => <>{children}</>;

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
  ) {
    return expect.objectContaining({
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
    });
  }

  describe(`routing with ${rrVersion}`, () => {
    let traversalOptions: {
      discoverers: Discoverer[];
      collectors: { routing: Collector<any, any> };
    };
    beforeEach(() => {
      const {
        routingV1Collector,
        routingV2Collector,
        childDiscoverer,
        routeElementDiscoverer,
      } = requireDeps();

      traversalOptions = {
        discoverers: [childDiscoverer, routeElementDiscoverer],
        collectors: {
          routing:
            rrVersion === 'beta' ? routingV1Collector : routingV2Collector,
        },
      };
    });

    it('should collect routes', () => {
      const { MemoryRouter, Routes, Route, traverseElementTree } =
        requireDeps();
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
                <Route path="bar/:id" element={<Extension2 />}>
                  <div>
                    <div />
                    Some text here shouldn't be a problem
                    <div />
                    {null}
                    <div />
                    <Routes>
                      <Route path="/baz" element={<Extension3 />} />
                    </Routes>
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
        ...traversalOptions,
      });

      expect(sortedEntries(routing.paths)).toEqual([
        [ref1, 'foo'],
        [ref2, 'bar/:id'],
        [ref3, rrVersion === 'beta' ? '/baz' : 'baz'],
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
              [routeObj(rrVersion === 'beta' ? '/baz' : 'baz', [ref3])],
            ),
            routeObj('blop', [ref5]),
          ],
        ),
        routeObj('divsoup', [ref4]),
      ]);
    });

    it('should collect routes with aggregators', () => {
      const { MemoryRouter, Routes, Route, traverseElementTree } =
        requireDeps();
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
              <AggregationComponent path="baz">
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
        ...traversalOptions,
      });

      expect(sortedEntries(routing.paths)).toEqual([
        [ref1, 'foo'],
        [ref2, 'foo'],
        [ref3, 'bar'],
        [ref4, 'baz'],
        [ref5, 'baz'],
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
          [routeObj('baz', [ref4, ref5], [], 'gathered')],
        ),
      ]);
    });
  });
});
