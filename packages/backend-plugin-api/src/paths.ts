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
import { existsSync } from 'fs';

/** @internal */
export const packagePathMocks = new Map<
  string,
  (paths: string[]) => string | undefined
>();

/**
 * Resolve a path relative to the root of a package directory.
 * Additional path arguments are resolved relative to the package dir.
 *
 * This is particularly useful when you want to access assets shipped with
 * your backend plugin package. When doing so, do not forget to include the assets
 * in your published package by adding them to `files` in your `package.json`.
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
 * Resolve paths to package assets with enhanced portability.
 * 
 * This function provides an alternative to resolvePackagePath that works better
 * in bundled environments. It looks for assets in multiple locations:
 * 1. Relative to the current module (using __dirname)
 * 2. In the package's dist directory (for built packages)
 * 3. Falls back to standard package resolution
 *
 * @param moduleDir - The __dirname of the calling module
 * @param assetPath - Path to the asset directory or file
 * @returns The resolved absolute path to the asset
 *
 * @example
 * ```ts
 * // From src/database/migrations.ts
 * const migrationsDir = resolvePackageAssets(__dirname, 'migrations');
 * 
 * // From src/service/router.ts  
 * const assetsDir = resolvePackageAssets(__dirname, 'assets');
 * ```
 *
 * @public
 */
export function resolvePackageAssets(moduleDir: string, assetPath: string): string {
  // Strategy 1: Look for assets relative to the built package location
  // The CLI copies asset directories to dist/, so check there first
  const builtAssetPath = resolvePath(dirname(moduleDir), assetPath);
  if (existsSync(builtAssetPath)) {
    return builtAssetPath;
  }

  // Strategy 2: Look for assets relative to package root (development)
  // Navigate up from src/ to package root
  const packageRootAssetPath = resolvePath(moduleDir, '..', '..', assetPath);
  if (existsSync(packageRootAssetPath)) {
    return packageRootAssetPath;
  }

  // Strategy 3: Look in the dist directory relative to module
  const distAssetPath = resolvePath(dirname(moduleDir), '..', assetPath);
  if (existsSync(distAssetPath)) {
    return distAssetPath;
  }

  // Fallback: Return the most likely path even if it doesn't exist
  // This allows for the asset to be created later or for better error messages
  return builtAssetPath;
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
