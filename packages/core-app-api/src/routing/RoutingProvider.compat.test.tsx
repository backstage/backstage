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

import React, { PropsWithChildren, ReactElement } from 'react';
import { render } from '@testing-library/react';
import type {
  BackstagePlugin,
  RouteRef,
  ExternalRouteRef,
} from '@backstage/core-plugin-api';
import type { AnyRouteRef, RouteFunc } from './types';

const mockContext = {
  getComponents: () => ({ Progress: () => null }) as any,
  getSystemIcon: jest.fn(),
  getSystemIcons: jest.fn(),
  getPlugins: jest.fn(),
};

describe.each(['beta', 'stable'])('react-router %s', rrVersion => {
  function requireDeps() {
    return {
      ...(require('./FlatRoutes') as typeof import('./FlatRoutes')),
      ...(require('react-router-dom') as typeof import('react-router-dom')),
      ...(require('./RoutingProvider') as typeof import('./RoutingProvider')),
      ...(require('../extensions/traversal') as typeof import('../extensions/traversal')),
      ...(require('./collectors') as typeof import('./collectors')),
      ...(require('./validation') as typeof import('./validation')),
      ...(require('./types') as typeof import('./types')),
      ...(require('../app/AppContext') as typeof import('../app/AppContext')),
      ...(require('@backstage/core-plugin-api') as typeof import('@backstage/core-plugin-api')),
    };
  }

  const MockComponent = ({ children }: PropsWithChildren<{}>) => {
    const { useOutlet } = requireDeps();
    return (
      <>
        {children}
        <section>{useOutlet()}</section>
      </>
    );
  };

  const MockRouteSource = <T extends { [name in string]: string }>(props: {
    path?: string;
    name: string;
    routeRef: AnyRouteRef;
    params?: T;
  }) => {
    const { useRouteRef } = requireDeps();
    try {
      const routeFunc = useRouteRef(props.routeRef as any) as
        | RouteFunc<any>
        | undefined;
      return (
        <div>
          Path at {props.name}: {routeFunc?.(props.params) ?? '<none>'}
        </div>
      );
    } catch (ex) {
      return (
        <div>
          Error at {props.name}, {String(ex)}
        </div>
      );
    }
  };

  let plugin: BackstagePlugin;
  let refPage1: RouteRef;
  let refSource1: RouteRef;
  let refPage2: RouteRef;
  let refSource2: RouteRef;
  let refPage3: RouteRef<{ x: string }>;
  let eRefA: ExternalRouteRef;
  let eRefB: ExternalRouteRef;
  let eRefC: ExternalRouteRef;
  let eRefD: ExternalRouteRef;
  let eRefE: ExternalRouteRef;

  let ExtensionPage1: typeof MockComponent;
  let ExtensionPage2: typeof MockComponent;
  let ExtensionPage3: typeof MockComponent;
  let ExtensionSource1: typeof MockRouteSource;
  let ExtensionSource2: typeof MockRouteSource;

  beforeAll(() => {
    jest.doMock('react', () => React);
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

    const {
      createRoutableExtension,
      createExternalRouteRef,
      createRouteRef,
      createPlugin,
    } = requireDeps();

    plugin = createPlugin({ id: 'my-plugin' });
    refPage1 = createRouteRef({ id: 'refPage1' });
    refSource1 = createRouteRef({ id: 'refSource1' });
    refPage2 = createRouteRef({ id: 'refPage2' });
    refSource2 = createRouteRef({ id: 'refSource2' });
    refPage3 = createRouteRef({ id: 'refPage3', params: ['x'] });
    eRefA = createExternalRouteRef({ id: '1' });
    eRefB = createExternalRouteRef({ id: '2' });
    eRefC = createExternalRouteRef({ id: '3', params: ['y'] });
    eRefD = createExternalRouteRef({ id: '4', optional: true });
    eRefE = createExternalRouteRef({ id: '5', optional: true, params: ['z'] });

    ExtensionPage1 = plugin.provide(
      createRoutableExtension({
        name: 'ExtensionPage1',
        component: () => Promise.resolve(MockComponent),
        mountPoint: refPage1,
      }),
    );
    ExtensionPage2 = plugin.provide(
      createRoutableExtension({
        name: 'ExtensionPage2',
        component: () => Promise.resolve(MockComponent),
        mountPoint: refPage2,
      }),
    );
    ExtensionPage3 = plugin.provide(
      createRoutableExtension({
        name: 'ExtensionPage3',
        component: () => Promise.resolve(MockComponent),
        mountPoint: refPage3,
      }),
    );
    ExtensionSource1 = plugin.provide(
      createRoutableExtension({
        name: 'ExtensionSource1',
        component: () => Promise.resolve(MockRouteSource),
        mountPoint: refSource1,
      }),
    );
    ExtensionSource2 = plugin.provide(
      createRoutableExtension({
        name: 'ExtensionSource2',
        component: () => Promise.resolve(MockRouteSource),
        mountPoint: refSource2,
      }),
    );
  });

  afterAll(() => {
    jest.resetModules();
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  function withRoutingProvider(
    root: ReactElement,
    routeBindings: [ExternalRouteRef, RouteRef][] = [],
  ) {
    const {
      traverseElementTree,
      childDiscoverer,
      routeElementDiscoverer,
      routingV2Collector,
      RoutingProvider,
    } = requireDeps();
    const { routing } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routing: routingV2Collector,
      },
    });

    return (
      <RoutingProvider
        routePaths={routing.paths}
        routeParents={routing.parents}
        routeObjects={routing.objects}
        routeBindings={new Map(routeBindings)}
        basePath=""
      >
        {root}
      </RoutingProvider>
    );
  }

  it('should handle simple routeRef path creation for routeRefs used in other parts of the app', async () => {
    const { MemoryRouter, Routes, Route, AppContextProvider } = requireDeps();
    const root = (
      <AppContextProvider appContext={mockContext}>
        <MemoryRouter initialEntries={['/foo/bar']}>
          <Routes>
            <Route
              path="foo"
              element={
                <>
                  <ExtensionPage1 />
                  <MockRouteSource name="insideExternal" routeRef={eRefA} />
                </>
              }
            >
              <Route
                path="bar"
                element={
                  <ExtensionSource1 name="inside" routeRef={refSource1} />
                }
              />
            </Route>
            <Route path="baz" element={<ExtensionPage2 />} />
          </Routes>

          <MockRouteSource name="outside" routeRef={refSource1} />
          <MockRouteSource name="outsideExternal1" routeRef={eRefB} />
          <MockRouteSource name="outsideExternal2" routeRef={eRefC} />
          <MockRouteSource name="outsideExternal3" routeRef={eRefD} />
          <MockRouteSource name="outsideExternal4" routeRef={eRefE} />
        </MemoryRouter>
      </AppContextProvider>
    );

    const rendered = render(
      withRoutingProvider(root, [
        [eRefA, refPage2],
        [eRefB, refPage1],
        [eRefC, refSource1],
        [eRefD, refPage1],
      ]),
    );

    await new Promise(r => setTimeout(r, 500));

    await expect(
      rendered.findByText('Path at inside: /foo/bar'),
    ).resolves.toBeInTheDocument();
    expect(
      rendered.getByText('Path at insideExternal: /baz'),
    ).toBeInTheDocument();
    expect(rendered.getByText('Path at outside: /foo/bar')).toBeInTheDocument();
    expect(
      rendered.getByText('Path at outsideExternal1: /foo'),
    ).toBeInTheDocument();
    expect(
      rendered.getByText('Path at outsideExternal2: /foo/bar'),
    ).toBeInTheDocument();
    expect(
      rendered.getByText('Path at outsideExternal3: /foo'),
    ).toBeInTheDocument();
    expect(
      rendered.getByText('Path at outsideExternal4: <none>'),
    ).toBeInTheDocument();
  });

  it('should handle routeRefs with parameters', async () => {
    const { MemoryRouter, Routes, Route, AppContextProvider } = requireDeps();
    const root = (
      <AppContextProvider appContext={mockContext}>
        <MemoryRouter initialEntries={['/foo/bar/wat']}>
          <Routes>
            <Route path="foo" element={<ExtensionPage1 />}>
              <Route
                path="bar/:id"
                element={
                  <ExtensionSource2
                    name="inside"
                    routeRef={refSource2}
                    params={{ id: 'bleb' }}
                  />
                }
              />
            </Route>
          </Routes>
          <MockRouteSource
            name="outside"
            routeRef={refSource2}
            params={{ id: 'blob' }}
          />
        </MemoryRouter>
      </AppContextProvider>
    );

    const rendered = render(withRoutingProvider(root));

    await expect(
      rendered.findByText('Path at inside: /foo/bar/bleb'),
    ).resolves.toBeInTheDocument();
    expect(
      rendered.getByText('Path at outside: /foo/bar/blob'),
    ).toBeInTheDocument();
  });

  it('should handle relative routing within parameterized routePaths', async () => {
    const { MemoryRouter, Routes, Route, AppContextProvider } = requireDeps();
    const root = (
      <AppContextProvider appContext={mockContext}>
        <MemoryRouter initialEntries={['/foo/blob/bar']}>
          <React.Suspense fallback="loller">
            <Routes>
              <Route path="foo/:id" element={<ExtensionPage3 />}>
                <Route
                  path="bar"
                  element={
                    <ExtensionSource1 name="inside" routeRef={refPage2} />
                  }
                />
                <Route path="baz" element={<ExtensionPage2 />} />
              </Route>
            </Routes>
            <MockRouteSource name="outsideNoParams" routeRef={refPage2} />
            <MockRouteSource
              name="outsideWithParams"
              routeRef={refPage2}
              params={{ id: 'other' }}
            />
          </React.Suspense>
        </MemoryRouter>
      </AppContextProvider>
    );

    const rendered = render(withRoutingProvider(root));

    await expect(
      rendered.findByText('Path at inside: /foo/blob/baz'),
    ).resolves.toBeInTheDocument();
  });

  it('should throw errors for routing to other routeRefs with unsupported parameters', () => {
    const { MemoryRouter, Routes, Route } = requireDeps();
    const root = (
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<div />} />
          <Route path="foo:id" element={<ExtensionPage3 />}>
            <Route
              path="bar"
              element={<ExtensionSource1 name="inside" routeRef={refPage2} />}
            />
            <Route path="baz" element={<ExtensionPage2 />} />
          </Route>
        </Routes>
        <MockRouteSource name="outsideNoParams" routeRef={refPage2} />
        <MockRouteSource
          name="outsideWithParams"
          routeRef={refPage2}
          params={{ id: 'blob' }}
        />
      </MemoryRouter>
    );

    const rendered = render(withRoutingProvider(root));

    expect(
      rendered.getByText(
        `Error at outsideWithParams, Error: Cannot route to ${refPage2} with parent ${refPage3} as it has parameters`,
      ),
    ).toBeInTheDocument();
    expect(
      rendered.getByText(
        `Error at outsideNoParams, Error: Cannot route to ${refPage2} with parent ${refPage3} as it has parameters`,
      ),
    ).toBeInTheDocument();
  });

  it('should handle relative routing of parameterized routePaths with duplicate param names', () => {
    const {
      MemoryRouter,
      Routes,
      Route,
      traverseElementTree,
      childDiscoverer,
      routeElementDiscoverer,
      routingV2Collector,
      validateRouteParameters,
    } = requireDeps();
    const root = (
      <MemoryRouter>
        <Routes>
          <Route path="foo/:id" element={<ExtensionPage3 />}>
            <Route
              path="bar/:id"
              element={<ExtensionSource2 name="borked" routeRef={refSource2} />}
            />
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

    expect(() =>
      validateRouteParameters(routing.paths, routing.parents),
    ).toThrow('Parameter :id is duplicated in path foo/:id/bar/:id');
  });
});
