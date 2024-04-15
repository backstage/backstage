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
import { MemoryRouter, Routes, Route, useOutlet } from 'react-router-dom';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useVersionedContext } from '@backstage/version-bridge';
import {
  childDiscoverer,
  routeElementDiscoverer,
  traverseElementTree,
} from '../extensions/traversal';
import {
  createPlugin,
  useRouteRef,
  createRoutableExtension,
  createRouteRef,
  createExternalRouteRef,
  RouteRef,
  ExternalRouteRef,
} from '@backstage/core-plugin-api';
import { RoutingProvider } from './RoutingProvider';
import { routingV2Collector } from './collectors';
import { validateRouteParameters } from './validation';
import { RouteResolver } from './RouteResolver';
import { AnyRouteRef, RouteFunc } from './types';
import { AppContextProvider } from '../app/AppContext';

jest.mock('react-router', () => jest.requireActual('react-router-stable'));
jest.mock('react-router-dom', () =>
  jest.requireActual('react-router-dom-stable'),
);

const MockComponent = ({ children }: PropsWithChildren<{}>) => (
  <>
    {children}
    <section>{useOutlet()}</section>
  </>
);

const plugin = createPlugin({ id: 'my-plugin' });

const refPage1 = createRouteRef({ id: 'refPage1' });
const refSource1 = createRouteRef({ id: 'refSource1' });
const refPage2 = createRouteRef({ id: 'refPage2' });
const refSource2 = createRouteRef({ id: 'refSource2' });
const refPage3 = createRouteRef({ id: 'refPage3', params: ['x'] });
const eRefA = createExternalRouteRef({ id: '1' });
const eRefB = createExternalRouteRef({ id: '2' });
const eRefC = createExternalRouteRef({ id: '3', params: ['y'] });
const eRefD = createExternalRouteRef({ id: '4', optional: true });
const eRefE = createExternalRouteRef({
  id: '5',
  optional: true,
  params: ['z'],
});

const MockRouteSource = <T extends { [name in string]: string }>(props: {
  path?: string;
  name: string;
  routeRef: AnyRouteRef;
  params?: T;
}) => {
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

const ExtensionPage1 = plugin.provide(
  createRoutableExtension({
    name: 'ExtensionPage1',
    component: () => Promise.resolve(MockComponent),
    mountPoint: refPage1,
  }),
);
const ExtensionPage2 = plugin.provide(
  createRoutableExtension({
    name: 'ExtensionPage2',
    component: () => Promise.resolve(MockComponent),
    mountPoint: refPage2,
  }),
);
const ExtensionPage3 = plugin.provide(
  createRoutableExtension({
    name: 'ExtensionPage3',
    component: () => Promise.resolve(MockComponent),
    mountPoint: refPage3,
  }),
);
const ExtensionSource1 = plugin.provide(
  createRoutableExtension({
    name: 'ExtensionSource1',
    component: () => Promise.resolve(MockRouteSource),
    mountPoint: refSource1,
  }),
);
const ExtensionSource2 = plugin.provide(
  createRoutableExtension({
    name: 'ExtensionSource2',
    component: () => Promise.resolve(MockRouteSource),
    mountPoint: refSource2,
  }),
);

const mockContext = {
  getComponents: () => ({ Progress: () => null }) as any,
  getSystemIcon: jest.fn(),
  getSystemIcons: jest.fn(),
  getPlugins: jest.fn(),
};

function withRoutingProvider(
  root: ReactElement,
  routeBindings: [ExternalRouteRef, RouteRef][] = [],
) {
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

describe('discovery', () => {
  it('should handle simple routeRef path creation for routeRefs used in other parts of the app', async () => {
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

describe('v1 consumer', () => {
  function useMockRouteRefV1(
    routeRef: AnyRouteRef,
    location: string,
  ): RouteFunc<any> | undefined {
    const resolver = useVersionedContext<{
      1: RouteResolver;
    }>('routing-context')?.atVersion(1);
    if (!resolver) {
      throw new Error('no impl');
    }
    return resolver.resolve(routeRef, location);
  }

  it('should resolve routes', () => {
    const routeRef1 = createRouteRef({ id: 'refPage1' });
    const routeRef2 = createRouteRef({ id: 'refSource1' });
    const routeRef3 = createRouteRef({ id: 'refPage2', params: ['x'] });

    const renderedHook = renderHook(
      ({ routeRef }) => useMockRouteRefV1(routeRef, '/'),
      {
        initialProps: {
          routeRef: routeRef1 as AnyRouteRef,
        },
        wrapper: ({ children }) => (
          <RoutingProvider
            routePaths={
              new Map<RouteRef<any>, string>([
                [routeRef2, '/foo'],
                [routeRef3, '/bar/:x'],
              ])
            }
            routeParents={new Map()}
            routeObjects={[]}
            routeBindings={new Map()}
            basePath="/base"
            children={children}
          />
        ),
      },
    );

    expect(renderedHook.result.current).toBe(undefined);
    renderedHook.rerender({ routeRef: routeRef2 });
    expect(renderedHook.result.current?.()).toBe('/base/foo');
    renderedHook.rerender({ routeRef: routeRef3 });
    expect(renderedHook.result.current?.({ x: 'my-x' })).toBe('/base/bar/my-x');
  });
});
