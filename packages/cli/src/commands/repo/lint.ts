/*
 * Copyright 2020 The Backstage Authors
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

import chalk from 'chalk';
import { Command, OptionValues } from 'commander';
import fs from 'fs-extra';
import { createHash } from 'crypto';
import { relative as relativePath, resolve as resolvePath } from 'path';
import {
  PackageGraph,
  BackstagePackageJson,
  Lockfile,
} from '@backstage/cli-node';
import { paths } from '../../lib/paths';
import { runWorkerQueueThreads } from '../../lib/parallel';
import { createScriptOptionsParser } from './optionsParser';

function depCount(pkg: BackstagePackageJson) {
  const deps = pkg.dependencies ? Object.keys(pkg.dependencies).length : 0;
  const devDeps = pkg.devDependencies
    ? Object.keys(pkg.devDependencies).length
    : 0;
  return deps + devDeps;
}

const CACHE_FILE_NAME = 'lint-cache.json';

type Cache = string[];

async function readCache(dir: string): Promise<Cache | undefined> {
  try {
    const data = await fs.readJson(resolvePath(dir, CACHE_FILE_NAME));
    if (!Array.isArray(data)) {
      return undefined;
    }
    if (data.some(x => typeof x !== 'string')) {
      return undefined;
    }
    return data as Cache;
  } catch {
    return undefined;
  }
}

async function writeCache(dir: string, cache: Cache) {
  await fs.mkdirp(dir);
  await fs.writeJson(resolvePath(dir, CACHE_FILE_NAME), cache, { spaces: 2 });
}

export async function command(opts: OptionValues, cmd: Command): Promise<void> {
  let packages = await PackageGraph.listTargetPackages();

  const cacheDir = resolvePath(
    opts.successCacheDir ?? 'node_modules/.cache/backstage-cli',
  );
  const cacheContext = opts.successCache
    ? {
        cache: await readCache(cacheDir),
        lockfile: await Lockfile.load(paths.resolveTargetRoot('yarn.lock')),
      }
    : undefined;

  if (opts.since) {
    const graph = PackageGraph.fromPackages(packages);
    packages = await graph.listChangedPackages({
      ref: opts.since,
      analyzeLockfile: true,
    });
  }

  // Packages are ordered from most to least number of dependencies, as a
  // very cheap way of guessing which packages are more likely to be larger.
  packages.sort((a, b) => depCount(b.packageJson) - depCount(a.packageJson));

  // This formatter uses the cwd to format file paths, so let's have that happen from the root instead
  if (opts.format === 'eslint-formatter-friendly') {
    process.chdir(paths.targetRoot);
  }

  // Make sure lint output is colored unless the user explicitly disabled it
  if (!process.env.FORCE_COLOR) {
    process.env.FORCE_COLOR = '1';
  }

  const parseLintScript = createScriptOptionsParser(cmd, ['package', 'lint']);

  const items = await Promise.all(
    packages.map(async pkg => {
      const lintOptions = parseLintScript(pkg.packageJson.scripts?.lint);
      const base = {
        fullDir: pkg.dir,
        relativeDir: relativePath(paths.targetRoot, pkg.dir),
        lintOptions,
        parentHash: undefined,
      };

      if (!cacheContext) {
        return base;
      }

      const hash = createHash('sha1');

      hash.update(
        cacheContext.lockfile.getDependencyTreeHash(pkg.packageJson.name),
      );
      hash.update('\0');
      hash.update(JSON.stringify(lintOptions ?? {}));
      hash.update('\0');
      hash.update(process.version); // Node.js version
      hash.update('\0');
      hash.update('v1'); // The version of this implementation

      return {
        ...base,
        parentHash: hash.digest('hex'),
      };
    }),
  );

  const resultsList = await runWorkerQueueThreads({
    items: items.filter(item => item.lintOptions), // Filter out packages without lint script
    workerData: {
      fix: Boolean(opts.fix),
      format: opts.format as string | undefined,
      shouldCache: Boolean(cacheContext),
      successCache: cacheContext?.cache,
      rootDir: paths.targetRoot,
    },
    workerFactory: async ({
      fix,
      format,
      shouldCache,
      successCache,
      rootDir,
    }) => {
      const { ESLint } = require('eslint') as typeof import('eslint');
      const crypto = require('crypto') as typeof import('crypto');
      const globby = require('globby') as typeof import('globby');
      const { readFile } =
        require('fs/promises') as typeof import('fs/promises');
      const { relative: workerRelativePath } =
        require('path') as typeof import('path');

      return async ({
        fullDir,
        relativeDir,
        lintOptions,
        parentHash,
      }): Promise<{
        relativeDir: string;
        sha?: string;
        resultText?: string;
        failed: boolean;
      }> => {
        // Bit of a hack to make file resolutions happen from the correct directory
        // since some lint rules don't respect the cwd of ESLint
        process.cwd = () => fullDir;

        const start = Date.now();
        const eslint = new ESLint({
          cwd: fullDir,
          fix,
          extensions: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'],
        });

        let sha: string | undefined = undefined;
        if (shouldCache) {
          const result = await globby(relativeDir, {
            gitignore: true,
            onlyFiles: true,
            cwd: rootDir,
          });

          const hash = crypto.createHash('sha1');
          hash.update(parentHash!);
          hash.update('\0');

          for (const path of result.sort()) {
            if (await eslint.isPathIgnored(path)) {
              continue;
            }
            hash.update(workerRelativePath(fullDir, path));
            hash.update('\0');
            hash.update(await readFile(path));
            hash.update('\0');
            hash.update(
              JSON.stringify(await eslint.calculateConfigForFile(path)),
            );
            hash.update('\0');
          }
          sha = await hash.digest('hex');
          if (successCache?.includes(sha)) {
            console.log(`Skipped ${relativeDir} due to cache hit`);
            return { relativeDir, sha, failed: false };
          }
        }

        const formatter = await eslint.loadFormatter(format);

        const results = await eslint.lintFiles(['.']);

        const count = String(results.length).padStart(3);
        const time = ((Date.now() - start) / 1000).toFixed(2);
        console.log(`Checked ${count} files in ${relativeDir} ${time}s`);

        if (fix) {
          await ESLint.outputFixes(results);
        }

        const maxWarnings = lintOptions?.maxWarnings ?? 0;
        const resultText = formatter.format(results) as string;
        const failed =
          results.some(r => r.errorCount > 0) ||
          results.reduce((current, next) => current + next.warningCount, 0) >
            maxWarnings;

        return {
          relativeDir,
          resultText,
          failed,
          sha,
        };
      };
    },
  });

  const outputSuccessCache = [];

  let failed = false;
  for (const {
    relativeDir,
    resultText,
    failed: runFailed,
    sha,
  } of resultsList) {
    if (runFailed) {
      console.log(chalk.red(`Lint failed in ${relativeDir}`));
      failed = true;

      // When doing repo lint, only list the results if the lint failed to avoid a log
      // dump of all warnings that might be irrelevant
      if (resultText) {
        console.log();
        console.log(resultText.trimStart());
      }
    } else if (sha) {
      outputSuccessCache.push(sha);
    }
  }

  if (cacheContext) {
    await writeCache(cacheDir, outputSuccessCache);
  }

  if (failed) {
    process.exit(1);
  }
}
