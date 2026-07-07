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

import { useEffect } from 'react';
import { act, screen, within } from '@testing-library/react';
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
  EntityHeaderLayoutBlueprint,
} from '@backstage/plugin-catalog-react/alpha';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import {
  entityRouteRef,
  MockStarredEntitiesApi,
  starredEntitiesApiRef,
  useAsyncEntity,
} from '@backstage/plugin-catalog-react';
import { convertLegacyRouteRef } from '@backstage/core-compat-api';
import { rootRouteRef } from '../routes';
import { Entity } from '@backstage/catalog-model';
import { useAppNode } from '@backstage/frontend-plugin-api';

jest.setTimeout(30_000);

// The entity page extension uses React.lazy (via ExtensionBoundary.lazy) to
// dynamically import EntityLayout and its large dependency tree. Pre-warming
// this import ensures Jest's module cache is populated before the first test,
// so the Suspense fallback resolves quickly instead of waiting for cold module
// resolution under CI load.
beforeAll(async () => {
  await import('./components/EntityLayout');
});

describe('Entity page', () => {
  const entityMock: Entity = {
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

  const entityPath = '/catalog/default/component/artist-lookup';

  const mockCatalogApi = catalogApiMock({ entities: [entityMock] });

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
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await userEvent.click(
        await screen.findByRole('button', { name: /Documentation/ }),
      );

      await expect(
        screen.findByRole('menuitemradio', { name: /TechDocs/ }),
      ).resolves.toHaveAttribute('href', `${entityPath}/techdocs`);

      await expect(
        screen.findByRole('menuitemradio', { name: /ApiDocs/ }),
      ).resolves.toHaveAttribute('href', `${entityPath}/apidocs`);
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
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await userEvent.click(
        await screen.findByRole('button', { name: /Docs/ }),
      );

      await expect(
        screen.findByRole('menuitemradio', { name: /TechDocs/ }),
      ).resolves.toHaveAttribute('href', `${entityPath}/techdocs`);

      await expect(
        screen.findByRole('menuitemradio', { name: /ApiDocs/ }),
      ).resolves.toHaveAttribute('href', `${entityPath}/apidocs`);
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
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await expect(
        screen.findByRole('link', { name: /TechDocs/ }),
      ).resolves.toBeInTheDocument();
      await expect(
        screen.findByRole('link', { name: /ApiDocs/ }),
      ).resolves.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Documentation/ }),
      ).not.toBeInTheDocument();
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
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await userEvent.click(
        await screen.findByRole('button', { name: /Docs/ }),
      );

      await expect(
        screen.findByRole('menuitemradio', { name: /TechDocs/ }),
      ).resolves.toHaveAttribute('href', `${entityPath}/techdocs`);

      await expect(
        screen.findByRole('menuitemradio', { name: /ApiDocs/ }),
      ).resolves.toHaveAttribute('href', `${entityPath}/apidocs`);
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
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await expect(
        screen.findByRole('link', { name: /Overview/ }),
      ).resolves.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Development/ }),
      ).not.toBeInTheDocument();
    });

    it('Should render groups first', async () => {
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      )
        .add(techdocsEntityContent)
        .add(apidocsEntityContent)
        .add(overviewEntityContent);

      await renderInTestApp(tester.reactElement(), {
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await expect(
        screen.findByRole('button', { name: /Documentation/ }),
      ).resolves.toBeInTheDocument();
      await expect(
        screen.findByRole('link', { name: /Overview/ }),
      ).resolves.toBeInTheDocument();
      const nav = screen.getByRole('navigation', {
        name: 'Content navigation',
      });
      const items = within(nav).getByRole('list').children;
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent('Documentation');
      expect(items[1]).toHaveTextContent('Overview');
    });

    it('Should resolve group aliases', async () => {
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
        {
          config: {
            groups: [
              {
                docs: { title: 'Docs', aliases: ['documentation'] },
              },
            ],
          },
        },
      )
        .add(techdocsEntityContent)
        .add(apidocsEntityContent);

      await renderInTestApp(tester.reactElement(), {
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await userEvent.click(
        await screen.findByRole('button', { name: /Docs/ }),
      );

      await expect(
        screen.findByRole('menuitemradio', { name: /TechDocs/ }),
      ).resolves.toHaveAttribute('href', `${entityPath}/techdocs`);

      await expect(
        screen.findByRole('menuitemradio', { name: /ApiDocs/ }),
      ).resolves.toHaveAttribute('href', `${entityPath}/apidocs`);
    });

    it('Should sort content by title by default', async () => {
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      )
        .add(techdocsEntityContent)
        .add(apidocsEntityContent);

      await renderInTestApp(tester.reactElement(), {
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await userEvent.click(
        await screen.findByRole('button', { name: /Documentation/ }),
      );

      const buttons = await screen.findAllByRole('menuitemradio', {
        name: /Docs/,
      });
      expect(buttons[0]).toHaveTextContent('ApiDocs');
      expect(buttons[1]).toHaveTextContent('TechDocs');
    });

    it('Should preserve natural order when configured', async () => {
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
        {
          config: {
            defaultContentOrder: 'natural',
          },
        },
      )
        .add(techdocsEntityContent)
        .add(apidocsEntityContent);

      await renderInTestApp(tester.reactElement(), {
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await userEvent.click(
        await screen.findByRole('button', { name: /Documentation/ }),
      );

      const buttons = await screen.findAllByRole('menuitemradio', {
        name: /Docs/,
      });
      expect(buttons[0]).toHaveTextContent('TechDocs');
      expect(buttons[1]).toHaveTextContent('ApiDocs');
    });

    it('Should support per-group content order override', async () => {
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
        {
          config: {
            defaultContentOrder: 'title',
            groups: [
              {
                documentation: {
                  title: 'Documentation',
                  contentOrder: 'natural',
                },
              },
            ],
          },
        },
      )
        .add(techdocsEntityContent)
        .add(apidocsEntityContent);

      await renderInTestApp(tester.reactElement(), {
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await userEvent.click(
        await screen.findByRole('button', { name: /Documentation/ }),
      );

      const buttons = await screen.findAllByRole('menuitemradio', {
        name: /Docs/,
      });
      expect(buttons[0]).toHaveTextContent('TechDocs');
      expect(buttons[1]).toHaveTextContent('ApiDocs');
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
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await expect(
        screen.findByRole('link', { name: /Overview/ }),
      ).resolves.toBeInTheDocument();
      await expect(
        screen.findByRole('button', { name: /Documentation/ }),
      ).resolves.toBeInTheDocument();
      const nav = screen.getByRole('navigation', {
        name: 'Content navigation',
      });
      const items = within(nav).getByRole('list').children;
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent('Overview');
      expect(items[1]).toHaveTextContent('Documentation');
    });
  });

  describe('Entity Page Headers', () => {
    it('keeps entity content mounted while refreshing the current entity', async () => {
      let resolveRefresh!: (entity: Entity | undefined) => void;
      const refreshResponse = new Promise<Entity | undefined>(resolve => {
        resolveRefresh = resolve;
      });
      const getEntityByRef = jest
        .fn()
        .mockResolvedValueOnce(entityMock)
        .mockReturnValueOnce(refreshResponse);
      let mounts = 0;
      let unmounts = 0;

      function RefreshContent() {
        const { refresh } = useAsyncEntity();
        useEffect(() => {
          mounts += 1;
          return () => {
            unmounts += 1;
          };
        }, []);
        return <button onClick={refresh}>Refresh entity</button>;
      }

      const refreshContent = EntityContentBlueprint.make({
        name: 'refresh',
        params: {
          path: '/refresh',
          title: 'Refresh',
          loader: async () => <RefreshContent />,
        },
      });
      const refreshHeader = EntityHeaderLayoutBlueprint.make({
        name: 'refresh',
        params: {
          filter: { kind: 'component' },
          loader: async () => () => <header>Refresh header</header>,
        },
      });
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      )
        .add(refreshContent)
        .add(refreshHeader);

      await renderInTestApp(tester.reactElement(), {
        apis: [
          catalogApiMock.mock({ getEntityByRef }),
          [starredEntitiesApiRef, mockStarredEntitiesApi],
        ],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [`${entityPath}/refresh`],
        config: {
          app: { title: 'Custom app' },
          backend: { baseUrl: 'http://localhost:7000' },
        },
        mountedRoutes: {
          '/catalog': convertLegacyRouteRef(rootRouteRef),
          '/catalog/:namespace/:kind/:name':
            convertLegacyRouteRef(entityRouteRef),
        },
      });

      await userEvent.click(
        await screen.findByRole('button', { name: 'Refresh entity' }),
      );
      expect(await screen.findByRole('progressbar')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Refresh entity' }),
      ).toBeInTheDocument();
      expect(screen.getByText('Refresh header')).toBeInTheDocument();
      expect(mounts).toBe(1);
      expect(unmounts).toBe(0);

      await act(async () => resolveRefresh(entityMock));
      expect(
        await screen.findByRole('button', { name: 'Refresh entity' }),
      ).toBeInTheDocument();
      expect(screen.getByText('Refresh header')).toBeInTheDocument();
      expect(mounts).toBe(1);
      expect(unmounts).toBe(0);
    });

    it('Should use the default header', async () => {
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      );

      await renderInTestApp(tester.reactElement(), {
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await expect(
        screen.findByText(/artist-lookup/),
      ).resolves.toBeInTheDocument();
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
      )
        .add(customEntityHeader)
        .add(overviewEntityContent);

      await renderInTestApp(tester.reactElement(), {
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await expect(
        screen.findByRole('heading', { name: /Custom header/ }),
      ).resolves.toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    });

    it('prefers a filtered successor layout over legacy headers', async () => {
      const successor = EntityHeaderLayoutBlueprint.make({
        name: 'successor',
        params: {
          filter: { kind: 'component' },
          loader: async () => props =>
            (
              <header>
                Successor header
                <span>{props.activeTabId}</span>
              </header>
            ),
        },
      });
      const legacy = EntityHeaderBlueprint.make({
        name: 'legacy',
        params: {
          loader: async () => <header>Legacy header</header>,
        },
      });
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      )
        .add(overviewEntityContent)
        .add(legacy)
        .add(successor);

      await renderInTestApp(tester.reactElement(), {
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [`${entityPath}/overview`],
        config: {
          app: { title: 'Custom app' },
          backend: { baseUrl: 'http://localhost:7000' },
        },
        mountedRoutes: {
          '/catalog': convertLegacyRouteRef(rootRouteRef),
          '/catalog/:namespace/:kind/:name':
            convertLegacyRouteRef(entityRouteRef),
        },
      });

      expect(await screen.findByText('Successor header')).toBeInTheDocument();
      expect(screen.getByText('/overview')).toBeInTheDocument();
      expect(screen.queryByText('Legacy header')).not.toBeInTheDocument();
    });

    it('does not evaluate header predicates before the entity loads', async () => {
      let resolveEntity!: (entity: Entity | undefined) => void;
      const entityPromise = new Promise<Entity | undefined>(resolve => {
        resolveEntity = resolve;
      });
      const filter = jest.fn(() => true);
      const successor = EntityHeaderLayoutBlueprint.make({
        name: 'delayed',
        params: {
          filter,
          loader: async () => () => <header>Delayed successor</header>,
        },
      });
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      ).add(successor);

      await renderInTestApp(tester.reactElement(), {
        apis: [
          catalogApiMock.mock({
            getEntityByRef: jest.fn(() => entityPromise),
          }),
          [starredEntitiesApiRef, mockStarredEntitiesApi],
        ],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
        config: {
          app: { title: 'Custom app' },
          backend: { baseUrl: 'http://localhost:7000' },
        },
        mountedRoutes: {
          '/catalog': convertLegacyRouteRef(rootRouteRef),
          '/catalog/:namespace/:kind/:name':
            convertLegacyRouteRef(entityRouteRef),
        },
      });

      expect(
        await screen.findByRole('heading', { name: 'artist-lookup' }),
      ).toBeInTheDocument();
      expect(filter).not.toHaveBeenCalled();
      await act(async () => resolveEntity(entityMock));
      expect(await screen.findByText('Delayed successor')).toBeInTheDocument();
      expect(filter).toHaveBeenCalledWith(entityMock);
    });
  });

  describe('Entity Page Context Menu', () => {
    const onClickMock = jest.fn();
    beforeEach(() => {
      onClickMock.mockReset();
    });

    it('should render menu items within their extension boundary', async () => {
      const useProps = () => ({
        title: useAppNode()!.spec.id,
        onClick: onClickMock,
      });
      const menuItem = EntityContextMenuItemBlueprint.make({
        name: 'test-boundary',
        params: {
          icon: <span>Test Icon</span>,
          useProps,
        },
      });
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      ).add(menuItem);
      const menuItemExtensionId = tester.query(menuItem).node.spec.id;

      await renderInTestApp(tester.reactElement(), {
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await userEvent.click(
        await screen.findByRole('button', { name: 'More actions' }),
      );

      const title = await screen.findByText(menuItemExtensionId);
      expect(title.closest('[role="menuitem"]')).not.toBeNull();
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
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await userEvent.click(
        await screen.findByRole('button', { name: 'More actions' }),
      );

      const menuItemElement = (await screen.findByText('Test Title')).closest(
        '[role="menuitem"]',
      );
      expect(menuItemElement).not.toBeNull();
      await expect(screen.findByText('Test Icon')).resolves.toBeInTheDocument();
      expect(menuItemElement).toHaveAttribute('href', '/somewhere');
      expect(menuItemElement?.getAttribute('aria-disabled')).toBe(
        disabled ? 'true' : null,
      );
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
        apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [entityPath],
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

      await expect(
        screen.findByText(/artist-lookup/),
      ).resolves.toBeInTheDocument();

      await userEvent.click(
        await screen.findByRole('button', { name: 'More actions' }),
      );

      const menuItemElement = (await screen.findByText('Test Title')).closest(
        '[role="menuitem"]',
      );
      expect(menuItemElement).not.toBeNull();

      await expect(screen.findByText('Test Icon')).resolves.toBeInTheDocument();
      expect(menuItemElement?.getAttribute('aria-disabled')).toBe(
        disabled ? 'true' : null,
      );
      if (!disabled) {
        await userEvent.click(menuItemElement!);
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
          mountPath: '/catalog/:namespace/:kind/:name',
          initialRouteEntries: [entityPath],
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
            mockCatalogApi,
            [starredEntitiesApiRef, mockStarredEntitiesApi],
          ],
        });

        await userEvent.click(
          await screen.findByRole('button', { name: 'More actions' }),
        );

        await expect(
          screen.findByText('Should Render'),
        ).resolves.toBeInTheDocument();
        expect(screen.queryByText('Should Not Render')).not.toBeInTheDocument();
      },
    );
  });
});
