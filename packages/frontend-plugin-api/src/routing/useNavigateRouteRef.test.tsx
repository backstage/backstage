/*
 * Copyright 2026 The Backstage Authors
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

import { renderHook, act } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { TestApiProvider } from '@backstage/test-utils';
import {
  createMockAppHistory,
  createMockRouteResolutionApi,
} from '@backstage/frontend-test-utils';
import { useNavigateRouteRef } from './useNavigateRouteRef';
import { createRouteRef } from './RouteRef';
import { appHistoryApiRef } from './AppHistoryApi';
import { routeResolutionApiRef } from '../apis';

describe('useNavigateRouteRef', () => {
  const catalogRouteRef = createRouteRef({
    params: ['namespace', 'kind', 'name'],
  });
  const navigate = jest.fn();

  beforeEach(() => {
    navigate.mockClear();
  });

  it('resolves the route ref and navigates via the framework controller', () => {
    const { result } = renderHook(() => useNavigateRouteRef(catalogRouteRef), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider
          apis={[
            [
              routeResolutionApiRef,
              createMockRouteResolutionApi({
                routes: [[catalogRouteRef, '/catalog/:namespace/:kind/:name']],
              }),
            ],
            [appHistoryApiRef, createMockAppHistory({ navigate })],
          ]}
        >
          <MemoryRouter>{children}</MemoryRouter>
        </TestApiProvider>
      ),
    });

    expect(result.current).toBeDefined();
    act(() => {
      result.current!({
        namespace: 'default',
        kind: 'component',
        name: 'widget',
      });
    });

    expect(navigate).toHaveBeenCalledWith(
      '/catalog/default/component/widget',
      undefined,
    );
  });

  it('supports parameter-less route refs and navigate options', () => {
    const homeRouteRef = createRouteRef();
    const { result } = renderHook(() => useNavigateRouteRef(homeRouteRef), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider
          apis={[
            [
              routeResolutionApiRef,
              createMockRouteResolutionApi({
                routes: [[homeRouteRef, '/catalog']],
              }),
            ],
            [appHistoryApiRef, createMockAppHistory({ navigate })],
          ]}
        >
          <MemoryRouter>{children}</MemoryRouter>
        </TestApiProvider>
      ),
    });

    act(() => {
      result.current!({ replace: true });
    });

    expect(navigate).toHaveBeenCalledWith('/catalog', { replace: true });
  });

  it('returns undefined when the route cannot be resolved', () => {
    const { result } = renderHook(() => useNavigateRouteRef(catalogRouteRef), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider
          apis={[
            [
              routeResolutionApiRef,
              createMockRouteResolutionApi({ resolve: () => undefined }),
            ],
            [appHistoryApiRef, createMockAppHistory({ navigate })],
          ]}
        >
          <MemoryRouter>{children}</MemoryRouter>
        </TestApiProvider>
      ),
    });

    expect(result.current).toBeUndefined();
    expect(navigate).not.toHaveBeenCalled();
  });
});
