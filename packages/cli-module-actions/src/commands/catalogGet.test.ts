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

import catalogGet from './catalogGet';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;

const ctx = (args: string[]): CliCommandContext =>
  ({
    args,
    info: { name: 'catalog get', usage: 'backstage-cli catalog get' },
  } as unknown as CliCommandContext);

describe('catalog get', () => {
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

    await expect(catalogGet(ctx([]))).rejects.toThrow('--name is required');
  });

  it('calls get-catalog-entity with name only', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { name: 'my-svc' } });
    mockExecute.mockResolvedValue({
      kind: 'Component',
      metadata: { name: 'my-svc' },
    });

    await catalogGet(ctx(['--name', 'my-svc']));

    expect(mockExecute).toHaveBeenCalledWith('catalog:get-catalog-entity', {
      name: 'my-svc',
    });
  });

  it('passes kind and namespace when provided', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { name: 'my-svc', kind: 'Component', namespace: 'prod' },
    });
    mockExecute.mockResolvedValue({});

    await catalogGet(
      ctx(['--name', 'my-svc', '--kind', 'Component', '--namespace', 'prod']),
    );

    expect(mockExecute).toHaveBeenCalledWith('catalog:get-catalog-entity', {
      name: 'my-svc',
      kind: 'Component',
      namespace: 'prod',
    });
  });

  it('outputs entity as JSON', async () => {
    const entity = {
      kind: 'Component',
      metadata: { name: 'foo' },
      spec: { type: 'service' },
    };
    (mockCli as jest.Mock).mockReturnValue({ flags: { name: 'foo' } });
    mockExecute.mockResolvedValue(entity);

    await catalogGet(ctx(['--name', 'foo']));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(JSON.parse(output)).toEqual(entity);
  });
});
