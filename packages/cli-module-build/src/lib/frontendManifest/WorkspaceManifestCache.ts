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

import { BackstagePackageJson } from '@backstage/cli-node';
import { createHash } from 'node:crypto';
import fs from 'fs-extra';
import { join as joinPath, relative as relativePath } from 'node:path';
import {
  analyzeFrontendPackage,
  ANALYZER_VERSION,
  FrontendPackageAnalysis,
} from './analyzeFrontendPackage';
import { readEntryPoints } from '../entryPoints';

async function listFiles(dir: string): Promise<string[]> {
  if (!(await fs.pathExists(dir))) {
    return [];
  }
  const files = new Array<string>();
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const path = joinPath(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules') {
        files.push(...(await listFiles(path)));
      }
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
}

/**
 * Hashes everything that the analysis of a package reads: its package.json
 * and its source files.
 */
async function hashPackage(packageDir: string): Promise<string> {
  const hash = createHash('sha256');
  hash.update(`analyzer-v${ANALYZER_VERSION}\0`);
  hash.update(await fs.readFile(joinPath(packageDir, 'package.json')));
  const files = (await listFiles(joinPath(packageDir, 'src'))).sort();
  for (const file of files) {
    hash.update(`\0${relativePath(packageDir, file)}\0`);
    hash.update(await fs.readFile(file));
  }
  return hash.digest('hex');
}

/**
 * Analyzes workspace packages from source, and caches the results on disk
 * keyed by a hash of the package contents. Results are also kept in memory
 * until the package is invalidated, for example when its source changes.
 */
export class WorkspaceManifestCache {
  readonly #cacheDir: string;
  readonly #results = new Map<string, Promise<FrontendPackageAnalysis>>();

  constructor(cacheDir: string) {
    this.#cacheDir = cacheDir;
  }

  invalidate(packageDir: string) {
    this.#results.delete(packageDir);
  }

  analyze(
    packageDir: string,
    packageJson: BackstagePackageJson,
  ): Promise<FrontendPackageAnalysis> {
    let result = this.#results.get(packageDir);
    if (!result) {
      result = this.#analyze(packageDir, packageJson);
      this.#results.set(packageDir, result);
      // A failure is not kept, so that the next attempt runs it again
      result.catch(() => this.#results.delete(packageDir));
    }
    return result;
  }

  async #analyze(
    packageDir: string,
    packageJson: BackstagePackageJson,
  ): Promise<FrontendPackageAnalysis> {
    const key = await hashPackage(packageDir);
    const cachePath = joinPath(
      this.#cacheDir,
      `${packageJson.name
        .replace(/[^a-zA-Z0-9_-]+/g, '-')
        .replace(/^-+/, '')}.json`,
    );
    try {
      const cached = await fs.readJson(cachePath);
      if (cached?.key === key && cached.result) {
        return cached.result;
      }
    } catch {
      // A missing or broken cache entry is replaced below
    }

    const result = analyzeFrontendPackage({
      packageDir,
      entryPoints: readEntryPoints(packageJson),
    });
    await fs.outputJson(cachePath, { key, result });
    return result;
  }
}
