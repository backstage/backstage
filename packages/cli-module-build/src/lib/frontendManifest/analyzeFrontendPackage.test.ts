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

    const output = (id: string, reason: string) =>
      `the '${id}' output of the extension can't be read without running it: ${reason}`;
    expect(
      reasonOf(
        plugin(
          `PageBlueprint.make({ params: { path, loader: async () => null } })`,
          `let path = '/demo';`,
        ),
      ),
    ).toBe(
      output(
        'core.routing.path',
        `'path' must be declared with const (src/index.ts:7)`,
      ),
    );
    expect(
      reasonOf(
        plugin(
          `PageBlueprint.make({ params: { path: getPath(), loader: async () => null } })`,
        ),
      ),
    ).toBe(
      output(
        'core.routing.path',
        `the 'path' param is not a literal value (src/index.ts:7)`,
      ),
    );
    // Params that the factory outputs must be literals, while params that
    // it only uses for the element can be anything
    expect(
      reasonOf(
        plugin(
          `SubPageBlueprint.make({ params: { path: 'x', title: 'X', icon: getIcon(), loader: async () => null } })`,
          `import { SubPageBlueprint } from ${API};`,
        ),
      ),
    ).toBe(
      output(
        'core.icon',
        `the 'icon' param is not a literal value (src/index.ts:7)`,
      ),
    );
    // A page made with makeWithOverrides must only pass params to the
    // original factory
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
    ).toBe(
      output(
        'core.routing.path',
        `'config' is not a constant value (src/index.ts:7)`,
      ),
    );
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
      `the extension is created with 'createExtension', but only extensions made with the make or makeWithOverrides method of a blueprint can be deferred (src/index.ts:7)`,
    );
    // Function and predicate filters are turned into functions, which can't
    // be stored
    expect(
      reasonOf(
        plugin(
          `EntityCardBlueprint.make({ params: { filter: () => true, loader: async () => null } })`,
        ),
      ),
    ).toBe(
      output(
        'catalog.entity-filter-function',
        `the 'filter' param is not a literal value (src/index.ts:7)`,
      ),
    );
    expect(
      reasonOf(
        plugin(
          `EntityCardBlueprint.make({ params: { filter: { kind: 'component' }, loader: async () => null } })`,
        ),
      ),
    ).toBe(
      output(
        'catalog.entity-filter-function',
        `the result of calling 'filterPredicateToFilterFunction' (@backstage/plugin-catalog-react/src/alpha/blueprints/resolveEntityFilterData.ts:52)`,
      ),
    );
    expect(
      reasonOf(
        plugin(
          `MissingBlueprint.make({ params: {} })`,
          `import { MissingBlueprint } from '@internal/missing';`,
        ),
      ),
    ).toBe(
      `the 'MissingBlueprint' blueprint is imported from '@internal/missing', which can't be resolved (src/index.ts:7)`,
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
          `PageBlueprint.make({ attachTo: [{ id: 'page:a', input: 'pages' }, { id: 'page:b', input: 'pages' }], params: { path: '/', loader: async () => null } })`,
        ),
      ),
    ).toBe(`the extension 'page:demo' attaches to more than one extension`);
    expect(reasonOf(plugin(''))).toBe('the plugin has no extensions');
  });

  it('should read entity cards and APIs', () => {
    const result = analyze(
      {
        'src/index.tsx': `
        import { createFrontendPlugin } from ${API};
        import { api, card, configuredCard, content } from './extensions';
        export default createFrontendPlugin({
          pluginId: 'demo',
          extensions: [card, configuredCard, content, api],
        });
      `,
        'src/api.ts': `
        import { createApiRef } from ${API};
        export const demoApiRef = createApiRef<{}>().with({ id: 'plugin.demo.client' });
      `,
        'src/extensions.tsx': `
        import { ApiBlueprint, discoveryApiRef } from ${API};
        import {
          EntityCardBlueprint,
          EntityContentBlueprint,
        } from '@backstage/plugin-catalog-react/alpha';
        import { z } from 'zod';
        import { demoApiRef } from './api';
        export const api = ApiBlueprint.make({
          name: 'client',
          params: define =>
            define({
              api: demoApiRef,
              deps: { discovery: discoveryApiRef },
              factory: () => ({}),
            }),
        });
        export const card = EntityCardBlueprint.make({
          params: {
            filter: 'kind:component',
            type: 'info',
            loader: () => import('./Card').then(m => <m.Card />),
          },
        });
        export const content = EntityContentBlueprint.make({
          params: {
            path: 'demo',
            title: 'Demo',
            group: 'development',
            loader: () => import('./Content').then(m => <m.Content />),
          },
        });
        export const configuredCard = EntityCardBlueprint.makeWithOverrides({
          name: 'configured',
          configSchema: { height: z.number().optional() },
          factory(originalFactory, { config }) {
            return originalFactory({
              loader: async () => <div>{config.height}</div>,
            });
          },
        });
      `,
      },
      [{ mount: '.', path: 'src/index.tsx' }],
    );

    const configOutputs = {
      filter: { dataRefId: 'catalog.entity-filter-expression', type: 'string' },
      type: { dataRefId: 'catalog.entity-card-type', type: 'string' },
    };
    expect(result.entryPoints['.']).toEqual({
      manifest: expect.objectContaining({
        deferrable: true,
        extensions: [
          {
            id: 'entity-card:demo',
            kind: 'entity-card',
            attachTo: { id: 'entity-content:catalog/overview', input: 'cards' },
            disabled: false,
            element: {
              data: {
                'catalog.entity-filter-expression': 'kind:component',
                'catalog.entity-card-type': 'info',
              },
              configOutputs,
            },
          },
          {
            id: 'entity-card:demo/configured',
            kind: 'entity-card',
            attachTo: { id: 'entity-content:catalog/overview', input: 'cards' },
            disabled: false,
            element: { data: {}, configOutputs, loadedConfig: ['height'] },
          },
          // The outputs of entity content are found from its factory as well
          {
            id: 'entity-content:demo',
            kind: 'entity-content',
            attachTo: { id: 'page:catalog/entity', input: 'contents' },
            disabled: false,
            element: {
              data: {
                'core.routing.path': 'demo',
                'catalog.entity-content-title': 'Demo',
                'catalog.entity-content-group': 'development',
              },
              configOutputs: {
                path: { dataRefId: 'core.routing.path', type: 'string' },
                title: {
                  dataRefId: 'catalog.entity-content-title',
                  type: 'string',
                },
                filter: configOutputs.filter,
                group: {
                  dataRefId: 'catalog.entity-content-group',
                  type: 'string',
                },
                icon: {
                  dataRefId: 'catalog.entity-content-icon',
                  type: 'string',
                },
              },
            },
          },
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
        ],
      }),
    });
  });

  it('should find the outputs of extensions from the factory of their blueprint', () => {
    const files = (extensions: string) => ({
      'src/index.ts': `
        import { createFrontendPlugin } from ${API};
        import { WidgetBlueprint, LoopBlueprint } from './blueprints';
        export default createFrontendPlugin({
          pluginId: 'demo',
          extensions: [${extensions}],
        });
      `,
      'src/blueprints.ts': `
        import {
          coreExtensionData,
          createExtensionBlueprint,
          createExtensionDataRef,
        } from ${API};
        import { z } from 'zod';

        const labelDataRef = createExtensionDataRef<string>().with({ id: 'demo.label' });
        const sizeDataRef = createExtensionDataRef<number>().with({ id: 'demo.size' });

        function* labelData(value: unknown, config: { label?: string }) {
          if (typeof config.label === 'string') {
            yield labelDataRef(config.label);
          } else if (typeof value === 'string') {
            yield labelDataRef(value);
          }
        }

        export const WidgetBlueprint = createExtensionBlueprint({
          kind: 'widget',
          attachTo: { id: 'app/root', input: 'widgets' },
          output: [coreExtensionData.reactElement, labelDataRef, sizeDataRef],
          configSchema: {
            label: z.string().optional(),
            size: z.number().optional(),
            mode: z.string().optional(),
            extra: z.string().optional(),
          },
          *factory(
            params: { label?: string; size?: number; render: () => unknown },
            { config, node },
          ) {
            console.log('creating', node.spec.id);
            yield coreExtensionData.reactElement(params.render(node, config.extra));
            yield* labelData(params.label, config);
            const size = config.size ?? params.size;
            const mode = config.mode ?? 'full';
            if (size !== undefined && mode === 'full') {
              yield sizeDataRef(size);
            }
          },
        });

        export const LoopBlueprint = createExtensionBlueprint({
          kind: 'loop',
          attachTo: { id: 'app/root', input: 'widgets' },
          output: [coreExtensionData.reactElement],
          *factory(params: { items: string[] }) {
            for (const item of params.items) {
              yield coreExtensionData.reactElement(item);
            }
          },
        });
      `,
    });

    const widget = analyze(
      files(
        `WidgetBlueprint.make({ params: { label: 'Hello', size: 2, render: () => null } })`,
      ),
    ).entryPoints['.'];
    expect(widget).toMatchObject({
      manifest: {
        deferrable: true,
        extensions: [
          {
            id: 'widget:demo',
            element: {
              data: { 'demo.label': 'Hello', 'demo.size': 2 },
              // The size is a number without config, so number config is
              // applied by the stand-in. The mode isn't mapped, since a
              // comparison with its value can't be evaluated, so config for
              // it loads the plugin when the app starts.
              configOutputs: {
                label: { dataRefId: 'demo.label', type: 'string' },
                size: { dataRefId: 'demo.size', type: 'number' },
              },
              loadedConfig: ['extra'],
            },
          },
        ],
      },
    });

    const loop = analyze(
      files(`LoopBlueprint.make({ params: { items: ['a'] } })`),
    ).entryPoints['.'];
    expect(loop).toMatchObject({
      manifest: {
        deferrable: false,
        notDeferrableReason:
          "the factory of the 'LoopBlueprint' blueprint can't be read for the extension: the factory runs a statement that cannot be read (src/blueprints.ts:50)",
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
        './other': {
          skipped: "'plugin' can't be resolved (src/other.ts:3)",
        },
      },
    });
  });
});
