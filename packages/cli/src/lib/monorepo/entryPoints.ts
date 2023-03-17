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
import { ExtendedPackageJSON } from './PackageGraph';

export interface EntryPoint {
  mount: string;
  path: string;
  name: string;
  ext: string;
}

// Unless explicitly specified in exports, the index entrypoint is always
// assumed to be at src/index.ts for backwards compatibility.
const defaultIndex = {
  mount: '.',
  path: 'src/index.ts',
  name: 'index',
  ext: '.ts',
};

function parseEntryPoint(mount: string, path: string): EntryPoint {
  let name = mount;
  if (name === '.') {
    name = 'index';
  } else if (name.startsWith('./')) {
    name = name.slice(2);
  }
  if (name.includes('/')) {
    throw new Error(`Mount point '${mount}' may not contain multiple slashes`);
  }

  return { mount, path, name, ext: extname(path) };
}

export function readEntryPoints(pkg: ExtendedPackageJSON): Array<EntryPoint> {
  const exp = pkg.exports;
  if (typeof exp === 'string') {
    return [defaultIndex];
  } else if (exp && typeof exp === 'object' && !Array.isArray(exp)) {
    const entryPoints = new Array<{
      mount: string;
      path: string;
      name: string;
      ext: string;
    }>();

    for (const mount of Object.keys(exp)) {
      const path = exp[mount];
      if (typeof path !== 'string') {
        throw new Error(
          `Exports field value must be a string, got '${JSON.stringify(path)}'`,
        );
      }

      entryPoints.push(parseEntryPoint(mount, path));
    }

    return entryPoints;
  }

  return [defaultIndex];
}
