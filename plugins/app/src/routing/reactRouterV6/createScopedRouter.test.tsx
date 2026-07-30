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
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import { Link, useParams, useOutlet, useNavigate } from 'react-router-dom';
import { createScopedRouter } from './createScopedRouter';

describe('createScopedRouter', () => {
  it('should render children inside a React Router context', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog/entity/foo',
    });
    const { Router } = createScopedRouter(appHistory, '/catalog');

    render(
      <Router>
        <div data-testid="child">Hello</div>
      </Router>,
    );

    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });

  it('should read the initial location from app history as app-absolute path', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog/entity/bar?q=test#section',
    });
    const { Router, useLocation } = createScopedRouter(appHistory, '/catalog');

    const renderedPathnames: string[] = [];

    function LocationDisplay() {
      const location = useLocation();
      renderedPathnames.push(location.pathname);
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

    expect(renderedPathnames[0]).toBe('/catalog/entity/bar');
    expect(screen.getByTestId('pathname')).toHaveTextContent(
      '/catalog/entity/bar',
    );
    expect(screen.getByTestId('search')).toHaveTextContent('?q=test');
    expect(screen.getByTestId('hash')).toHaveTextContent('#section');
  });

  it('should delegate navigate calls to app history with app-absolute paths', async () => {
    const user = userEvent.setup();
    const appHistory = createMockAppHistory({ initialLocation: '/catalog' });
    const { Router } = createScopedRouter(appHistory, '/catalog');

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

    expect(appHistory.navigateCalls).toEqual([
      {
        to: '/catalog/entity/new',
        options: { replace: false, state: undefined },
      },
    ]);
  });

  it('should never call window.history.pushState or replaceState', async () => {
    const user = userEvent.setup();
    const pushSpy = jest.spyOn(window.history, 'pushState');
    const replaceSpy = jest.spyOn(window.history, 'replaceState');
    const appHistory = createMockAppHistory({ initialLocation: '/catalog' });
    const { Router } = createScopedRouter(appHistory, '/catalog');

    function NavButton() {
      const navigate = useNavigate();
      return (
        <button type="button" onClick={() => navigate('./next')}>
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
    pushSpy.mockRestore();
    replaceSpy.mockRestore();
  });

  it('should update when app history emits a new location', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog/entity/foo',
    });
    const { Router, useLocation } = createScopedRouter(appHistory, '/catalog');

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

  it('should stop receiving updates after dispose()', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog/entity/foo',
    });
    const { Router, useLocation, dispose } = createScopedRouter(
      appHistory,
      '/catalog',
    );

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

    dispose();

    act(() => {
      appHistory.navigate('/catalog/entity/after-dispose');
    });

    expect(screen.getByTestId('pathname')).toHaveTextContent(
      '/catalog/entity/foo',
    );
  });

  it('should populate useParams from the route pattern splat match', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog/default/component/my-entity/overview',
    });
    const { Router } = createScopedRouter(
      appHistory,
      '/catalog/default/component/my-entity',
      { routePattern: '/catalog/:namespace/:kind/:name' },
    );

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

  it('should provide empty RouteContext defaults when no route pattern is set', () => {
    const appHistory = createMockAppHistory({ initialLocation: '/catalog' });
    const { Router } = createScopedRouter(appHistory, '/catalog');

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

    expect(screen.getByTestId('params')).toHaveTextContent('{}');
    expect(screen.getByTestId('outlet')).toHaveTextContent('null');
  });

  it('should prefix Link hrefs with the app history basename', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog',
      basename: '/backstage',
    });
    const { Router } = createScopedRouter(appHistory, '/catalog', {
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

  it('should use the provided go callback instead of window.history.go', () => {
    const go = jest.fn();
    const historyGoSpy = jest.spyOn(window.history, 'go');
    const appHistory = createMockAppHistory({ initialLocation: '/catalog' });
    const { Router } = createScopedRouter(appHistory, '/catalog', { go });

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

    screen.getByRole('button', { name: 'Back' }).click();
    expect(go).toHaveBeenCalledWith(-1);
    expect(historyGoSpy).not.toHaveBeenCalled();
    historyGoSpy.mockRestore();
  });

  it('should warn and no-op navigator.go when no go option is provided', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const historyGoSpy = jest.spyOn(window.history, 'go');
    const appHistory = createMockAppHistory({ initialLocation: '/catalog' });
    const { Router } = createScopedRouter(appHistory, '/catalog');

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

    screen.getByRole('button', { name: 'Back' }).click();
    expect(historyGoSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    historyGoSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('should return useLocation, useNavigate, useParams, useSearchParams', () => {
    const appHistory = createMockAppHistory({ initialLocation: '/catalog' });
    const result = createScopedRouter(appHistory, '/catalog');

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
