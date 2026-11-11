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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { analyzeFrontendPackage } from './analyzeFrontendPackage';

const mockDir = createMockDirectory();

function analyze(
  files: { [path: string]: string },
  entryPoints: Array<{ mount: string; path: string }> = [
    { mount: '.', path: 'src/index.ts' },
  ],
) {
  mockDir.setContent(files);
  return analyzeFrontendPackage({ packageDir: mockDir.path, entryPoints });
}

const API = `'@backstage/frontend-plugin-api'`;

describe('analyzeFrontendPackage', () => {
  it('should create a manifest for a plugin with pages and sub-pages', () => {
    const result = analyze({
      'src/index.ts': `export { plugin as default } from './plugin';`,
      'src/paths.ts': `
        export const paths = { root: '/demo', settings: 'settings' } as const;
        const base = 'Demo';
        export const title = \`\${base} plugin\`;
      `,
      'src/routes.ts': `
        import { createRouteRef } from ${API};
        export const rootRouteRef = createRouteRef();
        export const settingsRouteRef = createRouteRef();
      `,
      'src/plugin.tsx': `
        import * as api from ${API};
        import { createFrontendPlugin, PageBlueprint } from ${API};
        import { paths, title } from './paths';
        import { rootRouteRef, settingsRouteRef } from './routes';

        const page = PageBlueprint.make({
          params: {
            path: paths.root,
            title,
            routeRef: rootRouteRef,
            icon: <span />,
            loader: () => import('./Page').then(m => <m.Page />),
          },
        });
        const settings = api.SubPageBlueprint.make({
          name: 'settings',
          params: {
            path: paths.settings,
            title: 'Settings',
            routeRef: settingsRouteRef,
            loader: async () => <div />,
          },
        });

        export const plugin = createFrontendPlugin({
          pluginId: 'demo',
          title: 'Demo',
          icon: <span />,
          routes: { root: rootRouteRef, settings: settingsRouteRef },
          extensions: [page, settings],
        });
      `,
    });

    expect(result).toEqual({
      entryPoints: {
        '.': {
          manifest: {
            manifestVersion: 1,
            type: 'plugin',
            pluginId: 'demo',
            title: 'Demo',
            deferrable: true,
            routes: ['root', 'settings'],
            externalRoutes: [],
            extensions: [
              {
                id: 'page:demo',
                kind: 'page',
                attachTo: { id: 'app/routes', input: 'routes' },
                disabled: false,
                page: {
                  path: '/demo',
                  title: 'Demo plugin',
                  routeRefName: 'root',
                },
              },
              {
                id: 'sub-page:demo/settings',
                kind: 'sub-page',
                attachTo: { id: 'page:demo', input: 'pages' },
                disabled: false,
                element: {
                  data: {
                    'core.routing.path': 'settings',
                    'core.title': 'Settings',
                  },
                  routeRefName: 'settings',
                },
              },
            ],
          },
        },
      },
    });
  });

  it('should fail closed with the location of values it can not read', () => {
    const plugin = (extension: string, extra = '') => ({
      'src/index.ts': `
        import { createFrontendPlugin, PageBlueprint, createExtension } from ${API};
        import { EntityCardBlueprint } from '@backstage/plugin-catalog-react/alpha';
        ${extra}
        export default createFrontendPlugin({
          pluginId: 'demo',
          extensions: [${extension}],
        });
      `,
    });
    const reasonOf = (files: { [path: string]: string }) => {
      const entry = analyze(files).entryPoints['.'];
      if (!('manifest' in entry)) {
        throw new Error(`Unexpected skipped entry, ${entry.skipped}`);
      }
      expect(entry.manifest.deferrable).toBe(false);
      return entry.manifest.notDeferrableReason;
    };

    expect(
      reasonOf(
        plugin(
          `PageBlueprint.make({ params: { path, loader: async () => null } })`,
          `let path = '/demo';`,
        ),
      ),
    ).toBe(`'path' must be declared with const (src/index.ts:7)`);
    expect(
      reasonOf(
        plugin(
          `PageBlueprint.make({ params: { path: getPath(), loader: async () => null } })`,
        ),
      ),
    ).toBe(`the 'path' param is not a literal value (src/index.ts:7)`);
    expect(
      reasonOf(
        plugin(
          `PageBlueprint.makeWithOverrides({ factory: orig => orig({ path: '/' }) })`,
        ),
      ),
    ).toBe(
      `the extension is created with 'PageBlueprint.makeWithOverrides', but only 'PageBlueprint.make' can be deferred (src/index.ts:7)`,
    );
    expect(
      reasonOf(
        plugin(
          `createExtension({ attachTo: { id: 'app', input: 'root' }, output: [], factory: () => [] })`,
        ),
      ),
    ).toBe(
      `the extension is created with 'createExtension', but only extensions made with PageBlueprint, SubPageBlueprint, ApiBlueprint can be deferred (src/index.ts:7)`,
    );
    // Entity cards output a filter function, which can't be stored
    expect(
      reasonOf(
        plugin(
          `EntityCardBlueprint.make({ params: { loader: async () => null } })`,
        ),
      ),
    ).toBe(
      `the extension is created with 'EntityCardBlueprint.make', but only extensions made with PageBlueprint, SubPageBlueprint, ApiBlueprint can be deferred (src/index.ts:7)`,
    );
    expect(
      reasonOf(
        plugin(
          `PageBlueprint.make({ if: { featureFlag: 'x' }, params: { path: '/', loader: async () => null } })`,
        ),
      ),
    ).toBe(`the extension uses an 'if' predicate (src/index.ts:7)`);
    expect(
      reasonOf(
        plugin(
          `PageBlueprint.make({ attachTo: { id: 'page:other', input: 'pages' }, params: { path: '/', loader: async () => null } })`,
        ),
      ),
    ).toBe(`the page 'page:demo' does not attach to app/routes`);
    expect(reasonOf(plugin(''))).toBe('the plugin has no extensions');
  });

  it('should only defer plugins with APIs that have a sync entry point', () => {
    const files = {
      'src/index.ts': `
        import { createFrontendPlugin } from ${API};
        import { api, page } from './extensions';
        import { rootRouteRef } from './routes';
        export default createFrontendPlugin({
          pluginId: 'demo',
          routes: { root: rootRouteRef },
          extensions: [api, page],
        });
      `,
      'src/sync.ts': `
        import { createFrontendPlugin } from ${API};
        import { api } from './extensions';
        import { rootRouteRef } from './routes';
        export default createFrontendPlugin({
          pluginId: 'demo',
          routes: { root: rootRouteRef },
          extensions: [api],
        });
      `,
      'src/routes.ts': `
        import { createRouteRef } from ${API};
        export const rootRouteRef = createRouteRef();
      `,
      'src/extensions.tsx': `
        import { ApiBlueprint, PageBlueprint } from ${API};
        import { rootRouteRef } from './routes';
        export const api = ApiBlueprint.make({
          name: 'client',
          params: define => define({ api: x, deps: {}, factory: () => ({}) }),
        });
        export const page = PageBlueprint.make({
          params: { path: '/demo', routeRef: rootRouteRef, loader: async () => <div /> },
        });
      `,
    };

    const withoutSync = analyze(files).entryPoints['.'];
    expect(withoutSync).toMatchObject({
      manifest: {
        deferrable: false,
        notDeferrableReason:
          "the plugin provides the API 'api:demo/client', and only plugins with a ./sync entry point can defer their APIs",
      },
    });

    const entryPoints = [
      { mount: '.', path: 'src/index.ts' },
      { mount: './sync', path: 'src/sync.ts' },
    ];
    const withSync = analyze(files, entryPoints);
    expect(withSync.syncError).toBeUndefined();
    expect(withSync.entryPoints['.']).toMatchObject({
      manifest: {
        deferrable: true,
        extensions: [
          { id: 'api:demo/client', kind: 'api', sync: true },
          { id: 'page:demo', page: { path: '/demo', routeRefName: 'root' } },
        ],
      },
    });

    // The sync entry point must not declare its own extensions or routes
    const redeclared = analyze(
      {
        ...files,
        'src/sync.ts': `
          import { createFrontendPlugin, createRouteRef } from ${API};
          import { api } from './extensions';
          export default createFrontendPlugin({
            pluginId: 'demo',
            routes: { root: createRouteRef() },
            extensions: [api],
          });
        `,
      },
      entryPoints,
    );
    expect(redeclared.syncError).toBe(
      "the 'root' route ref in routes of the sync entry point is not the same declaration as in the main entry point",
    );
    const inline = analyze(
      {
        ...files,
        'src/sync.ts': `
          import { createFrontendPlugin, ApiBlueprint } from ${API};
          export default createFrontendPlugin({
            pluginId: 'demo',
            extensions: [ApiBlueprint.make({ name: 'client', params: d => d({}) })],
          });
        `,
      },
      entryPoints,
    );
    expect(inline.syncError).toMatch(
      /^each extension of the sync entry point must be a declaration that the main entry point uses as well.* \(src\/sync.ts:5\)$/,
    );
  });

  it('should read the IDs of sync extensions made with any blueprint', () => {
    const result = analyze(
      {
        'node_modules/@test/blueprints/package.json': JSON.stringify({
          name: '@test/blueprints',
          types: 'index.d.ts',
        }),
        'node_modules/@test/blueprints/index.d.ts': `
          import { ExtensionBlueprint } from ${API};
          export declare const CardBlueprint: ExtensionBlueprint<{
            kind: 'card';
            params: {};
          }>;
        `,
        'src/blueprints.ts': `
          import { createExtensionBlueprint } from ${API};
          export const WidgetBlueprint = createExtensionBlueprint({
            kind: 'widget',
            attachTo: { id: 'home', input: 'widgets' },
            output: [],
            factory: () => [],
          });
        `,
        'src/extensions.tsx': `
          import { CardBlueprint } from '@test/blueprints';
          import { PageBlueprint } from ${API};
          import { WidgetBlueprint } from './blueprints';
          export const card = CardBlueprint.makeWithOverrides({
            name: 'overview',
            factory(originalFactory) {
              return originalFactory({});
            },
          });
          export const widget = WidgetBlueprint.make({ params: {} });
          export const page = PageBlueprint.make({
            params: { path: '/demo', loader: async () => <div /> },
          });
        `,
        'src/index.ts': `
          import { createFrontendPlugin } from ${API};
          import { card, page, widget } from './extensions';
          export default createFrontendPlugin({
            pluginId: 'demo',
            extensions: [card, widget, page],
          });
        `,
        'src/sync.ts': `
          import { createFrontendPlugin } from ${API};
          import { card, widget } from './extensions';
          export default createFrontendPlugin({
            pluginId: 'demo',
            extensions: [card, widget],
          });
        `,
      },
      [
        { mount: '.', path: 'src/index.ts' },
        { mount: './sync', path: 'src/sync.ts' },
      ],
    );
    expect(result.syncError).toBeUndefined();
    expect(result.entryPoints['.']).toMatchObject({
      manifest: {
        deferrable: true,
        extensions: [
          { id: 'card:demo/overview', kind: 'card', sync: true },
          { id: 'widget:demo', kind: 'widget', sync: true },
          { id: 'page:demo', kind: 'page' },
        ],
      },
    });
  });

  it('should skip entry points without a plugin and never defer modules', () => {
    const result = analyze(
      {
        'src/index.ts': `export const notAPlugin = 1;`,
        'src/alpha.ts': `
          import { createFrontendModule } from ${API};
          export default createFrontendModule({ pluginId: 'catalog', extensions: [] });
        `,
        'src/other.ts': `
          import { plugin } from './legacy';
          export default plugin.withOverrides({ extensions: [] });
        `,
      },
      [
        { mount: '.', path: 'src/index.ts' },
        { mount: './alpha', path: 'src/alpha.ts' },
        { mount: './other', path: 'src/other.ts' },
      ],
    );
    expect(result).toEqual({
      entryPoints: {
        '.': { skipped: 'the entry point has no default export' },
        './alpha': {
          manifest: {
            manifestVersion: 1,
            type: 'module',
            pluginId: 'catalog',
            deferrable: false,
            notDeferrableReason: 'modules are never deferred',
            routes: [],
            externalRoutes: [],
            extensions: [],
          },
        },
      },
    });
  });
});
