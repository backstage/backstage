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

import { resolve as resolvePath } from 'node:path';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { analyzeFrontendPackage } from './analyzeFrontendPackage';

const mockDir = createMockDirectory();

const repoRoot = resolvePath(__dirname, '../../../../..');

// The blueprints are read from the source of the real packages
const modules: { [specifier: string]: string } = {
  '@backstage/frontend-plugin-api': resolvePath(
    repoRoot,
    'packages/frontend-plugin-api/src/index.ts',
  ),
  '@backstage/plugin-catalog-react/alpha': resolvePath(
    repoRoot,
    'plugins/catalog-react/src/alpha/index.ts',
  ),
};

function analyze(
  files: { [path: string]: string },
  entryPoints: Array<{ mount: string; path: string }> = [
    { mount: '.', path: 'src/index.ts' },
  ],
) {
  mockDir.setContent(files);
  return analyzeFrontendPackage({
    packageDir: mockDir.path,
    entryPoints,
    resolveModule: specifier => modules[specifier],
  });
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
                  configOutputs: {
                    path: { dataRefId: 'core.routing.path', type: 'string' },
                    title: { dataRefId: 'core.title', type: 'string' },
                  },
                },
              },
            ],
          },
        },
      },
    });
  });

  it('should not defer pages made with makeWithOverrides', () => {
    const result = analyze({
      'src/index.ts': `
        import { createFrontendPlugin, PageBlueprint } from ${API};
        const page = PageBlueprint.makeWithOverrides({
          name: 'main',
          factory(originalFactory) {
            return originalFactory({ path: '/overridden', loader: async () => null });
          },
        });
        export default createFrontendPlugin({ pluginId: 'demo', extensions: [page] });
      `,
    });
    expect(result.entryPoints['.']).toMatchObject({
      manifest: { deferrable: false, extensions: [] },
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
          `PageBlueprint.make({ params: { path: '/', title: { ref: 'a', key: 'b' }, loader: async () => null } })`,
        ),
      ),
    ).toBe(`the 'title' param must be a string (src/index.ts:7)`);
    // Params that become outputs that the stand-in can't provide
    expect(
      reasonOf(
        plugin(
          `SubPageBlueprint.make({ params: { path: 'x', title: 'X', icon: getIcon(), loader: async () => null } })`,
          `import { SubPageBlueprint } from ${API};`,
        ),
      ),
    ).toBe(
      `the 'icon' param of the 'SubPageBlueprint' blueprint is not supported for deferred loading (src/index.ts:7)`,
    );
    expect(
      reasonOf(
        plugin(
          `SubPageBlueprint.make({ params: { path: 'x', title: 'X' } })`,
          `import { SubPageBlueprint } from ${API};`,
        ),
      ),
    ).toBe(`the extension has no 'loader' param (src/index.ts:7)`);
    expect(
      reasonOf(
        plugin(
          `PageBlueprint.make({ attachTo: { id: 'page:other', input: 'pages' }, params: { path: '/', loader: async () => null } })`,
        ),
      ),
    ).toBe(
      `the page is not attached to app/routes, so it can't be deferred (src/index.ts:7)`,
    );
    // Overriding the factory of a blueprint can change its outputs
    expect(
      reasonOf(
        plugin(
          `PageBlueprint.makeWithOverrides({ factory: orig => orig({ path: '/', loader: async () => null }) })`,
        ),
      ),
    ).toBe(
      `the extension is created with 'PageBlueprint.makeWithOverrides', but only extensions made with the make method of a blueprint can be deferred (src/index.ts:7)`,
    );
    expect(
      reasonOf(
        plugin(
          `createExtension({ attachTo: { id: 'app', input: 'root' }, output: [], factory: () => [] })`,
        ),
      ),
    ).toBe(
      `the extension is created with 'createExtension', but only extensions made with the make method of a blueprint can be deferred (src/index.ts:7)`,
    );
    expect(
      reasonOf(
        plugin(
          `EntityCardBlueprint.make({ params: { filter: 'kind:component', loader: async () => null } })`,
        ),
      ),
    ).toBe(
      `the 'EntityCardBlueprint' blueprint is not supported for deferred loading (src/index.ts:7)`,
    );
    expect(
      reasonOf(
        plugin(
          `MissingBlueprint.make({ params: {} })`,
          `import { MissingBlueprint } from '@internal/missing';`,
        ),
      ),
    ).toBe(
      `the 'MissingBlueprint' blueprint is not supported for deferred loading (src/index.ts:7)`,
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
          `SubPageBlueprint.make({ attachTo: [{ id: 'page:a', input: 'pages' }, { id: 'page:b', input: 'pages' }], params: { path: 'x', title: 'X', loader: async () => null } })`,
          `import { SubPageBlueprint } from ${API};`,
        ),
      ),
    ).toBe(`the extension 'sub-page:demo' attaches to more than one extension`);
    expect(reasonOf(plugin(''))).toBe('the plugin has no extensions');
  });

  it('should read APIs and not defer extensions made with other blueprints', () => {
    const files = (extension: string, apiType = 'Promise<{}>') => ({
      'src/index.ts': `
        import {
          ApiBlueprint,
          PageBlueprint,
          createApiRef,
          createExtensionBlueprint,
          createFrontendPlugin,
          discoveryApiRef,
        } from ${API};
        import { EntityCardBlueprint } from '@backstage/plugin-catalog-react/alpha';
        const demoApiRef = createApiRef<${apiType}>().with({ id: 'plugin.demo.client' });
        const WidgetBlueprint = createExtensionBlueprint({
          kind: 'widget',
          attachTo: { id: 'app/root', input: 'widgets' },
          output: [],
          *factory() {},
        });
        const api = ApiBlueprint.make({
          name: 'client',
          params: define =>
            define({
              api: demoApiRef,
              deps: { discovery: discoveryApiRef },
              factory: async () => ({}),
            }),
        });
        export default createFrontendPlugin({
          pluginId: 'demo',
          extensions: [api, ${extension}],
        });
      `,
    });

    expect(
      analyze(
        files(
          `PageBlueprint.make({ params: { path: '/', loader: async () => null } })`,
        ),
      ).entryPoints['.'],
    ).toMatchObject({
      manifest: {
        deferrable: true,
        extensions: [
          {
            id: 'api:demo/client',
            kind: 'api',
            attachTo: { id: 'root', input: 'apis' },
            disabled: false,
            api: {
              apiRefId: 'plugin.demo.client',
              deps: { discovery: 'core.discovery' },
            },
          },
          { id: 'page:demo', page: { path: '/' } },
        ],
      },
    });

    // The stand-in of an API provides it as a promise, so the ref must be
    // declared as one
    const page = `PageBlueprint.make({ params: { path: '/', loader: async () => null } })`;
    expect(
      analyze(files(page, 'PromiseLike<{}>')).entryPoints['.'],
    ).toMatchObject({ manifest: { deferrable: true } });
    for (const apiType of ['{}', 'Promise<{}> | {}', 'LazyApi']) {
      expect(analyze(files(page, apiType)).entryPoints['.']).toMatchObject({
        manifest: {
          deferrable: false,
          notDeferrableReason:
            "the API ref 'plugin.demo.client' must be declared as a promise, as in createApiRef<Promise<MyApi>>(), since a deferred plugin provides its APIs as promises until it is loaded (src/index.ts:22)",
        },
      });
    }

    // Blueprints from other packages and the blueprints of the plugin itself
    // are not read, since their outputs can't be known without running them
    for (const [extension, name] of [
      [
        `EntityCardBlueprint.make({ params: { filter: 'kind:component', loader: async () => null } })`,
        'EntityCardBlueprint',
      ],
      [`WidgetBlueprint.make({ params: {} })`, 'WidgetBlueprint'],
    ]) {
      expect(analyze(files(extension)).entryPoints['.']).toMatchObject({
        manifest: {
          deferrable: false,
          notDeferrableReason: `the '${name}' blueprint is not supported for deferred loading (src/index.ts:29)`,
        },
      });
    }
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
