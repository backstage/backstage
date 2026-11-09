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
import { relative as relativePath, sep, posix } from 'node:path';
import { DEFAULT_BASE_REF } from '../../../../lib/openapi/constants';
import { getPathToCurrentOpenApiSpec } from '../../../../lib/openapi/helpers';
import { ensureOasdiffInstalled } from '../../../util';
import { OptionValues } from 'commander';
import { runOutput, targetPaths } from '@backstage/cli-common';

async function check(opts: OptionValues) {
  await ensureOasdiffInstalled();

  const resolvedOpenapiPath = await getPathToCurrentOpenApiSpec();
  const relativeSpecPath = relativePath(
    targetPaths.rootDir,
    resolvedOpenapiPath,
  )
    .split(sep)
    .join(posix.sep);

  let baseRef = opts.since;
  if (!baseRef) {
    baseRef = await runOutput(
      ['git', 'merge-base', '--fork-point', DEFAULT_BASE_REF],
      { env: { FORCE_COLOR: undefined } },
    );
  }

  const baseSpec = `${baseRef}:${relativeSpecPath}`;
  const subcommand = opts.json ? 'changelog' : 'breaking';
  const formatArgs = opts.json ? ['--format', 'json'] : [];
  const failArgs = !opts.ignore && !opts.json ? ['--fail-on', 'ERR'] : [];

  let output = '';
  let failed = false;
  try {
    output = await runOutput(
      [
        'oasdiff',
        subcommand,
        baseSpec,
        relativeSpecPath,
        ...formatArgs,
        ...failArgs,
      ],
      { cwd: targetPaths.rootDir, env: { FORCE_COLOR: undefined } },
    );
  } catch (err) {
    output = (err as { stdout?: string }).stdout ?? '';
    failed = true;
  }

  console.log(output);

  if (failed && !opts.ignore) {
    throw new Error('Breaking changes found');
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
