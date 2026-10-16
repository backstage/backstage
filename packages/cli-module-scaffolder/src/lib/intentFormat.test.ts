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

import { formatEntityTable, pageInteractively } from './intentFormat';

const ansi = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');
const plain = (text: string) => text.replace(ansi, '');

const longName = 'generated-98ac9dfca9649edb1d5b35b1fd4781b63139f6ac';
const entities = [
  {
    kind: 'Component',
    metadata: { name: longName, namespace: 'default' },
    spec: { type: 'service' },
  },
  {
    kind: 'API',
    metadata: { name: 'short', namespace: 'default' },
    spec: { type: 'openapi' },
  },
];

describe('formatEntityTable', () => {
  it('sizes columns from the data so long names stay aligned', () => {
    const lines = plain(formatEntityTable(entities, undefined))
      .trimEnd()
      .split('\n');

    expect(lines).toHaveLength(3);
    const kindColumn = lines[0].indexOf('KIND');
    expect(lines[1].indexOf('Component')).toBe(kindColumn);
    expect(lines[2].indexOf('API')).toBe(kindColumn);
    expect(lines[1]).toContain(`${longName.slice(0, 47)}…`);
    expect(lines[0].indexOf('TYPE')).toBe(lines[1].indexOf('service'));
  });

  it('keeps minimum column widths for short values', () => {
    const [header] = plain(formatEntityTable([entities[1]], undefined)).split(
      '\n',
    );

    expect(header.indexOf('KIND')).toBe(31);
    expect(header.indexOf('NAMESPACE')).toBe(44);
    expect(header.indexOf('TYPE')).toBe(57);
  });

  it('caps the name column and truncates longer names', () => {
    const lines = plain(formatEntityTable(entities, undefined))
      .trimEnd()
      .split('\n');

    expect(lines[0].indexOf('KIND')).toBe(49);
    expect(lines[1]).toContain(`${longName.slice(0, 47)}…`);
    expect(lines[1]).not.toContain(longName);
    expect(lines[1].indexOf('Component')).toBe(49);
  });

  it('sizes each table from its own data', () => {
    const short = plain(formatEntityTable([entities[1]], undefined)).split(
      '\n',
    );
    const long = plain(formatEntityTable(entities, undefined)).split('\n');

    expect(short[0].indexOf('KIND')).toBe(31);
    expect(long[0].indexOf('KIND')).toBe(49);
  });

  it('lets the terminal width take priority over the minimum widths', () => {
    const lines = plain(formatEntityTable(entities, 20)).trimEnd().split('\n');

    for (const line of lines) {
      expect(line.length).toBeLessThanOrEqual(20);
    }
  });

  it('truncates with an ellipsis to fit the terminal width', () => {
    const lines = plain(formatEntityTable(entities, 60)).trimEnd().split('\n');

    for (const line of lines) {
      expect(line.length).toBeLessThanOrEqual(60);
    }
    expect(lines[1]).toContain('generated-98ac');
    expect(lines[1]).toContain('…');
    expect(lines[1]).not.toContain(longName);
    expect(lines[1]).toContain('Component');
    expect(lines[1]).toContain('service');
    expect(lines[2]).toContain('short');
  });
});

describe('pageInteractively', () => {
  const setScreen = (rows: number | undefined) => {
    for (const stream of [process.stdout, process.stdin]) {
      Object.defineProperty(stream, 'isTTY', {
        value: true,
        configurable: true,
      });
    }
    Object.defineProperty(process.stdout, 'rows', {
      value: rows,
      configurable: true,
    });
  };

  afterEach(() => {
    for (const stream of [process.stdout, process.stdin]) {
      delete (stream as { isTTY?: boolean }).isTTY;
    }
    delete (process.stdout as { rows?: number }).rows;
    jest.restoreAllMocks();
  });

  it('reduces the page size so a page fits on the terminal screen', async () => {
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const fetchPage = jest.fn().mockResolvedValue({ count: 1 });
    setScreen(10);

    await pageInteractively(fetchPage, () => 'page\n', { headerLines: 1 });
    expect(fetchPage).toHaveBeenLastCalledWith(undefined, 6);

    await pageInteractively(fetchPage, () => 'page\n', {
      headerLines: 1,
      limit: 2,
    });
    expect(fetchPage).toHaveBeenLastCalledWith(undefined, 2);

    await pageInteractively(fetchPage, () => 'page\n', {
      headerLines: 1,
      limit: 500,
    });
    expect(fetchPage).toHaveBeenLastCalledWith(undefined, 6);
  });

  it('shows the cached previous page on left and cleans up when a fetch fails', async () => {
    const stdoutWrite = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    const setRawMode = jest.fn();
    (process.stdin as { setRawMode?: unknown }).setRawMode = setRawMode;
    jest.spyOn(process.stdin, 'resume').mockImplementation(() => process.stdin);
    jest.spyOn(process.stdin, 'pause').mockImplementation(() => process.stdin);
    setScreen(undefined);
    const output = () => stdoutWrite.mock.calls.map(c => c[0]).join('');
    const screens = () => output().split('\x1b[2J').slice(1);
    const waitForScreens = async (count: number) => {
      while (screens().length < count) {
        await new Promise(resolve => setImmediate(resolve));
      }
    };
    const press = (name: string) =>
      process.stdin.emit('keypress', undefined, { name });
    const fetchPage = jest
      .fn()
      .mockResolvedValueOnce({ count: 1, total: 3, nextCursor: 'c1' })
      .mockResolvedValueOnce({ count: 1, total: 3, nextCursor: 'c2' })
      .mockRejectedValueOnce(new Error('boom'));
    const render = (page: { nextCursor?: string }) =>
      `page ${page.nextCursor}\n`;

    const run = pageInteractively(fetchPage, render, { limit: 1 });
    await waitForScreens(1);
    press('right');
    await waitForScreens(2);
    press('left');
    await waitForScreens(3);
    expect(screens()[2]).toContain('page c1');
    expect(screens()[2]).toContain('Page 1 of 3 · ←/→ page · q/esc quit');
    expect(fetchPage).toHaveBeenCalledTimes(2);

    press('right');
    await waitForScreens(4);
    press('right');
    await expect(run).rejects.toThrow('boom');

    expect(setRawMode.mock.calls).toEqual([[true], [false]]);
    expect(output()).toContain('\x1b[?25h\x1b[?1049l');
    expect(process.stdin.listenerCount('keypress')).toBe(0);
    delete (process.stdin as { setRawMode?: unknown }).setRawMode;
  });
});
