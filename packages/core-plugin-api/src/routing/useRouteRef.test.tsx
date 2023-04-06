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

import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createVersionedContextForTesting } from '@backstage/version-bridge';
import { useRouteRef } from './useRouteRef';
import { createRouteRef } from './RouteRef';
import { createBrowserHistory } from 'history';

describe('v1 consumer', () => {
  const context = createVersionedContextForTesting('routing-context');

  afterEach(() => {
    context.reset();
  });

  it('should resolve routes', () => {
    const resolve = jest.fn(() => () => '/hello');
    context.set({ 1: { resolve } });

    const routeRef = createRouteRef({ id: 'ref1' });

    const renderedHook = renderHook(() => useRouteRef(routeRef), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/my-page']} children={children} />
      ),
    });

    const routeFunc = renderedHook.result.current;
    expect(routeFunc()).toBe('/hello');
    expect(resolve).toHaveBeenCalledWith(
      routeRef,
      expect.objectContaining({
        pathname: '/my-page',
      }),
    );
  });

  it('re-resolves the routeFunc when the search parameters change', () => {
    const resolve = jest.fn(() => () => '/hello');
    context.set({ 1: { resolve } });

    const routeRef = createRouteRef({ id: 'ref1' });
    const history = createBrowserHistory();
    history.push('/my-page');

    const { rerender } = renderHook(() => useRouteRef(routeRef), {
      wrapper: ({ children }) => (
        <Router
          location={history.location}
          navigator={history}
          children={children}
        />
      ),
    });

    expect(resolve).toHaveBeenCalledTimes(1);

    history.push('/my-new-page');
    rerender();

    expect(resolve).toHaveBeenCalledTimes(2);
  });

  it('does not re-resolve the routeFunc the location pathname does not change', () => {
    const resolve = jest.fn(() => () => '/hello');
    context.set({ 1: { resolve } });

    const routeRef = createRouteRef({ id: 'ref1' });
    const history = createBrowserHistory();
    history.push('/my-page');

    const { rerender } = renderHook(() => useRouteRef(routeRef), {
      wrapper: ({ children }) => (
        <Router
          location={history.location}
          navigator={history}
          children={children}
        />
      ),
    });

    expect(resolve).toHaveBeenCalledTimes(1);

    history.push('/my-page');
    rerender();

    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it('does not re-resolve the routeFunc when the search parameter changes', () => {
    const resolve = jest.fn(() => () => '/hello');
    context.set({ 1: { resolve } });

    const routeRef = createRouteRef({ id: 'ref1' });
    const history = createBrowserHistory();
    history.push('/my-page');

    const { rerender } = renderHook(() => useRouteRef(routeRef), {
      wrapper: ({ children }) => (
        <Router
          location={history.location}
          navigator={history}
          children={children}
        />
      ),
    });

    expect(resolve).toHaveBeenCalledTimes(1);

    history.push('/my-page?foo=bar');
    rerender();

    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it('does not re-resolve the routeFunc when the hash parameter changes', () => {
    const resolve = jest.fn(() => () => '/hello');
    context.set({ 1: { resolve } });

    const routeRef = createRouteRef({ id: 'ref1' });
    const history = createBrowserHistory();
    history.push('/my-page');

    const { rerender } = renderHook(() => useRouteRef(routeRef), {
      wrapper: ({ children }) => (
        <Router
          location={history.location}
          navigator={history}
          children={children}
        />
      ),
    });

    expect(resolve).toHaveBeenCalledTimes(1);

    history.push('/my-page#foo');
    rerender();

    expect(resolve).toHaveBeenCalledTimes(1);
  });
});
