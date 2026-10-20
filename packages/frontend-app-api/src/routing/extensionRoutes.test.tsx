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
  coreExtensionData,
  createExtension,
  createExtensionInput,
  createFrontendPlugin,
  createFrontendModule,
  createRouteRef,
  createSubRouteRef,
  createExternalRouteRef,
  routeResolutionApiRef,
  RouteRef,
} from '@backstage/frontend-plugin-api';
import { createExternalRouteRef as createLegacyExternalRouteRef } from '@backstage/core-plugin-api';
import { OpaqueExternalRouteRef, OpaqueRouteRef } from '@internal/frontend';
import { ConfigReader } from '@backstage/config';
import { FilterPredicate } from '@backstage/filter-predicates';
import { createSpecializedApp } from '../wiring/createSpecializedApp';

const app = createFrontendPlugin({
  pluginId: 'app',
  extensions: [
    createExtension({
      attachTo: { id: 'root', input: 'app' },
      inputs: {
        children: createExtensionInput([coreExtensionData.reactElement]),
      },
      output: [coreExtensionData.reactElement],
      factory: () => [coreExtensionData.reactElement(<div />)],
    }),
    createExtension({
      name: 'root',
      attachTo: { id: 'app', input: 'children' },
      inputs: {
        children: createExtensionInput([coreExtensionData.reactElement]),
      },
      output: [coreExtensionData.reactElement],
      factory: () => [coreExtensionData.reactElement(<div />)],
    }),
  ],
});

function page(
  name: string,
  path: string,
  options?: {
    parent?: string;
    ref?: RouteRef;
    disabled?: boolean;
    if?: FilterPredicate;
  },
) {
  return createExtension({
    kind: 'page',
    name,
    disabled: options?.disabled,
    if: options?.if,
    attachTo: { id: options?.parent ?? 'app/root', input: 'children' },
    inputs: {
      children: createExtensionInput([coreExtensionData.reactElement]),
    },
    output: [
      coreExtensionData.reactElement,
      coreExtensionData.routePath,
      coreExtensionData.routeRef.optional(),
    ],
    *factory() {
      yield coreExtensionData.reactElement(<div />);
      yield coreExtensionData.routePath(path);
      if (options?.ref) {
        yield coreExtensionData.routeRef(options.ref);
      }
    },
  });
}

it('resolves structural copies and sub routes alongside historical page refs', () => {
  const root = createRouteRef({ extensionId: 'page:test/root' });
  const detail = createRouteRef({
    extensionId: 'page:test/detail',
    params: ['id'],
  });
  const copy = { ...detail };
  const child = createRouteRef({
    extensionId: 'page:test/child',
    params: ['id'],
  });
  const sub = createSubRouteRef({ parent: copy, path: '/edit/:tab' });
  // @ts-expect-error Simulate a plugin compiled before extensionId was required
  const historical = createRouteRef();
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    routes: { root, detail, sub, historical, child },
    extensions: [
      page('root', '/test'),
      page('detail', ':id', { parent: 'page:test/root', ref: detail }),
      page('old', '/old', { ref: historical }),
      page('child', 'child', { parent: 'page:test/detail' }),
    ],
  });
  const result = createSpecializedApp({ features: [app, plugin] });
  const routes = result.apis.get(routeResolutionApiRef)!;
  expect(routes.resolve(root)?.()).toBe('/test');
  expect(routes.resolve(copy)?.({ id: 'one' })).toBe('/test/one');
  expect(routes.resolve(sub)?.({ id: 'one', tab: 'two' })).toBe(
    '/test/one/edit/two',
  );
  expect(routes.resolve(historical)?.()).toBe('/old');
  expect(
    routes.resolve(child, { sourcePath: '/test/old' })?.({ id: 'one' }),
  ).toBe('/test/one/child');
  expect(routes.resolve(child)?.({ id: 'two' })).toBe('/test/two/child');
  expect(
    routes.resolve(createRouteRef({ extensionId: 'page:test/root' }))?.(),
  ).toBe('/test');
  expect(
    routes.resolve(createRouteRef({ extensionId: 'page:test/detail' })),
  ).toBeUndefined();
});

