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

import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import type {
  AppHistoryApi,
  FrameworkLocation,
  FrameworkNavigateOptions,
} from '@backstage/frontend-plugin-api';
import type { Observable } from '@backstage/types';
import { Link, useParams, useOutlet, useNavigate } from 'react-router';
import { createScopedRouter } from './createScopedRouter';

/**
 * Minimal hand-rolled `AppHistoryApi` for adapter-level tests, so this
 * package's unit tests don't depend on shared test-utils mocks.
 */
function createMockAppHistory(initialHref = '/'): {
  appHistory: AppHistoryApi;
  navigateCalls: Array<{ to: string; options?: FrameworkNavigateOptions }>;
} {
  const navigateCalls: Array<{
    to: string;
    options?: FrameworkNavigateOptions;
  }> = [];
  const initialUrl = new URL(initialHref, 'http://localhost');
  let current: FrameworkLocation = {
    pathname: initialUrl.pathname,
    search: initialUrl.search,
    hash: initialUrl.hash,
    state: undefined,
  };
  const listeners = new Set<(loc: FrameworkLocation) => void>();

  const location$: Observable<FrameworkLocation> = {
    subscribe(observerOrOnNext) {
      const onNext =
        typeof observerOrOnNext === 'function'
          ? observerOrOnNext
          : observerOrOnNext?.next?.bind(observerOrOnNext);
      const handler = (loc: FrameworkLocation) => onNext?.(loc);
      listeners.add(handler);
      handler(current);
      return {
        unsubscribe: () => listeners.delete(handler),
        closed: false,
      };
    },
    [Symbol.observable]() {
      return this;
    },
  };

  const appHistory: AppHistoryApi = {
    location$,
    navigate(to, options) {
      navigateCalls.push({ to, options });
      const url = new URL(to, 'http://localhost');
      current = {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        state: options?.state,
      };
      for (const listener of [...listeners]) {
        listener(current);
      }
    },
    createHref(to) {
      return `/backstage${to}`;
    },
  };

  return { appHistory, navigateCalls };
}

