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
 * This function provides a reliable alternative to resolvePackagePath that works
 * across all deployment scenarios by using module resolution instead of file system
 * path assumptions. It looks for assets using these strategies:
 * 
 * 1. Auto-generated asset resolver modules (in production builds)
 * 2. Development-time asset locations (relative to package root)
 * 3. Fallback to common asset locations
 *
 * @param packageName - The name of the package containing the assets
 * @param assetPath - Path to the asset directory or file
 * @returns The resolved absolute path to the asset
 *
 * @example
 * ```ts
 * // From catalog-backend migrations
 * const migrationsDir = resolvePackageAssets('@backstage/plugin-catalog-backend', 'migrations');
 * 
 * // From auth-backend assets
 * const assetsDir = resolvePackageAssets('@backstage/plugin-auth-backend', 'assets');
 * ```
 *
 * @public
 */
export function resolvePackageAssets(packageName: string, assetPath: string): string {
  const req =
    typeof __non_webpack_require__ === 'undefined'
      ? require
      : __non_webpack_require__;

  try {
    // Strategy 1: Try to find auto-generated asset resolver modules
    // These are created by the CLI build process and provide reliable asset paths
    const packageDistPath = resolvePath(req.resolve(`${packageName}/package.json`), '..');
    
    try {
      const assetResolverPath = resolvePath(packageDistPath, '__asset_resolvers__.js');
      if (existsSync(assetResolverPath)) {
        // eslint-disable-next-line import/no-dynamic-require
        const assetResolvers = req(assetResolverPath);
        const resolvedAsset = assetResolvers.resolveAsset(assetPath);
        if (resolvedAsset && existsSync(resolvedAsset)) {
          return resolvedAsset;
        }
      }
    } catch {
      // Asset resolver not available, continue to next strategy
    }

    // Strategy 2: Look for assets in the built package dist directory
    const builtAssetPath = resolvePath(packageDistPath, assetPath);
    if (existsSync(builtAssetPath)) {
      return builtAssetPath;
    }

    // Strategy 3: Development-time fallback - look in package source
    // This handles cases where we're running in development mode
    const sourceAssetPath = resolvePath(packageDistPath, '..', assetPath);
    if (existsSync(sourceAssetPath)) {
      return sourceAssetPath;
    }

    // Strategy 4: Try looking in common development locations
    const devAssetPath = resolvePath(packageDistPath, '..', 'src', '..', assetPath);
    if (existsSync(devAssetPath)) {
      return devAssetPath;
    }

    // Fallback: Return the most likely path for better error messages
    return builtAssetPath;
  } catch (error) {
    // If package resolution fails completely, fall back to the old behavior
    // but this should be rare in normal usage
    throw new Error(
      `Unable to resolve package assets for ${packageName}: ${error.message}. ` +
      `Make sure the package is properly installed and built.`
    );
  }
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