it('shares module precedence with extensions and redirects structural targets', () => {
  const root = createRouteRef({ extensionId: 'page:test/root' });
  const replacement = createRouteRef({ extensionId: 'page:test/replacement' });
  const external = createExternalRouteRef({ defaultTarget: 'test.root' });
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    routes: { root },
    externalRoutes: { home: external },
    extensions: [page('root', '/base')],
  });
  const low = createFrontendModule({
    pluginId: 'test',
    routes: { root },
    extensions: [page('replacement', '/low')],
  });
  const high = createFrontendModule({
    pluginId: 'test',
    routes: { root: replacement },
    extensions: [page('replacement', '/high')],
  });
  const oldModule = { ...createFrontendModule({ pluginId: 'test' }) };
  delete (oldModule as { routes?: unknown }).routes;
  const result = createSpecializedApp({
    features: [app, high, plugin, low, oldModule, high],
  });
  const routes = result.apis.get(routeResolutionApiRef)!;
  // The repeated module object is deduplicated before both route and extension ordering.
  expect(routes.resolve(external)?.()).toBe('/base');
  expect(routes.resolve(replacement)?.()).toBe('/low');
  expect(routes.resolve(root)?.()).toBe('/base');
  const winning = createSpecializedApp({
    features: [app, plugin, low, high],
  }).apis.get(routeResolutionApiRef)!;
  expect(winning.resolve(external)?.()).toBe('/high');
  expect(winning.resolve(root)?.()).toBe('/high');
  expect(OpaqueRouteRef.toInternal(root).getExtensionId?.()).toBe(
    'page:test/root',
  );
});

it('adds and overrides module external routes with named bindings', () => {
  const root = createRouteRef({ extensionId: 'page:test/root' });
  const other = createRouteRef({ extensionId: 'page:test/other' });
  const original = createExternalRouteRef({ defaultTarget: 'test.root' });
  const replacement = createExternalRouteRef({ defaultTarget: 'test.other' });
  const added = createExternalRouteRef({ defaultTarget: 'test.root' });
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    routes: { root, other },
    externalRoutes: { home: original },
    extensions: [page('root', '/root'), page('other', '/other')],
  });
  const low = createFrontendModule({
    pluginId: 'test',
    externalRoutes: { home: original },
  });
  const high = createFrontendModule({
    pluginId: 'test',
    externalRoutes: { home: replacement, added },
  });
  const oldModule = { ...createFrontendModule({ pluginId: 'test' }) };
  delete (oldModule as { externalRoutes?: unknown }).externalRoutes;
  const ignored = createFrontendModule({
    pluginId: 'missing',
    externalRoutes: {
      home: createExternalRouteRef({ defaultTarget: 'missing.root' }),
    },
  });
  const features = [app, high, plugin, low, oldModule, ignored];
  const lower = createSpecializedApp({ features }).apis.get(
    routeResolutionApiRef,
  )!;
  expect(lower.resolve(replacement)?.()).toBe('/root');
  expect(lower.resolve(added)?.()).toBe('/root');

  const overriddenFeatures = [app, plugin, low, high];
  const higher = createSpecializedApp({
    features: overriddenFeatures,
  }).apis.get(routeResolutionApiRef)!;
  expect(higher.resolve(original)?.()).toBe('/other');
  expect(higher.resolve(replacement)?.()).toBe('/other');

  const configured = createSpecializedApp({
    features: overriddenFeatures,
    config: new ConfigReader({
      app: { routes: { bindings: { 'test.added': 'test.other' } } },
    }),
    bindRoutes({ bind }) {
      bind({ home: original }, { home: false });
    },
  }).apis.get(routeResolutionApiRef)!;
  expect(configured.resolve(added)?.()).toBe('/other');
  expect(configured.resolve(original)).toBeUndefined();
  expect(configured.resolve(replacement)).toBeUndefined();
  for (const defaultTarget of [undefined, 'missing.root']) {
    const unbound = createExternalRouteRef({ defaultTarget });
    const resolution = createSpecializedApp({
      features: [
        app,
        plugin,
        createFrontendModule({
          pluginId: 'test',
          externalRoutes: { home: unbound },
        }),
      ],
    }).apis.get(routeResolutionApiRef)!;
    expect(resolution.resolve(original)).toBeUndefined();
    expect(resolution.resolve(unbound)).toBeUndefined();
  }
});

