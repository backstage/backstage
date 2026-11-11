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
import { writeFrontendManifest } from './writeFrontendManifest';

describe('writeFrontendManifest', () => {
  const mockDir = createMockDirectory();

  it('should write the manifests of the exposed plugins and modules', async () => {
    mockDir.setContent({
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
    });

    await writeFrontendManifest({
      packageDir: mockDir.path,
      distDir: mockDir.resolve('dist'),
      exposes: {
        '.': 'src/index.ts',
        './alpha': 'src/alpha.ts',
        './utils': 'src/utils.ts',
      },
    });

    const written = await fs.readJson(
      mockDir.resolve('dist/frontend-manifest.json'),
    );
    expect(written).toMatchObject({
      manifestVersion: 1,
      entryPoints: {
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
    });
    expect(Object.keys(written.entryPoints)).toEqual(['.', './alpha']);
  });
});
