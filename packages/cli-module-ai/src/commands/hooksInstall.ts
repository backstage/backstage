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
import { getMainCheckoutRoot, getRepoRoot } from '../lib/gitRemote';
import { style, symbols } from '../lib/format';
import { installHooks } from '../lib/installHooks';

/** Drops the machine specific node and CLI paths, they only add noise. */
function shortCommand(command: string): string {
  const index = command.indexOf(' ai skills sync');
  return index < 0 ? command : `backstage-cli${command.slice(index)}`;
}

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
        'allow-file-sources': {
          type: Boolean,
          description:
            'Let the hook install skills whose source location is a local directory (file:)',
        },
        verbose: {
          type: Boolean,
          description: 'Print the full resulting hook files on a dry run',
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
    // Claude Code reads settings.local.json from the main checkout's root, also
    // when it runs in a worktree.
    rootDir:
      (await getMainCheckoutRoot()) ?? (await getRepoRoot()) ?? process.cwd(),
    execPath: process.execPath,
    scriptPath: fs.realpathSync(entryPoint),
    instance: flags.instance,
    allowFileSources: Boolean(flags['allow-file-sources']),
    dryRun: Boolean(flags['dry-run']),
  });

  for (const result of results) {
    const preserved =
      result.preservedSettings > 0
        ? `, ${result.preservedSettings} other setting(s) kept as they were`
        : '';
    if (result.written) {
      process.stdout.write(
        `${symbols.ok} Installed the ${result.agent} hook in ${result.file}\n`,
      );
      process.stdout.write(
        `  ${style.muted(`runs: ${shortCommand(result.command)}`)}\n`,
      );
      if (result.notice) {
        process.stdout.write(`  ${result.notice}\n`);
      }
      if (result.excludedFrom) {
        process.stdout.write(
          `  Added the file to ${result.excludedFrom} so that it is not committed\n`,
        );
      }
    } else {
      process.stdout.write(
        `Would write ${result.file} (${result.agent}${preserved})\n`,
      );
      process.stdout.write(
        `  SessionStart ${symbols.ok} ${style.muted(
          shortCommand(result.command),
        )}\n`,
      );
      if (flags.verbose) {
        process.stdout.write(`\n${result.json}`);
      }
    }
  }
};
