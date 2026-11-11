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
import {
  ApiBlueprint,
  coreExtensionData,
  createApiRef,
  createExtension,
  createExtensionDataRef,
  createExtensionInput,
  createExternalRouteRef,
  createFrontendModule,
  createFrontendPlugin,
  createRouteRef,
  FrontendFeature,
  PageBlueprint,
  useApi,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import { act, fireEvent, render, screen } from '@testing-library/react';
import appPluginOriginal from '@backstage/plugin-app';
import {
  CreateSpecializedAppInternalOptions,
  prepareSpecializedApp,
} from './prepareSpecializedApp';
import { FrontendFeatureManifest } from '@internal/frontend';
import { DeferredFeatureController } from './deferredFeatures';

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

  it('should report a loaded plugin that does not match its manifest', async () => {
    const renderAt = (
      path: string,
      loaded: unknown,
      features: FrontendFeature[] = [],
    ) => {
      window.history.replaceState(null, '', path);
      const load = jest.fn(async () => ({ default: loaded }));
      const app = prepareSpecializedApp({
        features: [noSignInAppPlugin, ...features],
        __internal: {
          deferredFeatures: [{ name: 'deferred-pkg', manifest, load }],
        },
      } as CreateSpecializedAppInternalOptions).finalize();
      return render(app.element);
    };

    // Something that isn't a plugin
    const notAPlugin = renderAt('/deferred', { not: 'a plugin' });
    await expect(
      screen.findAllByText(
        /The deferred 'deferred-pkg' package didn't provide a frontend plugin as its default export/,
      ),
    ).resolves.not.toHaveLength(0);
    notAPlugin.unmount();

    // A plugin with another ID
    const otherPlugin = renderAt(
      '/deferred',
      createFrontendPlugin({ pluginId: 'other', extensions: [] }),
    );
    await expect(
      screen.findAllByText(
        /The deferred 'deferred-pkg' package provided the 'other' plugin, but its manifest is for the 'deferred' plugin/,
      ),
    ).resolves.not.toHaveLength(0);
    otherPlugin.unmount();

    // A plugin without one of the pages in the manifest
    const rootRouteRef = createRouteRef();
    const missingPage = renderAt(
      '/deferred-settings',
      createFrontendPlugin({
        pluginId: 'deferred',
        routes: { root: rootRouteRef },
        extensions: [
          PageBlueprint.make({
            params: {
              path: '/deferred',
              routeRef: rootRouteRef,
              loader: async () => <div>Real deferred root</div>,
            },
          }),
        ],
      }),
    );
    await expect(
      screen.findAllByText(
        /The 'deferred' plugin was loaded, but it doesn't provide the 'page:deferred\/settings' extension from its manifest/,
      ),
    ).resolves.not.toHaveLength(0);
    missingPage.unmount();

    // A plugin with an API that the app already provides, and an extension
    // that isn't in the manifest, both of which are ignored with a warning
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const serviceApiRef = createApiRef<{ name: string }>({
      id: 'plugin.deferred.service',
    });
    const createApi = (name: string) =>
      ApiBlueprint.make({
        params: defineParams =>
          defineParams({
            api: serviceApiRef,
            deps: {},
            factory: () => ({ name }),
          }),
      });
    const realPlugin = createRealDeferredPlugin();
    renderAt(
      '/deferred',
      realPlugin.withOverrides({
        extensions: [
          createApi('deferred'),
          PageBlueprint.make({
            name: 'unlisted',
            params: { path: '/unlisted', loader: async () => <div /> },
          }),
        ],
      }),
      [
        createFrontendPlugin({
          pluginId: 'eager',
          extensions: [createApi('eager')],
        }),
      ],
    );
    await expect(
      screen.findByText(/Real deferred root/),
    ).resolves.toBeInTheDocument();
    const graftWarnings = warn.mock.calls
      .map(([message]) => String(message))
      .filter(message => message.startsWith("Loading the deferred 'deferred'"));
    expect(graftWarnings).toHaveLength(1);
    expect(graftWarnings[0]).toContain(
      "API_FACTORY_CONFLICT: API 'plugin.deferred.service' is already provided by the app, so the one from the deferred 'deferred' plugin was ignored.",
    );
    expect(graftWarnings[0]).toContain(
      "EXTENSION_IGNORED: The 'page:deferred/unlisted' extension of the deferred 'deferred' plugin was ignored",
    );
    warn.mockRestore();
  });

  it('should keep module extensions that attach to a stub page', async () => {
    const realPlugin = createFrontendPlugin({
      pluginId: 'tabbed',
      extensions: [
        PageBlueprint.make({ params: { path: '/tabbed', title: 'Tabbed' } }),
      ],
    });
    const tabbedManifest: FrontendFeatureManifest = {
      manifestVersion: 1,
      type: 'plugin',
      pluginId: 'tabbed',
      deferrable: true,
      routes: [],
      externalRoutes: [],
      extensions: [
        {
          id: 'page:tabbed',
          kind: 'page',
          attachTo: { id: 'app/routes', input: 'routes' },
          disabled: false,
          page: { path: '/tabbed', title: 'Tabbed' },
        },
      ],
    };
    const module = createFrontendModule({
      pluginId: 'tabbed',
      extensions: [
        PageBlueprint.make({
          name: 'extra',
          attachTo: { id: 'page:tabbed', input: 'pages' },
          params: {
            path: 'extra',
            title: 'Module tab',
            loader: async () => <div>Module tab content</div>,
          },
        }),
      ],
    });
    const load = jest.fn(async () => ({ default: realPlugin }));
    window.history.replaceState(null, '', '/tabbed');

    const app = prepareSpecializedApp({
      features: [noSignInAppPlugin, module],
      __internal: {
        deferredFeatures: [
          { name: 'tabbed-pkg', manifest: tabbedManifest, load },
        ],
      },
    } as CreateSpecializedAppInternalOptions).finalize();
    const moduleNode = app.tree.nodes.get('page:tabbed/extra');
    expect(moduleNode?.edges.attachedTo?.node.spec.id).toBe('page:tabbed');

    // The real page renders the tab from the module
    render(app.element);
    await expect(
      screen.findByText('Module tab content'),
    ).resolves.toBeInTheDocument();
    expect(load).toHaveBeenCalledTimes(1);
    const realPage = app.tree.nodes.get('page:tabbed');
    expect(realPage?.spec.plugin.pluginId).toBe('tabbed');
    expect(app.tree.nodes.get('page:tabbed/extra')).toBe(moduleNode);
    expect(moduleNode?.edges.attachedTo?.node).toBe(realPage);
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

    function ScoreContent() {
      const scoreApi = useApi(scoreApiRef);
      const rootLink = useRouteRef(rootRouteRef);
      const hostLink = useRouteRef(hostLinkRef);
      const configuredLink = useRouteRef(configuredLinkRef);
      return (
        <div>
          Score {scoreApi.getScore()} at {rootLink?.()} host={hostLink?.()}{' '}
          configured={configuredLink?.()}
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
          output: [coreExtensionData.reactElement, contentTitleRef],
          *factory() {
            yield coreExtensionData.reactElement(<ScoreContent />);
            yield contentTitleRef('Score tab');
          },
        }),
      ],
    });

    const scoredManifest: FrontendFeatureManifest = {
      manifestVersion: 1,
      type: 'plugin',
      pluginId: 'scored',
      deferrable: true,
      routes: ['root'],
      externalRoutes: ['hostLink', 'configuredLink'],
      extensions: [
        {
          id: 'api:scored',
          kind: 'api',
          attachTo: { id: 'root', input: 'apis' },
          disabled: false,
        },
        {
          id: 'page:scored',
          kind: 'page',
          attachTo: { id: 'app/routes', input: 'routes' },
          disabled: false,
          page: { path: '/scored', routeRefName: 'root' },
        },
        {
          id: 'host-content:scored',
          kind: 'host-content',
          attachTo: { id: 'page:host', input: 'contents' },
          disabled: false,
          element: { data: { 'test.content.title': 'Score tab' } },
        },
      ],
    };

    const load = jest.fn(async () => ({ default: realPlugin }));
    const deferredFeatures = [
      { name: 'scored-pkg', manifest: scoredManifest, load },
    ];
    const app = prepareSpecializedApp({
      features: [noSignInAppPlugin, hostPlugin],
      config: new ConfigReader({
        app: {
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
      screen.findByRole('heading', { name: 'Score tab' }),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText('Score 42 at /scored host=/ configured=/'),
    ).resolves.toBeInTheDocument();
    expect(load).toHaveBeenCalledTimes(1);
    expect(app.apis.get(scoreApiRef)?.getScore()).toBe(42);
    expect(app.tree.nodes.get('host-content:scored')?.spec.plugin.routes).toBe(
      realPlugin.routes,
    );
  });

  it('should install the sync export of a plugin', async () => {
    const scoreApiRef = createApiRef<{ getScore(): number }>({
      id: 'plugin.synced.service',
    });
    const cardKindRef = createExtensionDataRef<string>().with({
      id: 'test.card.kind',
    });

    // An eager page that renders the cards for one kind, similar to the
    // entity page of the catalog.
    const hostPlugin = createFrontendPlugin({
      pluginId: 'host',
      extensions: [
        createExtension({
          kind: 'page',
          attachTo: { id: 'app/routes', input: 'routes' },
          inputs: {
            cards: createExtensionInput([
              coreExtensionData.reactElement,
              cardKindRef,
            ]),
          },
          output: [coreExtensionData.routePath, coreExtensionData.reactElement],
          *factory({ inputs }) {
            yield coreExtensionData.routePath('/');
            yield coreExtensionData.reactElement(
              <div>
                {inputs.cards
                  .filter(card => card.get(cardKindRef) === 'group')
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
    const createCard = (name: string) =>
      createExtension({
        kind: 'card',
        name,
        attachTo: { id: 'page:host', input: 'cards' },
        output: [coreExtensionData.reactElement, cardKindRef],
        *factory() {
          yield coreExtensionData.reactElement(<ScoreCard label={name} />);
          yield cardKindRef(name);
        },
      });
    const realPlugin = createFrontendPlugin({
      pluginId: 'synced',
      extensions: [api, createCard('group'), createCard('user')],
    });
    // The sync export holds the API, so it's available before the plugin loads
    const syncPart = createFrontendPlugin({
      pluginId: 'synced',
      extensions: [api],
    });

    const createCardManifest = (name: string) => ({
      id: `card:synced/${name}`,
      kind: 'card',
      attachTo: { id: 'page:host', input: 'cards' },
      disabled: false,
      element: { data: { 'test.card.kind': name } },
    });
    const syncedManifest: FrontendFeatureManifest = {
      manifestVersion: 1,
      type: 'plugin',
      pluginId: 'synced',
      deferrable: true,
      routes: [],
      externalRoutes: [],
      extensions: [
        {
          id: 'api:synced',
          kind: 'api',
          attachTo: { id: 'root', input: 'apis' },
          disabled: false,
          sync: true,
        },
        createCardManifest('group'),
        createCardManifest('user'),
      ],
    };

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

    // Only the card for the kind is rendered, which loads the plugin
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
        extensions: [api.override({}), createCard('group'), createCard('user')],
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
    const configuredManifest: FrontendFeatureManifest = {
      ...manifest,
      extensions: [
        ...manifest.extensions,
        {
          id: 'host-content:deferred',
          kind: 'host-content',
          attachTo: { id: 'app/root', input: 'elements' },
          disabled: false,
          element: { data: {} },
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

    // The plugin is loaded without rendering anything
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(load).toHaveBeenCalledTimes(1);
    expect(app.tree.nodes.get('page:deferred')?.spec.plugin.routes).toBe(
      realPlugin.routes,
    );
  });
});

describe('DeferredFeatureController', () => {
  function createEntry(pluginId: string, load: () => Promise<any>) {
    return {
      name: `${pluginId}-pkg`,
      manifest: { ...manifest, pluginId },
      load: jest.fn(load),
    };
  }

  it('should load each plugin once, one at a time', async () => {
    let resolveFirst = () => {};
    const first = createEntry(
      'first',
      () =>
        new Promise(resolve => {
          resolveFirst = () => resolve({ default: 'first plugin' });
        }),
    );
    const second = createEntry('second', async () => ({
      default: 'second plugin',
    }));
    const graft = jest.fn(
      (entry: { manifest: { pluginId: string } }, _loaded: unknown) => {
        const id = entry.manifest.pluginId;
        return new Map([[`page:${id}`, <div>{id}</div>]]);
      },
    );
    const controller = new DeferredFeatureController({
      entries: [first, second],
      graft,
      retryDelaysMs: [],
    });
    const listener = jest.fn();
    controller.subscribe(listener);

    // Concurrent loads of the same plugin share one load
    const firstLoad = controller.load('first');
    expect(controller.load('first')).toBe(firstLoad);
    const secondLoad = controller.load('second');
    expect(controller.getState('first')).toEqual({ status: 'loading' });
    expect(controller.getState('second')).toEqual({ status: 'loading' });

    // The second plugin waits for the first one to be added to the app
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(first.load).toHaveBeenCalledTimes(1);
    expect(second.load).not.toHaveBeenCalled();
    resolveFirst();
    await Promise.all([firstLoad, secondLoad]);
    expect(graft.mock.calls.map(([, loaded]) => loaded)).toEqual([
      'first plugin',
      'second plugin',
    ]);
    expect(controller.getState('first')).toEqual({ status: 'loaded' });
    expect(controller.getState('second')).toEqual({ status: 'loaded' });
    expect(controller.getElement('page:second')).toEqual(<div>second</div>);
    expect(listener).toHaveBeenCalledTimes(4);

    // An unknown plugin fails right away
    await controller.load('unknown');
    expect(controller.getState('unknown')).toEqual({
      status: 'failed',
      error: new Error("No deferred plugin with ID 'unknown' exists"),
    });
  });

  it('should retry loading the code, but not adding the plugin to the app', async () => {
    // The code loads on the third attempt
    let attempts = 0;
    const flaky = createEntry('flaky', async () => {
      attempts += 1;
      if (attempts < 3) {
        throw new Error(`chunk failed ${attempts}`);
      }
      return { default: 'flaky plugin' };
    });
    const broken = createEntry('broken', async () => {
      throw new Error('chunk failed');
    });
    const grafted = createEntry('grafted', async () => ({
      default: 'grafted plugin',
    }));
    const graft = jest.fn((entry: { manifest: { pluginId: string } }) => {
      if (entry.manifest.pluginId === 'grafted') {
        throw new Error('graft failed');
      }
      return new Map();
    });
    const controller = new DeferredFeatureController({
      entries: [flaky, broken, grafted],
      graft,
      retryDelaysMs: [0, 0],
    });

    await controller.load('flaky');
    expect(flaky.load).toHaveBeenCalledTimes(3);
    expect(controller.getState('flaky')).toEqual({ status: 'loaded' });

    // The error of the last attempt is reported
    await controller.load('broken');
    expect(broken.load).toHaveBeenCalledTimes(3);
    const state = controller.getState('broken');
    expect(state.status).toBe('failed');
    expect((state as { error: Error }).error.message).toBe(
      "Failed to load the deferred 'broken' plugin, reload the page to try again; caused by Error: chunk failed",
    );

    // Loading once more is left to a reload of the page
    await controller.load('broken');
    expect(broken.load).toHaveBeenCalledTimes(3);
    expect(controller.getState('broken')).toBe(state);

    // A plugin that was partly added to the app can't be removed again, so
    // adding it isn't retried
    await controller.load('grafted');
    expect(grafted.load).toHaveBeenCalledTimes(1);
    expect(graft).toHaveBeenCalledTimes(2);
    expect(
      (controller.getState('grafted') as { error: Error }).error.message,
    ).toBe(
      "Failed to load the deferred 'grafted' plugin, reload the page to try again; caused by Error: graft failed",
    );
  });
});
