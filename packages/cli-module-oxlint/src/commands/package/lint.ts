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

import { cli } from 'cleye';
import { targetPaths } from '@backstage/cli-common';
import type { CliCommandContext } from '@backstage/cli-node';
import { executeOxlint } from '../../lib/executeOxlint';

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
            'Fail if more than this number of warnings. -1 allows warnings. (default: -1)',
        },
      },
    },
    undefined,
    args,
  );

  await executeOxlint({
    targets: [
      {
        configDir: targetPaths.dir,
        directories: directories.length ? directories : ['.'],
      },
    ],
    cwd: targetPaths.dir,
    command: 'package lint',
    fix,
    format,
    outputFile,
    maxWarnings,
  });
};
