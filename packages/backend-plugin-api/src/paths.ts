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

import { isChildPath } from '@backstage/cli-common';
import { NotAllowedError } from '@backstage/errors';
import { resolve as resolvePath, dirname } from 'path';
import { realpathSync as realPath } from 'fs';
import { fileURLToPath } from 'url';

/** @internal */
export const packagePathMocks = new Map<
  string,
  (paths: string[]) => string | undefined
>();

/**
 * Resolve a path relative to the calling module's location.
 * 
 * **For ES modules (recommended):**
 * Use with `import.meta.url` which provides stable file URL resolution
 * even in bundled production environments.
 *
 * **For CommonJS modules:**
 * Use `resolvePackageAssets` instead, which provides more stable resolution
 * in bundled environments by using the module resolution system.
 *
 * @param fileUrl - The import.meta.url from an ES module
 * @param paths - Additional path segments to resolve relative to the calling module
 * @returns The resolved absolute path
 *
 * @example
 * ```ts
 * // ES modules (recommended)
 * const assetsDir = resolveFromFile(import.meta.url, '../assets');
 * ```
 *
 * @public
 */
export function resolveFromFile(fileUrl: string, ...paths: string[]): string {
  if (!fileUrl.startsWith('file://')) {
    throw new Error(
      'resolveFromFile() expects import.meta.url as the first argument. ' +
      'For CommonJS modules, use resolvePackageAssets() instead, which provides ' +
      'more stable resolution in bundled environments.'
    );
  }
  
  const basePath = dirname(fileURLToPath(fileUrl));
  return resolvePath(basePath, ...paths);
}

/**
 * Resolve a path relative to a package directory using the module resolution system.
 * This is a more bundling-friendly alternative for CommonJS modules.
 * 
 * This works by using require.resolve() to locate the package, then resolving
 * paths relative to the package root. This is more stable in bundled environments
 * than relying on __dirname or __filename.
 *
 * @param packageName - The name of the package to resolve from
 * @param paths - Additional path segments to resolve relative to the package root
 * @returns The resolved absolute path
 *
 * @example
 * ```ts
 * // Resolve migrations directory for current package
 * const migrationsDir = resolvePackageAssets('@backstage/plugin-auth-backend', 'migrations');
 * 
 * // Resolve assets from current package
 * const configFile = resolvePackageAssets('@backstage/plugin-auth-backend', 'assets', 'config.json');
 * ```
 *
 * @public
 */
export function resolvePackageAssets(packageName: string, ...paths: string[]): string {
  const mockedResolve = packagePathMocks.get(packageName);
  if (mockedResolve) {
    const resolved = mockedResolve(paths);
    if (resolved) {
      return resolved;
    }
  }

  const req =
    typeof __non_webpack_require__ === 'undefined'
      ? require
      : __non_webpack_require__;

  try {
    // Try to resolve the package.json to find the package root
    const packageJsonPath = req.resolve(`${packageName}/package.json`);
    return resolvePath(dirname(packageJsonPath), ...paths);
  } catch (error) {
    // If package.json is not available (bundled environment), try to resolve the main entry
    try {
      const mainPath = req.resolve(packageName);
      // Assume the package root is one level up from the main entry
      // This is a fallback that may not work in all cases
      return resolvePath(dirname(mainPath), '..', ...paths);
    } catch (fallbackError) {
      throw new Error(
        `Cannot resolve package assets for '${packageName}'. ` +
        `This may indicate the package is not installed or not accessible in this environment. ` +
        `Original error: ${error.message}`
      );
    }
  }
}

/**
 * Resolve a path relative to the root of a package directory.
 * Additional path arguments are resolved relative to the package dir.
 *
 * This is particularly useful when you want to access assets shipped with
 * your backend plugin package. When doing so, do not forget to include the assets
 * in your published package by adding them to `files` in your `package.json`.
 *
 * @deprecated Use resolveFromFile with import.meta.url (ES modules) or resolvePackageAssets (CommonJS) instead.
 * This function relies on package.json files being present which may not work
 * in bundled environments.
 *
 * @public
 */
export function resolvePackagePath(name: string, ...paths: string[]) {
  const mockedResolve = packagePathMocks.get(name);
  if (mockedResolve) {
    const resolved = mockedResolve(paths);
    if (resolved) {
      return resolved;
    }
  }

  const req =
    typeof __non_webpack_require__ === 'undefined'
      ? require
      : __non_webpack_require__;

  return resolvePath(req.resolve(`${name}/package.json`), '..', ...paths);
}

/**
 * Resolves a target path from a base path while guaranteeing that the result is
 * a path that point to or within the base path. This is useful for resolving
 * paths from user input, as it otherwise opens up for vulnerabilities.
 *
 * @public
 * @param base - The base directory to resolve the path from.
 * @param path - The target path, relative or absolute
 * @returns A path that is guaranteed to point to or within the base path.
 */
export function resolveSafeChildPath(base: string, path: string): string {
  const resolvedBasePath = resolveRealPath(base);
  const targetPath = resolvePath(resolvedBasePath, path);

  if (!isChildPath(resolvedBasePath, resolveRealPath(targetPath))) {
    throw new NotAllowedError(
      'Relative path is not allowed to refer to a directory outside its parent',
    );
  }

  // Don't return the resolved path as the original could be a symlink
  return resolvePath(base, path);
}

function resolveRealPath(path: string): string {
  try {
    return realPath(path);
  } catch (ex) {
    if (ex.code !== 'ENOENT') {
      throw ex;
    }
  }

  return path;
}
// Re-export isChildPath so that backend packages don't need to depend on cli-common
export { isChildPath };
