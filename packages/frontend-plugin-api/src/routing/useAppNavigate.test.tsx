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
import { Observable, Subscription } from '@backstage/types';
import {
  createMemoryRouter,
  MemoryRouter,
  RouterProvider,
  useLocation,
} from 'react-router-dom';
import { useAppNavigate, useOptionalAppNavigate } from './useAppNavigate';
import { appHistoryApiRef, type AppHistoryApi } from './AppHistoryApi';
import type { AppLocation } from './AppLocation';
import {
  TestApiProvider,
  createMockAppHistory,
  mockApis,
} from '@backstage/frontend-test-utils';
import { useAppNode } from '../components/AppNodeProvider';
import type { AppNode } from '../apis/definitions/AppTreeApi';
import { useAppHref } from './useAppHref';

jest.mock('../components/AppNodeProvider', () => ({
  ...jest.requireActual('../components/AppNodeProvider'),
  useAppNode: jest.fn(),
}));

/**
 * A hand-rolled `AppHistoryApi` matching the real implementation's contract:
 * `location$` emits synchronously on subscribe and `location` is a stable
 * reference that only changes when the location changes.
 */
function createFakeAppHistory(
  initial: AppLocation,
  navigate: AppHistoryApi['navigate'] = jest.fn(),
): {
  appHistory: AppHistoryApi;
  emit: (location: AppLocation) => void;
} {
  const subscribers = new Set<(value: AppLocation) => void>();
  let current = initial;

  const location$: Observable<AppLocation> = {
    [Symbol.observable]() {
      return this;
    },
    subscribe(observerOrNext): Subscription {
      const next =
        typeof observerOrNext === 'function'
          ? observerOrNext
          : observerOrNext?.next?.bind(observerOrNext);
      if (next) {
        subscribers.add(next);
        next(current);
      }
      let closed = false;
      return {
        unsubscribe() {
          if (next) {
            subscribers.delete(next);
          }
          closed = true;
        },
        get closed() {
          return closed;
        },
      };
    },
  };

  return {
    appHistory: {
      get location() {
        return current;
      },
      location$,
      navigate,
      createHref: (to: string) => to,
    },
    emit(location) {
      current = location;
      for (const subscriber of subscribers) {
        subscriber(location);
      }
    },
  };
}

describe('useOptionalAppNavigate', () => {
  it('returns undefined when no app history is registered', () => {
    const { result } = renderHook(() => useOptionalAppNavigate(), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[]}>{children}</TestApiProvider>
      ),
    });

    expect(result.current).toBeUndefined();
  });

  it('returns a navigate callback that delegates to the app history', () => {
    const navigate = jest.fn();
    const { appHistory } = createFakeAppHistory(
      { pathname: '/', search: '', hash: '', state: undefined },
      navigate,
    );

    const { result } = renderHook(() => useOptionalAppNavigate(), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
          {children}
        </TestApiProvider>
      ),
    });

    expect(result.current).toEqual(expect.any(Function));

    act(() => {
      result.current!('/search', { replace: true });
    });

    expect(navigate).toHaveBeenCalledWith('/search', { replace: true });

    act(() => {
      result.current!('/catalog/default/component/foo', {
        replace: true,
        state: { from: 'test' },
      });
    });

    expect(navigate).toHaveBeenCalledWith('/catalog/default/component/foo', {
      replace: true,
      state: { from: 'test' },
    });

    act(() => {
      result.current!(-1);
    });

    expect(navigate).toHaveBeenCalledWith(-1);
  });
});

