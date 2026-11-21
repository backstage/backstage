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
import fs from 'fs-extra';
import { writeBackstageManifest } from './writeBackstageManifest';

const API = `import("@backstage/frontend-plugin-api")`;

describe('writeBackstageManifest', () => {
  const mockDir = createMockDirectory();

  const declaration = `
    declare const _default: ${API}.OverridableFrontendPlugin<{}, {}, {
      "page:demo": ${API}.OverridableExtensionDefinition<{
        kind: "page";
        name: undefined;
        literals: {
          blueprint: "@backstage/frontend-plugin-api#PageBlueprint";
          params: { path: "/demo" };
          paramKeys: "path" | "loader";
          paramsCallback: undefined;
          attachTo: undefined;
          disabled: undefined;
          if: undefined;
        };
      }>;
    }, {
      pluginId: "demo";
      title: undefined;
      if: undefined;
      extensionIds: ["page:demo"];
    }>;
    export default _default;
  `;

  it('should write the manifests of the exposed plugins from the declarations', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: '@internal/demo',
        backstage: { role: 'frontend-plugin' },
      }),
      'types/src/index.d.ts': declaration,
      // Modules and files that aren't plugins are not described
      'types/src/alpha.d.ts': `
        declare const _default: ${API}.OverridableFrontendModule<'other'>;
        export default _default;
      `,
      'types/src/utils.d.ts': `export declare const notAFeature = 1;`,
    });

    await writeBackstageManifest({
      packageDir: mockDir.path,
      distDir: mockDir.resolve('dist'),
      declarationsDir: mockDir.resolve('types'),
      exposes: {
        '.': 'src/index.ts',
        './alpha': mockDir.resolve('src/alpha.tsx'),
        './utils': 'src/utils.ts',
        './styles': 'src/styles.css',
      },
    });

    const written = await fs.readJson(
      mockDir.resolve('dist/backstage-manifest.json'),
    );
    expect(written).toMatchObject({
      manifestVersion: 1,
      packageName: '@internal/demo',
      role: 'frontend-plugin',
      frontend: {
        exposedModules: {
          '.': {
            pluginId: 'demo',
            type: 'plugin',
            deferrable: true,
            extensions: [{ id: 'page:demo', page: { path: '/demo' } }],
          },
        },
      },
    });
    expect(Object.keys(written.frontend.exposedModules)).toEqual(['.']);
  });

  it('should fail if the declarations have not been emitted', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: '@internal/demo',
        backstage: { role: 'frontend-plugin' },
      }),
    });

    await expect(
      writeBackstageManifest({
        packageDir: mockDir.path,
        distDir: mockDir.resolve('dist'),
        declarationsDir: mockDir.resolve('types'),
        exposes: { '.': 'src/index.ts' },
      }),
    ).rejects.toThrow(
      `No declaration file found at ${mockDir.resolve(
        'types/src/index.d.ts',
      )}, be sure to run yarn tsc to generate .d.ts files before packaging`,
    );
  });
});
