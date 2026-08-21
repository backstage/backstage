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
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import { useEffect, type ReactNode } from 'react';
import { BackstageRouteObject } from './types';
import { act, render } from '@testing-library/react';
import { RouteTracker } from './RouteTracker';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  createRouteRef,
  AnalyticsApi,
  analyticsApiRef,
  AppNode,
  useAnalytics,
  appHistoryApiRef,
  type AppHistoryApi,
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
      element: <div>path page</div>,
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

  function renderWithNavigation(
    initialPath: string,
    children?: ReactNode,
    appHistory: AppHistoryApi = createMockAppHistory({
      initialLocation: initialPath,
    }),
  ) {
    return {
      appHistory,
      ...render(
        <TestApiProvider
          apis={[
            [analyticsApiRef, mockedAnalytics],
            [appHistoryApiRef, appHistory],
          ]}
        >
          <RouteTracker routeObjects={routeObjects} />
          {children}
        </TestApiProvider>,
      ),
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should capture the navigate event on load', async () => {
    renderWithNavigation('/path/foo/bar');

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
    const { appHistory } = renderWithNavigation('/path/foo/bar');

    act(() => {
      appHistory.navigate('/path2/hello');
    });

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
    renderWithNavigation('/path/foo/bar?q=1#header-1');

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
    renderWithNavigation('/');

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

    renderWithNavigation(
      '/not-routable-extension',
      <MemoryRouter initialEntries={['/not-routable-extension']}>
        <Routes>
          <Route path="/not-routable-extension" element={<Dummy />} />
        </Routes>
      </MemoryRouter>,
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
    renderWithNavigation('/path2/param-value/sub-route');

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
