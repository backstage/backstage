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
import { createRequire } from 'node:module';
import { dirname, resolve as resolvePath } from 'node:path';
import { targetPaths } from '@backstage/cli-common';
import { InputError } from '@backstage/errors';

/**
 * Finds the JavaScript entry point of a formatter CLI that the project root
 * declares as a dependency.
 *
 * The formatter has to be listed in the root `package.json`, so that the
 * project decides which version is used, rather than whichever version some
 * other dependency happens to install. It's located with Node.js module
 * resolution from the project root, which works with any package manager.
 *
 * @param name - The package name of the formatter, which is also the name of
 * its executable
 * @returns The absolute path of the formatter CLI script
 */
export async function resolveFormatterBin(name: string): Promise<string> {
  const rootPkgPath = targetPaths.resolveRoot('package.json');
  const missingError = new InputError(
    `The '${name}' package is not installed, add it to the dependencies of the root package.json at ${rootPkgPath}`,
  );

  const rootPkg = await fs.readJson(rootPkgPath);
  if (!rootPkg.dependencies?.[name] && !rootPkg.devDependencies?.[name]) {
    throw missingError;
  }

  let pkgPath: string;
  try {
    pkgPath = createRequire(rootPkgPath).resolve(`${name}/package.json`);
  } catch {
    throw missingError;
  }

  const { bin } = await fs.readJson(pkgPath);
  const binPath = typeof bin === 'string' ? bin : bin?.[name];
  if (typeof binPath !== 'string') {
    throw new InputError(
      `The '${name}' package at ${dirname(
        pkgPath,
      )} does not declare a '${name}' executable`,
    );
  }
  return resolvePath(dirname(pkgPath), binPath);
}
