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

export type OutputMode = 'human' | 'json';

export function parseOutputFlag(flags: Record<string, unknown>): OutputMode {
  return flags.output === 'json' ? 'json' : 'human';
}

export function writeJson(data: unknown): void {
  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
}

function pad(str: string, width: number): string {
  return str.length >= width ? str : str + ' '.repeat(width - str.length);
}

export function extractEntities(
  result: unknown,
): Array<Record<string, unknown>> {
  if (Array.isArray(result)) return result;
  const obj = result as Record<string, unknown> | undefined;
  return (obj?.items ?? obj?.entities ?? []) as Array<Record<string, unknown>>;
}

export function formatEntityTable(
  entities: Array<Record<string, unknown>>,
): string {
  if (entities.length === 0) {
    return `${chalk.yellow('No entities found.')}\n`;
  }

  const lines: string[] = [];
  lines.push(
    `${chalk.bold(pad('NAME', 40))} ${chalk.bold(pad('KIND', 16))} ${chalk.bold(
      pad('NAMESPACE', 16),
    )} ${chalk.bold('TYPE')}`,
  );

  for (const entity of entities) {
    const metadata = entity.metadata as Record<string, unknown> | undefined;
    const spec = entity.spec as Record<string, unknown> | undefined;
    const name = String(metadata?.name ?? entity.name ?? '');
    const kind = String(entity.kind ?? '');
    const namespace = String(
      metadata?.namespace ?? entity.namespace ?? 'default',
    );
    const type = String(spec?.type ?? entity.type ?? '');
    lines.push(
      `${pad(name, 40)} ${pad(kind, 16)} ${pad(namespace, 16)} ${type}`,
    );
  }

  return `${lines.join('\n')}\n`;
}

export function formatSearchResults(
  results: Array<Record<string, unknown>>,
): string {
  if (results.length === 0) {
    return `${chalk.yellow('No results found.')}\n`;
  }

  const lines: string[] = [];
  for (const result of results) {
    const doc = result.document as Record<string, unknown> | undefined;
    const title = String(doc?.title ?? result.title ?? '');
    const location = String(doc?.location ?? result.location ?? '');
    const text = String(doc?.text ?? '');
    const snippet = text.length > 120 ? `${text.slice(0, 120)}...` : text;

    lines.push(chalk.bold(title));
    if (location) lines.push(`  ${chalk.dim(location)}`);
    if (snippet) lines.push(`  ${snippet}`);
    lines.push('');
  }

  return lines.join('\n');
}
