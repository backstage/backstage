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
import { dirname, resolve as resolvePath } from 'node:path';

/**
 * Resolves a path within the app package that the backend serves.
 *
 * @remarks
 *
 * The app package is first resolved with `resolvePackagePath` from
 * `@backstage/backend-plugin-api`, which also keeps test overrides of the
 * package path working. That lookup starts from the location of
 * `@backstage/backend-plugin-api`, so it only finds the app package when the
 * app package is hoisted to where that package can see it. When it is not,
 * for example when the app package is only installed in the `node_modules` of
 * the backend package, the app package is resolved from the backend package
 * instead, which depends on it. The backend package is found through the main
 * module of the process and the current working directory.
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

    // The main module is the entry point of the backend package, both when
    // started through the CLI and when run directly with node. The working
    // directory is the backend package when started through the CLI.
    const searchPaths = new Set<string>();
    if (req.main?.filename) {
      searchPaths.add(dirname(req.main.filename));
    }
    searchPaths.add(process.cwd());

    try {
      const packageJsonPath = req.resolve(`${appPackageName}/package.json`, {
        paths: Array.from(searchPaths),
      });
      return resolvePath(packageJsonPath, '..', ...paths);
    } catch {
      error.message = `${
        error.message
      }\nThe app package was also not found from ${Array.from(searchPaths).join(
        ', ',
      )}`;
      throw error;
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
