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

import chalk from 'chalk';
import type { GroupedActions } from './ActionsClient';
import type { CleyeFlag } from './schemaToFlags';

async function renderMarkdown(text: string): Promise<string> {
  const { Marked } = await import('marked');
  const { markedTerminal } = await import('marked-terminal');
  const stripAnsi = (await import('strip-ansi')).default;

  const instance = new Marked(markedTerminal());
  const sanitized = stripAnsi(text);
  return instance.parse(sanitized) as string;
}

function dedent(text: string): string {
  const trimmed = text.replace(/^\n+/, '').replace(/\n+$/, '');
  const lines = trimmed.split('\n');
  const nonEmptyLines = lines.filter(l => l.trim().length > 0);
  if (nonEmptyLines.length === 0) return trimmed;
  const minIndent = Math.min(
    ...nonEmptyLines.map(l => l.match(/^(\s*)/)![0].length),
  );
  if (minIndent === 0) return trimmed;
  return lines.map(l => l.slice(minIndent)).join('\n');
}

function terminalWidth(): number {
  return process.stdout.columns || 80;
}

export function formatActionList(grouped: GroupedActions): string {
  const width = terminalWidth();
  const lines: string[] = [];

  for (let i = 0; i < grouped.length; i++) {
    const { pluginId, actions } = grouped[i];

    if (i > 0) {
      lines.push('');
    }

    const header = `── ${pluginId} `;
    const remaining = Math.max(0, width - header.length);
    lines.push(chalk.bold(`${header}${'─'.repeat(remaining)}`));
    lines.push('');

    if (actions.length === 0) {
      lines.push(`  ${chalk.dim('(no actions)')}`);
      continue;
    }

    const maxIdLen = Math.max(...actions.map(a => a.id.length));
    const idColWidth = maxIdLen + 4;

    for (const action of actions) {
      const paddedId = action.id.padEnd(idColWidth);

      if (!action.title) {
        lines.push(`  ${chalk.cyan(paddedId.trimEnd())}`);
        continue;
      }

      lines.push(`  ${chalk.cyan(paddedId)}${chalk.dim(action.title)}`);
    }
  }

  return lines.join('\n');
}

export type FlagInfo = {
  name: string;
  type: string;
  description?: string;
};

const typeHintNames: Record<string, string> = {
  String: 'string',
  Number: 'number',
  Boolean: '',
};

export function flagDefsToFlagInfo(
  defs: Record<string, CleyeFlag>,
): FlagInfo[] {
  return Object.entries(defs).map(([name, def]) => ({
    name,
    type: typeHintNames[def.type.name] ?? 'string',
    description: def.description,
  }));
}

export async function formatActionHelp(options: {
  action: {
    id: string;
    title?: string;
    description?: string;
  };
  usage: string;
  flags: FlagInfo[];
}): Promise<string> {
  const { action, usage, flags } = options;
  const lines: string[] = [];

  lines.push(chalk.bold.cyan(action.id));

  if (action.title) {
    lines.push(`  ${action.title}`);
  }

  if (action.description) {
    lines.push('');
    const dedented = dedent(action.description);
    const rendered = await renderMarkdown(dedented);
    lines.push(rendered.trimEnd());
  }

  lines.push('');
  lines.push(chalk.bold('Usage:'));
  lines.push(`  ${usage} ${chalk.dim('[flags]')}`);

  if (flags.length > 0) {
    lines.push('');
    lines.push(chalk.bold('Flags:'));

    const maxFlagLen = Math.max(
      ...flags.map(f => {
        const typeHint = f.type ? ` <${f.type}>` : '';
        return `  --${f.name}${typeHint}`.length;
      }),
    );
    const colWidth = maxFlagLen + 4;

    for (const flag of flags) {
      const typeHint = flag.type ? ` <${flag.type}>` : '';
      const left = `  --${flag.name}${typeHint}`.padEnd(colWidth);
      const desc = flag.description ? chalk.dim(flag.description) : '';
      lines.push(`${left}${desc}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}
