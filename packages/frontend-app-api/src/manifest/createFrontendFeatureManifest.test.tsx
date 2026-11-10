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

import {
  ApiBlueprint,
  PageBlueprint,
  createApiFactory,
  createApiRef,
  createExtension,
  coreExtensionData,
  createFrontendModule,
  createFrontendPlugin,
  createRouteRef,
} from '@backstage/frontend-plugin-api';
import { createFrontendFeatureManifest } from './createFrontendFeatureManifest';

describe('createFrontendFeatureManifest', () => {
  it('describes a plugin that only has pages as deferrable', async () => {
    const rootRouteRef = createRouteRef();
    const plugin = createFrontendPlugin({
      pluginId: 'test',
      title: 'Test Plugin',
      routes: { root: rootRouteRef },
      extensions: [
        PageBlueprint.make({
          params: {
            path: '/test',
            title: 'Test Page',
            routeRef: rootRouteRef,
            loader: async () => <div>test</div>,
          },
        }),
        PageBlueprint.make({
          name: 'other',
          params: { path: '/other', loader: async () => <div>other</div> },
        }),
      ],
    });

    const manifest = await createFrontendFeatureManifest(plugin);

    expect(manifest).toMatchObject({
      manifestVersion: 1,
      type: 'plugin',
      pluginId: 'test',
      title: 'Test Plugin',
      deferrable: true,
      routes: ['root'],
      externalRoutes: [],
    });
    expect(manifest.notDeferrableReason).toBeUndefined();
    expect(manifest.extensions).toEqual([
      expect.objectContaining({
        id: 'page:test',
        kind: 'page',
        attachTo: { id: 'app/routes', input: 'routes' },
        disabled: false,
        configSchema: expect.any(Object),
        page: { path: '/test', title: 'Test Page', routeRefName: 'root' },
      }),
      expect.objectContaining({
        id: 'page:test/other',
        kind: 'page',
        page: { path: '/other' },
      }),
    ]);
    // The manifest must survive being written to disk
    expect(JSON.parse(JSON.stringify(manifest))).toEqual(manifest);
  });

  it('is not deferrable if the plugin has a non-page extension', async () => {
    const apiRef = createApiRef<{ x: string }>({ id: 'test.api' });
    const plugin = createFrontendPlugin({
      pluginId: 'test',
      extensions: [
        PageBlueprint.make({
          params: { path: '/test', loader: async () => <div /> },
        }),
        ApiBlueprint.make({
          params: defineParams =>
            defineParams(
              createApiFactory({
                api: apiRef,
                deps: {},
                factory: () => ({ x: 'x' }),
              }),
            ),
        }),
      ],
    });

    const manifest = await createFrontendFeatureManifest(plugin);

    expect(manifest.deferrable).toBe(false);
    expect(manifest.notDeferrableReason).toMatch(/non-page extension 'api:/);
    expect(manifest.extensions.map(e => e.kind)).toEqual(['page', 'api']);
  });

  it('is not deferrable if a page factory throws', async () => {
    const plugin = createFrontendPlugin({
      pluginId: 'test',
      extensions: [
        createExtension({
          kind: 'page',
          attachTo: { id: 'app/routes', input: 'routes' },
          output: [coreExtensionData.routePath],
          factory() {
            throw new Error('boom');
          },
        }),
      ],
    });

    const manifest = await createFrontendFeatureManifest(plugin);

    expect(manifest.deferrable).toBe(false);
    expect(manifest.notDeferrableReason).toContain('boom');
  });

  it('is not deferrable if a page attaches somewhere else', async () => {
    const plugin = createFrontendPlugin({
      pluginId: 'test',
      extensions: [
        PageBlueprint.make({
          params: { path: '/test', loader: async () => <div /> },
        }),
        PageBlueprint.make({
          name: 'sub',
          attachTo: { id: 'page:test', input: 'pages' },
          params: { path: 'sub', loader: async () => <div /> },
        }),
      ],
    });

    const manifest = await createFrontendFeatureManifest(plugin);

    expect(manifest.deferrable).toBe(false);
    expect(manifest.notDeferrableReason).toContain(
      'does not attach to app/routes',
    );
  });

  it('describes a module as not deferrable', async () => {
    const module = createFrontendModule({
      pluginId: 'test',
      extensions: [
        PageBlueprint.make({
          params: { path: '/test', loader: async () => <div /> },
        }),
      ],
    });

    const manifest = await createFrontendFeatureManifest(module);

    expect(manifest).toMatchObject({
      manifestVersion: 1,
      type: 'module',
      pluginId: 'test',
      deferrable: false,
    });
    expect(manifest.extensions).toHaveLength(1);
  });
});
