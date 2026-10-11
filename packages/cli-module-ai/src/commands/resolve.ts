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
import { style, symbols } from '../lib/format';
import { resolveTargetAgents } from '../lib/detectAgent';
import {
  resolveSelection,
  type ResolveSelectionResult,
} from '../lib/resolveContext';

function formatResolveHuman(result: ResolveSelectionResult): string {
  const { context, decisions, agents } = result;
  const list = (refs: string[]) => (refs.length > 0 ? refs.join(', ') : '-');
  const field = (label: string, value: string) =>
    `${style.label(`${label}:`.padEnd(17))}${value}`;
  const lines = [
    field('Component', style.heading(context.componentRef)),
    field('Owner', context.owner ?? '-'),
    field('System', context.system ?? '-'),
    field('User', context.user),
    field('User groups', list(context.groupRefs)),
    field('Ancestor groups', list(context.ancestorGroupRefs)),
    field('Target agents', list(agents)),
  ];

  const selected = decisions.filter(d => d.status === 'selected');
  const skipped = decisions.filter(d => d.status !== 'selected');
  const width = Math.max(0, ...decisions.map(d => d.ref.length));
  const section = (title: string, items: typeof decisions, symbol: string) => {
    if (items.length === 0) return;
    lines.push('', style.heading(`${title} (${items.length})`));
    for (const item of items) {
      lines.push(
        `  ${symbol} ${style.ref(item.ref.padEnd(width))}  ${style.muted(
          item.reason,
        )}`,
      );
    }
  };
  if (decisions.length === 0) {
    lines.push('', '(no candidate skills)');
  }
  section('Selected', selected, symbols.ok);
  section('Skipped', skipped, symbols.skip);
  lines.push('', `${selected.length} selected, ${skipped.length} skipped`);
  return `${lines.join('\n')}\n`;
}

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
        output: {
          type: String,
          description: 'Output format: human (default), json',
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
      },
    },
    undefined,
    args,
  );

  if (flags.output && flags.output !== 'human' && flags.output !== 'json') {
    throw new Error(
      `Unknown --output "${flags.output}", expected "human" or "json"`,
    );
  }
  const agents = resolveTargetAgents(flags.agent);
  const result = await resolveSelection({
    entity: flags.entity,
    instance: flags.instance,
    agents,
    allowFileSources: Boolean(flags['allow-file-sources']),
  });

  if (flags.output === 'json') {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    process.stdout.write(formatResolveHuman(result));
  }
};
