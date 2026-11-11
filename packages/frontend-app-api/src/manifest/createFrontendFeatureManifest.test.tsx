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
  createExtensionDataRef,
  coreExtensionData,
  createFrontendModule,
  createFrontendPlugin,
  createRouteRef,
} from '@backstage/frontend-plugin-api';
import { z } from 'zod/v4';
import { createFrontendFeatureManifest } from './createFrontendFeatureManifest';

describe('createFrontendFeatureManifest', () => {
  it('describes a plugin that only has pages as deferrable', () => {
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

    const manifest = createFrontendFeatureManifest(plugin);

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

  it('describes APIs and elements, and rejects extensions it cannot stub', () => {
    const apiRef = createApiRef<{ x: string }>({ id: 'test.api' });
    const rootRouteRef = createRouteRef();
    const titleRef = createExtensionDataRef<string>().with({
      id: 'test.title',
    });
    const filterRef = createExtensionDataRef<unknown>().with({
      id: 'test.filter',
    });
    const api = ApiBlueprint.make({
      params: defineParams =>
        defineParams(
          createApiFactory({
            api: apiRef,
            deps: {},
            factory: () => ({ x: 'x' }),
          }),
        ),
    });
    const createContent = (filter: unknown) =>
      createExtension({
        kind: 'content',
        attachTo: { id: 'page:host', input: 'contents' },
        configSchema: {
          title: z.string().optional(),
          height: z.number().optional(),
        },
        output: [
          coreExtensionData.reactElement,
          coreExtensionData.routeRef,
          titleRef,
          filterRef,
        ],
        *factory({ config }) {
          yield coreExtensionData.reactElement(<div />);
          yield coreExtensionData.routeRef(rootRouteRef);
          yield titleRef(config.title ?? 'Content');
          yield filterRef(filter);
        },
      });

    const manifest = createFrontendFeatureManifest(
      createFrontendPlugin({
        pluginId: 'test',
        routes: { root: rootRouteRef },
        extensions: [api, createContent({ kind: 'component' })],
      }),
    );
    expect(manifest.deferrable).toBe(true);
    expect(manifest.extensions).toEqual([
      expect.objectContaining({ id: 'api:test', kind: 'api' }),
      expect.objectContaining({
        id: 'content:test',
        kind: 'content',
        attachTo: { id: 'page:host', input: 'contents' },
        element: {
          data: {
            'test.title': 'Content',
            'test.filter': { kind: 'component' },
          },
          routeRefName: 'root',
        },
      }),
    ]);
    expect(JSON.parse(JSON.stringify(manifest))).toEqual(manifest);

    // A function can't be stored in the manifest
    const withFunction = createFrontendFeatureManifest(
      createFrontendPlugin({
        pluginId: 'test',
        routes: { root: rootRouteRef },
        extensions: [createContent(() => true)],
      }),
    );
    expect(withFunction.deferrable).toBe(false);
    expect(withFunction.notDeferrableReason).toContain(
      "outputs 'test.filter' data that can't be stored as JSON",
    );

    // Nothing would ever load a plugin that only has APIs
    const onlyApis = createFrontendFeatureManifest(
      createFrontendPlugin({ pluginId: 'test', extensions: [api] }),
    );
    expect(onlyApis.deferrable).toBe(false);
    expect(onlyApis.notDeferrableReason).toBe(
      'has no page or element that would load it',
    );

    // Extensions that don't render an element can't be stubbed
    const withOther = createFrontendFeatureManifest(
      createFrontendPlugin({
        pluginId: 'test',
        extensions: [
          PageBlueprint.make({
            params: { path: '/test', loader: async () => <div /> },
          }),
          createExtension({
            kind: 'other',
            attachTo: { id: 'app', input: 'other' },
            output: [titleRef],
            factory: () => [titleRef('x')],
          }),
        ],
      }),
    );
    expect(withOther.deferrable).toBe(false);
    expect(withOther.notDeferrableReason).toBe(
      "has extension 'other:test' that is not a page, an API, or an element",
    );
  });

  it('records filter functions that are created from a filter predicate', () => {
    const filterFunctionRef = createExtensionDataRef<unknown>().with({
      id: 'catalog.entity-filter-function',
    });
    const filterPredicateRef = createExtensionDataRef<unknown>().with({
      id: 'catalog.entity-filter-predicate',
    });
    const createCard = (withPredicate: boolean) =>
      createExtension({
        kind: 'card',
        attachTo: { id: 'page:host', input: 'cards' },
        output: [
          coreExtensionData.reactElement,
          filterFunctionRef,
          filterPredicateRef.optional(),
        ],
        *factory() {
          yield coreExtensionData.reactElement(<div />);
          yield filterFunctionRef(() => true);
          if (withPredicate) {
            yield filterPredicateRef({ kind: 'group' });
          }
        },
      });

    const manifest = createFrontendFeatureManifest(
      createFrontendPlugin({
        pluginId: 'test',
        extensions: [createCard(true)],
      }),
    );
    expect(manifest.deferrable).toBe(true);
    expect(manifest.extensions[0].element).toEqual({
      data: { 'catalog.entity-filter-predicate': { kind: 'group' } },
      predicateFunctions: {
        'catalog.entity-filter-function': 'catalog.entity-filter-predicate',
      },
    });

    // Without the predicate the function can't be recreated
    const withoutPredicate = createFrontendFeatureManifest(
      createFrontendPlugin({
        pluginId: 'test',
        extensions: [createCard(false)],
      }),
    );
    expect(withoutPredicate.deferrable).toBe(false);
    expect(withoutPredicate.notDeferrableReason).toContain(
      "outputs 'catalog.entity-filter-function' data that can't be stored as JSON",
    );
  });

  it('leaves the extensions of the sync export out of the deferral', () => {
    const apiRef = createApiRef<{ x: string }>({ id: 'test.api' });
    const rootRouteRef = createRouteRef();
    const api = ApiBlueprint.make({
      params: defineParams =>
        defineParams(
          createApiFactory({
            api: apiRef,
            deps: {},
            factory: () => ({ x: 'x' }),
          }),
        ),
    });
    // An extension that can't be described in a manifest
    const other = createExtension({
      kind: 'other',
      attachTo: { id: 'app', input: 'other' },
      output: [coreExtensionData.reactElement],
      factory: () => [coreExtensionData.reactElement(<div />)],
    });
    const page = PageBlueprint.make({
      params: {
        path: '/test',
        routeRef: rootRouteRef,
        loader: async () => <div />,
      },
    });
    const plugin = createFrontendPlugin({
      pluginId: 'test',
      routes: { root: rootRouteRef },
      extensions: [api, other, page],
    });

    const manifest = createFrontendFeatureManifest(plugin, {
      sync: createFrontendPlugin({
        pluginId: 'test',
        routes: { root: rootRouteRef },
        extensions: [api, other],
      }),
    });
    expect(manifest.deferrable).toBe(true);
    expect(manifest.extensions).toEqual([
      expect.objectContaining({ id: 'api:test', sync: true }),
      expect.objectContaining({ id: 'other:test', sync: true }),
      expect.objectContaining({ id: 'page:test', page: expect.any(Object) }),
    ]);

    // The halves must agree with each other
    const withCopy = createFrontendFeatureManifest(plugin, {
      sync: createFrontendPlugin({
        pluginId: 'test',
        routes: { root: rootRouteRef },
        extensions: [api.override({})],
      }),
    });
    expect(withCopy.deferrable).toBe(false);
    expect(withCopy.notDeferrableReason).toContain(
      "the 'api:test' extension is defined differently in its sync and main exports",
    );
    const withOtherPlugin = createFrontendFeatureManifest(plugin, {
      sync: createFrontendPlugin({ pluginId: 'other', extensions: [] }),
    });
    expect(withOtherPlugin.deferrable).toBe(false);
    expect(withOtherPlugin.notDeferrableReason).toContain(
      "its sync export is for the 'other' plugin",
    );
    const withMissing = createFrontendFeatureManifest(plugin, {
      sync: createFrontendPlugin({
        pluginId: 'test',
        routes: { root: rootRouteRef },
        extensions: [
          api,
          PageBlueprint.make({
            name: 'extra',
            params: { path: '/extra', loader: async () => <div /> },
          }),
        ],
      }),
    });
    expect(withMissing.deferrable).toBe(false);
    expect(withMissing.notDeferrableReason).toContain(
      "the 'page:test/extra' extension of its sync export is missing from the main export",
    );

    // Nothing is left to defer when everything is in the sync export
    const everything = createFrontendFeatureManifest(plugin, {
      sync: plugin,
    });
    expect(everything.deferrable).toBe(false);
    expect(everything.notDeferrableReason).toBe(
      'every page and element is in the sync export, so there is nothing to defer',
    );
  });

  it('is not deferrable if a page factory throws', () => {
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

    const manifest = createFrontendFeatureManifest(plugin);

    expect(manifest.deferrable).toBe(false);
    expect(manifest.notDeferrableReason).toContain('boom');
  });

  it('is not deferrable if a config schema can not be read', () => {
    // A field that validates, but fails to convert to JSON schema
    const unconvertible = {
      '~standard': {
        version: 1 as const,
        vendor: 'test',
        validate: (value: unknown) => ({ value }),
        jsonSchema: {
          input: () => {
            throw new Error('cannot convert');
          },
        },
      },
    };
    const plugin = createFrontendPlugin({
      pluginId: 'test',
      extensions: [
        PageBlueprint.makeWithOverrides({
          configSchema: { since: unconvertible },
          factory: originalFactory =>
            originalFactory({ path: '/test', loader: async () => <div /> }),
        }),
      ],
    });

    const manifest = createFrontendFeatureManifest(plugin);

    expect(manifest.deferrable).toBe(false);
    expect(manifest.notDeferrableReason).toBe(
      "could not read the config schema of 'page:test': cannot convert",
    );
    expect(manifest.extensions[0].configSchema).toBeUndefined();
  });

  it('is not deferrable if a page attaches somewhere else', () => {
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

    const manifest = createFrontendFeatureManifest(plugin);

    expect(manifest.deferrable).toBe(false);
    expect(manifest.notDeferrableReason).toContain(
      'does not attach to app/routes',
    );
  });

  it('describes a module as not deferrable', () => {
    const module = createFrontendModule({
      pluginId: 'test',
      extensions: [
        PageBlueprint.make({
          params: { path: '/test', loader: async () => <div /> },
        }),
      ],
    });

    const manifest = createFrontendFeatureManifest(module);

    expect(manifest).toMatchObject({
      manifestVersion: 1,
      type: 'module',
      pluginId: 'test',
      deferrable: false,
    });
    expect(manifest.extensions).toHaveLength(1);
  });
});
