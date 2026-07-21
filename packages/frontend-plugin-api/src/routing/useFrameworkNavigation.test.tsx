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
import { MemoryRouter, useLocation } from 'react-router-dom';
import {
  useAppNavigate,
  useFrameworkLocation,
  useFrameworkNavigate,
  useOptionalFrameworkNavigate,
} from './useFrameworkNavigation';
import { navigationControllerApiRef } from './NavigationControllerApi';
import type { FrameworkLocation } from './RoutingContract';

function createLocationObservable(initial: FrameworkLocation): {
  location$: Observable<FrameworkLocation>;
  emit: (location: FrameworkLocation) => void;
} {
  const subscribers = new Set<(value: FrameworkLocation) => void>();
  let current = initial;

  return {
    location$: {
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
    },
    emit(location) {
      current = location;
      for (const subscriber of subscribers) {
        subscriber(location);
      }
    },
  };
}

describe('useFrameworkNavigate', () => {
  it('delegates to the navigation controller with options', () => {
    const navigate = jest.fn();
    const { location$ } = createLocationObservable({
      pathname: '/',
      search: '',
      hash: '',
      state: undefined,
    });

    const { result } = renderHook(() => useFrameworkNavigate(), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider
          apis={[
            [
              navigationControllerApiRef,
              {
                navigate,
                go: jest.fn(),
                location$,
                createContract: jest.fn(),
              },
            ],
          ]}
        >
          {children}
        </TestApiProvider>
      ),
    });

    act(() => {
      result.current('/catalog/default/component/foo', {
        replace: true,
        state: { from: 'test' },
      });
    });

    expect(navigate).toHaveBeenCalledWith('/catalog/default/component/foo', {
      replace: true,
      state: { from: 'test' },
    });
  });
});

describe('useOptionalFrameworkNavigate', () => {
  it('returns undefined when no navigation controller is registered', () => {
    const { result } = renderHook(() => useOptionalFrameworkNavigate(), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[]}>{children}</TestApiProvider>
      ),
    });

    expect(result.current).toBeUndefined();
  });

  it('returns a navigate callback when a navigation controller is present', () => {
    const navigate = jest.fn();
    const { location$ } = createLocationObservable({
      pathname: '/',
      search: '',
      hash: '',
      state: undefined,
    });

    const { result } = renderHook(() => useOptionalFrameworkNavigate(), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider
          apis={[
            [
              navigationControllerApiRef,
              {
                navigate,
                go: jest.fn(),
                location$,
                createContract: jest.fn(),
              },
            ],
          ]}
        >
          {children}
        </TestApiProvider>
      ),
    });

    expect(result.current).toEqual(expect.any(Function));

    act(() => {
      result.current!('/search', { replace: true });
    });

    expect(navigate).toHaveBeenCalledWith('/search', { replace: true });
  });
});

describe('useAppNavigate', () => {
  it('uses the framework navigation controller when registered', () => {
    const navigate = jest.fn();
    const { location$ } = createLocationObservable({
      pathname: '/',
      search: '',
      hash: '',
      state: undefined,
    });

    const { result } = renderHook(() => useAppNavigate(), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <MemoryRouter>
          <TestApiProvider
            apis={[
              [
                navigationControllerApiRef,
                {
                  navigate,
                  go: jest.fn(),
                  location$,
                  createContract: jest.fn(),
                },
              ],
            ]}
          >
            {children}
          </TestApiProvider>
        </MemoryRouter>
      ),
    });

    act(() => {
      result.current('/catalog', { replace: true });
    });

    expect(navigate).toHaveBeenCalledWith('/catalog', { replace: true });
  });

  it('falls back to React Router navigate when no controller is registered', () => {
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
  });
});

describe('useFrameworkLocation', () => {
  it('returns the current controller location and updates on emit', () => {
    const { location$, emit } = createLocationObservable({
      pathname: '/catalog',
      search: '?q=1',
      hash: '',
      state: undefined,
    });

    const { result } = renderHook(() => useFrameworkLocation(), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider
          apis={[
            [
              navigationControllerApiRef,
              {
                navigate: jest.fn(),
                go: jest.fn(),
                location$,
                createContract: jest.fn(),
              },
            ],
          ]}
        >
          {children}
        </TestApiProvider>
      ),
    });

    expect(result.current).toEqual({
      pathname: '/catalog',
      search: '?q=1',
      hash: '',
      state: undefined,
    });

    act(() => {
      emit({
        pathname: '/create',
        search: '',
        hash: '#top',
        state: { x: 1 },
      });
    });

    expect(result.current).toEqual({
      pathname: '/create',
      search: '',
      hash: '#top',
      state: { x: 1 },
    });
  });
});
