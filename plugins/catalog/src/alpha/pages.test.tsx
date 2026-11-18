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
import { Link } from 'react-router-dom';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createExtensionTester,
  mockApis,
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
  EntityRefLink,
  entityRouteRef,
  MockStarredEntitiesApi,
  starredEntitiesApiRef,
  useAsyncEntity,
} from '@backstage/plugin-catalog-react';
import { convertLegacyRouteRef } from '@backstage/core-compat-api';
import { rootRouteRef } from '../routes';
import {
  CompoundEntityRef,
  Entity,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  useAppNode,
  createTranslationRef,
  createTranslationResource,
  translationApiRef,
  appLanguageApiRef,
} from '@backstage/frontend-plugin-api';
import { Helmet } from 'react-helmet';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppLanguageSelector } from '../../../../packages/core-app-api/src/apis/implementations/AppLanguageApi';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { I18nextTranslationApi } from '../../../../packages/core-app-api/src/apis/implementations/TranslationApi';

jest.setTimeout(30_000);

const mockEntityProviderStatuses: Array<{
  hasEntity: boolean;
  loading: boolean;
  hasError: boolean;
}> = [];
let mockRecordEntityProviderStatuses = false;

jest.mock('./components/EntityLayout/EntityLayoutBui', () => {
  const actual = jest.requireActual(
    './components/EntityLayout/EntityLayoutBui',
  ) as typeof import('./components/EntityLayout/EntityLayoutBui');
  const { useAsyncEntity: useAsyncEntityMocked } =
    require('@backstage/plugin-catalog-react') as typeof import('@backstage/plugin-catalog-react');

  function EntityLayoutBuiWithProbe(
    props: Parameters<typeof actual.EntityLayoutBui>[0],
  ) {
    function EntityProviderStatusProbe() {
      const { entity, loading, error } = useAsyncEntityMocked();
      if (mockRecordEntityProviderStatuses) {
        mockEntityProviderStatuses.push({
          hasEntity: Boolean(entity),
          loading,
          hasError: Boolean(error),
        });
      }
      return null;
    }
    return (
      <>
        <EntityProviderStatusProbe />
        <actual.EntityLayoutBui {...props} />
      </>
    );
  }

  return {
    ...actual,
    EntityLayoutBui: EntityLayoutBuiWithProbe,
  };
});

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

  it.each(['bui', 'legacy'])(
    'translates content titles in the %s layout without remounting content',
    async layout => {
      const groupRole = layout === 'legacy' ? 'tab' : 'button';
      const itemRole = layout === 'legacy' ? 'button' : 'menuitemradio';
      const menuItems = () =>
        screen
          .getAllByRole(itemRole)
          .filter(
            item =>
              layout !== 'legacy' ||
              /\/(overview|other)$/.test(item.getAttribute('href') ?? ''),
          );
      const ref = createTranslationRef({
        id: 'entity-content-titles',
        messages: { main: 'Zulu', other: 'Alpha', new: 'New tab' },
      });
      const hiddenRef = createTranslationRef({
        id: 'hidden-entity-titles',
        messages: { title: 'Hidden tab' },
      });
      const hiddenLoad = jest.fn(
        () =>
          new Promise<{
            default: { title: string };
          }>(() => {}),
      );
      let resolveGerman!: (value: {
        default: { main: string; other: string; new: string };
      }) => void;
      const german = new Promise<{
        default: { main: string; other: string; new: string };
      }>(resolve => {
        resolveGerman = resolve;
      });
      let resolveSwedish!: (value: {
        default: { main: string; other: string; new: string };
      }) => void;
      const swedish = new Promise<{
        default: { main: string; other: string; new: string };
      }>(resolve => {
        resolveSwedish = resolve;
      });
      let rejectFrench!: (cause: Error) => void;
      const french = new Promise<never>((_resolve, reject) => {
        rejectFrench = reject;
      });
      const getEntityByRef = jest
        .fn()
        .mockResolvedValueOnce(entityMock)
        .mockResolvedValueOnce({
          ...entityMock,
          metadata: { ...entityMock.metadata, description: 'Refreshed entity' },
        })
        .mockResolvedValueOnce({
          ...entityMock,
          metadata: { ...entityMock.metadata, description: 'Filtered entity' },
        })
        .mockResolvedValueOnce({
          ...entityMock,
          metadata: {
            ...entityMock.metadata,
            description: 'After failed load',
          },
        })
        .mockResolvedValueOnce({
          ...entityMock,
          metadata: { ...entityMock.metadata, description: 'Filtered entity' },
        });
      const languageApi = AppLanguageSelector.create({
        availableLanguages: ['en', 'sv', 'de', 'fr'],
        defaultLanguage: 'sv',
      });
      const translationApi = I18nextTranslationApi.create({
        languageApi,
        resources: [
          createTranslationResource({
            ref: hiddenRef,
            translations: { sv: hiddenLoad },
          }),
          createTranslationResource({
            ref,
            translations: {
              sv: () => swedish,
              de: () => german,
              fr: () => french,
            },
          }),
        ],
      });
      const errorApi = mockApis.error.mock();
      const observe = jest.spyOn(translationApi, 'translation$');
      const mount = jest.fn();
      const unmount = jest.fn();
      function Content() {
        const { entity, refresh } = useAsyncEntity();
        useEffect(() => {
          mount();
          return unmount;
        }, []);
        return (
          <>
            <input aria-label="Entity page state" defaultValue="initial" />
            <button onClick={refresh}>Refresh entity</button>
            <output>{entity?.metadata.description}</output>
          </>
        );
      }
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
        {
          apis: [
            [translationApiRef, translationApi],
            [appLanguageApiRef, languageApi],
          ],
        },
      )
        .add(
          EntityContentBlueprint.make({
            name: 'translated',
            params: {
              path: '/overview',
              title: ref('main'),
              group: 'documentation',
              loader: async () => <Content />,
            },
          }),
          { config: { title: 'Configured fallback' } },
        )
        .add(
          EntityContentBlueprint.make({
            name: 'other-translated',
            params: {
              path: '/other',
              title: ref('other'),
              group: 'documentation',
              loader: async () => <div>Other content</div>,
            },
          }),
        );
      tester.add(
        EntityContentBlueprint.make({
          name: 'conditional',
          params: {
            path: '/conditional',
            title: 'Conditional',
            filter: e => e.metadata.description !== 'Filtered entity',
            loader: async () => <div>Conditional content</div>,
          },
        }),
      );
      tester.add(
        EntityContentBlueprint.make({
          name: 'new-translated',
          params: {
            path: '/new',
            title: ref('new'),
            filter: e => e.metadata.description === 'Filtered entity',
            loader: async () => <div>New content</div>,
          },
        }),
      );
      tester.add(
        EntityContentBlueprint.make({
          name: 'hidden-translated',
          params: {
            path: '/hidden',
            title: hiddenRef('title'),
            filter: { kind: 'api' },
            loader: async () => <div>Hidden content</div>,
          },
        }),
      );
      if (layout === 'legacy') {
        tester.add(
          EntityHeaderBlueprint.make({
            name: 'legacy',
            params: { loader: async () => <header>Legacy header</header> },
          }),
        );
      }
      await renderInTestApp(tester.reactElement(), {
        apis: [
          catalogApiMock.mock({ getEntityByRef }),
          errorApi,
          [starredEntitiesApiRef, mockStarredEntitiesApi],
          [translationApiRef, translationApi],
          [appLanguageApiRef, languageApi],
        ],
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
      await waitFor(() => expect(observe).toHaveBeenCalledWith(ref));
      expect(
        screen.queryByLabelText('Entity page state'),
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Configured fallback')).not.toBeInTheDocument();
      expect(screen.queryByText('Zulu')).not.toBeInTheDocument();
      await act(async () =>
        resolveSwedish({
          default: { main: 'AAA', other: 'Övrigt', new: 'New Swedish tab' },
        }),
      );
      const input = await screen.findByLabelText('Entity page state');
      act(() => languageApi.setLanguage('en'));
      await userEvent.type(input, ' preserved');
      await userEvent.click(
        await screen.findByRole(groupRole, { name: /Documentation/ }),
      );
      expect(menuItems().map(item => item.textContent)).toEqual([
        'Alpha',
        'Zulu',
      ]);
      await userEvent.keyboard('{Escape}');
      act(() => languageApi.setLanguage('sv'));
      await userEvent.click(
        await screen.findByRole(groupRole, { name: /Documentation/ }),
      );
      expect(
        await screen.findByRole(itemRole, { name: 'AAA' }),
      ).toBeInTheDocument();
      expect(menuItems().map(item => item.textContent)).toEqual([
        'AAA',
        'Övrigt',
      ]);
      expect(Helmet.peek().title).toContain('AAA');
      await userEvent.keyboard('{Escape}');
      const subscriptions = observe.mock.calls.length;
      act(() => languageApi.setLanguage('de'));
      await userEvent.click(
        screen.getByRole('button', { name: 'Refresh entity' }),
      );
      expect(
        await screen.findByText('Refreshed entity', { selector: 'output' }),
      ).toBeInTheDocument();
      expect(observe).toHaveBeenCalledTimes(subscriptions);
      expect(screen.getByText('Conditional')).toBeInTheDocument();
      await userEvent.click(
        screen.getByRole('button', { name: 'Refresh entity' }),
      );
      expect(
        await screen.findByText('Filtered entity', { selector: 'output' }),
      ).toBeInTheDocument();
      expect(screen.queryByText('Conditional')).not.toBeInTheDocument();
      expect(screen.queryByText('New tab')).not.toBeInTheDocument();
      expect(screen.queryByText('New Swedish tab')).not.toBeInTheDocument();
      expect(screen.queryByText('New German tab')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Entity page state')).toBe(input);
      expect(input).toHaveValue('initial preserved');
      expect(mount).toHaveBeenCalledTimes(1);
      expect(unmount).not.toHaveBeenCalled();
      await userEvent.click(
        await screen.findByRole(groupRole, { name: /Documentation/ }),
      );
      expect(menuItems().map(item => item.textContent)).toEqual([
        'AAA',
        'Övrigt',
      ]);
      await act(async () =>
        resolveGerman({
          default: { main: '', other: 'Other', new: 'New German tab' },
        }),
      );
      expect(
        await screen.findByRole(itemRole, { name: 'Other' }),
      ).toBeInTheDocument();
      expect(menuItems()[0]).toHaveTextContent(/^$/);
      expect(screen.getByText('New German tab')).toBeInTheDocument();
      await userEvent.keyboard('{Escape}');
      act(() => languageApi.setLanguage('en'));
      await userEvent.click(
        await screen.findByRole(groupRole, { name: /Documentation/ }),
      );
      expect(
        await screen.findByRole(itemRole, { name: 'Zulu' }),
      ).toBeInTheDocument();
      expect(Helmet.peek().title).toContain('Zulu');
      expect(screen.getByLabelText('Entity page state')).toBe(input);
      expect(input).toHaveValue('initial preserved');
      expect(mount).toHaveBeenCalledTimes(1);
      expect(unmount).not.toHaveBeenCalled();
      expect(hiddenLoad).not.toHaveBeenCalled();
      expect(observe).not.toHaveBeenCalledWith(hiddenRef);
      expect(screen.queryByText('Hidden tab')).not.toBeInTheDocument();
      await userEvent.keyboard('{Escape}');
      await act(async () => languageApi.setLanguage('sv'));
      await act(async () => languageApi.setLanguage('fr'));
      expect(errorApi.post).not.toHaveBeenCalled();
      expect(Helmet.peek().title).toContain('AAA');
      await userEvent.click(
        screen.getByRole('button', { name: 'Refresh entity' }),
      );
      expect(
        await screen.findByText('After failed load', { selector: 'output' }),
      ).toBeInTheDocument();
      expect(Helmet.peek().title).toContain('AAA');
      await act(async () =>
        rejectFrench(new Error('Unavailable title resource')),
      );
      expect(errorApi.post).toHaveBeenCalledTimes(1);
      expect(Helmet.peek().title).toContain('AAA');
      await userEvent.click(
        screen.getByRole('button', { name: 'Refresh entity' }),
      );
      expect(
        await screen.findByText('Filtered entity', { selector: 'output' }),
      ).toBeInTheDocument();
      expect(screen.getByText('New Swedish tab')).toBeInTheDocument();
      expect(screen.queryByText('New tab')).not.toBeInTheDocument();
      expect(Helmet.peek().title).toContain('AAA');
      expect(screen.getByLabelText('Entity page state')).toBe(input);
      expect(input).toHaveValue('initial preserved');
      expect(mount).toHaveBeenCalledTimes(1);
      expect(unmount).not.toHaveBeenCalled();
      await act(async () => languageApi.setLanguage('en'));
      expect(Helmet.peek().title).toContain('Zulu');
    },
  );

  it.each(['bui', 'legacy'])(
    'waits for a newly visible translated route in the %s layout without showing not found',
    async layout => {
      const ref = createTranslationRef({
        id: 'pending-route',
        messages: { title: 'Default pending tab' },
      });
      let resolve!: (value: { default: { title: string } }) => void;
      const pending = new Promise<{ default: { title: string } }>(r => {
        resolve = r;
      });
      const languageApi = AppLanguageSelector.create({
        availableLanguages: ['en', 'sv'],
        defaultLanguage: 'sv',
      });
      const translationApi = I18nextTranslationApi.create({
        languageApi,
        resources: [
          createTranslationResource({
            ref,
            translations: { sv: () => pending },
          }),
        ],
      });
      const getEntityByRef = jest
        .fn()
        .mockResolvedValueOnce(entityMock)
        .mockResolvedValueOnce({
          ...entityMock,
          metadata: { ...entityMock.metadata, description: 'Refreshed entity' },
        });
      function Overview() {
        const { entity, refresh } = useAsyncEntity();
        return (
          <>
            <input aria-label="Retained state" defaultValue="initial" />
            <button onClick={refresh}>Refresh entity</button>
            <Link to={`${entityPath}/pending/nested`}>Open pending route</Link>
            <output>{entity?.metadata.description}</output>
          </>
        );
      }
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
        { apis: [[translationApiRef, translationApi]] },
      )
        .add(
          EntityContentBlueprint.make({
            name: 'overview',
            params: {
              path: '/overview',
              title: 'Overview',
              loader: async () => <Overview />,
            },
          }),
        )
        .add(
          EntityContentBlueprint.make({
            name: 'pending',
            params: {
              path: '/pending/*',
              title: ref('title'),
              filter: e => e.metadata.description === 'Refreshed entity',
              loader: async () => <div>Pending content</div>,
            },
          }),
        );
      if (layout === 'legacy') {
        tester.add(
          EntityHeaderBlueprint.make({
            name: 'legacy',
            params: { loader: async () => <header>Legacy header</header> },
          }),
        );
      }
      await renderInTestApp(tester.reactElement(), {
        apis: [
          catalogApiMock.mock({ getEntityByRef }),
          [starredEntitiesApiRef, mockStarredEntitiesApi],
          [translationApiRef, translationApi],
        ],
        mountPath: '/catalog/:namespace/:kind/:name',
        initialRouteEntries: [`${entityPath}/overview`],
        config: { backend: { baseUrl: 'http://localhost:7000' } },
        mountedRoutes: {
          '/catalog': convertLegacyRouteRef(rootRouteRef),
          '/catalog/:namespace/:kind/:name':
            convertLegacyRouteRef(entityRouteRef),
        },
      });
      const input = await screen.findByLabelText('Retained state');
      await userEvent.type(input, ' preserved');
      await userEvent.click(
        screen.getByRole('button', { name: 'Refresh entity' }),
      );
      expect(
        await screen.findByText('Refreshed entity', { selector: 'output' }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Retained state')).toBe(input);
      expect(input).toHaveValue('initial preserved');
      expect(screen.queryByText('Default pending tab')).not.toBeInTheDocument();
      await userEvent.click(
        screen.getByRole('link', { name: 'Open pending route' }),
      );
      expect(await screen.findByTestId('progress')).toBeInTheDocument();
      expect(screen.queryByText('Pending content')).not.toBeInTheDocument();
      expect(screen.queryByText(/not found/i)).not.toBeInTheDocument();
      await act(async () =>
        resolve({ default: { title: 'Translated pending tab' } }),
      );
      expect(await screen.findByText('Pending content')).toBeInTheDocument();
      expect(screen.getByText('Translated pending tab')).toBeInTheDocument();
      expect(screen.queryByText('Default pending tab')).not.toBeInTheDocument();
    },
  );

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

    it('does not flash Entity not found when navigating to another entity', async () => {
      mockEntityProviderStatuses.length = 0;
      mockRecordEntityProviderStatuses = true;

      const entityB: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'www-artist',
          namespace: 'default',
        },
        spec: {
          type: 'website',
          lifecycle: 'production',
          owner: 'team-a',
        },
      };

      let resolveEntityB!: (entity: Entity | undefined) => void;
      const entityBResponse = new Promise<Entity | undefined>(resolve => {
        resolveEntityB = resolve;
      });
      const getEntityByRef = jest.fn((ref: string | CompoundEntityRef) => {
        const entityRef = stringifyEntityRef(parseEntityRef(ref));
        if (entityRef === stringifyEntityRef(entityMock)) {
          return Promise.resolve(entityMock);
        }
        if (entityRef === stringifyEntityRef(entityB)) {
          return entityBResponse;
        }
        return Promise.resolve(undefined);
      });

      function RelatedEntityNavContent() {
        const { entity } = useAsyncEntity();
        return (
          <div>
            <div>Current entity: {entity?.metadata.name}</div>
            <EntityRefLink entityRef={entityB}>Go to entity B</EntityRefLink>
          </div>
        );
      }

      const navContent = EntityContentBlueprint.make({
        name: 'nav',
        params: {
          // Index route so EntityRefLink's entity-root href still matches.
          path: '/',
          title: 'Nav',
          loader: async () => <RelatedEntityNavContent />,
        },
      });
      const tester = createExtensionTester(
        Object.assign({ namespace: 'catalog' }, catalogEntityPage),
      ).add(navContent);

      try {
        await renderInTestApp(tester.reactElement(), {
          apis: [
            catalogApiMock.mock({ getEntityByRef }),
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
          await screen.findByText('Current entity: artist-lookup'),
        ).toBeInTheDocument();

        await userEvent.click(
          screen.getByRole('link', { name: 'Go to entity B' }),
        );

        expect(
          mockEntityProviderStatuses.some(
            status => !status.loading && !status.hasError && !status.hasEntity,
          ),
        ).toBe(false);

        await act(async () => resolveEntityB(entityB));
        expect(
          await screen.findByText('Current entity: www-artist'),
        ).toBeInTheDocument();
      } finally {
        mockRecordEntityProviderStatuses = false;
        mockEntityProviderStatuses.length = 0;
      }
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
