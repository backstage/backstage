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
const mockPrompt = jest.fn();

jest.mock('cleye', () => ({
  cli: jest.fn().mockReturnValue({ flags: {} }),
}));
jest.mock('inquirer', () => ({
  __esModule: true,
  default: { prompt: (...args: unknown[]) => mockPrompt(...args) },
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
    const setTty = (value: boolean) => {
      for (const stream of [process.stdout, process.stdin]) {
        Object.defineProperty(stream, 'isTTY', { value, configurable: true });
      }
    };
    const page = (title: string, nextPageCursor?: string) => ({
      results: [{ document: { title } }],
      numberOfResults: 2,
      nextPageCursor,
    });

    beforeEach(() => {
      (mockCli as jest.Mock).mockReturnValue({
        flags: { limit: 1 },
        _: { term: ['term'] },
      });
      mockQuery
        .mockResolvedValueOnce(page('first', 'next-1'))
        .mockResolvedValueOnce(page('second'));
    });

    afterEach(() => {
      mockQuery.mockReset();
      mockPrompt.mockReset();
      for (const stream of [process.stdout, process.stdin]) {
        delete (stream as { isTTY?: boolean }).isTTY;
      }
    });

    it('fetches the next page with the cursor when confirmed on a TTY', async () => {
      setTty(true);
      mockPrompt.mockResolvedValue({ more: true });

      await docsSearch(ctx(['term']));

      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ pageCursor: 'next-1', pageLimit: 1 }),
      );
      expect(output()).toContain('first');
      expect(output()).toContain('second');
      expect(output()).toContain('Showing 2 of 2');
    });

    it('prints a footer with the cursor and does not prompt without a TTY', async () => {
      setTty(false);

      await docsSearch(ctx(['term']));

      expect(mockPrompt).not.toHaveBeenCalled();
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(output()).toContain('Showing 1 of 2');
      expect(output()).toContain('--cursor next-1');
    });
  });
});
