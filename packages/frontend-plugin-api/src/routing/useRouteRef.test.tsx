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

import { render, renderHook, fireEvent, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { createVersionedContextForTesting } from '@backstage/version-bridge';
import { useRouteRef } from './useRouteRef';
import { createRouteRef } from './RouteRef';
import {
  TestApiProvider,
  TestMemoryRouterProvider,
} from '@backstage/frontend-test-utils';
import { routeResolutionApiRef } from '../apis';
import { useNavigate } from './hooks';

describe('v1 consumer', () => {
  const context = createVersionedContextForTesting('routing-context');

  afterEach(() => {
    context.reset();
  });

  it('should resolve routes', () => {
    const resolve = jest.fn(() => () => '/hello');

    const routeRef = createRouteRef();

    const renderedHook = renderHook(() => useRouteRef(routeRef), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[routeResolutionApiRef, { resolve }]]}>
          <TestMemoryRouterProvider
            initialEntries={['/my-page']}
            children={children}
          />
        </TestApiProvider>
      ),
    });

    const routeFunc = renderedHook.result.current;
    expect(routeFunc?.()).toBe('/hello');
    expect(resolve).toHaveBeenCalledWith(
      routeRef,
      expect.objectContaining({
        sourcePath: '/my-page',
      }),
    );
  });

  it('should ignore missing routes', () => {
    const routeRef = createRouteRef();

    const renderedHook = renderHook(() => useRouteRef(routeRef), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider
          apis={[[routeResolutionApiRef, { resolve: () => undefined }]]}
        >
          <TestMemoryRouterProvider
            initialEntries={['/my-page']}
            children={children}
          />
        </TestApiProvider>
      ),
    });

    const routeFunc = renderedHook.result.current;
    expect(routeFunc).toBeUndefined();
  });

  it('re-resolves the routeFunc when the search parameters change', () => {
    const resolve = jest.fn(() => () => '/hello');
    const routeRef = createRouteRef();

    const Helper = () => {
      const routeFunc = useRouteRef(routeRef);
      const navigate = useNavigate();
      return (
        <div>
          <span data-testid="res">{routeFunc ? routeFunc() : 'undefined'}</span>
          <button onClick={() => navigate('/my-new-page')}>Go</button>
        </div>
      );
    };

    render(
      <TestApiProvider apis={[[routeResolutionApiRef, { resolve }]]}>
        <TestMemoryRouterProvider initialEntries={['/my-page']}>
          <Helper />
        </TestMemoryRouterProvider>
      </TestApiProvider>,
    );

    expect(resolve).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Go'));

    expect(resolve).toHaveBeenCalledTimes(2);
  });

  it('does not re-resolve the routeFunc the location pathname does not change', () => {
    const resolve = jest.fn(() => () => '/hello');
    const routeRef = createRouteRef();

    const Helper = () => {
      useRouteRef(routeRef);
      const navigate = useNavigate();
      return (
        <div>
          <button onClick={() => navigate('/my-page')}>Go</button>
        </div>
      );
    };

    render(
      <TestApiProvider apis={[[routeResolutionApiRef, { resolve }]]}>
        <TestMemoryRouterProvider initialEntries={['/my-page']}>
          <Helper />
        </TestMemoryRouterProvider>
      </TestApiProvider>,
    );

    expect(resolve).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Go'));

    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it('does not re-resolve the routeFunc when the search parameter changes', () => {
    const resolve = jest.fn(() => () => '/hello');
    const routeRef = createRouteRef();

    const Helper = () => {
      useRouteRef(routeRef);
      const navigate = useNavigate();
      return (
        <div>
          <button onClick={() => navigate('/my-page?foo=bar')}>Go</button>
        </div>
      );
    };

    render(
      <TestApiProvider apis={[[routeResolutionApiRef, { resolve }]]}>
        <TestMemoryRouterProvider initialEntries={['/my-page']}>
          <Helper />
        </TestMemoryRouterProvider>
      </TestApiProvider>,
    );

    expect(resolve).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Go'));

    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it('does not re-resolve the routeFunc when the hash parameter changes', () => {
    const resolve = jest.fn(() => () => '/hello');
    const routeRef = createRouteRef();

    const Helper = () => {
      useRouteRef(routeRef);
      const navigate = useNavigate();
      return (
        <div>
          <button onClick={() => navigate('/my-page#foo')}>Go</button>
        </div>
      );
    };

    render(
      <TestApiProvider apis={[[routeResolutionApiRef, { resolve }]]}>
        <TestMemoryRouterProvider initialEntries={['/my-page']}>
          <Helper />
        </TestMemoryRouterProvider>
      </TestApiProvider>,
    );

    expect(resolve).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Go'));

    expect(resolve).toHaveBeenCalledTimes(1);
  });
});
