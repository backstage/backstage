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
import { TestApiProvider } from '@backstage/test-utils';
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