it('binds duplicated external refs through named IDs, including disabled defaults and sub routes', () => {
  const root = createRouteRef({ extensionId: 'page:test/root' });
  const sub = createSubRouteRef({ parent: root, path: '/:id' });
  const external = createExternalRouteRef({
    params: ['id'],
    defaultTarget: 'test.sub',
  });
  const copy = createExternalRouteRef({
    params: ['id'],
    defaultTarget: 'test.sub',
  });
  createFrontendPlugin({
    pluginId: 'consumer',
    externalRoutes: { item: copy },
  });
  const consumer = createFrontendPlugin({
    pluginId: 'consumer',
    externalRoutes: { item: external },
  });
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    routes: { root, sub },
    extensions: [page('root', '/items')],
  });
  const features = [app, plugin, consumer];
  const config = new ConfigReader({
    app: { routes: { bindings: { 'consumer.item': 'test.sub' } } },
  });
  const routes = createSpecializedApp({ features, config }).apis.get(
    routeResolutionApiRef,
  )!;
  expect(routes.resolve(copy)?.({ id: 'abc' })).toBe('/items/abc');
  const disabled = createSpecializedApp({
    features,
    config,
    bindRoutes({ bind }) {
      bind({ item: copy }, { item: false });
    },
  }).apis.get(routeResolutionApiRef)!;
  expect(disabled.resolve(external)).toBeUndefined();
  expect(disabled.resolve(copy)).toBeUndefined();
});

it('validates ownership and complete installed targets without rejecting disabled or module-provided pages', () => {
  const ref = createRouteRef({ extensionId: 'page:test/root' });
  const sub = createSubRouteRef({ parent: ref, path: '/sub' });
  expect(() =>
    createFrontendPlugin({ pluginId: 'other', routes: { sub } }),
  ).toThrow('namespace');
  expect(() =>
    createFrontendModule({ pluginId: 'other', routes: { sub } }),
  ).toThrow('namespace');
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    routes: { root: ref },
  });
  expect(createSpecializedApp({ features: [app, plugin] }).errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        message: expect.stringMatching('unknown extension'),
      }),
    ]),
  );
  const module = createFrontendModule({
    pluginId: 'test',
    extensions: [page('root', '/test', { disabled: true })],
  });
  expect(
    createSpecializedApp({ features: [app, plugin, module] })
      .apis.get(routeResolutionApiRef)!
      .resolve(ref),
  ).toBeUndefined();
  const conditional = createFrontendModule({
    pluginId: 'test',
    extensions: [page('root', '/test', { if: { $not: {} } })],
  });
  expect(
    createSpecializedApp({ features: [app, plugin, conditional] })
      .apis.get(routeResolutionApiRef)!
      .resolve(ref),
  ).toBeUndefined();
  const nonRoutable = createFrontendModule({
    pluginId: 'test',
    extensions: [
      createExtension({
        kind: 'page',
        name: 'root',
        attachTo: { id: 'app/root', input: 'children' },
        output: [coreExtensionData.reactElement],
        factory: () => [coreExtensionData.reactElement(<div />)],
      }),
    ],
  });
  expect(
    createSpecializedApp({ features: [app, plugin, nonRoutable] }).errors,
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        message: expect.stringMatching('non-routable'),
      }),
    ]),
  );
  const conflict = createRouteRef({
    extensionId: 'page:test/root',
    params: ['id'],
  });
  const conflictingPlugin = createFrontendPlugin({
    pluginId: 'test',
    routes: { ref, conflict },
    extensions: [page('root', '/test')],
  });
  expect(
    createSpecializedApp({ features: [app, conflictingPlugin] }).errors,
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        message: expect.stringMatching('Conflicting route parameter contracts'),
      }),
    ]),
  );
  const mismatch = createFrontendPlugin({
    pluginId: 'test',
    routes: { ref },
    extensions: [page('root', '/:id')],
  });
  expect(createSpecializedApp({ features: [app, mismatch] }).errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ message: expect.stringMatching('parameters') }),
    ]),
  );
});

