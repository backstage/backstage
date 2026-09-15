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

import { act, screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  PageBlueprint,
  SubPageBlueprint,
  createFrontendPlugin,
  createExtension,
  createExtensionInput,
  coreExtensionData,
  ExtensionBoundary,
  createRouteRef,
  useRouteRef,
  useRouteRefParams,
  useHref,
} from '@backstage/frontend-plugin-api';
import { usePageMount } from '@internal/frontend';
import { ReactRouterV6PageRouter } from '@backstage/plugin-app-react-router-v6';
import { Link, useLocation, useParams } from 'react-router-dom';

// The app retains a shared root v6 context. Pages below that probe their own
// React Router match declare the v6 adapter in their loader,
// exactly as a plugin would. What is under test here is still the app's own
// route matching — that the page owns everything below its path, that the
// deploy basename is applied once, and that the mount the adapter scopes
// itself to is the right one.

const DEFAULT_CONFIG = {
  app: { baseUrl: 'http://localhost:3000' },
  backend: { baseUrl: 'http://localhost:7007' },
};

describe('AppRoutes', () => {
  it.each([
    {
      path: '/catalog/list',
      location: '/catalog/list',
      childHref: '/catalog/list/details',
    },
    {
      path: '/touch\u00e9/a b',
      location: '/touch%C3%A9/a%20b',
      childHref: '/touch%C3%A9/a%20b/details',
    },
    {
      path: '/touch\u00e9/a b',
      location: '/TOUCH%C3%89/a%20b',
      childHref: '/TOUCH%C3%89/a%20b/details',
    },
    {
      path: '/literal/a%2Fb',
      location: '/literal/a%2fb',
      childHref: '/literal/a%2fb/details',
    },
  ])(
    'should match static route $path and preserve its mount boundaries',
    async ({ path, location, childHref }) => {
      const Content = () => (
        <>
          <a href={useHref('details')}>Static page</a>
          <a href={useHref('..')}>Static parent</a>
        </>
      );
      const page = PageBlueprint.make({
        name: 'encoded',
        params: { path, loader: async () => <Content /> },
      });
      const separatorPage = PageBlueprint.make({
        name: 'separator',
        params: {
          path: '/literal/a/b',
          loader: async () => <p>Wrong separator route</p>,
        },
      });
      renderTestApp({
        extensions: [page, separatorPage],
        initialRouteEntries: [location],
      });
      expect(
        await screen.findByRole('link', { name: 'Static page' }),
      ).toHaveAttribute('href', childHref);
      expect(
        screen.getByRole('link', { name: 'Static parent' }),
      ).toHaveAttribute('href', '/');
    },
  );

  it.each([
    {
      childPath: 'tab/:id',
      tail: '/tab/123',
      id: '123',
      parentHref: '/catalog/foo',
    },
    { childPath: '', tail: '', id: undefined, parentHref: '/' },
    { childPath: ':id?', tail: '', id: undefined, parentHref: '/catalog/foo' },
    {
      childPath: 'optional?',
      tail: '',
      id: undefined,
      parentHref: '/catalog/foo',
    },
  ])(
    'should scope ordinary routed extensions with child path "$childPath"',
    async ({ childPath, tail, id: expectedId, parentHref }) => {
      const parentRef = createRouteRef({ params: ['name'] });
      const childRef = createRouteRef({ params: ['id'] });
      const ParentLinks = () => <a href={useHref('..')}>Parent up</a>;
      const ChildContent = () => {
        const { name } = useRouteRefParams(parentRef);
        const { id } = useRouteRefParams(childRef);
        return (
          <>
            <p>
              Child {name} {id}
            </p>
            <a href={useHref('..')}>Child up</a>
            <Link to="..">Router up</Link>
          </>
        );
      };
      const parent = createExtension({
        name: 'parent',
        attachTo: { id: 'app/routes', input: 'routes' },
        inputs: {
          content: createExtensionInput([coreExtensionData.reactElement]),
        },
        output: [
          coreExtensionData.routePath,
          coreExtensionData.routeRef,
          coreExtensionData.reactElement,
        ],
        factory({ node, inputs }) {
          return [
            coreExtensionData.routePath('/catalog/:name'),
            coreExtensionData.routeRef(parentRef),
            coreExtensionData.reactElement(
              <ExtensionBoundary node={node}>
                <ReactRouterV6PageRouter>
                  <h2>Parent shell</h2>
                  <ParentLinks />
                  {inputs.content.map(child =>
                    child.get(coreExtensionData.reactElement),
                  )}
                </ReactRouterV6PageRouter>
              </ExtensionBoundary>,
            ),
          ];
        },
      });
      const wrapper = createExtension({
        name: 'wrapper',
        attachTo: { id: 'nested/parent', input: 'content' },
        inputs: {
          content: createExtensionInput([coreExtensionData.reactElement]),
        },
        output: [coreExtensionData.reactElement],
        factory({ node, inputs }) {
          return [
            coreExtensionData.reactElement(
              <ExtensionBoundary node={node}>
                <h3>Wrapper shell</h3>
                {inputs.content.map(child =>
                  child.get(coreExtensionData.reactElement),
                )}
              </ExtensionBoundary>,
            ),
          ];
        },
      });
      const child = createExtension({
        name: 'child',
        attachTo: { id: 'nested/wrapper', input: 'content' },
        output: [
          coreExtensionData.routePath,
          coreExtensionData.routeRef,
          coreExtensionData.reactElement,
        ],
        factory({ node }) {
          return [
            coreExtensionData.routePath(childPath),
            coreExtensionData.routeRef(childRef),
            coreExtensionData.reactElement(
              <ExtensionBoundary node={node}>
                <ReactRouterV6PageRouter>
                  <ChildContent />
                </ReactRouterV6PageRouter>
              </ExtensionBoundary>,
            ),
          ];
        },
      });
      renderTestApp({
        features: [
          createFrontendPlugin({
            pluginId: 'nested',
            extensions: [parent, wrapper, child],
          }),
        ],
        initialRouteEntries: [`/catalog/foo${tail}`],
      });
      expect(
        await screen.findByText(`Child foo ${expectedId ?? ''}`.trim()),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Parent shell' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Wrapper shell' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Parent up' })).toHaveAttribute(
        'href',
        '/',
      );
      expect(screen.getByRole('link', { name: 'Child up' })).toHaveAttribute(
        'href',
        parentHref,
      );
      expect(screen.getByRole('link', { name: 'Router up' })).toHaveAttribute(
        'href',
        parentHref,
      );
    },
  );

  it('should resolve refs from the complete branch that renders the page', async () => {
    const kindRef = createRouteRef({ params: ['kind'] });
    const settingsRef = createRouteRef();
    const Settings = () => {
      const href = useRouteRef(settingsRef)!();
      const { kind } = useRouteRefParams(kindRef);
      return <a href={href}>Settings for {kind}</a>;
    };
    const catalog = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => <div>Catalog catch-all</div>,
      },
    });
    const kind = PageBlueprint.make({
      name: 'kind',
      params: { path: '/:kind', routeRef: kindRef },
    });
    const settings = SubPageBlueprint.make({
      name: 'settings',
      attachTo: { id: 'page:branches/kind', input: 'pages' },
      params: {
        path: 'settings',
        title: 'Settings',
        routeRef: settingsRef,
        loader: async () => <Settings />,
      },
    });
    renderTestApp({
      features: [
        createFrontendPlugin({
          pluginId: 'branches',
          extensions: [catalog, kind, settings],
        }),
      ],
      initialRouteEntries: ['/catalog/settings'],
    });
    expect(
      await screen.findByRole('link', { name: 'Settings for catalog' }),
    ).toHaveAttribute('href', '/catalog/settings');
    expect(screen.queryByText('Catalog catch-all')).not.toBeInTheDocument();
  });

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
        loader: async () => (
          <ReactRouterV6PageRouter>
            <NestedPathDisplay />
          </ReactRouterV6PageRouter>
        ),
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
        loader: async () => (
          <ReactRouterV6PageRouter>
            <CatalogWithLinks />
          </ReactRouterV6PageRouter>
        ),
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

  it('should render the not-found fallback for unknown paths when root is registered', async () => {
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

    expect(await screen.findByText(/PAGE NOT FOUND/i)).toBeInTheDocument();
    expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('catalog-page')).not.toBeInTheDocument();
  });

  it('should render the not-found fallback when no route matches', async () => {
    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => <div data-testid="catalog-page">Catalog Page</div>,
      },
    });

    renderTestApp({
      extensions: [catalogPage],
      initialRouteEntries: ['/unknown'],
    });

    await waitFor(() => {
      expect(screen.queryByTestId('catalog-page')).not.toBeInTheDocument();
      expect(screen.getByText(/PAGE NOT FOUND/i)).toBeInTheDocument();
    });
  });

  it('should prefer a more specific entity route over the catalog index route', async () => {
    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => (
          <div data-testid="catalog-page">Catalog Index Page</div>
        ),
      },
    });

    const catalogEntityPage = PageBlueprint.make({
      name: 'catalog-entity',
      params: {
        path: '/catalog/:namespace/:kind/:name',
        loader: async () => {
          const MountProbe = () => {
            const mount = usePageMount();
            return (
              <div data-testid="catalog-entity-page">
                Catalog Entity Page
                <div data-testid="contract-base">{mount?.basePath}</div>
              </div>
            );
          };
          return <MountProbe />;
        },
      },
    });

    renderTestApp({
      extensions: [catalogPage, catalogEntityPage],
      initialRouteEntries: ['/catalog/default/component/my-entity'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-entity-page')).toBeInTheDocument();
      expect(screen.queryByTestId('catalog-page')).not.toBeInTheDocument();
      expect(screen.getByTestId('contract-base')).toHaveTextContent(
        '/catalog/default/component/my-entity',
      );
    });
  });

  it('should provide a PageMount with the matched basePath to the matched page', async () => {
    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => {
          const MountProbe = () => {
            const mount = usePageMount();
            return (
              <div data-testid="catalog-page">
                Catalog Page
                <div data-testid="contract-base">{mount?.basePath}</div>
              </div>
            );
          };
          return <MountProbe />;
        },
      },
    });

    renderTestApp({
      extensions: [catalogPage],
      initialRouteEntries: ['/catalog/entities'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
      expect(screen.getByTestId('contract-base')).toHaveTextContent('/catalog');
    });
  });

  it('should resolve pages correctly when the app is served under a basename', async () => {
    const CatalogWithLinks = () => {
      const mount = usePageMount();
      return (
        <div data-testid="catalog-page">
          Catalog Page
          <div data-testid="contract-base">{mount?.basePath}</div>
          <Link to="./create" data-testid="create-link">
            Create Entity
          </Link>
        </div>
      );
    };

    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => (
          <ReactRouterV6PageRouter>
            <CatalogWithLinks />
          </ReactRouterV6PageRouter>
        ),
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [catalogPage],
      // App-relative path; harness stores it under /backstage on the memory backend.
      initialRouteEntries: ['/catalog/entities'],
      config: {
        app: { baseUrl: 'http://localhost:3000/backstage' },
        backend: { baseUrl: 'http://localhost:7007' },
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
      expect(screen.getByTestId('contract-base')).toHaveTextContent('/catalog');
      expect(screen.getByTestId('create-link')).toHaveAttribute(
        'href',
        '/backstage/catalog/create',
      );
    });

    // Prove the app history was constructed with basename: navigate writes
    // under /backstage and location$ still emits the stripped app path.
    const locations: string[] = [];
    appHistory.location$.subscribe(loc => locations.push(loc.pathname));
    expect(locations[locations.length - 1]).toBe('/catalog/entities');

    await act(async () => {
      appHistory.navigate('/catalog/other');
    });
    expect(locations).toContain('/catalog/other');
  });

  it('should redirect from one path to another using configured redirects', async () => {
    const LocationDisplay = () => {
      const location = useLocation();
      return <div data-testid="location">{location.pathname}</div>;
    };

    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => (
          <div>
            Catalog Page
            <LocationDisplay />
          </div>
        ),
      },
    });

    renderTestApp({
      extensions: [catalogPage],
      initialRouteEntries: ['/old-catalog'],
      config: {
        ...DEFAULT_CONFIG,
        app: {
          ...DEFAULT_CONFIG.app,
          extensions: [
            {
              'app/routes': {
                config: {
                  redirects: [{ from: '/old-catalog', to: '/catalog' }],
                },
              },
            },
          ],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Catalog Page')).toBeInTheDocument();
      expect(screen.getByTestId('location')).toHaveTextContent('/catalog');
    });
  });

  it('should support multiple redirects', async () => {
    const LocationDisplay = () => {
      const location = useLocation();
      return <div data-testid="location">{location.pathname}</div>;
    };

    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => (
          <div>
            Catalog Page
            <LocationDisplay />
          </div>
        ),
      },
    });

    const docsPage = PageBlueprint.make({
      name: 'docs',
      params: {
        path: '/docs',
        loader: async () => (
          <div>
            Docs Page
            <LocationDisplay />
          </div>
        ),
      },
    });

    const redirectsConfig = {
      ...DEFAULT_CONFIG,
      app: {
        ...DEFAULT_CONFIG.app,
        extensions: [
          {
            'app/routes': {
              config: {
                redirects: [
                  { from: '/old-catalog', to: '/catalog' },
                  { from: '/old-docs', to: '/docs' },
                ],
              },
            },
          },
        ],
      },
    };

    const { unmount } = renderTestApp({
      extensions: [catalogPage, docsPage],
      initialRouteEntries: ['/old-catalog'],
      config: redirectsConfig,
    });

    await waitFor(() => {
      expect(screen.getByText('Catalog Page')).toBeInTheDocument();
      expect(screen.getByTestId('location')).toHaveTextContent('/catalog');
    });

    unmount();

    renderTestApp({
      extensions: [catalogPage, docsPage],
      initialRouteEntries: ['/old-docs'],
      config: redirectsConfig,
    });

    await waitFor(() => {
      expect(screen.getByText('Docs Page')).toBeInTheDocument();
      expect(screen.getByTestId('location')).toHaveTextContent('/docs');
    });
  });

  it('should only redirect the root path when from is /', async () => {
    const LocationDisplay = () => {
      const location = useLocation();
      return <div data-testid="location">{location.pathname}</div>;
    };

    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => (
          <div>
            Catalog Page
            <LocationDisplay />
          </div>
        ),
      },
    });

    const homePage = PageBlueprint.make({
      name: 'home',
      params: {
        path: '/home',
        loader: async () => (
          <div>
            Home Page
            <LocationDisplay />
          </div>
        ),
      },
    });

    const redirectsConfig = {
      ...DEFAULT_CONFIG,
      app: {
        ...DEFAULT_CONFIG.app,
        extensions: [
          {
            'app/routes': {
              config: {
                redirects: [{ from: '/', to: '/home' }],
              },
            },
          },
        ],
      },
    };

    const { unmount } = renderTestApp({
      extensions: [catalogPage, homePage],
      initialRouteEntries: ['/'],
      config: redirectsConfig,
    });

    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
      expect(screen.getByTestId('location')).toHaveTextContent('/home');
    });

    unmount();

    renderTestApp({
      extensions: [catalogPage, homePage],
      initialRouteEntries: ['/catalog'],
      config: redirectsConfig,
    });

    await waitFor(() => {
      expect(screen.getByText('Catalog Page')).toBeInTheDocument();
      expect(screen.getByTestId('location')).toHaveTextContent('/catalog');
    });
  });

  it('should substitute named path params in redirect target', async () => {
    const LocationDisplay = () => {
      const location = useLocation();
      return <div data-testid="location">{location.pathname}</div>;
    };

    const profilePage = PageBlueprint.make({
      name: 'profile',
      params: {
        path: '/profile/:userId',
        loader: async () => (
          <div>
            Profile Page
            <LocationDisplay />
          </div>
        ),
      },
    });

    renderTestApp({
      extensions: [profilePage],
      initialRouteEntries: ['/users/alice'],
      config: {
        ...DEFAULT_CONFIG,
        app: {
          ...DEFAULT_CONFIG.app,
          extensions: [
            {
              'app/routes': {
                config: {
                  redirects: [
                    { from: '/users/:userId', to: '/profile/:userId' },
                  ],
                },
              },
            },
          ],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Profile Page')).toBeInTheDocument();
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/profile/alice',
      );
    });
  });

  it('should substitute splat param in redirect target', async () => {
    const LocationDisplay = () => {
      const location = useLocation();
      return <div data-testid="location">{location.pathname}</div>;
    };

    const docsPage = PageBlueprint.make({
      name: 'docs',
      params: {
        path: '/docs',
        loader: async () => (
          <div>
            Docs Page
            <LocationDisplay />
          </div>
        ),
      },
    });

    renderTestApp({
      extensions: [docsPage],
      initialRouteEntries: ['/d/default/component/my-entity'],
      config: {
        ...DEFAULT_CONFIG,
        app: {
          ...DEFAULT_CONFIG.app,
          extensions: [
            {
              'app/routes': {
                config: {
                  redirects: [{ from: '/d', to: '/docs/*' }],
                },
              },
            },
          ],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Docs Page')).toBeInTheDocument();
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/docs/default/component/my-entity',
      );
    });
  });

  it('should not corrupt a longer param when a shorter param is a prefix of it', async () => {
    const LocationDisplay = () => {
      const location = useLocation();
      return <div data-testid="location">{location.pathname}</div>;
    };

    const targetPage = PageBlueprint.make({
      name: 'target',
      params: {
        path: '/target/:ab/:a',
        loader: async () => (
          <div>
            Target Page
            <LocationDisplay />
          </div>
        ),
      },
    });

    renderTestApp({
      extensions: [targetPage],
      initialRouteEntries: ['/source/bar/foo'],
      config: {
        ...DEFAULT_CONFIG,
        app: {
          ...DEFAULT_CONFIG.app,
          extensions: [
            {
              'app/routes': {
                config: {
                  redirects: [{ from: '/source/:ab/:a', to: '/target/:ab/:a' }],
                },
              },
            },
          ],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Target Page')).toBeInTheDocument();
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/target/bar/foo',
      );
    });
  });

  it('should preserve query string through a redirect', async () => {
    const LocationDisplay = () => {
      const location = useLocation();
      return (
        <div>
          <div data-testid="location">{location.pathname}</div>
          <div data-testid="search">{location.search}</div>
        </div>
      );
    };

    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => (
          <div>
            Catalog Page
            <LocationDisplay />
          </div>
        ),
      },
    });

    renderTestApp({
      extensions: [catalogPage],
      initialRouteEntries: ['/old-catalog?id=abc&view=detail'],
      config: {
        ...DEFAULT_CONFIG,
        app: {
          ...DEFAULT_CONFIG.app,
          extensions: [
            {
              'app/routes': {
                config: {
                  redirects: [{ from: '/old-catalog', to: '/catalog' }],
                },
              },
            },
          ],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Catalog Page')).toBeInTheDocument();
      expect(screen.getByTestId('location')).toHaveTextContent('/catalog');
      expect(screen.getByTestId('search')).toHaveTextContent(
        '?id=abc&view=detail',
      );
    });
  });

  it('should preserve fragment through a redirect', async () => {
    const LocationDisplay = () => {
      const location = useLocation();
      return (
        <div>
          <div data-testid="location">{location.pathname}</div>
          <div data-testid="hash">{location.hash}</div>
        </div>
      );
    };

    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => (
          <div>
            Catalog Page
            <LocationDisplay />
          </div>
        ),
      },
    });

    renderTestApp({
      extensions: [catalogPage],
      initialRouteEntries: ['/old-catalog#section'],
      config: {
        ...DEFAULT_CONFIG,
        app: {
          ...DEFAULT_CONFIG.app,
          extensions: [
            {
              'app/routes': {
                config: {
                  redirects: [{ from: '/old-catalog', to: '/catalog' }],
                },
              },
            },
          ],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Catalog Page')).toBeInTheDocument();
      expect(screen.getByTestId('location')).toHaveTextContent('/catalog');
      expect(screen.getByTestId('hash')).toHaveTextContent('#section');
    });
  });

  it('should preserve both query and fragment through a redirect', async () => {
    const LocationDisplay = () => {
      const location = useLocation();
      return (
        <div>
          <div data-testid="location">{location.pathname}</div>
          <div data-testid="search">{location.search}</div>
          <div data-testid="hash">{location.hash}</div>
        </div>
      );
    };

    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => (
          <div>
            Catalog Page
            <LocationDisplay />
          </div>
        ),
      },
    });

    renderTestApp({
      extensions: [catalogPage],
      initialRouteEntries: ['/old-catalog?id=abc&q=hello?world#section'],
      config: {
        ...DEFAULT_CONFIG,
        app: {
          ...DEFAULT_CONFIG.app,
          extensions: [
            {
              'app/routes': {
                config: {
                  redirects: [{ from: '/old-catalog', to: '/catalog' }],
                },
              },
            },
          ],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Catalog Page')).toBeInTheDocument();
      expect(screen.getByTestId('location')).toHaveTextContent('/catalog');
      expect(screen.getByTestId('search')).toHaveTextContent(
        '?id=abc&q=hello?world',
      );
      expect(screen.getByTestId('hash')).toHaveTextContent('#section');
    });
  });

  it('should preserve query through a redirect with named params and splat', async () => {
    const LocationDisplay = () => {
      const location = useLocation();
      return (
        <div>
          <div data-testid="location">{location.pathname}</div>
          <div data-testid="search">{location.search}</div>
        </div>
      );
    };

    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => (
          <div>
            Catalog Page
            <LocationDisplay />
          </div>
        ),
      },
    });

    renderTestApp({
      extensions: [catalogPage],
      initialRouteEntries: [
        '/apps/my-service/crashes/info?id=c1ccbebaffb4919d',
      ],
      config: {
        ...DEFAULT_CONFIG,
        app: {
          ...DEFAULT_CONFIG.app,
          extensions: [
            {
              'app/routes': {
                config: {
                  redirects: [
                    {
                      from: '/apps/:name',
                      to: '/catalog/default/component/:name/*',
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Catalog Page')).toBeInTheDocument();
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/catalog/default/component/my-service/crashes/info',
      );
      expect(screen.getByTestId('search')).toHaveTextContent(
        '?id=c1ccbebaffb4919d',
      );
    });
  });

  it('should prefer the query from the redirect template over the incoming one', async () => {
    const LocationDisplay = () => {
      const location = useLocation();
      return (
        <div>
          <div data-testid="location">{location.pathname}</div>
          <div data-testid="search">{location.search}</div>
        </div>
      );
    };

    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => (
          <div>
            Catalog Page
            <LocationDisplay />
          </div>
        ),
      },
    });

    renderTestApp({
      extensions: [catalogPage],
      initialRouteEntries: ['/old-catalog?view=list'],
      config: {
        ...DEFAULT_CONFIG,
        app: {
          ...DEFAULT_CONFIG.app,
          extensions: [
            {
              'app/routes': {
                config: {
                  redirects: [
                    { from: '/old-catalog', to: '/catalog?view=table' },
                  ],
                },
              },
            },
          ],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Catalog Page')).toBeInTheDocument();
      expect(screen.getByTestId('location')).toHaveTextContent('/catalog');
      expect(screen.getByTestId('search')).toHaveTextContent('?view=table');
    });
  });

  it('should not interfere with normal routes when redirects are configured', async () => {
    const homePage = PageBlueprint.make({
      name: 'home',
      params: {
        path: '/',
        loader: async () => <div>Home Page</div>,
      },
    });

    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => <div>Catalog Page</div>,
      },
    });

    renderTestApp({
      extensions: [homePage, catalogPage],
      initialRouteEntries: ['/catalog'],
      config: {
        ...DEFAULT_CONFIG,
        app: {
          ...DEFAULT_CONFIG.app,
          extensions: [
            {
              'app/routes': {
                config: {
                  redirects: [{ from: '/old-catalog', to: '/catalog' }],
                },
              },
            },
          ],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Catalog Page')).toBeInTheDocument();
    });
  });

  it('should support in-plugin relative navigation via the memory harness', async () => {
    const CatalogWithNav = () => {
      const location = useLocation();
      return (
        <div data-testid="catalog-page">
          <div data-testid="pathname">{location.pathname}</div>
          <Link to="./entities" data-testid="entities-link">
            Entities
          </Link>
          <Link to="./create" data-testid="create-link">
            Create
          </Link>
        </div>
      );
    };

    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => (
          <ReactRouterV6PageRouter>
            <CatalogWithNav />
          </ReactRouterV6PageRouter>
        ),
      },
    });

    renderTestApp({
      extensions: [catalogPage],
      initialRouteEntries: ['/catalog'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent('/catalog');
    });

    await act(async () => {
      screen.getByTestId('entities-link').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/catalog/entities',
      );
    });

    await act(async () => {
      screen.getByTestId('create-link').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/catalog/create',
      );
    });
  });

  it('should expose entity route params to a page that declares the v6 adapter', async () => {
    const EntityParams = () => {
      const params = useParams();
      return (
        <div data-testid="entity-page">
          <span data-testid="namespace">{params.namespace}</span>
          <span data-testid="kind">{params.kind}</span>
          <span data-testid="name">{params.name}</span>
          <span data-testid="splat">{params['*'] ?? ''}</span>
        </div>
      );
    };

    const catalogEntityPage = PageBlueprint.make({
      name: 'catalog-entity',
      params: {
        path: '/catalog/:namespace/:kind/:name',
        loader: async () => (
          <ReactRouterV6PageRouter>
            <EntityParams />
          </ReactRouterV6PageRouter>
        ),
      },
    });

    renderTestApp({
      extensions: [catalogEntityPage],
      initialRouteEntries: ['/catalog/default/component/my-entity/overview'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('namespace')).toHaveTextContent('default');
      expect(screen.getByTestId('kind')).toHaveTextContent('component');
      expect(screen.getByTestId('name')).toHaveTextContent('my-entity');
      expect(screen.getByTestId('splat')).toHaveTextContent('overview');
    });
  });
});
