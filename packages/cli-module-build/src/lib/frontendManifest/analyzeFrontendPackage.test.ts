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

  it('should read pages made with makeWithOverrides that only pass params', () => {
    const result = analyze(
      {
        'src/index.tsx': `
        import { createFrontendPlugin, createRouteRef, PageBlueprint } from ${API};
        import { z } from 'zod';
        const rootRouteRef = createRouteRef();
        const PATH = '/overridden';
        const page = PageBlueprint.makeWithOverrides({
          name: 'main',
          configSchema: { filter: z.string().optional() },
          factory(originalFactory, { config }) {
            return originalFactory({
              path: PATH,
              title: 'Overridden',
              routeRef: rootRouteRef,
              icon: <span />,
              loader: async () => <div>{config.filter}</div>,
            });
          },
        });
        const arrowPage = PageBlueprint.makeWithOverrides({
          name: 'arrow',
          factory: orig => orig({ path: '/arrow', loader: async () => null }),
        });
        export default createFrontendPlugin({
          pluginId: 'demo',
          routes: { root: rootRouteRef },
          extensions: [page, arrowPage],
        });
      `,
      },
      [{ mount: '.', path: 'src/index.tsx' }],
    );
    expect(result.entryPoints['.']).toMatchObject({
      manifest: {
        deferrable: true,
        extensions: [
          {
            id: 'page:demo/main',
            page: {
              path: '/overridden',
              title: 'Overridden',
              routeRefName: 'root',
            },
          },
          { id: 'page:demo/arrow', page: { path: '/arrow' } },
        ],
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
          `SubPageBlueprint.makeWithOverrides({ factory: orig => orig({ path: 'x', title: 'X' }) })`,
          `import { SubPageBlueprint } from ${API};`,
        ),
      ),
    ).toBe(
      `the extension is created with 'SubPageBlueprint.makeWithOverrides', but only 'SubPageBlueprint.make' can be deferred (src/index.ts:7)`,
    );
    // A page made with makeWithOverrides must only pass literal params to
    // the original factory
    const overrides = (options: string) =>
      reasonOf(plugin(`PageBlueprint.makeWithOverrides({ ${options} })`));
    expect(
      overrides(
        `factory(orig, { config }) { const p = '/'; return orig({ path: p, loader: async () => null }); }`,
      ),
    ).toBe(
      'the factory must only return orig(params), with no other statements or arguments (src/index.ts:7)',
    );
    expect(
      overrides(
        `factory: (orig, { config }) => orig({ path: config.path, loader: async () => null })`,
      ),
    ).toBe(`'config' is not a constant value (src/index.ts:7)`);
    expect(
      overrides(
        `inputs: {}, factory: orig => orig({ path: '/', loader: async () => null })`,
      ),
    ).toBe("the extension option 'inputs' is not supported (src/index.ts:7)");
    expect(overrides(`*factory(orig) { yield* orig({ path: '/' }); }`)).toBe(
      'the factory must return the result of originalFactory, not yield it (src/index.ts:7)',
    );
    expect(
      overrides(
        `factory: orig => orig({ path: '/', loader: async () => null }, {})`,
      ),
    ).toBe(
      'the factory must only return orig(params), with no other statements or arguments (src/index.ts:7)',
    );
    expect(
      reasonOf(
        plugin(
          `createExtension({ attachTo: { id: 'app', input: 'root' }, output: [], factory: () => [] })`,
        ),
      ),
    ).toBe(
      `the extension is created with 'createExtension', but only extensions made with PageBlueprint, SubPageBlueprint can be deferred (src/index.ts:7)`,
    );
    // Entity cards output a filter function, which can't be stored
    expect(
      reasonOf(
        plugin(
          `EntityCardBlueprint.make({ params: { loader: async () => null } })`,
        ),
      ),
    ).toBe(
      `the extension is created with 'EntityCardBlueprint.make', but only extensions made with PageBlueprint, SubPageBlueprint can be deferred (src/index.ts:7)`,
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

  it('should never defer plugins with APIs', () => {
    const files = {
      'src/index.ts': `
        import { createFrontendPlugin } from ${API};
        import { api, page } from './extensions';
        export default createFrontendPlugin({
          pluginId: 'demo',
          extensions: [page, api],
        });
      `,
      'src/extensions.tsx': `
        import { ApiBlueprint, PageBlueprint } from ${API};
        export const api = ApiBlueprint.make({
          name: 'client',
          params: define => define({ api: x, deps: {}, factory: () => ({}) }),
        });
        export const page = PageBlueprint.make({
          params: { path: '/demo', loader: async () => <div /> },
        });
      `,
    };
    const reason =
      'the plugin provides an API, and plugins that provide APIs are loaded with the app (src/extensions.tsx:3)';

    expect(analyze(files).entryPoints['.']).toMatchObject({
      manifest: { deferrable: false, notDeferrableReason: reason },
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
        './other': {
          skipped: "'plugin' can't be resolved (src/other.ts:3)",
        },
      },
    });
  });
});
