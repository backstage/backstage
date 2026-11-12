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

describe('writeBackstageManifest', () => {
  const mockDir = createMockDirectory();

  it('should write the manifests of the exposed plugins and modules', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: '@internal/demo',
        backstage: { role: 'frontend-plugin' },
      }),
      'src/index.ts': `
        import { createFrontendPlugin, PageBlueprint } from '@backstage/frontend-plugin-api';
        export const page = PageBlueprint.make({ params: { path: '/demo', loader: async () => null } });
        export default createFrontendPlugin({ pluginId: 'demo', extensions: [page] });
      `,
      'src/alpha.ts': `
        import { createFrontendModule } from '@backstage/frontend-plugin-api';
        export default createFrontendModule({ pluginId: 'other', extensions: [] });
      `,
      'src/utils.ts': `export const notAFeature = 1;`,
      // The blueprint is read from the installed package
      'node_modules/@backstage/frontend-plugin-api/package.json':
        JSON.stringify({
          name: '@backstage/frontend-plugin-api',
          main: 'index.js',
        }),
      'node_modules/@backstage/frontend-plugin-api/index.js': `
        import { createExtensionBlueprint } from './wiring.js';
        const routePath = createExtensionDataRef().with({ id: 'core.routing.path' });
        const reactElement = createExtensionDataRef().with({ id: 'core.reactElement' });
        export const PageBlueprint = createExtensionBlueprint({
          kind: 'page',
          attachTo: { id: 'app/routes', input: 'routes' },
          *factory(params, { config }) {
            yield routePath(config.path ?? params.path);
            yield reactElement(params.loader);
          },
        });
      `,
    });

    await writeBackstageManifest({
      packageDir: mockDir.path,
      distDir: mockDir.resolve('dist'),
      exposes: {
        '.': 'src/index.ts',
        './alpha': 'src/alpha.ts',
        './utils': 'src/utils.ts',
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
          './alpha': {
            pluginId: 'other',
            type: 'module',
            deferrable: false,
            notDeferrableReason: 'modules are never deferred',
          },
        },
      },
    });
    expect(Object.keys(written.frontend.exposedModules)).toEqual([
      '.',
      './alpha',
    ]);
  });
});
