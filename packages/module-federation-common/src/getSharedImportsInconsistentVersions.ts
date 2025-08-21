/*
 * Copyright 2025 The Backstage Authors
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

import { SharedImport } from './types';

export function getSharedImportsInconsistentVersions(
  sharedImportsPackage: string,
  sharedImportsRetriever: (module: any) => SharedImport[],
) {
  const sharedImports = sharedImportsRetriever(
    require('./defaultSharedImports'),
  );
  const inconsistentVersions = [];
  for (const sharedImport of sharedImports) {
    if (!sharedImport.version) {
      continue;
    }

    // Use require.resolve to find the package
    // For scoped modules, keep the scope and the module name, but remove any sub-folder
    const nameParts = sharedImport.name.split('/');
    const moduleName =
      nameParts[0].startsWith('@') && nameParts.length > 1
        ? `${nameParts[0]}/${nameParts[1]}`
        : nameParts[0];
    const packagePath = require.resolve(`${moduleName}/package.json`, {
      paths: [require.resolve(sharedImportsPackage)],
    });
    const packageJson = require(packagePath);
    if (packageJson.version !== sharedImport.version) {
      inconsistentVersions.push({
        import: sharedImport.name,
        version: {
          effective: packageJson.version,
          specified: sharedImport.version,
        },
      });
    }
  }
  return inconsistentVersions;
}
