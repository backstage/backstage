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

import { targetPaths } from '@backstage/cli-common';
import { PackageGraph } from '@backstage/cli-node';
import { Minimatch } from 'minimatch';
import { existsSync } from 'node:fs';
import {
  dirname,
  isAbsolute,
  relative as relativePath,
  resolve as resolvePath,
} from 'node:path';

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
          new Minimatch(path).match(
            relativePath(targetPaths.installationRootDir, dir),
          ) || isChildPath(dir, path),
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
          new Minimatch(path).match(
            relativePath(targetPaths.installationRootDir, dir),
          ) || isChildPath(dir, path),
      ),
    );
  }

  if (include) {
    packages = packages.filter(pkg =>
      include.some(pattern =>
        new Minimatch(pattern).match(
          relativePath(targetPaths.installationRootDir, pkg.dir),
        ),
      ),
    );
  }

  if (exclude) {
    packages = packages.filter(pkg =>
      exclude.some(
        pattern =>
          !new Minimatch(pattern).match(
            relativePath(targetPaths.installationRootDir, pkg.dir),
          ),
      ),
    );
  }

  return packages.map(pkg =>
    relativePath(targetPaths.installationRootDir, pkg.dir),
  );
}

/**
 * Resolves a path in the `node_modules` directory of the installation root,
 * or of a directory above it up to the workspace root, since pnpm can install
 * the tools of an installation in a subdirectory into the workspace root.
 * Points into the installation root when the path is not found.
 *
 * @internal
 */
export function resolveNodeModulesPath(path: string): string {
  const { installationRootDir, workspaceRootDir } = targetPaths;
  for (let dir = installationRootDir; ; dir = dirname(dir)) {
    const candidate = resolvePath(dir, 'node_modules', path);
    if (existsSync(candidate)) {
      return candidate;
    }
    if (dir === workspaceRootDir || dirname(dir) === dir) {
      break;
    }
  }
  return resolvePath(installationRootDir, 'node_modules', path);
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