it('uses deprecated mounts when the structural target is not mounted', () => {
  const ref = createRouteRef({
    extensionId: 'page:test/target',
    params: ['id'],
  });
  const copy = createRouteRef({
    extensionId: 'page:test/target',
    params: ['id'],
  });
  const sub = createSubRouteRef({ parent: copy, path: '/edit' });
  const external = createExternalRouteRef({
    params: ['id'],
    defaultTarget: 'test.sub',
  });
  const fallback = page('converted', '/legacy/:id', { ref });
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    routes: { ref, copy, sub },
    externalRoutes: { external },
    extensions: [fallback],
  });
  const routes = createSpecializedApp({ features: [app, plugin] }).apis.get(
    routeResolutionApiRef,
  )!;
  expect(routes.resolve(copy)?.({ id: 'one' })).toBe('/legacy/one');
  expect(routes.resolve(external)?.({ id: 'one' })).toBe('/legacy/one/edit');

  const withTarget = (target: ReturnType<typeof page>) =>
    createSpecializedApp({
      features: [app, plugin.withOverrides({ extensions: [target] })],
    }).apis.get(routeResolutionApiRef)!;
  expect(
    withTarget(page('target', '/native/:id')).resolve(copy)?.({ id: 'one' }),
  ).toBe('/native/one');
  expect(
    withTarget(page('target', '/native/:id', { disabled: true })).resolve(
      copy,
    )?.({ id: 'one' }),
  ).toBe('/legacy/one');
  expect(
    withTarget(page('target', '/native/:id', { if: { $not: {} } })).resolve(
      copy,
    )?.({
      id: 'two',
    }),
  ).toBe('/legacy/two');

  const duplicates = plugin.withOverrides({
    extensions: [page('second', '/other/:id', { ref: copy })],
  });
  expect(createSpecializedApp({ features: [app, duplicates] }).errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        message: expect.stringMatching('Ambiguous deprecated route mounts'),
      }),
    ]),
  );
  expect(() =>
    createSpecializedApp({
      features: [
        app,
        duplicates.withOverrides({
          extensions: [page('target', '/native/:id')],
        }),
      ],
    }),
  ).not.toThrow();
});

it('redirects renamed routes, copies, sub routes, and chained targets', () => {
  const original = createRouteRef({ extensionId: 'page:test/original' });
  const copy = createRouteRef({ extensionId: 'page:test/original' });
  const middle = createRouteRef({ extensionId: 'page:test/middle' });
  const final = createRouteRef({ extensionId: 'page:test/final' });
  const detail = createSubRouteRef({ parent: copy, path: '/:id' });
  const edit = createSubRouteRef({ parent: detail, path: '/edit' });
  const flatEdit = createSubRouteRef({ parent: copy, path: '/:id/edit' });
  const oldExternal = createExternalRouteRef({ defaultTarget: 'test.oldName' });
  const newExternal = createExternalRouteRef({ defaultTarget: 'test.newName' });
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    routes: { oldName: original, newName: copy, middle },
    externalRoutes: { oldExternal, newExternal },
    extensions: [page('final', '/final')],
  });
  const module = createFrontendModule({
    pluginId: 'test',
    routes: { newName: middle, middle: final },
  });
  const routes = createSpecializedApp({
    features: [app, plugin, module],
  }).apis.get(routeResolutionApiRef)!;
  for (const ref of [original, copy, middle, final, oldExternal, newExternal]) {
    expect(routes.resolve(ref)?.()).toBe('/final');
  }
  expect(routes.resolve(detail)?.({ id: 'one' })).toBe('/final/one');
  expect(routes.resolve(edit)?.({ id: 'one' })).toBe('/final/one/edit');
  expect(routes.resolve(flatEdit)?.({ id: 'two' })).toBe('/final/two/edit');
  expect(OpaqueRouteRef.toInternal(original).getExtensionId?.()).toBe(
    'page:test/original',
  );
  const disabled = createSpecializedApp({
    features: [
      app,
      plugin,
      module,
      createFrontendModule({
        pluginId: 'test',
        extensions: [page('final', '/final', { disabled: true })],
      }),
    ],
  }).apis.get(routeResolutionApiRef)!;
  expect(disabled.resolve(original)).toBeUndefined();
  expect(disabled.resolve(detail)).toBeUndefined();
});

