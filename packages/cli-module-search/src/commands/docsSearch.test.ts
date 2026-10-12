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

import type { CliCommandContext } from '@backstage/cli-node';

const mockQuery = jest.fn();

jest.mock('cleye', () => ({
  cli: jest.fn().mockReturnValue({ flags: {} }),
}));
jest.mock('../lib/resolveAuth', () => ({
  resolveAuth: jest.fn().mockResolvedValue({
    accessToken: 'tok',
    baseUrl: 'https://backstage.example.com',
    instanceName: 'default',
    pluginSources: ['search'],
  }),
}));
jest.mock('../lib/SearchClient', () => ({
  SearchClient: jest.fn().mockImplementation(() => ({
    query: mockQuery,
  })),
}));

import docsSearch from './docsSearch';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;
const actualCli = jest.requireActual<typeof import('cleye')>('cleye').cli;

const ctx = (args: string[]): CliCommandContext =>
  ({
    args,
    info: { name: 'docs search', usage: 'backstage-cli docs search' },
  } as unknown as CliCommandContext);

describe('docs search', () => {
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;

  beforeEach(() => {
    jest.clearAllMocks();
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
  });

  it('queries the search backend restricted to techdocs', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { term: ['my', 'service'] },
    });
    mockQuery.mockResolvedValue({ results: [] });

    await docsSearch(ctx(['my', 'service']));

    expect(mockQuery).toHaveBeenCalledWith({
      term: 'my service',
      types: ['techdocs'],
      pageLimit: undefined,
      pageCursor: undefined,
    });
  });

  it('passes pagination flags', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { limit: 5, cursor: 'abc' },
      _: { term: ['term'] },
    });
    mockQuery.mockResolvedValue({ results: [] });

    await docsSearch(ctx(['term']));

    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({ pageLimit: 5, pageCursor: 'abc' }),
    );
  });

  it('outputs JSON when --output json', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { output: 'json' },
      _: { term: ['test'] },
    });
    mockQuery.mockResolvedValue({
      results: [{ document: { title: 'Test' } }],
      numberOfResults: 1,
      nextPageCursor: 'next',
    });

    await docsSearch(ctx(['test']));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(JSON.parse(output)).toEqual({
      results: [{ document: { title: 'Test' } }],
      nextPageCursor: 'next',
      totalItems: 1,
      hasMoreResults: true,
    });
  });

  it('outputs human-readable format by default', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { term: ['docs'] },
    });
    mockQuery.mockResolvedValue({
      results: [
        {
          document: {
            title: 'My Docs',
            location: '/docs/default/component/my-svc',
            text: 'Documentation content',
          },
        },
      ],
    });

    await docsSearch(ctx(['docs']));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(output).toContain('My Docs');
    expect(output).toContain('/docs/default/component/my-svc');
  });

  it('rejects removed page flags, a missing term and invalid --output', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(code => {
      throw new Error(`process.exit(${code})`);
    });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (mockCli as jest.Mock)
      .mockImplementationOnce(actualCli)
      .mockImplementationOnce(actualCli);

    try {
      await expect(
        docsSearch(ctx(['term', '--page-limit', '5'])),
      ).rejects.toThrow('process.exit(1)');
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unknown flag: --page-limit'),
      );
      await expect(docsSearch(ctx([]))).rejects.toThrow('process.exit(1)');
      expect(mockQuery).not.toHaveBeenCalled();
    } finally {
      logSpy.mockRestore();
      exitSpy.mockRestore();
      errorSpy.mockRestore();
    }

    (mockCli as jest.Mock).mockReturnValue({
      flags: { output: 'yaml' },
      _: { term: ['term'] },
    });
    await expect(docsSearch(ctx(['term']))).rejects.toThrow(
      'Invalid --output value "yaml", expected "human" or "json"',
    );
  });

  describe('paging in human mode', () => {
    const output = () => stdoutSpy.mock.calls.map(c => c[0]).join('');
    const statuses = () => output().match(/Page \d+( of \d+)?/g) ?? [];
    const setTty = (value: boolean) => {
      for (const stream of [process.stdout, process.stdin]) {
        Object.defineProperty(stream, 'isTTY', { value, configurable: true });
      }
    };
    const waitForStatuses = async (count: number) => {
      while (statuses().length < count) {
        await new Promise(resolve => setImmediate(resolve));
      }
    };
    const press = (name: string, ctrl = false) =>
      process.stdin.emit('keypress', undefined, { name, ctrl });
    let setRawMode: jest.Mock;
    const page = (title: string, nextPageCursor?: string) => ({
      results: [{ document: { title } }],
      numberOfResults: 2,
      nextPageCursor,
    });

    beforeEach(() => {
      setRawMode = jest.fn();
      (process.stdin as { setRawMode?: unknown }).setRawMode = setRawMode;
      jest
        .spyOn(process.stdin, 'resume')
        .mockImplementation(() => process.stdin);
      jest
        .spyOn(process.stdin, 'pause')
        .mockImplementation(() => process.stdin);
      (mockCli as jest.Mock).mockReturnValue({
        flags: { limit: 1 },
        _: { term: ['term'] },
      });
      mockQuery
        .mockResolvedValueOnce(page('first', 'next-1'))
        .mockResolvedValueOnce(page('second'));
    });

    afterEach(() => {
      delete (process.stdin as { setRawMode?: unknown }).setRawMode;
      jest.restoreAllMocks();
      mockQuery.mockReset();
      for (const stream of [process.stdout, process.stdin]) {
        delete (stream as { isTTY?: boolean }).isTTY;
      }
    });

    it('pages with the arrow keys and restores the terminal on quit', async () => {
      setTty(true);

      const run = docsSearch(ctx(['term']));
      await waitForStatuses(1);
      expect(output()).toContain('first');
      expect(output()).not.toContain('second');
      press('right');
      await waitForStatuses(2);
      expect(output()).toContain('second');
      press('left');
      await waitForStatuses(3);
      press('q');
      await run;

      expect(mockQuery).toHaveBeenCalledTimes(2);
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ pageCursor: 'next-1', pageLimit: 1 }),
      );
      expect(statuses()).toEqual(['Page 1 of 2', 'Page 2 of 2', 'Page 1 of 2']);
      expect(output()).toContain('←/→ page · q/esc quit');
      expect(setRawMode.mock.calls).toEqual([[true], [false]]);
      expect(output()).toContain('\x1b[?1049h\x1b[?25l');
      // The last page stays in the scrollback after leaving the pager
      expect(output().split('\x1b[?1049l')[1]).toContain('first');
      expect(output()).toContain('\x1b[?25h\x1b[?1049l');
      expect(process.stdin.listenerCount('keypress')).toBe(0);
    });

    it('exits on escape and ctrl+c', async () => {
      setTty(true);

      const escRun = docsSearch(ctx(['term']));
      await waitForStatuses(1);
      press('escape');
      await escRun;
      expect(mockQuery).toHaveBeenCalledTimes(1);

      mockQuery.mockReset();
      mockQuery
        .mockResolvedValueOnce(page('first', 'next-1'))
        .mockResolvedValueOnce(page('second'));
      const ctrlRun = docsSearch(ctx(['term']));
      await waitForStatuses(2);
      press('c', true);
      await ctrlRun;
      expect(process.exitCode).toBe(130);
      process.exitCode = undefined;
      expect(setRawMode.mock.calls).toEqual([[true], [false], [true], [false]]);
    });

    it('restores the terminal when fetching the next page fails', async () => {
      setTty(true);
      mockQuery.mockReset();
      mockQuery.mockResolvedValueOnce(page('first', 'next-1'));
      mockQuery.mockRejectedValueOnce(new Error('boom'));

      const run = docsSearch(ctx(['term']));
      await Promise.all([
        expect(run).rejects.toThrow('boom'),
        waitForStatuses(1).then(() => press('right')),
      ]);

      expect(setRawMode.mock.calls).toEqual([[true], [false]]);
      expect(output()).toContain('\x1b[?25h\x1b[?1049l');
      expect(process.stdin.listenerCount('keypress')).toBe(0);
    });

    it('prints a footer with the cursor and does not page without a TTY', async () => {
      setTty(false);

      await docsSearch(ctx(['term']));

      expect(setRawMode).not.toHaveBeenCalled();
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(output()).toContain('Showing 1 of 2');
      expect(output()).toContain('--cursor next-1');
    });
  });
});
