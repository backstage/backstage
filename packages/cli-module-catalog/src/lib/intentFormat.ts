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
  fields?: string[],
): string {
  if (entities.length === 0) {
    return `${chalk.yellow('No entities found.')}\n`;
  }

  if (fields?.length) {
    const headers = fields.map(field =>
      (field.split('.').pop() ?? field).toUpperCase(),
    );
    const rows = entities.map(entity =>
      fields.map(field => {
        const value = field.split('.').reduce<unknown>((current, key) => {
          if (current && typeof current === 'object') {
            return (current as Record<string, unknown>)[key];
          }
          return undefined;
        }, entity);
        if (value === undefined || value === null) return '';
        return typeof value === 'object'
          ? JSON.stringify(value)
          : String(value);
      }),
    );
    const widths = headers.map((header, index) =>
      Math.max(header.length, ...rows.map(row => row[index].length)),
    );
    const render = (cells: string[]) =>
      cells
        .map((cell, index) =>
          index === cells.length - 1 ? cell : pad(cell, widths[index]),
        )
        .join(' ');
    return `${[
      render(
        headers.map((header, index) => chalk.bold(pad(header, widths[index]))),
      ),
      ...rows.map(render),
    ].join('\n')}\n`;
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
