/*
 * Copyright 2025 The Backstage Authors
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
import { readFile, writeFile, cp } from 'fs/promises';
import globby from 'globby';
import { dirname, join as joinPath, relative } from 'path';
import crypto from 'crypto';
import { Lockfile } from '@backstage/cli-node';
import { paths as cliPaths } from '../../lib/paths';
import { mkdirp } from 'fs-extra';
import { z } from 'zod';

const version = '1';
const CACHE_FILE = 'cache.json';

interface CacheEntry {
  hash: string;
  packageName: string;
  restoreTo: string;
  version: string;
}

const cacheEntrySchema = z.object({
  hash: z.string(),
  packageName: z.string(),
  restoreTo: z.string(),
  version: z.string(),
});

export class PackageDocsCache {
  // A map of package directory to package hash.
  private keyCache: Map<string, string>;
  constructor(
    private readonly lockfile: Lockfile,
    // A map of package directory to cache entry.
    private readonly cache: Map<string, CacheEntry>,
    private readonly cacheDir: string,
  ) {
    this.keyCache = new Map();
  }
  static async loadAsync(cacheDir: string, lockfile: Lockfile) {
    const cacheFiles = await globby(`**/${CACHE_FILE}`, {
      cwd: cacheDir,
    });
    const map = new Map<string, CacheEntry>();
    for (const file of cacheFiles) {
      const pkg = dirname(file);
      const cache = await readFile(joinPath(cacheDir, file), 'utf-8');
      try {
        const cacheJson = JSON.parse(cache);
        const parsed = cacheEntrySchema.parse(cacheJson);
        map.set(pkg, parsed);
      } catch (e) {
        console.error(`Skipping unparseable cache file ${file}: ${e}`);
      }
    }
    return new PackageDocsCache(lockfile, map, cacheDir);
  }

  async directoryToName(directory: string) {
    const packageJson = await readFile(
      joinPath(directory, 'package.json'),
      'utf-8',
    );
    return JSON.parse(packageJson).name;
  }

  async toKey(pkg: string) {
    if (this.keyCache.has(pkg)) {
      return this.keyCache.get(pkg)!;
    }
    const name = await this.directoryToName(pkg);
    const result = await globby('src/**', {
      gitignore: true,
      onlyFiles: true,
      cwd: pkg,
    });

    const hash = crypto.createHash('sha1');
    hash.update(version);
    hash.update('\0');

    for (const path of result.sort()) {
      const absPath = cliPaths.resolveTargetRoot(pkg, path);
      const pathInPackage = joinPath(absPath, path);
      hash.update(pathInPackage);
      hash.update('\0');
      hash.update(await readFile(absPath));
      hash.update('\0');
    }
    hash.update(this.lockfile.getDependencyTreeHash(name));
    hash.update('\0');
    const hashString = hash.digest('hex');
    this.keyCache.set(pkg, hashString);
    return hashString;
  }

  async has(pkg: string) {
    const cache = this.cache.get(pkg);
    if (!cache) {
      return false;
    }
    const hashString = await this.toKey(pkg);
    return cache.hash === hashString;
  }

  async restore(pkg: string) {
    if (!this.has(pkg)) {
      throw new Error(`Cache entry for ${pkg} not found`);
    }
    const cacheEntry = this.cache.get(pkg);
    const restoreTo = cacheEntry!.restoreTo;
    const cacheDir = joinPath(this.cacheDir, pkg);
    const contentsDir = joinPath(cacheDir, 'contents');

    const targetDir = cliPaths.resolveTargetRoot(restoreTo);
    await mkdirp(targetDir);
    await cp(contentsDir, targetDir, { recursive: true });
  }

  async write(pkg: string, contentDirectory: string) {
    const cacheDir = joinPath(this.cacheDir, pkg);
    const contentsDir = joinPath(cacheDir, 'contents');
    await mkdirp(contentsDir);
    const hashString = await this.toKey(pkg);
    await cp(contentDirectory, contentsDir, { recursive: true });
    const cacheEntry: CacheEntry = {
      hash: hashString,
      packageName: await this.directoryToName(pkg),
      restoreTo: relative(cliPaths.resolveTargetRoot(), contentDirectory),
      version,
    };
    await writeFile(joinPath(cacheDir, CACHE_FILE), JSON.stringify(cacheEntry));
  }
}
