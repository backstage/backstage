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

import { findPaths } from '@backstage/cli-common';
import { relative as relativePath, join } from 'path';
import fs from 'fs-extra';

import g from 'glob';
import isGlob from 'is-glob';

import { promisify } from 'util';

const glob = promisify(g);

/* eslint-disable-next-line no-restricted-syntax */
export const paths = findPaths(__dirname);

export async function resolvePackagePath(
  packagePath: string,
): Promise<string | undefined> {
  const fullPackageDir = paths.resolveTargetRoot(packagePath);

  try {
    const stat = await fs.stat(fullPackageDir);
    if (!stat.isDirectory()) {
      return undefined;
    }

    const packageJsonPath = join(fullPackageDir, 'package.json');

    await fs.access(packageJsonPath);
  } catch (e) {
    console.log(`folder omitted: ${fullPackageDir}, cause: ${e}`);
    return undefined;
  }
  return relativePath(paths.targetRoot, fullPackageDir);
}

export async function findPackageDirs(selectedPaths: string[] = []) {
  const packageDirs = new Array<string>();
  for (const packageRoot of selectedPaths) {
    // if the path contain any glob notation we resolve all the paths to process one by one
    const dirs = isGlob(packageRoot)
      ? await glob(packageRoot, { cwd: paths.targetRoot })
      : [packageRoot];
    for (const dir of dirs) {
      const packageDir = await resolvePackagePath(dir);
      if (!packageDir) {
        continue;
      }
      packageDirs.push(packageDir);
    }
  }
  return packageDirs;
}
