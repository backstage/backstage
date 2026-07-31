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
import { AppRouteSwitch, RouteTable } from '@backstage/frontend-plugin-api';
import { usePageMount } from '@internal/frontend';
import { createAppHistory } from './AppHistory';
import type { AppHistory } from './AppHistory';

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
  let history: AppHistory;

  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    history = createAppHistory();
  });

  afterEach(() => {
    history.dispose();
  });

  it('should render the matched page component', () => {
    window.history.replaceState(null, '', '/catalog/entities');

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
    window.history.replaceState(null, '', '/catalog');

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
    window.history.replaceState(null, '', '/unknown/path');

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
    window.history.replaceState(null, '', '/scaffolder/templates');

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
    window.history.replaceState(null, '', '/something');

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
    window.history.replaceState(null, '', '/crashing');

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
    window.history.replaceState(null, '', '/crashing');

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
    window.history.replaceState(
      null,
      '',
      '/catalog/default/component/wayback-archive/overview',
    );

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

    act(() => {
      history.navigate('/catalog/default/component/entity-b/docs');
    });

    // Same registered pattern — error boundary key is pattern-stable; no remount
    expect(mountCount).toBe(1);
    expect(screen.getByTestId('entity-page')).toHaveTextContent(
      'Entity: /catalog/default/component/entity-b',
    );
  });

  it('should redirect via history.navigate before matching pages', () => {
    window.history.replaceState(null, '', '/old-catalog');

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
    window.history.replaceState(null, '', '/d/default/component/my-entity');

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
    window.history.replaceState(null, '', '/catalog');

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
