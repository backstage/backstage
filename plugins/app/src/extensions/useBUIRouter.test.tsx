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

import { appHistoryApiRef, type AppNode } from '@backstage/frontend-plugin-api';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import {
  TestApiProvider,
  mockApis,
  createMockAppHistory,
} from '@backstage/frontend-test-utils';

import { useBUIRouter } from './useBUIRouter';
import { Link, RouterProvider } from 'react-aria-components';

const mockRouteNode = {} as AppNode;

// Isolate routing consumers from extension rendering; app tests cover real node ancestry.
jest.mock(
  '../../../../packages/frontend-plugin-api/src/components/AppNodeProvider',
  () => {
    const actual = jest.requireActual(
      '../../../../packages/frontend-plugin-api/src/components/AppNodeProvider',
    );
    return {
      ...actual,
      useAppNode: () => actual.useAppNode() ?? mockRouteNode,
    };
  },
);

describe('useBUIRouter', () => {
  it('keeps direct React Aria hrefs and clicks in the provider scope across a deeper mount', () => {
    const history = createMockAppHistory({
      basename: '/app',
      initialLocation: '/app/catalog/entity',
    });
    function Content() {
      const routing = useBUIRouter();
      return (
        <RouterProvider
          navigate={routing.navigate}
          useHref={routing.resolveHref}
        >
          <TestApiProvider
            apis={[
              mockApis.routeResolution({
                resolvePath: {
                  matches: [
                    {
                      basePath: '/catalog/entity',
                      routePattern: '/catalog/:name',
                      node: mockRouteNode,
                    },
                  ],
                },
              }),
            ]}
          >
            <Link href="details?view=docs#intro">Details</Link>
          </TestApiProvider>
        </RouterProvider>
      );
    }
    render(
      <TestApiProvider
        apis={[
          [appHistoryApiRef, history],
          mockApis.routeResolution({
            resolvePath: {
              matches: [
                {
                  basePath: '/catalog',
                  node: mockRouteNode,
                },
              ],
            },
          }),
        ]}
      >
        <Content />
      </TestApiProvider>,
    );
    const link = screen.getByRole('link', { name: 'Details' });
    expect(link).toHaveAttribute(
      'href',
      '/app/catalog/details?view=docs#intro',
    );
    fireEvent.click(link);
    expect(history.location).toMatchObject({
      pathname: '/catalog/details',
      search: '?view=docs',
      hash: '#intro',
      state: undefined,
    });
  });

  it('binds hrefs and navigation to the same page ancestry and tracks location changes', () => {
    const history = createMockAppHistory({
      basename: '/app',
      initialLocation: '/app/catalog/entity/docs',
    });
    const { result } = renderHook(() => useBUIRouter(), {
      wrapper: ({ children }) => (
        <TestApiProvider
          apis={[
            [appHistoryApiRef, history],
            mockApis.routeResolution({
              resolvePath: {
                matches: [
                  { basePath: '/catalog' },
                  {
                    basePath: '/catalog/entity',
                    routePattern: '/catalog/:name',
                  },
                ].map(mount => ({ ...mount, node: mockRouteNode })),
              },
            }),
          ]}
        >
          {children}
        </TestApiProvider>
      ),
    });
    expect(result.current.resolveHref('../create?view=docs#intro')).toBe(
      '/app/catalog/create?view=docs#intro',
    );
    expect(result.current.resolveHref('?view=docs')).toBe(
      '/app/catalog/entity/docs?view=docs',
    );
    expect(result.current.resolveHref('https://example.com/docs')).toBe(
      'https://example.com/docs',
    );
    act(() =>
      result.current.navigate('../create?view=docs#intro', {
        replace: true,
        state: { source: 'aria' },
      }),
    );
    expect(history.location).toMatchObject({
      pathname: '/catalog/create',
      search: '?view=docs',
      hash: '#intro',
      state: { source: 'aria' },
    });
    expect(result.current.pathname).toBe('/app/catalog/create');
    const navigate = result.current.navigate;
    act(() => history.navigate('/catalog/other'));
    act(() => navigate('#latest'));
    expect(history.location).toMatchObject({
      pathname: '/catalog/other',
      hash: '#latest',
    });
    act(() => navigate('../create'));
    expect(history.location.pathname).toBe('/catalog/create');
  });

  it('keeps browser destinations out of app history and sanitizes executable hrefs', () => {
    const history = createMockAppHistory();
    const { result } = renderHook(() => useBUIRouter(), {
      wrapper: ({ children }) => (
        <TestApiProvider
          apis={[[appHistoryApiRef, history], mockApis.routeResolution()]}
        >
          {children}
        </TestApiProvider>
      ),
    });
    const warning = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      expect(result.current.resolveHref('java\tscript:alert(1)')).toBe(
        'about:blank',
      );
      expect(warning).toHaveBeenCalledTimes(1);
      const before = history.location;
      result.current.navigate('https://example.com/path');
      result.current.navigate('mailto:test@example.com', { replace: true });
      expect(history.navigateCalls).toEqual([
        { to: 'https://example.com/path', options: undefined },
        { to: 'mailto:test@example.com', options: { replace: true } },
      ]);

      expect(history.location).toEqual(before);
    } finally {
      warning.mockRestore();
    }
  });
});
