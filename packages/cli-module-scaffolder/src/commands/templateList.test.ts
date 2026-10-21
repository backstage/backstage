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

const mockQueryEntities = jest.fn();

jest.mock('cleye', () => ({
  cli: jest.fn().mockReturnValue({ flags: {} }),
}));
jest.mock('../lib/resolveAuth', () => ({
  resolveAuth: jest.fn().mockResolvedValue({
    accessToken: 'tok',
    baseUrl: 'https://backstage.example.com',
    instanceName: 'default',
    pluginSources: ['scaffolder'],
  }),
}));
jest.mock('../lib/catalogClient', () => ({
  createCatalogClient: jest.fn().mockImplementation(() => ({
    queryEntities: mockQueryEntities,
  })),
}));

import templateList from './templateList';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;
const actualCli = jest.requireActual<typeof import('cleye')>('cleye').cli;

const ctx = (args: string[]): CliCommandContext =>
  ({
    args,
    info: { name: 'template list', usage: 'backstage-cli template list' },
  } as unknown as CliCommandContext);

describe('template list', () => {
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

  it('queries the catalog for Template entities', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 0,
      pageInfo: {},
    });

    await templateList(ctx([]));

    expect(mockQueryEntities).toHaveBeenCalledWith(
      { query: { kind: 'Template' } },
      { token: 'tok' },
    );
  });

  it('passes limit when provided', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { limit: 5 } });
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 0,
      pageInfo: {},
    });

    await templateList(ctx(['--limit', '5']));

    expect(mockQueryEntities).toHaveBeenCalledWith(
      { query: { kind: 'Template' }, limit: 5 },
      { token: 'tok' },
    );
  });

  it('merges repeatable key-value filters with the template query', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        filter: ['metadata.tags=nodejs', 'spec.type=service'],
      },
    });
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 0,
      pageInfo: {},
    });

    await templateList(ctx([]));

    expect(mockQueryEntities).toHaveBeenCalledWith(
      {
        query: {
          kind: 'Template',
          'metadata.tags': 'nodejs',
          'spec.type': 'service',
        },
      },
      { token: 'tok' },
    );
  });

  it('rejects a kind filter', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { filter: ['kind=Component'] },
    });

    await expect(templateList(ctx([]))).rejects.toThrow(
      '--filter kind=... is not supported',
    );
    expect(mockQueryEntities).not.toHaveBeenCalled();
  });

  it('outputs JSON when --output json', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { output: 'json' } });
    mockQueryEntities.mockResolvedValue({
      items: [{ kind: 'Template', metadata: { name: 'my-template' } }],
      totalItems: 1,
      pageInfo: {},
    });

    await templateList(ctx(['--output', 'json']));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(JSON.parse(output)).toEqual({
      items: [{ kind: 'Template', metadata: { name: 'my-template' } }],
      totalItems: 1,
      hasMoreEntities: false,
      nextPageCursor: undefined,
    });
  });

  it('outputs a human-readable table by default', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });
    mockQueryEntities.mockResolvedValue({
      items: [
        {
          kind: 'Template',
          metadata: { name: 'my-template', namespace: 'default' },
          spec: { type: 'service' },
        },
      ],
      totalItems: 1,
      pageInfo: {},
    });

    await templateList(ctx([]));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(output).toContain('my-template');
    expect(output).toContain('Template');
  });

  it('passes --cursor without the query', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { cursor: 'abc', limit: 5 },
    });
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 0,
      pageInfo: {},
    });

    await templateList(ctx(['--cursor', 'abc', '--limit', '5']));

    expect(mockQueryEntities).toHaveBeenCalledWith(
      { cursor: 'abc', limit: 5 },
      { token: 'tok' },
    );
  });

  it('rejects --cursor combined with --filter', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { cursor: 'abc', filter: ['a=b'] },
    });

    await expect(templateList(ctx([]))).rejects.toThrow(
      '--cursor cannot be combined with --filter',
    );
    expect(mockQueryEntities).not.toHaveBeenCalled();
  });

  it('rejects invalid --output values', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { output: 'yaml' } });

    await expect(templateList(ctx(['--output', 'yaml']))).rejects.toThrow(
      'Invalid --output value "yaml", expected "human" or "json"',
    );
    expect(mockQueryEntities).not.toHaveBeenCalled();
  });

  it('rejects unknown flags through strict flag parsing', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(code => {
      throw new Error(`process.exit(${code})`);
    });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (mockCli as jest.Mock).mockImplementationOnce(actualCli);

    try {
      await expect(templateList(ctx(['--bogus']))).rejects.toThrow(
        'process.exit(1)',
      );
      expect(errorSpy).toHaveBeenCalledWith('Error: Unknown flag: --bogus.');
    } finally {
      exitSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });

  describe('paging in human mode', () => {
    const output = () => stdoutSpy.mock.calls.map(c => c[0]).join('');
    const setTty = (value: boolean) => {
      for (const stream of [process.stdout, process.stdin]) {
        Object.defineProperty(stream, 'isTTY', { value, configurable: true });
      }
    };

    beforeEach(() => {
      (mockCli as jest.Mock).mockReturnValue({ flags: { limit: 1 } });
      mockQueryEntities
        .mockResolvedValueOnce({
          items: [{ kind: 'Template', metadata: { name: 'first' } }],
          totalItems: 2,
          pageInfo: { nextCursor: 'next-1' },
        })
        .mockResolvedValueOnce({
          items: [{ kind: 'Template', metadata: { name: 'second' } }],
          totalItems: 2,
          pageInfo: {},
        });
    });

    afterEach(() => {
      mockQueryEntities.mockReset();
      for (const stream of [process.stdout, process.stdin]) {
        delete (stream as { isTTY?: boolean }).isTTY;
      }
    });

    it.each([true, false])(
      'prints a single page with a footer and the cursor hint (TTY: %s)',
      async tty => {
        setTty(tty);

        await templateList(ctx([]));

        expect(mockQueryEntities).toHaveBeenCalledTimes(1);
        expect(output()).toContain('Showing 1 of 2');
        expect(output()).toContain('--cursor next-1');
      },
    );
  });
});