it('validates the winning overrides without falling back to earlier modules', () => {
  const a = createRouteRef({ extensionId: 'page:test/a' });
  const b = createRouteRef({ extensionId: 'page:test/b' });
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    routes: {
      oldName: a,
      newName: createRouteRef({ extensionId: 'page:test/a' }),
      other: b,
    },
    extensions: [page('a', '/a'), page('b', '/b'), page('c', '/c')],
  });
  const low = createFrontendModule({
    pluginId: 'test',
    routes: {
      oldName: b,
      newName: createRouteRef({
        extensionId: 'page:test/c',
        params: ['unused'],
      }),
    },
  });
  const high = createFrontendModule({
    pluginId: 'test',
    routes: { newName: createRouteRef({ extensionId: 'page:test/b' }) },
  });
  const routes = createSpecializedApp({
    features: [app, plugin, low, high],
  }).apis.get(routeResolutionApiRef)!;
  expect(routes.resolve(a)?.()).toBe('/b');
  expect(
    createSpecializedApp({ features: [app, plugin, high, low] }).errors,
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        code: 'ROUTE_OVERRIDE_INVALID',
        message: expect.stringMatching(
          /Conflicting route overrides 'test.oldName' and 'test.newName'/,
        ),
      }),
    ]),
  );
  const cyclic = createSpecializedApp({
    features: [
      app,
      plugin,
      createFrontendModule({
        pluginId: 'test',
        routes: { oldName: b, other: a },
      }),
    ],
  });
  expect(cyclic.errors).toEqual([
    expect.objectContaining({
      code: 'ROUTE_OVERRIDE_INVALID',
      message: expect.stringMatching(/Route redirect cycle/),
    }),
  ]);
  const cyclicRoutes = cyclic.apis.get(routeResolutionApiRef)!;
  expect(cyclicRoutes.resolve(a)).toBeUndefined();
  expect(cyclicRoutes.resolve({ ...b })).toBeUndefined();
  expect(
    cyclicRoutes.resolve(createRouteRef({ extensionId: 'page:test/c' }))?.(),
  ).toBe('/c');
  expect(
    createSpecializedApp({
      features: [
        app,
        plugin,
        createFrontendModule({
          pluginId: 'test',
          routes: {
            oldName: createRouteRef({
              extensionId: 'page:test/c',
              params: ['id'],
            }),
          },
        }),
      ],
    }).errors,
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        message: expect.stringMatching(/incompatible parameters/),
      }),
    ]),
  );
});

it('only permits absolute route overrides after selecting the winning modules', () => {
  const root = createRouteRef({ extensionId: 'page:test/root' });
  const detail = createSubRouteRef({ parent: root, path: '/:id' });
  const copy = createSubRouteRef({
    parent: createRouteRef({ extensionId: 'page:test/root' }),
    path: '/:id',
  });
  const sibling = createSubRouteRef({ parent: root, path: '/other/:id' });
  const target = createRouteRef({
    extensionId: 'page:test/detail',
    params: ['id'],
  });
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    routes: { root, detail, target },
    extensions: [page('root', '/root'), page('detail', '/detail/:id')],
  });
  const valid = createFrontendModule({
    pluginId: 'test',
    routes: { detail: copy, added: sibling },
  });
  for (const [name, ref] of [
    ['detail', target],
    ['detail', sibling],
    ['target', detail],
  ] as const) {
    const invalid = createFrontendModule({
      pluginId: 'test',
      routes: { [name]: ref },
    });
    expect(
      createSpecializedApp({ features: [app, plugin, valid, invalid] }).errors,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringMatching(
            /must replace an absolute route reference/,
          ),
        }),
      ]),
    );
  }
  const discarded = createFrontendModule({
    pluginId: 'test',
    routes: { detail: target },
  });
  const resolution = createSpecializedApp({
    features: [app, plugin, discarded, valid],
  }).apis.get(routeResolutionApiRef)!;
  expect(resolution.resolve(detail)?.({ id: 'one' })).toBe('/root/one');
  expect(resolution.resolve(copy)?.({ id: 'two' })).toBe('/root/two');
  expect(resolution.resolve(sibling)?.({ id: 'three' })).toBe(
    '/root/other/three',
  );
  const emptyPlugin = createFrontendPlugin({
    pluginId: 'test',
    extensions: [page('root', '/root'), page('detail', '/detail/:id')],
  });
  const introduced = createFrontendModule({
    pluginId: 'test',
    routes: { detail },
  });
  expect(
    createSpecializedApp({
      features: [app, emptyPlugin, introduced, discarded],
    }).errors,
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        message: expect.stringMatching(
          /must replace an absolute route reference/,
        ),
      }),
    ]),
  );
});

it('redirects routes first introduced by a module after selecting the final overrides', () => {
  const original = createRouteRef({ extensionId: 'page:test/original' });
  const copy = createRouteRef({ extensionId: 'page:test/original' });
  const final = createRouteRef({ extensionId: 'page:test/final' });
  const plugin = createFrontendPlugin({ pluginId: 'test' });
  const first = createFrontendModule({
    pluginId: 'test',
    routes: { oldName: original, newName: copy },
  });
  const discarded = createFrontendModule({
    pluginId: 'test',
    routes: {
      newName: createRouteRef({
        extensionId: 'page:test/missing',
        params: ['unused'],
      }),
    },
  });
  const last = createFrontendModule({
    pluginId: 'test',
    routes: { newName: final },
    extensions: [page('final', '/final')],
  });
  const resolution = createSpecializedApp({
    features: [app, plugin, first, discarded, last],
  }).apis.get(routeResolutionApiRef)!;
  expect(resolution.resolve(original)?.()).toBe('/final');
  expect(resolution.resolve(copy)?.()).toBe('/final');
});