describe('useAppNavigate', () => {
  it('uses app-absolute paths and the latest location for query and hash targets', () => {
    const node = {} as AppNode;
    const appHistory = createMockAppHistory({
      basename: '/app',
      initialLocation: '/app/tools/admin',
    });
    const routes = mockApis.routeResolution({
      resolvePath: {
        matches: [
          { node, basePath: '/tools' },
          { node, basePath: '/tools/admin' },
        ],
      },
    });
    jest.mocked(useAppNode).mockReturnValue(node);
    try {
      const { result, rerender } = renderHook(
        () => ({
          navigate: useAppNavigate(),
          href: useAppHref('/tools/admin/details'),
        }),
        {
          wrapper: ({ children }) => (
            <TestApiProvider apis={[[appHistoryApiRef, appHistory], routes]}>
              {children}
            </TestApiProvider>
          ),
        },
      );
      const navigate = result.current.navigate;
      expect(result.current.href).toBe('/app/tools/admin/details');
      act(() =>
        navigate('/tools/admin/details', {
          replace: true,
          state: { from: 'test' },
        }),
      );
      expect(appHistory.location).toMatchObject({
        pathname: '/tools/admin/details',
        state: { from: 'test' },
      });

      // Retained callbacks keep their original node, but read the latest location.
      jest.mocked(useAppNode).mockReturnValue(undefined);
      rerender();
      act(() => appHistory.navigate('/tools/admin/other'));
      act(() => navigate('?view=docs#intro'));
      expect(appHistory.location).toMatchObject({
        pathname: '/tools/admin/other',
        search: '?view=docs',
        hash: '#intro',
      });
      act(() => navigate('#latest'));
      expect(appHistory.location.hash).toBe('#latest');
      expect(() => navigate('../create')).toThrow('App routing requires');
      act(() => navigate('/tools/create'));
      expect(appHistory.location.pathname).toBe('/tools/create');
      act(() => navigate('/catalog'));
      expect(appHistory.location.pathname).toBe('/catalog');
      act(() => navigate(-1));
      expect(appHistory.location.pathname).toBe('/tools/create');
      act(() => navigate('https://example.com', { replace: true }));
      expect(appHistory.navigateCalls.at(-1)).toEqual({
        to: 'https://example.com',
        options: { replace: true },
      });
      expect(appHistory.location.pathname).toBe('/tools/create');
    } finally {
      jest.mocked(useAppNode).mockReset();
    }
  });

  it('rejects relative paths without an app node too', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/tools/admin',
    });
    const { result } = renderHook(() => useAppNavigate(), {
      wrapper: ({ children }) => (
        <TestApiProvider
          apis={[[appHistoryApiRef, appHistory], mockApis.routeResolution()]}
        >
          {children}
        </TestApiProvider>
      ),
    });
    expect(() => result.current('details')).toThrow('App routing requires');
    act(() => result.current('/details'));
    expect(appHistory.location.pathname).toBe('/details');
  });

  it('uses the app history when registered', () => {
    const navigate = jest.fn();
    const { appHistory } = createFakeAppHistory(
      { pathname: '/', search: '', hash: '', state: undefined },
      navigate,
    );

    const { result } = renderHook(() => useAppNavigate(), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
          {children}
        </TestApiProvider>
      ),
    });

    act(() => {
      result.current('/catalog', { replace: true });
    });

    expect(navigate).toHaveBeenCalledWith('/catalog', { replace: true });

    act(() => {
      result.current(-1);
    });

    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it('falls back to React Router navigate when no app history is registered', () => {
    let locationPathname = '/start';
    const { result } = renderHook(
      () => {
        const navigate = useAppNavigate();
        const location = useLocation();
        locationPathname = location.pathname;
        return navigate;
      },
      {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <MemoryRouter initialEntries={['/start']}>
            <TestApiProvider apis={[]}>{children}</TestApiProvider>
          </MemoryRouter>
        ),
      },
    );

    act(() => {
      result.current('/search');
    });

    expect(locationPathname).toBe('/search');

    act(() => {
      result.current(-1);
    });

    expect(locationPathname).toBe('/start');
  });

  it('lets a data router own basename handling', () => {
    let navigate: ReturnType<typeof useAppNavigate> | undefined;
    const router = createMemoryRouter(
      [
        {
          path: '*',
          element: (
            <TestApiProvider apis={[]}>
              <Probe />
            </TestApiProvider>
          ),
        },
      ],
      {
        basename: '/backstage',
        initialEntries: ['/backstage/start'],
      },
    );

    function Probe() {
      navigate = useAppNavigate();
      return null;
    }

    renderHook(() => undefined, {
      wrapper: () => <RouterProvider router={router} />,
    });

    act(() => {
      navigate!('/search');
    });

    expect(router.state.location.pathname).toBe('/backstage/search');
  });
});
