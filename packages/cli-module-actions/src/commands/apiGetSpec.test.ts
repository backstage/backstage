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

import apiGetSpec from './apiGetSpec';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;

const ctx = (args: string[]): CliCommandContext =>
  ({
    args,
    info: { name: 'api get-spec', usage: 'backstage-cli api get-spec' },
  } as unknown as CliCommandContext);

describe('api get-spec', () => {
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

  it('throws when --name is missing', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });

    await expect(apiGetSpec(ctx([]))).rejects.toThrow('--name is required');
  });

  it('fetches entity with kind=API and extracts spec.definition', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { name: 'my-api' } });
    mockExecute.mockResolvedValue({
      kind: 'API',
      metadata: { name: 'my-api' },
      spec: {
        type: 'openapi',
        definition: 'openapi: 3.0.0\ninfo:\n  title: My API',
      },
    });

    await apiGetSpec(ctx(['--name', 'my-api']));

    expect(mockExecute).toHaveBeenCalledWith('catalog:get-catalog-entity', {
      name: 'my-api',
      kind: 'API',
    });
    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(output).toContain('openapi: 3.0.0');
  });

  it('outputs structured JSON when --output json', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { name: 'my-api', output: 'json' },
    });
    mockExecute.mockResolvedValue({
      kind: 'API',
      spec: { type: 'graphql', definition: 'type Query { hello: String }' },
    });

    await apiGetSpec(ctx(['--name', 'my-api', '--output', 'json']));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    const parsed = JSON.parse(output);
    expect(parsed.name).toBe('my-api');
    expect(parsed.type).toBe('graphql');
    expect(parsed.definition).toBe('type Query { hello: String }');
  });

  it('throws when entity has no spec.definition', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { name: 'no-spec' } });
    mockExecute.mockResolvedValue({
      kind: 'API',
      spec: { type: 'openapi' },
    });

    await expect(apiGetSpec(ctx(['--name', 'no-spec']))).rejects.toThrow(
      'has no spec.definition',
    );
  });
});
