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
import { emitKeypressEvents } from 'node:readline';

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

type PagerAction = 'next' | 'previous' | 'quit';

function toPagerAction(
  key: { name?: string; ctrl?: boolean } | undefined,
): PagerAction | undefined {
  if (!key) return undefined;
  if (key.name === 'right') return 'next';
  if (key.name === 'left') return 'previous';
  if (
    key.name === 'q' ||
    key.name === 'escape' ||
    (key.ctrl && key.name === 'c')
  ) {
    return 'quit';
  }
  return undefined;
}

/**
 * Prints a page of results followed by a footer. When running in a terminal
 * and more results exist, shows one page at a time and lets the user move
 * between pages with the arrow keys. Otherwise a hint with the `--cursor`
 * value to continue from is printed.
 *
 * In a terminal the page size is reduced when needed so that a page, its
 * header lines and the status line fit on one screen. The effective page size
 * is passed to `fetchPage` as its second argument.
 */
export async function pageInteractively<T extends PageResult>(
  fetchPage: (cursor?: string, limit?: number) => Promise<T>,
  render: (page: T) => string,
  options: {
    /** Cursor to start from */
    cursor?: string;
    /** Requested page size */
    limit?: number;
    /** Number of lines that `render` prints before the items */
    headerLines?: number;
    /** Maximum number of lines that `render` prints for each item */
    linesPerItem?: number;
  } = {},
): Promise<void> {
  const {
    cursor: initialCursor,
    limit,
    headerLines = 0,
    linesPerItem = 1,
  } = options;
  const interactive = Boolean(process.stdout.isTTY && process.stdin.isTTY);
  const rows = interactive ? process.stdout.rows : undefined;
  // Reserve the header, a blank line, the status line and the line the cursor
  // ends up on.
  const fit = rows
    ? Math.max(1, Math.floor((rows - headerLines - 3) / linesPerItem))
    : undefined;
  const effectiveLimit =
    fit === undefined ? limit : Math.min(limit ?? fit, fit);
  const first = await fetchPage(initialCursor, effectiveLimit);

  if (!interactive || !first.nextCursor) {
    process.stdout.write(render(first));
    if (first.count > 0) {
      const total = first.total === undefined ? '' : ` of ${first.total}`;
      process.stdout.write(`${chalk.dim(`Showing ${first.count}${total}`)}\n`);
    }
    if (first.nextCursor) {
      process.stdout.write(
        `${chalk.dim(
          `More results available, use --cursor ${first.nextCursor} to show them`,
        )}\n`,
      );
    }
    return;
  }

  const pageSize = effectiveLimit ?? (initialCursor ? undefined : first.count);
  const pages: T[] = [first];
  let index = 0;

  const draw = () => {
    const page = pages[index];
    const totalPages =
      page.total !== undefined && pageSize
        ? Math.max(Math.ceil(page.total / pageSize), pages.length)
        : undefined;
    const label = `Page ${index + 1}${
      totalPages === undefined ? '' : ` of ${totalPages}`
    }`;
    process.stdout.write('\x1b[2J\x1b[H');
    process.stdout.write(render(page));
    process.stdout.write(
      `\n${chalk.dim(`${label} · ←/→ page · q/esc quit`)}\n`,
    );
  };

  const stdin = process.stdin;
  const wasRaw = stdin.isRaw;
  let quit = false;
  let waiting: ((action: PagerAction) => void) | undefined;
  const onKeypress = (
    _: unknown,
    key: { name?: string; ctrl?: boolean } | undefined,
  ) => {
    const action = toPagerAction(key);
    if (!action) return;
    if (action === 'quit') {
      quit = true;
      if (key?.ctrl && key.name === 'c') process.exitCode = 130;
    }
    const resolve = waiting;
    waiting = undefined;
    resolve?.(action);
  };
  const nextAction = () =>
    new Promise<PagerAction>(resolve => {
      waiting = resolve;
    });

  emitKeypressEvents(stdin);
  stdin.setRawMode(true);
  stdin.on('keypress', onKeypress);
  stdin.resume();
  process.stdout.write('\x1b[?1049h\x1b[?25l');
  try {
    draw();
    while (!quit) {
      const action = await nextAction();
      if (action === 'quit') break;
      if (action === 'previous' && index > 0) {
        index -= 1;
      } else if (action === 'next') {
        if (index + 1 < pages.length) {
          index += 1;
        } else if (pages[index].nextCursor) {
          pages.push(await fetchPage(pages[index].nextCursor, pageSize));
          index += 1;
        } else {
          continue;
        }
      } else {
        continue;
      }
      draw();
    }
  } finally {
    stdin.off('keypress', onKeypress);
    stdin.setRawMode(Boolean(wasRaw));
    stdin.pause();
    process.stdout.write('\x1b[?25h\x1b[?1049l');
  }
  // Leave the last page visible in the scrollback of the normal screen.
  process.stdout.write(render(pages[index]));
}

