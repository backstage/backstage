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
import { runPlain, runCheck } from '../../helpers/run';
import { Options } from './options';
import { extractArchive, createArchive } from './archive';

const INFO_FILE = '.backstage-build-cache';

export type CacheQueryResult = {
  hit: boolean;
  copy?: (outputDir: string) => Promise<void>;
  archive?: (outputDir: string, maxEntries: number) => Promise<void>;
};

export type CacheKey = string[];

type CacheEntry = {
  key: CacheKey;
  path: string;
};

type CacheInfo = {
  key?: CacheKey;
  entries?: CacheEntry[];
};

export class Cache {
  static async read(options: Options) {
    const repoPath = relativePath(options.repoRoot, process.cwd());
    const location = resolvePath(options.cacheDir, repoPath);

    // Make sure we don't have any uncommitted changes to the input, in that case we consider the cache to be missing
    const noChanges = await runCheck(
      `git diff --quiet HEAD -- ${options.inputs.join(' ')}`,
    );
    if (!noChanges) {
      return new Cache();
    }

    const outputInfo = await readCacheInfo(options.output);
    const localKey = outputInfo?.key;

    const { entries = [] } = (await readCacheInfo(location)) ?? {};
    return new Cache(entries, location, localKey);
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

  query(key: CacheKey): CacheQueryResult {
    const { location } = this;
    if (!location) {
      return { hit: false };
    }

    const archive = async (outputDir: string, maxEntries: number) => {
      await writeCacheInfo(outputDir, { key });

      const timestamp = new Date().toISOString().replace(/-|:|\..*/g, '');
      const rand = Math.random()
        .toString(36)
        .slice(2, 6);
      const archiveName = `cache-${timestamp}-${rand}.tgz`;
      const archivePath = resolvePath(location, archiveName);

      // Read existing entries and prepend the new one
      const { entries = [] } = (await readCacheInfo(location)) ?? {};

      // Check if there's already aan entry for this key, in that case we just wanna bump it
      const entryIndex = entries.findIndex(e => compareKeys(e.key, key));
      if (entryIndex !== -1) {
        const [existingEntry] = entries.splice(entryIndex, 1);
        entries.unshift(existingEntry);

        await writeCacheInfo(location, { entries });
        return;
      }

      // Create and add new archive to entries
      await createArchive(archivePath, outputDir);
      entries.unshift({ key, path: archiveName });

      // Remove old cache entries
      const removedEntries = entries.splice(maxEntries);
      for (const entry of removedEntries) {
        try {
          await fs.remove(resolvePath(location, entry.path));
        } catch (error) {
          process.stderr.write(`failed to remove old cache entry, ${error}\n`);
        }
      }

      await writeCacheInfo(location, { entries });
    };

    if (compareKeys(this.localKey, key)) {
      return { hit: true, archive };
    }

    const matchingEntry = this.entries.find(e => compareKeys(e.key, key));
    if (!matchingEntry) {
      return { hit: false, archive };
    }

    return {
      hit: true,
      archive,
      copy: async (outputDir: string) => {
        const archivePath = resolvePath(location, matchingEntry.path);
        await extractArchive(archivePath, outputDir);
      },
    };
  }
}

function compareKeys(a?: CacheKey, b?: CacheKey): boolean {
  if (!a || !b) {
    return false;
  }
  return a.join(',') === b.join(',');
}

async function readCacheInfo(
  parentDir: string,
): Promise<CacheInfo | undefined> {
  const infoFile = resolvePath(parentDir, INFO_FILE);
  const exists = await fs.pathExists(infoFile);
  if (!exists) {
    return undefined;
  }

  const infoData = await fs.readFile(infoFile);
  const cacheInfo = JSON.parse(infoData.toString('utf8')) as CacheInfo;
  return cacheInfo;
}

async function writeCacheInfo(
  parentDir: string,
  cacheInfo: CacheInfo,
): Promise<void> {
  const infoData = Buffer.from(JSON.stringify(cacheInfo, null, 2), 'utf8');
  await fs.writeFile(resolvePath(parentDir, INFO_FILE), infoData);
}