it('uses registered identities for historical and legacy-compatible external overrides', () => {
  const historical = createExternalRouteRef({ defaultTarget: 'test.root' });
  delete OpaqueExternalRouteRef.toInternal(historical).getId;
  const legacy = createLegacyExternalRouteRef({
    id: 'legacy',
    defaultTarget: 'test.root',
  });
  const misleading = createExternalRouteRef({ defaultTarget: 'test.root' });
  OpaqueExternalRouteRef.toInternal(misleading).getId = () =>
    'unregistered.route';

  for (const original of [historical, legacy, misleading]) {
    const root = createRouteRef({ extensionId: 'page:test/root' });
    const other = createRouteRef({ extensionId: 'page:test/other' });
    const replacement = createExternalRouteRef({ defaultTarget: 'test.other' });
    delete OpaqueExternalRouteRef.toInternal(replacement).getId;
    const plugin = createFrontendPlugin({
      pluginId: 'test',
      routes: { root, other },
      externalRoutes: { home: original },
      extensions: [page('root', '/root'), page('other', '/other')],
    });
    const module = createFrontendModule({
      pluginId: 'test',
      externalRoutes: { home: replacement },
    });
    const features = [app, plugin, module];
    const defaults = createSpecializedApp({ features }).apis.get(
      routeResolutionApiRef,
    )!;
    for (const ref of [original, replacement]) {
      expect(defaults.resolve(ref)?.()).toBe('/other');
    }
    const configured = createSpecializedApp({
      features,
      config: new ConfigReader({
        app: { routes: { bindings: { 'test.home': 'test.root' } } },
      }),
    }).apis.get(routeResolutionApiRef)!;
    expect(configured.resolve(original)?.()).toBe('/root');
    const explicit = createSpecializedApp({
      features,
      bindRoutes({ bind }) {
        bind({ home: original }, { home: root });
      },
    }).apis.get(routeResolutionApiRef)!;
    expect(explicit.resolve(original)?.()).toBe('/root');
    expect(explicit.resolve(replacement)?.()).toBe('/root');
    for (const boundRef of [original, replacement]) {
      const disabled = createSpecializedApp({
        features,
        bindRoutes({ bind }) {
          bind({ home: boundRef }, { home: false });
        },
      }).apis.get(routeResolutionApiRef)!;
      expect(disabled.resolve(original)).toBeUndefined();
      expect(disabled.resolve(replacement)).toBeUndefined();
    }
    for (const defaultTarget of [undefined, 'missing.root']) {
      const unbound = createExternalRouteRef({ defaultTarget });
      const resolution = createSpecializedApp({
        features: [
          app,
          plugin,
          createFrontendModule({
            pluginId: 'test',
            externalRoutes: { home: unbound },
          }),
        ],
      }).apis.get(routeResolutionApiRef)!;
      expect(resolution.resolve(original)).toBeUndefined();
      expect(resolution.resolve(unbound)).toBeUndefined();
    }
  }
});

it('validates external override bindings against all registered callers', () => {
  const target = createRouteRef({
    extensionId: 'page:test/item',
    params: ['id'],
  });
  for (const params of [[], ['name']] as const) {
    const original = createExternalRouteRef({ params: [...params] });
    const replacement = createExternalRouteRef({
      params: ['id'],
      defaultTarget: 'test.item',
    });
    const features = [
      app,
      createFrontendPlugin({
        pluginId: 'test',
        routes: { item: target },
        externalRoutes: { item: original },
        extensions: [page('item', '/items/:id')],
      }),
      createFrontendModule({
        pluginId: 'test',
        externalRoutes: { item: replacement },
      }),
    ];
    expect(createSpecializedApp({ features }).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringMatching(
            /does not provide the parameters required/,
          ),
        }),
      ]),
    );
  }
});

