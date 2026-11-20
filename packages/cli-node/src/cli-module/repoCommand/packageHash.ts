/*
 * Copyright 2026 The Backstage Authors
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

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { runOutput } from '@backstage/cli-common';
import type { Lockfile, PackageGraph } from '../../monorepo';
import type { SelectedPackage } from './selectPackages';

/** Bump when the way hashes are calculated changes */
const IMPLEMENTATION_VERSION = 'v1';

/** @internal */
export interface PackageHasherDeps {
  /** Lists the files of a directory that are tracked or not ignored */
  listFiles(dir: string): Promise<string[]>;
  readFile(file: string): Promise<Buffer>;
}

const defaultDeps: PackageHasherDeps = {
  async listFiles(dir) {
    const output = await runOutput(
      ['git', 'ls-files', '-z', '--cached', '--others', '--exclude-standard'],
      { cwd: dir },
    );
    return output.split('\0').filter(Boolean);
  },
  readFile: file => fs.readFile(file),
};

/**
 * Calculates hashes of packages that include the contents of their files, and
 * of their local dependencies, including uncommitted changes.
 *
 * Directory hashes are memoized, so a new hasher should be created for each
 * run in order to pick up changes made in between.
 *
 * @internal
 */
export function createPackageHasher(options: {
  graph: PackageGraph;
  lockfile: Lockfile;
  /** Identifies what is being run, which is part of every hash */
  target: {
    name: string;
    packageCommand: string[];
  };
  deps?: PackageHasherDeps;
}) {
  const { graph, lockfile, target } = options;
  const deps = options.deps ?? defaultDeps;
  const dirHashes = new Map<string, Promise<string>>();

  const hashDir = (dir: string) => {
    let result = dirHashes.get(dir);
    if (!result) {
      result = (async () => {
        const files = (await deps.listFiles(dir)).sort();
        const hash = crypto.createHash('sha1');
        for (const file of files) {
          let content: Buffer;
          try {
            content = await deps.readFile(path.resolve(dir, file));
          } catch (error) {
            // Tracked files that have been deleted are not part of the contents
            if (error.code === 'ENOENT') {
              continue;
            }
            throw error;
          }
          hash.update(`${file}\0`);
          hash.update(content);
          hash.update('\0');
        }
        return hash.digest('hex');
      })();
      dirHashes.set(dir, result);
    }
    return result;
  };

  return async (item: SelectedPackage, packageArgs: string[]) => {
    const name = item.pkg.packageJson.name;
    const hash = crypto.createHash('sha1');
    hash.update(
      [
        IMPLEMENTATION_VERSION,
        process.version,
        target.name,
        target.packageCommand.join(' '),
        JSON.stringify([...item.scriptArgs, ...packageArgs]),
        lockfile.getDependencyTreeHash(name),
        await hashDir(item.pkg.dir),
      ].join('\0'),
    );

    // All local dependencies, not only the direct ones, since a change in
    // any of them can affect the result
    const dependencyNames = Array.from(
      graph.collectPackageNames([name], dep => dep.allLocalDependencies.keys()),
    )
      .filter(depName => depName !== name)
      .sort();
    for (const depName of dependencyNames) {
      const dep = graph.get(depName);
      if (dep) {
        hash.update(`\0${depName}:${await hashDir(dep.dir)}`);
      }
    }
    return hash.digest('hex');
  };
}
