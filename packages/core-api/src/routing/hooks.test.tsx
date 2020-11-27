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

import { render } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { MemoryRouter, Routes } from 'react-router-dom';
import { createRoutableExtension } from '../extensions';
import {
  childDiscoverer,
  routeElementDiscoverer,
  traverseElementTree,
} from '../extensions/traversal';
import { createPlugin } from '../plugin';
import { routeCollector, routeParentCollector } from './collectors';
import { useRouteRef, RoutingProvider } from './hooks';
import { createRouteRef } from './RouteRef';
import { RouteRef } from './types';

const mockConfig = () => ({ path: '/unused', title: 'Unused' });
const MockComponent = ({ children }: PropsWithChildren<{}>) => <>{children}</>;

const plugin = createPlugin({ id: 'my-plugin' });

const ref1 = createRouteRef(mockConfig());
const ref2 = createRouteRef(mockConfig());
const ref3 = createRouteRef(mockConfig());
const ref4 = createRouteRef(mockConfig());

const MockRouteSource = (props: {
  name: string;
  routeRef: RouteRef;
  params?: Record<string, string>;
}) => {
  const routeFunc = useRouteRef(props.routeRef);
  return (
    <div>
      Path at {props.name}: {routeFunc?.(props.params)}
    </div>
  );
};

const Extension1 = plugin.provide(
  createRoutableExtension({ component: MockComponent, mountPoint: ref1 }),
);
const Extension2 = plugin.provide(
  createRoutableExtension({ component: MockRouteSource, mountPoint: ref2 }),
);
const Extension3 = plugin.provide(
  createRoutableExtension({ component: MockComponent, mountPoint: ref3 }),
);
const Extension4 = plugin.provide(
  createRoutableExtension({ component: MockRouteSource, mountPoint: ref4 }),
);

describe('discovery', () => {
  it('should handle simple routeRef path creation for routeRefs used in other parts of the app', () => {
    const root = (
      <MemoryRouter initialEntries={['/foo/bar']}>
        <Routes>
          <Extension1 path="/foo">
            <Extension2 path="/bar" name="inside" routeRef={ref2} />
          </Extension1>
          <Extension3 path="/baz" />
        </Routes>
        <MockRouteSource name="outside" routeRef={ref2} />
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

    const rendered = render(
      <RoutingProvider routes={routes} routeParents={routeParents}>
        {root}
      </RoutingProvider>,
    );

    expect(rendered.getByText('Path at inside: /foo/bar')).toBeInTheDocument();
    expect(rendered.getByText('Path at outside: /foo/bar')).toBeInTheDocument();
  });

  it('should handle routeRefs with parameters', () => {
    const root = (
      <MemoryRouter initialEntries={['/foo/bar/:id']}>
        <Routes>
          <Extension1 path="/foo">
            <Extension4
              path="/bar/:id"
              name="inside"
              routeRef={ref4}
              params={{ id: 'bleb' }}
            />
          </Extension1>
        </Routes>
        <MockRouteSource
          name="outside"
          routeRef={ref4}
          params={{ id: 'blob' }}
        />
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

    const rendered = render(
      <RoutingProvider routes={routes} routeParents={routeParents}>
        {root}
      </RoutingProvider>,
    );

    expect(
      rendered.getByText('Path at inside: /foo/bar/bleb'),
    ).toBeInTheDocument();
    expect(
      rendered.getByText('Path at outside: /foo/bar/blob'),
    ).toBeInTheDocument();
  });
});
