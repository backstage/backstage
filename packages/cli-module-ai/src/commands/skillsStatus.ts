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
import { shortName, style, symbols } from '../lib/format';
import { resolveSelection } from '../lib/resolveContext';
import { planSkillsInvocations } from '../lib/runSkills';
import {
  isSkillInstalled,
  readSkillsLock,
  skillPresence,
} from '../lib/skillsLock';

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
        instance: {
          type: String,
          description: 'Name of the instance to use',
        },
        'allow-file-sources': {
          type: Boolean,
          description:
            'Allow skills whose source location is a local directory (file:)',
        },
        check: {
          type: Boolean,
          description: 'Exit with an error when any skill is missing',
        },
      },
    },
    undefined,
    args,
  );

  const agents = resolveTargetAgents(flags.agent);
  const { context, decisions } = await resolveSelection({
    entity: flags.entity,
    instance: flags.instance,
    agents,
    allowFileSources: Boolean(flags['allow-file-sources']),
  });
  const invocations = planSkillsInvocations(decisions, {
    agents,
    global: false,
  });

  const cwd = (await getRepoRoot()) ?? process.cwd();
  const lock = readSkillsLock(cwd);
  const isPresent = skillPresence(cwd, agents);
  const lines = [
    `${style.heading('Skill status')}${style.muted(
      `${
        context.componentRef ? ` for ${context.componentRef}` : ''
      } (${agents.join(', ')})`,
    )}`,
  ];
  let missing = 0;
  const width = Math.max(0, ...invocations.map(i => shortName(i.ref).length));
  for (const invocation of invocations) {
    const installed = isSkillInstalled(lock, invocation.source, isPresent, cwd);
    if (!installed) missing++;
    lines.push(
      `  ${installed ? symbols.ok : symbols.fail} ${style.ref(
        shortName(invocation.ref).padEnd(width),
      )}  ${style.muted(installed ? 'installed' : 'missing')}`,
    );
  }
  if (invocations.length === 0) {
    lines.push('  No applicable skills.');
  }
  lines.push(
    '',
    missing > 0
      ? `${
          invocations.length - missing
        } installed, ${missing} missing. Run "ai skills sync" to install them.`
      : `${invocations.length} installed, 0 missing.`,
  );
  process.stdout.write(`${lines.join('\n')}\n`);

  if (flags.check && missing > 0) {
    throw new Error(`${missing} skill(s) are not installed`);
  }
};
