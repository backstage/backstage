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

import searchCommand from './search';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;
const actualCli = jest.requireActual<typeof import('cleye')>('cleye').cli;

const ctx = (args: string[]): CliCommandContext =>
  ({
    args,
    info: { name: 'search', usage: 'backstage-cli search' },
  } as unknown as CliCommandContext);

describe('search', () => {
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

  it('queries with term', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { type: [] },
      _: { term: ['my', 'service'] },
    });
    mockQuery.mockResolvedValue({ results: [] });

    await searchCommand(ctx(['my', 'service']));

    expect(mockQuery).toHaveBeenCalledWith({
      term: 'my service',
      types: undefined,
      filters: undefined,
      pageLimit: undefined,
      pageCursor: undefined,
    });
    expect(mockCli.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        parameters: ['<term...>'],
        strictFlags: true,
      }),
    );
  });

  it('accepts repeatable document types', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { type: ['techdocs', 'software-catalog'] },
      _: { term: ['docs'] },
    });
    mockQuery.mockResolvedValue({ results: [] });

    await searchCommand(ctx(['docs']));

    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        term: 'docs',
        types: ['techdocs', 'software-catalog'],
      }),
    );
  });

  it('accepts repeatable key-value filters', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        type: [],
        filter: ['kind=Component', 'lifecycle=production'],
      },
      _: { term: ['service'] },
    });
    mockQuery.mockResolvedValue({ results: [] });

    await searchCommand(ctx(['service']));

    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        term: 'service',
        filters: {
          kind: 'Component',
          lifecycle: 'production',
        },
      }),
    );
  });

  it('rejects JSON objects containing equals signs for --filter', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { type: [], filter: ['{"url":"https://example.com?a=b"}'] },
      _: { term: ['service'] },
    });

    await expect(searchCommand(ctx(['service']))).rejects.toThrow(
      'JSON object input is not supported; use repeatable key=value flags',
    );
  });

  it('rejects the removed JSON --filters flag during parsing', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(code => {
      throw new Error(`process.exit(${code})`);
    });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (mockCli as jest.Mock).mockImplementationOnce(actualCli);

    try {
      await expect(
        searchCommand(ctx(['service', '--filters', '{"kind":"Component"}'])),
      ).rejects.toThrow('process.exit(1)');
      expect(errorSpy).toHaveBeenCalledWith(
        'Error: Unknown flag: --filters. (Did you mean --filter?)',
      );
    } finally {
      exitSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });

  it('rejects removed flags and a missing term during parsing', async () => {
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
        searchCommand(ctx(['service', '--types', 'techdocs'])),
      ).rejects.toThrow('process.exit(1)');
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unknown flag: --types'),
      );
      await expect(searchCommand(ctx([]))).rejects.toThrow('process.exit(1)');
      expect(mockQuery).not.toHaveBeenCalled();
    } finally {
      logSpy.mockRestore();
      exitSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });

  it('passes pagination flags', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { type: [], limit: 5, cursor: 'abc' },
      _: { term: ['term'] },
    });
    mockQuery.mockResolvedValue({ results: [] });

    await searchCommand(ctx(['term']));

    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        term: 'term',
        pageLimit: 5,
        pageCursor: 'abc',
      }),
    );
  });

  it('rejects invalid --output values', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { type: [], output: 'yaml' },
      _: { term: ['term'] },
    });

    await expect(searchCommand(ctx(['term']))).rejects.toThrow(
      'Invalid --output value "yaml", expected "human" or "json"',
    );
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('outputs JSON when --output json', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { type: [], output: 'json' },
      _: { term: ['test'] },
    });
    mockQuery.mockResolvedValue({
      results: [{ document: { title: 'Test' } }],
      numberOfResults: 1,
    });

    await searchCommand(ctx(['test']));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(JSON.parse(output)).toEqual({
      results: [{ document: { title: 'Test' } }],
      nextPageCursor: undefined,
      totalItems: 1,
      hasMoreResults: false,
    });
  });

  it('outputs human-readable format by default', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { type: [] },
      _: { term: ['service'] },
    });
    mockQuery.mockResolvedValue({
      results: [
        {
          document: {
            title: 'My Service',
            location: '/catalog/default/component/my-svc',
            text: 'A great service',
          },
        },
      ],
    });

    await searchCommand(ctx(['service']));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(output).toContain('My Service');
    expect(output).toContain('/catalog/default/component/my-svc');
    expect(output).toContain('A great service');
  });

  it('uses top-level result text in human-readable output', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { type: [] },
      _: { term: ['service'] },
    });
    mockQuery.mockResolvedValue({
      results: [
        {
          title: 'My Service',
          location: '/catalog/default/component/my-svc',
          text: 'Top-level search text',
        },
      ],
    });

    await searchCommand(ctx(['service']));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(output).toContain('Top-level search text');
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
        flags: { type: [], limit: 1 },
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

      await searchCommand(ctx(['term']));

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

      await searchCommand(ctx(['term']));

      expect(mockPrompt).not.toHaveBeenCalled();
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(output()).toContain('Showing 1 of 2');
      expect(output()).toContain('--cursor next-1');
    });
  });
});
