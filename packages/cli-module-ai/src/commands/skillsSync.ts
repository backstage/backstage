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
import { getRepoRoot } from '../lib/gitRemote';
import { resolveTargetAgents } from '../lib/detectAgent';
import { resolveSelection } from '../lib/resolveContext';
import {
  assertSkillsNodeVersion,
  createSkillsRunner,
  formatSkillsCommand,
  planSkillsInvocations,
  runSkills,
} from '../lib/runSkills';

export default async ({ args, info }: CliCommandContext) => {
  const { flags } = cli(
    {
      name: info.usage,
      flags: {
        entity: {
          type: String,
          description:
            'Component to resolve against (skips git remote detection)',
        },
        agent: {
          type: [String] as const,
          description: 'Target agent, repeatable (default: detected)',
          default: [] as string[],
        },
        global: {
          type: Boolean,
          description:
            'Install into the user-level skills directories instead of the project',
        },
        'dry-run': {
          type: Boolean,
          description: 'Print the skills commands without running them',
        },
        instance: {
          type: String,
          description: 'Name of the instance to use',
        },
      },
    },
    undefined,
    args,
  );

  const agents = resolveTargetAgents(flags.agent);
  const { decisions } = await resolveSelection({
    entity: flags.entity,
    instance: flags.instance,
    agents,
  });

  for (const decision of decisions) {
    if (decision.status === 'skipped') {
      process.stderr.write(`Skipped ${decision.ref}: ${decision.reason}\n`);
    }
  }

  const invocations = planSkillsInvocations(decisions, {
    agents,
    global: Boolean(flags.global),
  });
  if (invocations.length === 0) {
    process.stdout.write('No applicable skills to install.\n');
    return;
  }

  if (flags['dry-run']) {
    for (const invocation of invocations) {
      process.stdout.write(`${formatSkillsCommand(invocation)}\n`);
    }
    return;
  }

  assertSkillsNodeVersion();

  // skills installs project skills into its working directory, so run it from
  // the repository root rather than wherever the command was started.
  const cwd = flags.global ? undefined : await getRepoRoot();
  const { failed } = await runSkills(
    invocations,
    createSkillsRunner(),
    undefined,
    cwd,
  );
  if (failed.length > 0) {
    throw new Error(`skills add failed for: ${failed.join(', ')}`);
  }
};
