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
import userEvent from '@testing-library/user-event';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import { catalogEntityPage } from './pages';
import {
  EntityContentBlueprint,
  EntityContextMenuItemBlueprint,
  EntityHeaderBlueprint,
} from '@backstage/plugin-catalog-react/alpha';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import {
  catalogApiRef,
  entityRouteRef,
  MockStarredEntitiesApi,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { convertLegacyRouteRef } from '@backstage/core-compat-api';
import { rootRouteRef } from '../routes';
import { Entity } from '@backstage/catalog-model';

describe('Entity page', () => {
  const entityMock = {
    metadata: {
      namespace: 'default',
      annotations: {
        'backstage.io/managed-by-location':
          'file:/Users/camilal/Workspace/backstage/packages/catalog-model/examples/components/artist-lookup-component.yaml',
        'backstage.io/managed-by-origin-location':
          'file:/Users/camilal/Workspace/backstage/packages/catalog-model/examples/all.yaml',
        'backstage.io/source-template': 'template:default/springboot-template',
        'backstage.io/linguist':
          'https://github.com/backstage/backstage/tree/master/plugins/playlist',
      },
      name: 'artist-lookup',
      description: 'Artist Lookup',
      tags: ['java', 'data'],
      links: [
        {
          url: 'https://example.com/user',
          title: 'Examples Users',
          icon: 'user',
        },
        {
          url: 'https://example.com/group',
          title: 'Example Group',
          icon: 'group',
        },
        {
          url: 'https://example.com/cloud',
          title: 'Link with Cloud Icon',
          icon: 'cloud',
        },
        {
          url: 'https://example.com/dashboard',
          title: 'Dashboard',
          icon: 'dashboard',
        },
        { url: 'https://example.com/help', title: 'Support', icon: 'help' },
        { url: 'https://example.com/web', title: 'Website', icon: 'web' },
        {
          url: 'https://example.com/alert',
          title: 'Alerts',
          icon: 'alert',
        },
      ],
      uid: '0dc69d61-4715-4912-bd7d-a0d44b421db0',
      etag: 'dcebc518ac79e77356cb34df119a523de51cd522',
    },
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    spec: {
      type: 'service',
      lifecycle: 'experimental',
      owner: 'team-a',
      system: 'artist-engagement-portal',
      dependsOn: ['resource:artists-db'],
      apiConsumedBy: ['component:www-artist'],
    },
    relations: [
      { type: 'apiConsumedBy', targetRef: 'component:default/www-artist' },
      { type: 'dependsOn', targetRef: 'resource:default/artists-db' },
      { type: 'ownedBy', targetRef: 'group:default/team-a' },
      {
        type: 'partOf',
        targetRef: 'system:default/artist-engagement-portal',
      },
    ],
  };

  const mockCatalogApi = catalogApiMock.mock({
    getEntityByRef: async () => entityMock,
  });

  const mockStarredEntitiesApi = new MockStarredEntitiesApi();

  const overviewEntityContent = EntityContentBlueprint.make({
    name: 'overview',
    params: {
      path: '/overview',
      title: 'Overview',
      loader: async () => <div>Mock Overview content</div>,
    },
  });

  const techdocsEntityContent = EntityContentBlueprint.make({
    name: 'techdocs',
    params: {
      path: '/techdocs',
      title: 'TechDocs',
      group: 'documentation',
      loader: async () => <div>Mock TechDocs content</div>,
    },
  });

  const apidocsEntityContent = EntityContentBlueprint.make({
    name: 'apidocs',
    params: {
      path: '/apidocs',
      title: 'ApiDocs',
      group: 'documentation',
      loader: async () => <div>Mock ApiDocs content</div>,
    },
  });

  describe('Entity Page Groups', () => {
    it('Should render a group as dropdown', async () => {
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      )
        .add(techdocsEntityContent)
        .add(apidocsEntityContent);

      await renderInTestApp(tester.reactElement(), {
        apis: [
          [catalogApiRef, mockCatalogApi],
          [starredEntitiesApiRef, mockStarredEntitiesApi],
        ],
        config: {
          app: {
            title: 'Custom app',
          },
          backend: { baseUrl: 'http://localhost:7000' },
        },
        mountedRoutes: {
          '/catalog': convertLegacyRouteRef(rootRouteRef),
          '/catalog/:namespace/:kind/:name':
            convertLegacyRouteRef(entityRouteRef),
        },
      });

      await waitFor(() =>
        expect(
          screen.getByRole('tab', { name: /Documentation/ }),
        ).toBeInTheDocument(),
      );

      await userEvent.click(screen.getByRole('tab', { name: /Documentation/ }));

      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: /TechDocs/ }),
        ).toHaveAttribute('href', '/techdocs'),
      );

      await waitFor(() =>
        expect(screen.getByRole('button', { name: /ApiDocs/ })).toHaveAttribute(
          'href',
          '/apidocs',
        ),
      );
    });

    it('Should rename a default group', async () => {
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
        {
          config: {
            groups: [
              {
                documentation: { title: 'Docs' },
              },
            ],
          },
        },
      )
        .add(techdocsEntityContent)
        .add(apidocsEntityContent);

      await renderInTestApp(tester.reactElement(), {
        apis: [
          [catalogApiRef, mockCatalogApi],
          [starredEntitiesApiRef, mockStarredEntitiesApi],
        ],
        config: {
          app: {
            title: 'Custom app',
          },
          backend: { baseUrl: 'http://localhost:7000' },
        },
        mountedRoutes: {
          '/catalog': convertLegacyRouteRef(rootRouteRef),
          '/catalog/:namespace/:kind/:name':
            convertLegacyRouteRef(entityRouteRef),
        },
      });

      await waitFor(() =>
        expect(screen.queryByRole('tab', { name: /Docs/ })).toBeInTheDocument(),
      );

      await userEvent.click(screen.getByRole('tab', { name: /Docs/ }));

      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: /TechDocs/ }),
        ).toHaveAttribute('href', '/techdocs'),
      );

      await waitFor(() =>
        expect(screen.getByRole('button', { name: /ApiDocs/ })).toHaveAttribute(
          'href',
          '/apidocs',
        ),
      );
    });

    it('Should disassociate a content with a default group', async () => {
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      )
        .add(techdocsEntityContent)
        .add(apidocsEntityContent, {
          config: {
            group: false,
          },
        });

      await renderInTestApp(tester.reactElement(), {
        apis: [
          [catalogApiRef, mockCatalogApi],
          [starredEntitiesApiRef, mockStarredEntitiesApi],
        ],
        config: {
          app: {
            title: 'Custom app',
          },
          backend: { baseUrl: 'http://localhost:7000' },
        },
        mountedRoutes: {
          '/catalog': convertLegacyRouteRef(rootRouteRef),
          '/catalog/:namespace/:kind/:name':
            convertLegacyRouteRef(entityRouteRef),
        },
      });

      await waitFor(() =>
        expect(
          screen.queryByRole('tab', { name: /Documentation/ }),
        ).not.toBeInTheDocument(),
      );

      await waitFor(() =>
        expect(
          screen.getByRole('tab', { name: /TechDocs/ }),
        ).toBeInTheDocument(),
      );

      await waitFor(() =>
        expect(
          screen.getByRole('tab', { name: /ApiDocs/ }),
        ).toBeInTheDocument(),
      );
    });

    it('Should create a custom group', async () => {
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
        {
          config: {
            groups: [
              {
                docs: { title: 'Docs' },
              },
            ],
          },
        },
      )
        .add(techdocsEntityContent, {
          config: {
            group: 'docs',
          },
        })
        .add(apidocsEntityContent, {
          config: {
            group: 'docs',
          },
        });

      await renderInTestApp(tester.reactElement(), {
        apis: [
          [catalogApiRef, mockCatalogApi],
          [starredEntitiesApiRef, mockStarredEntitiesApi],
        ],
        config: {
          app: {
            title: 'Custom app',
          },
          backend: { baseUrl: 'http://localhost:7000' },
        },
        mountedRoutes: {
          '/catalog': convertLegacyRouteRef(rootRouteRef),
          '/catalog/:namespace/:kind/:name':
            convertLegacyRouteRef(entityRouteRef),
        },
      });

      await waitFor(() =>
        expect(screen.getByRole('tab', { name: /Docs/ })).toBeInTheDocument(),
      );

      await userEvent.click(screen.getByRole('tab', { name: /Docs/ }));

      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: /TechDocs/ }),
        ).toHaveAttribute('href', '/techdocs'),
      );

      await waitFor(() =>
        expect(screen.getByRole('button', { name: /ApiDocs/ })).toHaveAttribute(
          'href',
          '/apidocs',
        ),
      );
    });

    it('Should render a single-content groups as a normal tab', async () => {
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      )
        .add(techdocsEntityContent)
        .add(apidocsEntityContent)
        .add(overviewEntityContent, {
          config: {
            group: 'development',
          },
        });

      await renderInTestApp(tester.reactElement(), {
        apis: [
          [catalogApiRef, mockCatalogApi],
          [starredEntitiesApiRef, mockStarredEntitiesApi],
        ],
        config: {
          app: {
            title: 'Custom app',
          },
          backend: { baseUrl: 'http://localhost:7000' },
        },
        mountedRoutes: {
          '/catalog': convertLegacyRouteRef(rootRouteRef),
          '/catalog/:namespace/:kind/:name':
            convertLegacyRouteRef(entityRouteRef),
        },
      });

      await waitFor(() =>
        expect(
          screen.getByRole('tab', { name: /Overview/ }),
        ).toBeInTheDocument(),
      );

      await waitFor(() =>
        expect(
          screen.queryByRole('tab', { name: /Development/ }),
        ).not.toBeInTheDocument(),
      );
    });

    it('Should render groups first', async () => {
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      )
        .add(techdocsEntityContent)
        .add(apidocsEntityContent)
        .add(overviewEntityContent);

      await renderInTestApp(tester.reactElement(), {
        apis: [
          [catalogApiRef, mockCatalogApi],
          [starredEntitiesApiRef, mockStarredEntitiesApi],
        ],
        config: {
          app: {
            title: 'Custom app',
          },
          backend: { baseUrl: 'http://localhost:7000' },
        },
        mountedRoutes: {
          '/catalog': convertLegacyRouteRef(rootRouteRef),
          '/catalog/:namespace/:kind/:name':
            convertLegacyRouteRef(entityRouteRef),
        },
      });

      await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(2));

      expect(screen.getAllByRole('tab')[0]).toHaveTextContent('Documentation');
      expect(screen.getAllByRole('tab')[1]).toHaveTextContent('Overview');
    });

    it('Should render groups on the correct order', async () => {
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
        {
          config: {
            groups: [
              { overview: { title: 'Overview' } },
              { documentation: { title: 'Documentation' } },
            ],
          },
        },
      )
        .add(techdocsEntityContent)
        .add(apidocsEntityContent)
        .add(overviewEntityContent, {
          config: {
            group: 'overview',
          },
        });

      await renderInTestApp(tester.reactElement(), {
        apis: [
          [catalogApiRef, mockCatalogApi],
          [starredEntitiesApiRef, mockStarredEntitiesApi],
        ],
        config: {
          app: {
            title: 'Custom app',
          },
          backend: { baseUrl: 'http://localhost:7000' },
        },
        mountedRoutes: {
          '/catalog': convertLegacyRouteRef(rootRouteRef),
          '/catalog/:namespace/:kind/:name':
            convertLegacyRouteRef(entityRouteRef),
        },
      });

      await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(2));

      expect(screen.getAllByRole('tab')[0]).toHaveTextContent('Overview');
      expect(screen.getAllByRole('tab')[1]).toHaveTextContent('Documentation');
    });
  });

  describe('Entity Page Headers', () => {
    it('Should use the default header', async () => {
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      );

      await renderInTestApp(tester.reactElement(), {
        apis: [
          [catalogApiRef, mockCatalogApi],
          [starredEntitiesApiRef, mockStarredEntitiesApi],
        ],
        config: {
          app: {
            title: 'Custom app',
          },
          backend: { baseUrl: 'http://localhost:7000' },
        },
        mountedRoutes: {
          '/catalog': convertLegacyRouteRef(rootRouteRef),
          '/catalog/:namespace/:kind/:name':
            convertLegacyRouteRef(entityRouteRef),
        },
      });

      await waitFor(() =>
        expect(screen.getByText(/artist-lookup/)).toBeInTheDocument(),
      );
    });

    it('Should render a totally different header element', async () => {
      const customEntityHeader = EntityHeaderBlueprint.make({
        name: 'default',
        params: {
          loader: async () => (
            <header>
              <h1>Custom header</h1>
            </header>
          ),
        },
      });

      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      ).add(customEntityHeader);

      await renderInTestApp(tester.reactElement(), {
        apis: [
          [catalogApiRef, mockCatalogApi],
          [starredEntitiesApiRef, mockStarredEntitiesApi],
        ],
        config: {
          app: {
            title: 'Custom app',
          },
          backend: { baseUrl: 'http://localhost:7000' },
        },
        mountedRoutes: {
          '/catalog': convertLegacyRouteRef(rootRouteRef),
          '/catalog/:namespace/:kind/:name':
            convertLegacyRouteRef(entityRouteRef),
        },
      });

      await waitFor(() =>
        expect(
          screen.getByRole('heading', { name: /Custom header/ }),
        ).toBeInTheDocument(),
      );
    });
  });

  describe('Entity Page Context Menu', () => {
    const onClickMock = jest.fn();
    beforeEach(() => {
      onClickMock.mockReset();
    });

    it.each([
      {
        useProps: () => ({
          title: 'Test Title',
          href: '/somewhere',
          disabled: true,
          component: 'a',
        }),
      },
      {
        useProps: () => ({
          title: 'Test Title',
          href: '/somewhere',
          disabled: false,
          component: 'a',
        }),
      },
    ])('should render an href based context menu item', async params => {
      const menuItem = EntityContextMenuItemBlueprint.make({
        name: 'test-href',
        params: {
          icon: <span>Test Icon</span>,
          ...params,
        },
      });
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      ).add(menuItem);

      await renderInTestApp(tester.reactElement(), {
        apis: [
          [catalogApiRef, mockCatalogApi],
          [starredEntitiesApiRef, mockStarredEntitiesApi],
        ],
        config: {
          app: {
            title: 'Custom app',
          },
          backend: { baseUrl: 'http://localhost:7000' },
        },
        mountedRoutes: {
          '/catalog': convertLegacyRouteRef(rootRouteRef),
          '/catalog/:namespace/:kind/:name':
            convertLegacyRouteRef(entityRouteRef),
        },
      });
      const { disabled } = params.useProps();

      await userEvent.click(await screen.findByTestId('menu-button'));

      await waitFor(async () => {
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Icon')).toBeInTheDocument();
        const anchor = screen.getByText('Test Title').closest('a');
        expect(anchor).toHaveAttribute('href', '/somewhere');
        expect(anchor).toHaveAttribute('aria-disabled', disabled.toString());
      });
    });

    it.each([
      {
        useProps: () => ({
          title: 'Test Title',
          onClick: onClickMock,
          disabled: true,
        }),
      },
      {
        useProps: () => ({
          title: 'Test Title',
          onClick: onClickMock,
          disabled: false,
        }),
      },
    ])('should render an onClick based context menu item', async params => {
      const menuItem = EntityContextMenuItemBlueprint.make({
        name: 'test-click',
        params: {
          icon: <span>Test Icon</span>,
          ...params,
        },
      });
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      ).add(menuItem);

      await renderInTestApp(tester.reactElement(), {
        apis: [
          [catalogApiRef, mockCatalogApi],
          [starredEntitiesApiRef, mockStarredEntitiesApi],
        ],
        config: {
          app: {
            title: 'Custom app',
          },
          backend: { baseUrl: 'http://localhost:7000' },
        },
        mountedRoutes: {
          '/catalog': convertLegacyRouteRef(rootRouteRef),
          '/catalog/:namespace/:kind/:name':
            convertLegacyRouteRef(entityRouteRef),
        },
      });

      const { disabled } = params.useProps();

      // Wait for entity to load first
      await waitFor(() =>
        expect(screen.getByText(/artist-lookup/)).toBeInTheDocument(),
      );

      await userEvent.click(screen.getByTestId('menu-button'));

      // Wait for menu to open
      await waitFor(() =>
        expect(screen.getByText('Test Title')).toBeInTheDocument(),
      );

      expect(screen.getByText('Test Icon')).toBeInTheDocument();
      const listItem = screen.getByText('Test Title').closest('li');
      expect(listItem).toHaveAttribute('aria-disabled', disabled.toString());
      if (!disabled) {
        await userEvent.click(screen.getByText('Test Title'));
      }

      expect(onClickMock).toHaveBeenCalledTimes(disabled ? 0 : 1);
    });

    it.each([
      {
        positive: { params: {} },
        negative: { params: { filter: { kind: 'api' } } },
      },
      {
        positive: { params: { filter: { kind: 'component' } } },
        negative: { params: { filter: { kind: 'api' } } },
      },
      {
        positive: {
          params: {
            filter: (e: Entity) => e.kind.toLowerCase() === 'component',
          },
        },
        negative: {
          params: { filter: (e: Entity) => e.kind.toLowerCase() === 'api' },
        },
      },
    ])(
      'should render menu items according to filters',
      async ({ positive, negative }) => {
        const menuItem = EntityContextMenuItemBlueprint.make({
          name: 'should-render-menu-item',
          params: {
            icon: <span>Test Icon</span>,
            useProps: () => ({
              onClick: onClickMock,
              title: 'Should Render',
            }),
            ...positive.params,
          },
        });

        const filteredMenuItem = EntityContextMenuItemBlueprint.make({
          name: 'should-not-render-menu-item',
          params: {
            icon: <span>Test Icon</span>,
            useProps: () => ({
              onClick: onClickMock,
              title: 'Should Not Render',
            }),
            ...negative.params,
          },
        });

        const tester = createExtensionTester(
          Object.assign({ namespace: 'catalog' }, catalogEntityPage),
        )
          .add(menuItem)
          .add(filteredMenuItem);

        await renderInTestApp(tester.reactElement(), {
          config: {
            app: {
              title: 'Custom app',
            },
            backend: { baseUrl: 'http://localhost:7000' },
          },
          mountedRoutes: {
            '/catalog': convertLegacyRouteRef(rootRouteRef),
            '/catalog/:namespace/:kind/:name':
              convertLegacyRouteRef(entityRouteRef),
          },
          apis: [
            [catalogApiRef, mockCatalogApi],
            [starredEntitiesApiRef, mockStarredEntitiesApi],
          ],
        });

        await userEvent.click(await screen.findByTestId('menu-button'));

        await waitFor(async () => {
          expect(screen.getByText('Should Render')).toBeInTheDocument();
          expect(
            screen.queryByText('Should Not Render'),
          ).not.toBeInTheDocument();
        });
      },
    );
  });
});
