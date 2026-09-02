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

import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join, posix, relative, sep } from 'node:path';

type ComputeDirectoryEtagOptions = {
  exclude?: string[];
};

function toPosixPath(filePath: string): string {
  return filePath.split(sep).join(posix.sep);
}

/**
 * Recursively list all files under a directory, returning paths relative to it.
 */
async function listFiles(dir: string, base: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath, base)));
    } else if (entry.isFile()) {
      files.push(toPosixPath(relative(base, fullPath)));
    }
  }

  return files;
}

/**
 * Compute a deterministic sha256 etag for a directory by hashing all file
 * contents. Files are sorted by their relative path so the result is stable
 * regardless of filesystem enumeration order.
 *
 * This mirrors the approach used in CI pipelines:
 *   find . -type f | sort | xargs sha256sum | sha256sum
 */
export async function computeDirectoryEtag(
  directory: string,
  options: ComputeDirectoryEtagOptions = {},
): Promise<string> {
  const excludedFiles = new Set(options.exclude ?? []);
  const files = (await listFiles(directory, directory)).filter(
    file => !excludedFiles.has(file),
  );
  files.sort();

  const combinedHash = createHash('sha256');

  for (const file of files) {
    const content = await readFile(join(directory, file));
    const fileHash = createHash('sha256').update(content).digest('hex');
    combinedHash.update(`${fileHash}  ${file}\n`);
  }

  return combinedHash.digest('hex');
}
