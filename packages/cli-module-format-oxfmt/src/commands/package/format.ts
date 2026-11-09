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
import type { CliCommandContext } from '@backstage/cli-node';
import { runFormatter } from '../../lib/runFormatter';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { check, includeIgnored },
    _: paths,
  } = cli(
    {
      name: info.usage,
      booleanFlagNegation: true,
      parameters: ['[paths...]'],
      flags: {
        check: {
          type: Boolean,
          description:
            'List the files that need formatting and fail if there are any, without writing them',
        },
        includeIgnored: {
          type: Boolean,
          description:
            'Format the given paths even if the ignore files of the project list them',
        },
      },
    },
    undefined,
    args,
  );

  await runFormatter({
    name: 'oxfmt',
    paths,
    modeArgs: [check ? '--check' : '--write'],
    includeIgnored,
    // Paths that are ignored or match no files are skipped instead of failing,
    // which matches how Prettier treats them
    extraArgs: ['--no-error-on-unmatched-pattern'],
  });
};
