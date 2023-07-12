/*
 * Copyright 2023 The Backstage Authors
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
import { TestApiProvider } from '@backstage/test-utils';
import React, { ReactNode } from 'react';
import { BackstageRouteObject } from './types';
import { fireEvent, render } from '@testing-library/react';
import { RouteTracker } from './RouteTracker';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  AnalyticsApi,
  analyticsApiRef,
  createPlugin,
  createRouteRef,
} from '@backstage/core-plugin-api';

// buildRoutes recursively builds the route object, recursing into the children
// FIXME(RobotSail): <Route /> can't accept the "plugins" parameter, even though
// this is present on the BackstageRouteObject. Surely, this will case issues.
const buildRoutes = (routes: BackstageRouteObject[]): ReactNode => {
  if (routes.length === 0) {
    return null;
  }
  const routeNodes: React.ReactNode[] = [];
  for (const route of routes) {
    let routeChildren: ReactNode;
    if (route.children) {
      routeChildren = buildRoutes(route.children);
    }
    if (route.index) {
      routeNodes.push(
        <Route
          caseSensitive={route.caseSensitive}
          element={route.element}
          path={route.path}
          key={route.path}
          index={route.index}
        />,
      );
    } else {
      routeNodes.push(
        <Route
          caseSensitive={route.caseSensitive}
          children={routeChildren}
          element={route.element}
          path={route.path}
          key={route.path}
          index={route.index}
        />,
      );
    }
  }
  if (routeNodes.length === 0) {
    return null;
  }
  if (routeNodes.length === 1) {
    return routeNodes[0];
  }
  return <>{routeNodes}</>;
};

describe('RouteTracker', () => {
  const routeRef1 = createRouteRef({
    id: 'route1',
  });
  const routeRef2 = createRouteRef({
    id: 'route2',
  });
  const plugin1 = createPlugin({ id: 'plugin1' });

  const routeObjects: BackstageRouteObject[] = [
    {
      path: '/path/:p1/:p2',
      element: <Link to="/path2/hello">go</Link>,
      routeRefs: new Set([routeRef1]),
      plugins: new Set([plugin1]),
      caseSensitive: false,
      index: true,
    },
    {
      path: '/path2/:param',
      element: <div>hi there</div>,
      routeRefs: new Set([routeRef2]),
      plugins: new Set(),
      caseSensitive: false,
      index: true,
    },
  ];

  const mockedAnalytics: jest.Mocked<AnalyticsApi> = {
    captureEvent: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should capture the navigate event on load', async () => {
    render(
      <MemoryRouter initialEntries={['/path/foo/bar']}>
        <TestApiProvider apis={[[analyticsApiRef, mockedAnalytics]]}>
          <RouteTracker routeObjects={routeObjects} />
        </TestApiProvider>
      </MemoryRouter>,
    );

    expect(mockedAnalytics.captureEvent).toHaveBeenCalledWith({
      action: 'navigate',
      attributes: {
        p1: 'foo',
        p2: 'bar',
      },
      context: {
        extension: 'App',
        pluginId: 'plugin1',
        routeRef: 'route1',
      },
      subject: '/path/foo/bar',
      value: undefined,
    });
  });

  it('should capture the navigate event on route change', async () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/path/foo/bar']}>
        <TestApiProvider apis={[[analyticsApiRef, mockedAnalytics]]}>
          <RouteTracker routeObjects={routeObjects} />

          <Routes>{buildRoutes(routeObjects)}</Routes>
        </TestApiProvider>
      </MemoryRouter>,
    );

    fireEvent.click(getByText('go'));

    expect(mockedAnalytics.captureEvent).toHaveBeenCalledWith({
      action: 'navigate',
      attributes: {
        param: 'hello',
      },
      context: {
        extension: 'App',
        pluginId: 'root',
        routeRef: 'route2',
      },
      subject: '/path2/hello',
      value: undefined,
    });
  });
});
