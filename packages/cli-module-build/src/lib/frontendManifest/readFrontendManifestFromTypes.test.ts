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
import { readFrontendManifestFromTypes } from './readFrontendManifestFromTypes';

const mockDir = createMockDirectory();

const API = `import("@backstage/frontend-plugin-api")`;
const PAGE = '"@backstage/frontend-plugin-api#PageBlueprint"';
const SUB_PAGE = '"@backstage/frontend-plugin-api#SubPageBlueprint"';
const API_BLUEPRINT = '"@backstage/frontend-plugin-api#ApiBlueprint"';

const extension = (
  kind: string,
  name: string,
  literals: { [key: string]: string },
) => `${API}.OverridableExtensionDefinition<{
  kind: "${kind}";
  name: ${name};
  literals: {
    ${Object.entries({
      blueprint: 'undefined',
      params: '{}',
      paramKeys: 'never',
      paramsCallback: 'undefined',
      attachTo: 'undefined',
      disabled: 'undefined',
      if: 'undefined',
      ...literals,
    })
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n')}
  };
}>`;

const routeRef = (id?: string) =>
  `${API}.RouteRef<undefined>${id ? ` & { readonly I: "${id}"; }` : ''}`;

const plugin = (
  extensions: { [id: string]: string },
  literals: { [key: string]: string } = {},
  routes: { [name: string]: string } = { root: routeRef() },
) => `
  declare const _default: ${API}.OverridableFrontendPlugin<{
    ${Object.entries(routes)
      .map(([name, type]) => `${name}: ${type};`)
      .join('\n')}
  }, {
    ext: ${API}.ExternalRouteRef<undefined>;
  }, {
    ${Object.entries(extensions)
      .map(([id, type]) => `"${id}": ${type};`)
      .join('\n')}
  }, {
    ${Object.entries({
      pluginId: '"demo"',
      title: 'undefined',
      if: 'undefined',
      extensionIds: `[${Object.keys(extensions)
        .map(id => `"${id}"`)
        .join(', ')}]`,
      ...literals,
    })
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n')}
  }>;
  export default _default;
`;

const page = (literals: { [key: string]: string } = {}) =>
  extension('page', 'undefined', {
    blueprint: PAGE,
    params: '{ path: "/demo" }',
    paramKeys: '"path" | "loader"',
    ...literals,
  });

