/*
 * Copyright 2023 The Backstage Authors
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
import { exec } from '../../../../lib/exec';
import { getPathToCurrentOpenApiSpec } from '../../../../lib/openapi/helpers';
import { paths as cliPaths } from '../../../../lib/paths';
import { OptionValues } from 'commander';
import { env } from 'process';
import { readFile, rm } from 'fs/promises';
import { resolve } from 'path';

const reduceOpticOutput = (output: string) => {
  return output
    .split('\n')
    .filter(e => !e.startsWith('Rerun') && e.trim())
    .join('\n');
};

async function check(opts: OptionValues) {
  const resolvedOpenapiPath = await getPathToCurrentOpenApiSpec();

  let baseRef = opts.since;
  if (!baseRef) {
    const { stdout: branch } = await exec(
      'git merge-base --fork-point origin/master',
    );
    baseRef = branch.toString().trim();
  }

  let failed = false;
  let output = '';
  try {
    const { stdout } = await exec(
      'yarn optic diff',
      [
        resolvedOpenapiPath,
        '--check',
        opts.json ? '--json' : '',
        '--base',
        baseRef,
      ],
      {
        cwd: cliPaths.targetRoot,
        env: { CI: opts.json ? '1' : undefined, ...env },
      },
    );
    output = stdout.toString();
  } catch (err) {
    output = err.stdout;
    failed = true;
  }

  if (opts.json) {
    const file = (
      await readFile(resolve(cliPaths.targetRoot, 'ci-run-details.json'))
    ).toString();
    const results = JSON.parse(file);
    console.log(file);
    if (!opts.ignore && results.failed) {
      throw new Error('Some checks failed');
    }

    await rm(resolve(cliPaths.targetRoot, 'ci-run-details.json'));
  } else {
    console.log(reduceOpticOutput(output));
    if (!opts.ignore && failed) {
      throw new Error('Some checks failed');
    }
  }
}

export async function command(opts: OptionValues) {
  try {
    await check(opts);
    if (!opts.json) console.log(chalk.green(`All checks passed.`));
  } catch (err) {
    if (!opts.json) console.log(chalk.red(err.message));
    process.exit(1);
  }
}
