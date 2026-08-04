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

const mockExecute = jest.fn();

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
jest.mock('../lib/ActionsClient', () => ({
  ActionsClient: jest.fn().mockImplementation(() => ({
    execute: mockExecute,
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

  it('calls query-catalog-entities with no filters when none provided', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });
    mockExecute.mockResolvedValue({ items: [] });

    await catalogList(ctx([]));

    expect(mockExecute).toHaveBeenCalledWith(
      'catalog:query-catalog-entities',
      {},
    );
  });

  it('passes kind as query predicate', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { kind: 'Component' } });
    mockExecute.mockResolvedValue({ items: [] });

    await catalogList(ctx(['--kind', 'Component']));

    expect(mockExecute).toHaveBeenCalledWith('catalog:query-catalog-entities', {
      query: { kind: 'Component' },
    });
  });

  it('passes kind and type as combined query', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { kind: 'Component', type: 'service' },
    });
    mockExecute.mockResolvedValue({ items: [] });

    await catalogList(ctx(['--kind', 'Component', '--type', 'service']));

    expect(mockExecute).toHaveBeenCalledWith('catalog:query-catalog-entities', {
      query: { kind: 'Component', 'spec.type': 'service' },
    });
  });

  it('passes filter as raw query when provided', async () => {
    const filter = '{"kind":"API","spec.type":"openapi"}';
    (mockCli as jest.Mock).mockReturnValue({ flags: { filter } });
    mockExecute.mockResolvedValue({ items: [] });

    await catalogList(ctx(['--filter', filter]));

    expect(mockExecute).toHaveBeenCalledWith('catalog:query-catalog-entities', {
      query: JSON.parse(filter),
    });
  });

  it('passes limit when provided', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { limit: 5 } });
    mockExecute.mockResolvedValue({ items: [] });

    await catalogList(ctx(['--limit', '5']));

    expect(mockExecute).toHaveBeenCalledWith('catalog:query-catalog-entities', {
      limit: 5,
    });
  });

  it('outputs JSON when --output json', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { output: 'json' } });
    const result = {
      items: [{ kind: 'Component', metadata: { name: 'foo' } }],
    };
    mockExecute.mockResolvedValue(result);

    await catalogList(ctx(['--output', 'json']));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(JSON.parse(output)).toEqual(result);
  });

  it('outputs human-readable table by default', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });
    mockExecute.mockResolvedValue({
      items: [
        {
          kind: 'Component',
          metadata: { name: 'my-svc', namespace: 'default' },
          spec: { type: 'service' },
        },
      ],
    });

    await catalogList(ctx([]));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(output).toContain('my-svc');
    expect(output).toContain('Component');
    expect(output).toContain('service');
    expect(output).toContain('NAME');
  });

  it('passes --instance to resolveAuth', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { instance: 'staging' } });
    mockExecute.mockResolvedValue({ items: [] });

    await catalogList(ctx(['--instance', 'staging']));

    expect(mockResolveAuth).toHaveBeenCalledWith('staging');
  });
});
