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

export type CacheHit = {
  // External location of the cache outside the output folder
  archivePath: string;
  readable?: boolean;
  writable?: boolean;
  needsCopy?: boolean;
  trees?: string[];
};

export type CacheKey = string[];

type CacheEntry = {
  key: CacheKey;
  archivePath: string;
};

const CACHE_ARCHIVE = 'cache.tgz';
const INFO_FILE = '.backstage-build-cache';

export class Cache {
  static async read(options: Options) {
    const repoPath = relativePath(options.repoRoot, process.cwd());
    const location = resolvePath(options.cacheDir, repoPath);

    // Make sure we don't have any uncommitted changes to the input, in that case we consider the cache to be missing
    try {
      // await exec(`git diff --quiet HEAD -- ${options.inputs.join(' ')}`);
    } catch (error) {
      return new Cache();
    }

    let localKey: CacheKey = [];

    const localInfoFile = resolvePath(options.output, INFO_FILE);
    const outputCacheExists = await fs.pathExists(localInfoFile);
    if (outputCacheExists) {
      const infoData = await fs.readFile(localInfoFile);
      const { trees } = JSON.parse(infoData.toString('utf8'));
      localKey = trees;
    }

    try {
      const externalCacheExists = await fs.pathExists(location);
      if (externalCacheExists) {
        const archivePath = resolvePath(location, CACHE_ARCHIVE);
        const infoData = await readFileFromArchive(archivePath, INFO_FILE);
        const { trees } = JSON.parse(infoData.toString('utf8'));
        if (trees) {
          return new Cache([{ archivePath, key: trees }], location, localKey);
        }
      }
    } catch (error) {
      throw new Error(`failed to read external cache archive, ${error}`);
    }

    return new Cache([], location, localKey);
  }

  static async readInputKey(inputPaths: string[]): Promise<CacheKey> {
    const trees = [];
    for (const inputPath of inputPaths) {
      const output = await runPlain(`git ls-tree HEAD '${inputPath}'`);
      const [, , sha] = output.split(/\s+/, 3);
      trees.push(sha);
    }
    return trees;
  }

  constructor(
    private readonly entries: CacheEntry[] = [],
    private readonly location?: string,
    private readonly localKey?: CacheKey,
  ) {}

  find(key: CacheKey): CacheHit | undefined {
    if (!this.location) {
      return undefined;
    }
    if (this.localKey?.join(',') === key.join(',')) {
      return {
        needsCopy: false,
        archivePath: resolvePath(this.location, CACHE_ARCHIVE),
      };
    }
    const matchingEntry = this.entries.find(entry => entry.key === key);
    if (!matchingEntry) {
      return undefined;
    }
    return {
      needsCopy: true,
      archivePath: matchingEntry.archivePath,
    };
  }

  get shouldCacheOutput() {
    return Boolean(this.location);
  }

  async prepareOutput(key: CacheKey, outputDir: string): Promise<string> {
    if (!this.location) {
      throw new Error("can't write cache output, no location set");
    }
    const infoData = Buffer.from(
      JSON.stringify({ trees: key }, null, 2),
      'utf8',
    );
    await fs.writeFile(resolvePath(outputDir, INFO_FILE), infoData);
    const archivePath = resolvePath(this.location, CACHE_ARCHIVE);
    return archivePath;
  }
}
