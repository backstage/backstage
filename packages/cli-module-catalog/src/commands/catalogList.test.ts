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
    pluginSources: ['catalog'],
  }),
}));
jest.mock('../lib/catalogClient', () => ({
  createCatalogClient: jest.fn().mockImplementation(() => ({
    queryEntities: mockQueryEntities,
  })),
}));

import catalogList from './catalogList';
import { cli } from 'cleye';
import { resolveAuth } from '../lib/resolveAuth';

const mockCli = cli as jest.MockedFunction<typeof cli>;
const mockResolveAuth = resolveAuth as jest.MockedFunction<typeof resolveAuth>;

const ctx = (args: string[]): CliCommandContext =>
  ({
    args,
    info: { name: 'catalog list', usage: 'backstage-cli catalog list' },
  } as unknown as CliCommandContext);

describe('catalog list', () => {
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

  it('queries with no filters when none provided', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 0,
      pageInfo: {},
    });

    await catalogList(ctx([]));

    expect(mockQueryEntities).toHaveBeenCalledWith({}, { token: 'tok' });
  });

  it('passes kind as query predicate', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { kind: 'Component' } });
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 0,
      pageInfo: {},
    });

    await catalogList(ctx(['--kind', 'Component']));

    expect(mockQueryEntities).toHaveBeenCalledWith(
      { query: { kind: 'Component' } },
      { token: 'tok' },
    );
  });

  it('passes kind and type as combined query', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { kind: 'Component', type: 'service' },
    });
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 0,
      pageInfo: {},
    });

    await catalogList(ctx(['--kind', 'Component', '--type', 'service']));

    expect(mockQueryEntities).toHaveBeenCalledWith(
      { query: { kind: 'Component', 'spec.type': 'service' } },
      { token: 'tok' },
    );
  });

  it('rejects JSON input for --filter', async () => {
    const filter = '{"url":"https://example.com?a=b"}';
    (mockCli as jest.Mock).mockReturnValue({ flags: { filter: [filter] } });

    await expect(catalogList(ctx(['--filter', filter]))).rejects.toThrow(
      'JSON object input is not supported; use repeatable key=value flags',
    );
  });

  it('merges repeatable key-value filters with kind and type shortcuts', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        kind: 'Component',
        type: 'service',
        filter: ['spec.lifecycle=production', 'metadata.tags=java'],
      },
    });
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 0,
      pageInfo: {},
    });

    await catalogList(ctx([]));

    expect(mockQueryEntities).toHaveBeenCalledWith(
      {
        query: {
          kind: 'Component',
          'spec.type': 'service',
          'spec.lifecycle': 'production',
          'metadata.tags': 'java',
        },
      },
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

    await catalogList(ctx(['--limit', '5']));

    expect(mockQueryEntities).toHaveBeenCalledWith(
      { limit: 5 },
      { token: 'tok' },
    );
  });

  it('outputs JSON when --output json', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { output: 'json' } });
    mockQueryEntities.mockResolvedValue({
      items: [{ kind: 'Component', metadata: { name: 'foo' } }],
      totalItems: 1,
      pageInfo: {},
    });

    await catalogList(ctx(['--output', 'json']));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(JSON.parse(output)).toEqual({
      items: [{ kind: 'Component', metadata: { name: 'foo' } }],
      totalItems: 1,
      hasMoreEntities: false,
      nextPageCursor: undefined,
    });
  });

  it('rejects --cursor combined with query flags', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        cursor: 'abc',
        kind: 'Component',
        type: 'service',
        filter: ['a=b'],
      },
    });

    await expect(catalogList(ctx([]))).rejects.toThrow(
      '--cursor cannot be combined with --kind, --type, --filter',
    );
    expect(mockQueryEntities).not.toHaveBeenCalled();
  });

  it('passes --cursor without query but keeps --fields', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { cursor: 'abc', limit: 5, fields: 'metadata.name' },
    });
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 0,
      pageInfo: {},
    });

    await catalogList(ctx([]));

    expect(mockQueryEntities).toHaveBeenCalledWith(
      { cursor: 'abc', limit: 5, fields: ['metadata.name'] },
      { token: 'tok' },
    );
  });

  it('rejects shortcuts that conflict with --filter', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { kind: 'Component', filter: ['kind=API'] },
    });
    await expect(catalogList(ctx([]))).rejects.toThrow(
      '--kind Component conflicts with --filter kind=',
    );

    (mockCli as jest.Mock).mockReturnValue({
      flags: { type: 'service', filter: ['spec.type=website'] },
    });
    await expect(catalogList(ctx([]))).rejects.toThrow(
      '--type service conflicts with --filter spec.type=',
    );
    expect(mockQueryEntities).not.toHaveBeenCalled();
  });

  it('rejects invalid --output values', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { output: 'yaml' } });

    await expect(catalogList(ctx(['--output', 'yaml']))).rejects.toThrow(
      'Invalid --output value "yaml", expected "human" or "json"',
    );
    expect(mockQueryEntities).not.toHaveBeenCalled();
  });

  it('rejects unknown flags through strict flag parsing', async () => {
    const actual = jest.requireActual('cleye');
    (mockCli as jest.Mock).mockImplementationOnce(actual.cli);
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit');
    });
    const stderrSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await expect(catalogList(ctx(['--bogus']))).rejects.toThrow('exit');
      expect(mockQueryEntities).not.toHaveBeenCalled();
    } finally {
      exitSpy.mockRestore();
      stderrSpy.mockRestore();
    }
  });

  describe('paging in human mode', () => {
    const entity = (name: string) => ({
      kind: 'Component',
      metadata: { name },
    });
    const output = () => stdoutSpy.mock.calls.map(c => c[0]).join('');
    let ttyDescriptors: [PropertyDescriptor | undefined, PropertyDescriptor?];

    const setTty = (value: boolean) => {
      Object.defineProperty(process.stdout, 'isTTY', {
        value,
        configurable: true,
      });
      Object.defineProperty(process.stdin, 'isTTY', {
        value,
        configurable: true,
      });
    };

    beforeEach(() => {
      ttyDescriptors = [
        Object.getOwnPropertyDescriptor(process.stdout, 'isTTY'),
        Object.getOwnPropertyDescriptor(process.stdin, 'isTTY'),
      ];
      (mockCli as jest.Mock).mockReturnValue({ flags: { limit: 1 } });
      mockQueryEntities
        .mockResolvedValueOnce({
          items: [entity('first')],
          totalItems: 2,
          pageInfo: { nextCursor: 'next-1' },
        })
        .mockResolvedValueOnce({
          items: [entity('second')],
          totalItems: 2,
          pageInfo: {},
        });
    });

    afterEach(() => {
      mockQueryEntities.mockReset();
      for (const [stream, descriptor] of [
        [process.stdout, ttyDescriptors[0]],
        [process.stdin, ttyDescriptors[1]],
      ] as const) {
        if (descriptor) {
          Object.defineProperty(stream, 'isTTY', descriptor);
        } else {
          delete (stream as { isTTY?: boolean }).isTTY;
        }
      }
    });

    it.each([true, false])(
      'prints a single page with a footer and the cursor hint (TTY: %s)',
      async tty => {
        setTty(tty);

        await catalogList(ctx([]));

        expect(mockQueryEntities).toHaveBeenCalledTimes(1);
        expect(output()).toContain('Showing 1 of 2');
        expect(output()).toContain('--cursor next-1');
      },
    );

    it('prints a single page in JSON mode even on a TTY', async () => {
      setTty(true);
      (mockCli as jest.Mock).mockReturnValue({
        flags: { limit: 1, output: 'json' },
      });

      await catalogList(ctx([]));

      expect(JSON.parse(output()).nextPageCursor).toBe('next-1');
    });
  });

  it('outputs human-readable table by default', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });
    mockQueryEntities.mockResolvedValue({
      items: [
        {
          kind: 'Component',
          metadata: { name: 'my-svc', namespace: 'default' },
          spec: { type: 'service' },
        },
      ],
      totalItems: 1,
      pageInfo: {},
    });

    await catalogList(ctx([]));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(output).toContain('my-svc');
    expect(output).toContain('Component');
    expect(output).toContain('service');
    expect(output).toContain('NAME');
  });

  it('uses comma-separated fields as the human-readable table columns', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { fields: 'metadata.name,metadata.description' },
    });
    mockQueryEntities.mockResolvedValue({
      items: [
        {
          kind: 'Component',
          metadata: { name: 'my-svc', description: 'My service' },
        },
      ],
      totalItems: 1,
      pageInfo: {},
    });

    await catalogList(ctx([]));

    expect(mockQueryEntities).toHaveBeenCalledWith(
      { fields: ['metadata.name', 'metadata.description'] },
      { token: 'tok' },
    );
    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(output).toContain('NAME');
    expect(output).toContain('DESCRIPTION');
    expect(output).toContain('My service');
    expect(output).not.toContain('NAMESPACE');
  });

  it('rejects JSON input for --fields', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { fields: '["metadata.name"]' },
    });

    await expect(catalogList(ctx([]))).rejects.toThrow(
      'JSON list input is not supported; use comma-separated values',
    );
  });

  it('passes --instance to resolveAuth', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { instance: 'staging' } });
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 0,
      pageInfo: {},
    });

    await catalogList(ctx(['--instance', 'staging']));

    expect(mockResolveAuth).toHaveBeenCalledWith('staging');
  });
});
