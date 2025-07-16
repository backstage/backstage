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
import { realpathSync as realPath, existsSync } from 'fs';

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
 * Resolve paths to package assets automatically from the calling location.
 * 
 * This function provides a portable alternative to resolvePackagePath that doesn't
 * require package names or __dirname. It uses stack trace analysis to detect the
 * calling file and automatically resolves assets relative to the package root.
 *
 * @param assetPath - Path to the asset directory or file relative to package root
 * @returns The resolved absolute path to the asset
 *
 * @example
 * ```ts
 * // From catalog-backend/src/database/migrations.ts
 * const migrationsDir = resolvePackageAssets('migrations');
 * 
 * // From auth-backend/src/providers/oauth2/provider.ts  
 * const templatesDir = resolvePackageAssets('templates');
 * ```
 *
 * @public
 */
export function resolvePackageAssets(assetPath: string): string {
  // Use stack trace to find the calling file
  const originalPrepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = (new Error().stack as any) as NodeJS.CallSite[];
  Error.prepareStackTrace = originalPrepareStackTrace;

  // Find the first external caller (skip this function)
  let callerFile: string | undefined;
  for (let i = 1; i < stack.length; i++) {
    const fileName = stack[i].getFileName();
    if (fileName && !fileName.includes('paths.ts') && !fileName.includes('paths.js')) {
      callerFile = fileName;
      break;
    }
  }

  if (!callerFile) {
    throw new Error('Unable to determine calling file for asset resolution');
  }

  // Find the package root by walking up from the caller
  let currentDir = dirname(callerFile);
  let packageRoot: string | undefined;
  
  while (currentDir !== dirname(currentDir)) {
    if (existsSync(resolvePath(currentDir, 'package.json'))) {
      packageRoot = currentDir;
      break;
    }
    currentDir = dirname(currentDir);
  }

  if (!packageRoot) {
    // Fallback: resolve relative to caller file
    return resolvePath(dirname(callerFile), assetPath);
  }

  // Try multiple locations for the asset
  const candidatePaths = [
    // Built assets in dist folder
    resolvePath(packageRoot, 'dist', assetPath),
    // Source assets in package root
    resolvePath(packageRoot, assetPath),
    // Development-time source location
    resolvePath(packageRoot, 'src', '..', assetPath),
  ];

  for (const candidatePath of candidatePaths) {
    if (existsSync(candidatePath)) {
      return candidatePath;
    }
  }

  // Return the most likely path (package root + asset path) for better error messages
  return resolvePath(packageRoot, assetPath);
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
