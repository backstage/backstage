/*
 * Copyright 2024 The Backstage Authors
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

import { isAbsolute, relative, resolve as resolvePath } from 'path';
import { realpath } from 'fs/promises';
import { NotAllowedError } from '@backstage/errors';

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
export async function resolveSafeChildPath(
  base: string,
  path: string,
): Promise<string> {
  // Resolve any symlinks to the real path to avoid directory traversal attacks
  const resolvedRealpath = await realpath(path).catch(ex => {
    // realpath will throw if the path does not exist, in this case just return the path.
    if (ex.code === 'ENOENT') {
      return path;
    }
    throw ex;
  });

  const targetPath = resolvePath(base, resolvedRealpath);

  if (!isChildPath(base, targetPath)) {
    throw new NotAllowedError(
      'Relative path is not allowed to refer to a directory outside its parent',
    );
  }

  return targetPath;
}

function isChildPath(base: string, path: string): boolean {
  const relativePath = relative(base, path);
  if (relativePath === '') {
    // The same directory
    return true;
  }

  const outsideBase = relativePath.startsWith('..'); // not outside base
  const differentDrive = isAbsolute(relativePath); // on Windows, this means dir is on a different drive from base.

  return !outsideBase && !differentDrive;
}