it('requires complete ancestor parameters regardless of source location', () => {
  const ref = createRouteRef({
    extensionId: 'page:test/details',
    params: ['org'],
  });
  const scoped = createRouteRef({ extensionId: 'page:test/scoped' });
  // @ts-expect-error Simulate refs from before extension targets were introduced
  const legacyParent = createRouteRef({ params: ['org'] });
  // @ts-expect-error Simulate refs from before extension targets were introduced
  const legacyChild = createRouteRef();
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    routes: { details: ref, scoped },
    extensions: [
      page('org', '/orgs/:org', { ref: legacyParent }),
      page('details', 'details', { parent: 'page:test/org' }),
      page('scoped', 'scoped', { parent: 'page:test/org', ref: legacyChild }),
    ],
  });
  const result = createSpecializedApp({ features: [app, plugin] });
  expect(result.errors).toEqual([
    expect.objectContaining({
      code: 'ROUTE_PARAMETERS_INVALID',
      context: expect.objectContaining({
        extensionId: 'page:test/scoped',
        expectedParams: ['org'],
        actualParams: [],
      }),
    }),
  ]);
  const routes = result.apis.get(routeResolutionApiRef)!;
  expect(routes.resolve(ref)?.({ org: 'one' })).toBe('/orgs/one/details');
  expect(
    routes.resolve(
      { ...ref },
      { sourcePath: '/orgs/old/details' },
    )?.({ org: 'new' }),
  ).toBe('/orgs/new/details');
  expect(
    routes.resolve(createSubRouteRef({ parent: ref, path: '/:tab' }))?.({
      org: 'one',
      tab: 'edit',
    }),
  ).toBe('/orgs/one/details/edit');
  expect(
    routes.resolve(scoped, { sourcePath: '/orgs/one/details' }),
  ).toBeUndefined();
  expect(routes.resolve(scoped)).toBeUndefined();
  expect(
    routes.resolve(legacyChild, { sourcePath: '/orgs/one/details' })?.(),
  ).toBe('/orgs/one/scoped');
  expect(() => routes.resolve(legacyChild)).toThrow('has parameters');
});

it('links to wildcard-mounted pages without a wildcard parameter', () => {
  const root = createRouteRef({ extensionId: 'page:test/files' });
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    routes: { root },
    extensions: [page('files', '/files/*')],
  });
  const resolution = createSpecializedApp({
    features: [app, plugin],
  }).apis.get(routeResolutionApiRef)!;
  expect(resolution.resolve(root)?.()).toBe('/files');
});

it('validates and resolves repeated parameter names', () => {
  const ref = createRouteRef({
    extensionId: 'page:test/compare',
    params: ['id'],
  });
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    routes: { compare: ref },
    extensions: [page('compare', '/items/:id/compare/:id')],
  });
  const routes = createSpecializedApp({ features: [app, plugin] }).apis.get(
    routeResolutionApiRef,
  )!;
  expect(routes.resolve(ref)?.({ id: 'one' })).toBe('/items/one/compare/one');
  expect(routes.resolve({ ...ref })?.({ id: 'two' })).toBe(
    '/items/two/compare/two',
  );
});

it('allows optional mounted parameters without relaxing reference contracts', () => {
  const omitted = createRouteRef({ extensionId: 'page:test/items' });
  const supplied = createRouteRef({
    extensionId: 'page:test/items',
    params: ['id'],
  });
  const links = [omitted, supplied].map(ref => {
    const plugin = createFrontendPlugin({
      pluginId: 'test',
      routes: { items: ref },
      extensions: [page('items', '/items/:id?')],
    });
    const routes = createSpecializedApp({ features: [app, plugin] }).apis.get(
      routeResolutionApiRef,
    )!;
    return ref === omitted
      ? routes.resolve(omitted)?.()
      : routes.resolve(supplied)?.({ id: 'one' });
  });
  expect(links).toEqual(['/items', '/items/one']);
  for (const path of ['/items/:id', '/items/:id?/compare/:id']) {
    expect(
      createSpecializedApp({
        features: [
          app,
          createFrontendPlugin({
            pluginId: 'test',
            routes: { items: omitted },
            extensions: [page('items', path)],
          }),
        ],
      }).errors,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringMatching(/mounted path requires \[id\]/),
        }),
      ]),
    );
  }
  expect(
    createSpecializedApp({
      features: [
        app,
        createFrontendPlugin({
          pluginId: 'test',
          routes: { omitted, supplied },
          extensions: [page('items', '/items/:id?')],
        }),
      ],
    }).errors,
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        message: expect.stringMatching(/Conflicting route parameter contracts/),
      }),
    ]),
  );
});

