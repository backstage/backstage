/*
 * Copyright 2025 The Backstage Authors
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

import { screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { PageBlueprint } from '@backstage/frontend-plugin-api';
import { Link, useLocation, useParams } from 'react-router-dom';

describe('AppRoutes', () => {
  it('should render the first route at root path', async () => {
    const homePage = PageBlueprint.make({
      name: 'home',
      params: {
        path: '/',
        loader: async () => <div data-testid="home-page">Home Page</div>,
      },
    });

    renderTestApp({
      extensions: [homePage],
      initialRouteEntries: ['/'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
  });

  it('should render a route at non-root path', async () => {
    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => <div data-testid="catalog-page">Catalog Page</div>,
      },
    });

    renderTestApp({
      extensions: [catalogPage],
      initialRouteEntries: ['/catalog'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
      expect(screen.getByText('Catalog Page')).toBeInTheDocument();
    });
  });

  it('should handle nested paths under a route (splat path behavior)', async () => {
    const NestedPathDisplay = () => {
      const location = useLocation();
      const params = useParams();
      return (
        <div data-testid="entity-page">
          <div data-testid="pathname">{location.pathname}</div>
          <div data-testid="splat-params">{params['*']}</div>
          Entity Details
        </div>
      );
    };

    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => <NestedPathDisplay />,
      },
    });

    renderTestApp({
      extensions: [catalogPage],
      initialRouteEntries: ['/catalog/default/component/my-entity'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('entity-page')).toBeInTheDocument();
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/catalog/default/component/my-entity',
      );
      expect(screen.getByTestId('splat-params')).toHaveTextContent(
        'default/component/my-entity',
      );
    });
  });

  it('should support relative links within routes', async () => {
    const CatalogWithLinks = () => {
      return (
        <div data-testid="catalog-page">
          <div>Catalog Page</div>
          <Link to="./create" data-testid="create-link">
            Create Entity
          </Link>
          <Link to="../settings" data-testid="settings-link">
            Go to Settings
          </Link>
        </div>
      );
    };

    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => <CatalogWithLinks />,
      },
    });

    renderTestApp({
      extensions: [catalogPage],
      initialRouteEntries: ['/catalog'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
      expect(screen.getByTestId('create-link')).toHaveAttribute(
        'href',
        '/catalog/create',
      );
      expect(screen.getByTestId('settings-link')).toHaveAttribute(
        'href',
        '/settings',
      );
    });
  });

  it('should handle multiple routes correctly', async () => {
    const homePage = PageBlueprint.make({
      name: 'home',
      params: {
        path: '/',
        loader: async () => <div data-testid="home-page">Home Page</div>,
      },
    });

    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => <div data-testid="catalog-page">Catalog Page</div>,
      },
    });

    const settingsPage = PageBlueprint.make({
      name: 'settings',
      params: {
        path: '/settings',
        loader: async () => (
          <div data-testid="settings-page">Settings Page</div>
        ),
      },
    });

    const { unmount } = renderTestApp({
      extensions: [homePage, catalogPage, settingsPage],
      initialRouteEntries: ['/'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    unmount();

    const { unmount: unmount2 } = renderTestApp({
      extensions: [homePage, catalogPage, settingsPage],
      initialRouteEntries: ['/catalog'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
    });

    unmount2();

    renderTestApp({
      extensions: [homePage, catalogPage, settingsPage],
      initialRouteEntries: ['/settings'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
    });
  });

  it('should handle routes with trailing slashes', async () => {
    const docsPage = PageBlueprint.make({
      name: 'docs',
      params: {
        path: '/docs/',
        loader: async () => <div data-testid="docs-page">Docs Page</div>,
      },
    });

    renderTestApp({
      extensions: [docsPage],
      initialRouteEntries: ['/docs'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('docs-page')).toBeInTheDocument();
    });
  });

  it('should show 404 for unknown paths when root route exists', async () => {
    const homePage = PageBlueprint.make({
      name: 'home',
      params: {
        path: '/',
        loader: async () => <div data-testid="home-page">Home Page</div>,
      },
    });

    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => <div data-testid="catalog-page">Catalog Page</div>,
      },
    });

    renderTestApp({
      extensions: [homePage, catalogPage],
      initialRouteEntries: ['/unknown'],
    });

    await waitFor(() => {
      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('catalog-page')).not.toBeInTheDocument();
    });
  });
});
