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

import { resolvePackagePath } from '@backstage/backend-plugin-api';
import { isChildPath, targetPaths } from '@backstage/cli-common';
import fs from 'fs-extra';
import { basename, dirname, resolve as resolvePath } from 'node:path';

/**
 * Resolves a path within the app package that the backend serves.
 *
 * @remarks
 *
 * The app package is first resolved with
 * {@link @backstage/backend-plugin-api#resolvePackagePath}, which also keeps
 * test overrides of the package path working. That lookup starts from the
 * location of `@backstage/backend-plugin-api`, so it only finds the app
 * package when the app package is hoisted to where that package can see it.
 * When it is not, for example when the app package is only installed in the
 * `node_modules` of the backend package, the app package is resolved from the
 * backend package instead, which depends on it. The backend package is found
 * through the entry point of the process and the current working directory,
 * and only `node_modules` directories within the project root are searched.
 *
 * @param appPackageName - The name of the app package, usually `app`.
 * @param paths - Path segments to resolve within the app package.
 * @returns The absolute path.
 * @public
 */
export function resolveAppPackagePath(
  appPackageName: string,
  ...paths: string[]
): string {
  // The regular lookup goes first on purpose. An app package that it finds
  // is used as before, even if the backend package has a copy of its own.
  try {
    return resolvePackagePath(appPackageName, ...paths);
  } catch (error) {
    if (!isModuleNotFoundError(error)) {
      throw error;
    }

    const req =
      typeof __non_webpack_require__ === 'undefined'
        ? require
        : __non_webpack_require__;

    // The entry point is in the backend package, both when started through
    // the CLI and when run directly with node. The main module is not set
    // when the entry point is an ES module, so the script path is also used.
    // The working directory is the backend package when started through the
    // CLI.
    const startPaths = new Set<string>();
    if (req.main?.filename) {
      startPaths.add(req.main.filename);
    }
    if (process.argv[1]) {
      startPaths.add(resolvePath(process.argv[1]));
    }
    startPaths.add(process.cwd());

    const rootDir = targetPaths.rootDir;
    for (const startPath of startPaths) {
      for (const nodeModulesPath of getNodeModulesPaths(startPath)) {
        if (!isChildPath(rootDir, nodeModulesPath)) {
          continue;
        }
        const packageJsonPath = resolvePath(
          nodeModulesPath,
          appPackageName,
          'package.json',
        );
        if (fs.existsSync(packageJsonPath)) {
          return resolvePath(fs.realpathSync(packageJsonPath), '..', ...paths);
        }
      }
    }

    error.message = `${
      error.message
    }\nThe app package was also not found from ${Array.from(startPaths).join(
      ', ',
    )} within ${rootDir}`;
    throw error;
  }
}

// The node_modules directories that Node.js searches from the given file or
// directory, without NODE_PATH and the global folders
function getNodeModulesPaths(from: string): string[] {
  const result = new Array<string>();
  const isDir = fs.statSync(from, { throwIfNoEntry: false })?.isDirectory();
  for (let dir = isDir ? from : dirname(from); ; dir = dirname(dir)) {
    if (basename(dir) !== 'node_modules') {
      result.push(resolvePath(dir, 'node_modules'));
    }
    if (dirname(dir) === dir) {
      return result;
    }
  }
}

// Checked by shape, since errors can come from another realm in tests
function isModuleNotFoundError(error: unknown): error is Error {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: unknown }).code === 'MODULE_NOT_FOUND'
  );
}
