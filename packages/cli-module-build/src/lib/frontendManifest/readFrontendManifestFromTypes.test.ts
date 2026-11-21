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

import { existsSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { analyzeFrontendPackage } from './analyzeFrontendPackage';
import { readFrontendManifestFromTypes } from './readFrontendManifestFromTypes';

const mockDir = createMockDirectory();
const repoRoot = resolvePath(__dirname, '../../../../..');

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

const plugin = (
  extensions: { [id: string]: string },
  literals: { [key: string]: string } = {},
) => `
  declare const _default: ${API}.OverridableFrontendPlugin<{
    root: ${API}.RouteRef<undefined>;
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
            params: '{ path: "tab"; title: "Tab" }',
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

  it('should reject what the analyzer rejects', () => {
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
        declare const _default: ${API}.OverridableFrontendPlugin<{}, {}, {}>;
        export default _default;
      `),
    ).toBe(
      'skipped: the default export has no recorded literals, so it is not created with createFrontendPlugin',
    );
  });

  // Needs the declarations that `yarn tsc` emits to dist-types
  const hasTypes = existsSync(
    resolvePath(repoRoot, 'dist-types/plugins/lazy-scorecard/src/index.d.ts'),
  );
  it('should match the analyzer for the demo plugins, except for route refs', () => {
    if (!hasTypes) {
      return;
    }
    for (const id of ['lazy-demo', 'lazy-package-demo', 'lazy-scorecard']) {
      const fromTypes = readFrontendManifestFromTypes({
        entryPoint: resolvePath(
          repoRoot,
          `dist-types/plugins/${id}/src/index.d.ts`,
        ),
      });
      const fromSource = analyzeFrontendPackage({
        packageDir: resolvePath(repoRoot, 'plugins', id),
        entryPoints: [{ mount: '.', path: 'src/index.ts' }],
      }).entryPoints['.'];
      if (!('manifest' in fromTypes) || !('manifest' in fromSource)) {
        throw new Error(`Unexpected skipped entry for ${id}`);
      }
      // Which plugin route a route ref is can't be read from the types
      const strip = (m: typeof fromSource.manifest) => ({
        ...m,
        extensions: m.extensions.map(e => ({
          ...e,
          page: e.page && { ...e.page, routeRefName: undefined },
          element: e.element && { ...e.element, routeRefName: undefined },
        })),
      });
      expect(JSON.parse(JSON.stringify(strip(fromTypes.manifest)))).toEqual(
        JSON.parse(JSON.stringify(strip(fromSource.manifest))),
      );
    }
  });
});
