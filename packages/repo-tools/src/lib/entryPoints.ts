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
import { JsonObject } from '@backstage/types';

export function getPackageExportNames(pkg: JsonObject): string[] | undefined {
  if (pkg.exports && typeof pkg.exports !== 'string') {
    return Object.entries(pkg.exports).flatMap(([mount, path]) => {
      const ext = extname(String(path));
      if (!['.ts', '.tsx', '.cts', '.mts'].includes(ext)) {
        return []; // Ignore non-TS entry points
      }
      let name = mount;
      if (name.startsWith('./')) {
        name = name.slice(2);
      }
      if (!name || name === '.') {
        return ['index'];
      }
      return [name];
    });
  }

  return undefined;
}
