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
  createFrontendPlugin,
  createRouteRef,
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

  it('should load a plugin with an API and an element on first use', async () => {
    const scoreApiRef = createApiRef<{ getScore(): number }>({
      id: 'plugin.scored.service',
    });
    const contentTitleRef = createExtensionDataRef<string>().with({
      id: 'test.content.title',
    });
    const rootRouteRef = createRouteRef();

    // An eager page that renders the contents attached to it, similar to the
    // entity page of the catalog.
    const hostPlugin = createFrontendPlugin({
      pluginId: 'host',
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
          output: [coreExtensionData.routePath, coreExtensionData.reactElement],
          *factory({ inputs }) {
            yield coreExtensionData.routePath('/');
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
      return (
        <div>
          Score {scoreApi.getScore()} at {rootLink?.()}
        </div>
      );
    }

    const realPlugin = createFrontendPlugin({
      pluginId: 'scored',
      routes: { root: rootRouteRef },
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

    const scoredManifest = await createFrontendFeatureManifest(realPlugin);
    expect(scoredManifest.deferrable).toBe(true);
    expect(scoredManifest.extensions).toEqual([
      expect.objectContaining({ id: 'api:scored', kind: 'api' }),
      expect.objectContaining({ id: 'page:scored', page: expect.any(Object) }),
      expect.objectContaining({
        id: 'host-content:scored',
        element: { data: { 'test.content.title': 'Score tab' } },
      }),
    ]);

    const load = jest.fn(async () => ({ default: realPlugin }));
    const deferredFeatures = [
      { name: 'scored-pkg', manifest: scoredManifest, load },
    ];
    const app = prepareSpecializedApp({
      features: [noSignInAppPlugin, hostPlugin],
      __internal: { deferredFeatures },
    } as CreateSpecializedAppInternalOptions).finalize();

    // The API is only added once the plugin is loaded
    expect(app.errors).toBeUndefined();
    expect(app.apis.get(scoreApiRef)).toBeUndefined();
    expect(load).not.toHaveBeenCalled();

    // The host page renders the stub content with the data from the
    // manifest, which loads the real content along with the API and routes
    render(app.element);
    await expect(
      screen.findByRole('heading', { name: 'Score tab' }),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText('Score 42 at /scored'),
    ).resolves.toBeInTheDocument();
    expect(load).toHaveBeenCalledTimes(1);
    expect(app.apis.get(scoreApiRef)?.getScore()).toBe(42);
    expect(app.tree.nodes.get('host-content:scored')?.spec.plugin.routes).toBe(
      realPlugin.routes,
    );

    // The content stub can't apply config, so configuring it is rejected
    expect(() =>
      prepareSpecializedApp({
        features: [noSignInAppPlugin, hostPlugin],
        config: new ConfigReader({
          app: {
            extensions: [
              { 'host-content:scored': { config: { title: 'Other' } } },
            ],
          },
        }),
        __internal: { deferredFeatures },
      } as CreateSpecializedAppInternalOptions),
    ).toThrow(
      "The 'scored-pkg' package can't be deferred, the 'host-content:scored' extension is configured in app.extensions",
    );
  });
});
