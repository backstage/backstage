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

import { ConfigReader } from '@backstage/config';
import { z } from 'zod/v4';
import {
  ApiBlueprint,
  coreExtensionData,
  createApiRef,
  createExtension,
  createExtensionDataRef,
  createExtensionInput,
  createExternalRouteRef,
  createFrontendPlugin,
  createRouteRef,
  PageBlueprint,
  useApi,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import {
  FilterPredicate,
  filterPredicateToFilterFunction,
} from '@backstage/filter-predicates';
import { act, fireEvent, render, screen } from '@testing-library/react';
import appPluginOriginal from '@backstage/plugin-app';
import {
  CreateSpecializedAppInternalOptions,
  prepareSpecializedApp,
} from './prepareSpecializedApp';
import { FrontendFeatureManifest } from '../manifest/types';
import { createFrontendFeatureManifest } from '../manifest/createFrontendFeatureManifest';

const manifest: FrontendFeatureManifest = {
  manifestVersion: 1,
  type: 'plugin',
  pluginId: 'deferred',
  title: 'Deferred',
  deferrable: true,
  routes: ['root', 'settings'],
  externalRoutes: [],
  extensions: [
    {
      id: 'page:deferred',
      kind: 'page',
      attachTo: { id: 'app/routes', input: 'routes' },
      disabled: false,
      page: { path: '/deferred', title: 'Deferred Root', routeRefName: 'root' },
    },
    {
      id: 'page:deferred/settings',
      kind: 'page',
      attachTo: { id: 'app/routes', input: 'routes' },
      disabled: false,
      page: {
        path: '/deferred-settings',
        title: 'Deferred Settings',
        routeRefName: 'settings',
      },
    },
  ],
};

function createRealDeferredPlugin() {
  const rootRouteRef = createRouteRef();
  const settingsRouteRef = createRouteRef();

  function RootContent() {
    const rootLink = useRouteRef(rootRouteRef);
    const settingsLink = useRouteRef(settingsRouteRef);
    return (
      <div>
        Real deferred root, root={rootLink?.()} settings={settingsLink?.()}
      </div>
    );
  }

  return createFrontendPlugin({
    pluginId: 'deferred',
    title: 'Deferred',
    icon: <span />,
    routes: { root: rootRouteRef, settings: settingsRouteRef },
    extensions: [
      PageBlueprint.make({
        params: {
          path: '/deferred',
          title: 'Deferred Root',
          routeRef: rootRouteRef,
          loader: async () => <RootContent />,
        },
      }),
      PageBlueprint.make({
        name: 'settings',
        params: {
          path: '/deferred-settings',
          title: 'Deferred Settings',
          routeRef: settingsRouteRef,
          loader: async () => <div>Real deferred settings</div>,
        },
      }),
    ],
  });
}

const noSignInAppPlugin = appPluginOriginal.withOverrides({
  extensions: [
    appPluginOriginal
      .getExtension('sign-in-page:app')
      .override({ disabled: true }),
  ],
});

describe('deferred features', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('should boot from stubs and load the real plugin on the first page visit', async () => {
    const realPlugin = createRealDeferredPlugin();
    const load = jest.fn(async () => ({ default: realPlugin }));

    const eagerRouteRef = createRouteRef();
    const eagerPlugin = createFrontendPlugin({
      pluginId: 'eager',
      title: 'Eager',
      icon: <span />,
      routes: { root: eagerRouteRef },
      extensions: [
        PageBlueprint.make({
          params: {
            routeRef: eagerRouteRef,
            path: '/',
            title: 'Eager Page',
            loader: async () => <div>Eager content</div>,
          },
        }),
      ],
    });

    const app = prepareSpecializedApp({
      features: [noSignInAppPlugin, eagerPlugin],
      __internal: {
        deferredFeatures: [{ name: 'deferred-pkg', manifest, load }],
      },
    } as CreateSpecializedAppInternalOptions).finalize();

    expect(app.errors).toBeUndefined();
    const eagerInstance = app.tree.nodes.get('page:eager')?.instance;
    expect(eagerInstance).toBeDefined();

    render(app.element);

    // The nav shows the stub pages, but nothing has been loaded yet
    await expect(screen.findByText('Eager content')).resolves.toBeVisible();
    expect(screen.getByText('Deferred Root')).toBeInTheDocument();
    expect(screen.getByText('Deferred Settings')).toBeInTheDocument();
    expect(load).not.toHaveBeenCalled();

    // Visiting a stub page loads and renders the real page
    fireEvent.click(screen.getByText('Deferred Root'));
    await expect(
      screen.findByText(
        'Real deferred root, root=/deferred settings=/deferred-settings',
      ),
    ).resolves.toBeInTheDocument();
    expect(load).toHaveBeenCalledTimes(1);

    // The real plugin replaced the stub in the tree, while the eager page was
    // left untouched
    const realNode = app.tree.nodes.get('page:deferred');
    expect(realNode?.spec.plugin.routes).toBe(realPlugin.routes);
    expect(app.tree.nodes.get('page:eager')?.instance).toBe(eagerInstance);

    // The other page of the plugin is rendered without loading it again
    await act(async () => {
      fireEvent.click(screen.getByText('Deferred Settings'));
    });
    await expect(
      screen.findByText('Real deferred settings'),
    ).resolves.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Eager Page'));
    });
    await expect(screen.findByText('Eager content')).resolves.toBeVisible();
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('should show load failures and boot unchanged without deferred features', async () => {
    const load = jest.fn(async () => ({ default: { not: 'a plugin' } }));
    window.history.replaceState(null, '', '/deferred');

    const app = prepareSpecializedApp({
      features: [noSignInAppPlugin],
      __internal: {
        deferredFeatures: [{ name: 'deferred-pkg', manifest, load }],
      },
    } as CreateSpecializedAppInternalOptions).finalize();

    render(app.element);

    const errorMessages = await screen.findAllByText(
      /The deferred 'deferred-pkg' package didn't provide a frontend plugin/,
    );
    expect(errorMessages.length).toBeGreaterThan(0);
    expect(load).toHaveBeenCalledTimes(1);

    const plainApp = prepareSpecializedApp({
      features: [noSignInAppPlugin],
    }).finalize();
    expect(plainApp.errors).toBeUndefined();
    expect(plainApp.tree.nodes.has('page:deferred')).toBe(false);
  });

  it('should load a plugin with an API, an element and external routes on first use', async () => {
    const scoreApiRef = createApiRef<{ getScore(): number }>({
      id: 'plugin.scored.service',
    });
    const contentTitleRef = createExtensionDataRef<string>().with({
      id: 'test.content.title',
    });
    const hostRouteRef = createRouteRef();
    const rootRouteRef = createRouteRef();
    const hostLinkRef = createExternalRouteRef({ defaultTarget: 'host.root' });
    const configuredLinkRef = createExternalRouteRef();

    // An eager page that renders the contents attached to it, similar to the
    // entity page of the catalog.
    const hostPlugin = createFrontendPlugin({
      pluginId: 'host',
      routes: { root: hostRouteRef },
      extensions: [
        createExtension({
          kind: 'page',
          attachTo: { id: 'app/routes', input: 'routes' },
          inputs: {
            contents: createExtensionInput([
              coreExtensionData.reactElement,
              contentTitleRef,
            ]),
          },
          output: [
            coreExtensionData.routePath,
            coreExtensionData.routeRef,
            coreExtensionData.reactElement,
          ],
          *factory({ inputs }) {
            yield coreExtensionData.routePath('/');
            yield coreExtensionData.routeRef(hostRouteRef);
            yield coreExtensionData.reactElement(
              <div>
                {inputs.contents.map(content => (
                  <section key={content.node.spec.id}>
                    <h2>{content.get(contentTitleRef)}</h2>
                    {content.get(coreExtensionData.reactElement)}
                  </section>
                ))}
              </div>,
            );
          },
        }),
      ],
    });

    function ScoreContent(props: { height?: number }) {
      const scoreApi = useApi(scoreApiRef);
      const rootLink = useRouteRef(rootRouteRef);
      const hostLink = useRouteRef(hostLinkRef);
      const configuredLink = useRouteRef(configuredLinkRef);
      return (
        <div>
          Score {scoreApi.getScore()} at {rootLink?.()} height={props.height}{' '}
          host={hostLink?.()} configured={configuredLink?.()}
        </div>
      );
    }

    const realPlugin = createFrontendPlugin({
      pluginId: 'scored',
      routes: { root: rootRouteRef },
      externalRoutes: {
        hostLink: hostLinkRef,
        configuredLink: configuredLinkRef,
      },
      extensions: [
        ApiBlueprint.make({
          params: defineParams =>
            defineParams({
              api: scoreApiRef,
              deps: {},
              factory: () => ({ getScore: () => 42 }),
            }),
        }),
        PageBlueprint.make({
          params: {
            path: '/scored',
            routeRef: rootRouteRef,
            loader: async () => <div>Scored page</div>,
          },
        }),
        createExtension({
          kind: 'host-content',
          attachTo: { id: 'page:host', input: 'contents' },
          configSchema: {
            title: z.string().optional(),
            height: z.number().optional(),
          },
          output: [coreExtensionData.reactElement, contentTitleRef],
          *factory({ config }) {
            yield coreExtensionData.reactElement(
              <ScoreContent height={config.height} />,
            );
            yield contentTitleRef(config.title ?? 'Score tab');
          },
        }),
      ],
    });

    const scoredManifest = await createFrontendFeatureManifest(realPlugin);
    expect(scoredManifest.deferrable).toBe(true);
    expect(scoredManifest.extensions).toEqual([
      expect.objectContaining({ id: 'api:scored', kind: 'api' }),
      expect.objectContaining({ id: 'page:scored', page: expect.any(Object) }),
      expect.objectContaining({
        id: 'host-content:scored',
        element: {
          data: { 'test.content.title': 'Score tab' },
          dataConfigKeys: ['title'],
          configPassThrough: {
            title: { dataRefId: 'test.content.title', types: ['string'] },
          },
        },
      }),
    ]);

    const load = jest.fn(async () => ({ default: realPlugin }));
    const deferredFeatures = [
      { name: 'scored-pkg', manifest: scoredManifest, load },
    ];
    const app = prepareSpecializedApp({
      features: [noSignInAppPlugin, hostPlugin],
      // Config that only the real element uses is applied once it is loaded
      config: new ConfigReader({
        app: {
          // The title is applied to the stub, and the height once the real
          // element is loaded
          extensions: [
            {
              'host-content:scored': {
                config: { height: 300, title: 'Scores' },
              },
            },
          ],
          routes: { bindings: { 'scored.configuredLink': 'host.root' } },
        },
      }),
      __internal: { deferredFeatures },
    } as CreateSpecializedAppInternalOptions).finalize();

    // The API is only added once the plugin is loaded
    expect(app.errors).toBeUndefined();
    expect(app.apis.get(scoreApiRef)).toBeUndefined();
    expect(load).not.toHaveBeenCalled();

    // The host page renders the stub content with the data from the
    // manifest, which loads the real content along with the API and routes.
    // Both the default and the configured external route bindings apply.
    render(app.element);
    await expect(
      screen.findByRole('heading', { name: 'Scores' }),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText('Score 42 at /scored height=300 host=/ configured=/'),
    ).resolves.toBeInTheDocument();
    expect(load).toHaveBeenCalledTimes(1);
    expect(app.apis.get(scoreApiRef)?.getScore()).toBe(42);
    expect(app.tree.nodes.get('host-content:scored')?.spec.plugin.routes).toBe(
      realPlugin.routes,
    );
  });

  it('should install the sync export of a plugin and recreate filter functions', async () => {
    const scoreApiRef = createApiRef<{ getScore(): number }>({
      id: 'plugin.synced.service',
    });
    const filterFunctionRef = createExtensionDataRef<
      (entity: unknown) => boolean
    >().with({ id: 'catalog.entity-filter-function' });
    const filterPredicateRef = createExtensionDataRef<FilterPredicate>().with({
      id: 'catalog.entity-filter-predicate',
    });
    const entity = { kind: 'Group' };

    // An eager page that renders the cards that match its entity, similar to
    // the entity page of the catalog.
    const hostPlugin = createFrontendPlugin({
      pluginId: 'host',
      extensions: [
        createExtension({
          kind: 'page',
          attachTo: { id: 'app/routes', input: 'routes' },
          inputs: {
            cards: createExtensionInput([
              coreExtensionData.reactElement,
              filterFunctionRef,
            ]),
          },
          output: [coreExtensionData.routePath, coreExtensionData.reactElement],
          *factory({ inputs }) {
            yield coreExtensionData.routePath('/');
            yield coreExtensionData.reactElement(
              <div>
                {inputs.cards
                  .filter(card => card.get(filterFunctionRef)(entity))
                  .map(card => (
                    <section key={card.node.spec.id}>
                      {card.get(coreExtensionData.reactElement)}
                    </section>
                  ))}
              </div>,
            );
          },
        }),
      ],
    });

    const apiFactory = jest.fn(() => ({ getScore: () => 42 }));
    const api = ApiBlueprint.make({
      params: defineParams =>
        defineParams({ api: scoreApiRef, deps: {}, factory: apiFactory }),
    });
    function ScoreCard(props: { label: string }) {
      const scoreApi = useApi(scoreApiRef);
      return (
        <div>
          {props.label} score {scoreApi.getScore()}
        </div>
      );
    }
    const createCard = (name: string, filter: FilterPredicate) =>
      createExtension({
        kind: 'card',
        name,
        attachTo: { id: 'page:host', input: 'cards' },
        output: [
          coreExtensionData.reactElement,
          filterFunctionRef,
          filterPredicateRef,
        ],
        *factory() {
          yield coreExtensionData.reactElement(<ScoreCard label={name} />);
          yield filterFunctionRef(filterPredicateToFilterFunction(filter));
          yield filterPredicateRef(filter);
        },
      });
    const realPlugin = createFrontendPlugin({
      pluginId: 'synced',
      extensions: [
        api,
        createCard('group', { kind: 'group' }),
        createCard('user', { kind: 'user' }),
      ],
    });
    // The sync export holds the API, so it's available before the plugin loads
    const syncPart = createFrontendPlugin({
      pluginId: 'synced',
      extensions: [api],
    });

    const syncedManifest = await createFrontendFeatureManifest(realPlugin, {
      sync: syncPart,
    });
    expect(syncedManifest.deferrable).toBe(true);
    expect(syncedManifest.extensions[0]).toMatchObject({
      id: 'api:synced',
      sync: true,
    });

    const createApp = (loaded: typeof realPlugin) => {
      const load = jest.fn(async () => ({ default: loaded }));
      const app = prepareSpecializedApp({
        features: [noSignInAppPlugin, hostPlugin, syncPart],
        __internal: {
          deferredFeatures: [
            { name: 'synced-pkg', manifest: syncedManifest, load },
          ],
        },
      } as CreateSpecializedAppInternalOptions).finalize();
      return { app, load };
    };

    const { app, load } = createApp(realPlugin);
    expect(app.errors).toBeUndefined();
    const syncApi = app.apis.get(scoreApiRef);
    expect(syncApi?.getScore()).toBe(42);
    expect(load).not.toHaveBeenCalled();

    // Only the card that matches the entity is rendered, which loads the plugin
    render(app.element);
    await expect(
      screen.findByText('group score 42'),
    ).resolves.toBeInTheDocument();
    expect(screen.queryByText(/user score/)).not.toBeInTheDocument();
    expect(load).toHaveBeenCalledTimes(1);
    // The API of the sync export is installed once and kept as it is
    expect(app.apis.get(scoreApiRef)).toBe(syncApi);
    expect(apiFactory).toHaveBeenCalledTimes(1);
    expect(app.tree.nodes.get('card:synced/group')?.spec.plugin.routes).toBe(
      realPlugin.routes,
    );

    // A package whose halves disagree fails to load with a clear error
    const mismatched = createApp(
      createFrontendPlugin({
        pluginId: 'synced',
        extensions: [
          api.override({}),
          createCard('group', { kind: 'group' }),
          createCard('user', { kind: 'user' }),
        ],
      }),
    );
    render(mismatched.app.element);
    const errorMessages = await screen.findAllByText(
      /The deferred 'synced-pkg' package can't be loaded, the 'api:synced' extension is defined differently in its sync and main exports/,
    );
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('should load a plugin right away if its stub can not apply the config', async () => {
    const realPlugin = createRealDeferredPlugin();
    const load = jest.fn(async () => ({ default: realPlugin }));
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const configuredManifest: FrontendFeatureManifest = {
      ...manifest,
      extensions: [
        ...manifest.extensions,
        {
          id: 'host-content:deferred',
          kind: 'host-content',
          attachTo: { id: 'app/root', input: 'elements' },
          disabled: false,
          element: { data: {}, dataConfigKeys: ['title'] },
        },
      ],
    };

    const app = prepareSpecializedApp({
      features: [noSignInAppPlugin],
      config: new ConfigReader({
        app: {
          extensions: [
            { 'host-content:deferred': { config: { title: 'Other' } } },
          ],
        },
      }),
      __internal: {
        deferredFeatures: [
          { name: 'deferred-pkg', manifest: configuredManifest, load },
        ],
      },
    } as CreateSpecializedAppInternalOptions).finalize();

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(
        "The 'host-content:deferred' extension of the deferred 'deferred-pkg' package is configured with 'title'",
      ),
    );
    // The plugin is loaded without rendering anything
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(load).toHaveBeenCalledTimes(1);
    expect(app.tree.nodes.get('page:deferred')?.spec.plugin.routes).toBe(
      realPlugin.routes,
    );
    warn.mockRestore();
  });
});
