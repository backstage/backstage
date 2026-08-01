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

import { useEffect, type ComponentType } from 'react';
import { render, screen, act } from '@testing-library/react';
import {
  createMockAppHistory,
  type MockAppHistory,
} from '@backstage/frontend-test-utils';
import { AppRouteSwitch } from './AppRouteSwitch';
import { RouteTable } from './RouteTable';
import { usePageMount } from './PageMountContext';

function CatalogPage() {
  const mount = usePageMount();
  return <div data-testid="catalog-page">Catalog: {mount?.basePath}</div>;
}

function ScaffolderPage() {
  const mount = usePageMount();
  return <div data-testid="scaffolder-page">Scaffolder: {mount?.basePath}</div>;
}

function FallbackPage() {
  return <div data-testid="fallback-page">Not Found</div>;
}

describe('AppRouteSwitch', () => {
  // The switch only ever reads `location`, `location$` and `navigate` off the
  // app history, and the mock upholds the same emission and stable-reference
  // contract as the real one — so it stands in without pulling app wiring
  // into this package.
  let history: MockAppHistory;

  it('should render the matched page component', () => {
    history = createMockAppHistory({ initialLocation: '/catalog/entities' });

    const routeTable = new RouteTable(['/catalog', '/scaffolder']);
    const pages = new Map<string, ComponentType>([
      ['/catalog', CatalogPage],
      ['/scaffolder', ScaffolderPage],
    ]);

    render(
      <AppRouteSwitch
        history={history}
        routeTable={routeTable}
        pages={pages}
        fallback={<FallbackPage />}
      />,
    );

    expect(screen.getByTestId('catalog-page')).toHaveTextContent(
      'Catalog: /catalog',
    );
  });

  it('should switch to a different page on navigation', () => {
    history = createMockAppHistory({ initialLocation: '/catalog' });

    const routeTable = new RouteTable(['/catalog', '/scaffolder']);
    const pages = new Map<string, ComponentType>([
      ['/catalog', CatalogPage],
      ['/scaffolder', ScaffolderPage],
    ]);

    render(
      <AppRouteSwitch
        history={history}
        routeTable={routeTable}
        pages={pages}
        fallback={<FallbackPage />}
      />,
    );

    expect(screen.getByTestId('catalog-page')).toBeInTheDocument();

    act(() => {
      history.navigate('/scaffolder/templates');
    });

    expect(screen.getByTestId('scaffolder-page')).toBeInTheDocument();
    expect(screen.getByTestId('scaffolder-page')).toHaveTextContent(
      'Scaffolder: /scaffolder',
    );
  });

  it('should render fallback for unmatched paths', () => {
    history = createMockAppHistory({ initialLocation: '/unknown/path' });

    const routeTable = new RouteTable(['/catalog']);
    const pages = new Map<string, ComponentType>([['/catalog', CatalogPage]]);

    render(
      <AppRouteSwitch
        history={history}
        routeTable={routeTable}
        pages={pages}
        fallback={<FallbackPage />}
      />,
    );

    expect(screen.getByTestId('fallback-page')).toBeInTheDocument();
  });

  it('should provide a PageMount with correct basePath to the matched page', () => {
    history = createMockAppHistory({
      initialLocation: '/scaffolder/templates',
    });

    const routeTable = new RouteTable(['/catalog', '/scaffolder']);
    const pages = new Map<string, ComponentType>([
      ['/catalog', CatalogPage],
      ['/scaffolder', ScaffolderPage],
    ]);

    render(
      <AppRouteSwitch
        history={history}
        routeTable={routeTable}
        pages={pages}
        fallback={<FallbackPage />}
      />,
    );

    expect(screen.getByTestId('scaffolder-page')).toHaveTextContent(
      'Scaffolder: /scaffolder',
    );
  });

  it('should handle root path catch-all', () => {
    history = createMockAppHistory({ initialLocation: '/something' });

    function RootPage() {
      const mount = usePageMount();
      return <div data-testid="root-page">Root: {mount?.basePath}</div>;
    }

    const routeTable = new RouteTable(['/catalog', '/']);
    const pages = new Map<string, ComponentType>([
      ['/catalog', CatalogPage],
      ['/', RootPage],
    ]);

    render(
      <AppRouteSwitch
        history={history}
        routeTable={routeTable}
        pages={pages}
        fallback={<FallbackPage />}
      />,
    );

    expect(screen.getByTestId('root-page')).toHaveTextContent('Root: /');
  });

  it('should catch plugin errors with error boundary and render fallback', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    history = createMockAppHistory({ initialLocation: '/crashing' });

    function CrashingPage(): never {
      throw new Error('Plugin crashed!');
    }

    const routeTable = new RouteTable(['/crashing']);
    const pages = new Map<string, ComponentType>([['/crashing', CrashingPage]]);

    render(
      <AppRouteSwitch
        history={history}
        routeTable={routeTable}
        pages={pages}
        fallback={<FallbackPage />}
      />,
    );

    expect(screen.getByTestId('fallback-page')).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('/crashing'),
      expect.any(Error),
      expect.anything(),
    );
    errorSpy.mockRestore();
  });

  it('should recover from error boundary when navigating to a different plugin and back', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    history = createMockAppHistory({ initialLocation: '/crashing' });

    function CrashingPage(): never {
      throw new Error('Plugin crashed!');
    }

    const routeTable = new RouteTable(['/crashing', '/ok']);
    const pages = new Map<string, ComponentType>([
      ['/crashing', CrashingPage],
      ['/ok', CatalogPage],
    ]);

    render(
      <AppRouteSwitch
        history={history}
        routeTable={routeTable}
        pages={pages}
        fallback={<FallbackPage />}
      />,
    );

    // Plugin crashed — fallback shown
    expect(screen.getByTestId('fallback-page')).toBeInTheDocument();

    // Navigate to working plugin
    act(() => {
      history.navigate('/ok/entities');
    });
    expect(screen.getByTestId('catalog-page')).toBeInTheDocument();

    // Navigate back to crashing plugin — error boundary resets (key changes)
    // so the plugin gets another chance to render (and will crash again)
    act(() => {
      history.navigate('/crashing');
    });
    expect(screen.getByTestId('fallback-page')).toBeInTheDocument();
    errorSpy.mockRestore();
  });

  it('should create a fresh PageMount for parameterized routes on each match', () => {
    history = createMockAppHistory({
      initialLocation: '/catalog/default/component/wayback-archive/overview',
    });

    let mountCount = 0;

    function EntityPage() {
      const mount = usePageMount();
      useEffect(() => {
        mountCount += 1;
      }, []);
      return <div data-testid="entity-page">Entity: {mount?.basePath}</div>;
    }

    const pattern = '/catalog/:namespace/:kind/:name';
    const routeTable = new RouteTable(['/catalog', pattern]);
    const pages = new Map<string, ComponentType>([
      ['/catalog', CatalogPage],
      [pattern, EntityPage],
    ]);

    render(
      <AppRouteSwitch
        history={history}
        routeTable={routeTable}
        pages={pages}
        fallback={<FallbackPage />}
      />,
    );

    expect(screen.getByTestId('entity-page')).toHaveTextContent(
      'Entity: /catalog/default/component/wayback-archive',
    );
    expect(mountCount).toBe(1);

    // Navigating within the same entity keeps the same concrete mount
    act(() => {
      history.navigate('/catalog/default/component/wayback-archive/docs');
    });

    expect(mountCount).toBe(1);

    act(() => {
      history.navigate('/catalog/default/component/entity-b/docs');
    });

    // Same registered pattern — error boundary key is pattern-stable; no remount
    expect(mountCount).toBe(1);
    expect(screen.getByTestId('entity-page')).toHaveTextContent(
      'Entity: /catalog/default/component/entity-b',
    );
  });

  it('should not inherit a crash from a previous mount of the same route pattern', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    history = createMockAppHistory({
      initialLocation: '/catalog/default/component/broken',
    });

    function EntityPage() {
      const mount = usePageMount();
      if (mount?.basePath.endsWith('/broken')) {
        throw new Error('Entity page crashed!');
      }
      return <div data-testid="entity-page">Entity: {mount?.basePath}</div>;
    }

    const pattern = '/catalog/:namespace/:kind/:name';
    const routeTable = new RouteTable([pattern]);
    const pages = new Map<string, ComponentType>([[pattern, EntityPage]]);

    render(
      <AppRouteSwitch
        history={history}
        routeTable={routeTable}
        pages={pages}
        fallback={<FallbackPage />}
      />,
    );

    expect(screen.getByTestId('fallback-page')).toBeInTheDocument();

    // A healthy entity under the same pattern is a separate mount and must
    // render, rather than inheriting the crashed boundary state.
    act(() => {
      history.navigate('/catalog/default/component/fine');
    });

    expect(screen.getByTestId('entity-page')).toHaveTextContent(
      'Entity: /catalog/default/component/fine',
    );

    // Returning to the broken entity crashes again rather than staying healthy
    act(() => {
      history.navigate('/catalog/default/component/broken');
    });

    expect(screen.getByTestId('fallback-page')).toBeInTheDocument();
    errorSpy.mockRestore();
  });

  it('should redirect via history.navigate before matching pages', () => {
    history = createMockAppHistory({ initialLocation: '/old-catalog' });

    const routeTable = new RouteTable(['/catalog']);
    const pages = new Map<string, ComponentType>([['/catalog', CatalogPage]]);
    const navigateSpy = jest.spyOn(history, 'navigate');

    render(
      <AppRouteSwitch
        history={history}
        routeTable={routeTable}
        pages={pages}
        redirects={[{ from: '/old-catalog', to: '/catalog' }]}
        fallback={<FallbackPage />}
      />,
    );

    expect(navigateSpy).toHaveBeenCalledWith('/catalog', { replace: true });
    expect(screen.getByTestId('catalog-page')).toHaveTextContent(
      'Catalog: /catalog',
    );
    navigateSpy.mockRestore();
  });

  it('should substitute redirect params including splat remainder', () => {
    history = createMockAppHistory({
      initialLocation: '/d/default/component/my-entity',
    });

    const routeTable = new RouteTable(['/docs']);
    const pages = new Map<string, ComponentType>([['/docs', CatalogPage]]);
    const navigateSpy = jest.spyOn(history, 'navigate');

    render(
      <AppRouteSwitch
        history={history}
        routeTable={routeTable}
        pages={pages}
        redirects={[{ from: '/d', to: '/docs/*' }]}
        fallback={<FallbackPage />}
      />,
    );

    expect(navigateSpy).toHaveBeenCalledWith(
      '/docs/default/component/my-entity',
      { replace: true },
    );
    navigateSpy.mockRestore();
  });

  it('should only redirect root when from is /', () => {
    history = createMockAppHistory({ initialLocation: '/catalog' });

    const routeTable = new RouteTable(['/catalog', '/home']);
    const pages = new Map<string, ComponentType>([
      ['/catalog', CatalogPage],
      ['/home', ScaffolderPage],
    ]);
    const navigateSpy = jest.spyOn(history, 'navigate');

    render(
      <AppRouteSwitch
        history={history}
        routeTable={routeTable}
        pages={pages}
        redirects={[{ from: '/', to: '/home' }]}
        fallback={<FallbackPage />}
      />,
    );

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
    navigateSpy.mockRestore();
  });
});
