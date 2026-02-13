/*
 * Copyright 2024 The Backstage Authors
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

import * as fs from 'node:fs';
import * as path from 'node:path';

export interface DiscoveredModule {
  packageName: string;
  catalogModelPath: string;
}

/**
 * Scans installed packages for ./catalog-model exports.
 * Looks at package.json exports field for a "./catalog-model" entry.
 */
export function scanForCatalogModelExports(
  rootDir: string,
): DiscoveredModule[] {
  const discovered: DiscoveredModule[] = [];

  const searchDirs = [
    path.join(rootDir, 'plugins'),
    path.join(rootDir, 'packages'),
    path.join(rootDir, 'node_modules', '@backstage'),
    path.join(rootDir, 'node_modules', '@internal'),
  ];

  for (const searchDir of searchDirs) {
    if (!fs.existsSync(searchDir)) {
      continue;
    }

    const entries = fs.readdirSync(searchDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const pkgJsonPath = path.join(searchDir, entry.name, 'package.json');
      if (!fs.existsSync(pkgJsonPath)) {
        continue;
      }

      try {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
        const catalogModelExport = pkgJson.exports?.['./catalog-model'];

        if (catalogModelExport) {
          const resolvedPath = path.resolve(
            searchDir,
            entry.name,
            catalogModelExport,
          );
          discovered.push({
            packageName: pkgJson.name,
            catalogModelPath: resolvedPath,
          });
        }
      } catch {
        // Skip packages with invalid package.json
      }
    }
  }

  return discovered;
}
