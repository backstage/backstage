/*
 * Copyright 2020 Spotify AB
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
import { resolve as resolvePath, relative as relativePath } from 'path';
import { runPlain } from '../../helpers/run';
import { readFileFromArchive } from './archive';
import { Options } from './options';

export type Cache = {
  // External location of the cache outside the output folder
  archivePath: string;
  readable?: boolean;
  writable?: boolean;
  needsCopy?: boolean;
  trees?: string[];
};

const CACHE_ARCHIVE = 'cache.tgz';
const INFO_FILE = '.backstage-build-cache';

export async function readCache(options: Options): Promise<Cache> {
  const repoPath = relativePath(options.repoRoot, process.cwd());
  const location = resolvePath(options.cacheDir, repoPath);
  const archivePath = resolvePath(location, CACHE_ARCHIVE);

  // Make sure we don't have any uncommitted changes to the input, in that case we consider the cache to be missing
  try {
    // await exec(`git diff --quiet HEAD -- ${options.inputs.join(' ')}`);
  } catch (error) {
    return { archivePath };
  }

  const infoFilePath = resolvePath(options.output, INFO_FILE);
  const outputCacheExists = await fs.pathExists(infoFilePath);
  if (outputCacheExists) {
    const infoData = await fs.readFile(infoFilePath);
    const { trees } = JSON.parse(infoData.toString('utf8'));
    if (trees) {
      return {
        archivePath,
        trees,
        readable: true,
        writable: true,
      };
    }
  }

  try {
    const externalCacheExists = await fs.pathExists(location);
    if (externalCacheExists) {
      const infoData = await readFileFromArchive(archivePath, INFO_FILE);
      const { trees } = JSON.parse(infoData.toString('utf8'));
      if (trees) {
        return {
          archivePath,
          trees,
          readable: true,
          writable: true,
          needsCopy: true,
        };
      }
    }
  } catch (error) {
    throw new Error(`failed to read external cache archive, ${error}`);
  }
  return { archivePath, writable: true };
}

export async function writeCacheInfo(
  trees: string[],
  options: Options,
): Promise<void> {
  const infoData = Buffer.from(JSON.stringify({ trees }, null, 2), 'utf8');
  await fs.writeFile(resolvePath(options.output, INFO_FILE), infoData);
}

export async function readInputHashes(options: Options): Promise<string[]> {
  const trees = [];
  for (const input of options.inputs) {
    const output = await runPlain(`git ls-tree HEAD '${input}'`);
    const [, , sha] = output.split(/\s+/, 3);
    trees.push(sha);
  }
  return trees;
}
