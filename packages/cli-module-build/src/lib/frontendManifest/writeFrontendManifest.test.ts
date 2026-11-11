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
import { writeFrontendManifest } from './writeFrontendManifest';
import { readPackageManifest } from './readPackageManifest';

describe('writeFrontendManifest', () => {
  const mockDir = createMockDirectory();

  const packageJson = {
    name: '@test/plugin-demo',
    version: '1.0.0',
    backstage: { role: 'frontend-plugin' as const },
    exports: {
      '.': './src/index.ts',
      './package.json': './package.json',
    },
  };
  const plugin = (extensions: string) => `
    import { createFrontendPlugin, PageBlueprint } from '@backstage/frontend-plugin-api';
    export const page = PageBlueprint.make({ params: { path: '/demo', loader: async () => null } });
    export default createFrontendPlugin({ pluginId: 'demo', extensions: [${extensions}] });
  `;

  it('should write a manifest that can be read back', async () => {
    mockDir.setContent({ 'src/index.ts': plugin('page') });

    await writeFrontendManifest(mockDir.path, packageJson);
    const written = await readPackageManifest(mockDir.path, {
      ...packageJson,
      backstage: {
        ...packageJson.backstage,
        frontendManifest: 'dist/frontend-manifest.json',
      } as typeof packageJson.backstage,
    });
    expect(written).toMatchObject({
      entryPoints: {
        '.': {
          manifest: {
            pluginId: 'demo',
            deferrable: true,
            extensions: [{ id: 'page:demo', page: { path: '/demo' } }],
          },
        },
      },
    });

    // Packages other than plugins and modules get no manifest
    mockDir.clear();
    await writeFrontendManifest(mockDir.path, {
      ...packageJson,
      backstage: { role: 'web-library' },
    });
    expect(mockDir.content()).toEqual({});
  });
});
