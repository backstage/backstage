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

import fs from 'fs-extra';
import globby from 'globby';
import limiterFactory from 'p-limit';
import { join as joinPath } from 'path';
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
    objectMode: true,
    stats: true,
  });

  const limiter = limiterFactory(10);

  return Promise.all(
    paths.map(async ({ path, stats }) => ({
      path,
      content: await limiter(async () =>
        fs.readFile(joinPath(sourcePath, path)),
      ),
      executable: isExecutable(stats?.mode),
    })),
  );
}
