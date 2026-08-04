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
