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
import { OpaqueRouteRef } from '@internal/frontend';
import { ConfigReader } from '@backstage/config';
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
    if?: false;
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
  const child = createRouteRef({ extensionId: 'page:test/child' });
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
  expect(routes.resolve(child, { sourcePath: '/test/one' })?.()).toBe(
    '/test/one/child',
  );
  expect(() => routes.resolve(child)).toThrow('has parameters');
  expect(
    routes.resolve(createRouteRef({ extensionId: 'page:test/root' }))?.(),
  ).toBe('/test');
  expect(() =>
    routes.resolve(createRouteRef({ extensionId: 'page:test/detail' })),
  ).toThrow('parameters');
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
  expect(() => createSpecializedApp({ features: [app, plugin] })).toThrow(
    'unknown extension',
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
    extensions: [page('root', '/test', { if: false })],
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
  expect(() =>
    createSpecializedApp({ features: [app, plugin, nonRoutable] }),
  ).toThrow('non-routable');
  const conflict = createRouteRef({
    extensionId: 'page:test/root',
    params: ['id'],
  });
  const conflictingPlugin = createFrontendPlugin({
    pluginId: 'test',
    routes: { ref, conflict },
    extensions: [page('root', '/test')],
  });
  expect(() =>
    createSpecializedApp({ features: [app, conflictingPlugin] }),
  ).toThrow('Conflicting route parameter contracts');
  const mismatch = createFrontendPlugin({
    pluginId: 'test',
    routes: { ref },
    extensions: [page('root', '/:id')],
  });
  expect(() => createSpecializedApp({ features: [app, mismatch] })).toThrow(
    'parameters',
  );
});

it('uses deprecated mounts only when the structural target is absent', () => {
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
    withTarget(page('target', '/native/:id', { disabled: true })).resolve(copy),
  ).toBeUndefined();
  expect(
    withTarget(page('target', '/native/:id', { if: false })).resolve(copy),
  ).toBeUndefined();

  const duplicates = plugin.withOverrides({
    extensions: [page('second', '/other/:id', { ref: copy })],
  });
  expect(() => createSpecializedApp({ features: [app, duplicates] })).toThrow(
    'Ambiguous deprecated route mounts',
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
  expect(() =>
    createSpecializedApp({ features: [app, plugin, high, low] }),
  ).toThrow(/Conflicting route overrides 'test.oldName' and 'test.newName'/);
  expect(() =>
    createSpecializedApp({
      features: [
        app,
        plugin,
        createFrontendModule({
          pluginId: 'test',
          routes: { oldName: b, other: a },
        }),
      ],
    }),
  ).toThrow(/Route redirect cycle/);
  expect(() =>
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
    }),
  ).toThrow(/incompatible parameters/);
});

it('redirects individual sub routes without redirecting their parent or siblings', () => {
  const root = createRouteRef({ extensionId: 'page:test/root' });
  const detail = createSubRouteRef({ parent: root, path: '/:id' });
  const sibling = createSubRouteRef({ parent: root, path: '/sibling' });
  const target = createRouteRef({
    extensionId: 'page:test/detail',
    params: ['id'],
  });
  const plugin = createFrontendPlugin({
    pluginId: 'test',
    routes: { root, detail, sibling },
    extensions: [page('root', '/root'), page('detail', '/detail/:id')],
  });
  const module = createFrontendModule({
    pluginId: 'test',
    routes: { detail: target },
  });
  const routes = createSpecializedApp({
    features: [app, plugin, module],
  }).apis.get(routeResolutionApiRef)!;
  expect(routes.resolve(root)?.()).toBe('/root');
  expect(routes.resolve(sibling)?.()).toBe('/root/sibling');
  expect(routes.resolve(detail)?.({ id: 'one' })).toBe('/detail/one');
  const copy = createSubRouteRef({
    parent: createRouteRef({ extensionId: 'page:test/root' }),
    path: '/:id',
  });
  expect(routes.resolve(copy)?.({ id: 'two' })).toBe('/detail/two');
});
