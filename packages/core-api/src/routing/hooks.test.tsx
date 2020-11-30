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
import {
  routePathCollector,
  routeParentCollector,
  routeObjectCollector,
} from './collectors';
import { useRouteRef, RoutingProvider, validateRoutes } from './hooks';
import { createRouteRef } from './RouteRef';
import { RouteRef, RouteRefConfig } from './types';

const mockConfig = (extra?: Partial<RouteRefConfig>) => ({
  path: '/unused',
  title: 'Unused',
  ...extra,
});
const MockComponent = ({ children }: PropsWithChildren<{}>) => <>{children}</>;

const plugin = createPlugin({ id: 'my-plugin' });

const ref1 = createRouteRef(mockConfig({ path: '/wat1' }));
const ref2 = createRouteRef(mockConfig({ path: '/wat2' }));
const ref3 = createRouteRef(mockConfig({ path: '/wat3' }));
const ref4 = createRouteRef(mockConfig({ path: '/wat4' }));
const ref5 = createRouteRef(mockConfig({ path: '/wat5' }));

const MockRouteSource = (props: {
  name: string;
  routeRef: RouteRef;
  params?: Record<string, string>;
}) => {
  try {
    const routeFunc = useRouteRef(props.routeRef);
    return (
      <div>
        Path at {props.name}: {routeFunc(props.params)}
      </div>
    );
  } catch (ex) {
    return (
      <div>
        Error at {props.name}: {ex.message}
      </div>
    );
  }
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
const Extension5 = plugin.provide(
  createRoutableExtension({ component: MockComponent, mountPoint: ref5 }),
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

    const { routePaths, routeParents, routeObjects } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routePaths: routePathCollector,
        routeParents: routeParentCollector,
        routeObjects: routeObjectCollector,
      },
    });

    const rendered = render(
      <RoutingProvider
        routePaths={routePaths}
        routeParents={routeParents}
        routeObjects={routeObjects}
      >
        {root}
      </RoutingProvider>,
    );

    expect(rendered.getByText('Path at inside: /foo/bar')).toBeInTheDocument();
    expect(rendered.getByText('Path at outside: /foo/bar')).toBeInTheDocument();
  });

  it('should handle routeRefs with parameters', () => {
    const root = (
      <MemoryRouter initialEntries={['/foo/bar/wat']}>
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

    const { routePaths, routeParents, routeObjects } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routePaths: routePathCollector,
        routeParents: routeParentCollector,
        routeObjects: routeObjectCollector,
      },
    });

    const rendered = render(
      <RoutingProvider
        routePaths={routePaths}
        routeParents={routeParents}
        routeObjects={routeObjects}
      >
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

  it('should handle relative routing within parameterized routePaths', () => {
    const root = (
      <MemoryRouter initialEntries={['/foo/blob/baz']}>
        <Routes>
          <Extension5 path="/foo/:id">
            <Extension2 path="/bar" name="inside" routeRef={ref3} />
            <Extension3 path="/baz" />
          </Extension5>
        </Routes>
        <MockRouteSource name="outsideNoParams" routeRef={ref3} />
        <MockRouteSource
          name="outsideWithParams"
          routeRef={ref3}
          params={{ id: 'blob' }}
        />
      </MemoryRouter>
    );

    const { routePaths, routeParents, routeObjects } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routePaths: routePathCollector,
        routeParents: routeParentCollector,
        routeObjects: routeObjectCollector,
      },
    });

    const rendered = render(
      <RoutingProvider
        routePaths={routePaths}
        routeParents={routeParents}
        routeObjects={routeObjects}
      >
        {root}
      </RoutingProvider>,
    );

    expect(
      rendered.getByText('Path at inside: /foo/blob/baz'),
    ).toBeInTheDocument();
  });

  it('should throw errors for routing to other routeRefs with unsupported parameters', () => {
    const root = (
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Extension5 path="/foo/:id">
            <Extension2 path="/bar" name="inside" routeRef={ref3} />
            <Extension3 path="/baz" />
          </Extension5>
        </Routes>
        <MockRouteSource name="outsideNoParams" routeRef={ref3} />
        <MockRouteSource
          name="outsideWithParams"
          routeRef={ref3}
          params={{ id: 'blob' }}
        />
      </MemoryRouter>
    );

    const { routePaths, routeParents, routeObjects } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routePaths: routePathCollector,
        routeParents: routeParentCollector,
        routeObjects: routeObjectCollector,
      },
    });

    const rendered = render(
      <RoutingProvider
        routePaths={routePaths}
        routeParents={routeParents}
        routeObjects={routeObjects}
      >
        {root}
      </RoutingProvider>,
    );

    expect(
      rendered.getByText(
        `Error at outsideWithParams: Cannot route to ${ref3} with parent ${ref5} as it has parameters`,
      ),
    ).toBeInTheDocument();
    expect(
      rendered.getByText(
        `Error at outsideNoParams: Cannot route to ${ref3} with parent ${ref5} as it has parameters`,
      ),
    ).toBeInTheDocument();
  });

  it('should handle relative routing of parameterized routePaths with duplicate param names', () => {
    const root = (
      <MemoryRouter>
        <Routes>
          <Extension5 path="/foo/:id">
            <Extension4 path="/bar/:id" name="borked" routeRef={ref4} />
          </Extension5>
        </Routes>
      </MemoryRouter>
    );

    const { routePaths, routeParents } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routePaths: routePathCollector,
        routeParents: routeParentCollector,
      },
    });

    expect(() => validateRoutes(routePaths, routeParents)).toThrow(
      'Parameter :id is duplicated in path /foo/:id/bar/:id',
    );
  });
});
