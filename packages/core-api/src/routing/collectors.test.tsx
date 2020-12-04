/*
 * Copyright 2020 Spotify AB
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
import { routeCollector, routeParentCollector } from './collectors';

import {
  traverseElementTree,
  childDiscoverer,
  routeElementDiscoverer,
} from '../extensions/traversal';
import { createRouteRef } from './RouteRef';
import { createPlugin } from '../plugin';
import { createRoutableExtension } from '../extensions';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const mockConfig = () => ({ path: '/foo', title: 'Foo' });
const MockComponent = ({ children }: PropsWithChildren<{}>) => <>{children}</>;

const plugin = createPlugin({ id: 'my-plugin' });

const ref1 = createRouteRef(mockConfig());
const ref2 = createRouteRef(mockConfig());
const ref3 = createRouteRef(mockConfig());
const ref4 = createRouteRef(mockConfig());
const ref5 = createRouteRef(mockConfig());

const Extension1 = plugin.provide(
  createRoutableExtension({ component: MockComponent, mountPoint: ref1 }),
);
const Extension2 = plugin.provide(
  createRoutableExtension({ component: MockComponent, mountPoint: ref2 }),
);
const Extension3 = plugin.provide(
  createRoutableExtension({ component: MockComponent, mountPoint: ref3 }),
);
const Extension4 = plugin.provide(
  createRoutableExtension({ component: MockComponent, mountPoint: ref4 }),
);
const Extension5 = plugin.provide(
  createRoutableExtension({ component: MockComponent, mountPoint: ref5 }),
);

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

    const { routes, routeParents } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routes: routeCollector,
        routeParents: routeParentCollector,
      },
    });
    expect(routes).toEqual(
      new Map([
        [ref1, '/foo'],
        [ref2, '/bar/:id'],
        [ref3, '/baz'],
        [ref4, '/divsoup'],
        [ref5, '/blop'],
      ]),
    );

    expect(routeParents).toEqual(
      new Map([
        [ref1, undefined],
        [ref2, ref1],
        [ref3, ref2],
        [ref4, undefined],
        [ref5, ref1],
      ]),
    );
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

    const { routes, routeParents } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routes: routeCollector,
        routeParents: routeParentCollector,
      },
    });
    expect(routes).toEqual(
      new Map([
        [ref1, '/foo'],
        [ref2, '/bar/:id'],
        [ref3, '/baz'],
        [ref4, '/divsoup'],
        [ref5, '/blop'],
      ]),
    );
    expect(routeParents).toEqual(
      new Map([
        [ref1, undefined],
        [ref2, ref1],
        [ref3, undefined],
        [ref4, ref3],
        [ref5, ref3],
      ]),
    );
  });

  it('should not visit the same element twice', () => {
    const element = <Extension3 path="/baz" />;

    expect(() =>
      traverseElementTree({
        root: (
          <MemoryRouter>
            <Extension1 path="/foo">{element}</Extension1>
            <Extension2 path="/bar">{element}</Extension2>
          </MemoryRouter>
        ),
        discoverers: [childDiscoverer, routeElementDiscoverer],
        collectors: {
          routes: routeCollector,
          routeParents: routeParentCollector,
        },
      }),
    ).toThrow(`Visited element Extension(MockComponent) twice`);
  });
});
