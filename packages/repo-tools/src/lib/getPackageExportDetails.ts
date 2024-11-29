/*
 * Copyright 2023 The Backstage Authors
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

import { extname } from 'path';
import type { JsonObject } from '@backstage/types';

export function getPackageExportDetails(pkg: JsonObject): Array<{
  // the name of the export, e.g. "index" or "alpha"
  name: string;
  // the path within the dist directory for this export, e.g. "alpha.d.ts"
  distPath: string;
  // the path within the dist-types directory of this package for this export,
  // e.g. "src/entrypoints/foo/index.d.ts"
  distTypesPath: string;
}> {
  if (pkg.exports && typeof pkg.exports !== 'string') {
    return Object.entries(pkg.exports).flatMap(
      ([mount, path]: [string, string]) => {
        const ext = extname(path);
        if (!['.ts', '.tsx', '.cts', '.mts'].includes(ext)) {
          return []; // Ignore non-TS entry points
        }

        let name = mount;
        if (name.startsWith('./')) {
          name = name.slice(2);
        }
        if (!name || name === '.') {
          name = 'index';
        }

        const distPath = `${name}.d.ts`;
        const distTypesPath = path
          .replace(/^\.\//, '') // Remove leading "./"
          .replace(/\.[^.]+$/, '.d.ts'); // Replace .extension with .d.ts

        return [
          {
            name,
            distPath,
            distTypesPath,
          },
        ];
      },
    );
  }

  return [
    {
      name: 'index',
      distPath: 'index.d.ts',
      distTypesPath: 'src/index.d.ts',
    },
  ];
}