describe('createScopedRouter', () => {
  it('should render children inside a React Router v7 context', () => {
    const { appHistory } = createMockAppHistory('/catalog/entity/foo');
    const { Router } = createScopedRouter(appHistory, {
      basePathRef: { current: '/catalog' },
      routePattern: '/catalog',
    });

    render(
      <Router>
        <div data-testid="child">Hello</div>
      </Router>,
    );

    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });

  it('should expose the app-absolute location from AppHistoryApi as-is', () => {
    const { appHistory } = createMockAppHistory(
      '/catalog/entity/bar?q=test#section',
    );
    const { Router, useLocation } = createScopedRouter(appHistory, {
      basePathRef: { current: '/catalog' },
      routePattern: '/catalog',
    });

    function LocationDisplay() {
      const location = useLocation();
      return (
        <div>
          <div data-testid="pathname">{location.pathname}</div>
          <div data-testid="search">{location.search}</div>
          <div data-testid="hash">{location.hash}</div>
        </div>
      );
    }

    render(
      <Router>
        <LocationDisplay />
      </Router>,
    );

    expect(screen.getByTestId('pathname')).toHaveTextContent(
      '/catalog/entity/bar',
    );
    expect(screen.getByTestId('search')).toHaveTextContent('?q=test');
    expect(screen.getByTestId('hash')).toHaveTextContent('#section');
  });

  it('should delegate navigate calls to AppHistoryApi with an app-absolute path', async () => {
    const user = userEvent.setup();
    const { appHistory, navigateCalls } = createMockAppHistory('/catalog');
    const { Router } = createScopedRouter(appHistory, {
      basePathRef: { current: '/catalog' },
      routePattern: '/catalog',
    });

    function NavButton() {
      const navigate = useNavigate();
      return (
        <button type="button" onClick={() => navigate('/catalog/entity/new')}>
          Go
        </button>
      );
    }

    render(
      <Router>
        <NavButton />
      </Router>,
    );

    await user.click(screen.getByRole('button', { name: 'Go' }));

    expect(navigateCalls).toEqual([
      {
        to: '/catalog/entity/new',
        options: { replace: false, state: undefined },
      },
    ]);
  });

  it('should never call window.history.pushState, replaceState, or go', async () => {
    const user = userEvent.setup();
    const pushSpy = jest.spyOn(window.history, 'pushState');
    const replaceSpy = jest.spyOn(window.history, 'replaceState');
    const goSpy = jest.spyOn(window.history, 'go');
    const { appHistory } = createMockAppHistory('/catalog');
    const { Router } = createScopedRouter(appHistory, {
      basePathRef: { current: '/catalog' },
      routePattern: '/catalog',
    });

    function NavButton() {
      const navigate = useNavigate();
      return (
        <button
          type="button"
          onClick={() => {
            navigate('./next');
            navigate(-1);
          }}
        >
          Go
        </button>
      );
    }

    render(
      <Router>
        <NavButton />
      </Router>,
    );

    await user.click(screen.getByRole('button', { name: 'Go' }));

    expect(pushSpy).not.toHaveBeenCalled();
    expect(replaceSpy).not.toHaveBeenCalled();
    expect(goSpy).not.toHaveBeenCalled();
    pushSpy.mockRestore();
    replaceSpy.mockRestore();
    goSpy.mockRestore();
  });

  it('should update when AppHistoryApi emits a new location', () => {
    const { appHistory } = createMockAppHistory('/catalog/entity/foo');
    const { Router, useLocation } = createScopedRouter(appHistory, {
      basePathRef: { current: '/catalog' },
      routePattern: '/catalog',
    });

    function LocationDisplay() {
      const location = useLocation();
      return <div data-testid="pathname">{location.pathname}</div>;
    }

    render(
      <Router>
        <LocationDisplay />
      </Router>,
    );

    expect(screen.getByTestId('pathname')).toHaveTextContent(
      '/catalog/entity/foo',
    );

    act(() => {
      appHistory.navigate('/catalog/entity/bar');
    });

    expect(screen.getByTestId('pathname')).toHaveTextContent(
      '/catalog/entity/bar',
    );
  });

  it('should populate useParams from the route pattern match', () => {
    const { appHistory } = createMockAppHistory(
      '/catalog/default/component/my-entity/overview',
    );
    const { Router } = createScopedRouter(appHistory, {
      basePathRef: { current: '/catalog/default/component/my-entity' },
      routePattern: '/catalog/:namespace/:kind/:name',
    });

    function ParamsDisplay() {
      const params = useParams();
      return (
        <div>
          <span data-testid="namespace">{params.namespace}</span>
          <span data-testid="kind">{params.kind}</span>
          <span data-testid="name">{params.name}</span>
          <span data-testid="splat">{params['*']}</span>
        </div>
      );
    }

    render(
      <Router>
        <ParamsDisplay />
      </Router>,
    );

    expect(screen.getByTestId('namespace')).toHaveTextContent('default');
    expect(screen.getByTestId('kind')).toHaveTextContent('component');
    expect(screen.getByTestId('name')).toHaveTextContent('my-entity');
    expect(screen.getByTestId('splat')).toHaveTextContent('overview');
  });

  it('should provide an empty outlet at the page root (no nested routes declared here)', () => {
    const { appHistory } = createMockAppHistory('/catalog');
    const { Router } = createScopedRouter(appHistory, {
      basePathRef: { current: '/catalog' },
      routePattern: '/catalog',
    });

    function RouteContextInspector() {
      const params = useParams();
      const outlet = useOutlet();
      return (
        <div>
          <span data-testid="params">{JSON.stringify(params)}</span>
          <span data-testid="outlet">
            {outlet === null ? 'null' : 'present'}
          </span>
        </div>
      );
    }

    render(
      <Router>
        <RouteContextInspector />
      </Router>,
    );

    // The page root matches its own splat pattern with an empty tail.
    expect(screen.getByTestId('params')).toHaveTextContent('{"*":""}');
    expect(screen.getByTestId('outlet')).toHaveTextContent('null');
  });

  it('should delegate createHref to AppHistoryApi.createHref (which applies the app basename)', () => {
    const { appHistory } = createMockAppHistory('/catalog');
    const { Router } = createScopedRouter(appHistory, {
      basePathRef: { current: '/catalog' },
      routePattern: '/catalog',
    });

    render(
      <Router>
        <Link to="./create" data-testid="create-link">
          Create
        </Link>
      </Router>,
    );

    expect(screen.getByTestId('create-link')).toHaveAttribute(
      'href',
      '/backstage/catalog/create',
    );
  });

  it('should warn and no-op on navigator.go instead of touching window.history', async () => {
    const user = userEvent.setup();
    const historyGoSpy = jest.spyOn(window.history, 'go');
    const consoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const { appHistory } = createMockAppHistory('/catalog');
    const { Router } = createScopedRouter(appHistory, {
      basePathRef: { current: '/catalog' },
      routePattern: '/catalog',
    });

    function GoButton() {
      const navigate = useNavigate();
      return (
        <button type="button" onClick={() => navigate(-1)}>
          Back
        </button>
      );
    }

    render(
      <Router>
        <GoButton />
      </Router>,
    );

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(historyGoSpy).not.toHaveBeenCalled();
    expect(consoleWarn).toHaveBeenCalled();
    historyGoSpy.mockRestore();
    consoleWarn.mockRestore();
  });

  it('should return useLocation, useNavigate, useParams, useSearchParams', () => {
    const { appHistory } = createMockAppHistory('/catalog');
    const result = createScopedRouter(appHistory, {
      basePathRef: { current: '/catalog' },
      routePattern: '/catalog',
    });

    expect(result).toHaveProperty('Router');
    expect(result).toHaveProperty('useLocation');
    expect(result).toHaveProperty('useNavigate');
    expect(result).toHaveProperty('useParams');
    expect(result).toHaveProperty('useSearchParams');

    expect(typeof result.Router).toBe('function');
    expect(typeof result.useLocation).toBe('function');
    expect(typeof result.useNavigate).toBe('function');
    expect(typeof result.useParams).toBe('function');
    expect(typeof result.useSearchParams).toBe('function');
  });
});