export function writeJson(data: unknown): void {
  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
}

const MIN_COLUMN_WIDTH = 4;
const FIELD_MIN_WIDTH = 12;
/** Minimum widths of the NAME, KIND, NAMESPACE and TYPE columns */
const ENTITY_MIN_WIDTHS = [30, 12, 12, 10];
/** Maximum widths of the NAME, KIND, NAMESPACE and TYPE columns */
const ENTITY_MAX_WIDTHS = [48, Infinity, Infinity, Infinity];

function truncate(str: string, width: number): string {
  if (str.length <= width) return str;
  return width <= 1 ? str.slice(0, width) : `${str.slice(0, width - 1)}…`;
}

/**
 * The width to fit output into, or undefined when not writing to a terminal.
 */
function terminalWidth(): number | undefined {
  return process.stdout.isTTY && process.stdout.columns
    ? process.stdout.columns
    : undefined;
}

/**
 * Formats a table with columns sized from the data, but never narrower than
 * `minWidths` or wider than `maxWidths`. When `maxWidth` is set the widest
 * columns are shrunk further, which takes priority over the minimums. Cells
 * that do not fit are truncated with an ellipsis.
 */
function formatTable(
  headers: string[],
  rows: string[][],
  maxWidth: number | undefined,
  minWidths: number[],
  maxWidths: number[],
): string {
  const widths = headers.map((header, index) =>
    Math.min(
      Math.max(
        header.length,
        minWidths[index],
        ...rows.map(row => row[index].length),
      ),
      maxWidths[index],
    ),
  );
  if (maxWidth) {
    let excess =
      widths.reduce((a, b) => a + b, 0) + widths.length - 1 - maxWidth;
    while (excess > 0 && Math.max(...widths) > MIN_COLUMN_WIDTH) {
      widths[widths.indexOf(Math.max(...widths))] -= 1;
      excess -= 1;
    }
  }
  const render = (cells: string[], style: (text: string) => string) =>
    cells
      .map((cell, index) => {
        const text = truncate(cell, widths[index]);
        const padding =
          index === cells.length - 1
            ? ''
            : ' '.repeat(widths[index] - text.length);
        return `${style(text)}${padding}`;
      })
      .join(' ');
  return `${[
    render(headers, chalk.bold),
    ...rows.map(row => render(row, text => text)),
  ].join('\n')}\n`;
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
  maxWidth: number | undefined = terminalWidth(),
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
    return formatTable(
      headers,
      rows,
      maxWidth,
      headers.map(header => Math.max(header.length, FIELD_MIN_WIDTH)),
      headers.map(() => Infinity),
    );
  }

  const rows = entities.map(entity => {
    const metadata = entity.metadata as Record<string, unknown> | undefined;
    const spec = entity.spec as Record<string, unknown> | undefined;
    return [
      String(metadata?.name ?? entity.name ?? ''),
      String(entity.kind ?? ''),
      String(metadata?.namespace ?? entity.namespace ?? 'default'),
      String(spec?.type ?? entity.type ?? ''),
    ];
  });
  return formatTable(
    ['NAME', 'KIND', 'NAMESPACE', 'TYPE'],
    rows,
    maxWidth,
    ENTITY_MIN_WIDTHS,
    ENTITY_MAX_WIDTHS,
  );
}
