/*
 * Copyright 2020 The Backstage Authors
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

import { targetPaths, findOwnPaths } from '@backstage/cli-common';
import { PackageGraph } from '@backstage/cli-node';
import { Minimatch } from 'minimatch';
import { isAbsolute, relative as relativePath } from 'node:path';

/* eslint-disable-next-line no-restricted-syntax */
export const paths = {
  get targetDir() {
    return targetPaths.resolve();
  },
  get targetRoot() {
    return targetPaths.resolveRoot();
  },
  get ownRoot() {
    return findOwnPaths(__dirname).resolveRoot();
  },
  resolveTarget: targetPaths.resolve,
  resolveTargetRoot: targetPaths.resolveRoot,
  resolveOwnRoot: (...p: string[]) => findOwnPaths(__dirname).resolveRoot(...p),
};

/** @internal */
export interface ResolvePackagesOptions {
  paths?: string[];
  include?: string[];
  exclude?: string[];
}

/** @internal */
export async function resolvePackagePaths(
  options: ResolvePackagesOptions = {},
): Promise<string[]> {
  const { paths: providedPaths, include, exclude } = options;
  let packages = await PackageGraph.listTargetPackages();

  if (providedPaths && providedPaths.length > 0) {
    const invalidPaths: string[] = [];
    for (const path of providedPaths) {
      const matches = packages.some(
        ({ dir }) =>
          new Minimatch(path).match(relativePath(targetPaths.resolveRoot(), dir)) ||
          isChildPath(dir, path),
      );
      if (!matches) {
        invalidPaths.push(path);
      }
    }
    if (invalidPaths.length > 0) {
      throw new Error(`Invalid paths provided: ${invalidPaths.join(', ')}`);
    }
  }

  if (providedPaths && providedPaths.length > 0) {
    packages = packages.filter(({ dir }) =>
      providedPaths.some(
        path =>
          new Minimatch(path).match(relativePath(targetPaths.resolveRoot(), dir)) ||
          isChildPath(dir, path),
      ),
    );
  }

  if (include) {
    packages = packages.filter(pkg =>
      include.some(pattern =>
        new Minimatch(pattern).match(relativePath(targetPaths.resolveRoot(), pkg.dir)),
      ),
    );
  }

  if (exclude) {
    packages = packages.filter(pkg =>
      exclude.some(
        pattern =>
          !new Minimatch(pattern).match(
            relativePath(targetPaths.resolveRoot(), pkg.dir),
          ),
      ),
    );
  }

  return packages.map(pkg => relativePath(targetPaths.resolveRoot(), pkg.dir));
}

/** @internal */
export function isChildPath(base: string, path: string): boolean {
  const relative = relativePath(base, path);
  if (relative === '') {
    // The same directory
    return true;
  }

  const outsideBase = relative.startsWith('..'); // not outside base
  const differentDrive = isAbsolute(relative); // on Windows, this means dir is on a different drive from base.

  return !outsideBase && !differentDrive;
}
