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

import {
  routeResolutionApiRef,
  type AppNode,
} from '@backstage/frontend-plugin-api';
import { TestApiProvider } from '@backstage/frontend-test-utils';
import { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react';
import type { RouteResolutionMatch } from '@backstage/frontend-plugin-api';
import { useAppBasePath } from './appRouting';

const mockRouteNode = {} as AppNode;

// Isolate routing consumers from extension rendering; app tests cover real node ancestry.
jest.mock('../../../frontend-plugin-api/src/components/AppNodeProvider', () => {
  const actual = jest.requireActual(
    '../../../frontend-plugin-api/src/components/AppNodeProvider',
  );
  return { ...actual, useAppNode: () => actual.useAppNode() ?? mockRouteNode };
});

describe('useAppBasePath', () => {
  const wrapper =
    (mount?: Pick<RouteResolutionMatch, 'basePath' | 'routePattern'>) =>
    ({ children }: PropsWithChildren<{}>) =>
      mount ? (
        <TestApiProvider
          apis={[
            [
              routeResolutionApiRef,
              {
                resolvePath: () => ({
                  matches: [
                    {
                      params: {},
                      contributesPath: true,
                      ...mount,
                      node: mockRouteNode,
                    },
                  ],
                }),
              },
            ],
          ]}
        >
          {children}
        </TestApiProvider>
      ) : (
        <>{children}</>
      );

  it('reports the page mount as a concatenable prefix, and nothing outside a page', () => {
    expect(renderHook(() => useAppBasePath()).result.current).toBe('');
    expect(
      renderHook(() => useAppBasePath(), {
        wrapper: wrapper({ basePath: '/catalog', routePattern: '/catalog' }),
      }).result.current,
    ).toBe('/catalog');
    // The app root normalizes to an empty prefix rather than to `/`, so it can
    // be concatenated with a `/`-prefixed suffix without doubling.
    expect(
      renderHook(() => useAppBasePath(), {
        wrapper: wrapper({ basePath: '/', routePattern: '/' }),
      }).result.current,
    ).toBe('');
  });
});
