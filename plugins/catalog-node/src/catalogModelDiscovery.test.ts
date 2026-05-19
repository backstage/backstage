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

import fs from 'fs-extra';
import { resolve as resolvePath, join } from 'node:path';
import os from 'node:os';
import { discoverCatalogModelLayers } from './catalogModelDiscovery';

describe('discoverCatalogModelLayers', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(join(os.tmpdir(), 'catalog-model-discovery-'));
  });

  afterEach(async () => {
    // Clean up require cache for our test fixtures
    for (const key of Object.keys(require.cache)) {
      if (key.startsWith(tmpDir)) {
        delete require.cache[key];
      }
    }
    await fs.remove(tmpDir);
  });

  function writePackage(
    name: string,
    opts: {
      role?: string;
      defaultExport?: object;
    },
  ) {
    const pkgDir = resolvePath(tmpDir, 'node_modules', name);
    fs.mkdirpSync(pkgDir);
    fs.writeJsonSync(resolvePath(pkgDir, 'package.json'), {
      name,
      main: 'index.js',
      ...(opts.role ? { backstage: { role: opts.role } } : {}),
    });
    if (opts.defaultExport !== undefined) {
      fs.writeFileSync(
        resolvePath(pkgDir, 'index.js'),
        `Object.defineProperty(exports, "__esModule", { value: true });\nexports.default = ${JSON.stringify(
          opts.defaultExport,
        )};`,
      );
    }
  }

  function writeRootPackage(dependencies: Record<string, string>) {
    fs.writeJsonSync(resolvePath(tmpDir, 'package.json'), {
      name: 'test-app',
      dependencies,
    });
  }

  it('discovers packages with the catalog-model-layer role', () => {
    writeRootPackage({
      'my-layer': '1.0.0',
      'some-plugin': '1.0.0',
    });

    writePackage('my-layer', {
      role: 'catalog-model-layer',
      defaultExport: {
        $$type: '@backstage/CatalogModelLayer',
        layerId: 'test/my-layer',
      },
    });

    writePackage('some-plugin', {
      role: 'backend-plugin',
      defaultExport: {
        $$type: '@backstage/BackendFeature',
      },
    });

    const result = discoverCatalogModelLayers({ packageDir: tmpDir });

    expect(result.layers).toHaveLength(1);
    expect(result.layers[0]).toEqual(
      expect.objectContaining({
        $$type: '@backstage/CatalogModelLayer',
        layerId: 'test/my-layer',
      }),
    );
    expect(result.warnings).toHaveLength(0);
  });

  it('warns when a catalog-model-layer package has a wrong default export', () => {
    writeRootPackage({ 'bad-layer': '1.0.0' });

    writePackage('bad-layer', {
      role: 'catalog-model-layer',
      defaultExport: { not: 'a-layer' },
    });

    const result = discoverCatalogModelLayers({ packageDir: tmpDir });

    expect(result.layers).toHaveLength(0);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].package).toBe('bad-layer');
  });

  it('ignores packages without the catalog-model-layer role', () => {
    writeRootPackage({
      'regular-lib': '1.0.0',
      'backend-mod': '1.0.0',
    });

    writePackage('regular-lib', {
      role: 'common-library',
      defaultExport: {},
    });

    writePackage('backend-mod', {
      role: 'backend-plugin-module',
      defaultExport: {},
    });

    const result = discoverCatalogModelLayers({ packageDir: tmpDir });

    expect(result.layers).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  it('returns empty results when there are no dependencies', () => {
    writeRootPackage({});

    const result = discoverCatalogModelLayers({ packageDir: tmpDir });

    expect(result.layers).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });
});
