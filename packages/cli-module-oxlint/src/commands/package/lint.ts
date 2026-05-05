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

import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { cli } from 'cleye';
import { targetPaths } from '@backstage/cli-common';
import type { CliCommandContext } from '@backstage/cli-node';
import { resolveOxlintBin, resolveOxlintConfig } from '../../lib/oxlint';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { fix, format, outputFile, maxWarnings },
    _: directories,
  } = cli(
    {
      help: { ...info, usage: `${info.usage} [directories...]` },
      booleanFlagNegation: true,
      parameters: ['[directories...]'],
      flags: {
        fix: {
          type: Boolean,
          description: 'Attempt to automatically fix violations',
        },
        format: {
          type: String,
          description:
            'Output format (default, checkstyle, github, gitlab, json, junit, sarif, stylish, unix)',
          default: 'default',
        },
        outputFile: {
          type: String,
          description: 'Write the lint report to a file instead of stdout',
        },
        maxWarnings: {
          type: Number,
          description:
            'Specify a warning threshold, which can be used to force exit with an error status if there are too many warning-level rule violations',
        },
      },
    },
    undefined,
    args,
  );

  const oxlintArgs: string[] = [];

  const configPath = resolveOxlintConfig(targetPaths.dir);
  if (configPath) {
    oxlintArgs.push('-c', configPath);
  }

  oxlintArgs.push('--type-aware', '--type-check');

  if (fix) {
    oxlintArgs.push('--fix');
  }

  if (format && format !== 'default') {
    oxlintArgs.push('--format', format);
  }

  if (maxWarnings !== undefined) {
    oxlintArgs.push('--max-warnings', String(maxWarnings));
  }

  oxlintArgs.push(...(directories.length ? directories : ['.']));

  const result = spawnSync(resolveOxlintBin(), oxlintArgs, {
    cwd: targetPaths.dir,
    stdio: outputFile ? ['inherit', 'pipe', 'inherit'] : 'inherit',
  });

  if (outputFile && result.stdout) {
    writeFileSync(outputFile, result.stdout);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};
