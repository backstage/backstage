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
import { runPlain, runCheck } from 'lib/run';
import { Options } from './options';
import { extractArchive, createArchive } from './archive';
import { paths } from 'lib/paths';
import { version, isDev } from 'lib/version';

const INFO_FILE = '.backstage-build-cache';

// Result from a cache query
export type CacheQueryResult = {
  // True if there was a cache hit
  hit: boolean;
  // If there is a cache hit and this method is defined, it needs to be called to restore the
  // output contents before continuing.
  copy?: (outputDir: string) => Promise<void>;
  // Call after a successful build to archive the output content.
  // The content will be archived using the same key as was used to query the cache.
  archive: (outputDir: string, maxEntries: number) => Promise<void>;
};

// Key that determines whether cached output can be reused
export type CacheKey = string[];

type CacheEntry = {
  // Key for the input of this cache entry
  key: CacheKey;
  // Path to the archive of this cache entry
  path: string;
};

// Struct containing information about cache entries on the filesystem.
// Stored inside the INFO_FILE as JSON.
type CacheInfo = {
  // Optional key entry for the contents of the current directory. Used to key the
  // output present in the outputs folder, where the info file resides inside the output folder.
  key?: CacheKey;
  // Optional list of cache archives present in the same directory. Resides in the external
  // cache location inside one info file for each package.
  entries?: CacheEntry[];
};

export class Cache {
  // Read the current cache state form the filesystem.
  static async read(options: Options) {
    const relativePackagePath = relativePath(paths.targetRoot, paths.targetDir);
    const location = resolvePath(options.cacheDir, relativePackagePath);

    const outputInfo = await readCacheInfo(options.output);
    const localKey = outputInfo?.key;

    const { entries = [] } = (await readCacheInfo(location)) ?? {};
    return new Cache(location, entries, localKey);
  }

  // Generates a key based on the contents of the input paths.
  // Returns undefined if it's not possible to generate a stable key.
  static async readInputKey(
    inputPaths: string[],
  ): Promise<CacheKey | undefined> {
    const allInputPaths = inputPaths.slice();

    // If we're executing the cli inside the backstage repo, we add the cli src as cache key as well
    if (isDev) {
      allInputPaths.unshift(paths.ownDir);
    }

    // Make sure we don't have any uncommitted changes to the input, in that case we skip caching.
    const noChanges = await runCheck(
      'git',
      'diff',
      '--quiet',
      'HEAD',
      '--',
      ...allInputPaths,
    );
    if (!noChanges) {
      return undefined;
    }

    const trees = [];
    for (const inputPath of allInputPaths) {
      const output = await runPlain('git', 'ls-tree', 'HEAD', inputPath);
      const [, , sha] = output.split(/\s+/, 3);
      // If we can't get a tree sha it means we're outside of tracked files, so treat as dirty
      if (!sha) {
        return undefined;
      }
      trees.push(sha);
    }

    if (isDev) {
      return trees;
    }
    // If we're executing as a dependency, use the version as a key
    return [version, ...trees];
  }

  constructor(
    private readonly location: string,
    private readonly entries: CacheEntry[] = [],
    private readonly localKey?: CacheKey,
  ) {}

  // Query for the presense of cached output for a given key
  query(key: CacheKey): CacheQueryResult {
    const { location } = this;

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

// Compares to cache keys, returning true if they are both defined and equal
function compareKeys(a?: CacheKey, b?: CacheKey): boolean {
  if (!a || !b) {
    return false;
  }
  return a.join(',') === b.join(',');
}

// Read and parse a cache info file in the given directory
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

// Write a cache info file to the given directory
async function writeCacheInfo(
  parentDir: string,
  cacheInfo: CacheInfo,
): Promise<void> {
  const infoData = Buffer.from(JSON.stringify(cacheInfo, null, 2), 'utf8');
  await fs.writeFile(resolvePath(parentDir, INFO_FILE), infoData);
}