describe('readFrontendManifestFromTypes', () => {
  const read = (content: string) => {
    mockDir.setContent({ 'index.d.ts': content });
    return readFrontendManifestFromTypes({
      entryPoint: mockDir.resolve('index.d.ts'),
    });
  };
  const reason = (content: string) => {
    const result = read(content);
    return 'manifest' in result
      ? result.manifest.notDeferrableReason
      : `skipped: ${result.skipped}`;
  };

  it('should read a manifest from the type declarations of a plugin', () => {
    mockDir.setContent({
      'index.d.ts': `export { default } from './plugin';`,
      'plugin.d.ts': plugin(
        {
          'sub-page:demo/tab': extension('sub-page', '"tab"', {
            blueprint: SUB_PAGE,
            params:
              '{ path: "tab"; title: "Tab"; routeRef: { id: "demo.root" } }',
            paramKeys: '"path" | "title" | "loader" | "routeRef"',
            disabled: 'true',
          }),
          'page:demo': page({
            params: '{ path: "/demo"; title: "Demo" }',
            paramKeys: '"path" | "title" | "noHeader"',
          }),
          'api:demo': extension('api', 'undefined', {
            blueprint: API_BLUEPRINT,
            params: 'undefined',
            paramKeys: 'undefined',
            paramsCallback:
              '{ apiRefId: "plugin.demo"; apiIsPromise: true; deps: { discovery: "core.discovery" } }',
          }),
        },
        { title: '"Demo"' },
        { root: routeRef('demo.root') },
      ),
    });
    expect(
      readFrontendManifestFromTypes({
        entryPoint: mockDir.resolve('index.d.ts'),
      }),
    ).toEqual({
      manifest: {
        manifestVersion: 1,
        type: 'plugin',
        pluginId: 'demo',
        title: 'Demo',
        deferrable: true,
        routes: ['root'],
        externalRoutes: ['ext'],
        extensions: [
          {
            id: 'sub-page:demo/tab',
            kind: 'sub-page',
            attachTo: { id: 'page:demo', input: 'pages' },
            disabled: true,
            element: {
              data: { 'core.routing.path': 'tab', 'core.title': 'Tab' },
              routeRefName: 'root',
              configOutputs: {
                path: { dataRefId: 'core.routing.path', type: 'string' },
                title: { dataRefId: 'core.title', type: 'string' },
              },
            },
          },
          {
            id: 'page:demo',
            kind: 'page',
            attachTo: { id: 'app/routes', input: 'routes' },
            disabled: false,
            page: { path: '/demo', title: 'Demo' },
          },
          {
            id: 'api:demo',
            kind: 'api',
            attachTo: { id: 'root', input: 'apis' },
            disabled: false,
            api: {
              apiRefId: 'plugin.demo',
              deps: { discovery: 'core.discovery' },
            },
          },
        ],
      },
    });
  });

  it('should match route refs with the plugin routes by their IDs', () => {
    const routes = {
      root: routeRef('demo.root'),
      other: routeRef('demo.other'),
      untyped: routeRef(),
    };
    const manifestOf = (
      extensions: { [id: string]: string },
      pluginRoutes: { [name: string]: string } = routes,
    ) => {
      const result = read(plugin(extensions, {}, pluginRoutes));
      if (!('manifest' in result)) {
        throw new Error(result.skipped);
      }
      return result.manifest;
    };
    const withRef = (ref: string | undefined) =>
      page({
        params: ref
          ? `{ path: "/demo"; routeRef: { id: "${ref}" } }`
          : '{ path: "/demo" }',
        paramKeys: '"path" | "routeRef"',
      });
    const subPage = (ref: string | undefined) =>
      extension('sub-page', '"tab"', {
        blueprint: SUB_PAGE,
        params: ref
          ? `{ path: "tab"; title: "Tab"; routeRef: { id: "${ref}" } }`
          : '{ path: "tab"; title: "Tab" }',
        paramKeys: '"path" | "title" | "routeRef" | "loader"',
      });

    const matched = manifestOf({
      'page:demo': withRef('demo.other'),
      'sub-page:demo/tab': subPage('demo.root'),
    });
    expect(matched.deferrable).toBe(true);
    expect(matched.routes).toEqual(['root', 'other', 'untyped']);
    expect(matched.extensions[0].page?.routeRefName).toBe('other');
    expect(matched.extensions[1].element?.routeRefName).toBe('root');

    // A page without a route ref ID is assumed to use the root route
    expect(
      manifestOf({ 'page:demo': withRef(undefined) }).extensions[0].page,
    ).toEqual({ path: '/demo', routeRefName: 'root' });
    // A page with a route ref that is not a plugin route is deferrable
    expect(
      manifestOf({ 'page:demo': withRef('demo.unknown') }).extensions[0].page,
    ).toEqual({ path: '/demo' });
    expect(
      manifestOf({ 'page:demo': withRef(undefined) }, { other: routeRef('a') })
        .extensions[0].page,
    ).toEqual({ path: '/demo' });
    // Pages without a route ref param have no route either
    expect(manifestOf({ 'page:demo': page() }).extensions[0].page).toEqual({
      path: '/demo',
    });

    // Sub-pages must have a route ref that is a plugin route
    expect(
      manifestOf({ 'sub-page:demo/tab': subPage('demo.unknown') })
        .notDeferrableReason,
    ).toBe('the route ref of the extension is not one of the plugin routes');
    expect(
      manifestOf({ 'sub-page:demo/tab': subPage(undefined) })
        .notDeferrableReason,
    ).toBe(
      "the route ref of the extension has no ID, so it can't be matched with the plugin routes",
    );
    expect(
      manifestOf(
        { 'page:demo': withRef('demo.root') },
        { root: routeRef('demo.root'), same: routeRef('demo.root') },
      ).notDeferrableReason,
    ).toBe(
      "the route ref ID 'demo.root' is used by more than one plugin route",
    );
  });

  it('should record why a plugin can not be deferred', () => {
    const one = (ext: string) => plugin({ 'page:demo': ext });

    // Params that are passed but can't be read
    expect(reason(one(page({ params: '{}' })))).toBe(
      "the 'path' param is not a string literal",
    );
    expect(reason(one(page({ paramKeys: '"path" | "icon"' })))).toBe(
      "the 'icon' param of the 'PageBlueprint' blueprint is not supported for deferred loading",
    );
    expect(
      reason(
        one(
          page({ params: '{ path: "/demo" }', paramKeys: '"path" | "title"' }),
        ),
      ),
    ).toBe("the 'title' param is not a string literal");
    expect(reason(one(page({ paramKeys: '"loader"', params: '{}' })))).toBe(
      "the extension has no 'path' param",
    );
    expect(reason(one(page({ paramKeys: 'string' })))).toBe(
      "the type 'string' is not a literal",
    );

    // Blueprint identity
    expect(reason(one(page({ blueprint: 'undefined' })))).toBe(
      'the extension is not made with a blueprint that is supported for deferred loading',
    );
    expect(
      reason(one(page({ blueprint: '"@acme/plugin#PageBlueprint"' }))),
    ).toBe(
      'the extension is not made with a blueprint that is supported for deferred loading',
    );
    expect(
      reason(
        one(
          `${API}.OverridableExtensionDefinition<{ kind: "page"; name: undefined }>`,
        ),
      ),
    ).toBe(
      "the extension 'page:demo' has no recorded literals, so it is not made with the make method of a blueprint",
    );

    // Options
    expect(reason(one(page({ if: '{ featureFlag: "x" }' })))).toBe(
      "the extension uses an 'if' predicate",
    );
    expect(reason(one(page({ if: 'FilterPredicate' })))).toBe(
      "the 'if' predicate is not a literal",
    );
    expect(reason(one(page({ disabled: 'boolean' })))).toBe(
      'the disabled option is not a literal',
    );
    expect(reason(one(page({ attachTo: 'unknown' })))).toBe(
      'the attachment point is not a literal',
    );
    expect(
      reason(one(page({ attachTo: '{ id: "page:other"; input: "pages" }' }))),
    ).toBe("the page is not attached to app/routes, so it can't be deferred");
    expect(
      reason(
        plugin({
          'api:demo': extension('api', 'undefined', {
            blueprint: API_BLUEPRINT,
            paramsCallback: 'unknown',
          }),
        }),
      ),
    ).toBe('the API params is not a literal');
    expect(
      reason(
        plugin({
          'api:demo': extension('api', 'undefined', {
            blueprint: API_BLUEPRINT,
            paramsCallback:
              '{ apiRefId: "plugin.demo"; apiIsPromise: false; deps: {} }',
          }),
        }),
      ),
    ).toBe(
      "the API ref 'plugin.demo' must be declared as a promise, as in createApiRef<Promise<MyApi>>(), since a deferred plugin provides its APIs as promises until it is loaded",
    );

    // Plugin literals
    expect(reason(plugin({ 'page:demo': page() }, { if: '{ a: "b" }' }))).toBe(
      "the plugin uses an 'if' predicate",
    );
    expect(reason(plugin({ 'page:demo': page() }, { title: 'string' }))).toBe(
      'skipped: the plugin title is not a literal',
    );
    expect(
      reason(plugin({ 'page:demo': page() }, { extensionIds: 'never[]' })),
    ).toBe('skipped: the order of the plugin extensions is not known');
    expect(
      reason(`
        declare const _default: ${API}.OverridableFrontendModule<'demo'>;
        export default _default;
      `),
    ).toBe(
      'skipped: the entry point is a module, and modules are never deferred',
    );
    expect(
      reason(`
        declare const _default: ${API}.OverridableFrontendPlugin<{}, {}, {}>;
        export default _default;
      `),
    ).toBe(
      'skipped: the default export has no recorded literals, so it is not created with createFrontendPlugin',
    );
  });

  it('should follow relative imports and re-exports to the default export', () => {
    const declaration = plugin({ 'page:demo': page() });
    const readEntry = (files: { [name: string]: string }) => {
      mockDir.setContent({ 'index.d.ts': '', ...files });
      return readFrontendManifestFromTypes({
        entryPoint: mockDir.resolve('index.d.ts'),
      });
    };
    const pluginId = (result: ReturnType<typeof readEntry>) =>
      'manifest' in result ? result.manifest.pluginId : result.skipped;

    // Renamed and star re-exports, and folders with an index file
    expect(
      pluginId(
        readEntry({
          'index.d.ts': `export { demo as default } from './lib';`,
          'lib/index.d.ts': `export * from '../plugin.js';`,
          'plugin.d.ts': declaration.replace(
            'declare const _default',
            'export declare const demo',
          ),
        }),
      ),
    ).toBe('demo');

    // Default imports and local default exports
    expect(
      pluginId(
        readEntry({
          'index.d.ts': `import demo from './plugin';\nexport default demo;`,
          'plugin.d.ts': declaration,
        }),
      ),
    ).toBe('demo');
    expect(
      pluginId(
        readEntry({
          'index.d.ts': `import { demo as renamed } from './plugin';\nexport { renamed as default };`,
          'plugin.d.ts': declaration.replace(
            'declare const _default',
            'export declare const demo',
          ),
        }),
      ),
    ).toBe('demo');

    // Reasons for skipping an entry point
    expect(
      pluginId(
        readEntry({
          'index.d.ts': `export { default } from '@acme/plugin';`,
        }),
      ),
    ).toBe(
      "the default export comes from '@acme/plugin', but only relative imports are followed",
    );
    expect(
      pluginId(
        readEntry({
          'index.d.ts': `export { default } from './other';`,
          'other.d.ts': `export { default } from './index';`,
        }),
      ),
    ).toBe("the export 'default' is circular");
    expect(pluginId(readEntry({ 'index.d.ts': `export const a = 1;` }))).toBe(
      'the entry point has no default export with a type',
    );
  });

  it('should fail if a declaration file is missing', () => {
    mockDir.setContent({ 'other.d.ts': '' });
    expect(() =>
      readFrontendManifestFromTypes({
        entryPoint: mockDir.resolve('index.d.ts'),
      }),
    ).toThrow(
      `No declaration file found at ${mockDir.resolve(
        'index.d.ts',
      )}, be sure to run yarn tsc to generate .d.ts files before packaging`,
    );

    mockDir.setContent({ 'index.d.ts': `export { default } from './plugin';` });
    expect(() =>
      readFrontendManifestFromTypes({
        entryPoint: mockDir.resolve('index.d.ts'),
      }),
    ).toThrow(
      `Unable to find the declaration file for './plugin', which is imported from ${mockDir.resolve(
        'index.d.ts',
      )}`,
    );
  });
});
