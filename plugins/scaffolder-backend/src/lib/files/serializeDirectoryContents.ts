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

import { promises as fs, existsSync } from 'fs';
import globby from 'globby';
import limiterFactory from 'p-limit';
import { resolveSafeChildPath } from '@backstage/backend-common';
import { SerializedFile } from './types';

const DEFAULT_GLOB_PATTERNS = ['./**', '!.git'];

export const isExecutable = (fileMode: number | undefined) => {
  if (!fileMode) {
    return false;
  }

  const executeBitMask = 0o000111;
  const res = fileMode & executeBitMask;
  return res > 0;
};

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

  return Promise.all(
    paths
      .filter(({ dirent }) => !dirent.isDirectory())
      .filter(({ dirent, path }) => {
        if (!dirent.isSymbolicLink()) return true;
        const safePath = resolveSafeChildPath(sourcePath, path);
        if (!existsSync(safePath)) return true; // We only want symlinks that DO NOT exist (yet)
        return false;
      })
      .map(async ({ dirent, path, stats }) => ({
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
