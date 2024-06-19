/*
 * Copyright 2022 The Backstage Authors
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

import { promises as fs } from 'fs';
import globby from 'globby';
import limiterFactory from 'p-limit';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { SerializedFile } from './types';
import { isError } from '@backstage/errors';

const DEFAULT_GLOB_PATTERNS = ['./**', '!.git'];

export const isExecutable = (fileMode: number | undefined) => {
  if (!fileMode) {
    return false;
  }

  const executeBitMask = 0o000111;
  const res = fileMode & executeBitMask;
  return res > 0;
};

async function asyncFilter<T>(
  array: T[],
  callback: (value: T, index: number, array: T[]) => Promise<boolean>,
): Promise<T[]> {
  const filterMap = await Promise.all(array.map(callback));
  return array.filter((_value, index) => filterMap[index]);
}

/**
 * @public
 */
export async function serializeDirectoryContents(
  sourcePath: string,
  options?: {
    gitignore?: boolean;
    globPatterns?: string[];
  },
): Promise<SerializedFile[]> {
  const paths = await globby(options?.globPatterns ?? DEFAULT_GLOB_PATTERNS, {
    cwd: sourcePath,
    dot: true,
    gitignore: options?.gitignore,
    followSymbolicLinks: false,
    // In order to pick up 'broken' symlinks, we oxymoronically request files AND folders yet we filter out folders
    // This is because broken symlinks aren't classed as files so we need to glob everything
    onlyFiles: false,
    objectMode: true,
    stats: true,
  });

  const limiter = limiterFactory(10);

  const valid = await asyncFilter(paths, async ({ dirent, path }) => {
    if (dirent.isDirectory()) return false;
    if (!dirent.isSymbolicLink()) return true;

    const safePath = resolveSafeChildPath(sourcePath, path);

    // we only want files that don't exist
    try {
      await fs.stat(safePath);
      return false;
    } catch (e) {
      return isError(e) && e.code === 'ENOENT';
    }
  });

  return Promise.all(
    valid.map(async ({ dirent, path, stats }) => ({
      path,
      content: await limiter(async () => {
        const absFilePath = resolveSafeChildPath(sourcePath, path);
        if (dirent.isSymbolicLink()) {
          return fs.readlink(absFilePath, 'buffer');
        }
        return fs.readFile(absFilePath);
      }),
      executable: isExecutable(stats?.mode),
      symlink: dirent.isSymbolicLink(),
    })),
  );
}
