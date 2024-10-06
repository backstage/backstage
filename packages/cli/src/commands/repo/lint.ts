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
import { relative as relativePath } from 'path';
import { PackageGraph, BackstagePackageJson } from '@backstage/cli-node';
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

export async function command(opts: OptionValues, cmd: Command): Promise<void> {
  let packages = await PackageGraph.listTargetPackages();

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

  const resultsList = await runWorkerQueueThreads({
    items: packages.map(pkg => ({
      fullDir: pkg.dir,
      relativeDir: relativePath(paths.targetRoot, pkg.dir),
      lintOptions: parseLintScript(pkg.packageJson.scripts?.lint),
    })),
    workerData: {
      fix: Boolean(opts.fix),
      format: opts.format as string | undefined,
    },
    workerFactory: async ({ fix, format }) => {
      const { ESLint } = require('eslint') as typeof import('eslint');

      return async ({
        fullDir,
        relativeDir,
        lintOptions,
      }): Promise<{
        relativeDir: string;
        resultText: string;
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
        };
      };
    },
  });

  let failed = false;
  for (const { relativeDir, resultText, failed: runFailed } of resultsList) {
    if (runFailed) {
      console.log(chalk.red(`Lint failed in ${relativeDir}`));
      failed = true;

      // When doing repo lint, only list the results if the lint failed to avoid a log
      // dump of all warnings that might be irrelevant
      if (resultText) {
        console.log();
        console.log(resultText.trimStart());
      }
    }
  }

  if (failed) {
    process.exit(1);
  }
}
