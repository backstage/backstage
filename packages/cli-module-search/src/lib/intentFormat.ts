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

/**
 * Shared `--output` flag definition for commands that support both formats.
 */
export const outputFlag = {
  output: {
    type: String,
    description: 'Output format: "human" (default) or "json"',
  },
};

export function parseOutputFlag(flags: Record<string, unknown>): OutputMode {
  const output = flags.output;
  if (output === undefined || output === 'human') return 'human';
  if (output === 'json') return 'json';
  throw new Error(
    `Invalid --output value "${String(output)}", expected "human" or "json"`,
  );
}

/**
 * Describes one fetched page of a paginated list.
 */
export type PageResult = {
  /** Number of items in this page */
  count: number;
  /** Total number of items across all pages, if known */
  total?: number;
  /** Cursor for the next page, if there is one */
  nextCursor?: string;
};

/**
 * Prints a single page of results followed by a footer with the number of
 * results shown, unless the page is empty. When more results exist, a hint with the `--cursor` value to
 * continue from is printed.
 */
export async function printPage<T extends PageResult>(
  fetchPage: (cursor?: string) => Promise<T>,
  render: (page: T) => void,
  cursor?: string,
): Promise<void> {
  const page = await fetchPage(cursor);
  render(page);

  if (page.count > 0) {
    const total = page.total === undefined ? '' : ` of ${page.total}`;
    process.stdout.write(`${chalk.dim(`Showing ${page.count}${total}`)}\n`);
  }
  if (page.nextCursor) {
    process.stdout.write(
      `${chalk.dim(
        `More results available, use --cursor ${page.nextCursor} to show them`,
      )}\n`,
    );
  }
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
    const text = String(doc?.text ?? result.text ?? '');
    const snippet = text.length > 120 ? `${text.slice(0, 120)}...` : text;

    lines.push(chalk.bold(title));
    if (location) lines.push(`  ${chalk.dim(location)}`);
    if (snippet) lines.push(`  ${snippet}`);
    lines.push('');
  }

  return lines.join('\n');
}
