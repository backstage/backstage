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

  it('queries the catalog by name only', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { ref: 'my-svc' },
    });
    mockQueryEntities.mockResolvedValue({
      items: [{ kind: 'Component', metadata: { name: 'my-svc' } }],
    });

    await catalogGet(ctx(['my-svc']));

    expect(mockQueryEntities).toHaveBeenCalledWith(
      { query: { 'metadata.name': 'my-svc' } },
      { token: 'tok' },
    );
  });

  it('accepts a positional full entity reference', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { ref: 'component:prod/my-svc' },
    });
    mockQueryEntities.mockResolvedValue({
      items: [
        {
          kind: 'Component',
          metadata: { name: 'my-svc', namespace: 'prod' },
        },
      ],
    });

    await catalogGet(ctx(['component:prod/my-svc']));

    expect(mockQueryEntities).toHaveBeenCalledWith(
      {
        query: {
          'metadata.name': 'my-svc',
          kind: 'component',
          'metadata.namespace': 'prod',
        },
      },
      { token: 'tok' },
    );
  });

  it('rejects an empty positional entity reference', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { ref: '   ' },
    });

    await expect(catalogGet(ctx(['   ']))).rejects.toThrow(
      'Entity reference cannot be empty',
    );
  });

  it('uses --kind and --namespace as defaults for a short reference', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { kind: 'Component', namespace: 'prod' },
      _: { ref: 'my-svc' },
    });
    mockQueryEntities.mockResolvedValue({
      items: [{ kind: 'Component', metadata: { name: 'my-svc' } }],
    });

    await catalogGet(
      ctx(['my-svc', '--kind', 'Component', '--namespace', 'prod']),
    );

    expect(mockQueryEntities).toHaveBeenCalledWith(
      {
        query: {
          'metadata.name': 'my-svc',
          kind: 'Component',
          'metadata.namespace': 'prod',
        },
      },
      { token: 'tok' },
    );
  });

  it('rejects --kind and --namespace that conflict with the reference', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { kind: 'API' },
      _: { ref: 'component:my-svc' },
    });
    await expect(
      catalogGet(ctx(['component:my-svc', '--kind', 'API'])),
    ).rejects.toThrow('--kind API conflicts with the kind "component"');

    (mockCli as jest.Mock).mockReturnValue({
      flags: { namespace: 'dev' },
      _: { ref: 'prod/my-svc' },
    });
    await expect(
      catalogGet(ctx(['prod/my-svc', '--namespace', 'dev'])),
    ).rejects.toThrow('--namespace dev conflicts with the namespace "prod"');
    expect(mockQueryEntities).not.toHaveBeenCalled();
  });

  it('requires a reference and rejects unknown flags', async () => {
    const actual = jest.requireActual('cleye');
    (mockCli as jest.Mock)
      .mockImplementationOnce(actual.cli)
      .mockImplementationOnce(actual.cli);
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit');
    });
    const stderrSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await expect(catalogGet(ctx(['my-svc', '--name', 'x']))).rejects.toThrow(
        'exit',
      );
      await expect(catalogGet(ctx([]))).rejects.toThrow('exit');
      expect(mockQueryEntities).not.toHaveBeenCalled();
    } finally {
      logSpy.mockRestore();
      exitSpy.mockRestore();
      stderrSpy.mockRestore();
    }
  });

  it('outputs entity as JSON', async () => {
    const entity = {
      kind: 'Component',
      metadata: { name: 'foo' },
      spec: { type: 'service' },
    };
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { ref: 'foo' },
    });
    mockQueryEntities.mockResolvedValue({ items: [entity] });

    await catalogGet(ctx(['foo']));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(JSON.parse(output)).toEqual(entity);
  });

  it('throws when no entity is found', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { ref: 'missing' },
    });
    mockQueryEntities.mockResolvedValue({ items: [] });

    await expect(catalogGet(ctx(['missing']))).rejects.toThrow(
      'No entity found with name "missing"',
    );
  });

  it('throws when multiple entities are found', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { ref: 'dup' },
    });
    mockQueryEntities.mockResolvedValue({
      items: [
        { kind: 'Component', metadata: { name: 'dup', namespace: 'default' } },
        { kind: 'API', metadata: { name: 'dup', namespace: 'default' } },
      ],
    });

    await expect(catalogGet(ctx(['dup']))).rejects.toThrow(
      'Multiple entities found with name "dup"',
    );
  });
});
