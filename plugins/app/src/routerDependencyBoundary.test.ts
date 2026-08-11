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

import fs from 'node:fs';
import path from 'node:path';

function collectSourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return collectSourceFiles(entryPath);
    }
    return /\.(?:ts|tsx)$/.test(entry.name) ? [entryPath] : [];
  });
}

describe('new frontend system router dependency boundary', () => {
  it('keeps React Router v6 inside the temporary root shim and page adapter', () => {
    const sourceRoot = path.resolve(__dirname);
    const allowedRoots = [
      path.join(sourceRoot, 'components', 'RootReactRouterV6.tsx'),
      path.join(sourceRoot, 'routing', 'reactRouterV6'),
    ];
    const violations = collectSourceFiles(sourceRoot)
      .filter(file => !/\.(?:test|stories)\.tsx?$/.test(file))
      .filter(
        file =>
          !allowedRoots.some(allowed =>
            file === allowed ? true : file.startsWith(`${allowed}${path.sep}`),
          ),
      )
      .filter(file =>
        /from\s+['"]react-router(?:-dom)?['"]/.test(
          fs.readFileSync(file, 'utf8'),
        ),
      )
      .map(file => path.relative(sourceRoot, file));

    expect(violations).toEqual([]);
  });
});
