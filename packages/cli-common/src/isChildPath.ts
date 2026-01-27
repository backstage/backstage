/*
 * Copyright 2021 The Backstage Authors
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

import {
  relative,
  isAbsolute,
  resolve as resolvePath,
  dirname,
  basename,
} from 'node:path';
import { realpathSync, lstatSync, readlinkSync } from 'node:fs';

// Resolves a path to its real location, following symlinks.
// Handles cases where the final target doesn't exist by recursively
// resolving parent directories.
function resolveRealPath(path: string): string {
  try {
    return realpathSync(path);
  } catch (ex) {
    if (ex.code !== 'ENOENT') {
      throw ex;
    }
  }

  // Check if path itself is a dangling symlink - recursively resolve the target
  // to handle symlink chains (e.g., link1 -> link2 -> /outside)
  try {
    if (lstatSync(path).isSymbolicLink()) {
      const target = resolvePath(dirname(path), readlinkSync(path));
      return resolveRealPath(target);
    }
  } catch (ex) {
    if (ex.code !== 'ENOENT') {
      throw ex;
    }
  }

  // Path doesn't exist - walk up the tree until we find an existing path,
  // resolve it, then rebuild the non-existent portion on top
  const parent = dirname(path);
  if (parent === path) {
    return path; // Hit filesystem root
  }

  return resolvePath(resolveRealPath(parent), basename(path));
}

/**
 * Checks if path is the same as or a child path of base.
 *
 * @public
 */
export function isChildPath(base: string, path: string): boolean {
  const resolvedBase = resolveRealPath(base);
  const resolvedPath = resolveRealPath(path);

  const relativePath = relative(resolvedBase, resolvedPath);
  if (relativePath === '') {
    // The same directory
    return true;
  }

  const outsideBase = relativePath.startsWith('..'); // not outside base
  const differentDrive = isAbsolute(relativePath); // on Windows, this means dir is on a different drive from base.

  return !outsideBase && !differentDrive;
}
