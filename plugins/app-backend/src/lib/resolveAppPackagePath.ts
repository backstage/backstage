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
 * `resolvePackagePath` resolves from the location of
 * `@backstage/backend-plugin-api`, so it only finds the app package when that
 * package is visible from the root `node_modules`. pnpm only links a workspace
 * package into the packages that depend on it, never into the root. When the
 * first lookup does not find the app package, it is resolved from the backend
 * package instead, which depends on it.
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
      throw error;
    }
  }
}

function isModuleNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: unknown }).code === 'MODULE_NOT_FOUND'
  );
}
