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
import React from 'react';
import { BackstageRouteObject } from './types';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { RouteTracker } from './RouteTracker';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  AnalyticsApi,
  analyticsApiRef,
  createRouteRef,
} from '@backstage/core-plugin-api';

describe('RouteTracker', () => {
  const routeRef1 = createRouteRef({
    id: 'route1',
  });
  const routeRef2 = createRouteRef({
    id: 'route2',
  });

  const routeObjects: BackstageRouteObject[] = [
    {
      path: '/path/:p1/:p2',
      element: <Link to="/path2/hello">go</Link>,
      routeRefs: new Set([routeRef1]),
      caseSensitive: false,
    },
    {
      path: '/path2/:param',
      element: <div>hi there</div>,
      routeRefs: new Set([routeRef2]),
      caseSensitive: false,
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
        pluginId: 'root',
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

          <Routes>
            {routeObjects.map(({ routeRefs, ...props }) => (
              <Route {...props} key={props.path} />
            ))}
          </Routes>
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
