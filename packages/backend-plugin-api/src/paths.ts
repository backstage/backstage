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
import { resolve as resolvePath } from 'path';
import { realpathSync as realPath } from 'fs';

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
