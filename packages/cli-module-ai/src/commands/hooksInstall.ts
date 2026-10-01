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
import fs from 'node:fs';
import type { CliCommandContext } from '@backstage/cli-node';
import { getRepoRoot } from '../lib/gitRemote';
import { installHooks } from '../lib/installHooks';

export default async ({ args, info }: CliCommandContext) => {
  const { flags } = cli(
    {
      name: info.usage,
      flags: {
        agent: {
          type: [String] as const,
          description: 'Agent to install the hook for, repeatable (required)',
          default: [] as string[],
        },
        instance: {
          type: String,
          description: 'Name of the instance the hook uses',
        },
        'dry-run': {
          type: Boolean,
          description: 'Print the resulting hook files without writing them',
        },
      },
    },
    undefined,
    args,
  );

  if (flags.agent.length === 0) {
    throw new Error(
      'Pass --agent <id> at least once (for example claude-code or codex).',
    );
  }
  // The hook runs the CLI that is running this command, by absolute path.
  const entryPoint = process.argv[1];
  if (!entryPoint) {
    throw new Error('Could not determine the path of the running CLI');
  }

  const results = await installHooks({
    agents: flags.agent,
    rootDir: (await getRepoRoot()) ?? process.cwd(),
    execPath: process.execPath,
    scriptPath: fs.realpathSync(entryPoint),
    instance: flags.instance,
    dryRun: Boolean(flags['dry-run']),
  });

  for (const result of results) {
    if (result.written) {
      process.stdout.write(
        `Installed the ${result.agent} hook in ${result.file}\n`,
      );
    } else {
      process.stdout.write(`Would write ${result.file}:\n${result.json}`);
    }
  }
};
