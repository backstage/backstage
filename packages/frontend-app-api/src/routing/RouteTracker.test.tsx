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

import { useEffect } from 'react';
import {
  TestApiProvider,
  TestMemoryRouterProvider,
} from '@backstage/frontend-test-utils';
import { BackstageRouteObject } from './types';
import { fireEvent, render } from '@testing-library/react';
import { RouteTracker } from './RouteTracker';
import {
  createRouteRef,
  AnalyticsApi,
  analyticsApiRef,
  AppNode,
  useAnalytics,
  Link,
  Routes,
  Route,
} from '@backstage/frontend-plugin-api';
import { MATCH_ALL_ROUTE } from './extractRouteInfoFromAppNode';

describe('RouteTracker', () => {
  const routeRef0 = createRouteRef();
  const routeRef1 = createRouteRef();
  const routeRef2 = createRouteRef();

  const routeObjects: BackstageRouteObject[] = [
    {
      path: '',
      element: <div>home page</div>,
      routeRefs: new Set([routeRef0]),
      caseSensitive: false,
      children: [MATCH_ALL_ROUTE],
      appNode: {
        spec: {
          extension: { id: 'home.page.index' },
          plugin: { id: 'home' },
        },
      } as AppNode,
    },
    {
      path: '/path/:p1/:p2',
      element: <Link to="/path2/hello">go</Link>,
      routeRefs: new Set([routeRef1]),
      caseSensitive: false,
      children: [MATCH_ALL_ROUTE],
      appNode: {
        spec: {
          extension: { id: 'plugin1.page.index' },
          plugin: { id: 'plugin1' },
        },
      } as AppNode,
    },
    {
      path: '/path2/:param',
      element: <div>hi there</div>,
      routeRefs: new Set([routeRef2]),
      caseSensitive: false,
      children: [MATCH_ALL_ROUTE],
      appNode: {
        spec: {
          extension: { id: 'plugin2.page.index' },
          plugin: { id: 'plugin2' },
        },
      } as AppNode,
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
      <TestMemoryRouterProvider initialEntries={['/path/foo/bar']}>
        <TestApiProvider apis={[[analyticsApiRef, mockedAnalytics]]}>
          <RouteTracker routeObjects={routeObjects} />
        </TestApiProvider>
      </TestMemoryRouterProvider>,
    );

    expect(mockedAnalytics.captureEvent).toHaveBeenCalledWith({
      action: 'navigate',
      attributes: {
        p1: 'foo',
        p2: 'bar',
      },
      context: {
        extensionId: 'plugin1.page.index',
        pluginId: 'plugin1',
      },
      subject: '/path/foo/bar',
      value: undefined,
    });
  });

  it('should capture the navigate event on route change', async () => {
    const { getByText } = render(
      <TestMemoryRouterProvider initialEntries={['/path/foo/bar']}>
        <TestApiProvider apis={[[analyticsApiRef, mockedAnalytics]]}>
          <RouteTracker routeObjects={routeObjects} />
          <Routes>
            {routeObjects.map(({ path, element }) => (
              <Route key={path} path={path || '/'} element={element} />
            ))}
          </Routes>
        </TestApiProvider>
      </TestMemoryRouterProvider>,
    );

    fireEvent.click(getByText('go'));

    expect(mockedAnalytics.captureEvent).toHaveBeenCalledWith({
      action: 'navigate',
      attributes: {
        param: 'hello',
      },
      context: {
        extensionId: 'plugin2.page.index',
        pluginId: 'plugin2',
      },
      subject: '/path2/hello',
      value: undefined,
    });
  });

  it('should capture path query and hash', async () => {
    render(
      <TestMemoryRouterProvider initialEntries={['/path/foo/bar?q=1#header-1']}>
        <TestApiProvider apis={[[analyticsApiRef, mockedAnalytics]]}>
          <RouteTracker routeObjects={routeObjects} />
        </TestApiProvider>
      </TestMemoryRouterProvider>,
    );

    expect(mockedAnalytics.captureEvent).toHaveBeenCalledWith({
      action: 'navigate',
      attributes: {
        p1: 'foo',
        p2: 'bar',
      },
      context: {
        extensionId: 'plugin1.page.index',
        pluginId: 'plugin1',
      },
      subject: '/path/foo/bar?q=1#header-1',
      value: undefined,
    });
  });

  it('should match the root path and send relevant context', async () => {
    render(
      <TestMemoryRouterProvider initialEntries={['/']}>
        <TestApiProvider apis={[[analyticsApiRef, mockedAnalytics]]}>
          <RouteTracker routeObjects={routeObjects} />
        </TestApiProvider>
      </TestMemoryRouterProvider>,
    );

    expect(mockedAnalytics.captureEvent).toHaveBeenCalledWith({
      action: 'navigate',
      attributes: {},
      context: {
        extensionId: 'home.page.index',
        pluginId: 'home',
      },
      subject: '/',
      value: undefined,
    });
  });

  it('should return default context when it would have otherwise matched on the root path', async () => {
    const Dummy = () => {
      const analytics = useAnalytics();
      useEffect(() => {
        analytics.captureEvent('click', 'test', {});
      }, [analytics]);
      return <div>dummy</div>;
    };

    render(
      <TestMemoryRouterProvider initialEntries={['/not-routable-extension']}>
        <TestApiProvider apis={[[analyticsApiRef, mockedAnalytics]]}>
          <RouteTracker routeObjects={routeObjects} />
          <Routes>
            <Route path="/not-routable-extension" element={<Dummy />} />
          </Routes>
        </TestApiProvider>
      </TestMemoryRouterProvider>,
    );

    expect(mockedAnalytics.captureEvent).toHaveBeenNthCalledWith(1, {
      action: 'navigate',
      attributes: {},
      context: {
        extensionId: 'app',
        pluginId: 'app',
      },
      subject: '/not-routable-extension',
      value: undefined,
    });
    expect(mockedAnalytics.captureEvent).toHaveBeenNthCalledWith(2, {
      action: 'click',
      attributes: undefined,
      context: {
        extensionId: 'app',
        pluginId: 'app',
      },
      subject: 'test',
      value: undefined,
    });
  });

  it('should return parent route context on navigating to a sub-route', async () => {
    render(
      <TestMemoryRouterProvider
        initialEntries={['/path2/param-value/sub-route']}
      >
        <TestApiProvider apis={[[analyticsApiRef, mockedAnalytics]]}>
          <RouteTracker routeObjects={routeObjects} />
        </TestApiProvider>
      </TestMemoryRouterProvider>,
    );

    expect(mockedAnalytics.captureEvent).toHaveBeenCalledWith({
      action: 'navigate',
      attributes: {
        param: 'param-value',
      },
      context: {
        extensionId: 'plugin2.page.index',
        pluginId: 'plugin2',
      },
      subject: '/path2/param-value/sub-route',
      value: undefined,
    });
  });
});
