/*
 * Copyright 2023 The Backstage Authors
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

import { packagePathMocks } from './paths';
import { posix as posixPath, resolve as resolvePath } from 'path';

/** @public */
export interface PackagePathMock {
  /** Restored the normal behavior of resolvePackagePath */
  restore(): void;
}

/** @public */
export interface PackagePathMockOptions {
  /** The name of the package to mock the resolved path of */
  name: string;
  /** A replacement for the root package path */
  path?: string;
  /**
   * Replacements for package sub-paths, each key must be an exact match of the posix-style path
   * that is being resolved within the package.
   *
   * For example, code calling `resolvePackagePath('x', 'foo', 'bar')` would match only the following
   * configuration: `createPackagePathMock({name: 'x', paths: {'foo/bar': baz}})`
   */
  paths?: { [path in string]: string | (() => string) };
}

/** @public */
export function createPackagePathMock(
  options: PackagePathMockOptions,
): PackagePathMock {
  if (packagePathMocks.has(options.name)) {
    throw new Error(
      `Duplicate package path mock for package '${options.name}'`,
    );
  }

  packagePathMocks.set(options.name, paths => {
    const joinedPath = posixPath.join(...paths);
    const localResolver = options.paths?.[joinedPath];
    if (localResolver) {
      return typeof localResolver === 'function'
        ? localResolver()
        : localResolver;
    }
    if (options.path) {
      return resolvePath(options.path, ...paths);
    }
    return undefined;
  });

  return {
    restore() {
      packagePathMocks.delete(options.name);
    },
  };
}
