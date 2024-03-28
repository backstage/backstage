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

import { renderHook } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createVersionedContextForTesting } from '@backstage/version-bridge';
import { useRouteRef } from './useRouteRef';
import { createRouteRef } from './RouteRef';
import { createBrowserHistory } from 'history';
import { TestApiProvider } from '@backstage/test-utils';
import { routeResolutionApiRef } from '../apis';

describe('v1 consumer', () => {
  const context = createVersionedContextForTesting('routing-context');

  afterEach(() => {
    context.reset();
  });

  it('should resolve routes', () => {
    const resolve = jest.fn(() => () => '/hello');

    const routeRef = createRouteRef();

    const renderedHook = renderHook(() => useRouteRef(routeRef), {
      wrapper: ({ children }: React.PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[routeResolutionApiRef, { resolve }]]}>
          <MemoryRouter initialEntries={['/my-page']} children={children} />
        </TestApiProvider>
      ),
    });

    const routeFunc = renderedHook.result.current;
    expect(routeFunc()).toBe('/hello');
    expect(resolve).toHaveBeenCalledWith(
      routeRef,
      expect.objectContaining({
        sourcePath: '/my-page',
      }),
    );
  });

  it('re-resolves the routeFunc when the search parameters change', () => {
    const resolve = jest.fn(() => () => '/hello');

    const routeRef = createRouteRef();
    const history = createBrowserHistory();
    history.push('/my-page');

    const { rerender } = renderHook(() => useRouteRef(routeRef), {
      wrapper: ({ children }: React.PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[routeResolutionApiRef, { resolve }]]}>
          <Router
            location={history.location}
            navigator={history}
            children={children}
          />
        </TestApiProvider>
      ),
    });

    expect(resolve).toHaveBeenCalledTimes(1);

    history.push('/my-new-page');
    rerender();

    expect(resolve).toHaveBeenCalledTimes(2);
  });

  it('does not re-resolve the routeFunc the location pathname does not change', () => {
    const resolve = jest.fn(() => () => '/hello');
    const api = { resolve };

    const routeRef = createRouteRef();
    const history = createBrowserHistory();
    history.push('/my-page');

    const { rerender } = renderHook(() => useRouteRef(routeRef), {
      wrapper: ({ children }: React.PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[routeResolutionApiRef, api]]}>
          <Router
            location={history.location}
            navigator={history}
            children={children}
          />
        </TestApiProvider>
      ),
    });

    expect(resolve).toHaveBeenCalledTimes(1);

    history.push('/my-page');
    rerender();

    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it('does not re-resolve the routeFunc when the search parameter changes', () => {
    const resolve = jest.fn(() => () => '/hello');
    const api = { resolve };

    const routeRef = createRouteRef();
    const history = createBrowserHistory();
    history.push('/my-page');

    const { rerender } = renderHook(() => useRouteRef(routeRef), {
      wrapper: ({ children }: React.PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[routeResolutionApiRef, api]]}>
          <Router
            location={history.location}
            navigator={history}
            children={children}
          />
        </TestApiProvider>
      ),
    });

    expect(resolve).toHaveBeenCalledTimes(1);

    history.push('/my-page?foo=bar');
    rerender();

    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it('does not re-resolve the routeFunc when the hash parameter changes', () => {
    const resolve = jest.fn(() => () => '/hello');
    const api = { resolve };

    const routeRef = createRouteRef();
    const history = createBrowserHistory();
    history.push('/my-page');

    const { rerender } = renderHook(() => useRouteRef(routeRef), {
      wrapper: ({ children }: React.PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[routeResolutionApiRef, api]]}>
          <Router
            location={history.location}
            navigator={history}
            children={children}
          />
        </TestApiProvider>
      ),
    });

    expect(resolve).toHaveBeenCalledTimes(1);

    history.push('/my-page#foo');
    rerender();

    expect(resolve).toHaveBeenCalledTimes(1);
  });
});