it('resolves optional ancestors and repeated ancestor parameters', () => {
  const optional = createRouteRef({
    extensionId: 'page:test/optional-details',
  });
  const repeated = createRouteRef({
    extensionId: 'page:test/repeated-details',
    params: ['id', 'org'],
  });
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    routes: { optional, repeated },
    extensions: [
      page('optional', '/orgs/:org?'),
      page('optional-details', 'details', { parent: 'page:test/optional' }),
      page('repeated', '/items/:id'),
      page('middle', 'orgs/:org', { parent: 'page:test/repeated' }),
      page('repeated-details', 'details/:id', { parent: 'page:test/middle' }),
    ],
  });
  const routes = createSpecializedApp({ features: [app, plugin] }).apis.get(
    routeResolutionApiRef,
  )!;
  expect(routes.resolve(optional)?.()).toBe('/orgs/details');
  expect(
    routes.resolve(optional, { sourcePath: '/orgs/one/details' })?.(),
  ).toBe('/orgs/details');
  expect(routes.resolve(repeated)?.({ id: 'one', org: 'two' })).toBe(
    '/items/one/orgs/two/details/one',
  );
  expect(
    routes.resolve(repeated, {
      sourcePath: '/items/old/orgs/old/details/old',
    })?.({ id: 'new', org: 'new-org' }),
  ).toBe('/items/new/orgs/new-org/details/new');
});

it('reports invalid routes without breaking valid links or reviving overridden routes', () => {
  const good = createRouteRef({ extensionId: 'page:test/good' });
  const missing = createRouteRef({ extensionId: 'page:test/missing' });
  const nonRoutable = createRouteRef({ extensionId: 'test/utility' });
  const mismatch = createRouteRef({ extensionId: 'page:test/mismatch' });
  const original = createRouteRef({ extensionId: 'page:test/original' });
  // @ts-expect-error Historical reference uses aliasFor instead of extensionId
  const alias = createRouteRef({ aliasFor: 'test.original' });
  const overriddenExternal = createExternalRouteRef({
    defaultTarget: 'test.original',
  });
  const sub = createSubRouteRef({ parent: good, path: '/:id' });
  const replacement = createRouteRef({
    extensionId: 'page:test/replacement',
    params: ['id'],
  });
  const ambiguous = createRouteRef({ extensionId: 'page:test/ambiguous' });
  const external = createExternalRouteRef({
    defaultTarget: 'test.replacement',
  });
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    routes: {
      good,
      missing,
      nonRoutable,
      mismatch,
      original,
      alias,
      sub,
      replacement,
      ambiguous,
    },
    externalRoutes: { external, overriddenExternal },
    extensions: [
      page('good', '/good'),
      page('mismatch', '/mismatch/:id'),
      page('original', '/original'),
      page('replacement', '/replacement/:id'),
      page('first', '/first', { ref: ambiguous }),
      page('second', '/second', { ref: ambiguous }),
      createExtension({
        name: 'utility',
        attachTo: { id: 'app/root', input: 'children' },
        output: [coreExtensionData.reactElement],
        factory: () => [coreExtensionData.reactElement(<div />)],
      }),
    ],
  });
  const result = createSpecializedApp({
    features: [
      app,
      plugin,
      createFrontendModule({
        pluginId: 'test',
        routes: { original: replacement, sub: replacement },
      }),
    ],
  });
  expect(result.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        code: 'ROUTE_NOT_FOUND',
        context: expect.objectContaining({ extensionId: 'page:test/missing' }),
      }),
      expect.objectContaining({
        code: 'ROUTE_TARGET_INVALID',
        context: expect.objectContaining({ extensionId: 'test/utility' }),
      }),
      expect.objectContaining({
        code: 'ROUTE_PARAMETERS_INVALID',
        context: expect.objectContaining({
          expectedParams: ['id'],
          actualParams: [],
        }),
      }),
      expect.objectContaining({
        code: 'ROUTE_OVERRIDE_INVALID',
        context: { pluginId: 'test', routeId: 'test.sub' },
      }),
      expect.objectContaining({
        code: 'ROUTE_MOUNT_CONFLICT',
        context: {
          extensionId: 'page:test/ambiguous',
          mountExtensionIds: ['page:test/first', 'page:test/second'],
        },
      }),
    ]),
  );
  const routes = result.apis.get(routeResolutionApiRef)!;
  expect(routes.resolve(good)?.()).toBe('/good');
  expect(routes.resolve(replacement)?.({ id: 'one' })).toBe('/replacement/one');
  for (const ref of [
    missing,
    nonRoutable,
    mismatch,
    original,
    alias,
    overriddenExternal,
    sub,
    ambiguous,
    external,
  ]) {
    expect(routes.resolve(ref)).toBeUndefined();
    expect(routes.resolve({ ...ref })).toBeUndefined();
  }
});
